import React, { useState } from 'react';
import { Calendar, Clock, Loader, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import useAuthStore from '../../store/authStore';

export default function RoutineAIPlanner() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [routine, setRoutine] = useState(null);

  const generateRoutine = async () => {
    setLoading(true);
    try {
      const { default: api } = await import('../../services/api');
      const res = await api.get('/coach/routine');
      if (res.data) {
        setRoutine(res.data);
      }
    } catch (error) {
      console.error("Failed to generate routine:", error);
      // Fallback
      setRoutine([
        { day: 'Monday', focus: 'Cardio & Mobility', duration: '45 min', completed: false },
        { day: 'Tuesday', focus: 'Upper Body Strength', duration: '60 min', completed: false },
        { day: 'Wednesday', focus: 'Active Recovery (Yoga)', duration: '30 min', completed: false },
        { day: 'Thursday', focus: 'Lower Body Strength', duration: '60 min', completed: false },
        { day: 'Friday', focus: 'HIIT & Core', duration: '40 min', completed: false },
        { day: 'Saturday', focus: 'Long Outdoor Run', duration: '90 min', completed: false },
        { day: 'Sunday', focus: 'Rest & Meal Prep', duration: '--', completed: false },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <div className="glass-card" style={{ padding: '30px', textAlign: 'center', marginBottom: '24px' }}>
        <div style={{ display: 'inline-flex', padding: '12px', background: 'rgba(79,141,255,0.1)', borderRadius: '50%', marginBottom: '16px' }}>
          <Calendar size={32} color="var(--c-blue)" />
        </div>
        <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '12px' }}>Routine AI Planner</h2>
        <p style={{ color: 'var(--c-text-secondary)', fontSize: '16px', marginBottom: '24px' }}>
          Let our AI analyze your availability, recovery metrics, and goals ({user?.goals?.join(', ') || 'Weight Loss'}) to build a perfectly optimized weekly schedule.
        </p>
        <button 
          onClick={generateRoutine} 
          disabled={loading}
          className="btn-primary"
          style={{ width: '100%', maxWidth: '300px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '16px', padding: '16px' }}
        >
          {loading ? <Loader className="spin" size={20} /> : <Sparkles size={20} />}
          {loading ? 'Analyzing Schedule...' : 'Generate My Routine'}
        </button>
      </div>

      {routine && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '20px' }}>Your AI-Optimized Week</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {routine.map((day, i) => (
              <div key={day.day} style={{ 
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
                padding: '16px', background: 'var(--c-bg-hover)', borderRadius: 'var(--r-lg)',
                border: day.completed ? '1px solid var(--c-teal)' : '1px solid var(--c-border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: day.completed ? 'var(--c-teal)' : 'var(--c-bg-card)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {day.completed ? <CheckCircle2 size={20} color="white" /> : <span style={{ fontWeight: 800, color: 'var(--c-text-muted)', fontSize: '14px' }}>{day.day.substring(0, 2)}</span>}
                  </div>
                  <div>
                    <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--c-text-primary)' }}>{day.day}</div>
                    <div style={{ fontSize: '14px', color: 'var(--c-text-secondary)' }}>{day.focus}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--c-text-muted)', fontSize: '14px', fontWeight: 600 }}>
                  <Clock size={16} />
                  {day.duration}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
