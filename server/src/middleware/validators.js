import { z } from 'zod';

// ==========================================
// Auth Schemas
// ==========================================
export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(50, 'Name too long'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

// ==========================================
// Metrics Schemas
// ==========================================
export const saveMetricsSchema = z.object({
  date: z.string().datetime().optional(),
  steps: z.number().int().min(0).optional(),
  sleep: z.object({
    hours: z.number().min(0).max(24).optional(),
    quality: z.number().int().min(1).max(10).optional(),
  }).optional(),
  stressLevel: z.number().int().min(1).max(10).optional(),
  mood: z.enum(['great', 'good', 'okay', 'low', 'bad']).optional(),
  nutrition: z.object({
    calories: z.number().min(0).optional(),
    protein: z.number().min(0).optional(),
    carbs: z.number().min(0).optional(),
    fat: z.number().min(0).optional(),
    water: z.number().int().min(0).optional(),
  }).optional(),
  wellnessScore: z.number().min(0).max(100).optional(),
});

// ==========================================
// Habit Schemas
// ==========================================
export const createHabitSchema = z.object({
  title: z.string().min(1, 'Title is required').max(60, 'Title too long'),
  description: z.string().max(200).optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  frequency: z.object({
    type: z.enum(['daily', 'weekly', 'some_days']).optional(),
    days: z.array(z.number().int().min(0).max(6)).optional(),
    timesPerDay: z.number().int().min(1).optional(),
  }).optional(),
  timeTemplate: z.enum(['any', 'morning', 'afternoon', 'evening']).optional(),
});

export const toggleHabitSchema = z.object({
  date: z.string().optional(),
  completed: z.boolean(),
});

// ==========================================
// Coach / Chat Schema
// ==========================================
export const chatSchema = z.object({
  message: z.string().min(1, 'Message is required').max(2000, 'Message too long'),
  conversationId: z.string().optional(),
});

// ==========================================
// Nutrition Schemas
// ==========================================
export const addFoodSchema = z.object({
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snacks'], {
    required_error: 'Meal type is required',
  }),
  customFood: z.object({
    name: z.string().min(1),
    calories: z.number().min(0).optional(),
    protein: z.number().min(0).optional(),
    carbs: z.number().min(0).optional(),
    fat: z.number().min(0).optional(),
  }).optional(),
  servingsConsumed: z.number().min(0.1).optional(),
});

// ==========================================
// Notification Schema
// ==========================================
export const triggerNotificationSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  message: z.string().min(1, 'Message is required'),
  type: z.enum(['insight', 'reminder', 'alert', 'achievement']).optional(),
  actionUrl: z.string().url().optional(),
});

// ==========================================
// Insight Schema
// ==========================================
export const generateInsightSchema = z.object({
  category: z.enum(['nutrition', 'activity', 'sleep', 'stress', 'habit', 'general']).optional(),
});

// ==========================================
// User Profile Update Schema
// ==========================================
export const updateProfileSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  profilePic: z.string().optional(),
  goals: z.array(z.enum(['weight_loss', 'muscle_gain', 'stress', 'energy', 'nutrition', 'fitness'])).optional(),
    preferences: z.object({
      theme: z.enum(['light', 'dark', 'auto']).optional(),
      notifications: z.object({
        push: z.boolean().optional(),
        email: z.boolean().optional(),
      }).optional(),
      units: z.enum(['metric', 'imperial']).optional(),
      nutrition: z.object({
        calorieGoal: z.number().positive().optional(),
        goalMode: z.enum(['deficit', 'surplus']).optional(),
      }).optional(),
    }).optional(),
  onboarding: z.object({
    completed: z.boolean().optional(),
    lifestyle: z.enum(['sedentary', 'light', 'moderate', 'very_active']).optional(),
    schedule: z.object({
      wakeTime: z.string().optional(),
      sleepTime: z.string().optional(),
    }).optional(),
    baseline: z.object({
      weight: z.number().positive().optional(),
      height: z.number().positive().optional(),
      stepGoal: z.number().int().positive().optional(),
      sleepGoal: z.number().positive().optional(),
    }).optional(),
  }).optional(),
  password: z.string().min(8).optional(),
});
