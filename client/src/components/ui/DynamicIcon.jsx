import React from 'react';
import { 
  Brain, Droplets, Activity, BookOpen, Ban, Compass, 
  CircleDot, Moon, Apple, Music, Edit3, Heart, Bike, Mountain,
  Smile, Frown, Meh, Trophy, AlertTriangle, Lightbulb, BarChart2,
  Sun, Sandwich, Coffee, CloudRain, Flame, Zap,
  Footprints, Utensils
} from 'lucide-react';

const EMOJI_TO_LUCIDE_MAP = {
  // Habits
  '🧘': Brain,
  '💧': Droplets,
  '🏋️': Activity,
  '📚': BookOpen,
  '🍬': Ban,
  '🤸': Compass,
  '🏃': Activity,
  '🎯': CircleDot,
  '💤': Moon,
  '🥗': Apple,
  '🧠': Brain,
  '🎵': Music,
  '✍️': Edit3,
  '🌿': Heart,
  '🚴': Bike,
  '🧗': Mountain,
  '💪': Activity,
  '😴': Moon,
  '⚡': Zap,
  // Dashboard & Activity
  '🌧️': CloudRain,
  '🔥': Flame,
  '👣': Footprints,
  // Nutrition
  '☀️': Sun,
  '🌞': Sun,
  '🥙': Utensils,
  '🍎': Apple,
  '🌙': Moon,
  // Moods
  '😄': Smile,
  '🙂': Smile,
  '😐': Meh,
  '😔': Frown,
  '😞': Frown,
  // Insights
  '⚠️': AlertTriangle,
  '💡': Lightbulb,
  '🏆': Trophy,
  '📊': BarChart2,
};

export default function DynamicIcon({ icon, size = 18, color = 'currentColor', className = '' }) {
  // If it's a known string matching an emoji, render the Lucide icon instead
  if (typeof icon === 'string' && EMOJI_TO_LUCIDE_MAP[icon]) {
    const IconCmp = EMOJI_TO_LUCIDE_MAP[icon];
    return <IconCmp size={size} color={color} className={className} strokeWidth={2.5} />;
  }

  // Fallback: If it's an unrecognized string (like a missing native emoji), return standard CircleDot
  // Or just render the string (emoji fallback). No, we want to enforce SVGs for professionalism.
  if (typeof icon === 'string') {
    return <CircleDot size={size} color={color} className={className} strokeWidth={2.5} />;
  }

  // Fallback for React Elements (just pass it through if they passed a real icon)
  return icon || <CircleDot size={size} color={color} strokeWidth={2.5} />;
}
