import { X, Users, LogOut, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'member';
  isOnline: boolean;
}

interface GroupInfoProps {
  groupName: string;
  memberCount: number;
  onClose: () => void;
}

// Mock members
const MOCK_MEMBERS: GroupMember[] = [
  {
    id: '1',
    name: 'Alice Johnson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice',
    role: 'admin',
    isOnline: true,
  },
  {
    id: '2',
    name: 'Bob Smith',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob',
    role: 'member',
    isOnline: true,
  },
  {
    id: '3',
    name: 'Carol Davis',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carol',
    role: 'member',
    isOnline: false,
  },
  {
    id: '4',
    name: 'David Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David',
    role: 'member',
    isOnline: true,
  },
];

/**
 * GroupInfo Component
 * Design: Warm Minimalist
 * - Right sidebar showing group details
 * - Member list with online status
 * - Group actions (leave, delete)
 */
export default function GroupInfo({
  groupName,
  memberCount,
  onClose,
}: GroupInfoProps) {
  return (
    <div className="w-80 border-l border-border bg-card flex flex-col shadow-lg">
      {/* Header */}
      <div className="h-16 border-b border-border px-6 flex items-center justify-between">
        <h3 className="font-medium text-foreground">Group Info</h3>
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
      <div className="flex-1 overflow-y-auto">
        {/* Group Details */}
        <div className="p-6 border-b border-border">
          <div className="text-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#FF6B4A] to-[#E55A3A] flex items-center justify-center mx-auto mb-3">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h4 className="text-heading text-foreground">{groupName}</h4>
            <p className="text-sm text-muted-foreground mt-1">
              {memberCount} members
            </p>
          </div>
        </div>

        {/* Members List */}
        <div className="p-4">
          <h5 className="text-label text-muted-foreground mb-3">Members</h5>
          <div className="space-y-2">
            {MOCK_MEMBERS.map((member) => (
              <div
                key={member.id}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors"
              >
                <div className="relative flex-shrink-0">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-10 h-10 rounded-full"
                  />
                  {member.isOnline && (
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#6B9E7F] rounded-full border-2 border-card" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {member.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {member.role === 'admin' ? 'Admin' : 'Member'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="border-t border-border p-4 space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start gap-2 border-border hover:bg-secondary"
        >
          <LogOut className="w-4 h-4" />
          Leave Group
        </Button>
        <Button
          variant="outline"
          className="w-full justify-start gap-2 border-border hover:bg-destructive hover:text-destructive-foreground text-destructive"
        >
          <Trash2 className="w-4 h-4" />
          Delete Group
        </Button>
      </div>
    </div>
  );
}
