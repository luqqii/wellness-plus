import React from 'react';
import { motion } from 'framer-motion';
import { Wind, Droplets, Thermometer, MapPin, Zap } from 'lucide-react';
import { getOutdoorSuitability } from '../../hooks/useWeather';

/**
 * WeatherWidget — shows real-time weather from the user's device location.
 * Data is fed into liveSensors.weather by the useWeather hook (mounted in AppLayout).
 * Pass `compact={true}` for a smaller inline version.
 */
export default function WeatherWidget({ weather, compact = false }) {
  if (!weather) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: compact ? '8px 14px' : '14px 18px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid var(--c-border)',
        borderRadius: compact ? 12 : 18,
        color: 'var(--c-text-muted)',
        fontSize: 13,
      }}>
        <span style={{ fontSize: compact ? 18 : 22 }}>🌡️</span>
        <span>Fetching weather…</span>
      </div>
    );
  }

  const suitability = getOutdoorSuitability(weather);

  if (compact) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '8px 14px',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid var(--c-border)',
        borderRadius: 12,
        flexShrink: 0,
      }}>
        <span style={{ fontSize: 20 }}>{weather.icon}</span>
        <div>
          <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--c-text-primary)', lineHeight: 1 }}>
            {weather.temp}°C
          </div>
          <div style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>
            {weather.city ? `${weather.city} · ` : ''}{weather.condition}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: '#FFFFFF',
        border: '1px solid #E8DED8',
        borderRadius: 24,
        padding: '20px 24px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}
    >
      {/* Left: icon + temp + location */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ fontSize: 48, lineHeight: 1 }}>{weather.icon}</div>
        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontSize: 36, fontWeight: 900, color: 'var(--c-text-primary)', letterSpacing: '-1px' }}>
              {weather.temp}°C
            </span>
            <span style={{ fontSize: 14, color: 'var(--c-text-muted)', fontWeight: 500 }}>
              Feels {weather.feelsLike}°C
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 2 }}>
            {weather.city && (
              <>
                <MapPin size={12} color="var(--c-orange)" />
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--c-text-primary)' }}>{weather.city}</span>
                <span style={{ fontSize: 13, color: 'var(--c-text-muted)' }}>·</span>
              </>
            )}
            <span style={{ fontSize: 13, color: 'var(--c-text-muted)' }}>{weather.condition}</span>
          </div>
        </div>
      </div>

      {/* Middle: stats grid */}
      <div style={{ display: 'flex', gap: 20 }}>
        {[
          { Icon: Droplets,    label: 'Humidity',  value: `${weather.humidity}%` },
          { Icon: Wind,        label: 'Wind',       value: `${weather.windSpeed} km/h` },
          { Icon: Thermometer, label: 'Precip.',   value: `${weather.precipitation ?? 0} mm` },
          ...(weather.uvIndex != null ? [{ Icon: Zap, label: 'UV Index', value: `${weather.uvIndex}` }] : []),
        ].map(({ Icon, label, value }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <Icon size={16} color="var(--c-text-muted)" />
            <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--c-text-primary)', marginTop: 4 }}>{value}</div>
            <div style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Right: outdoor suitability badge */}
      {suitability && (
        <div style={{
          padding: '10px 18px',
          borderRadius: 12,
          background: `${suitability.color}18`,
          border: `1px solid ${suitability.color}40`,
          textAlign: 'center',
        }}>
          <div style={{ fontSize: 20, marginBottom: 4 }}>
            {['🚫','🏠','⚠️','🚶','🏃','🌟'][suitability.score]}
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: suitability.color }}>{suitability.label}</div>
        </div>
      )}
    </motion.div>
  );
}
