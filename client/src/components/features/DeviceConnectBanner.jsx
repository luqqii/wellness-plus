/**
 * DeviceConnectBanner.jsx
 * 
 * Shown when heart rate hasn't been sourced from a real BLE device.
 * Lets the user tap to connect a Bluetooth HR monitor.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Link2, Activity, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DeviceConnectBanner() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 10, padding: '10px 16px', borderRadius: 14,
        background: 'rgba(79,141,255,0.06)', border: '1px solid rgba(79,141,255,0.2)',
        marginBottom: 12
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Link2 size={15} color="var(--c-blue)" />
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--c-text-primary)' }}>
            Connect Health Data Sources
          </div>
          <div style={{ fontSize: 10, color: 'var(--c-text-muted)' }}>
            Sync Apple Health, Google Fit, Garmin, or Oura via Cloud
          </div>
        </div>
      </div>

      <button
        onClick={() => navigate('/data-sync')}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: 12, fontWeight: 700, color: 'white',
          background: 'var(--c-blue)',
          border: 'none', borderRadius: 10, padding: '7px 14px', cursor: 'pointer',
          transition: 'background 150ms ease'
        }}
      >
        <Activity size={12} />
        Manage Connections
      </button>
    </motion.div>
  );
}
