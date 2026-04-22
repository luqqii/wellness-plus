import React from 'react';
import { Award, TrendingUp, Flag, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HealthMemoryTimeline({ events }) {
  // Mock data if none provided
  const timelineEvents = events || [
    { id: 1, date: 'Oct 12, 2025', title: 'Started Wellness+', description: 'Set a goal to lose 15 lbs and improve sleep quality.', icon: <Flag size={18} color="white" />, color: 'var(--c-blue)' },
    { id: 2, date: 'Nov 05, 2025', title: 'First Milestone Reached', description: 'Consistently meditated for 14 days and reduced stress levels by 20%.', icon: <Award size={18} color="white" />, color: 'var(--c-purple)' },
    { id: 3, date: 'Dec 20, 2025', title: 'Holiday Navigation', description: 'Maintained caloric balance during the holidays using Context-Aware suggestions.', icon: <MapPin size={18} color="white" />, color: 'var(--c-orange)' },
    { id: 4, date: 'Jan 15, 2026', title: '5 lbs Down', description: 'Hit the first weight loss target. Sleep duration increased by 45 mins average.', icon: <TrendingUp size={18} color="white" />, color: 'var(--c-teal)' },
  ];

  return (
    <div className="glass-card" style={{ padding: '24px' }}>
      <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '24px', color: 'var(--c-text-primary)' }}>Health Memory Timeline</h3>
      <p style={{ fontSize: '14px', color: 'var(--c-text-secondary)', marginBottom: '30px' }}>
        A contextual log of your long-term progress, behavior changes, and environmental factors.
      </p>

      <div style={{ position: 'relative', paddingLeft: '20px' }}>
        {/* Vertical line */}
        <div style={{ position: 'absolute', top: 0, bottom: 0, left: '33px', width: '2px', background: 'var(--c-border-strong)' }}></div>

        {timelineEvents.map((ev, index) => (
          <motion.div 
            key={ev.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 }}
            style={{ display: 'flex', gap: '20px', marginBottom: index === timelineEvents.length - 1 ? 0 : '30px', position: 'relative' }}
          >
            <div style={{ 
              width: '30px', height: '30px', borderRadius: '50%', background: ev.color, 
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1,
              boxShadow: `0 0 0 4px var(--c-bg-card)`
            }}>
              {ev.icon}
            </div>
            <div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: ev.color, marginBottom: '4px' }}>{ev.date}</div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: 'var(--c-text-primary)', marginBottom: '4px' }}>{ev.title}</div>
              <div style={{ fontSize: '14px', color: 'var(--c-text-secondary)', lineHeight: 1.5 }}>{ev.description}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
