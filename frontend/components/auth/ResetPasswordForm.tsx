'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { resetPasswordSchema } from '@/lib/validators';
import { authAPI } from '@/lib/api';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

type ResetPasswordFormData = {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
};

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}


const ResetPasswordForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const className = 'bg-gray-300 px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

    // Get token and email from URL parameters
    const token = searchParams.get('token') || '';
    const email = searchParams.get('email') || '';

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ResetPasswordFormData>({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            token,
            email,
        },
    });


    const onSubmit = async (data: ResetPasswordFormData) => {
        setIsLoading(true);
        setError('');

        try {
            await authAPI.resetPassword(data);
            setSuccess(true);
            setTimeout(() => {
                router.push('/login');
            }, 3000);
        } catch (err: unknown) {
            const error = err as ApiError;
            setError(error.response?.data?.message || 'Failed to reset password');
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Password Reset Successful</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Your password has been successfully reset. You will be redirected to the login page in a few seconds.
                        </p>
                        <div className="mt-6">
                            <Link
                                href="/login"
                                className="font-medium text-indigo-600 hover:text-indigo-500"
                            >
                                Go to login now
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }


    return (
        <div className="flex flex-col gap-4 w-full">
            <h1 className="font-medium text-2xl">Redefinir senha</h1>
            <p className="mt-2 text-center text-sm text-gray-600">
                Enter your new password below.
            </p>
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                {/* Hidden fields for token and email */}
                <input {...register('token')} type="hidden" />
                <input {...register('email')} type="hidden" />

                <div className="flex flex-col space-y-2 mt-4">
                    <label htmlFor='password' className="text-sm font-medium text-gray-700">Senha</label>
                    <input
                        type="password"
                        placeholder="Senha"
                        className={className}
                        {...register('password')}
                    />
                    {errors.password && (
                        <div className="text-red-500 text-sm mt-1">
                            {errors.password.message}
                        </div>
                    )}
                </div>

                <div className="flex flex-col space-y-2 mt-4">
                    <label htmlFor='password_confirmation' className="text-sm font-medium text-gray-700">Confirmar senha</label>
                    <input
                        type="password"
                        placeholder="Confirmar Senha"
                        className={className}
                        {...register('password_confirmation')}
                    />
                    {errors.password_confirmation && (
                        <div className="text-red-500 text-sm mt-1">
                            {errors.password_confirmation.message}
                        </div>
                    )}
                </div>

                <div className="mt-10">
                    <button
                        disabled={isLoading}
                        type="submit"
                        className="px-4 py-3 bg-black text-white rounded-full font-semibold text-sm transition duration-200 w-full focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Resetting..." : "Reset Password"}
                    </button>
                </div>

                <p className="text-center mt-4">
                    <Link href="/login" className="underline text-lendapurple hover:text-indigo-600">
                       Voltar para página do login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default ResetPasswordForm;