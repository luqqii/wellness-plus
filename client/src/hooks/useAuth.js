import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import authService from '../services/authService';

/**
 * useAuth — hook for authentication actions with defensive guards
 */
export default function useAuth() {
  const store = useAuthStore();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Debugging log to verify store state on hook init
  console.log('useAuth initialized. setUser function exists:', typeof store.setUser === 'function');

  const login = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.login(credentials);
      
      // Defensive check before calling store actions
      if (typeof store.setUser === 'function') {
        store.setUser(data.user);
      } else {
        console.error('CRITICAL: setUser is missing from useAuthStore hook result');
      }
      
      if (data.user?.onboarding?.completed) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [store, navigate]);

  const signup = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const data = await authService.signup(credentials);
      
      // Defensive check before calling store actions
      if (typeof store.setUser === 'function') {
        store.setUser(data.user);
      } else {
        console.error('CRITICAL: setUser is missing from useAuthStore hook result');
      }

      navigate('/onboarding');
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [store, navigate]);

  const logout = useCallback(() => {
    authService.logout();
    if (typeof store.logout === 'function') {
      store.logout();
    }
    navigate('/login');
  }, [store, navigate]);

  return {
    user: store.user,
    loading: loading || store.isLoading,
    error,
    isAuthenticated: !!store.user || authService.isAuthenticated(),
    login,
    signup,
    logout,
  };
}
