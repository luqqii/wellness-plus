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
      { id: 6, title: 'Habit stacking for busy people', duration: '3 min', content: 'Habit stacking anchors new behaviors to existing ones. Formula:\\n"After I [CURRENT HABIT], I will [NEW HABIT]."\\n\\nExamples:\\n- After I pour my morning coffee, I will log my breakfast\\n- After I sit at my desk, I will drink a glass of water\\n- After dinner, I will take a 10-minute walk' },
      { id: 7, title: 'The 2-minute rule for sustainable change', duration: '2 min', content: 'If a new habit takes more than 2 minutes to start, you\'re making it too hard. Scale it down until the starting barrier is near zero.\\n\\nWant to exercise daily? Start by just putting on your gym clothes.\\nWant to eat healthier? Start by just adding one vegetable to one meal per day.' },
    ]
  },
  {
    week: 'Week 3 — Mindful Eating',
    lessons: [
      { id: 8, title: 'Mindful eating 101', duration: '5 min', content: 'Mindful eating is the practice of paying full attention to the experience of eating — the taste, texture, and how your body feels as you eat.\\n\\nResearch shows mindful eaters consume on average 300 fewer calories per day without feeling deprived.\\n\\n**Today\'s Practice:** Eat one meal without your phone or TV. Chew each bite 20 times. Notice what changes.' },
      { id: 9, title: 'The hunger scale', duration: '3 min', content: 'The Hunger Scale runs from 1 (starving) to 10 (uncomfortably full). The goal is to eat between 3 and 7 — never allowing yourself to get too hungry (which leads to overeating) or too full.\\n\\n1–2: Ravenous, dizzy\\n3–4: Hungry, time to eat\\n5–6: Satisfied, comfortable\\n7–8: Full\\n9–10: Stuffed, uncomfortable\\n\\nCheck in with your hunger score before, during, and after every meal this week.' },
      { id: 10, title: 'Social eating survival guide', duration: '4 min', content: 'Social situations are one of the top triggers for overeating. Peer pressure, emotional bonding over food, and abundant choices all work against your goals.\\n\\n**Strategies that work:**\\n1. Eat a small protein-rich snack before social events\\n2. Scan the full buffet before loading your plate\\n3. Be the last to start eating — slows your pace\\n4. Politely decline with "I\'m good, thank you" instead of explaining your diet' },
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
