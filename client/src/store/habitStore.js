import { create } from 'zustand';
import { SAMPLE_HABITS } from '../utils/constants';

const useHabitStore = create((set, get) => ({
  habits: SAMPLE_HABITS,
  isLoading: false,

  setHabits: (habits) => set({ habits }),

  toggleHabit: (habitId) => {
    const todayStr = new Date().toISOString().split('T')[0];
    set((state) => ({
      habits: state.habits.map((h) => {
        if (h.id === habitId) {
          const isCompleting = !h.completedToday;
          let newProgress = [...(h.progress || [])];
          
          const todayIdx = newProgress.findIndex(p => p.date === todayStr);
          if (todayIdx > -1) {
            newProgress[todayIdx] = { ...newProgress[todayIdx], completed: isCompleting };
          } else {
            newProgress.push({ date: todayStr, completed: isCompleting });
          }

          return {
            ...h,
            completedToday: isCompleting,
            streak: {
              ...h.streak,
              current: isCompleting ? h.streak.current + 1 : Math.max(0, h.streak.current - 1),
              longest: isCompleting && h.streak.current + 1 > h.streak.longest ? h.streak.current + 1 : h.streak.longest
            },
            progress: newProgress
          };
        }
        return h;
      }),
    }));
  },

  addHabit: (habitData) => {
    const newHabit = {
      id: habitData.id || Date.now() + Math.random().toString(36).substr(2, 5),
      title: habitData.title || 'New Habit',
      icon: habitData.icon || '🎯',
      color: habitData.color || 'var(--c-blue)',
      timeTemplate: habitData.timeTemplate || 'any',
      completedToday: habitData.completedToday || false,
      streak: habitData.streak || { current: 0, longest: 0 },
      history: habitData.history || [],
      progress: habitData.progress || [],
      ...habitData
    };
    set((state) => ({ habits: [newHabit, ...state.habits] }));
  },

  updateHabit: (id, updates) => {
    set((state) => ({
      habits: state.habits.map((h) => (h.id === id ? { ...h, ...updates } : h)),
    }));
  },

  deleteHabit: (habitId) => {
    set((state) => ({ habits: state.habits.filter((h) => h.id !== habitId) }));
  },

  getCompletionRate: () => {
    const { habits } = get();
    if (habits.length === 0) return 0;
    return Math.round((habits.filter((h) => h.completedToday).length / habits.length) * 100);
  },
}));

export default useHabitStore;
