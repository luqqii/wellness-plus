import { useState, useCallback, useEffect } from 'react';
import useHabitStore from '../store/habitStore';
import api from '../services/api';

/**
 * useHabits — habit management hook connected to backend backend
 */
export function useHabits() {
  const { habits, setHabits, toggleHabit, addHabit, updateHabit, removeHabit } = useHabitStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial habits
  const fetchHabits = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get('/habits');
      // Normalize completion for today to UI state
      const today = new Date().setHours(0,0,0,0);
      const habitsList = Array.isArray(res) ? res : (res?.data || []);
      const normalized = habitsList.map(h => ({
        ...h,
        id: h._id || h.id,
        completedToday: h.progress?.some(p => new Date(p.date).getTime() === today && p.completed) || false,
      }));
      setHabits(normalized);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [setHabits]);

  useEffect(() => {
    fetchHabits();
  }, [fetchHabits]);

  const toggle = useCallback(async (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return;
    
    const newStatus = !habit.completedToday;
    
    // Optimistic UI
    toggleHabit(habitId);
    
    try {
      await api.post(`/habits/${habitId}/toggle`, {
        date: new Date().toISOString(),
        completed: newStatus
      });
    } catch (err) {
      console.error('Failed to toggle habit', err);
      // Revert on failure
      toggleHabit(habitId);
    }
  }, [habits, toggleHabit]);

  const create = useCallback(async (habitData) => {
    setLoading(true);
    try {
      const res = await api.post('/habits', habitData);
      addHabit({ ...res.data, id: res.data._id, completedToday: false });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [addHabit]);

  const update = useCallback(async (id, updates) => {
    try {
      const res = await api.put(`/habits/${id}`, updates);
      updateHabit(id, { ...res.data, id: res.data._id });
    } catch (err) {
      setError(err.message);
    }
  }, [updateHabit]);

  const remove = useCallback(async (id) => {
    try {
      await api.delete(`/habits/${id}`);
      removeHabit(id);
    } catch (err) {
      setError(err.message);
    }
  }, [removeHabit]);

  // Computed values
  const completedToday = habits.filter(h => h.completedToday).length;
  const totalActive    = habits.filter(h => h.active !== false).length;
  const completionRate = totalActive > 0 ? Math.round((completedToday / totalActive) * 100) : 0;

  return {
    habits,
    loading,
    error,
    completedToday,
    totalActive,
    completionRate,
    toggle,
    create,
    update,
    remove,
    refresh: fetchHabits,
  };
}

export default useHabits;
