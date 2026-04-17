import { User, Mail, Phone } from 'lucide-react';

/**
 * UserProfile Component
 * Design: Warm Minimalist
 * - Displays user information
 * - Used in header dropdown menu
 */
export default function UserProfile() {
  const user = {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1 (555) 123-4567',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  };

  return (
    <div className="p-4 border-b border-border">
      <div className="flex gap-3 mb-4">
        <img
          src={user.avatar}
          alt={user.name}
          className="w-12 h-12 rounded-full"
        />
        <div className="flex-1">
          <h3 className="font-medium text-foreground">{user.name}</h3>
          <p className="text-xs text-muted-foreground">Online</p>
        </div>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Mail className="w-4 h-4" />
          <span className="truncate">{user.email}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <Phone className="w-4 h-4" />
          <span>{user.phone}</span>
        </div>
      </div>
    </div>
  );
}
