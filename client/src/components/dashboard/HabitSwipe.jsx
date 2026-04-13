import React from 'react';
import { motion } from 'framer-motion';
import { Check, Flame } from 'lucide-react';
import useHabitStore from '../../store/habitStore';
import DynamicIcon from '../ui/DynamicIcon';

export default function HabitSwipe() {
  const { habits, toggleHabit } = useHabitStore();

  return (
    <div style={{
      display: 'flex',
      gap: 10,
      overflowX: 'auto',
      paddingBottom: 4,
      paddingTop: 2,
    }}>
      {habits.map((habit, i) => (
        <motion.button
          key={habit.id}
          onClick={() => toggleHabit(habit.id)}
          className={`habit-pill ${habit.completedToday ? 'completed' : ''}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          whileTap={{ scale: 0.94 }}
        >
          {habit.completedToday && (
            <div className="habit-check">
              <Check size={9} color="white" />
            </div>
          )}
          <div className="habit-pill-icon">
            <DynamicIcon icon={habit.icon} size={24} color={habit.completedToday ? 'var(--c-orange)' : habit.color || 'var(--c-text-primary)'} />
          </div>
          <div className="habit-pill-label">{habit.title}</div>
          <div className="habit-pill-streak" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Flame size={12} color="var(--c-orange)" /> 
            {habit.streak.current}
          </div>
        </motion.button>
      ))}
    </div>
  );
}
