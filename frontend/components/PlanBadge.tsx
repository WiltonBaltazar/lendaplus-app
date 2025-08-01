// components/PlanBadge.tsx
interface PlanBadgeProps {
  plan: string;
  className?: string;
}

export const PlanBadge = ({ plan, className }: PlanBadgeProps) => {
  const badges = {
    premium: 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white',
    lendinhas: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white',
    premium_lendinhas: 'bg-gradient-to-r from-purple-600 to-yellow-400 text-white',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[plan as keyof typeof badges] || 'bg-gray-100 text-gray-800'} ${className}`}>
      {plan.replace('_', ' + ').toUpperCase()}
    </span>
  );
};