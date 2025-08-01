<?php
// File: app/Services/MpesaPaymentGatewayService.php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Subscription;

class MpesaPaymentGatewayService
{
    protected $baseUrl;
    protected $apiKey;
    protected $apiSecret;
    protected $shortcode;
    
    public function __construct()
    {
        $this->baseUrl = config('services.paysuite.base_url', 'https://paysuite.tech/api/v1');
        $this->apiKey = config('services.paysuite.api_key');
        $this->apiSecret = config('services.paysuite.api_secret');
        $this->shortcode = config('services.paysuite.shortcode');
    }
    
    /**
     * Initialize M-Pesa STK Push payment
     * 
     * @param array $data
     * @return array
     */
    public function createPayment(array $data)
    {
        try {
            $amount = $data['amount'];
            $phone = $data['phone']; // Customer's phone number (format: 254XXXXXXXXX)
            $userId = $data['user_id'];
            $planId = $data['plan_id'];
            
            // Generate a unique reference
            $reference = 'SUB_' . time() . '_' . $userId . '_' . $planId;
            
            // Create the request to PaySuite M-Pesa API
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '/mpesa/stkpush', [
                'phone' => $phone,
                'amount' => $amount,
                'reference' => $reference,
                'description' => 'Subscription payment for plan #' . $planId,
                'callback_url' => route('payment.webhook'),
                'shortcode' => $this->shortcode
            ]);
            
            $responseData = $response->json();
            
            // Log the response for debugging
            Log::info('PaySuite STK Push Response', $responseData);
            
            if ($response->successful() && isset($responseData['status']) && $responseData['status'] === 'success') {
                return [
                    'success' => true,
                    'payment_reference' => $reference,
                    'checkout_request_id' => $responseData['data']['CheckoutRequestID'] ?? null,
                    'message' => $responseData['message'] ?? 'Payment initiated successfully'
                ];
            } else {
                Log::error('PaySuite STK Push Failed', $responseData);
                return [
                    'success' => false,
                    'message' => $responseData['message'] ?? 'Payment initiation failed',
                    'error' => $responseData['error'] ?? 'Unknown error'
                ];
            }
        } catch (\Exception $e) {
            Log::error('PaySuite STK Push Exception', ['error' => $e->getMessage()]);
            return [
                'success' => false,
                'message' => 'Payment processing error',
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Query payment status
     * 
     * @param string $reference
     * @return array
     */
    public function checkPaymentStatus(string $reference)
    {
        try {
            $response = Http::withHeaders([
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ])->get($this->baseUrl . '/mpesa/status', [
                'reference' => $reference
            ]);
            
            $responseData = $response->json();
            
            Log::info('PaySuite Status Check Response', $responseData);
            
            if ($response->successful() && isset($responseData['status']) && $responseData['status'] === 'success') {
                $mpesaStatus = $responseData['data']['ResultCode'] ?? null;
                
                // If result code is 0, payment was successful
                $paymentSuccessful = ($mpesaStatus === '0' || $mpesaStatus === 0);
                
                return [
                    'success' => true,
                    'payment_status' => $paymentSuccessful ? 'completed' : 'pending',
                    'reference' => $reference,
                    'raw_status' => $responseData['data'] ?? []
                ];
            } else {
                return [
                    'success' => false,
                    'message' => $responseData['message'] ?? 'Payment status check failed',
                    'error' => $responseData['error'] ?? 'Unknown error'
                ];
            }
        } catch (\Exception $e) {
            Log::error('PaySuite Status Check Exception', ['error' => $e->getMessage()]);
            return [
                'success' => false,
                'message' => 'Payment status check error',
                'error' => $e->getMessage()
            ];
        }
    }
    
    /**
     * Handle the webhook from PaySuite
     * 
     * @param array $payload
     * @return bool
     */
    public function handleWebhook(array $payload)
    {
        Log::info('PaySuite Webhook Received', $payload);
        
        try {
            // Extract data from the webhook payload
            $reference = $payload['reference'] ?? null;
            $resultCode = $payload['ResultCode'] ?? null;
            
            if (!$reference) {
                Log::error('PaySuite Webhook: No reference found in payload');
                return false;
            }
            
            // Find the subscription by payment reference
            $subscription = Subscription::where('payment_reference', $reference)->first();
            
            if (!$subscription) {
                Log::error('PaySuite Webhook: No subscription found for reference: ' . $reference);
                return false;
            }
            
            // Check if payment was successful (ResultCode 0 indicates success)
            $isSuccessful = ($resultCode === '0' || $resultCode === 0);
            
            if ($isSuccessful) {
                // Update subscription to active
                $subscription->update([
                    'status' => 'active',
                    'start_date' => now(),
                    'end_date' => now()->addMonth() // Assuming monthly subscription
                ]);
                
                Log::info('Subscription activated', ['subscription_id' => $subscription->id]);
                return true;
            } else {
                // Payment failed
                $subscription->update([
                    'status' => 'failed'
                ]);
                
                Log::info('Payment failed', [
                    'subscription_id' => $subscription->id, 
                    'result_code' => $resultCode
                ]);
                return false;
            }
        } catch (\Exception $e) {
            Log::error('PaySuite Webhook Exception', ['error' => $e->getMessage()]);
            return false;
        }
    }
}