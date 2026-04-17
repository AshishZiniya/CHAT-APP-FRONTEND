'use client';

import React, { useState, useRef, useEffect } from 'react';
import { VoiceNoteRecorder } from './VoiceNoteRecorder';
import { MediaUpload } from './MediaUpload';
import { useVoiceNoteUpload } from '@/hooks/useVoiceNoteUpload';
import { useSocket } from '@/hooks/useSocket';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  onTyping?: (isTyping: boolean) => void;
  isLoading?: boolean;
  placeholder?: string;
  chatId?: string;
  receiverId?: string;
  groupId?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onTyping,
  isLoading = false,
  placeholder = 'Type a message...',
  chatId,
  receiverId,
  groupId,
}) => {
  const [message, setMessage] = useState('');
  const [isComposing, setIsComposing] = useState(false);
  const [showVoiceRecorder, setShowVoiceRecorder] = useState(false);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [isUploadingVoice, setIsUploadingVoice] = useState(false);
  const [isUploadingMedia, setIsUploadingMedia] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const { socket } = useSocket();
  const { uploadVoiceNote } = useVoiceNoteUpload();

  const handleTyping = () => {
    if (!isComposing) {
      onTyping?.(true);
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Set new timeout to emit typing stopped after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      onTyping?.(false);
    }, 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) return;

    onSendMessage(message);
    setMessage('');
    onTyping?.(false);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
  };

  const handleVoiceNoteComplete = async (base64: string, duration: number) => {
    try {
      setIsUploadingVoice(true);
      const result = await uploadVoiceNote(base64, duration);

      // Send voice note as message
      if (socket) {
        socket.emit('message:send', {
          content: `[Voice Note: ${Math.floor(duration / 60)}m ${duration % 60}s]`,
          mediaUrl: result.mediaUrl,
          mediaId: result.mediaId,
          mediaType: 'voice_note',
          receiverId: receiverId,
          groupId: groupId,
        });
      }

      setShowVoiceRecorder(false);
    } catch (error) {
      console.error('Failed to send voice note:', error);
    } finally {
      setIsUploadingVoice(false);
    }
  };

  const handleMediaUploaded = async (mediaId: string, mediaUrl: string) => {
    try {
      setIsUploadingMedia(true);
      
      // Send media message via WebSocket
      if (socket) {
        socket.emit('message:send', {
          content: message || '[Media attachment]',
          mediaUrl: mediaUrl,
          mediaId: mediaId,
          mediaType: 'media',
          receiverId: receiverId,
          groupId: groupId,
        });
      }

      setMessage('');
      setShowMediaUpload(false);
    } catch (error) {
      console.error('Failed to send media message:', error);
    } finally {
      setIsUploadingMedia(false);
    }
  };

  const handleUploadStart = () => {
    setIsUploadingMedia(true);
  };

  const handleUploadEnd = () => {
    setIsUploadingMedia(false);
  };

  const handleVoiceRecorderCancel = () => {
    setShowVoiceRecorder(false);
  };

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 bg-white">
      {/* Voice note recorder */}
      {showVoiceRecorder && (
        <div className="mb-3">
          <VoiceNoteRecorder
            onRecordingComplete={handleVoiceNoteComplete}
            onCancel={handleVoiceRecorderCancel}
          />
          {isUploadingVoice && (
            <div className="text-xs text-slate-600 mt-2">Uploading voice note...</div>
          )}
        </div>
      )}

      {/* Media upload */}
      {showMediaUpload && (
        <div className="mb-3">
          <MediaUpload
            onMediaUploaded={handleMediaUploaded}
            onUploadStart={handleUploadStart}
            onUploadEnd={handleUploadEnd}
          />
        </div>
      )}

      <div className="flex items-end gap-3">
        {/* Voice note button */}
        <button
          type="button"
          onClick={() => setShowVoiceRecorder(!showVoiceRecorder)}
          disabled={isLoading || isUploadingVoice || showMediaUpload}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Record voice note"
        >
          <svg
            className={`w-6 h-6 ${showVoiceRecorder ? 'text-red-500' : 'text-slate-600'}`}
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
            <path d="M17 16.91c-1.48 1.46-3.51 2.36-5.7 2.36-2.19 0-4.22-.9-5.7-2.36M19 12h2c0 2.96-1.41 5.6-3.59 7.35l-1.42-1.41c1.63-1.44 2.66-3.5 2.66-5.8h1.35z" />
          </svg>
        </button>

        {/* File attachment button */}
        <button
          type="button"
          onClick={() => setShowMediaUpload(!showMediaUpload)}
          disabled={isLoading || isUploadingMedia || showVoiceRecorder}
          className={`p-2 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            showMediaUpload ? 'bg-blue-50' : ''
          }`}
          title="Attach file"
        >
          <svg
            className={`w-6 h-6 ${showMediaUpload ? 'text-blue-500' : 'text-slate-600'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>

        {/* Message input */}
        <input
          type="text"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            handleTyping();
          }}
          onCompositionStart={() => setIsComposing(true)}
          onCompositionEnd={() => setIsComposing(false)}
          placeholder={placeholder}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={isLoading || showVoiceRecorder || showMediaUpload}
        />

        {/* Send button */}
        <button
          type="submit"
          disabled={isLoading || !message.trim() || showVoiceRecorder || showMediaUpload}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Send message"
        >
          {isLoading ? (
            <svg
              className="w-6 h-6 text-slate-400 animate-spin"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
          ) : (
            <svg
              className="w-6 h-6 text-blue-500"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.9702544,11.6889879 14.4480934,2.20212479 13.8202182,1.77946707 C12.6563168,0.994580174 11.4924153,1.4659722 11.4924153,2.76068017 L11.4924153,9.20167098 C11.4924153,9.51560856 11.3354465,9.67270595 11.0215089,9.67270595 L4.13399899,9.67270595 C3.34915502,9.67270595 2.40734225,10.0882733 2.40734225,11.0308577 C2.40734225,12.0170219 3.03521743,12.4744748 4.13399899,12.4744748 L16.6915026,12.4744748 Z" />
            </svg>
          )}
        </button>
      </div>
    </form>
  );
};
