'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { useEpisode } from '@/hooks/useEpisodes';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { Button } from '@/components/ui/button';
import { formatDate, getTimeAgo } from '@/lib/utils';
import Link from 'next/link';
import { Episode } from '@/types';

export default function EpisodePage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data, isLoading, isError, error } = useEpisode(slug);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading episode...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-600">
          Error loading episode: {error?.message}
        </div>
      </div>
    );
  }

  if (!data?.success || !data?.episode) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Episode not found</div>
      </div>
    );
  }

  const episode = data.episode;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Button onClick={() => router.back()}>
            ← Voltar
          </Button>
          <p className="text-gray-500">{data.podcast_name}</p>
        </div>

        <div className="mb-5">
          <h1 className="font-bold text-3xl">{episode.title}</h1>
          {episode.guest && (
            <p className="text-gray-600">Com {episode.guest}</p>
          )}
        </div>

        <div className="bg-white rounded-lg overflow-hidden">
          {episode.cover_image && (
            <div className="relative h-64 md:h-96">
              <Image
                src={episode.cover_image}
                alt={episode.title}
                fill
                className="object-cover shadow-md"
                priority
              />
            </div>
          )}
          {episode.audio_file && (
            <div className="mb-3">
              <AudioPlayer
                progressJumpSteps={{ forward: 30000, backward: 30000 }}
                src={episode.audio_file}
              />
            </div>
          )}

          <div className="py-6 md:py-8">
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-6">
              <span>Publicado em: {new Date(episode.release_date).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
              <span>{formatDate(episode.release_date)}</span>
              {episode.duration && <span>{episode.duration}</span>}
            </div>
            <div className="text-xs text-gray-400 mb-3">
              Lançado há {getTimeAgo(episode.release_date)}
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{episode.description}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="font-semibold mb-5">Mais Episódios</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {data.otherEpisodes?.map((episode: Episode) => (
              <Link 
                key={episode.slug} 
                href={`/app/episodes/${episode.slug}`}
                className="block"
              >
                <div className="rounded-lg hover:bg-gray-100 transition">
                  <Image 
                    src={episode.cover_image} 
                    alt={episode.title} 
                    className="w-full md:h-32 object-cover rounded-md"
                    width={500} 
                    height={500}
                  />
                  <div className="p-3">
                    <p className="text-xs font-semibold">{episode.title}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}