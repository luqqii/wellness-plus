import {
  LayoutDashboard, Target, MessageCircle, Utensils, Activity,
  User, Settings, Sparkles, Brain, Calendar, ChefHat,
  Calculator, FlaskConical, PersonStanding, Scale, BookOpen, Users, Salad, Heart
} from 'lucide-react';

export const NAV_ITEMS = [
  { path: '/dashboard',     label: 'Dashboard',      icon: LayoutDashboard },
  { path: '/check-in',      label: 'Daily Check-in', icon: Heart, badge: 'New' },
  { path: '/habits',        label: 'Habits',         icon: Target },
  { path: '/coach',         label: 'AI Coach',       icon: Brain, badge: 'AI' },
  { path: '/nutrition',     label: 'Food Diary',     icon: Utensils },
  { path: '/meal-planner',  label: 'Meal Planner',   icon: Calendar },
  { path: '/recipes',       label: 'Recipes',        icon: ChefHat },
  { path: '/activity',      label: 'Activity',       icon: Activity },
  { path: '/lessons',       label: 'Courses',        icon: BookOpen },
  { path: '/weight-tracker',label: 'Weight Tracker', icon: Scale },
  { path: '/community',     label: 'Group Sessions', icon: Users },
  { path: '/food-guide',    label: 'Food Color Guide',icon: Salad },
];

export const FREE_TOOLS = [
  { path: '/macro-calculator',          label: 'Macro Calculator',  icon: Calculator },
  { path: '/calorie-deficit-calculator', label: 'Calorie Calc',     icon: FlaskConical },
  { path: '/personality-quiz',           label: 'Personality Quiz', icon: PersonStanding },
  { path: '/bmi-calculator',             label: 'BMI Calculator',   icon: Scale },
];

export const BOTTOM_ITEMS = [
  { path: '/profile',  label: 'Profile',  icon: User },
  { path: '/settings', label: 'Settings', icon: Settings },
];
