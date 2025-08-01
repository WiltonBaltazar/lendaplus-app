'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  // Set client-side flag and handle potential redirect
  useEffect(() => {
    setIsClient(true);
    if (!loading && !user) {
      // Optional: Add redirect logic here if needed
      // router.push('/login');
    }
  }, [user, loading, router]);

  // Show loading spinner during initial load
  if (!isClient || loading) {
    return (
      <div className="flex justify-center p-4">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // Show login prompt card when unauthenticated
  if (!user) {
    return (
      <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-md border border-gray-200">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">
            Please sign in to access this content
          </p>
          <Button
            onClick={() => router.push('/login')}
            className="bg-lendablack hover:bg-lendapurple transition duration-200"
          >
            Go to Login Page
          </Button>
        </div>
      </div>
    );
  }

  // Show protected content when authenticated
  return <>{children}</>;
}