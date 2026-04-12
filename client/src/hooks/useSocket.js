import { useEffect, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import useAuthStore from '../store/authStore';
import { useNotifications } from './useNotifications'; 

const SOCKET_URL = import.meta.env.VITE_API_URL 
  ? import.meta.env.VITE_API_URL.replace('/api/v1', '') 
  : 'http://localhost:5001';

export function useSocket() {
  const socketRef = useRef(null);
  const { user } = useAuthStore();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (!user?._id) return;

    // Connect to server
    socketRef.current = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket'],
    });

    const socket = socketRef.current;

    socket.on('connect', () => {
      console.log('Socket connected');
      // Register user id
      socket.emit('register', user._id);
    });

    // Listen for live triggers/nudges
    socket.on('notification', (data) => {
      // Trigger a toast or update local unread counts
      addNotification(data.payload);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, [user?._id, addNotification]);

  const emit = useCallback((event, data) => {
    if (socketRef.current?.connected) {
      socketRef.current.emit(event, data);
    }
  }, []);

  return { emit, connected: !!socketRef.current?.connected };
}
