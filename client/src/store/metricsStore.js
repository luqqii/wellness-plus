import { create } from 'zustand';

const useMetricsStore = create((set, get) => ({
  // Today's metrics
  todayMetrics: {
    steps: null,
    stepGoal: 10000,
    sleep: null,
    stressLevel: null,
    mood: null,
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

  // Live real device sensor data
  liveSensors: {
    // Motion
    heartRate: null,    // null until real data arrives
    steps: 0,
    stressLevel: 4,
    activeCalories: 0,
    isWorkoutActive: false,
    lastMotionMag: null,
    hrSource: 'none',   // 'none' | 'bluetooth' | 'estimated'
    // GPS
    location: null,     // { latitude, longitude, altitude }
    speed: null,        // km/h
    // Orientation
    orientation: null,  // { alpha, beta, gamma }
    // Environment
    ambientLight: null, // lux
    // Device
    battery: null,      // { level, charging }
    network: null,      // { type, downlink }
    // Sleep (auto-detected or manual)
    sleep: null,        // { hours, quality, bedtime, wakeTime, source }
    // Real weather from Open-Meteo
    weather: null,      // { temp, feelsLike, humidity, windSpeed, condition, icon, type }
    // Meta
    sensorSource: 'real',
    permissionGranted: false,
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

  updateLiveSensors: (updater) =>
    set(state => {
      const updates = typeof updater === 'function' ? updater(state.liveSensors) : updater;
      return { liveSensors: { ...state.liveSensors, ...updates } };
    }),

  resetLiveSensors: () => 
    set(state => ({
      liveSensors: {
        heartRate: 72,
        steps: 0, // Reset to 0
        stressLevel: 4,
        activeCalories: 0,
        isWorkoutActive: false
      }
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
      
      if (todayRes.data) {
        set(state => ({ 
          todayMetrics: { ...state.todayMetrics, ...todayRes.data } 
        }));
      }
      
      if (trendRes.data) {
        const trend = trendRes.data.map(m => ({
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

  // Log metrics manually and sync to backend
  saveManualMetrics: async (apiInstance, updates) => {
    try {
      const payload = {};
      if (updates.steps !== undefined) payload.steps = Number(updates.steps);
      if (updates.sleepHours !== undefined) payload['sleep.hours'] = Number(updates.sleepHours);

      if (Object.keys(payload).length > 0) {
        await apiInstance.post('/metrics', payload);
        
        // Interconnect: notify all listening pages (like Activity and Dashboard) to re-fetch their charts and insights
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new Event('metrics-updated'));
        }
      }

      // Optimistically update local state immediately
      const state = get();
      
      if (updates.steps !== undefined) {
        set({
          liveSensors: { ...state.liveSensors, steps: Number(updates.steps) },
          todayMetrics: { ...state.todayMetrics, steps: Number(updates.steps) }
        });
      }
      
      if (updates.sleepHours !== undefined) {
        const sleepHours = Number(updates.sleepHours);
        set(s => ({
          todayMetrics: { 
            ...s.todayMetrics, 
            sleep: { ...(s.todayMetrics.sleep || {}), hours: sleepHours } 
          }
        }));
      }
      
      return true;
    } catch (err) {
      console.error('[MetricsStore] Save Manual Error:', err);
      return false;
    }
  },
}));

export default useMetricsStore;
