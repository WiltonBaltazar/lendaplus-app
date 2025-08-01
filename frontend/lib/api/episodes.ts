import axiosClient from "../axios-client";

export const episodesApi = {
    //Get all episodes with pagination
   getEpisodes: async (page: number = 1) => {
    const response = await axiosClient.get(`/episodes?page=${page}`);
    return response.data; 
   },

   //Get single episode by slug
    getEpisodeBySlug: async (slug: string) => {
     const response = await axiosClient.get(`/episodes/${slug}`);
     return response.data;
    },

};