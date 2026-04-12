import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Circle, ChevronDown, ChevronUp, Clock, BookOpen, Lock } from 'lucide-react';

const CURRICULUM = [
  {
    week: 'Week 1 — Foundation',
    lessons: [
      { id: 1, title: 'Why diets fail — and what actually works', duration: '4 min', done: true, content: 'Traditional diets create a restrictive mindset that triggers rebound eating. Research shows 95% of diets fail within 5 years. Wellness+ takes a different approach: we change your psychology, not just your plate.\n\n**Key Insight:** You don\'t have a willpower problem. You have an environment and habit problem. Let\'s fix that.' },
      { id: 2, title: 'The psychology of fullness', duration: '3 min', done: true, content: 'Your body has two hunger systems: physical hunger (stomach) and psychological hunger (brain). Most overeating is driven by the brain, not the stomach.\n\n**The 20-Minute Rule:** It takes 20 minutes for your stomach to signal fullness to your brain. Slowing down your eating is one of the most powerful behavioral changes you can make.' },
      { id: 3, title: 'Understanding your eating triggers', duration: '5 min', done: false, content: 'Emotional eating triggers are external (boredom, stress, social pressure) or internal (negative self-talk, anxiety). Today\'s exercise:\n\n1. Keep a 24-hour food + emotion log\n2. Note your mood before each meal/snack\n3. Identify the top 3 triggers that drive unplanned eating for you' },
      { id: 4, title: 'Your relationship with food', duration: '4 min', done: false, content: 'We attach moral value to food — "good" foods and "bad" foods. This creates shame cycles. Wellness+ uses a Neutral Food Philosophy: food has no moral value. It is information.\n\nGreen foods are information about low caloric density. Orange foods are information about high caloric density. Neither makes you a good or bad person.' },
    ]
  },
  {
    week: 'Week 2 — Habit Architecture',
    lessons: [
      { id: 5, title: 'The habit loop: cue, routine, reward', duration: '4 min', done: false, content: 'Every habit has 3 components: a Cue (trigger), Routine (behavior), and Reward (payoff). To change a habit, you only need to change the Routine while keeping the Cue and Reward the same.\n\nExample: Stress (cue) → Chips (old routine) → Temporary relief (reward)\nNew loop: Stress (cue) → 5-minute walk (new routine) → Temporary relief (reward)' },
      { id: 6, title: 'Habit stacking for busy people', duration: '3 min', done: false, content: 'Habit stacking anchors new behaviors to existing ones. Formula:\n"After I [CURRENT HABIT], I will [NEW HABIT]."\n\nExamples:\n- After I pour my morning coffee, I will log my breakfast\n- After I sit at my desk, I will drink a glass of water\n- After dinner, I will take a 10-minute walk', locked: true },
      { id: 7, title: 'The 2-minute rule for sustainable change', duration: '2 min', done: false, content: 'If a new habit takes more than 2 minutes to start, you\'re making it too hard. Scale it down until the starting barrier is near zero.\n\nWant to exercise daily? Start by just putting on your gym clothes.\nWant to eat healthier? Start by just adding one vegetable to one meal per day.', locked: true },
    ]
  },
  {
    week: 'Week 3 — Mindful Eating',
    lessons: [
      { id: 8, title: 'Mindful eating 101', duration: '5 min', done: false, content: '', locked: true },
      { id: 9, title: 'The hunger scale', duration: '3 min', done: false, content: '', locked: true },
      { id: 10, title: 'Social eating survival guide', duration: '4 min', done: false, content: '', locked: true },
    ]
  }
];

export default function LessonsPage() {
  const [openLesson, setOpenLesson] = useState(null);
  const [completedIds, setCompletedIds] = useState([1, 2]);

  const totalLessons = CURRICULUM.flatMap(w => w.lessons).length;
  const doneCount = completedIds.length;
  const pct = Math.round((doneCount / totalLessons) * 100);

  const markDone = (id) => {
    if (!completedIds.includes(id)) setCompletedIds(p => [...p, id]);
    setOpenLesson(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800 }}>
      
      {/* Progress Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: '#0C2B35', borderRadius: 24, padding: 32, color: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
          <BookOpen size={28} color="#EC5A42" />
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, margin: 0 }}>Your Psychology Curriculum</h1>
            <p style={{ margin: '4px 0 0', color: '#9CA3AF', fontSize: 15 }}>{doneCount} of {totalLessons} lessons completed</p>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.1)', height: 10, borderRadius: 5 }}>
          <motion.div animate={{ width: `${pct}%` }} transition={{ duration: 1 }}
            style={{ height: '100%', background: '#EC5A42', borderRadius: 5 }} />
        </div>
        <div style={{ marginTop: 8, fontSize: 14, color: '#9CA3AF' }}>{pct}% complete</div>
      </motion.div>

      {/* Weekly Sections */}
      {CURRICULUM.map((week, wi) => (
        <motion.div key={wi} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: wi * 0.1 }}
          style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid #E8DED8' }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: '#0C2B35', marginBottom: 16, paddingBottom: 12, borderBottom: '2px solid #F7EBE3' }}>
            {week.week}
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {week.lessons.map((lesson) => {
              const isDone = completedIds.includes(lesson.id);
              const isOpen = openLesson === lesson.id;
              const isLocked = lesson.locked && !isDone;
              return (
                <div key={lesson.id}>
                  <div
                    onClick={() => !isLocked && setOpenLesson(isOpen ? null : lesson.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14, padding: '14px 16px',
                      borderRadius: 14, cursor: isLocked ? 'default' : 'pointer',
                      background: isDone ? '#F7EBE3' : isLocked ? '#FAFAFA' : '#FDFBF8',
                      border: `2px solid ${isDone ? '#EC5A42' : isLocked ? '#E8DED8' : '#E8DED8'}`,
                      opacity: isLocked ? 0.6 : 1, transition: 'all 150ms ease'
                    }}
                  >
                    {isDone
                      ? <CheckCircle size={22} color="#EC5A42" />
                      : isLocked
                      ? <Lock size={18} color="#9CA3AF" />
                      : <Circle size={22} color="#D1CABB" />
                    }
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 15, fontWeight: 700, color: '#0C2B35', textDecoration: isDone ? 'line-through' : 'none', opacity: isDone ? 0.7 : 1 }}>
                        {lesson.title}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                        <Clock size={12} color="#718096" />
                        <span style={{ fontSize: 12, color: '#718096', fontWeight: 600 }}>{lesson.duration} read</span>
                      </div>
                    </div>
                    {!isLocked && (isOpen ? <ChevronUp size={18} color="#718096" /> : <ChevronDown size={18} color="#718096" />)}
                  </div>

                  <AnimatePresence>
                    {isOpen && lesson.content && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                        style={{ overflow: 'hidden' }}>
                        <div style={{ padding: '20px 20px 24px', background: '#FDFBF8', borderRadius: '0 0 14px 14px', border: '2px solid #E8DED8', borderTop: 'none' }}>
                          <div style={{ fontSize: 15, lineHeight: 2, color: '#4A5568', whiteSpace: 'pre-line' }}>
                            {lesson.content.replace(/\*\*(.*?)\*\*/g, '$1')}
                          </div>
                          {!isDone && (
                            <button onClick={() => markDone(lesson.id)}
                              style={{ marginTop: 20, background: '#EC5A42', color: 'white', padding: '12px 28px', borderRadius: 999, border: 'none', fontSize: 15, fontWeight: 800, cursor: 'pointer' }}>
                              ✓ Mark as Complete
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.div>
      ))}

    </div>
  );
}
