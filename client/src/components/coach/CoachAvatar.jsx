import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

/**
 * CoachAvatar — Animated AI coach avatar with pulse ring
 */
export default function CoachAvatar({ size = 'md', isTyping = false, className = '' }) {
  const sizes = {
    sm:  { wh: 36, iconSize: 16, ringOffset: 3 },
    md:  { wh: 48, iconSize: 22, ringOffset: 4 },
    lg:  { wh: 64, iconSize: 28, ringOffset: 5 },
    xl:  { wh: 88, iconSize: 38, ringOffset: 6 },
  };
  const { wh, iconSize, ringOffset } = sizes[size] || sizes.md;

  return (
    <div
      className={className}
      style={{ position: 'relative', width: wh, height: wh, flexShrink: 0 }}
    >
      {/* Pulse ring when typing */}
      {isTyping && (
        <motion.div
          animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: -ringOffset,
            borderRadius: '50%',
            border: '2px solid var(--c-blue)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Avatar circle */}
      <motion.div
        animate={isTyping ? { scale: [1, 1.04, 1] } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        style={{
          width: wh, height: wh, borderRadius: '50%',
          background: 'linear-gradient(135deg, #3a6bcc, #7b50d6, #00b8a0)',
          backgroundSize: '200% 200%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: isTyping
            ? '0 0 20px rgba(79,141,255,0.5)'
            : '0 4px 16px rgba(79,141,255,0.25)',
          transition: 'box-shadow 0.3s',
          animation: 'gradientShift 4s ease infinite',
        }}
      >
        <Zap size={iconSize} color="white" fill="white" />
      </motion.div>

      {/* Online indicator */}
      <div style={{
        position: 'absolute', bottom: 1, right: 1,
        width: Math.max(8, wh * 0.18), height: Math.max(8, wh * 0.18),
        borderRadius: '50%',
        background: 'var(--c-teal)',
        border: '2px solid var(--c-bg-base)',
        boxShadow: '0 0 6px rgba(0,212,170,0.5)',
      }} />
    </div>
  );
}
