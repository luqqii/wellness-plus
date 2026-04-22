import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, Battery, TrendingDown, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PredictiveWellnessInsights({ metrics }) {
  const [insight, setInsight] = useState(null);

  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const { default: api } = await import('../../services/api');
        const res = await api.get('/insights/predict-burnout');
        const data = res.data?.data || {};
        
        let level = data.burnout_risk || 'Low';
        let message = `Optimal recovery. AI recommends ${data.recommended_recovery_hours || 8}h of rest.`;
        let color = 'var(--c-teal)';
        let icon = <Zap size={20} color="var(--c-teal)" />;

        if (level === 'High') {
          message = `Overtraining Risk. AI predicts burnout. Recommended recovery: ${data.recommended_recovery_hours || 10}h.`;
          color = 'var(--c-red)';
          icon = <AlertTriangle size={20} color="var(--c-red)" />;
        } else if (level === 'Moderate') {
          message = `Elevated fatigue detected. Recommended recovery: ${data.recommended_recovery_hours || 9}h.`;
          color = 'var(--c-orange)';
          icon = <Battery size={20} color="var(--c-orange)" />;
        }

        setInsight({ level, message, color, icon });
      } catch (error) {
        console.error("Failed to fetch predictive insights:", error);
        // Fallback
        setInsight({
          level: 'Low',
          message: 'Optimal recovery status.',
          color: 'var(--c-teal)',
          icon: <Zap size={20} color="var(--c-teal)" />
        });
      }
    };
    
    fetchPrediction();
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
