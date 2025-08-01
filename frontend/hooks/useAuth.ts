import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/axios";
import { User, Subscription } from "@/types/auth";
import { Plan } from "@/types";

export const useUser = () => {
    return useQuery({
        queryKey: ["user"],
        queryFn: async () => {
            const response = await apiClient.get<User>("/user");
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    });
};

export const useUserPlan = () => {
    return useQuery({
        queryKey: ['user-plan'],
        queryFn: async () => {
            const response = await apiClient.get<Plan>("/user/current-plan");
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    });
};

export const useUserSubscription = () => {
    return useQuery({
        queryKey: ['user-subscription'],
        queryFn: async () => {
            const response = await apiClient.get<Subscription>("/user/active-subscription");
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    });
};

export const useAvailablePlans = () => {
    return useQuery({
        queryKey: ['available-plans'],
        queryFn: async () => {
            const response = await apiClient.get<Plan[]>("/plans");
            return response.data;
        },
        staleTime: 1000 * 60 * 5, // 5 minutes
        retry: 1,
    });
};

//Combined huuk for complete user subscription data
export const useUserSubscriptionData = () => {
    const userQuery = useUser();
    const planQuery = useUserPlan();
    const subscriptionQuery = useUserSubscription();

    return {
        user: userQuery.data,
        plan: planQuery.data,
        subscription: subscriptionQuery.data,
        isLoading: userQuery.isLoading || planQuery.isLoading || subscriptionQuery.isLoading,
        isError: userQuery.isError || planQuery.isError || subscriptionQuery.isError,
        error: userQuery.error || planQuery.error || subscriptionQuery.error,
        refetch: () => {
            userQuery.refetch();
            planQuery.refetch();
            subscriptionQuery.refetch();
        }
    };
};