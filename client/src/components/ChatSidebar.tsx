import { useState } from 'react';
import { Search, Plus, MessageSquare, Users, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import CreateChatModal from '@/components/CreateChatModal';

interface Chat {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isOnline?: boolean;
  type: 'direct' | 'group';
}

interface ChatSidebarProps {
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onClose?: () => void;
}

// Mock data - replace with real API data
const MOCK_CHATS: Chat[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    lastMessage: 'That sounds great! Let\'s meet tomorrow',
    timestamp: '2:30 PM',
    unread: 2,
    isOnline: true,
    type: 'direct',
  },
  {
    id: '2',
    name: 'Design Team',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Design',
    lastMessage: 'Updated the mockups for review',
    timestamp: '1:15 PM',
    unread: 0,
    type: 'group',
  },
  {
    id: '3',
    name: 'Bob Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    lastMessage: 'See you at the meeting',
    timestamp: 'Yesterday',
    unread: 0,
    isOnline: false,
    type: 'direct',
  },
  {
    id: '4',
    name: 'Project Alpha',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alpha',
    lastMessage: 'Milestone 2 completed',
    timestamp: 'Monday',
    unread: 1,
    type: 'group',
  },
];

export default function ChatSidebar({
  selectedChatId,
  onSelectChat,
  onClose,
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'direct' | 'groups'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const filteredChats = MOCK_CHATS.filter((chat) => {
    const matchesSearch = chat.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesTab =
      activeTab === 'all' ||
      (activeTab === 'direct' && chat.type === 'direct') ||
      (activeTab === 'groups' && chat.type === 'group');
    return matchesSearch && matchesTab;
  });

  return (
    <div className="flex flex-col h-full bg-sidebar">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-heading text-foreground">Messages</h2>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowCreateModal(true)}
              className="hover:bg-secondary"
            >
              <Plus className="w-5 h-5" />
            </Button>
            {onClose && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="hover:bg-secondary md:hidden"
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-secondary border-0 rounded-full focus:ring-2 focus:ring-[#FF6B4A]"
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border px-4 gap-4">
        {['all', 'direct', 'groups'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as typeof activeTab)}
            className={`py-3 px-1 text-sm font-medium transition-all duration-200 border-b-2 ${
              activeTab === tab
                ? 'border-[#FF6B4A] text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab === 'all' && 'All'}
            {tab === 'direct' && 'Direct'}
            {tab === 'groups' && 'Groups'}
          </button>
        ))}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <MessageSquare className="w-12 h-12 text-muted-foreground mb-3 opacity-50" />
            <p className="text-body text-muted-foreground">No chats found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {filteredChats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`w-full p-4 text-left transition-all duration-200 ${
                  selectedChatId === chat.id
                    ? 'bg-[#F5F3F0] border-l-4 border-[#FF6B4A]'
                    : 'hover:bg-secondary'
                }`}
              >
                <div className="flex gap-3">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {chat.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-[#6B9E7F] rounded-full border-2 border-sidebar" />
                    )}
                  </div>

                  {/* Chat Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-foreground truncate">
                        {chat.name}
                      </h3>
                      <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">
                        {chat.timestamp}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground truncate">
                        {chat.lastMessage}
                      </p>
                      {chat.unread > 0 && (
                        <div className="ml-2 w-5 h-5 rounded-full bg-[#FF6B4A] text-white text-xs flex items-center justify-center flex-shrink-0 font-medium">
                          {chat.unread}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Create Chat Modal */}
      <CreateChatModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreateChat={(userIds) => {
          // Handle chat creation
          console.log('Creating chat with users:', userIds);
        }}
      />
    </div>
  );
}
