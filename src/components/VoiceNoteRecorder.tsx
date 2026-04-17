'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';

interface VoiceNoteRecorderProps {
  onRecordingComplete?: (base64: string, duration: number) => void;
  onCancel?: () => void;
  maxDuration?: number; // in seconds
}

export const VoiceNoteRecorder: React.FC<VoiceNoteRecorderProps> = ({
  onRecordingComplete,
  onCancel,
  maxDuration = 300, // 5 minutes
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [error, setError] = useState('');
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const handleStopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const reader = new FileReader();

        reader.onload = (e) => {
          const base64 = e.target?.result as string;
          const base64Data = base64.split(',')[1];
          onRecordingComplete?.(base64Data, duration);
        };

        reader.readAsDataURL(audioBlob);
      };

      setIsRecording(false);

      // Stop stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
  }, [isRecording, onRecordingComplete, duration]);

  useEffect(() => {
    if (isRecording && duration >= maxDuration) {
      handleStopRecording();
    }
  }, [duration, maxDuration, isRecording, handleStopRecording]);

  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);

  const handleStartRecording = async () => {
    try {
      setError('');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setDuration(0);
    } catch (err: unknown) {
      setError('Failed to access microphone. Please check permissions.');
      console.error('Microphone error:', err);
    }
  };

  const handleCancel = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
    }

    setDuration(0);
    onCancel?.();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
      {/* Recording indicator */}
      <div className="flex items-center gap-2 flex-1">
        {isRecording && (
          <>
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-slate-900">
              Recording {formatDuration(duration)}
            </span>
          </>
        )}
        {!isRecording && duration === 0 && (
          <span className="text-sm text-slate-600">Ready to record</span>
        )}
        {!isRecording && duration > 0 && (
          <span className="text-sm text-slate-600">
            Recorded: {formatDuration(duration)}
          </span>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="text-xs text-red-600 text-center w-full">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="flex items-center gap-2">
        {!isRecording ? (
          <button
            onClick={handleStartRecording}
            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
            title="Start recording"
          >
            <svg
              className="w-5 h-5"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z" />
              <path d="M17 16.91c-1.48 1.46-3.51 2.36-5.7 2.36-2.19 0-4.22-.9-5.7-2.36M19 12h2c0 2.96-1.41 5.6-3.59 7.35l-1.42-1.41c1.63-1.44 2.66-3.5 2.66-5.8h1.35z" />
            </svg>
          </button>
        ) : (
          <>
            <button
              onClick={handleStopRecording}
              className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
              title="Stop recording"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M6 4h12v12H6z" />
              </svg>
            </button>
            <button
              onClick={handleCancel}
              className="p-2 bg-slate-400 text-white rounded-full hover:bg-slate-500 transition-colors"
              title="Cancel recording"
            >
              <svg
                className="w-5 h-5"
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
          </>
        )}
      </div>
    </div>
  );
};
