/**
 * useBluetoothHR.js
 * 
 * Connects to a real Bluetooth heart rate monitor (Polar H10, Garmin, etc.)
 * via the Web Bluetooth API and streams live BPM into the metrics store.
 * 
 * Standard GATT profile: Heart Rate Service (0x180D)
 * Characteristic: Heart Rate Measurement (0x2A37)
 */

import { useState, useRef, useCallback } from 'react';
import useMetricsStore from '../store/metricsStore';

export default function useBluetoothHR() {
  const updateLiveSensors = useMetricsStore(s => s.updateLiveSensors);
  const [status, setStatus] = useState('idle'); // idle | connecting | connected | unsupported | error
  const [deviceName, setDeviceName] = useState(null);
  const [error, setError] = useState(null);
  const deviceRef = useRef(null);
  const characteristicRef = useRef(null);

  const isSupported = 'bluetooth' in navigator;

  // Parse the HR Measurement characteristic value per BT spec
  const parseHeartRate = (value) => {
    const flags = value.getUint8(0);
    const is16bit = flags & 0x1;
    return is16bit ? value.getUint16(1, true) : value.getUint8(1);
  };

  const handleHRNotification = useCallback((event) => {
    const bpm = parseHeartRate(event.target.value);
    if (bpm > 0 && bpm < 250) {
      updateLiveSensors({ heartRate: bpm, hrSource: 'bluetooth' });
    }
  }, [updateLiveSensors]);

  const connect = useCallback(async () => {
    if (!isSupported) {
      setStatus('unsupported');
      setError('Web Bluetooth is not supported in this browser. Use Chrome or Edge on a supported device.');
      return;
    }

    try {
      setStatus('connecting');
      setError(null);

      const device = await navigator.bluetooth.requestDevice({
        filters: [{ services: ['heart_rate'] }],
        optionalServices: ['battery_service', 'device_information']
      });

      deviceRef.current = device;
      setDeviceName(device.name || 'Unknown Device');

      device.addEventListener('gattserverdisconnected', () => {
        setStatus('idle');
        setDeviceName(null);
        updateLiveSensors({ hrSource: 'none' });
      });

      const server = await device.gatt.connect();
      const service = await server.getPrimaryService('heart_rate');
      const characteristic = await service.getCharacteristic('heart_rate_measurement');
      characteristicRef.current = characteristic;

      await characteristic.startNotifications();
      characteristic.addEventListener('characteristicvaluechanged', handleHRNotification);

      setStatus('connected');
      updateLiveSensors({ hrSource: 'bluetooth' });
    } catch (err) {
      if (err.name === 'NotFoundError') {
        // User cancelled the picker — not an error
        setStatus('idle');
      } else {
        setStatus('error');
        setError(err.message || 'Failed to connect to Bluetooth device.');
      }
    }
  }, [isSupported, handleHRNotification, updateLiveSensors]);

  const disconnect = useCallback(async () => {
    try {
      if (characteristicRef.current) {
        await characteristicRef.current.stopNotifications();
        characteristicRef.current.removeEventListener('characteristicvaluechanged', handleHRNotification);
      }
      deviceRef.current?.gatt?.disconnect();
    } catch (_) {}
    setStatus('idle');
    setDeviceName(null);
    updateLiveSensors({ hrSource: 'none', heartRate: null });
  }, [handleHRNotification, updateLiveSensors]);

  return { status, deviceName, error, isSupported, connect, disconnect };
}
