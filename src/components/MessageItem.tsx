'use client';

import { useEffect, useRef, useState } from 'react';
import { Message, MessageStatus } from '@/types';
import { MediaPreview } from './MediaPreview';

interface MessageItemProps {
  message: Message;
  isOwn: boolean;
  onEdit?: (messageId: string, content: string) => void;
  onDelete?: (messageId: string) => void;
  onReply?: (messageId: string) => void;
  onForward?: (messageId: string) => void;
}

export const MessageItem = ({
  message,
  isOwn,
  onEdit,
  onDelete,
  onReply,
  onForward,
}: MessageItemProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);
  const menuRef = useRef<HTMLDivElement>(null);

  const getStatusIcon = (status: MessageStatus) => {
    if (!isOwn) return null;

    switch (status) {
      case MessageStatus.SENT:
        return (
          <svg
            className="w-4 h-4 text-slate-400"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
          </svg>
        );
      case MessageStatus.DELIVERED:
        return (
          <div className="flex gap-0.5">
            <svg
              className="w-4 h-4 text-slate-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
            </svg>
            <svg
              className="w-4 h-4 text-slate-400"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
            </svg>
          </div>
        );
      case MessageStatus.READ:
        return (
          <div className="flex gap-0.5">
            <svg
              className="w-4 h-4 text-blue-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
            </svg>
            <svg
              className="w-4 h-4 text-blue-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
            </svg>
          </div>
        );
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleEditSubmit = () => {
    if (editContent.trim() && editContent !== message.content) {
      onEdit?.(message.id, editContent);
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('Delete this message?')) {
      onDelete?.(message.id);
    }
    setShowMenu(false);
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className={`flex mb-2 ${isOwn ? 'justify-end' : 'justify-start'} group`}
    >
      <div className="flex items-end gap-2">
        {/* Message actions menu for own messages */}
        {isOwn && (
          <div className="relative opacity-0 group-hover:opacity-100 transition-opacity" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1 hover:bg-slate-200 rounded transition-colors"
            >
              <svg
                className="w-5 h-5 text-slate-600"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
              </svg>
            </button>

            {showMenu && (
              <div className="absolute bottom-full right-0 mb-2 bg-white border border-slate-200 rounded-lg shadow-lg z-10">
                <button
                  onClick={() => {
                    setIsEditing(true);
                    setShowMenu(false);
                  }}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100 rounded-t-lg"
                >
                  Edit
                </button>
                <button
                  onClick={() => onReply?.(message.id)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100"
                >
                  Reply
                </button>
                <button
                  onClick={() => onForward?.(message.id)}
                  className="w-full px-4 py-2 text-left text-sm hover:bg-slate-100"
                >
                  Forward
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-slate-100 rounded-b-lg"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`max-w-xs px-4 py-2 rounded-lg flex gap-2 items-end ${
            isOwn
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-slate-200 text-slate-900 rounded-bl-none'
          }`}
        >
          <div className="break-words">
            {message.mediaUrl && (
              <div className="mb-2">
                <MediaPreview
                  url={message.mediaUrl}
                  type={message.mediaType || 'image'}
                  caption={message.content}
                  size={0}
                />
              </div>
            )}

            {isEditing ? (
              <input
                type="text"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleEditSubmit();
                  if (e.key === 'Escape') setIsEditing(false);
                }}
                autoFocus
                className={`w-full px-2 py-1 rounded text-sm ${
                  isOwn
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-300 text-slate-900'
                }`}
              />
            ) : (
              <>
                {message.content && <p>{message.content}</p>}
                {message.isEdited && (
                  <p
                    className={`text-xs ${
                      isOwn ? 'text-blue-100' : 'text-slate-500'
                    }`}
                  >
                    (edited)
                  </p>
                )}
              </>
            )}
          </div>

          <div className="flex items-center gap-1">
            {getStatusIcon(message.status)}
          </div>
        </div>

        {/* Time */}
        <span
          className={`text-xs ${
            isOwn ? 'text-slate-500' : 'text-slate-500'
          } opacity-0 group-hover:opacity-100 transition-opacity`}
        >
          {formatTime(message.createdAt)}
        </span>
      </div>
    </div>
  );
};
