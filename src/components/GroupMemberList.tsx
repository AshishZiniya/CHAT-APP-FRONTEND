'use client';

import React from 'react';
import Image from 'next/image';
import { GroupMember } from '@/store/groupStore';
import { useAuthStore } from '@/store/authStore';

interface GroupMemberListProps {
  members: GroupMember[];
  groupId: string;
  isAdmin: boolean;
  onRemoveMember?: (userId: string) => void;
  onChangeRole?: (userId: string, role: 'admin' | 'member') => void;
}

export const GroupMemberList: React.FC<GroupMemberListProps> = ({
  members,
  isAdmin,
  onRemoveMember,
  onChangeRole,
}) => {
  const { user } = useAuthStore();

  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-slate-900">Members ({members.length})</h3>
      <div className="max-h-96 overflow-y-auto">
        {members.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors"
          >
            <div className="flex items-center gap-3 flex-1">
              {member.user?.profilePicture && (
                <Image
                  src={member.user.profilePicture}
                  alt={member.user.displayName}
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {member.user?.displayName}
                </p>
                <p className="text-xs text-slate-500">
                  {member.role === 'admin' ? 'Admin' : 'Member'}
                </p>
              </div>
            </div>

            {isAdmin && member.userId !== user?.id && (
              <div className="flex items-center gap-2">
                {onChangeRole && (
                  <select
                    value={member.role}
                    onChange={(e) =>
                      onChangeRole(member.userId, e.target.value as 'admin' | 'member')
                    }
                    className="text-xs px-2 py-1 border border-slate-300 rounded text-slate-700 hover:border-slate-400"
                  >
                    <option value="member">Member</option>
                    <option value="admin">Admin</option>
                  </select>
                )}

                {onRemoveMember && (
                  <button
                    onClick={() => {
                      if (confirm('Remove this member from the group?')) {
                        onRemoveMember(member.userId);
                      }
                    }}
                    className="text-xs px-2 py-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    Remove
                  </button>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
