import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, AlertTriangle, Battery, BatteryWarning, Brain, HeartPulse, TrendingDown, Zap, ShieldAlert, Sparkles, ActivitySquare } from 'lucide-react';
import useMetricsStore from '../store/metricsStore';
import api from '../services/api';

export default function PredictiveInsightsPage() {
  const liveSensors = useMetricsStore((s) => s.liveSensors);
  const [loading, setLoading] = useState(true);
  const [insights, setInsights] = useState({
    burnout: null,
    fatigue: null,
    overtraining: null
  });

  useEffect(() => {
    const fetchPredictions = async () => {
      setLoading(true);
      try {
        const res = await api.post('/insights/predict-burnout', { liveSensors });
        const data = res.data?.data || {};
        
        const burnoutRisk = data.burnout_risk || 'Low';
        const recHours = data.recommended_recovery_hours || 8;

        // Construct 3 distinct insight modules based on the data and live sensors
        const burnout = {
          level: burnoutRisk,
          color: burnoutRisk === 'High' ? 'var(--c-red)' : burnoutRisk === 'Moderate' ? 'var(--c-orange)' : 'var(--c-teal)',
          message: burnoutRisk === 'High' 
            ? `High probability of systemic burnout. Mandatory rest protocol advised for ${recHours}h.`
            : burnoutRisk === 'Moderate'
            ? `Early indicators of burnout detected. Adjust your schedule to prioritize downtime.`
            : `System optimal. Burnout markers are well within healthy thresholds.`
        };

        const currentStress = liveSensors.stressLevel || 3;
        const currentHr = liveSensors.heartRate || 70;
        
        let fatigueLevel = 'Low';
        let fatigueColor = 'var(--c-teal)';
        let fatigueMsg = 'Energy reserves are stable. Ready for high cognitive or physical load.';
        
        if (currentStress > 7 || currentHr > 100) {
          fatigueLevel = 'High';
          fatigueColor = 'var(--c-red)';
          fatigueMsg = `Acute fatigue anticipated. Elevated resting HR (${currentHr} bpm) and stress (${currentStress}/10). Immediate cooldown required.`;
        } else if (currentStress > 5 || currentHr > 85) {
          fatigueLevel = 'Moderate';
          fatigueColor = 'var(--c-orange)';
          fatigueMsg = 'Mild fatigue markers present. Avoid heavy exertion in the next 4 hours.';
        }

        const overtraining = {
          level: burnoutRisk === 'High' ? 'High' : (recHours > 8 ? 'Moderate' : 'Low'),
          color: burnoutRisk === 'High' ? 'var(--c-red)' : (recHours > 8 ? 'var(--c-orange)' : 'var(--c-teal)'),
          message: recHours > 9 
            ? `Central nervous system (CNS) overload risk. Reduce training volume by 50%.`
            : recHours > 8
            ? `Slight overreaching detected. Focus on active recovery and mobility work.`
            : `Training load is perfectly balanced with your recovery capacity.`
        };

        setInsights({ burnout, fatigue: { level: fatigueLevel, color: fatigueColor, message: fatigueMsg }, overtraining });
      } catch (error) {
        console.error("Failed to fetch insights", error);
        // Fallback defaults
        setInsights({
          burnout: { level: 'Low', color: 'var(--c-teal)', message: 'Optimal recovery status.' },
          fatigue: { level: 'Low', color: 'var(--c-teal)', message: 'Energy reserves are stable.' },
          overtraining: { level: 'Low', color: 'var(--c-teal)', message: 'Training load is balanced.' }
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [liveSensors]);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="page-container" style={{ paddingBottom: '100px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 30 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 16,
            background: 'linear-gradient(135deg, var(--c-purple), var(--c-blue))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', boxShadow: '0 8px 16px rgba(147, 51, 234, 0.2)'
          }}>
            <Brain size={24} />
          </div>
          <div>
            <h1 className="page-title" style={{ margin: 0, fontSize: 28 }}>Predictive Insights</h1>
            <p className="page-subtitle" style={{ margin: 0 }}>AI-driven forecasting for your health trajectory.</p>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
          <div className="animate-pulse" style={{ color: 'var(--c-purple)' }}><Sparkles size={32} /></div>
        </div>
      ) : (
        <motion.div 
          variants={containerVariants} 
          initial="hidden" 
          animate="show"
          style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
        >
          {/* Module 1: Fatigue Anticipation */}
          <motion.div variants={itemVariants} className="glass-card" style={{ padding: 24, borderLeft: `4px solid ${insights.fatigue.color}`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.05, color: insights.fatigue.color }}>
              <BatteryWarning size={140} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ padding: 10, background: `${insights.fatigue.color}15`, borderRadius: 12, color: insights.fatigue.color }}>
                <Battery size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Fatigue Anticipation</h2>
                <div style={{ fontSize: 12, color: 'var(--c-text-muted)' }}>Real-time energy depletion model</div>
              </div>
              <div style={{ padding: '6px 12px', background: `${insights.fatigue.color}15`, color: insights.fatigue.color, borderRadius: 20, fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>
                {insights.fatigue.level} Risk
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 15, color: 'var(--c-text-secondary)', lineHeight: 1.6 }}>
              {insights.fatigue.message}
            </p>
          </motion.div>

          {/* Module 2: Overtraining Risk */}
          <motion.div variants={itemVariants} className="glass-card" style={{ padding: 24, borderLeft: `4px solid ${insights.overtraining.color}`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.05, color: insights.overtraining.color }}>
              <ActivitySquare size={140} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ padding: 10, background: `${insights.overtraining.color}15`, borderRadius: 12, color: insights.overtraining.color }}>
                <HeartPulse size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Overtraining Risk</h2>
                <div style={{ fontSize: 12, color: 'var(--c-text-muted)' }}>Strain vs. Recovery analysis</div>
              </div>
              <div style={{ padding: '6px 12px', background: `${insights.overtraining.color}15`, color: insights.overtraining.color, borderRadius: 20, fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>
                {insights.overtraining.level} Risk
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 15, color: 'var(--c-text-secondary)', lineHeight: 1.6 }}>
              {insights.overtraining.message}
            </p>
          </motion.div>

          {/* Module 3: Burnout Prediction */}
          <motion.div variants={itemVariants} className="glass-card" style={{ padding: 24, borderLeft: `4px solid ${insights.burnout.color}`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.05, color: insights.burnout.color }}>
              <AlertTriangle size={140} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{ padding: 10, background: `${insights.burnout.color}15`, borderRadius: 12, color: insights.burnout.color }}>
                <TrendingDown size={22} />
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800 }}>Burnout Prediction</h2>
                <div style={{ fontSize: 12, color: 'var(--c-text-muted)' }}>Long-term systemic stress model</div>
              </div>
              <div style={{ padding: '6px 12px', background: `${insights.burnout.color}15`, color: insights.burnout.color, borderRadius: 20, fontSize: 12, fontWeight: 800, textTransform: 'uppercase' }}>
                {insights.burnout.level} Risk
              </div>
            </div>
            <p style={{ margin: 0, fontSize: 15, color: 'var(--c-text-secondary)', lineHeight: 1.6 }}>
              {insights.burnout.message}
            </p>
          </motion.div>

        </motion.div>
      )}
    </div>
  );
}
