import api from './api';

export const authService = {
  /**
   * Login with email and password
   */
  async login({ email, password }) {
    console.log('AuthService: Attempting login for', email);
    const data = await api.post('/auth/login', { email, password });
    console.log('AuthService: Login response received', !!data.token);
    if (data.token) {
      localStorage.setItem('wellness_token', data.token);
      localStorage.setItem('wellness_user', JSON.stringify(data.user));
    }
    return data;
  },

  /**
   * Register a new user
   */
  async signup({ name, email, password }) {
    console.log('AuthService: Attempting signup for', email);
    const data = await api.post('/auth/signup', { name, email, password });
    console.log('AuthService: Signup response received', !!data.token);
    if (data.token) {
      localStorage.setItem('wellness_token', data.token);
      localStorage.setItem('wellness_user', JSON.stringify(data.user));
    }
    return data;
  },

  /**
   * Refresh JWT token
   */
  async refreshToken() {
    const data = await api.post('/auth/refresh');
    if (data.token) {
      localStorage.setItem('wellness_token', data.token);
    }
    return data;
  },

  /**
   * Logout — clear local storage
   */
  logout() {
    localStorage.removeItem('wellness_token');
    localStorage.removeItem('wellness_user');
  },

  /**
   * Get current user from local storage (no network call)
   */
  getCurrentUser() {
    const raw = localStorage.getItem('wellness_user');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!localStorage.getItem('wellness_token');
  },
};

export default authService;
