import { create } from 'zustand';
import { Message, Chat } from '@/types';

interface MessageStore {
  messages: Message[];
  chats: Chat[];
  selectedChatId: string | null;
  isLoading: boolean;

  // Actions
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (id: string, updates: Partial<Message>) => void;
  deleteMessage: (id: string) => void;
  clearMessages: () => void;

  setChats: (chats: Chat[]) => void;
  addChat: (chat: Chat) => void;
  updateChat: (id: string, updates: Partial<Chat>) => void;
  deleteChat: (id: string) => void;

  setSelectedChatId: (id: string | null) => void;
  setLoading: (loading: boolean) => void;

  // Selectors
  getSelectedChat: () => Chat | undefined;
  getSelectedChatMessages: () => Message[];
  getGroupMessages: (groupId: string) => Message[];
}

export const useMessageStore = create<MessageStore>((set, get) => ({
  messages: [],
  chats: [],
  selectedChatId: null,
  isLoading: false,

  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
  updateMessage: (id, updates) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg.id === id ? { ...msg, ...updates } : msg
      ),
    })),
  deleteMessage: (id) =>
    set((state) => ({
      messages: state.messages.filter((msg) => msg.id !== id),
    })),
  clearMessages: () => set({ messages: [] }),

  setChats: (chats) => set({ chats }),
  addChat: (chat) =>
    set((state) => {
      // Avoid duplicates
      const exists = state.chats.some((c) => c.id === chat.id);
      return { chats: exists ? state.chats : [...state.chats, chat] };
    }),
  updateChat: (id, updates) =>
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === id ? { ...chat, ...updates } : chat
      ),
    })),
  deleteChat: (id) =>
    set((state) => ({
      chats: state.chats.filter((chat) => chat.id !== id),
    })),

  setSelectedChatId: (id) => set({ selectedChatId: id }),
  setLoading: (loading) => set({ isLoading: loading }),

  getSelectedChat: () => {
    const { chats, selectedChatId } = get();
    return chats.find((chat) => chat.id === selectedChatId);
  },

  getSelectedChatMessages: () => {
    const { messages, selectedChatId } = get();
    if (!selectedChatId) return [];
    return messages.filter(
      (msg) =>
        msg.groupId === selectedChatId ||
        msg.receiverId === selectedChatId ||
        msg.senderId === selectedChatId
    );
  },

  getGroupMessages: (groupId: string) => {
    const { messages } = get();
    return messages.filter((msg) => msg.groupId === groupId);
  },
}));
