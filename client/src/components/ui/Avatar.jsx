import React from 'react';

/**
 * Avatar — user avatar with gradient initials fallback, status ring, size variants
 */
export default function Avatar({
  src,
  name = '',
  size = 'md', // xs | sm | md | lg | xl
  status,      // 'online' | 'away' | 'busy' | null
  gradient = 'blue-purple',
  className = '',
  onClick,
  style = {},
}) {
  const sizes = {
    xs: { wh: 24, fontSize: 9,  statusWH: 7,  statusBorder: 1 },
    sm: { wh: 32, fontSize: 12, statusWH: 9,  statusBorder: 1.5 },
    md: { wh: 40, fontSize: 15, statusWH: 11, statusBorder: 2 },
    lg: { wh: 52, fontSize: 20, statusWH: 13, statusBorder: 2 },
    xl: { wh: 72, fontSize: 26, statusWH: 16, statusBorder: 2.5 },
  };

  const gradients = {
    'blue-purple':  'linear-gradient(135deg, #4f8dff, #9b6dff)',
    'teal-blue':    'linear-gradient(135deg, #00d4aa, #4f8dff)',
    'orange-red':   'linear-gradient(135deg, #ff7940, #ff5b5b)',
    'green-teal':   'linear-gradient(135deg, #2dd4a4, #00d4aa)',
    'purple-pink':  'linear-gradient(135deg, #9b6dff, #e040fb)',
  };

  const statusColors = {
    online: '#2dd4a4',
    away:   '#fbbf24',
    busy:   '#ff5b5b',
  };

  const { wh, fontSize, statusWH, statusBorder } = sizes[size] || sizes.md;

  // Generate initials from name
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className={className}
      onClick={onClick}
      style={{
        position: 'relative',
        width: wh, height: wh,
        flexShrink: 0,
        cursor: onClick ? 'pointer' : 'default',
        ...style,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={name || 'avatar'}
          style={{
            width: wh, height: wh,
            borderRadius: '50%',
            objectFit: 'cover',
            display: 'block',
          }}
          onError={e => { e.target.style.display = 'none'; }}
        />
      ) : (
        <div style={{
          width: wh, height: wh,
          borderRadius: '50%',
          background: gradients[gradient] || gradients['blue-purple'],
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'white',
          fontSize,
          fontWeight: 700,
          letterSpacing: '-0.5px',
          userSelect: 'none',
          boxShadow: '0 0 0 1px rgba(255,255,255,0.1)',
        }}>
          {initials || '?'}
        </div>
      )}

      {/* Status dot */}
      {status && statusColors[status] && (
        <div style={{
          position: 'absolute',
          bottom: 0, right: 0,
          width: statusWH, height: statusWH,
          borderRadius: '50%',
          background: statusColors[status],
          border: `${statusBorder}px solid var(--c-bg-base)`,
          boxShadow: `0 0 0 1px rgba(255,255,255,0.1)`,
        }} />
      )}
    </div>
  );
}
