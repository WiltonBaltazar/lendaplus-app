'use client';

import Link from 'next/link';
import { episodesApi } from '@/lib/api/episodes';
import { Episode } from '@/types';

import { useQuery } from '@tanstack/react-query';

const EpisodesContent = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: ['episodes'],
        queryFn: () => episodesApi.getEpisodes(1),
    });
    
    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading episodes</div>;

    return (
        <>
            {data?.data.map((episode: Episode) => (
                <div key={episode.slug}>
                    <Link href={`episodes/${episode?.slug}`}>
                        <h2>{episode.title}</h2>
                    </Link>
                </div>
            ))}
        </>
    );

}

export default EpisodesContent;