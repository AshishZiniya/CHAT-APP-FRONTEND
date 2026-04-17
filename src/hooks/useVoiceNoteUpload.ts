import { useState, useCallback } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

interface UseVoiceNoteUploadOptions {
  onSuccess?: (mediaUrl: string, mediaId: string) => void;
  onError?: (error: string) => void;
  onProgress?: (progress: number) => void;
}

export const useVoiceNoteUpload = (options: UseVoiceNoteUploadOptions = {}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const uploadVoiceNote = useCallback(
    async (base64Data: string, duration: number) => {
      try {
        setIsUploading(true);
        setError('');
        options.onProgress?.(0);

        // Create form data for upload
        const payload = {
          file: base64Data,
          filename: `voice-note-${Date.now()}.webm`,
          mimeType: 'audio/webm',
          size: Math.round((base64Data.length * 3) / 4), // Approximate size in bytes
          duration: duration,
          mediaType: 'VOICE_NOTE',
        };

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No authentication token found');
        }

        options.onProgress?.(50);

        const response = await fetch(`${API_BASE_URL}/media/upload`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to upload voice note');
        }

        const data = await response.json();
        options.onProgress?.(100);

        options.onSuccess?.(data.mediaUrl, data.mediaId);
        return {
          mediaUrl: data.mediaUrl,
          mediaId: data.mediaId,
        };
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to upload voice note';
        setError(errorMessage);
        options.onError?.(errorMessage);
        throw err;
      } finally {
        setIsUploading(false);
      }
    },
    [options]
  );

  return {
    uploadVoiceNote,
    isUploading,
    error,
  };
};
