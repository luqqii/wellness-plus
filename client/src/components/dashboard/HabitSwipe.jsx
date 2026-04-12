import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import useHabitStore from '../../store/habitStore';

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
          <div className="habit-pill-icon">{habit.icon}</div>
          <div className="habit-pill-label">{habit.title}</div>
          <div className="habit-pill-streak">🔥{habit.streak.current}</div>
        </motion.button>
      ))}
    </div>
  );
}
