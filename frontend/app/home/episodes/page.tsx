'use client'

import Link from 'next/link';
import Image from 'next/image';
import { useInfiniteEpisodes } from '@/hooks/useEpisodes';
import { Episode } from '@/types';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

// Separate the episodes content into its own component
function EpisodesContent() {
  const {
    data,
    error,
    isLoading,
    isError,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteEpisodes();

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading episodes...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Error loading episodes: {error?.message}
        </div>
      </div>
    );
  }

  // Flatten the pages to get all episodes
  const episodes = data?.pages.flatMap((page: any) => page.episodes) || [];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">All Episodes</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {episodes.map((episode: Episode) => (
          <Link
            key={episode.slug}
            href={`/app/episodes/${episode.slug}`}
            className="block"
          >
            <div className="rounded-lg hover:bg-gray-100 transition">
              <Image
                src={episode.cover_image}
                width={500}
                height={500}
                alt={episode.title}
                className="w-full h-[200px] object-cover rounded-md"
              />
              <div className="p-3">
                <p className="text-xs font-semibold">{episode.title}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {hasNextPage && (
        <div className="text-center mt-8">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isFetchingNextPage ? 'Loading more...' : 'Load More Episodes'}
          </button>
        </div>
      )}
    </div>
  );
}

// Main component that provides the QueryClient
export default function EpisodesPage() {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <EpisodesContent />
    </QueryClientProvider>
  );
}