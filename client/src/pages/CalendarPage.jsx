import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Plus, Dumbbell, Moon, Apple,
  FileText, Weight, Check, Cloud, X, Save, Pencil, Trash2,
  Activity, Heart, Footprints, Thermometer
} from 'lucide-react';
import useCalendarStore from '../store/calendarStore';
import useMetricsStore from '../store/metricsStore';
import { manualLogSleep } from '../hooks/useSleepTracker';

const EVENT_COLORS = {
  checkin:  { bg: '#4F8DFF18', border: '#4F8DFF40', dot: '#4F8DFF', icon: Activity },
  workout:  { bg: '#14B8A618', border: '#14B8A640', dot: '#14B8A6', icon: Dumbbell },
  meal:     { bg: '#F9731618', border: '#F9731640', dot: '#F97316', icon: Apple },
  sleep:    { bg: '#9F7AEA18', border: '#9F7AEA40', dot: '#9F7AEA', icon: Moon },
  weight:   { bg: '#EC5A4218', border: '#EC5A4240', dot: '#EC5A42', icon: Weight },
  habit:    { bg: '#22C55E18', border: '#22C55E40', dot: '#22C55E', icon: Check },
  note:     { bg: '#EAB30818', border: '#EAB30840', dot: '#EAB308', icon: FileText },
  weather:  { bg: '#06B6D418', border: '#06B6D440', dot: '#06B6D4', icon: Cloud },
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function buildCalendar(year, month) {
  const first = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= days; d++) cells.push(d);
  return cells;
}

