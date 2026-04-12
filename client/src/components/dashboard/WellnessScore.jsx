import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { getScoreColor, getScoreLabel } from '../../utils/constants';

export default function WellnessScore({ score = 0, size = 180 }) {
  const [animated, setAnimated] = useState(0);
  const color = getScoreColor(score);
  const label = getScoreLabel(score);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 400);
    return () => clearTimeout(t);
  }, [score]);

  const r = (size - 14) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (animated / 100) * circ;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        {/* Outer glow */}
        <div style={{
          position: 'absolute', inset: -8,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${color}18 0%, transparent 70%)`,
          animation: 'pulse-glow 2.5s ease-in-out infinite',
        }} />

        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={r}
            className="score-ring-track"
          />
          {/* Fill */}
          <motion.circle
            cx={size / 2} cy={size / 2} r={r}
            className="score-ring-fill"
            stroke={color}
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ duration: 1.6, ease: [0.4, 0, 0.2, 1], delay: 0.4 }}
          />
        </svg>

        {/* Center content */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: 2
        }}>
          <motion.span
            style={{ fontSize: 38, fontWeight: 900, color, letterSpacing: '-2px', lineHeight: 1 }}
            key={score}
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            {animated}
          </motion.span>
          <span style={{ fontSize: 11, color: 'var(--c-text-muted)', fontWeight: 500 }}>out of 100</span>
        </div>
      </div>

      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 14, fontWeight: 700, color }}>{label}</div>
        <div style={{ fontSize: 11, color: 'var(--c-text-muted)', marginTop: 2 }}>Wellness Score</div>
      </div>
    </div>
  );
}
