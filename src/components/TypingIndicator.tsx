'use client';

import React from 'react';

interface TypingIndicatorProps {
  userName: string;
  isVisible: boolean;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  userName,
  isVisible,
}) => {
  if (!isVisible) return null;

  return (
    <div className="px-4 py-2 text-sm text-slate-500 flex items-center gap-2">
      <span>{userName} is typing</span>
      <div className="flex gap-1">
        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" />
        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
      </div>
    </div>
  );
};
