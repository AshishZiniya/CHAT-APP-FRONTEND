'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface MediaPreviewProps {
  url: string;
  type: 'image' | 'video' | 'audio' | 'document' | 'media';
  caption?: string;
  filename?: string;
  size?: number;
}

export const MediaPreview: React.FC<MediaPreviewProps> = ({
  url,
  type,
  caption,
  filename,
  size,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    const units = ['B', 'KB', 'MB', 'GB'];
    let size = bytes;
    let unitIndex = 0;

    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }

    return `${size.toFixed(1)} ${units[unitIndex]}`;
  };

  return (
    <div className="bg-slate-50 rounded-lg overflow-hidden max-w-sm">
      {type === 'image' && (
        <div
          className="cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Image
            src={url}
            alt={caption || 'Image'}
            width={400}
            height={400}
            className="w-full h-auto object-cover max-h-96"
          />
        </div>
      )}

      {type === 'video' && (
        <div>
          <video
            src={url}
            controls
            className="w-full h-auto max-h-96"
            poster={`${url}?t=0`}
          />
        </div>
      )}

      {type === 'audio' && (
        <div className="p-4">
          <div className="flex items-center gap-3">
            <svg
              className="w-12 h-12 text-blue-600"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 3v9.28c-.47-.92-1.45-1.78-2.7-1.78-2.07 0-3.73 1.66-3.73 3.73 0 2.07 1.66 3.73 3.73 3.73 1.25 0 2.23-.86 2.7-1.78V21h2V3h-2zm6-2c-.55 0-1 .45-1 1v14c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1zm-4 18c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
            </svg>
            <div className="flex-1">
              <audio src={url} controls className="w-full" />
            </div>
          </div>
        </div>
      )}

      {type === 'document' && (
        <a
          href={url}
          download
          className="flex items-center gap-3 p-4 hover:bg-slate-100 transition-colors"
        >
          <svg
            className="w-12 h-12 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-slate-900 truncate text-sm">
              {filename || 'Document'}
            </p>
            <p className="text-xs text-slate-500">{formatFileSize(size)}</p>
          </div>
          <svg
            className="w-4 h-4 text-slate-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </a>
      )}

      {caption && (
        <div className="px-4 py-2 text-sm text-slate-700 bg-slate-100">
          {caption}
        </div>
      )}

      {/* Expanded view modal */}
      {isExpanded && type === 'image' && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={() => setIsExpanded(false)}
        >
          <div className="max-w-4xl max-h-screen flex flex-col">
            <Image
              src={url}
              alt={caption || 'Image'}
              width={1200}
              height={800}
              className="max-w-full max-h-[80vh] object-contain"
            />
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-slate-100"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
