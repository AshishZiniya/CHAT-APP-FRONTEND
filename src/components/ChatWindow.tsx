'use client';

import React, { useEffect, useState } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';
import { SearchMessages } from './SearchMessages';
import { useSocket } from '@/hooks/useSocket';
import { useMessageStore } from '@/store/messageStore';
import { useAuthStore } from '@/store/authStore';
import { Message } from '@/types';
import { useApi } from '@/hooks/useApi';

interface ChatWindowProps {
  chatId?: string;
  recipientName?: string;
  isOnline?: boolean;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  chatId,
  recipientName = 'Chat',
  isOnline = false,
}) => {
  const { socket } = useSocket();
  const { getSelectedChatMessages } = useMessageStore();
  const { user } = useAuthStore();
  const api = useApi();
  const [isLoading, setIsLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [otherUserTyping, setOtherUserTyping] = useState(false);

  const selectedChatMessages = getSelectedChatMessages();

  useEffect(() => {
    if (!socket || !chatId) return;

    // Join chat room
    socket.emit('chat:join', { chatId });

    // Listen for incoming messages
    socket.on('message:receive', () => {
      // Message will be added by the message store
    });

    // Listen for message edits
    socket.on('message:edited', () => {
      // Update message in store
    });

    // Listen for message deletions
    socket.on('message:deleted', () => {
      // Remove message from store
    });

    // Listen for typing indicators
    socket.on('typing:start', ({ userId }) => {
      if (userId !== user?.id) {
        setOtherUserTyping(true);
      }
    });

    socket.on('typing:stop', ({ userId }) => {
      if (userId !== user?.id) {
        setOtherUserTyping(false);
      }
    });

    // Cleanup
    return () => {
      socket.emit('chat:leave', { chatId });
      socket.off('message:receive');
      socket.off('message:edited');
      socket.off('message:deleted');
      socket.off('typing:start');
      socket.off('typing:stop');
    };
  }, [socket, chatId, user?.id]);

  const handleSendMessage = async (content: string) => {
    if (!socket || !chatId || !user) return;

    setIsLoading(true);

    try {
      socket.emit('message:send', {
        content,
        receiverId: chatId,
        groupId: undefined,
      });
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTyping = (isTyping: boolean) => {
    if (!socket || !chatId) return;

    if (isTyping) {
      socket.emit('typing:start', { chatId });
    } else {
      socket.emit('typing:stop', { chatId });
    }
  };

  const handleEditMessage = (messageId: string, content: string) => {
    if (!socket) return;

    socket.emit('message:edit', {
      messageId,
      content,
    });
  };

  const handleDeleteMessage = (messageId: string) => {
    if (!socket) return;

    socket.emit('message:delete', { messageId });
  };

  const handleReplyMessage = (messageId: string) => {
    console.log('Reply to message:', messageId);
    // TODO: Implement reply UI
  };

  const handleForwardMessage = (messageId: string) => {
    console.log('Forward message:', messageId);
    // TODO: Implement forward UI
  };

  const handleSearchMessages = async (query: string): Promise<Message[]> => {
    try {
      const response = await api.get(`/messages/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      {chatId ? (
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {recipientName}
            </h2>
            <p className="text-sm text-slate-500">
              {isOnline ? (
                <span className="text-green-500">● Online</span>
              ) : (
                'Offline'
              )}
            </p>
          </div>
          <div className="flex gap-4 items-center">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              title="Search messages"
            >
              <svg
                className="w-6 h-6 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
            <button
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              title="Call"
            >
              <svg
                className="w-6 h-6 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </button>
            <button
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              title="Video call"
            >
              <svg
                className="w-6 h-6 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>
        </div>
      ) : null}

      {/* Search Bar */}
      {chatId && showSearch && (
        <div className="px-4 py-2 border-b border-slate-200">
          <SearchMessages
            onSearch={handleSearchMessages}
            onSelectMessage={() => {
              setShowSearch(false);
            }}
          />
        </div>
      )}

      {/* Messages Area */}
      <MessageList
        messages={selectedChatMessages}
        isLoading={isLoading}
        onEditMessage={handleEditMessage}
        onDeleteMessage={handleDeleteMessage}
        onReplyMessage={handleReplyMessage}
        onForwardMessage={handleForwardMessage}
      />

      {/* Typing indicator */}
      {chatId && (
        <TypingIndicator
          userName={recipientName}
          isVisible={otherUserTyping}
        />
      )}

      {/* Input Area */}
      {chatId ? (
        <MessageInput
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          isLoading={isLoading}
          chatId={chatId}
          receiverId={chatId}
        />
      ) : null}
    </div>
  );
};
