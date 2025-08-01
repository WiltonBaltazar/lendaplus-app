import { useSubscription } from "@/contexts/SubscriptionContext";

interface UpgradePromptProps {
  feature?: string;
  plan?: string;
  className?: string;
}

export const UpgradePrompt = ({ feature, plan, className }: UpgradePromptProps) => {
  const { plan: userPlan } = useSubscription();

  const handleUpgrade = () => {
    // Navigate to upgrade page
    window.location.href = '/upgrade';
  };

  return (
    <div className={`bg-gradient-to-br from-purple-500 to-blue-600 text-white p-6 rounded-lg shadow-lg ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold mb-2">
            {feature ? `Premium Feature: ${feature}` : `Upgrade Required`}
          </h3>
          <p className="text-sm opacity-90">
            {plan 
              ? `This content requires ${plan} plan or higher.`
              : 'Upgrade your plan to access this premium content.'
            }
          </p>
          {userPlan && (
            <p className="text-xs mt-1 opacity-80">
              Current plan: {userPlan.name}
            </p>
          )}
        </div>
        <button
          onClick={handleUpgrade}
          className="bg-white text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Upgrade Now
        </button>
      </div>
    </div>
  );
};