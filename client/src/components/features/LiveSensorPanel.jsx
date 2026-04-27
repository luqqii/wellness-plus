import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Activity, MapPin, Footprints, Zap, Battery, BatteryCharging,
  Wifi, Compass, Sun, HeartPulse, Navigation, AlertCircle, CheckCircle, Edit3
} from 'lucide-react';
import useMetricsStore from '../../store/metricsStore';
import DeviceConnectBanner from './DeviceConnectBanner';
import ManualLogModal from './ManualLogModal';
import { AnimatePresence } from 'framer-motion';

function SensorCard({ icon: Icon, label, value, unit, color, sub }) {
  const isAvailable = value !== null && value !== undefined;
  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: `1px solid ${isAvailable ? color + '40' : 'var(--c-border)'}`,
      borderRadius: 14, padding: '12px 14px', minWidth: 110, flex: '1 1 110px',
      display: 'flex', flexDirection: 'column', gap: 4,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
        <Icon size={13} color={isAvailable ? color : 'var(--c-text-muted)'} />
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--c-text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{label}</span>
      </div>
      {isAvailable ? (
        <>
          <div style={{ fontSize: 20, fontWeight: 900, color, lineHeight: 1 }}>
            {value}<span style={{ fontSize: 11, fontWeight: 500, color: 'var(--c-text-muted)', marginLeft: 3 }}>{unit}</span>
          </div>
          {sub && <div style={{ fontSize: 10, color: 'var(--c-text-muted)', marginTop: 1 }}>{sub}</div>}
        </>
      ) : (
        <div style={{ fontSize: 11, color: 'var(--c-text-muted)', fontStyle: 'italic', marginTop: 2 }}>Waiting…</div>
      )}
    </div>
  );
}

export default function LiveSensorPanel() {
  const s = useMetricsStore(state => state.liveSensors);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  const batteryIcon = s.battery?.charging ? BatteryCharging : Battery;
  const batteryColor = !s.battery ? 'var(--c-text-muted)'
    : s.battery.level > 50 ? '#22C55E'
    : s.battery.level > 20 ? '#EAB308'
    : '#EC5A42';

  const locationStr = s.location
    ? `${s.location.latitude?.toFixed(4)}, ${s.location.longitude?.toFixed(4)}`
    : null;
  const altStr = s.location?.altitude != null
    ? `Alt: ${Math.round(s.location.altitude)}m`
    : undefined;

  const orientationStr = s.orientation
    ? `α${s.orientation.alpha}° β${s.orientation.beta}°`
    : null;

  const networkStr = s.network
    ? `${s.network.type?.toUpperCase() ?? '?'} · ${s.network.downlink ?? '?'} Mbps`
    : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card"
      style={{
        padding: '14px 18px',
        marginBottom: '24px',
        border: '1px solid rgba(147,51,234,0.3)',
        background: 'linear-gradient(120deg, rgba(147,51,234,0.04) 0%, rgba(79,141,255,0.04) 100%)',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'var(--c-purple)', color: 'white',
          padding: '5px 12px', borderRadius: 99, fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px'
        }}>
          <Activity size={12} />
          Live Device Sensors
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5, flex: 1 }}>
          <span style={{
            width: 7, height: 7, borderRadius: '50%',
            background: s.location ? '#22C55E' : '#EAB308',
            display: 'inline-block',
            animation: s.location ? 'pulse-dot 1.2s ease infinite alternate' : 'none'
          }} />
          <span style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>
            {s.location ? 'GPS Active' : 'Acquiring sensors…'}
          </span>
        </div>
        <button onClick={() => setIsManualModalOpen(true)} style={{ background: 'none', border: '1px solid var(--c-purple)', color: 'var(--c-purple)', padding: '4px 10px', borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Edit3 size={12} /> Log Manually
        </button>
      </div>

      <AnimatePresence>
        {isManualModalOpen && <ManualLogModal isOpen={isManualModalOpen} onClose={() => setIsManualModalOpen(false)} />}
      </AnimatePresence>

      {/* Bluetooth device connect row */}
      <DeviceConnectBanner />

      {/* Sensor Grid */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>

        <SensorCard
          icon={Footprints}
          label="Steps"
          value={s.steps}
          unit="steps"
          color="#14B8A6"
          sub={`~${Math.round(s.steps * 0.762)}m walked`}
        />

        <SensorCard
          icon={Zap}
          label="Active Cal"
          value={s.activeCalories != null ? Math.round(s.activeCalories) : null}
          unit="kcal"
          color="#F97316"
        />

        <SensorCard
          icon={HeartPulse}
          label="Heart Rate"
          value={s.heartRate}
          unit="bpm"
          color="#EC5A42"
          sub={s.hrSource === 'bluetooth' ? '🔵 Bluetooth' : s.heartRate ? 'Estimated' : 'Connect device'}
        />

        <SensorCard
          icon={MapPin}
          label="GPS Location"
          value={locationStr}
          unit=""
          color="#4F8DFF"
          sub={altStr}
        />

        <SensorCard
          icon={Navigation}
          label="Speed"
          value={s.speed}
          unit="km/h"
          color="#9F7AEA"
        />

        <SensorCard
          icon={Compass}
          label="Orientation"
          value={orientationStr}
          unit=""
          color="#14B8A6"
        />

        {s.ambientLight !== null && (
          <SensorCard
            icon={Sun}
            label="Light"
            value={s.ambientLight}
            unit="lux"
            color="#EAB308"
          />
        )}

        <SensorCard
          icon={batteryIcon}
          label="Battery"
          value={s.battery ? s.battery.level : null}
          unit="%"
          color={batteryColor}
          sub={s.battery?.charging ? 'Charging' : undefined}
        />

        <SensorCard
          icon={Wifi}
          label="Network"
          value={networkStr}
          unit=""
          color="#22C55E"
        />

      </div>

      {/* Permission hint */}
      {!s.location && (
        <div style={{
          marginTop: 12, display: 'flex', alignItems: 'center', gap: 7,
          background: 'rgba(234,179,8,0.08)', borderRadius: 10, padding: '8px 12px',
          border: '1px solid rgba(234,179,8,0.2)'
        }}>
          <AlertCircle size={13} color="#EAB308" />
          <span style={{ fontSize: 11, color: '#EAB308' }}>
            Allow location & motion permissions when prompted to enable real-time sensor readings.
          </span>
        </div>
      )}

      <style>{`@keyframes pulse-dot { from { opacity:0.5; } to { opacity:1; } }`}</style>
    </motion.div>
  );
}
