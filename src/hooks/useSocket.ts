'use client';

import { useEffect, useRef, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuthStore } from '@/store/authStore';

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const { token, user } = useAuthStore();

  const connect = useCallback(() => {
    if (!token || !user) return;

    if (socketRef.current?.connected) {
      return socketRef.current;
    }

    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3000';

    socketRef.current = io(wsUrl, {
      auth: {
        token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
    });

    socketRef.current.on('connect', () => {
      console.log('✅ Connected to WebSocket server');
    });

    socketRef.current.on('disconnect', () => {
      console.log('❌ Disconnected from WebSocket server');
    });

    socketRef.current.on('error', (error) => {
      console.error('❌ WebSocket error:', error);
    });

    return socketRef.current;
  }, [token, user]);

  const disconnect = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (token && user) {
      connect();
    }

    return () => {
      // Don't disconnect on unmount, just stop listening to cleanup
      // disconnect();
    };
  }, [token, user, connect]);

  return {
    socket: socketRef.current,
    connect,
    disconnect,
    isConnected: socketRef.current?.connected || false,
  };
};
