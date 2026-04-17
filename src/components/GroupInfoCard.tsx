'use client';

import React, { useState } from 'react';
import { Group } from '@/store/groupStore';
import { GroupMemberList } from './GroupMemberList';
import { useAuthStore } from '@/store/authStore';

interface GroupInfoCardProps {
  group: Group;
  onEditGroup?: () => void;
  onRemoveMember?: (userId: string) => void;
  onChangeRole?: (userId: string, role: 'admin' | 'member') => void;
  onLeaveGroup?: () => void;
  onDeleteGroup?: () => void;
}

export const GroupInfoCard: React.FC<GroupInfoCardProps> = ({
  group,
  onEditGroup,
  onRemoveMember,
  onChangeRole,
  onLeaveGroup,
  onDeleteGroup,
}) => {
  const { user } = useAuthStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const isUserAdmin = group.members.some(
    (m) => m.userId === user?.id && m.role === 'admin',
  );
  const isGroupCreator = group.createdById === user?.id;

  return (
    <div className="bg-white border-l border-slate-200 w-80 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-200">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full text-left hover:opacity-75 transition-opacity"
        >
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">{group.name}</h2>
              <p className="text-sm text-slate-500 mt-1">{group.memberCount} members</p>
            </div>
            <svg
              className={`w-5 h-5 text-slate-600 transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </div>
        </button>

        {group.description && (
          <p className="text-sm text-slate-600 mt-3">{group.description}</p>
        )}
      </div>

      {/* Content */}
      {isExpanded && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Members */}
          <GroupMemberList
            members={group.members}
            groupId={group.id}
            isAdmin={isUserAdmin}
            onRemoveMember={onRemoveMember}
            onChangeRole={onChangeRole}
          />

          {/* Actions */}
          <div className="space-y-2 pt-4 border-t border-slate-200">
            {isUserAdmin && (
              <button
                onClick={onEditGroup}
                className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors"
              >
                Edit Group Info
              </button>
            )}

            <button
              onClick={onLeaveGroup}
              className="w-full px-4 py-2 text-left text-sm text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
            >
              Leave Group
            </button>

            {isGroupCreator && (
              <button
                onClick={() => {
                  if (confirm('Delete this group permanently?')) {
                    onDeleteGroup?.();
                  }
                }}
                className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                Delete Group
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
