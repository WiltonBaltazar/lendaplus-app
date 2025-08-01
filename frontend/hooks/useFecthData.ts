import { useQuery } from "@tanstack/react-query";
import axiosClient from '@/lib/axios-client';

interface FetchDataOptions {
  requiresAuth?: boolean;
  slug?: string;
}

const api = axiosClient;

const API_URL = process.env.NEXT_PUBLIC_LARAVEL_API_URL || 'http://localhost:8000/api/v1';

const fetchData = async (url: string, requiresAuth: boolean = false) => {
  const token = localStorage.getItem('token'); // Or however you store your auth token
  
  const headers: Record<string, string> = {};
  if (requiresAuth && token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const { data: response } = await api.get(url, { headers });
  return response.data !== undefined ? response.data : response;
};

const useFetchData = (endpoint: string, options: FetchDataOptions = {}) => {
  const { requiresAuth = false, slug } = options;
  const baseUrl = API_URL;
  const url = slug ? `${baseUrl}${endpoint}/${slug}` : `${baseUrl}${endpoint}`;

  return useQuery({
    queryKey: [endpoint, slug],
    queryFn: () => fetchData(url, requiresAuth),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export default useFetchData;