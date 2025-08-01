'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { forgotPasswordSchema } from '@/lib/validators';
import { authAPI } from '@/lib/api';
import Link from 'next/link';

type ForgotPasswordFormData = {
    email: string;
};

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}


const ForgotPasswordForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const className = 'bg-gray-300 px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(forgotPasswordSchema),
    });


    const onSubmit = async (data: ForgotPasswordFormData) => {
        setIsLoading(true);
        setError('');
        setSuccess(false);

        try {
            await authAPI.forgotPassword(data.email);
            setSuccess(true);
        } catch (err: unknown) {
            const error = err as ApiError;
            setError(error.response?.data?.message || 'Failed to send reset link');
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
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Verifica o seu email</h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Verifique o seu e-mail — enviámos um link para criar uma nova palavra-passe.
                        </p>
                        <div className="mt-6">
                            <Link
                                href="/login"
                                className=" underline font-medium hover:text-lendapurple"
                            >
                               Voltar para páginas de login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <h1 className="font-medium text-2xl">Recuperar Palavra-Passe</h1>
            <p className='mt-2 text-sm text-gray-600'>Receberá um e-mail com um link para criar uma nova palavra-passe.</p>
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <div className="flex flex-col space-y-2 mt-4">
                    <label htmlFor='email' className="text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        placeholder="Email"
                        className={className}
                        {...register('email')}
                    />
                    {errors.email && (
                        <div className="text-red-500 text-sm mt-1">
                            {errors.email.message}
                        </div>
                    )}
                </div>

                <div className="mt-10">
                    <button
                        disabled={isLoading}
                        type="submit"
                        className="px-4 py-3 bg-black text-white rounded-full font-semibold text-sm transition duration-200 w-full focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Sending in..." : "Send Reset Link"}
                    </button>
                </div>

                <p className="text-center mt-4">
                    <Link href="/login" className="underline text-black hover:text-lendapurple">
                        Voltar para página de login
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default ForgotPasswordForm;