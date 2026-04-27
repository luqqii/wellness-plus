import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import {
  Footprints, Moon, Flame, Heart, TrendingUp,
  Sparkles, ChevronRight, Zap, ArrowUpRight, Brain, Target, Check,
  CloudRain, BedDouble, Trophy, AlertCircle, Lightbulb
} from 'lucide-react';
import WellnessScore from '../components/dashboard/WellnessScore';
import HabitSwipe from '../components/dashboard/HabitSwipe';
import DynamicIcon from '../components/ui/DynamicIcon';
import { SAMPLE_INSIGHTS, SAMPLE_METRICS } from '../utils/constants';
import useHabitStore from '../store/habitStore';
import useMetricsStore from '../store/metricsStore';
import useMetrics from '../hooks/useMetrics';
import { useNavigate } from 'react-router-dom';
import MobileFeaturePortal from '../components/dashboard/MobileFeaturePortal';
import useLessonStore from '../store/lessonStore';
import PredictiveWellnessInsights from '../components/features/PredictiveWellnessInsights';
import ContextAwareSuggestions from '../components/features/ContextAwareSuggestions';
import WeatherWidget from '../components/features/WeatherWidget';
import LiveSensorPanel from '../components/features/LiveSensorPanel';


const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: 'var(--c-bg-card)', border: '1px solid var(--c-border-strong)',
      borderRadius: 10, padding: '8px 12px', fontSize: 12,
    }}>
      <div style={{ color: 'var(--c-text-muted)', marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || p.stroke || p.fill, fontWeight: 600 }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
};

const NUDGE_CARDS = [
  { lucideIcon: CloudRain, text: "It's cloudy today — try this 10-min indoor mobility flow", type: 'blue', action: 'Start Flow' },
  { lucideIcon: BedDouble, text: 'Sleep was low (7.2h). AI suggests 5% less intensity today', type: 'purple', action: 'See Plan' },
  { lucideIcon: Trophy, text: 'Streak Alert! Meditation day 12 — don\'t break the chain!', type: 'orange', action: 'Log Now' },
];

const STATS = [
  { icon: Footprints, label: 'Steps', value: '7,842', sub: '/ 10,000', pct: 78, color: 'var(--c-teal)'   },
  { icon: Moon,       label: 'Sleep',  value: '7.2h',  sub: '/ 8h',   pct: 90, color: 'var(--c-purple)' },
  { icon: Flame,      label: 'Calories', value: '1,850', sub: '/ 2,200', pct: 84, color: 'var(--c-orange)' },
  { icon: Heart,      label: 'Stress',  value: '4/10', sub: 'Low',    pct: 40, color: 'var(--c-blue)'   },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, ease: [0.4, 0, 0.2, 1], delay },
});

