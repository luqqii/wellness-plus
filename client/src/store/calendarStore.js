/**
 * calendarStore.js
 *
 * Full persistent calendar & journal store.
 * Tracks every user event / health record from day 1 of login.
 * Uses localStorage for offline-first persistence.
 *
 * Event types: 'checkin' | 'workout' | 'meal' | 'sleep' | 'note' | 'weight' | 'habit' | 'goal' | 'weather'
 */

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useCalendarStore = create(
  persist(
    (set, get) => ({
      // Map of ISO date string → array of events
      // e.g. { "2026-04-23": [{ id, type, title, data, timestamp }] }
      events: {},

      // Add an event for a given date
      addEvent: ({ date, type, title, data = {} }) => {
        const key = date || new Date().toISOString().split('T')[0];
        const event = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          type,
          title,
          data,
          timestamp: new Date().toISOString(),
        };
        set(state => ({
          events: {
            ...state.events,
            [key]: [...(state.events[key] || []), event],
          }
        }));
        return event;
      },

      // Delete an event by id
      deleteEvent: (date, eventId) => {
        set(state => ({
          events: {
            ...state.events,
            [date]: (state.events[date] || []).filter(e => e.id !== eventId),
          }
        }));
      },

      // Update an event by id
      updateEvent: (date, eventId, updates) => {
        set(state => ({
          events: {
            ...state.events,
            [date]: (state.events[date] || []).map(e =>
              e.id === eventId ? { ...e, ...updates, data: { ...e.data, ...updates.data } } : e
            ),
          }
        }));
      },

      // Get all events for a specific date
      getEventsForDate: (date) => {
        return get().events[date] || [];
      },

      // Get events for a date range
      getEventsForRange: (startDate, endDate) => {
        const events = get().events;
        const result = {};
        const start = new Date(startDate);
        const end = new Date(endDate);
        for (const [dateStr, evts] of Object.entries(events)) {
          const d = new Date(dateStr);
          if (d >= start && d <= end) result[dateStr] = evts;
        }
        return result;
      },

      // Get all dates that have events (for calendar dot display)
      getDatesWithEvents: () => {
        return Object.keys(get().events).filter(k => get().events[k].length > 0);
      },

      // Get journal entries (type = 'note')
      getJournalEntries: () => {
        const all = [];
        for (const [date, evts] of Object.entries(get().events)) {
          for (const e of evts) {
            if (e.type === 'note') all.push({ ...e, date });
          }
        }
        return all.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      },

      // Get health summary for a date
      getHealthSummary: (date) => {
        const evts = get().events[date] || [];
        return {
          checkins: evts.filter(e => e.type === 'checkin'),
          workouts: evts.filter(e => e.type === 'workout'),
          meals: evts.filter(e => e.type === 'meal'),
          sleep: evts.find(e => e.type === 'sleep'),
          weight: evts.find(e => e.type === 'weight'),
          habits: evts.filter(e => e.type === 'habit'),
          notes: evts.filter(e => e.type === 'note'),
          weather: evts.find(e => e.type === 'weather'),
        };
      },

      // Stats
      getTotalDaysTracked: () => Object.keys(get().events).length,

      getStreakDays: () => {
        const dates = Object.keys(get().events)
          .filter(k => get().events[k].length > 0)
          .sort()
          .reverse();
        if (!dates.length) return 0;
        let streak = 0;
        let current = new Date();
        current.setHours(0, 0, 0, 0);
        for (const d of dates) {
          const date = new Date(d);
          date.setHours(0, 0, 0, 0);
          const diff = (current - date) / 86400000;
          if (diff <= 1) { streak++; current = date; }
          else break;
        }
        return streak;
      },
    }),
    {
      name: 'wellness-calendar',
      version: 1,
    }
  )
);

export default useCalendarStore;
