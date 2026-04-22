import React from 'react';
import { motion } from 'framer-motion';
import { Activity, RefreshCw, Zap, HeartPulse, BrainCircuit } from 'lucide-react';
import useMetricsStore from '../../store/metricsStore';

export default function LiveSensorPanel() {
  const liveSensors = useMetricsStore((s) => s.liveSensors);
  const resetLiveSensors = useMetricsStore((s) => s.resetLiveSensors);
  const updateLiveSensors = useMetricsStore((s) => s.updateLiveSensors);

  const simulateWorkout = () => {
    updateLiveSensors({ 
      isWorkoutActive: true, 
      heartRate: 145, 
      stressLevel: 3,
      steps: liveSensors.steps + 200,
      activeCalories: liveSensors.activeCalories + 15
    });
    
    // Auto turn off workout after 10s for demo purposes
    setTimeout(() => {
      updateLiveSensors({ isWorkoutActive: false });
    }, 10000);
  };

  const simulateHighStress = () => {
    updateLiveSensors({ 
      stressLevel: 9, 
      heartRate: 115 
    });
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card" 
      style={{ 
        padding: '16px', 
        marginBottom: '24px', 
        border: '1px solid var(--c-purple)',
        background: 'linear-gradient(to right, rgba(147, 51, 234, 0.05), rgba(79, 141, 255, 0.05))'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'var(--c-purple)', color: 'white', padding: '6px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <Activity size={14} className="spin-slow" />
            Live Sensor Controls
          </div>
          <span style={{ fontSize: '13px', color: 'var(--c-text-secondary)' }}>
            Status: {liveSensors.isWorkoutActive ? <strong style={{ color: 'var(--c-teal)' }}>Workout Active</strong> : 'Resting'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            onClick={resetLiveSensors}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '6px', 
              padding: '8px 14px', borderRadius: '8px', 
              background: 'var(--c-bg-card)', border: '1px solid var(--c-border)',
              fontSize: '12px', fontWeight: 700, color: 'var(--c-text-primary)',
              cursor: 'pointer'
            }}
          >
            <RefreshCw size={14} /> Reset
          </button>
          
          <button 
            onClick={simulateWorkout}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '6px', 
              padding: '8px 14px', borderRadius: '8px', 
              background: 'var(--c-teal)', color: 'white', border: 'none',
              fontSize: '12px', fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <HeartPulse size={14} /> Spike HR (Workout)
          </button>

          <button 
            onClick={simulateHighStress}
            style={{ 
              display: 'flex', alignItems: 'center', gap: '6px', 
              padding: '8px 14px', borderRadius: '8px', 
              background: 'var(--c-red)', color: 'white', border: 'none',
              fontSize: '12px', fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            <BrainCircuit size={14} /> Spike Stress
          </button>
        </div>

      </div>
    </motion.div>
  );
}
