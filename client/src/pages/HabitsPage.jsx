import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Flame, Target, TrendingUp, Trash2, X, Sparkles } from 'lucide-react';
import useHabitStore from '../store/habitStore';

const ICONS = ['🧘', '💧', '🏋️', '📚', '🍬', '🤸', '🏃', '🎯', '💤', '🥗', '🧠', '🎵', '✍️', '🌿', '🚴', '🧗'];
const COLORS = ['#4f8dff', '#00d4aa', '#ff7940', '#9b6dff', '#fbbf24', '#2dd4a4', '#ff5b5b', '#06b6d4'];

const generateRealHeatmap = (habits) => {
  // Generate last 14 weeks (7 days each)
  const heatmap = [];
  const today = new Date();
  today.setHours(0,0,0,0);
  
  for (let w = 13; w >= 0; w--) {
    const week = [];
    for (let d = 0; d < 7; d++) {
      // calc date for this cell
      const cellDate = new Date(today);
      cellDate.setDate(today.getDate() - (w * 7) - (6 - d));
      
      // count how many habits were completed on this cellDate
      let completedCount = 0;
      habits.forEach(h => {
        if (h.progress && h.progress.some(p => {
          const pd = new Date(p.date);
          return pd.getFullYear() === cellDate.getFullYear() && 
                 pd.getMonth() === cellDate.getMonth() && 
                 pd.getDate() === cellDate.getDate() && 
                 p.completed;
        })) {
          completedCount++;
        }
      });
      week.push(completedCount > 4 ? 4 : completedCount);
    }
    heatmap.push(week);
  }
  return heatmap;
};

