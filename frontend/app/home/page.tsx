'use client'
import LatestEpisodeCard from '@/components/app/podcast/LatestPodcast';
import PodcastSlider from '@/components/app/podcast/PodcastSlider';
import Dashboard from '@/components/Dashboard';
import ProtectedRoute from '@/components/ProtectedRoute';
import UserVerification from '@/components/ui/userverification';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function DashboardPage() {

  return (
    <QueryClientProvider client={queryClient}>
      <UserVerification/>
      <Dashboard />
      <LatestEpisodeCard />
      <ProtectedRoute>
        <PodcastSlider />
      </ProtectedRoute>
    </QueryClientProvider>
  );
}