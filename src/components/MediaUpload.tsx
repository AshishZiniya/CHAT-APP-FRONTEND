'use client';

import React, { useState, useRef } from 'react';
import { useApi } from '@/hooks/useApi';

interface MediaUploadProps {
  onMediaUploaded?: (mediaId: string, mediaUrl: string) => void;
  onUploadStart?: () => void;
  onUploadEnd?: () => void;
  maxFileSize?: number; // in MB
}

export const MediaUpload: React.FC<MediaUploadProps> = ({
  onMediaUploaded,
  onUploadStart,
  onUploadEnd,
  maxFileSize = 50,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const api = useApi();

  const getMediaType = (file: File): string => {
    if (file.type.startsWith('image/')) return 'image';
    if (file.type.startsWith('video/')) return 'video';
    if (file.type.startsWith('audio/')) return 'audio';
    if (file.type === 'application/pdf') return 'document';
    return 'document';
  };

  const handleFile = async (file: File) => {
    setError('');
    setProgress(0);

    // Validate file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > maxFileSize) {
      setError(`File size exceeds ${maxFileSize}MB limit`);
      return;
    }

    // Read file as base64
    const reader = new FileReader();

    reader.onprogress = (e) => {
      if (e.lengthComputable) {
        const percentComplete = (e.loaded / e.total) * 50; // 50% for reading
        setProgress(percentComplete);
      }
    };

    reader.onload = async (e) => {
      try {
        setIsUploading(true);
        onUploadStart?.();

        const base64 = e.target?.result as string;
        const base64Data = base64.split(',')[1]; // Remove data:image/png;base64, prefix

        const mediaType = getMediaType(file);

        const response = await api.post('/media/upload', {
          filename: file.name,
          type: mediaType,
          base64: base64Data,
          size: file.size,
          mimeType: file.type,
        });

        setProgress(100);
        onMediaUploaded?.(response.data.id, response.data.url);
      } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to upload media';
        setError(errorMessage);
      } finally {
        setIsUploading(false);
        onUploadEnd?.();
        setProgress(0);
      }
    };

    reader.onerror = () => {
      setError('Failed to read file');
    };

    reader.readAsDataURL(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div
      className={`relative p-4 border-2 border-dashed rounded-lg transition-colors ${
        isDragging
          ? 'border-blue-500 bg-blue-50'
          : 'border-slate-300 hover:border-slate-400'
      } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileInputChange}
        className="hidden"
        disabled={isUploading}
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx"
      />

      <div className="text-center">
        <svg
          className="w-12 h-12 mx-auto text-slate-400 mb-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>

        {isUploading ? (
          <div>
            <p className="text-sm font-medium text-slate-600 mb-2">Uploading...</p>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">{Math.round(progress)}%</p>
          </div>
        ) : (
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
            >
              Click to upload
            </button>
            <p className="text-slate-500 text-xs mt-1">or drag and drop</p>
            <p className="text-slate-400 text-xs mt-1">
              Images, videos, audio, or documents (max {maxFileSize}MB)
            </p>
          </>
        )}
      </div>

      {error && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
          {error}
        </div>
      )}
    </div>
  );
};
