import { Plan } from "@/types";
import axiosClient from "../axios-client";

export interface CreateUserData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    plan_id: number;
}
export const fetchPlanBySlug = async (slug: string): Promise<Plan> => {
    const { data } = await axiosClient.get(`/plans/${slug}`);
    return data.data;
}

export const fetchPlans = async (): Promise<Plan[]> => {
    const response = await axiosClient.get('/plans');
    return response.data;
}

export const createUserWithSubscription = async (data: CreateUserData) => {
    console.log('Sending data:', data); // Debug log
    const response = await axiosClient.post('/signup', data);
    return response.data;
};