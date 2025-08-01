'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '@/lib/validators';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

type LoginFormData = {
    email: string;
    password: string;
};

interface ApiError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

const LoginForm = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth();
    const router = useRouter();

    const className = 'bg-gray-300 px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });


    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setError('');

        try {
            await login(data.email, data.password);
            router.push('/app'); // Redirect to the app/dashboard page
        } catch (err: unknown) {
            const error = err as ApiError;
            setError(error.response?.data?.message || 'An error occurred during login');
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex flex-col gap-4 w-full">
            <h1 className="font-medium text-2xl">Bem-vind@ à Arret</h1>
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
                <div className="flex items-center justify-between">
                    <Link
                        href="/forgot-password"
                        className="text-sm text-lendapurple hover:text-indigo-500"
                    >
                        Esqueceu a Senha?
                    </Link>
                </div>

                <div className="mt-10">
                    <button
                        disabled={isLoading}
                        type="submit"
                        className="px-4 py-3 bg-black text-white rounded-full font-semibold text-sm transition duration-200 w-full focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </div>

                <p className="text-center mt-4">
                    Não tem conta?{' '}
                    <Link href="/signup" className="underline text-lendapurple hover:text-indigo-600">
                        Criar agora
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default LoginForm;