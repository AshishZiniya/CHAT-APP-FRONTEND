import { create } from 'zustand';

export interface GroupMember {
  id: string;
  userId: string;
  groupId: string;
  role: 'admin' | 'member';
  joinedAt: Date;
  user?: {
    id: string;
    displayName: string;
    profilePicture?: string;
  };
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  profilePicture?: string;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  members: GroupMember[];
  memberCount: number;
}

interface GroupStore {
  groups: Group[];
  selectedGroup: Group | null;
  loading: boolean;
  error: string | null;

  // Actions
  setGroups: (groups: Group[]) => void;
  addGroup: (group: Group) => void;
  removeGroup: (groupId: string) => void;
  updateGroup: (groupId: string, updates: Partial<Group>) => void;
  setSelectedGroup: (group: Group | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Helper methods
  getGroupById: (groupId: string) => Group | undefined;
  getGroupMembers: (groupId: string) => GroupMember[];
  isUserGroupAdmin: (groupId: string, userId: string) => boolean;
}

export const useGroupStore = create<GroupStore>((set, get) => ({
  groups: [],
  selectedGroup: null,
  loading: false,
  error: null,

  setGroups: (groups) => set({ groups }),

  addGroup: (group) =>
    set((state) => {
      // Avoid duplicates
      const exists = state.groups.some((g) => g.id === group.id);
      return {
        groups: exists ? state.groups : [...state.groups, group],
      };
    }),

  removeGroup: (groupId) =>
    set((state) => {
      const selectedGroupId = state.selectedGroup?.id;
      return {
        groups: state.groups.filter((g) => g.id !== groupId),
        selectedGroup: selectedGroupId === groupId ? null : state.selectedGroup,
      };
    }),

  updateGroup: (groupId, updates) =>
    set((state) => ({
      groups: state.groups.map((g) =>
        g.id === groupId ? { ...g, ...updates } : g,
      ),
      selectedGroup:
        state.selectedGroup?.id === groupId
          ? { ...state.selectedGroup, ...updates }
          : state.selectedGroup,
    })),

  setSelectedGroup: (group) => set({ selectedGroup: group }),

  setLoading: (loading) => set({ loading }),

  setError: (error) => set({ error }),

  clearError: () => set({ error: null }),

  getGroupById: (groupId) => {
    const state = get();
    return state.groups.find((g) => g.id === groupId);
  },

  getGroupMembers: (groupId) => {
    const state = get();
    const group = state.groups.find((g) => g.id === groupId);
    return group?.members || [];
  },

  isUserGroupAdmin: (groupId, userId) => {
    const state = get();
    const group = state.groups.find((g) => g.id === groupId);
    if (!group) return false;

    const member = group.members.find(
      (m) => m.userId === userId && m.role === 'admin',
    );
    return !!member;
  },
}));
