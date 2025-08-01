import { useInfiniteQuery, useQuery } from "@tanstack/react-query"; // Add this import
import { episodesApi } from "@/lib/api/episodes";

//Hook for fetching paginated episodes
export const useEpisodes = (page: number = 1) => {
    return useQuery({
        queryKey: ["episodes", page],
        queryFn: () => episodesApi.getEpisodes(page),
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 3,
    });
}

//Hook infinite scroll for episodes
export const useInfiniteEpisodes = () => {
  return useInfiniteQuery({
    queryKey: ['episodes', 'infinite'],
    queryFn: ({ pageParam }) => episodesApi.getEpisodes(pageParam),
    initialPageParam: 1, // Add this required property
    getNextPageParam: (lastPage) => {
      const { current_page, last_page } = lastPage.meta;
      return current_page < last_page ? current_page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000,
  });
};

//Hook for fetching single episode by slug
export const useEpisode = (slug: string) => {
    return useQuery({
        queryKey: ["episode", slug],
        queryFn: () => episodesApi.getEpisodeBySlug(slug),
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 3,
        // enabled: !!slug, // Only run query if slug is defined
    });
}