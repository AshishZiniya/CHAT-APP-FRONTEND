interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'away' | 'busy';
  size?: 'sm' | 'md' | 'lg';
}

/**
 * StatusIndicator Component
 * Design: Warm Minimalist
 * - Shows user online/offline status
 * - Uses semantic colors
 * - Positioned as overlay on avatars
 */
export default function StatusIndicator({
  status,
  size = 'md',
}: StatusIndicatorProps) {
  const sizeStyles = {
    sm: 'w-2 h-2',
    md: 'w-3 h-3',
    lg: 'w-4 h-4',
  };

  const statusStyles = {
    online: 'bg-[#6B9E7F]',
    offline: 'bg-muted-foreground',
    away: 'bg-[#FFB6A3]',
    busy: 'bg-red-500',
  };

  return (
    <div
      className={`${sizeStyles[size]} ${statusStyles[status]} rounded-full border-2 border-card shadow-sm`}
    />
  );
}
