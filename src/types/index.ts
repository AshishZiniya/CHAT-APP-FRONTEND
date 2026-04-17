// User types
export interface User {
  id: string;
  email: string;
  phone?: string;
  displayName: string;
  profilePicture?: string;
  status?: string;
  isActive: boolean;
  lastSeen?: Date;
  createdAt: Date;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// Message types
export interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId?: string;
  groupId?: string;
  status: MessageStatus;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'audio' | 'document';
  isEdited: boolean;
  editedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export enum MessageStatus {
  SENT = 'SENT',
  DELIVERED = 'DELIVERED',
  READ = 'READ',
}

// Chat types
export interface Chat {
  id: string;
  participantId?: string;
  participant?: User;
  groupId?: string;
  group?: Group;
  lastMessage?: Message;
  unreadCount: number;
  lastMessageTime?: Date;
}

// Group types
export interface Group {
  id: string;
  name: string;
  description?: string;
  profilePicture?: string;
  createdBy: string;
  creator?: User;
  members: GroupMember[];
  createdAt: Date;
  updatedAt: Date;
}

export interface GroupMember {
  id: string;
  groupId: string;
  userId: string;
  user?: User;
  role: GroupMemberRole;
  joinedAt: Date;
}

export enum GroupMemberRole {
  ADMIN = 'ADMIN',
  MEMBER = 'MEMBER',
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  displayName: string;
  phone?: string;
}
