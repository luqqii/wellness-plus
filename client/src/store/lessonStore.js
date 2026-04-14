import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const CURRICULUM = [
  {
    week: 'Week 1 — Foundation',
    lessons: [
      { id: 1, title: 'Why diets fail — and what actually works', duration: '4 min', content: 'Traditional diets create a restrictive mindset that triggers rebound eating. Research shows 95% of diets fail within 5 years. Wellness+ takes a different approach: we change your psychology, not just your plate.\\n\\n**Key Insight:** You don\'t have a willpower problem. You have an environment and habit problem. Let\'s fix that.' },
      { id: 2, title: 'The psychology of fullness', duration: '3 min', content: 'Your body has two hunger systems: physical hunger (stomach) and psychological hunger (brain). Most overeating is driven by the brain, not the stomach.\\n\\n**The 20-Minute Rule:** It takes 20 minutes for your stomach to signal fullness to your brain. Slowing down your eating is one of the most powerful behavioral changes you can make.' },
      { id: 3, title: 'Understanding your eating triggers', duration: '5 min', content: 'Emotional eating triggers are external (boredom, stress, social pressure) or internal (negative self-talk, anxiety). Today\'s exercise:\\n\\n1. Keep a 24-hour food + emotion log\\n2. Note your mood before each meal/snack\\n3. Identify the top 3 triggers that drive unplanned eating for you' },
      { id: 4, title: 'Your relationship with food', duration: '4 min', content: 'We attach moral value to food — "good" foods and "bad" foods. This creates shame cycles. Wellness+ uses a Neutral Food Philosophy: food has no moral value. It is information.\\n\\nGreen foods are information about low caloric density. Orange foods are information about high caloric density. Neither makes you a good or bad person.' },
    ]
  },
  {
    week: 'Week 2 — Habit Architecture',
    lessons: [
      { id: 5, title: 'The habit loop: cue, routine, reward', duration: '4 min', content: 'Every habit has 3 components: a Cue (trigger), Routine (behavior), and Reward (payoff). To change a habit, you only need to change the Routine while keeping the Cue and Reward the same.\\n\\nExample: Stress (cue) → Chips (old routine) → Temporary relief (reward)\\nNew loop: Stress (cue) → 5-minute walk (new routine) → Temporary relief (reward)' },
      { id: 6, title: 'Habit stacking for busy people', duration: '3 min', content: 'Habit stacking anchors new behaviors to existing ones. Formula:\\n"After I [CURRENT HABIT], I will [NEW HABIT]."\\n\\nExamples:\\n- After I pour my morning coffee, I will log my breakfast\\n- After I sit at my desk, I will drink a glass of water\\n- After dinner, I will take a 10-minute walk', locked: true },
      { id: 7, title: 'The 2-minute rule for sustainable change', duration: '2 min', content: 'If a new habit takes more than 2 minutes to start, you\'re making it too hard. Scale it down until the starting barrier is near zero.\\n\\nWant to exercise daily? Start by just putting on your gym clothes.\\nWant to eat healthier? Start by just adding one vegetable to one meal per day.', locked: true },
    ]
  },
  {
    week: 'Week 3 — Mindful Eating',
    lessons: [
      { id: 8, title: 'Mindful eating 101', duration: '5 min', content: '', locked: true },
      { id: 9, title: 'The hunger scale', duration: '3 min', content: '', locked: true },
      { id: 10, title: 'Social eating survival guide', duration: '4 min', content: '', locked: true },
    ]
  }
];

const useLessonStore = create(
  persist(
    (set, get) => ({
      completedIds: [1], // Default some as completed for visual demo
      
      markComplete: (id) => set((state) => ({
        completedIds: state.completedIds.includes(id) 
          ? state.completedIds 
          : [...state.completedIds, id]
      })),
      
      isCompleted: (id) => get().completedIds.includes(id),
      
      getCurriculum: () => CURRICULUM,
      
      getDailyLessons: () => {
        // Return first 3 lessons for the dashboard preview
        return CURRICULUM[0].lessons.slice(0, 3);
      }
    }),
    {
      name: 'wellness-lessons-storage',
    }
  )
);

export default useLessonStore;
