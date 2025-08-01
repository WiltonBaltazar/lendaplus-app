'use client'
// import LatestPodcastSkeleton from '@/components/skeletons/latestpodcast';
import useFetchData from '@/hooks/useFecthData';
import { Episode } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';


const splideOptions = {
    width: '100%', // Slider width
    perPage: 3, // Default number of slides per page
    gap: '1rem',
    type: 'slide',
    breakpoints: {
        1200: {
            perPage: 3,
            gap: '1rem',
        },
        768: {
            perPage: 2,
            gap: '.7rem',
        },
        480: {
            perPage: 2,
            gap: '.7rem',
        },
    },
    // Other options
    pagination: true,
    arrows: true,
};

function PodcastSlider() {

    const { data: episodes, isLoading, error, refetch, isRefetching } = useFetchData(`/episodes-slider`);

    if (isLoading) {
        return (
            <Suspense >
                <Skeleton className='w-full h-[220px] rounded-xl' />
            </Suspense>
        )
    }

    if (error) {
        return (
             <div className="bg-white rounded-lg shadow-md p-6">
            <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                    Failed to load the latest episode. {error.message}
                </AlertDescription>
            </Alert>
            <Button
                onClick={() => refetch()}
                className="flex items-center justify-center w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isRefetching}
            >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefetching ? 'animate-spin' : ''}`} />
                {isRefetching ? 'Retrying...' : 'Try Again'}
            </Button>
        </div>
        )
    }

    const adjustedSplideOptions = {
        ...splideOptions,
        perPage: Math.min(splideOptions.perPage, episodes.length),
    };
    return (
        <Splide aria-label="Episodes" options={adjustedSplideOptions}>
            {episodes.map((episode: Episode) => {
                return (
                    <SplideSlide key={episode.slug}>
                        <Link href={`/app/episodes/${episode.slug}`}>
                            <Image
                                src={episode.cover_image}
                                width={500}
                                height={500}
                                alt={episode.title}
                                className="w-full h-[149px] max-w-[220px] object-cover rounded"
                            />
                        </Link>
                    </SplideSlide>
                );
            })}
        </Splide>
    )
}

export default PodcastSlider;