function EventBadge({ event, onDelete }) {
  const cfg = EVENT_COLORS[event.type] || EVENT_COLORS.note;
  const Icon = cfg.icon;
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
      style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        padding: '10px 14px', borderRadius: 12,
        background: cfg.bg, border: `1px solid ${cfg.border}`,
        marginBottom: 8,
      }}
    >
      <div style={{ width: 28, height: 28, borderRadius: 8, background: cfg.dot + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon size={14} color={cfg.dot} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--c-text-primary)' }}>{event.title}</div>
        {event.data && Object.keys(event.data).length > 0 && (
          <div style={{ fontSize: 11, color: 'var(--c-text-muted)', marginTop: 2 }}>
            {Object.entries(event.data).slice(0, 3).map(([k, v]) =>
              `${k}: ${typeof v === 'number' ? v.toLocaleString() : v}`
            ).join(' · ')}
          </div>
        )}
        <div style={{ fontSize: 10, color: 'var(--c-text-muted)', marginTop: 1 }}>
          {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
      <button onClick={() => onDelete(event.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-text-muted)', padding: 2, opacity: 0.5 }} onMouseEnter={e => e.currentTarget.style.opacity = '1'} onMouseLeave={e => e.currentTarget.style.opacity = '0.5'}>
        <Trash2 size={12} />
      </button>
    </motion.div>
  );
}

export default function CalendarPage() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState(today.toISOString().split('T')[0]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ type: 'note', title: '', note: '' });
  const [showSleepForm, setShowSleepForm] = useState(false);
  const [sleepForm, setSleepForm] = useState({ bedtime: '', wakeTime: '', quality: 7 });

  const { events, addEvent, deleteEvent, getDatesWithEvents, getTotalDaysTracked, getStreakDays } = useCalendarStore();
  const liveSensors = useMetricsStore(s => s.liveSensors);

  const datesWithEvents = getDatesWithEvents();
  const totalDays = getTotalDaysTracked();
  const streak = getStreakDays();

  const calCells = useMemo(() => buildCalendar(viewYear, viewMonth), [viewYear, viewMonth]);

  const selectedEvents = events[selectedDate] || [];

  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  const handleAddEvent = () => {
    if (!newEvent.title.trim()) return;
    addEvent({
      date: selectedDate,
      type: newEvent.type,
      title: newEvent.title,
      data: newEvent.note ? { note: newEvent.note } : {},
    });
    setNewEvent({ type: 'note', title: '', note: '' });
    setShowAddForm(false);
  };

  const handleLogSleep = () => {
    if (!sleepForm.bedtime || !sleepForm.wakeTime) return;
    const bed = new Date(`${selectedDate}T${sleepForm.bedtime}`);
    const wake = new Date(`${selectedDate}T${sleepForm.wakeTime}`);
    const record = manualLogSleep({
      date: selectedDate,
      bedtime: bed.toISOString(),
      wakeTime: wake.toISOString(),
      quality: sleepForm.quality,
    });
    addEvent({
      date: selectedDate,
      type: 'sleep',
      title: `Sleep: ${record.hours}h (Q: ${record.quality}/10)`,
      data: { hours: record.hours, quality: record.quality, bedtime: sleepForm.bedtime, wakeTime: sleepForm.wakeTime },
    });
    // Auto-log weather snapshot if available
    if (liveSensors.weather) {
      addEvent({
        date: selectedDate,
        type: 'weather',
        title: `Weather: ${liveSensors.weather.icon} ${liveSensors.weather.condition}`,
        data: { temp: liveSensors.weather.temp + '°C', humidity: liveSensors.weather.humidity + '%', wind: liveSensors.weather.windSpeed + ' km/h' },
      });
    }
    setShowSleepForm(false);
    setSleepForm({ bedtime: '', wakeTime: '', quality: 7 });
  };

  const handleDelete = (eventId) => deleteEvent(selectedDate, eventId);

  const todayStr = today.toISOString().split('T')[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1000 }}>
      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 14 }}>
        {[
          { label: 'Days Tracked', value: totalDays, icon: Activity, color: 'var(--c-blue)' },
          { label: 'Current Streak', value: `${streak} days`, icon: Heart, color: 'var(--c-red)' },
          { label: 'Live Steps', value: (liveSensors.steps || 0).toLocaleString(), icon: Footprints, color: 'var(--c-teal)' },
          { label: 'Sleep (Tonight)', value: liveSensors.sleep ? `${liveSensors.sleep.hours}h` : '—', icon: Moon, color: 'var(--c-purple)' },
          { label: 'Weather', value: liveSensors.weather ? `${liveSensors.weather.icon} ${liveSensors.weather.temp}°C` : '—', icon: Thermometer, color: 'var(--c-orange)' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
            className="glass-card" style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
              <s.icon size={13} color={s.color} />
              <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--c-text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>{s.label}</span>
            </div>
            <div style={{ fontSize: 20, fontWeight: 900, color: s.color, letterSpacing: '-0.5px' }}>{s.value}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Calendar Grid */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
          {/* Month Nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <button onClick={prevMonth} className="btn btn-icon"><ChevronLeft size={16} /></button>
            <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--c-text-primary)' }}>
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button onClick={nextMonth} className="btn btn-icon"><ChevronRight size={16} /></button>
          </div>

          {/* Day labels */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
            {DAYS.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 10, fontWeight: 700, color: 'var(--c-text-muted)', textTransform: 'uppercase', letterSpacing: '0.4px', padding: '4px 0' }}>{d}</div>
            ))}
          </div>

          {/* Date cells */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
            {calCells.map((day, i) => {
              if (!day) return <div key={`blank-${i}`} />;
              const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selectedDate;
              const hasEvents = datesWithEvents.includes(dateStr);
              const dayEvents = events[dateStr] || [];
              const eventDots = [...new Set(dayEvents.map(e => e.type))].slice(0, 4);

              return (
                <motion.button
                  key={dateStr}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => setSelectedDate(dateStr)}
                  style={{
                    aspectRatio: '1', borderRadius: 10, border: 'none', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    gap: 2, padding: 4,
                    background: isSelected ? 'var(--c-blue)' : isToday ? 'rgba(79,141,255,0.12)' : 'transparent',
                    transition: 'all 150ms ease',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: isToday || isSelected ? 800 : 500, color: isSelected ? 'white' : isToday ? 'var(--c-blue)' : 'var(--c-text-primary)' }}>
                    {day}
                  </span>
                  {hasEvents && (
                    <div style={{ display: 'flex', gap: 2 }}>
                      {eventDots.map(type => (
                        <div key={type} style={{ width: 4, height: 4, borderRadius: '50%', background: isSelected ? 'rgba(255,255,255,0.7)' : (EVENT_COLORS[type]?.dot || '#888') }} />
                      ))}
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--c-border)' }}>
            {Object.entries(EVENT_COLORS).map(([type, cfg]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.dot }} />
                <span style={{ fontSize: 10, color: 'var(--c-text-muted)', textTransform: 'capitalize' }}>{type}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Day Detail Panel */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          {/* Selected Day Header */}
          <div className="glass-card" style={{ padding: '16px 18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--c-text-primary)' }}>
                  {new Date(selectedDate + 'T12:00:00').toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
                <div style={{ fontSize: 11, color: 'var(--c-text-muted)', marginTop: 2 }}>
                  {selectedEvents.length} event{selectedEvents.length !== 1 ? 's' : ''} recorded
                </div>
              </div>
              <div style={{ display: 'flex', gap: 7 }}>
                <button onClick={() => setShowSleepForm(p => !p)} className="btn btn-icon" title="Log Sleep"><Moon size={14} /></button>
                <button onClick={() => setShowAddForm(p => !p)} className="btn btn-primary btn-sm"><Plus size={13} /> Add</button>
              </div>
            </div>

            {/* Sleep Log Form */}
            <AnimatePresence>
              {showSleepForm && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                  <div style={{ paddingTop: 12, borderTop: '1px solid var(--c-border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--c-purple)' }}>Log Sleep</div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      <div>
                        <label style={{ fontSize: 10, color: 'var(--c-text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Bedtime</label>
                        <input type="time" value={sleepForm.bedtime} onChange={e => setSleepForm(p => ({ ...p, bedtime: e.target.value }))}
                          style={{ width: '100%', background: 'var(--c-bg-card)', border: '1px solid var(--c-border)', borderRadius: 8, padding: '6px 10px', color: 'var(--c-text-primary)', fontSize: 13, outline: 'none' }} />
                      </div>
                      <div>
                        <label style={{ fontSize: 10, color: 'var(--c-text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Wake Time</label>
                        <input type="time" value={sleepForm.wakeTime} onChange={e => setSleepForm(p => ({ ...p, wakeTime: e.target.value }))}
                          style={{ width: '100%', background: 'var(--c-bg-card)', border: '1px solid var(--c-border)', borderRadius: 8, padding: '6px 10px', color: 'var(--c-text-primary)', fontSize: 13, outline: 'none' }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 10, color: 'var(--c-text-muted)', fontWeight: 600, display: 'block', marginBottom: 4 }}>Quality: {sleepForm.quality}/10</label>
                      <input type="range" min={1} max={10} value={sleepForm.quality} onChange={e => setSleepForm(p => ({ ...p, quality: +e.target.value }))} style={{ width: '100%' }} />
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={handleLogSleep} className="btn btn-primary btn-sm" style={{ flex: 1 }}><Save size={12} /> Save Sleep</button>
                      <button onClick={() => setShowSleepForm(false)} className="btn btn-ghost btn-sm"><X size={12} /></button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Add Event Form */}
            <AnimatePresence>
              {showAddForm && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}>
                  <div style={{ paddingTop: 12, borderTop: '1px solid var(--c-border)', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {Object.keys(EVENT_COLORS).filter(t => t !== 'weather').map(type => (
                        <button key={type} onClick={() => setNewEvent(p => ({ ...p, type }))}
                          style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99, cursor: 'pointer', textTransform: 'capitalize', border: `1px solid ${newEvent.type === type ? EVENT_COLORS[type].dot : 'var(--c-border)'}`, background: newEvent.type === type ? EVENT_COLORS[type].dot + '20' : 'transparent', color: newEvent.type === type ? EVENT_COLORS[type].dot : 'var(--c-text-muted)' }}>
                          {type}
                        </button>
                      ))}
                    </div>
                    <input value={newEvent.title} onChange={e => setNewEvent(p => ({ ...p, title: e.target.value }))} placeholder="Event title…"
                      style={{ background: 'var(--c-bg-card)', border: '1px solid var(--c-border)', borderRadius: 8, padding: '8px 12px', color: 'var(--c-text-primary)', fontSize: 13, outline: 'none', fontFamily: 'Inter, sans-serif' }} />
                    <textarea value={newEvent.note} onChange={e => setNewEvent(p => ({ ...p, note: e.target.value }))} placeholder="Optional note…" rows={2}
                      style={{ background: 'var(--c-bg-card)', border: '1px solid var(--c-border)', borderRadius: 8, padding: '8px 12px', color: 'var(--c-text-primary)', fontSize: 13, outline: 'none', resize: 'none', fontFamily: 'Inter, sans-serif' }} />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={handleAddEvent} className="btn btn-primary btn-sm" style={{ flex: 1 }}><Save size={12} /> Save</button>
                      <button onClick={() => setShowAddForm(false)} className="btn btn-ghost btn-sm"><X size={12} /></button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Events list */}
          <div className="glass-card" style={{ flex: 1, padding: '16px 18px', minHeight: 200 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--c-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 12 }}>Events & Records</div>
            {selectedEvents.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--c-text-muted)', fontSize: 13 }}>
                <Moon size={24} style={{ marginBottom: 8, opacity: 0.4 }} />
                <div>No records for this day</div>
                <div style={{ fontSize: 11, marginTop: 4 }}>Tap + Add to log an event</div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {selectedEvents.map(event => (
                  <EventBadge key={event.id} event={event} onDelete={handleDelete} />
                ))}
              </div>
            )}
          </div>

          {/* Weather snapshot card */}
          {liveSensors.weather && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ padding: '14px 16px', border: '1px solid rgba(6,182,212,0.2)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#06B6D4', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Live Weather (Your Location)</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ fontSize: 32 }}>{liveSensors.weather.icon}</div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--c-text-primary)' }}>{liveSensors.weather.temp}°C</div>
                  <div style={{ fontSize: 12, color: 'var(--c-text-muted)' }}>{liveSensors.weather.condition} · Feels {liveSensors.weather.feelsLike}°C</div>
                  <div style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>Humidity {liveSensors.weather.humidity}% · Wind {liveSensors.weather.windSpeed} km/h</div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
