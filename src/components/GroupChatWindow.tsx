'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { TypingIndicator } from './TypingIndicator';
import { SearchMessages } from './SearchMessages';
import { GroupInfoCard } from './GroupInfoCard';
import { useSocket } from '@/hooks/useSocket';
import { useMessageStore } from '@/store/messageStore';
import { useGroupStore, Group } from '@/store/groupStore';
import { useAuthStore } from '@/store/authStore';
import { Message } from '@/types';
import { useApi } from '@/hooks/useApi';

interface GroupChatWindowProps {
  group?: Group;
  isLoading?: boolean;
}

export const GroupChatWindow: React.FC<GroupChatWindowProps> = ({
  group,
  isLoading = false,
}) => {
  const { socket } = useSocket();
  const { getGroupMessages, addMessage } = useMessageStore();
  const { user } = useAuthStore();
  const api = useApi();
  const { updateGroup, removeGroup } = useGroupStore();

  const [showSearch, setShowSearch] = useState(false);
  const [showGroupInfo, setShowGroupInfo] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());

  const groupMessages = group ? getGroupMessages(group.id) : [];

  const fetchGroupInfo = useCallback(async () => {
    if (!group) return;
    try {
      const response = await api.get(`/groups/${group.id}`);
      updateGroup(group.id, response.data);
    } catch (error) {
      console.error('Failed to fetch group info:', error);
    }
  }, [group, api, updateGroup]);

  useEffect(() => {
    if (!socket || !group) return;

    // Join group room
    socket.emit('group:join', { groupId: group.id });

    // Listen for group messages
    socket.on('message:receive', (message: Message) => {
      if (message.groupId === group.id) {
        // Message will update through message store
      }
    });

    // Listen for typing indicators
    socket.on('typing:start', ({ userId }) => {
      if (userId !== user?.id) {
        setTypingUsers((prev) => new Set([...prev, userId]));
      }
    });

    socket.on('typing:stop', ({ userId }) => {
      setTypingUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    // Listen for group updates
    socket.on('group:updated', (updatedData) => {
      if (updatedData.groupId === group.id) {
        updateGroup(group.id, {
          name: updatedData.name || group.name,
          description: updatedData.description || group.description,
          profilePicture: updatedData.profilePicture || group.profilePicture,
        });
      }
    });

    // Listen for member changes
    socket.on('group:member-added', (data) => {
      if (data.groupId === group.id) {
        // Fetch updated group info
        fetchGroupInfo();
      }
    });

    socket.on('group:member-removed', (data) => {
      if (data.groupId === group.id) {
        // If current user was removed, show notification
        if (data.userId === user?.id) {
          removeGroup(group.id);
          return;
        }
        fetchGroupInfo();
      }
    });

    // Cleanup
    return () => {
      socket.emit('group:leave', { groupId: group.id });
      socket.off('message:receive');
      socket.off('typing:start');
      socket.off('typing:stop');
      socket.off('group:updated');
      socket.off('group:member-added');
      socket.off('group:member-removed');
    };
  }, [socket, group?.id, group, user?.id, addMessage, updateGroup, removeGroup, fetchGroupInfo]);

  useEffect(() => {
    if (!socket || !group?.id) return;

    socket.emit('group:join', { groupId: group.id });
    socket.on('message:receive', (message: Message) => {
      addMessage(message);
    });
    socket.on('message:edited', () => {
      // Update message in store
    });
    socket.on('message:deleted', () => {
      // Remove message from store
    });
    socket.on('group:updated', (updatedGroup) => {
      updateGroup(group.id, updatedGroup);
    });
    socket.on('group:member-added', (updatedGroup) => {
      updateGroup(group.id, updatedGroup);
    });
    socket.on('group:member-removed', (updatedGroup) => {
      updateGroup(group.id, updatedGroup);
    });
    socket.on('typing:start', () => {
      // Show typing indicator
    });
    socket.on('typing:stop', () => {
      // Hide typing indicator
    });

    return () => {
      socket.off('message:receive');
      socket.off('message:edited');
      socket.off('message:deleted');
      socket.off('typing:start');
      socket.off('typing:stop');
      socket.off('group:updated');
      socket.off('group:member-added');
      socket.off('group:member-removed');
    };
  }, [socket, group?.id, group, user?.id, addMessage, updateGroup]);

  const handleSendMessage = async (content: string) => {
    if (!socket || !group || !user) return;

    socket.emit('message:send', {
      content,
      groupId: group.id,
    });
  };

  const handleTyping = (isTyping: boolean) => {
    if (!socket || !group) return;

    if (isTyping) {
      socket.emit('typing:start', { chatId: group.id });
    } else {
      socket.emit('typing:stop', { chatId: group.id });
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
  };

  const handleForwardMessage = (messageId: string) => {
    console.log('Forward message:', messageId);
  };

  const handleRemoveMember = async (userId: string) => {
    if (!group || !user) return;

    try {
      await api.delete(`/groups/${group.id}/members/${userId}`);
      socket?.emit('group:member-removed', { groupId: group.id, userId });
      fetchGroupInfo();
    } catch (error) {
      console.error('Failed to remove member:', error);
    }
  };

  const handleChangeRole = async (userId: string, role: 'admin' | 'member') => {
    if (!group || !user) return;

    try {
      await api.patch(`/groups/${group.id}/members/${userId}/role`, { role });
      fetchGroupInfo();
    } catch (error) {
      console.error('Failed to change role:', error);
    }
  };

  const handleLeaveGroup = async () => {
    if (!group || !user) return;

    try {
      await api.post(`/groups/${group.id}/leave`);
      socket?.emit('group:member-removed', { groupId: group.id, userId: user.id });
      removeGroup(group.id);
    } catch (error) {
      console.error('Failed to leave group:', error);
    }
  };

  const handleDeleteGroup = async () => {
    if (!group || !user) return;

    try {
      await api.delete(`/groups/${group.id}`);
      removeGroup(group.id);
    } catch (error) {
      console.error('Failed to delete group:', error);
    }
  };

  const handleSearchMessages = async (query: string): Promise<Message[]> => {
    try {
      const response = await api.get(
        `/messages/search?q=${encodeURIComponent(query)}&groupId=${group?.id}`,
      );
      return response.data;
    } catch (error) {
      console.error('Search failed:', error);
      return [];
    }
  };

  if (!group) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white">
        <p className="text-slate-500">Select a group to start chatting</p>
      </div>
    );
  }

  const isAdmin = group.members.some(
    (m) => m.userId === user?.id && m.role === 'admin',
  );

  return (
    <div className="flex flex-1 bg-white overflow-hidden">
      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{group.name}</h2>
            <p className="text-sm text-slate-500">{group.memberCount} members</p>
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
              onClick={() => setShowGroupInfo(!showGroupInfo)}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              title="Group info"
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
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {showSearch && (
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
          messages={groupMessages}
          isLoading={isLoading}
          onEditMessage={handleEditMessage}
          onDeleteMessage={handleDeleteMessage}
          onReplyMessage={handleReplyMessage}
          onForwardMessage={handleForwardMessage}
        />

        {/* Typing indicators */}
        {typingUsers.size > 0 && (
          <TypingIndicator
            userName={
              typingUsers.size === 1
                ? `${Array.from(typingUsers)[0]} is`
                : `${typingUsers.size} members are`
            }
            isVisible={true}
          />
        )}

        {/* Input Area */}
        <MessageInput
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          isLoading={isLoading}
          placeholder="Message the group..."
          groupId={group?.id}
        />
      </div>

      {/* Group Info Sidebar */}
      {showGroupInfo && group && (
        <GroupInfoCard
          group={group}
          onEditGroup={() => {
            // TODO: Implement edit group modal
          }}
          onRemoveMember={isAdmin ? handleRemoveMember : undefined}
          onChangeRole={isAdmin ? handleChangeRole : undefined}
          onLeaveGroup={handleLeaveGroup}
          onDeleteGroup={isAdmin ? handleDeleteGroup : undefined}
        />
      )}
    </div>
  );
};
