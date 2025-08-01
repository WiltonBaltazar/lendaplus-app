// components/ContentExamples.tsx
import { ProtectedContent} from '@/components/ProtectedContent';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { PlanBadge } from './PlanBadge';

export const ContentExamples = () => {
  const { hasValidSubscription } = useSubscription();
  // const { isPremium, isLendinhas, hasValidSubscription } = useSubscription();

  return (
    <div className="space-y-6">
      {/* Basic content - available to all */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Basic Content</h2>
        <p>This content is available to all users.</p>
      </div>

      {/* Premium only content */}
      <ProtectedContent requiredFeature="premium_content">
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Premium Content</h2>
            <PlanBadge plan="premium" />
          </div>
          <p>This exclusive content is only available to Premium subscribers.</p>
        </div>
      </ProtectedContent>

      {/* Lendinhas only content */}
      <ProtectedContent requiredFeature="lendinhas_content">
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Lendinhas Content</h2>
            <PlanBadge plan="lendinhas" />
          </div>
          <p>Special content for Lendinhas subscribers.</p>
        </div>
      </ProtectedContent>

      {/* Premium + Lendinhas content */}
      <ProtectedContent requiredPlan="premium_lendinhas">
        <div className="bg-gradient-to-r from-purple-50 to-yellow-50 p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Premium + Lendinhas Content</h2>
            <PlanBadge plan="premium_lendinhas" />
          </div>
          <p>The ultimate content for Premium + Lendinhas subscribers.</p>
        </div>
      </ProtectedContent>

      {/* Conditional rendering based on subscription status */}
      {hasValidSubscription ? (
        <div className="bg-green-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-green-800">Welcome Subscriber!</h2>
          <p className="text-green-700">Thank you for your subscription.</p>
        </div>
      ) : (
        <div className="bg-red-50 p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold text-red-800">Subscription Required</h2>
          <p className="text-red-700">Please subscribe to access premium content.</p>
        </div>
      )}
    </div>
  );
};