export default function HabitsPage() {
  const { habits, toggleHabit, addHabit, deleteHabit, getCompletionRate } = useHabitStore();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', icon: '🎯', color: '#4f8dff', time: 'any' });
  const rate = getCompletionRate();
  const heatmapData = React.useMemo(() => generateRealHeatmap(habits), [habits]);

  const aiSuggestions = [
    { title: '5-Min Deep Breathing', icon: '🧘', time: 'afternoon', reason: 'To manage afternoon stress spikes' },
    { title: 'Read 10 Pages', icon: '📚', time: 'evening', reason: 'To improve pre-sleep wind down' }
  ];

  const handleCreate = () => {
    if (!form.title.trim()) return;
    addHabit({
      title: form.title,
      icon: form.icon,
      color: form.color,
      timeTemplate: form.time || 'any'
    });
    setForm({ title: '', icon: '🎯', color: '#4f8dff', time: 'any' });
    setShowForm(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 900 }}>

      {/* Stats row */}
      <div className="responsive-grid-4">
        {[
          { label: "Today's Progress", value: `${rate}%`,  icon: Target,     color: 'var(--c-blue)' },
          { label: 'Active Habits',    value: habits.length, icon: TrendingUp, color: 'var(--c-teal)' },
          { label: 'Total Streaks',    value: `🔥 ${habits.reduce((a, h) => a + h.streak.current, 0)}`, icon: Flame, color: 'var(--c-orange)' },
          { label: 'Done Today',       value: `${habits.filter(h => h.completedToday).length} / ${habits.length}`, icon: Check, color: 'var(--c-purple)' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="glass-card"
            style={{ padding: '16px 18px' }}
          >
            <div style={{
              width: 34, height: 34, borderRadius: 'var(--r-md)',
              background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 10
            }}>
              <s.icon size={16} color={s.color} />
            </div>
            <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-1px', color: 'var(--c-text-primary)', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--c-text-muted)', marginTop: 4 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Heatmap */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--c-text-primary)' }}>Activity Heatmap</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--c-text-muted)' }}>
            <span>Less</span>
            {[0, 1, 2, 3, 4].map(l => <div key={l} className="heatmap-cell" data-level={l} style={{ width: 11, height: 11 }} />)}
            <span>More</span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 4, overflowX: 'auto', paddingBottom: 8 }}>
          {heatmapData.map((week, wi) => (
            <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {week.map((level, di) => (
                <motion.div
                  key={di}
                  className="heatmap-cell"
                  data-level={level}
                  title={`${level} habits completed`}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: wi * 0.03 + di * 0.01, duration: 0.25 }}
                />
              ))}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Daily Timeline View */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card">
        <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Today's Timeline</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 32, position: 'relative', marginTop: 10 }}>
          {/* Vertical line - centered at 80px */}
          <div style={{ position: 'absolute', left: 80, top: 0, bottom: 0, width: 2, background: 'var(--c-border-strong)', opacity: 0.4 }} />
          
          {['morning', 'afternoon', 'evening', 'any'].map((partOfDay) => {
             const items = habits.filter(h => (h.timeTemplate || 'any') === partOfDay);
             if (items.length === 0) return null;
             return (
               <div key={partOfDay} style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 40 }}>
                 {/* 1. Label - Right aligned to the line */}
                 <div style={{ width: 60, fontSize: 11, fontWeight: 800, color: 'var(--c-text-muted)', textTransform: 'uppercase', letterSpacing: '0.8px', textAlign: 'right', paddingTop: 6 }}>
                   {partOfDay}
                 </div>
                 
                 {/* 2. Marker - Perfectly centered on the line (Line is at 80px, Label+Gap = 60+40/2 = 80) */}
                 <div style={{ 
                   position: 'absolute', left: 77, top: 10, width: 8, height: 8, borderRadius: '50%', 
                   background: 'var(--c-blue)', border: '2px solid var(--c-bg-card)', zIndex: 2,
                   boxShadow: '0 0 10px var(--c-blue-glow)' 
                 }} />

                 {/* 3. Content Column */}
                 <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {items.map(habit => (
                      <div key={habit.id} style={{ display: 'flex', alignItems: 'center', gap: 12, opacity: habit.completedToday ? 0.6 : 1 }}>
                         <span style={{ fontSize: 18 }}>{habit.icon}</span>
                         <span style={{ fontSize: 14, fontWeight: 500, color: habit.completedToday ? 'var(--c-text-muted)' : 'var(--c-text-primary)', textDecoration: habit.completedToday ? 'line-through' : 'none' }}>
                           {habit.title}
                         </span>
                      </div>
                    ))}
                 </div>
               </div>
             );
          })}
        </div>
      </motion.div>

      {/* AI Recommended Habits */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass-card" style={{ border: '1px solid rgba(155,109,255,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
          <Sparkles size={16} color="var(--c-purple)" />
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--c-purple)' }}>AI Suggested Adjustments</span>
        </div>
        <div className="responsive-grid-2">
          {aiSuggestions.map((sug, i) => (
            <div key={i} style={{ padding: '12px', background: 'var(--c-bg-card)', borderRadius: 'var(--r-md)', border: '1px solid var(--c-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <span style={{ fontSize: 20 }}>{sug.icon}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-text-primary)' }}>{sug.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--c-purple)', marginTop: 2 }}>{sug.reason}</div>
                </div>
              </div>
              <button 
                className="btn btn-icon-sm" 
                onClick={() => addHabit({ 
                  title: sug.title, 
                  icon: sug.icon, 
                  timeTemplate: sug.time, 
                  color: '#9b6dff' 
                })}
              >
                <Plus size={14} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Habit list */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--c-text-primary)' }}>My Habits</span>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <Plus size={15} /> Add Habit
          </button>
        </div>

        {/* Add form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', marginBottom: 14 }}
            >
              <div className="glass-card" style={{ border: '1px solid rgba(79,141,255,0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-text-primary)' }}>New Habit</span>
                  <button className="btn btn-icon" onClick={() => setShowForm(false)}>
                    <X size={14} />
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <input
                    value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="Habit name..."
                    autoFocus
                    style={{
                      width: '100%', background: 'var(--c-bg-card)',
                      border: '1px solid var(--c-border-strong)', borderRadius: 'var(--r-md)',
                      padding: '10px 14px', fontSize: 14, color: 'var(--c-text-primary)',
                      outline: 'none', fontFamily: 'Inter, sans-serif',
                      transition: 'border-color 150ms ease',
                    }}
                    onFocus={e => e.target.style.borderColor = 'rgba(79,141,255,0.5)'}
                    onBlur={e => e.target.style.borderColor = 'var(--c-border-strong)'}
                  />

                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--c-text-muted)', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 8 }}>Icon</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                      {ICONS.map(icon => (
                        <button
                          key={icon}
                          onClick={() => setForm({ ...form, icon })}
                          style={{
                            width: 38, height: 38, borderRadius: 'var(--r-md)', fontSize: 18,
                            background: form.icon === icon ? 'var(--c-blue-dim)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${form.icon === icon ? 'rgba(79,141,255,0.4)' : 'var(--c-border)'}`,
                            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 150ms ease',
                          }}
                        >{icon}</button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--c-text-muted)', letterSpacing: '0.6px', textTransform: 'uppercase', marginBottom: 8 }}>Time</div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {['morning', 'afternoon', 'evening', 'any'].map(time => (
                        <button
                          key={time}
                          onClick={() => setForm({ ...form, time })}
                          style={{
                            padding: '6px 12px', borderRadius: 'var(--r-full)', fontSize: 12, textTransform: 'capitalize',
                            background: form.time === time ? 'var(--c-blue-dim)' : 'rgba(255,255,255,0.04)',
                            border: `1px solid ${form.time === time ? 'rgba(79,141,255,0.4)' : 'var(--c-border)'}`,
                            color: form.time === time ? 'var(--c-blue)' : 'var(--c-text-secondary)',
                            cursor: 'pointer', transition: 'all 150ms ease',
                          }}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button className="btn btn-primary" onClick={handleCreate} style={{ width: '100%', justifyContent: 'center', padding: '12px' }}>
                    Create Habit
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Habits */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {habits.map((habit, i) => (
            <motion.div
              key={habit.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              layout
              className="glass-card"
              style={{ padding: '14px 18px' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {/* Toggle button */}
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => toggleHabit(habit.id)}
                  style={{
                    width: 42, height: 42, borderRadius: 'var(--r-md)', cursor: 'pointer',
                    border: `2px solid ${habit.completedToday ? 'var(--c-blue)' : 'var(--c-border-strong)'}`,
                    background: habit.completedToday ? 'var(--c-blue)' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 20, flexShrink: 0,
                    transition: 'all 250ms ease',
                  }}
                >
                  {habit.completedToday
                    ? <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Check size={20} color="white" /></motion.div>
                    : <span>{habit.icon}</span>
                  }
                </motion.button>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: habit.completedToday ? 'var(--c-text-muted)' : 'var(--c-text-primary)', textDecoration: habit.completedToday ? 'line-through' : 'none' }}>
                    {habit.title}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 3 }}>
                    <span style={{ fontSize: 12, color: 'var(--c-text-muted)' }}>🔥 {habit.streak.current} day streak</span>
                    <span style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>Best: {habit.streak.longest}</span>
                    {habit.time && <span style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>⏰ {habit.time}</span>}
                  </div>
                </div>

                {/* Streak badge */}
                {habit.streak.current >= 7 && (
                  <span className="badge badge-orange">🔥 On Fire</span>
                )}

                {/* Delete */}
                <button
                  onClick={() => deleteHabit(habit.id)}
                  className="btn btn-ghost"
                  style={{ padding: '6px', opacity: 0.4, color: 'var(--c-red)' }}
                  onMouseEnter={e => e.currentTarget.style.opacity = '1'}
                  onMouseLeave={e => e.currentTarget.style.opacity = '0.4'}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
