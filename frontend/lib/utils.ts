import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import axiosClient from "./axios-client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const api = axiosClient;

const fetchEpisodes = async () => {
  const { data } = await api.get('/podcasts'); // Atualize com sua URL
  return data.data[0].episodes;
};

//fetch letest episode

const fetchLatestEpisode = async () => {
  // await new Promise((resolve) => setTimeout(resolve, 4000));
  const { data } = await api.get('/latest-episode'); // Atualize com sua URL
  return data.data[0];
};

const fetchEpisode = async (episodeId: number) => {
  const {data} = await api.get(`/episodes/${episodeId}`);
  return data.data; // Assuming the API returns { data: { ...episodeData } }
};

export const formatDate = (dateString: string | number | Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

export const formatDateTime = (dateString: string | number |Date) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const getTimeAgo = (dateString: string | number | Date) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const intervals = [
    { label: 'Ano', seconds: 31536000 },
    { label: 'Mes', seconds: 2592000 },
    { label: 'Semana', seconds: 604800 },
    { label: 'dia', seconds: 86400 },
    { label: 'hora', seconds: 3600 },
    { label: 'minuto', seconds: 60 }
  ];

  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} atrás`;
    }
  }

  return 'Just now';
};




export { fetchEpisodes, fetchLatestEpisode, fetchEpisode };


