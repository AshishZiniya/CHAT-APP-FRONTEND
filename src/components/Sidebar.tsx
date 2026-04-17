'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useAuthStore } from '@/store/authStore';
import { useGroupStore } from '@/store/groupStore';
import { CreateGroupModal } from './CreateGroupModal';

interface SidebarProps {
  onSelectChat?: (chatId: string, type: 'direct' | 'group') => void;
  selectedChatId?: string;
  selectedChatType?: 'direct' | 'group';
}

interface Contact {
  id: string;
  name: string;
  avatar: string;
  status: string;
  lastMessage?: string;
  isOnline?: boolean;
}

// Mock contacts for demo (will be replaced with API call)
const MOCK_CONTACTS: Contact[] = [
  {
    id: '1',
    name: 'Alice',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    status: 'Available',
    lastMessage: 'Hey! How are you doing?',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Bob',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    status: 'Working from home',
    lastMessage: 'Latest project updates...',
    isOnline: false,
  },
];

const Sidebar: React.FC<SidebarProps> = ({
  onSelectChat,
  selectedChatId,
  selectedChatType,
}) => {
  const { user, logout } = useAuthStore();
  const { groups } = useGroupStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'chats' | 'groups'>('chats');
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  const filteredContacts = MOCK_CONTACTS.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredGroups = groups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col h-screen">
        {/* Header */}
        <div className="p-4 border-b border-slate-200">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-slate-900">Chats</h1>
            <button
              onClick={() => setShowCreateGroup(true)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              title="Create group"
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
                  d="M12 5v14m7-7H5"
                />
              </svg>
            </button>
          </div>

          {/* Search */}
          <input
            type="text"
            placeholder="Search chats or groups"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('chats')}
            className={`flex-1 py-3 font-medium text-sm transition-colors ${
              activeTab === 'chats'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Direct
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`flex-1 py-3 font-medium text-sm transition-colors relative ${
              activeTab === 'groups'
                ? 'text-blue-600 border-b-2 border-blue-600'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Groups
            {groups.length > 0 && (
              <span className="absolute top-1 right-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {groups.length}
              </span>
            )}
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'chats' ? (
            // Direct Messages
            filteredContacts.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p>No chats found</p>
              </div>
            ) : (
              <div>
                {filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => onSelectChat?.(contact.id, 'direct')}
                    className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
                      selectedChatId === contact.id && selectedChatType === 'direct'
                        ? 'bg-slate-50'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Image
                          src={contact.avatar}
                          alt={contact.name}
                          width={48}
                          height={48}
                          className="rounded-full"
                        />
                        {contact.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-slate-900">
                            {contact.name}
                          </h3>
                          <span className="text-xs text-slate-500">10:30</span>
                        </div>
                        <p className="text-sm text-slate-500 truncate">
                          {contact.lastMessage}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            // Groups
            filteredGroups.length === 0 ? (
              <div className="text-center py-8 text-slate-400">
                <p>No groups found</p>
                <p className="text-xs mt-2">Create your first group to get started</p>
              </div>
            ) : (
              <div>
                {filteredGroups.map((group) => (
                  <div
                    key={group.id}
                    onClick={() => onSelectChat?.(group.id, 'group')}
                    className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
                      selectedChatId === group.id && selectedChatType === 'group'
                        ? 'bg-slate-50'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        {group.profilePicture ? (
                          <Image
                            src={group.profilePicture}
                            alt={group.name}
                            width={48}
                            height={48}
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
                            {group.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-slate-900 truncate">
                            {group.name}
                          </h3>
                        </div>
                        <p className="text-xs text-slate-500">
                          {group.memberCount} member{group.memberCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>

        {/* User Profile Footer */}
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Image
                src={
                  user?.profilePicture ||
                  'https://api.dicebear.com/7.x/avataaars/svg?seed=User'
                }
                alt={user?.displayName}
                width={40}
                height={40}
                className="rounded-full"
              />
              <div>
                <p className="font-medium text-slate-900">{user?.displayName}</p>
                <p className="text-xs text-slate-500">{user?.email}</p>
              </div>
            </div>

            <button
              onClick={() => logout()}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              title="Logout"
            >
              <svg
                className="w-5 h-5 text-slate-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Create Group Modal */}
      <CreateGroupModal
        isOpen={showCreateGroup}
        onClose={() => setShowCreateGroup(false)}
        onGroupCreated={() => setActiveTab('groups')}
      />
    </>
  );
};

export default Sidebar;