interface NotificationBadgeProps {
  count: number;
  variant?: 'default' | 'success' | 'warning' | 'error';
}

/**
 * NotificationBadge Component
 * Design: Warm Minimalist
 * - Displays unread message count
 * - Uses warm coral accent color
 * - Subtle shadow for depth
 */
export default function NotificationBadge({
  count,
  variant = 'default',
}: NotificationBadgeProps) {
  if (count === 0) return null;

  const variantStyles = {
    default: 'bg-[#FF6B4A] text-white',
    success: 'bg-[#6B9E7F] text-white',
    warning: 'bg-[#FFB6A3] text-foreground',
    error: 'bg-red-500 text-white',
  };

  return (
    <div
      className={`w-5 h-5 rounded-full ${variantStyles[variant]} text-xs flex items-center justify-center font-medium shadow-sm`}
    >
      {count > 99 ? '99+' : count}
    </div>
  );
}
