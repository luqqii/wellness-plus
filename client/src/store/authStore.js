import { create } from 'zustand';
import { SAMPLE_USER } from '../utils/constants';

/**
 * Global authentication store
 */
const useAuthStore = create((set) => ({
  // State
  user: SAMPLE_USER,
  isAuthenticated: true,
  isLoading: false,
  token: 'mock-jwt-token',

  // Actions
  setToken: (token) => {
    console.log('AuthStore: Setting token', !!token);
    set({ token, isAuthenticated: !!token });
  },

  setUser: (user) => {
    console.log('AuthStore: Setting user', user?.email);
    set({ user, isAuthenticated: !!user });
  },

  setLoading: (isLoading) => set({ isLoading }),

  logout: () => {
    console.log('AuthStore: Logging out');
    set({ user: null, isAuthenticated: false, token: null });
  },

  updateUser: (updates) => {
    set((state) => ({ 
      user: state.user ? { ...state.user, ...updates } : null 
    }));
  },
}));

export default useAuthStore;
