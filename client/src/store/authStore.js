import { create } from 'zustand';
import { SAMPLE_USER } from '../utils/constants';

/**
 * Global authentication store
 */
const getUserFromStorage = () => {
  try {
    const stored = localStorage.getItem('wellness_user');
    return stored ? JSON.parse(stored) : SAMPLE_USER;
  } catch {
    return SAMPLE_USER;
  }
};

const getTokenFromStorage = () => {
  return localStorage.getItem('wellness_token') || 'mock-jwt-token';
};

const useAuthStore = create((set) => ({
  // State
  user: getUserFromStorage(),
  isAuthenticated: !!localStorage.getItem('wellness_token'),
  isLoading: false,
  token: getTokenFromStorage(),

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
