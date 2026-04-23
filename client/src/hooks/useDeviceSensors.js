/**
 * useDeviceSensors.js
 * 
 * Reads REAL device sensors and feeds them into the metrics store:
 *  - Geolocation (GPS) → location, speed
 *  - DeviceMotion API → steps (pedometer via accelerometer), acceleration
 *  - DeviceOrientation API → orientation
 *  - Screen / Ambient Light API (where supported)
 * 
 * Falls back gracefully on desktop / unsupported browsers.
 */

import { useEffect, useRef, useCallback } from 'react';
import useMetricsStore from '../store/metricsStore';

// ── Step Detection via Accelerometer ────────────────────────────────────────
const STEP_THRESHOLD = 12;    // m/s² magnitude delta that counts as a step
const STEP_COOLDOWN_MS = 350; // minimum ms between two detected steps

function magnitude(x, y, z) {
  return Math.sqrt(x * x + y * y + z * z);
}

export default function useDeviceSensors() {
  const updateLiveSensors = useMetricsStore(s => s.updateLiveSensors);

  const lastMag    = useRef(0);
  const lastStep   = useRef(0);
  const watchId    = useRef(null);
  const wakeLock   = useRef(null);

  // ── Request Wake Lock to keep screen on during tracking ──────────────────
  const requestWakeLock = useCallback(async () => {
    try {
      if ('wakeLock' in navigator) {
        wakeLock.current = await navigator.wakeLock.request('screen');
      }
    } catch (_) {}
  }, []);

  // ── GPS / Geolocation ────────────────────────────────────────────────────
  const startGPS = useCallback(() => {
    if (!navigator.geolocation) return;
    watchId.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, speed, altitude } = pos.coords;
        updateLiveSensors({
          location: { latitude, longitude, altitude: altitude ?? null },
          speed: speed != null ? Math.round(speed * 3.6 * 10) / 10 : null, // m/s → km/h
        });
      },
      (err) => {
        console.warn('[Sensors] GPS error:', err.message);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
  }, [updateLiveSensors]);

  // ── DeviceMotion → Step Counter ──────────────────────────────────────────
  const handleMotion = useCallback((event) => {
    const a = event.accelerationIncludingGravity;
    if (!a || a.x == null) return;

    const mag = magnitude(a.x ?? 0, a.y ?? 0, a.z ?? 0);
    const now = Date.now();
    const delta = Math.abs(mag - lastMag.current);

    if (delta > STEP_THRESHOLD && now - lastStep.current > STEP_COOLDOWN_MS) {
      lastStep.current = now;
      updateLiveSensors(current => ({
        steps: (current.steps || 0) + 1,
        activeCalories: Math.round(((current.steps || 0) + 1) * 0.04 * 100) / 100,
        lastMotionMag: Math.round(mag * 10) / 10,
      }));
    }

    lastMag.current = mag;
  }, [updateLiveSensors]);

  // ── DeviceOrientation ────────────────────────────────────────────────────
  const handleOrientation = useCallback((event) => {
    updateLiveSensors({
      orientation: {
        alpha: Math.round(event.alpha ?? 0),
        beta:  Math.round(event.beta  ?? 0),
        gamma: Math.round(event.gamma ?? 0),
      }
    });
  }, [updateLiveSensors]);

  // ── Ambient Light ────────────────────────────────────────────────────────
  const startAmbientLight = useCallback(() => {
    if (!('AmbientLightSensor' in window)) return;
    try {
      const sensor = new window.AmbientLightSensor();
      sensor.addEventListener('reading', () => {
        updateLiveSensors({ ambientLight: Math.round(sensor.illuminance) });
      });
      sensor.start();
    } catch (_) {}
  }, [updateLiveSensors]);

  // ── iOS permission request for motion/orientation ────────────────────────
  const requestMotionPermission = useCallback(async () => {
    if (typeof DeviceMotionEvent?.requestPermission === 'function') {
      try {
        const result = await DeviceMotionEvent.requestPermission();
        if (result === 'granted') {
          window.addEventListener('devicemotion', handleMotion);
          window.addEventListener('deviceorientation', handleOrientation);
        }
      } catch (_) {}
    } else {
      // Android / desktop — permission not required
      window.addEventListener('devicemotion', handleMotion);
      window.addEventListener('deviceorientation', handleOrientation);
    }
  }, [handleMotion, handleOrientation]);

  // ── Battery API ──────────────────────────────────────────────────────────
  const startBattery = useCallback(async () => {
    if (!('getBattery' in navigator)) return;
    try {
      const battery = await navigator.getBattery();
      const update = () => updateLiveSensors({
        battery: {
          level: Math.round(battery.level * 100),
          charging: battery.charging,
        }
      });
      update();
      battery.addEventListener('levelchange', update);
      battery.addEventListener('chargingchange', update);
    } catch (_) {}
  }, [updateLiveSensors]);

  // ── Network Info ─────────────────────────────────────────────────────────
  const readNetwork = useCallback(() => {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (!conn) return;
    updateLiveSensors({
      network: {
        type: conn.effectiveType,
        downlink: conn.downlink,
      }
    });
    conn.addEventListener('change', () => updateLiveSensors({
      network: { type: conn.effectiveType, downlink: conn.downlink }
    }));
  }, [updateLiveSensors]);

  // ── Boot all sensors ─────────────────────────────────────────────────────
  useEffect(() => {
    requestWakeLock();
    startGPS();
    requestMotionPermission();
    startAmbientLight();
    startBattery();
    readNetwork();

    return () => {
      if (watchId.current != null) navigator.geolocation?.clearWatch(watchId.current);
      window.removeEventListener('devicemotion', handleMotion);
      window.removeEventListener('deviceorientation', handleOrientation);
      wakeLock.current?.release().catch(() => {});
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return null; // headless hook
}
