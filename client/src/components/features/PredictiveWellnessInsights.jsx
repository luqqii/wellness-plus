import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Battery, TrendingDown, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PredictiveWellnessInsights({ metrics }) {
  const [insight, setInsight] = useState(null);

  useEffect(() => {
    // Mocking the predictive burnout risk based on metrics
    // In a real scenario, this would call the /api/predict/burnout endpoint
    const calculateRisk = () => {
      const steps = metrics?.steps || 5000;
      const sleep = metrics?.sleep?.hours || 6.5;
      const stress = metrics?.stressLevel || 5;

      if (sleep < 6 && stress > 7) {
        return {
          level: 'High',
          message: 'Overtraining & Fatigue Risk. AI predicts burnout in 2 days. Prioritize rest.',
          color: 'var(--c-red)',
          icon: <AlertTriangle size={20} color="var(--c-red)" />
        };
      } else if (steps > 12000 && sleep < 7) {
        return {
          level: 'Moderate',
          message: 'Elevated fatigue detected. Consider active recovery or a light walk today.',
          color: 'var(--c-orange)',
          icon: <Battery size={20} color="var(--c-orange)" />
        };
      } else {
        return {
          level: 'Low',
          message: 'Optimal recovery status. You are primed for a high-intensity session.',
          color: 'var(--c-teal)',
          icon: <Zap size={20} color="var(--c-teal)" />
        };
      }
    };
    
    setInsight(calculateRisk());
  }, [metrics]);

  if (!insight) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card predictive-insights"
      style={{
        padding: '20px',
        borderLeft: `4px solid ${insight.color}`,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {insight.icon}
        <h3 style={{ fontSize: '16px', fontWeight: 800, margin: 0 }}>Predictive Wellness Insights</h3>
        <span style={{ 
          marginLeft: 'auto', 
          fontSize: '11px', 
          fontWeight: 700, 
          padding: '4px 8px', 
          borderRadius: '99px',
          background: `${insight.color}15`,
          color: insight.color,
          textTransform: 'uppercase'
        }}>
          {insight.level} Risk
        </span>
      </div>
      <p style={{ margin: 0, fontSize: '14px', color: 'var(--c-text-secondary)', lineHeight: 1.5 }}>
        {insight.message}
      </p>
    </motion.div>
  );
}
