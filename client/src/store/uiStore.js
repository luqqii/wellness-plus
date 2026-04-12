import { create } from 'zustand';

const useUIStore = create((set) => ({
  sidebarCollapsed: false,
  activeModal: null,
  theme: 'dark',
  notifications: [],
  unreadCount: 3,

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  setSidebarCollapsed: (val) => set({ sidebarCollapsed: val }),
  openModal: (modalId) => set({ activeModal: modalId }),
  closeModal: () => set({ activeModal: null }),
  setTheme: (theme) => set({ theme }),
  markNotificationsRead: () => set({ unreadCount: 0 }),
}));

export default useUIStore;
