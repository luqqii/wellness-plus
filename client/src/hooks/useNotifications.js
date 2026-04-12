import { create } from 'zustand';
import api from '../services/api';

const useNotificationStore = create((set, get) => ({
  notifications: [],
  unreadCount: 0,
  
  setNotifications: (notifications) => {
    set({
      notifications,
      unreadCount: notifications.filter((n) => !n.read).length,
    });
  },

  addNotification: (notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    }));
  },

  markAsRead: async (id) => {
    // Optimistic UI
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n._id === id ? { ...n, read: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));

    try {
      await api.put(`/notifications/${id}/read`);
    } catch (e) {
      console.error('Failed to mark read', e);
    }
  },

  fetchNotifications: async () => {
    try {
      const { data } = await api.get('/notifications');
      if (data?.data) {
        get().setNotifications(data.data);
      }
    } catch (e) {
      console.error(e);
    }
  }
}));

export function useNotifications() {
  const store = useNotificationStore();
  return store;
}
