'use client';

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { ChatWindow } from '@/components/ChatWindow';
import { GroupChatWindow } from '@/components/GroupChatWindow';
import { useAuthStore } from '@/store/authStore';
import { useMessageStore } from '@/store/messageStore';
import { useGroupStore } from '@/store/groupStore';
import { useSocket } from '@/hooks/useSocket';

export default function Home() {
  const { isAuthenticated, hydrate } = useAuthStore();
  const { selectedChatId, setSelectedChatId, addMessage } = useMessageStore();
  const { getGroupById, setSelectedGroup } = useGroupStore();
  const { socket } = useSocket();
  const [selectedChatName, setSelectedChatName] = useState('');
  const [selectedChatType, setSelectedChatType] = useState<'direct' | 'group' | null>(null);

  useEffect(() => {
    // Hydrate auth state from localStorage
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (!socket) return;

    // Listen for incoming messages
    socket.on('message:receive', (message) => {
      addMessage(message);
    });

    return () => {
      socket.off('message:receive');
    };
  }, [socket, addMessage]);

  const handleSelectChat = (chatId: string, type: 'direct' | 'group') => {
    setSelectedChatId(chatId);
    setSelectedChatType(type);

    if (type === 'direct') {
      // In a real app, fetch the user's name from the API
      setSelectedChatName(`Chat ${chatId}`);
      setSelectedGroup(null);
    } else {
      // For groups, set the selected group
      const group = getGroupById(chatId);
      if (group) {
        setSelectedGroup(group);
      }
    }
  };

  // TODO: Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return (
      <main className="flex min-h-screen bg-gradient-to-br from-blue-500 to-blue-600 items-center justify-center">
        <div className="text-center text-white">
          <h1 className="text-4xl font-bold mb-4">Chat App</h1>
          <p className="text-xl mb-8">WhatsApp-style real-time messaging</p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-colors">
            Sign In / Sign Up
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen bg-slate-50">
      <div className="w-full flex">
        <Sidebar
          onSelectChat={handleSelectChat}
          selectedChatId={selectedChatId}
          selectedChatType={selectedChatType || undefined}
        />

        {selectedChatType === 'group' ? (
          <GroupChatWindow group={getGroupById(selectedChatId || '')} />
        ) : (
          <ChatWindow
            chatId={selectedChatId}
            recipientName={selectedChatName}
          />
        )}
      </div>
    </main>
  );
}
