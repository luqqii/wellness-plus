// Mock user data and sample data for development

export const SAMPLE_USER = {
  id: 'usr_001',
  name: 'Alex',
  email: 'alex@example.com',
  profilePic: null,
  goals: [
    { type: 'weight_loss', target: '10 lbs', deadline: '2026-06-01' },
    { type: 'stress_reduction', target: 'Daily meditation', deadline: null },
  ],
  preferences: { theme: 'dark', notifications: { push: true, email: true }, units: 'imperial' },
  onboarding: { completed: true },
};

export const GOAL_OPTIONS = [
  { id: 'weight_loss', label: 'Lose Weight', icon: '🏋️', color: '#ef4444' },
  { id: 'muscle_gain', label: 'Build Muscle', icon: '💪', color: '#f59e0b' },
  { id: 'stress_reduction', label: 'Reduce Stress', icon: '🧘', color: '#8b5cf6' },
  { id: 'better_sleep', label: 'Sleep Better', icon: '😴', color: '#3b82f6' },
  { id: 'eat_healthy', label: 'Eat Healthier', icon: '🥗', color: '#22c55e' },
  { id: 'more_energy', label: 'More Energy', icon: '⚡', color: '#ff9f0a' },
  { id: 'mindfulness', label: 'Mindfulness', icon: '🧠', color: '#ec4899' },
  { id: 'endurance', label: 'Build Endurance', icon: '🏃', color: '#06b6d4' },
];

export const MOOD_OPTIONS = [
  { value: 'great', label: 'Great', emoji: '😄', color: '#22c55e' },
  { value: 'good', label: 'Good', emoji: '🙂', color: '#84cc16' },
  { value: 'okay', label: 'Okay', emoji: '😐', color: '#f59e0b' },
  { value: 'low', label: 'Low', emoji: '😔', color: '#f97316' },
  { value: 'bad', label: 'Bad', emoji: '😞', color: '#ef4444' },
];

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', icon: 'LayoutDashboard' },
  { id: 'habits', label: 'Habits', path: '/habits', icon: 'Target' },
  { id: 'coach', label: 'AI Coach', path: '/coach', icon: 'MessageCircle' },
  { id: 'nutrition', label: 'Nutrition', path: '/nutrition', icon: 'Apple' },
  { id: 'activity', label: 'Activity', path: '/activity', icon: 'Activity' },
];

export const SAMPLE_METRICS = {
  today: {
    steps: 7842,
    sleep: { hours: 7.2, quality: 8 },
    stressLevel: 4,
    mood: 'good',
    nutrition: { calories: 1850, protein: 95, carbs: 210, fat: 62, water: 6 },
    activity: [{ type: 'Walking', duration: 45, intensity: 'moderate' }],
    wellnessScore: 78,
  },
  weeklyScores: [
    { day: 'Mon', score: 72, steps: 6200 },
    { day: 'Tue', score: 68, steps: 5800 },
    { day: 'Wed', score: 81, steps: 9100 },
    { day: 'Thu', score: 75, steps: 7500 },
    { day: 'Fri', score: 78, steps: 7842 },
    { day: 'Sat', score: null, steps: null },
    { day: 'Sun', score: null, steps: null },
  ],
};

const generateProgress = (prob) => {
  const p = [];
  const today = new Date();
  for (let i = 100; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    if (Math.random() < prob) p.push({ date: d.toISOString().split('T')[0], completed: true });
  }
  return p;
};

export const SAMPLE_HABITS = [
  { id: 'h1', title: 'Morning Meditation', icon: '🧘', color: '#8b5cf6', streak: { current: 12, longest: 18 }, completedToday: true, frequency: { type: 'daily' }, time: '07:00', progress: generateProgress(0.8) },
  { id: 'h2', title: 'Drink 8 glasses of water', icon: '💧', color: '#3b82f6', streak: { current: 5, longest: 14 }, completedToday: false, frequency: { type: 'daily' }, time: null, progress: generateProgress(0.6) },
  { id: 'h3', title: '30-min workout', icon: '🏋️', color: '#ef4444', streak: { current: 3, longest: 10 }, completedToday: false, frequency: { type: 'daily' }, time: '18:00', progress: generateProgress(0.4) },
  { id: 'h4', title: 'Read 20 pages', icon: '📚', color: '#f59e0b', streak: { current: 8, longest: 22 }, completedToday: true, frequency: { type: 'daily' }, time: '21:00', progress: generateProgress(0.7) },
  { id: 'h5', title: 'No sugar after 6pm', icon: '🍬', color: '#ec4899', streak: { current: 2, longest: 7 }, completedToday: false, frequency: { type: 'daily' }, time: '18:00', progress: generateProgress(0.3) },
  { id: 'h6', title: 'Evening stretching', icon: '🤸', color: '#06b6d4', streak: { current: 15, longest: 15 }, completedToday: false, frequency: { type: 'daily' }, time: '22:00', progress: generateProgress(0.9) },
];

export const SAMPLE_INSIGHTS = [
  { id: 'i1', type: 'prediction', title: 'Stress Alert', content: 'Based on your sleep patterns, you may experience elevated stress today. Consider a 10-min meditation break.', icon: '⚠️', priority: 'high', timestamp: new Date() },
  { id: 'i2', type: 'suggestion', title: 'Hydration Boost', content: 'You\'ve been averaging 5 glasses of water. Try keeping a bottle at your desk to hit your 8-glass goal.', icon: '💡', priority: 'medium', timestamp: new Date() },
  { id: 'i3', type: 'achievement', title: 'Streak Master', content: 'Amazing! You\'ve maintained your meditation habit for 12 consecutive days!', icon: '🏆', priority: 'low', timestamp: new Date() },
  { id: 'i4', type: 'forecast', title: 'Weekly Outlook', content: 'Your recovery trend looks positive. This week is ideal for increasing workout intensity by 10%.', icon: '📊', priority: 'medium', timestamp: new Date() },
];

export const SAMPLE_CONVERSATIONS = [];

export const SAMPLE_NUTRITION = {
  meals: [
    { id: 'm1', name: 'Oatmeal with berries', type: 'breakfast', calories: 350, protein: 12, carbs: 55, fat: 8, time: '08:00' },
    { id: 'm2', name: 'Grilled chicken salad', type: 'lunch', calories: 520, protein: 42, carbs: 30, fat: 22, time: '12:30' },
    { id: 'm3', name: 'Greek yogurt', type: 'snack', calories: 150, protein: 15, carbs: 12, fat: 5, time: '15:00' },
  ],
  targets: { calories: 2200, protein: 120, carbs: 275, fat: 73, water: 8 },
};

export const WELLNESS_SCORE_COLORS = {
  excellent: '#22c55e',   // 80-100
  good: '#84cc16',        // 60-79
  fair: '#f59e0b',        // 40-59
  poor: '#ef4444',        // 0-39
};

export function getScoreColor(score) {
  if (score >= 80) return WELLNESS_SCORE_COLORS.excellent;
  if (score >= 60) return WELLNESS_SCORE_COLORS.good;
  if (score >= 40) return WELLNESS_SCORE_COLORS.fair;
  return WELLNESS_SCORE_COLORS.poor;
}

export function getScoreLabel(score) {
  if (score >= 80) return 'Excellent';
  if (score >= 60) return 'Good';
  if (score >= 40) return 'Fair';
  return 'Needs Attention';
}
