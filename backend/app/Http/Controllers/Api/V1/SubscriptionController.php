<?php
// File: app/Http/Controllers/SubscriptionController.php

namespace App\Http\Controllers;

use App\Models\Plan;
use App\Models\Subscription;
use App\Services\MpesaPaymentGatewayService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SubscriptionController extends Controller
{
    protected $mpesaGateway;
    
    public function __construct(MpesaPaymentGatewayService $mpesaGateway)
    {
        $this->mpesaGateway = $mpesaGateway;
        $this->middleware('auth')->except(['handlePaymentWebhook']);
    }
    
    /**
     * Start the subscription process
     */
    public function subscribe(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:plans,id',
            'phone' => 'required|regex:/^254[0-9]{9}$/' // Validate M-Pesa phone format (254XXXXXXXXX)
        ]);
        
        $user = Auth::user();
        $plan = Plan::findOrFail($request->plan_id);
        
        // Check if user already has an active subscription
        $activeSubscription = $user->activeSubscription();
        if ($activeSubscription) {
            return response()->json([
                'message' => 'You already have an active subscription',
                'subscription' => $activeSubscription
            ], 400);
        }
        
        // Create a pending subscription
        $subscription = Subscription::create([
            'user_id' => $user->id,
            'plan_id' => $plan->id,
            'status' => 'pending',
        ]);
        
        // Create M-Pesa STK Push payment
        $paymentResponse = $this->mpesaGateway->createPayment([
            'amount' => $plan->price,
            'phone' => $request->phone,
            'user_id' => $user->id,
            'plan_id' => $plan->id
        ]);
        
        if (!$paymentResponse['success']) {
            $subscription->delete();
            return response()->json([
                'message' => 'Failed to initiate payment: ' . ($paymentResponse['message'] ?? 'Unknown error'),
                'error' => $paymentResponse['error'] ?? null
            ], 500);
        }
        
        // Update subscription with payment reference
        $subscription->update([
            'payment_reference' => $paymentResponse['payment_reference']
        ]);
        
        return response()->json([
            'message' => 'Payment initiated. Please check your phone to complete the M-Pesa payment.',
            'subscription' => $subscription,
            'payment_reference' => $paymentResponse['payment_reference']
        ]);
    }
    
    /**
     * Check payment status
     */
    public function checkPaymentStatus(Request $request)
    {
        $request->validate([
            'payment_reference' => 'required|string'
        ]);
        
        $reference = $request->payment_reference;
        
        // Find the subscription
        $subscription = Subscription::where('payment_reference', $reference)
            ->where('user_id', Auth::id())
            ->firstOrFail();
        
        // Already active? Return success
        if ($subscription->status === 'active') {
            return response()->json([
                'message' => 'Subscription is active',
                'status' => 'completed',
                'subscription' => $subscription
            ]);
        }
        
        // Check payment status with gateway
        $paymentStatus = $this->mpesaGateway->checkPaymentStatus($reference);
        
        if ($paymentStatus['success'] && $paymentStatus['payment_status'] === 'completed') {
            // Update subscription to active if not already
            if ($subscription->status !== 'active') {
                $subscription->update([
                    'status' => 'active',
                    'start_date' => now(),
                    'end_date' => now()->addMonth() // Assuming monthly subscription
                ]);
            }
            
            return response()->json([
                'message' => 'Payment successful',
                'status' => 'completed',
                'subscription' => $subscription
            ]);
        }
        
        return response()->json([
            'message' => 'Payment pending or failed',
            'status' => $paymentStatus['payment_status'] ?? 'unknown',
            'subscription' => $subscription
        ]);
    }
    
    /**
     * Handle webhook from PaySuite for M-Pesa payment
     * This endpoint should be exempt from CSRF protection
     */
    public function handlePaymentWebhook(Request $request)
    {
        Log::info('Payment webhook received', $request->all());
        
        $payload = $request->all();
        $processed = $this->mpesaGateway->handleWebhook($payload);
        
        if ($processed) {
            return response()->json(['status' => 'success']);
        } else {
            return response()->json(['status' => 'error'], 400);
        }
    }
    
    /**
     * Get user's current subscription
     */
    public function userSubscription()
    {
        $user = Auth::user();
        $subscription = $user->activeSubscription();
        
        if (!$subscription) {
            return response()->json([
                'message' => 'No active subscription',
                'has_subscription' => false
            ]);
        }
        
        return response()->json([
            'message' => 'Active subscription found',
            'has_subscription' => true,
            'subscription' => $subscription,
            'plan' => $subscription->plan
        ]);
    }
}