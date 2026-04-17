import { useState } from 'react';
import {
  ArrowLeft,
  Bell,
  Lock,
  Palette,
  HelpCircle,
  LogOut,
  User,
  Shield,
  Smartphone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLocation } from 'wouter';

/**
 * Settings Page
 * Design: Warm Minimalist
 * - Organized settings sections
 * - Toggle switches and input fields
 * - Clean, scannable layout
 */
export default function Settings() {
  const [, setLocation] = useLocation();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);

  const settingsSections = [
    {
      title: 'Account',
      icon: User,
      items: [
        { label: 'Edit Profile', icon: User },
        { label: 'Change Password', icon: Lock },
        { label: 'Two-Factor Authentication', icon: Shield, toggle: true, value: twoFactor, onChange: setTwoFactor },
      ],
    },
    {
      title: 'Preferences',
      icon: Palette,
      items: [
        { label: 'Notifications', icon: Bell, toggle: true, value: notifications, onChange: setNotifications },
        { label: 'Dark Mode', icon: Palette, toggle: true, value: darkMode, onChange: setDarkMode },
        { label: 'Message Sound', icon: Smartphone },
      ],
    },
    {
      title: 'Privacy & Security',
      icon: Lock,
      items: [
        { label: 'Privacy Settings', icon: Lock },
        { label: 'Blocked Users', icon: Shield },
        { label: 'Data & Privacy', icon: HelpCircle },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card shadow-sm sticky top-0 z-50">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/')}
            className="hover:bg-secondary"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-heading text-foreground">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <div className="bg-card rounded-xl p-6 border border-border mb-8 shadow-sm">
          <div className="flex items-center gap-4">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=John"
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
            <div className="flex-1">
              <h2 className="text-heading text-foreground">John Doe</h2>
              <p className="text-sm text-muted-foreground">john@example.com</p>
              <p className="text-xs text-muted-foreground mt-1">Active now</p>
            </div>
            <Button className="bg-gradient-to-br from-[#FF6B4A] to-[#E55A3A] hover:from-[#E55A3A] hover:to-[#CC4A2A] text-white">
              Edit Profile
            </Button>
          </div>
        </div>

        {/* Settings Sections */}
        {settingsSections.map((section) => {
          const IconComponent = section.icon;
          return (
            <div key={section.title} className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <IconComponent className="w-5 h-5 text-[#FF6B4A]" />
                <h3 className="text-heading text-foreground">{section.title}</h3>
              </div>

              <div className="space-y-2">
                {section.items.map((item) => {
                  const ItemIcon = item.icon;
                  return (
                    <div
                      key={item.label}
                      className="bg-card rounded-lg p-4 border border-border flex items-center justify-between hover:bg-secondary transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <ItemIcon className="w-5 h-5 text-muted-foreground" />
                        <span className="text-foreground">{item.label}</span>
                      </div>

                      {item.toggle ? (
                        <button
                          onClick={() => item.onChange?.(!item.value)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            item.value
                              ? 'bg-[#FF6B4A]'
                              : 'bg-muted'
                          }`}
                        >
                          <div
                            className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              item.value ? 'translate-x-6' : 'translate-x-1'
                            }`}
                          />
                        </button>
                      ) : (
                        <svg
                          className="w-5 h-5 text-muted-foreground"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Danger Zone */}
        <div className="mt-12 pt-8 border-t border-border">
          <h3 className="text-heading text-foreground mb-4">Danger Zone</h3>
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full justify-start gap-3 border-border hover:bg-secondary"
            >
              <HelpCircle className="w-5 h-5" />
              Help & Support
            </Button>
            <Button
              variant="outline"
              className="w-full justify-start gap-3 border-border hover:bg-destructive hover:text-destructive-foreground text-destructive"
            >
              <LogOut className="w-5 h-5" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
