/**
 * TypingIndicator Component
 * Design: Warm Minimalist
 * - Animated dots with warm accent color
 * - Smooth pulsing animation
 * - Positioned on the left (incoming message style)
 */
export default function TypingIndicator() {
  return (
    <div className="flex gap-2 items-center mb-2">
      <div className="w-8 h-8 flex-shrink-0" />
      <div className="bg-[#F5F3F0] text-foreground rounded-3xl rounded-bl-none px-4 py-2.5 shadow-sm">
        <div className="flex gap-1.5 items-center">
          <span
            className="w-2 h-2 bg-[#FF6B4A] rounded-full animate-pulse"
            style={{ animationDelay: '0ms' }}
          />
          <span
            className="w-2 h-2 bg-[#FF6B4A] rounded-full animate-pulse"
            style={{ animationDelay: '150ms' }}
          />
          <span
            className="w-2 h-2 bg-[#FF6B4A] rounded-full animate-pulse"
            style={{ animationDelay: '300ms' }}
          />
        </div>
      </div>
    </div>
  );
}
