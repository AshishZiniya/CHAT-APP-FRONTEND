import { useState } from 'react';
import { X, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

interface CreateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateChat?: (userIds: string[]) => void;
}

// Mock users
const MOCK_USERS: User[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    email: 'alice@example.com',
  },
  {
    id: '2',
    name: 'Bob Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    email: 'bob@example.com',
  },
  {
    id: '3',
    name: 'Carol Davis',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol',
    email: 'carol@example.com',
  },
  {
    id: '4',
    name: 'David Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    email: 'david@example.com',
  },
];

/**
 * CreateChatModal Component
 * Design: Warm Minimalist
 * - Modal for starting new chats or groups
 * - User selection with checkboxes
 * - Smooth animations
 */
export default function CreateChatModal({
  isOpen,
  onClose,
  onCreateChat,
}: CreateChatModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const filteredUsers = MOCK_USERS.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleToggleUser = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleCreateChat = () => {
    if (selectedUsers.length > 0) {
      onCreateChat?.(selectedUsers);
      setSelectedUsers([]);
      setSearchQuery('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-xl max-w-md w-full border border-border">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-heading text-foreground">
            {selectedUsers.length > 1 ? 'Create Group' : 'Start Chat'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-secondary"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 bg-secondary border-0 rounded-lg focus:ring-2 focus:ring-[#FF6B4A]"
            />
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((userId) => {
                const user = MOCK_USERS.find((u) => u.id === userId);
                return (
                  <div
                    key={userId}
                    className="bg-[#F5F3F0] text-foreground rounded-full px-3 py-1 text-sm flex items-center gap-2"
                  >
                    {user?.name}
                    <button
                      onClick={() => handleToggleUser(userId)}
                      className="hover:text-[#FF6B4A] transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Users List */}
          <div className="max-h-64 overflow-y-auto space-y-2">
            {filteredUsers.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No users found
              </p>
            ) : (
              filteredUsers.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleToggleUser(user.id)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-secondary transition-colors text-left"
                >
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => {}}
                    className="w-4 h-4 rounded border-border bg-secondary cursor-pointer"
                  />
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 border-border hover:bg-secondary"
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreateChat}
            disabled={selectedUsers.length === 0}
            className="flex-1 bg-gradient-to-br from-[#FF6B4A] to-[#E55A3A] hover:from-[#E55A3A] hover:to-[#CC4A2A] text-white disabled:opacity-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            {selectedUsers.length > 1 ? 'Create Group' : 'Start Chat'}
          </Button>
        </div>
      </div>
    </div>
  );
}
