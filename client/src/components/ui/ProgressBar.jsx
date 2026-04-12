import React from 'react';

export default function ProgressBar({ value = 0, max = 100, size = 'md', color = 'blue', className = '' }) {
  const pct = Math.min((value / max) * 100, 100);
  const heights = { sm: 4, md: 6, lg: 8 };
  const h = heights[size] || 6;
  const colorMap = {
    blue:   'var(--c-blue)',
    purple: 'var(--c-purple)',
    orange: 'var(--c-orange)',
    teal:   'var(--c-teal)',
    green:  'var(--c-green)',
    red:    'var(--c-red)',
  };
  return (
    <div className={className}>
      <div className="progress-track" style={{ height: h }}>
        <div
          className="progress-fill"
          style={{ width: `${pct}%`, background: colorMap[color] || color }}
        />
      </div>
    </div>
  );
}
