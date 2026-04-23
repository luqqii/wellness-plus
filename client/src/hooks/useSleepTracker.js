/**
 * useSleepTracker.js
 *
 * Tracks sleep patterns using:
 * 1. Screen on/off events (visibilitychange)
 * 2. DeviceMotion inactivity (no movement = possibly sleeping)
 * 3. Manual log via the UI
 *
 * Persists daily sleep windows to localStorage keyed by date.
 * On wake, calculates estimated sleep hours and quality.
 */

import { useEffect, useRef, useCallback } from 'react';
import useMetricsStore from '../store/metricsStore';

const SLEEP_KEY = 'wellness_sleep_log';

function getTodayKey() {
  return new Date().toISOString().split('T')[0];
}

function getSleepLog() {
  try { return JSON.parse(localStorage.getItem(SLEEP_KEY) || '{}'); }
  catch { return {}; }
}

function setSleepLog(log) {
  localStorage.setItem(SLEEP_KEY, JSON.stringify(log));
}

export function getFullSleepHistory() {
  return getSleepLog();
}

export function manualLogSleep({ date, bedtime, wakeTime, quality }) {
  const log = getSleepLog();
  const key = date || getTodayKey();
  const bed = new Date(bedtime);
  const wake = new Date(wakeTime);
  let hours = (wake - bed) / 3600000;
  if (hours < 0) hours += 24; // crossed midnight

  log[key] = {
    bedtime,
    wakeTime,
    hours: Math.round(hours * 10) / 10,
    quality: quality || 7,
    source: 'manual',
  };
  setSleepLog(log);
  return log[key];
}

export default function useSleepTracker() {
  const updateLiveSensors = useMetricsStore(s => s.updateLiveSensors);
  const hiddenAtRef = useRef(null);
  const motionInactiveRef = useRef(null);
  const inactiveTimerRef = useRef(null);

  // Load today's sleep from local storage on mount
  useEffect(() => {
    const log = getSleepLog();
    const today = getTodayKey();
    if (log[today]) {
      updateLiveSensors({
        sleep: {
          hours: log[today].hours,
          quality: log[today].quality,
          bedtime: log[today].bedtime,
          wakeTime: log[today].wakeTime,
          source: log[today].source,
        }
      });
    }
  }, [updateLiveSensors]);

  // Track screen off → screen on as a potential sleep window
  const handleVisibility = useCallback(() => {
    if (document.hidden) {
      // Screen turned off — record potential sleep start
      hiddenAtRef.current = new Date().toISOString();
    } else {
      // Screen turned on — check if it was off long enough to be sleep
      if (!hiddenAtRef.current) return;
      const hiddenAt = new Date(hiddenAtRef.current);
      const now = new Date();
      const diffH = (now - hiddenAt) / 3600000;

      // Only count as sleep if >= 3 hours of screen-off
      if (diffH >= 3) {
        const today = getTodayKey();
        const log = getSleepLog();
        const hours = Math.round(diffH * 10) / 10;
        // Quality estimated: 7-8h = 9, 6-7h = 7, 5-6h = 5, < 5h = 3
        const quality = hours >= 8 ? 9 : hours >= 7 ? 8 : hours >= 6 ? 6 : hours >= 5 ? 4 : 3;

        log[today] = {
          bedtime: hiddenAt.toISOString(),
          wakeTime: now.toISOString(),
          hours,
          quality,
          source: 'automatic',
        };
        setSleepLog(log);

        updateLiveSensors({
          sleep: { hours, quality, bedtime: hiddenAt.toISOString(), wakeTime: now.toISOString(), source: 'automatic' }
        });
      }
      hiddenAtRef.current = null;
    }
  }, [updateLiveSensors]);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [handleVisibility]);

  // DeviceMotion inactivity detector — 2+ hours of no movement → flag as sleep
  const handleMotionInactive = useCallback(() => {
    inactiveTimerRef.current = setTimeout(() => {
      motionInactiveRef.current = new Date().toISOString();
    }, 2 * 60 * 60 * 1000); // 2 hours
  }, []);

  const resetInactiveTimer = useCallback(() => {
    clearTimeout(inactiveTimerRef.current);
    if (motionInactiveRef.current) {
      // Motion resumed after inactivity — calculate potential sleep
      const inactiveSince = new Date(motionInactiveRef.current);
      const now = new Date();
      const diffH = (now - inactiveSince) / 3600000;
      if (diffH >= 2) {
        const today = getTodayKey();
        const log = getSleepLog();
        if (!log[today] || log[today].source === 'automatic') {
          log[today] = {
            bedtime: inactiveSince.toISOString(),
            wakeTime: now.toISOString(),
            hours: Math.round(diffH * 10) / 10,
            quality: 6,
            source: 'motion',
          };
          setSleepLog(log);
          updateLiveSensors({
            sleep: { hours: log[today].hours, quality: 6, source: 'motion' }
          });
        }
      }
      motionInactiveRef.current = null;
    }
    handleMotionInactive();
  }, [handleMotionInactive, updateLiveSensors]);

  useEffect(() => {
    window.addEventListener('devicemotion', resetInactiveTimer);
    handleMotionInactive(); // start inactivity watch
    return () => {
      window.removeEventListener('devicemotion', resetInactiveTimer);
      clearTimeout(inactiveTimerRef.current);
    };
  }, [resetInactiveTimer, handleMotionInactive]);

  return null; // headless
}
