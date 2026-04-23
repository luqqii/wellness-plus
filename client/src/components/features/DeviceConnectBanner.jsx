/**
 * DeviceConnectBanner.jsx
 * 
 * Shown when heart rate hasn't been sourced from a real BLE device.
 * Lets the user tap to connect a Bluetooth HR monitor.
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Bluetooth, BluetoothConnected, BluetoothOff, AlertCircle, CheckCircle2 } from 'lucide-react';
import useBluetoothHR from '../../hooks/useBluetoothHR';

export default function DeviceConnectBanner() {
  const { status, deviceName, error, isSupported, connect, disconnect } = useBluetoothHR();

  if (status === 'connected') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 12, padding: '10px 16px', borderRadius: 14,
          background: 'rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.25)',
          marginBottom: 12
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <BluetoothConnected size={16} color="#14B8A6" />
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#14B8A6' }}>
              {deviceName} connected
            </div>
            <div style={{ fontSize: 10, color: 'var(--c-text-muted)' }}>
              Streaming live heart rate via Bluetooth
            </div>
          </div>
        </div>
        <button
          onClick={disconnect}
          style={{
            fontSize: 11, fontWeight: 700, color: 'var(--c-text-muted)',
            background: 'none', border: '1px solid var(--c-border)',
            borderRadius: 8, padding: '4px 10px', cursor: 'pointer'
          }}
        >
          Disconnect
        </button>
      </motion.div>
    );
  }

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
        {!isSupported
          ? <BluetoothOff size={15} color="var(--c-text-muted)" />
          : status === 'error'
          ? <AlertCircle size={15} color="var(--c-orange)" />
          : <Bluetooth size={15} color="var(--c-blue)" />
        }
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--c-text-primary)' }}>
            {!isSupported
              ? 'Heart rate: not available'
              : status === 'error'
              ? 'Connection failed'
              : 'Connect heart rate monitor'
            }
          </div>
          <div style={{ fontSize: 10, color: 'var(--c-text-muted)' }}>
            {!isSupported
              ? 'Use Chrome/Edge on Android or PC for Bluetooth'
              : error || 'Polar H10, Garmin, Apple Watch (BLE), etc.'
            }
          </div>
        </div>
      </div>

      {isSupported && (
        <button
          onClick={status === 'connecting' ? undefined : connect}
          disabled={status === 'connecting'}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            fontSize: 12, fontWeight: 700, color: 'white',
            background: status === 'connecting' ? 'var(--c-text-muted)' : 'var(--c-blue)',
            border: 'none', borderRadius: 10, padding: '7px 14px', cursor: 'pointer',
            transition: 'background 150ms ease'
          }}
        >
          <Bluetooth size={12} />
          {status === 'connecting' ? 'Scanning…' : 'Connect Device'}
        </button>
      )}
    </motion.div>
  );
}
