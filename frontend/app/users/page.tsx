'use client'

import axios from "axios";
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { User } from '@/types/auth';
import { useState } from 'react';

const fetchUsers = async (): Promise<User[]> => {
    const { data } = await axios.get('http://localhost:8000/api/v1/users', {
        withCredentials: true,
    });
    return data.data; // Return the actual user array
}

function UsersContent() {
    // Fixed query key and added types
    const { data, isLoading, error } = useQuery<User[], Error>({
        queryKey: ['users'], // Query key as array
        queryFn: fetchUsers
    });

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;

    return (
        <main className="flex flex-col items-center justify-center min-h-screen p-4">
            <h1 className="text-2xl font-bold mb-4">Users</h1>
            <ul className="list-disc">
                {data?.map((user: User) => ( // Fixed mapping
                    <li key={user.id}>
                        {user.first_name} - {user.email}
                    </li>
                ))}
            </ul>
        </main>
    );
}

export default function Home() {
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
            queries: {
                refetchOnWindowFocus: false,
            },
        },
    }));

    return (
        <QueryClientProvider client={queryClient}>
            <UsersContent />
        </QueryClientProvider>
    );
}