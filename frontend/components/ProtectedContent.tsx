'use client';

import { ReactNode } from "react";
import { useSubscription } from "@/contexts/SubscriptionContext";
import { UpgradePrompt } from "./UpgradePrompt"; 

interface ProtectedContentProps {
    children: ReactNode;
    requiredFeature?: string;
    requiredPlan?: string;
    fallback?: ReactNode;
    showUpgradePrompt?: boolean;
}

export const ProtectedContent = ({
    children,
    requiredFeature,
    requiredPlan,
    fallback,
    showUpgradePrompt = true,
}: ProtectedContentProps) =>{
    const {canAccessFeature, canAccessPlan, hasValidSubscription, isLoading} = useSubscription();

    if(isLoading){
        return <div className="animate-pulse bg-gray-200 h-32 rounded-lg"></div>;
    }

    if(!hasValidSubscription){
        return showUpgradePrompt ? (
            <UpgradePrompt />
        ) : fallback || null;
    }

    if (requiredFeature && !canAccessFeature(requiredFeature)) {
    return showUpgradePrompt ? <UpgradePrompt feature={requiredFeature} /> : fallback || null;
  }

  if (requiredPlan && !canAccessPlan(requiredPlan)) {
    return showUpgradePrompt ? <UpgradePrompt plan={requiredPlan} /> : fallback || null;
  }

  return <>{children}</>;
};
