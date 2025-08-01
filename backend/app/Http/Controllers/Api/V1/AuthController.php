<?php

namespace App\Http\Controllers\Api\V1;

use Log;
use Carbon\Carbon;
use App\Models\Plan;
use App\Models\User;
use App\Models\Subscription;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Http\Requests\LoginRequest;
use App\Http\Controllers\Controller;
use App\Http\Requests\SignupRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Auth\Events\Registered;
use Illuminate\Support\Facades\Password;
use App\Http\Requests\ForgotPasswordRequest;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function signup(SignupRequest $request): JsonResponse
    {


        $plan = Plan::findOrFail($request->plan_id);

        try {
            $user = User::create([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            // Check if the user already has an active subscription
            if ($user->subscriptions()->where('status', 'active')->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You already have an active subscription.',
                ], 400);
            }
            // If the user does not have an active subscription, create a new one
            // Ensure the plan is valid and exists
            if (!$plan) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid plan selected.',
                ], 400);
            }
            // Check if the plan is valid
            if (!$plan->isValid()) {
                return response()->json([
                    'success' => false,
                    'message' => 'The selected plan is not valid.',
                ], 400);
            }
            // Check if the user already has a subscription
            if ($user->subscriptions()->where('plan_id', $plan->id)->exists()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You already have a subscription for this plan.',
                ], 400);
            }

            $startDate = Carbon::now();
            $endDate = $startDate->copy()->addYear(); // Yearly subscription

            //Create subscription
            Subscription::create([
                'user_id' => $user->id,
                'plan_id' => $plan->id,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'status' => 'pending', // Will be managed by admin
                'payment_status' => 'unpaid', // Admin will approve
            ]);



            // Trigger email verification
            event(new Registered($user));

            //Create authentication token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'success' => true,
                'message' => 'Registration successful. Please check your email and wait for admin approval.',
                'user' => [
                    'id' => $user->id,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'email' => $user->email,
                    'full_name' => $user->fullName,
                    'email_verified' => $user->hasVerifiedEmail(),
                ],
                'token' => $token,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Registration failed',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Authenticate user login
     * Validated credentials and returns authentication token
     * @param \App\Http\Requests\LoginRequest $request
     * @return JsonResponse|mixed
     */
    public function login(LoginRequest $request): JsonResponse
    {
        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid credentials',
            ], 401);
        }

        $user = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'success' => true,
            'message' => 'Login successful',
            'user' => [
                'id' => $user->id,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'full_name' => $user->fullName,
            ],
            'token' => $token,
        ], 200);
    }

    /**
     * Send password reset link
     * Generates and emails password reset token
     */

    public function forgotPassword(ForgotPasswordRequest $request): JsonResponse
    {

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'success' => true,
                'message' => 'Password reset link sent to your email address.'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to send password reset link. Please try again later.'
        ], 500);
    }

    /**
     * Reset user password
     * Validates reset token and update password
     */

    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:8',
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function (User $user, string $password) {
                $user->forceFill([
                    'password' => Hash::make($password)
                ]);
                $user->save();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'success' => true,
                'message' => 'Password reset successfully.'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid or expired rest token.'
        ], 400);
    }

    /**
     * Logout user
     * Revokes current authentication token
     * 
     * @param \Illuminate\Http\Request $request
     * @return JsonResponse|mixed
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully'
        ]);
    }

    public function user(Request $request): JsonResponse
    {
        return response()->json([
            'user' => $request->user(),
        ]);
    }

    /**
     * Get authenticated user profile
     * Returns current user data
     */
    public function profile(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'user' => [
                'id' => $request->user()->id,
                'first_name' => $request->user()->first_name,
                'last_name' => $request->user()->last_name,
                'email' => $request->user()->email,
                'full_name' => $request->user()->fullName,
            ]
        ]);
    }

    // Add these methods to your AuthController class

    /**
     * Verify email address
     */
    public function verifyEmail(Request $request): JsonResponse
    {
        $user = User::findOrFail($request->route('id'));

        if (!hash_equals((string) $request->route('hash'), sha1($user->getEmailForVerification()))) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid verification link.'
            ], 400);
        }

        if ($user->hasVerifiedEmail()) {
            return response()->json([
                'success' => true,
                'message' => 'Email already verified.'
            ]);
        }

        if ($user->markEmailAsVerified()) {
            return response()->json([
                'success' => true,
                'message' => 'Email verified successfully.'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Failed to verify email.'
        ], 500);
    }

    /**
     * Resend email verification notification
     */
    public function resendVerification(Request $request): JsonResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json([
                'success' => false,
                'message' => 'Email already verified.'
            ], 400);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json([
            'success' => true,
            'message' => 'Verification email sent.'
        ]);
    }

    /**
     * Check email verification status
     */
    public function checkVerificationStatus(Request $request): JsonResponse
    {
        return response()->json([
            'success' => true,
            'email_verified' => $request->user()->hasVerifiedEmail(),
            'email_verified_at' => $request->user()->email_verified_at
        ]);
    }
}
