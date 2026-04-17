import { useState } from 'react';
import { MoreVertical, Check, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    sender: string;
    senderAvatar: string;
    timestamp: string;
    isOwn: boolean;
    status: 'sent' | 'delivered' | 'read';
    mediaUrl?: string;
    mediaType?: 'image' | 'video' | 'audio';
  };
  showAvatar?: boolean;
}

/**
 * MessageBubble Component
 * Design: Warm Minimalist
 * - Own messages: Coral gradient (#FF6B4A to #E55A3A) with white text
 * - Other messages: Light background (#F5F3F0) with dark text
 * - Rounded corners (rounded-3xl) with subtle shadows
 * - Status indicators with check marks
 */
export default function MessageBubble({
  message,
  showAvatar = true,
}: MessageBubbleProps) {
  const [showMenu, setShowMenu] = useState(false);

  const getStatusIcon = () => {
    if (!message.isOwn) return null;

    switch (message.status) {
      case 'sent':
        return (
          <Check className="w-4 h-4 text-white opacity-70" />
        );
      case 'delivered':
        return (
          <CheckCheck className="w-4 h-4 text-white opacity-70" />
        );
      case 'read':
        return (
          <CheckCheck className="w-4 h-4 text-white" />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={`flex gap-2 mb-2 group ${
        message.isOwn ? 'justify-end' : 'justify-start'
      }`}
    >
      {/* Avatar */}
      {!message.isOwn && showAvatar && (
        <img
          src={message.senderAvatar}
          alt={message.sender}
          className="w-8 h-8 rounded-full flex-shrink-0"
        />
      )}
      {!message.isOwn && !showAvatar && (
        <div className="w-8 h-8 flex-shrink-0" />
      )}

      {/* Message Container */}
      <div className={`flex flex-col ${message.isOwn ? 'items-end' : 'items-start'}`}>
        {/* Sender Name (for group chats) */}
        {!message.isOwn && showAvatar && (
          <p className="text-xs font-medium text-muted-foreground mb-1">
            {message.sender}
          </p>
        )}

        {/* Bubble */}
        <div
          className={`relative group/bubble ${
            message.isOwn ? 'flex items-end gap-2' : ''
          }`}
        >
          {/* Menu Button */}
          {message.isOwn && (
            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-secondary"
                onClick={() => setShowMenu(!showMenu)}
              >
                <MoreVertical className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* Bubble Content */}
          <div
            className={`px-4 py-2.5 rounded-3xl shadow-sm hover:shadow-md transition-all duration-200 max-w-xs ${
              message.isOwn
                ? 'bg-gradient-to-br from-[#FF6B4A] to-[#E55A3A] text-white rounded-br-none'
                : 'bg-[#F5F3F0] text-foreground rounded-bl-none'
            }`}
          >
            {/* Media */}
            {message.mediaUrl && (
              <div className="mb-2 rounded-lg overflow-hidden">
                {message.mediaType === 'image' && (
                  <img
                    src={message.mediaUrl}
                    alt="Message media"
                    className="max-w-xs max-h-64 rounded-lg"
                  />
                )}
                {message.mediaType === 'video' && (
                  <video
                    src={message.mediaUrl}
                    className="max-w-xs max-h-64 rounded-lg"
                    controls
                  />
                )}
              </div>
            )}

            {/* Text Content */}
            <p className="text-sm leading-relaxed break-words">
              {message.content}
            </p>

            {/* Status Icon */}
            {message.isOwn && (
              <div className="flex items-center justify-end gap-1 mt-1">
                {getStatusIcon()}
              </div>
            )}
          </div>

          {/* Context Menu */}
          {showMenu && (
            <div className="absolute bottom-full right-0 mb-2 bg-card border border-border rounded-lg shadow-lg z-50 min-w-max">
              <button className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-secondary transition-colors rounded-t-lg">
                Edit
              </button>
              <button className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-secondary transition-colors">
                Reply
              </button>
              <button className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-secondary transition-colors">
                Forward
              </button>
              <button className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-secondary transition-colors rounded-b-lg">
                Delete
              </button>
            </div>
          )}
        </div>

        {/* Timestamp */}
        <p className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {message.timestamp}
        </p>
      </div>
    </div>
  );
}
