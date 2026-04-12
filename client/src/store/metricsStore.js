import { create } from 'zustand';

const useMetricsStore = create((set, get) => ({
  // Today's metrics
  todayMetrics: {
    steps: 6842,
    stepGoal: 10000,
    sleep: { hours: 7.2, quality: 7 },
    stressLevel: 4,
    mood: 'good',
    nutrition: {
      calories: 1640,
      calorieGoal: 2100,
      protein: 98,
      carbs: 210,
      fat: 52,
      water: 6,
    },
    wellnessScore: 74,
  },

  // Weekly trend data
  weeklyTrend: [
    { day: 'Mon', score: 68, steps: 7200, sleep: 7.0 },
    { day: 'Tue', score: 72, steps: 9100, sleep: 7.5 },
    { day: 'Wed', score: 65, steps: 5400, sleep: 6.5 },
    { day: 'Thu', score: 78, steps: 11200, sleep: 8.0 },
    { day: 'Fri', score: 74, steps: 8300, sleep: 7.2 },
    { day: 'Sat', score: 80, steps: 12000, sleep: 8.5 },
    { day: 'Sun', score: 74, steps: 6842, sleep: 7.2 },
  ],

  isLoading: false,
  error: null,

  // Actions
  setTodayMetrics: (metrics) => set({ todayMetrics: metrics }),
  
  updateTodayMetrics: (updates) =>
    set(state => ({
      todayMetrics: { ...state.todayMetrics, ...updates },
    })),

  updateNutrition: (updates) =>
    set(state => ({
      todayMetrics: {
        ...state.todayMetrics,
        nutrition: { ...state.todayMetrics.nutrition, ...updates },
      },
    })),

  fetchData: async (apiInstance) => {
    set({ isLoading: true, error: null });
    try {
      const [todayRes, trendRes] = await Promise.all([
        apiInstance.get('/metrics'),
        apiInstance.get('/metrics/trend')
      ]);
      
      if (todayRes.data?.data) {
        set(state => ({ 
          todayMetrics: { ...state.todayMetrics, ...todayRes.data.data } 
        }));
      }
      
      if (trendRes.data?.data) {
        const trend = trendRes.data.data.map(m => ({
          day: new Date(m.date).toLocaleDateString('en-US', { weekday: 'short' }),
          score: m.wellnessScore || 50,
          steps: m.steps || 0,
          sleep: m.sleep?.hours || 0
        }));
        set({ weeklyTrend: trend });
      }
    } catch (error) {
      set({ error: error.message });
    } finally {
      set({ isLoading: false });
    }
  },

  setLoading: (v) => set({ isLoading: v }),
  setError: (e) => set({ error: e }),
}));

export default useMetricsStore;
