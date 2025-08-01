'use client'

import React, { Suspense } from 'react';
import { useQuery } from '@tanstack/react-query';
import LatestPodcastSkeleton from '@/components/skeletons/latestpodcast';
import { fetchLatestEpisode } from '@/lib/utils';
import PodcastCard from './PodcastCard';

// // Types for the episode data



const LatestEpisodeCard = () => {
    const { data: episode, isLoading, isError } = useQuery({
        queryKey: ["episode"],
        queryFn: () => fetchLatestEpisode(),
        staleTime: Infinity,
    });

    if (isLoading) {
        return (
            <Suspense >
                <LatestPodcastSkeleton />
            </Suspense>
        )
    }

    if (isError) {
        return <div>Ocorreu um erro ao carregar os episódios.</div>;
    }


    return (
        <PodcastCard episode={episode} />
    );
};

export default LatestEpisodeCard;