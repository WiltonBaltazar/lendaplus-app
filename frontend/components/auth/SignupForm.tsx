"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createUserWithSubscription, fetchPlanBySlug } from "@/lib/api/plans";
import { Plan } from "@/types";

// type RegisterFormData = {
//     first_name: string;
//     last_name: string;
//     email: string;
//     password: string;
//     password_confirmation: string;
// }

interface ApiError {
    response?: {
        data?: {
            message?: string;
            errors?: Record<string, string[]>; // Add this line
        };
    };
}

// Define your API client for Next.js
const signupSchema = z.object({
    first_name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
    last_name: z.string().min(2, 'Sobrenome deve ter pelo menos 2 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
    password_confirmation: z.string(),
}).refine((data) => data.password === data.password_confirmation, {
    message: "As senhas não coincidem",
    path: ["password_confirmation"],
});

type SignupFormData = z.infer<typeof signupSchema>;

const SignupForm = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const planSlug = searchParams.get('plan');

    const [error, setError] = useState('');
    // const { register: registerUser } = useAuth();

    const { data: plan, isLoading: planLoading } = useQuery<Plan>({
        queryKey: ['plan', planSlug],
        queryFn: () => fetchPlanBySlug(planSlug!),
        enabled: !!planSlug,
    });


    const className = 'bg-gray-300 px-4 py-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500';

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
    });

    const createUserMutation = useMutation({
        mutationFn: createUserWithSubscription,
        onSuccess: () => {
            router.push('/signup/success');
        },
        onError: (err: unknown) => {
            // Handle error from API
             const error = err as ApiError;
            console.error('Signup error:', error);
            if (error.response?.data?.message) {
                setError(error.response.data.message);
            } else if (error.response?.data?.errors) {
                // Handle validation errors
                const validationErrors = Object.values(error.response.data.errors).flat();
                setError(validationErrors.join(', '));
            } else {
                setError('Erro ao criar conta. Tente novamente.');
            }
        },
    });

    const onSubmit = (data: SignupFormData) => {
        if (!plan) {
            setError('Plano não encontrado');
            return;
        }

        const submitData = {
            ...data,
            plan_id: plan.id,
        };

        console.log('Submitting data:', submitData); // Debug log
        createUserMutation.mutate(submitData);
    };

    if (planLoading) return <div>Loading...</div>;
    if (!plan) return <div>Plano não encontrado</div>;
    console.log(plan);

    return (
        <div className="flex flex-col gap-4 w-full">
            <div>
                <h1 className="font-medium text-2xl">Criar conta</h1>
                <div className="mt-2 py-4">
                    <h3 className="font-semibold">Plano Selecionado: {plan.name}</h3>
                    <p className="text-2xl font-bold text-lendagreen">
                        {plan.formatted_price}/ano
                    </p>
                </div>
            </div>
            <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                        {error}
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col space-y-2 mt-4">
                        <label htmlFor="first_name" className="text-sm font-medium text-gray-700">Nome</label>
                        <input
                            type="text"
                            placeholder="Nome"
                            className={className}
                            {...register('first_name')}
                        />
                        {errors.first_name && (
                            <div className="text-red-500 text-sm mt-1">
                                {errors.first_name.message}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col space-y-2 mt-4">
                        <label htmlFor="last_name" className="text-sm font-medium text-gray-700">Sobrenome</label>
                        <input
                            type="text"
                            placeholder="Sobrenome"
                            className={className}
                            {...register('last_name')}
                        />
                        {errors.last_name && (
                            <div className="text-red-500 text-sm mt-1">
                                {errors.last_name.message}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex flex-col space-y-2 mt-4">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
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
                    <label className="text-sm font-medium text-gray-700">Senha</label>
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
                    <label htmlFor="password_confirmation" className="text-sm font-medium text-gray-700">Confirmar senha</label>
                    <input
                        type="password"
                        placeholder="Confirmar senha"
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
                        disabled={createUserMutation.isPending}
                        type="submit"
                        className="px-4 py-3 bg-black text-white rounded-full font-semibold text-sm transition duration-200 w-full focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {createUserMutation.isPending ? "Criando conta..." : "Criar Conta"}
                    </button>
                    {createUserMutation.isError && (
                        <p className="text-red-500 text-sm text-center">Erro ao criar conta. Tente novamente</p>
                    )}
                </div>


            </form>
            <p className="text-center mt-4">
                Já tem uma conta?{" "}
                <Link href="/login" className="underline text-lendapurple hover:text-purple-600">
                    Entrar agora
                </Link>
            </p>
        </div>
    );
};

export default SignupForm;