import React from 'react';

/**
 * Skeleton — content loading placeholders with shimmer animation
 */
function Skeleton({ width = '100%', height = 16, borderRadius = 8, className = '', style = {} }) {
  return (
    <div
      className={`skeleton-shimmer ${className}`}
      style={{
        width,
        height,
        borderRadius,
        background: 'rgba(255,255,255,0.06)',
        position: 'relative',
        overflow: 'hidden',
        ...style,
      }}
    >
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.07) 50%, transparent 100%)',
        animation: 'skeleton-wave 1.6s ease-in-out infinite',
      }} />
    </div>
  );
}

/**
 * SkeletonCard — a full card skeleton
 */
export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Skeleton width={40} height={40} borderRadius={12} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <Skeleton height={14} width="60%" />
          <Skeleton height={11} width="40%" />
        </div>
      </div>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={11} width={i === lines - 1 ? '70%' : '100%'} />
      ))}
    </div>
  );
}

/**
 * SkeletonText — lines of text skeleton
 */
export function SkeletonText({ lines = 2, lastLineWidth = '60%' }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height={12}
          width={i === lines - 1 ? lastLineWidth : '100%'}
        />
      ))}
    </div>
  );
}

export default Skeleton;