export default function DashboardPage() {
  const { today, weekly, loading } = useMetrics();
  const completionRate = useHabitStore((s) => s.getCompletionRate());
  const liveSensors = useMetricsStore((s) => s.liveSensors);
  const todayMetrics = useMetricsStore((s) => s.todayMetrics);
  const navigate = useNavigate();

  const { getDailyLessons, completedIds } = useLessonStore();
  const dailyLessons = getDailyLessons();

  // Metrics mapping
  const currentMetric = today || SAMPLE_METRICS.today;

  // Safe fallbacks to prevent NaN crashes
  // Merge live sensors with stored metrics (stored metrics = manual logs or previous sensor data)
  const steps = Math.max(Number(liveSensors?.steps || 0), Number(todayMetrics?.steps || 0));
  const sleepHours = Number(todayMetrics?.sleep?.hours || liveSensors?.sleep?.hours || currentMetric?.sleep?.hours || 0);
  const cal = Math.max(Number(liveSensors?.activeCalories || 0), Number(todayMetrics?.activity?.calories || 0));
  const stress = Number(liveSensors?.stressLevel) || Number(todayMetrics?.stressLevel) || 5;

  const STATS = [
    { icon: Footprints, label: 'Steps',    value: steps.toLocaleString(), sub: '/ 10,000', pct: Math.min(100, (steps/10000)*100), color: 'var(--c-teal)', path: '/activity' },
    { icon: Moon,       label: 'Sleep',    value: `${sleepHours}h`, sub: '/ 8h', pct: Math.min(100, (sleepHours/8)*100), color: 'var(--c-purple)', path: '/activity' },
    { icon: Flame,      label: 'Calories', value: Math.round(cal).toLocaleString(), sub: '/ 2,200 kcal', pct: Math.min(100, (cal/2200)*100), color: 'var(--c-orange)', path: '/activity' },
    { icon: Brain,      label: 'Stress',   value: `${stress}/10`, sub: stress > 7 ? 'High' : 'Normal', pct: stress*10, color: 'var(--c-blue)', path: '/activity' },
  ];

  // Map weekly trend for chart
  const resolvedWeekly = (weekly && weekly.length > 0) ? weekly : SAMPLE_METRICS.weeklyScores;
  const weeklyData = resolvedWeekly.map((w, index) => {
    // If it's the last day (Today), use live sensors for steps
    const isToday = index === resolvedWeekly.length - 1;
    return {
      day: w.day || (w.date ? new Date(w.date).toLocaleDateString([], { weekday: 'short' }) : '---'),
      steps: isToday ? Math.max(w.steps || 0, steps) : (w.steps || 0),
      score: w.wellnessScore || w.score || 50
    };
  });


  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 1100 }}>
      
      {/* DEPLOYMENT VERIFICATION FLAG */}
      <div className="mobile-only-block" style={{ padding: '4px 12px', background: 'var(--c-orange)', color: 'white', fontSize: 10, fontWeight: 900, borderRadius: 99, alignSelf: 'center', marginBottom: -12, letterSpacing: '0.5px' }}>
        LATEST VERSION V2.0 (MOBILE OPTIMIZED)
      </div>

      {/* MOBILE FEATURE PORTAL - Immediate access to all 1:1 features */}
      <div className="mobile-only-block">
        <MobileFeaturePortal />
      </div>

      <LiveSensorPanel />

      {/* Weather Widget */}
      <WeatherWidget weather={liveSensors?.weather} />

      <ContextAwareSuggestions metrics={currentMetric} />
      
      {/* Wellness+ DAILY LESSONS */}
      <motion.div {...fadeUp(0)} style={{ background: '#FFFFFF', borderRadius: 24, padding: 24, boxShadow: '0 8px 24px rgba(0,0,0,0.04)', border: '1px solid #EAE6DF' }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: '#1A1D20', marginBottom: 16 }}>Your Daily Psychology</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {dailyLessons.map((lesson) => {
            const isDone = completedIds.includes(lesson.id);
            return (
              <motion.div key={lesson.id} 
                onClick={() => navigate('/lessons', { state: { openLessonId: lesson.id } })}
                whileTap={{ scale: 0.98, background: '#F0EAE2' }}
                style={{ 
                display: 'flex', alignItems: 'center', gap: 14, 
                padding: '16px', borderRadius: 16, 
                background: isDone ? '#FDFBF8' : '#F5F3EF',
                border: `2px solid ${isDone ? 'var(--c-teal)' : 'transparent'}`,
                cursor: 'pointer',
                transition: 'border-color 200ms ease, background-color 200ms ease'
              }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: isDone ? 'var(--c-teal)' : '#FFFFFF', border: isDone ? 'none' : '2px solid #EAE6DF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {isDone && <Check size={16} color="white" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1D20', textDecoration: isDone ? 'line-through' : 'none', opacity: isDone ? 0.6 : 1 }}>{lesson.title}</div>
                  <div style={{ fontSize: 13, color: '#4A5568', marginTop: 2 }}>{lesson.duration} read</div>
                </div>
                {!isDone && <ChevronRight size={18} color="#718096" />}
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* === ROW 1: Score + Stats === */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] xl:grid-cols-[280px_1fr] gap-6">
        {/* Wellness Score Card */}
        <motion.div {...fadeUp(0)} className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Sparkles size={14} color="var(--c-blue)" />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-blue)' }}>LIVE SCORE</span>
          </div>
          <WellnessScore score={Math.round(Math.min(100, Math.max(0, 80 - (stress * 3) + (steps / 1000) + (liveSensors?.isWorkoutActive ? 8 : 0))))} size={160} />

          <div style={{
            width: '100%', padding: '10px 14px',
            background: 'rgba(79,141,255,0.08)', borderRadius: 'var(--r-md)',
            border: '1px solid rgba(79,141,255,0.15)',
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            <TrendingUp size={13} color="var(--c-teal)" />
            <span style={{ fontSize: 12, color: 'var(--c-text-secondary)' }}>
              <strong style={{ color: 'var(--c-teal)' }}>+6%</strong> vs last week
            </span>
          </div>
        </motion.div>

        {/* Stats Grid 2x2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {STATS.map((s, i) => (
            <motion.div 
              key={s.label} 
              {...fadeUp(i * 0.07 + 0.1)} 
              className="stat-card"
              onClick={() => navigate(s.path)}
              whileHover={{ y: -4, background: 'rgba(255,255,255,0.06)', borderColor: s.color + '40' }}
              style={{ cursor: 'pointer', transition: 'border-color 200ms ease' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div className="stat-icon-wrap" style={{ background: s.color + '18' }}>
                  <s.icon size={17} color={s.color} />
                </div>
                <ArrowUpRight size={13} color="var(--c-text-muted)" />
              </div>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.sub} {s.label}</div>
              </div>
              <div className="progress-track">
                <motion.div
                  className="progress-fill"
                  style={{ background: s.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${s.pct || 0}%` }}
                  transition={{ duration: 1, delay: 0.5 + i * 0.08 }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* === ROW 2: Next Milestone & AI Nudges === */}
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6">
        {/* Next Milestone Widget */}
        <motion.div {...fadeUp(0.25)} className="glass-card" style={{ display: 'flex', flexDirection: 'column', padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Target size={16} color="var(--c-teal)" />
            <span className="text-h3">Next Milestone</span>
          </div>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 12 }}>
            <div>
              <div style={{ fontSize: 13, color: 'var(--c-text-secondary)', marginBottom: 4 }}>Goal: Consistency</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--c-text-primary)' }}>14-Day Activity Streak</div>
            </div>
            
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 6 }}>
                <span style={{ color: 'var(--c-teal)', fontWeight: 600 }}>Day 10/14</span>
                <span style={{ color: 'var(--c-text-muted)' }}>4 days left</span>
              </div>
              <div className="progress-track" style={{ height: 6 }}>
                <motion.div 
                  className="progress-fill progress-fill-teal" 
                  initial={{ width: 0 }} 
                  animate={{ width: `${(10/14)*100}%` }} 
                  transition={{ duration: 1, delay: 0.5 }} 
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* AI Nudge Cards */}
        <motion.div {...fadeUp(0.3)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <Brain size={14} color="var(--c-purple)" />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-purple)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>AI Coach Nudges</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ height: 'calc(100% - 28px)' }}>
            {NUDGE_CARDS.map((n, i) => (
              <motion.div
                key={i}
                className={`nudge-card nudge-card-${n.type}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 + i * 0.08 }}
                whileHover={{ y: -4, background: 'var(--c-bg-hover)' }}
                onClick={() => {
                  if (n.action.includes('Flow')) navigate('/activity');
                  else if (n.action.includes('Plan')) navigate('/nutrition');
                  else if (n.action.includes('Log')) navigate('/habits');
                }}
                style={{ flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', transition: 'all 200ms ease' }}
              >
                <div>
                  <div className="nudge-icon" style={{ marginBottom: 10 }}>
                    {(() => { const NI = n.lucideIcon; return <NI size={20} color={n.type === 'blue' ? 'var(--c-blue)' : n.type === 'purple' ? 'var(--c-purple)' : 'var(--c-orange)'} />; })()}
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--c-text-primary)', lineHeight: 1.4, marginBottom: 8 }}>{n.text}</p>
                </div>
                <div 
                  style={{
                    fontSize: 11, fontWeight: 600,
                    color: n.type === 'blue' ? 'var(--c-blue)' : n.type === 'purple' ? 'var(--c-purple)' : 'var(--c-orange)',
                    display: 'flex', alignItems: 'center', gap: 4
                  }}
                >
                  {n.action} <ChevronRight size={11} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* === ROW 3: Food Diary Summary + Chart === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Calorie Summary */}
        <motion.div {...fadeUp(0.4)} className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span className="text-h3">Calories Today</span>
            <span className="badge badge-blue">Goal: 2,200</span>
          </div>

          {/* Equation */}
          <div className="macro-equation" style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 12, padding: '14px 16px',
            background: 'var(--c-bg-hover)', borderRadius: 'var(--r-md)',
            border: '1px solid var(--c-border)', marginBottom: 16
          }}>
            {[
              { val: '2,200', label: 'Goal', color: 'var(--c-text-primary)' },
              { val: '−', label: '', color: 'var(--c-text-muted)', isSym: true },
              { val: (currentMetric?.calories || 0).toLocaleString(), label: 'Food', color: 'var(--c-orange)' },
              { val: '+', label: '', color: 'var(--c-text-muted)', isSym: true },
              { val: Math.round(liveSensors.activeCalories).toLocaleString(), label: 'Exercise', color: 'var(--c-teal)' },
              { val: '=', label: '', color: 'var(--c-text-muted)', isSym: true },
              { val: Math.max(0, 2200 - (currentMetric?.calories || 0) + Math.round(liveSensors.activeCalories)).toLocaleString(), label: 'Remaining', color: 'var(--c-blue)' },
            ].map((item, i) => (
              <div key={i} style={{ textAlign: 'center' }}>
                <div className={item.isSym ? 'macro-equation-sym' : 'macro-equation-val'} style={{ fontSize: item.label ? 20 : 24, fontWeight: 800, color: item.color, letterSpacing: '-0.5px' }}>{item.val}</div>
                {item.label && <div style={{ fontSize: 10, color: 'var(--c-text-muted)', marginTop: 2 }}>{item.label}</div>}
              </div>
            ))}
          </div>

          {/* Macro bars */}
          {[
            { label: 'Carbs', val: currentMetric?.nutrition?.carbs || 0, max: 275, color: 'var(--c-teal)', unit: 'g' },
            { label: 'Protein', val: currentMetric?.nutrition?.protein || 0, max: 120, color: 'var(--c-orange)', unit: 'g' },
            { label: 'Fat', val: currentMetric?.nutrition?.fat || 0, max: 73, color: 'var(--c-purple)', unit: 'g' },
          ].map((m) => (
            <div key={m.label} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--c-text-secondary)' }}>{m.label}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--c-text-primary)' }}>{m.val}{m.unit} <span style={{ color: 'var(--c-text-muted)', fontWeight: 400 }}>/ {m.max}{m.unit}</span></span>
              </div>
              <div className="progress-track">
                <motion.div
                  className="progress-fill"
                  style={{ background: m.color }}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (m.val / m.max) * 100)}%` }}
                  transition={{ duration: 1, delay: 0.6 }}
                />
              </div>
            </div>
          ))}
        </motion.div>

        {/* Weekly Steps chart */}
        <motion.div {...fadeUp(0.45)} className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span className="text-h3">Weekly Steps</span>
            <span className="badge badge-teal">↑ 12%</span>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--c-text-muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--c-text-muted)' }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="steps" name="Steps" radius={[6, 6, 0, 0]} fill="url(#stepsGrad)" />
                <defs>
                  <linearGradient id="stepsGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--c-blue)" />
                    <stop offset="100%" stopColor="var(--c-purple)" stopOpacity={0.6} />
                  </linearGradient>
                </defs>
              </BarChart>

            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* === ROW 4: Quick Habits === */}
      <motion.div {...fadeUp(0.5)} className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <span className="text-h3">Today's Habits</span>
            <span style={{ marginLeft: 10, fontSize: 12, color: 'var(--c-text-muted)' }}>
              {completionRate}% complete
            </span>
          </div>
          <span className="badge badge-blue">{completionRate}%</span>
        </div>
        <HabitSwipe />
      </motion.div>

      {/* === ROW 5: AI Insights + Weekly Forecast === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* AI Insights */}
        <motion.div {...fadeUp(0.55)} className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <Sparkles size={14} color="var(--c-yellow)" />
            <span className="text-h3">AI Insights</span>
            <span className="badge badge-yellow" style={{ marginLeft: 'auto' }}>4 new</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { icon: '⚠️', title: 'Stress Alert', body: 'Sleep patterns suggest elevated stress. Try 10-min meditation before lunch.', color: 'var(--c-red)', badge: 'Prediction', path: '/activity' },
              { icon: '💡', title: 'Hydration Boost', body: "You're averaging 5 glasses. Keep a bottle at your desk to hit 8 today.", color: 'var(--c-blue)', badge: 'Suggestion', path: '/habits' },
              { icon: '🏆', title: 'Streak Master!', body: 'Meditation habit: 12 consecutive days. Amazing consistency!', color: 'var(--c-teal)', badge: 'Achievement', path: '/habits' },
            ].map((ins, i) => (
              <div key={i} style={{
                display: 'flex', gap: 12, padding: '12px 14px',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid var(--c-border)',
                borderRadius: 'var(--r-lg)',
                cursor: 'pointer',
                transition: 'all 200ms ease',
              }}
                onClick={() => navigate(ins.path)}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.055)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
              >
                <div style={{ flexShrink: 0, marginTop: 1 }}><DynamicIcon icon={ins.icon} size={22} color={ins.color} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-text-primary)' }}>{ins.title}</span>
                    <span style={{ fontSize: 10, fontWeight: 600, color: ins.color, padding: '1px 7px', border: `1px solid ${ins.color}30`, borderRadius: 99, background: ins.color + '15' }}>{ins.badge}</span>
                  </div>
                  <p style={{ fontSize: 12, color: 'var(--c-text-secondary)', lineHeight: 1.5 }}>{ins.body}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Weekly Forecast */}
        <motion.div {...fadeUp(0.6)} className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Zap size={14} color="var(--c-purple)" />
                <span className="text-h3">Weekly Forecast</span>
              </div>
              <p style={{ fontSize: 11, color: 'var(--c-text-muted)', marginTop: 2 }}>AI-predicted wellness trajectory</p>
            </div>
            <span className="badge badge-purple">Trending Up</span>
          </div>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--c-purple)" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="var(--c-purple)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--c-text-muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--c-text-muted)' }} domain={[50, 100]} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="score" name="Score" stroke="var(--c-purple)" strokeWidth={2.5} fill="url(#scoreGrad)" dot={{ fill: 'var(--c-purple)', r: 4, strokeWidth: 0 }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
