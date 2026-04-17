import { MessageSquare, Mail, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  type: 'no-chats' | 'no-search-results' | 'select-chat';
  onAction?: () => void;
}

/**
 * EmptyState Component
 * Design: Warm Minimalist
 * - Friendly, encouraging messaging
 * - Clear call-to-action
 * - Consistent with design system
 */
export default function EmptyState({ type, onAction }: EmptyStateProps) {
  const states = {
    'no-chats': {
      icon: MessageSquare,
      title: 'No conversations yet',
      description: 'Start a new conversation to begin chatting',
      action: 'Start Chat',
    },
    'no-search-results': {
      icon: Search,
      title: 'No results found',
      description: 'Try searching for a different chat or user',
      action: null,
    },
    'select-chat': {
      icon: MessageSquare,
      title: 'Select a chat to start',
      description: 'Choose from your conversations or start a new one',
      action: null,
    },
  };

  const state = states[type];
  const IconComponent = state.icon;

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-8">
      <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4">
        <IconComponent className="w-10 h-10 text-muted-foreground" />
      </div>
      <h3 className="text-heading text-foreground mb-2">{state.title}</h3>
      <p className="text-body text-muted-foreground mb-6 max-w-sm">
        {state.description}
      </p>
      {state.action && (
        <Button
          onClick={onAction}
          className="bg-gradient-to-br from-[#FF6B4A] to-[#E55A3A] hover:from-[#E55A3A] hover:to-[#CC4A2A] text-white"
        >
          {state.action}
        </Button>
      )}
    </div>
  );
}
