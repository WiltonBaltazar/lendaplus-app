// contexts/SubscriptionContext.tsx
'use client';

import { createContext, useContext, ReactNode } from 'react';
import { useUserSubscriptionData } from '@/hooks/useAuth';
import { User, Subscription } from '@/types/auth';
import { Plan } from '@/types';

interface SubscriptionContextType {
  user: User | undefined;
  plan: Plan | undefined;
  subscription: Subscription | undefined;
  isLoading: boolean;
  isError: boolean;
  hasValidSubscription: boolean;
  canAccessFeature: (feature: string) => boolean;
  canAccessPlan: (planSlug: string) => boolean;
  isPremium: boolean;
  isLendinhas: boolean;
  refetch: () => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider = ({ children }: SubscriptionProviderProps) => {
  const { user, plan, subscription, isLoading, isError, refetch } = useUserSubscriptionData();

  const hasValidSubscription = !!(
    subscription &&
    subscription.status === 'active' &&
    new Date(subscription.end_date) > new Date()
  );

  const canAccessFeature = (feature: string): boolean => {
    if (!plan || !hasValidSubscription) return false;
    
    // Define feature access based on plan
    const featureAccess: Record<string, string[]> = {
      'premium': ['basic_content', 'premium_content', 'exclusive_discussions'],
      'lendinhas': ['basic_content', 'lendinhas_content', 'early_access'],
      'premium_lendinhas': ['basic_content', 'premium_content', 'lendinhas_content', 'exclusive_discussions', 'early_access'],
    };

    return featureAccess[plan.slug]?.includes(feature) || false;
  };

  const canAccessPlan = (planSlug: string): boolean => {
    if (!plan || !hasValidSubscription) return false;
    
    const planHierarchy: Record<string, number> = {
      'basic': 1,
      'lendinhas': 2,
      'premium': 3,
      'premium_lendinhas': 4,
    };

    const userPlanLevel = planHierarchy[plan.slug] || 0;
    const requiredLevel = planHierarchy[planSlug] || 0;

    return userPlanLevel >= requiredLevel;
  };

  const isPremium = plan?.slug === 'premium' || plan?.slug === 'premium_lendinhas';
  const isLendinhas = plan?.slug === 'lendinhas' || plan?.slug === 'premium_lendinhas';

  return (
    <SubscriptionContext.Provider
      value={{
        user,
        plan,
        subscription,
        isLoading,
        isError,
        hasValidSubscription,
        canAccessFeature,
        canAccessPlan,
        isPremium,
        isLendinhas,
        refetch,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};