import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { Footprints, Zap, Clock, Battery, TrendingUp, TrendingDown, Minus, ChevronRight, Brain, RefreshCw, Bot, PersonStanding, Waves, Moon, Leaf, Dna, MapPin, Edit3 } from 'lucide-react';
import api from '../services/api';
import useMetricsStore from '../store/metricsStore';
import ManualLogModal from '../components/features/ManualLogModal';
import WeatherWidget from '../components/features/WeatherWidget';
import { getOutdoorSuitability } from '../hooks/useWeather';

// Fallback chart data when no backend data exists
const FALLBACK_ACTIVITY = [
  { day: 'Mon', steps: 6200, calories: 320, active: 45 },
  { day: 'Tue', steps: 5800, calories: 280, active: 35 },
  { day: 'Wed', steps: 9100, calories: 450, active: 65 },
  { day: 'Thu', steps: 7500, calories: 380, active: 52 },
  { day: 'Fri', steps: 7842, calories: 390, active: 48 },
  { day: 'Sat', steps: 4200, calories: 220, active: 30 },
  { day: 'Sun', steps: 3500, calories: 180, active: 25 },
];

const FALLBACK_SLEEP = [
  { day: 'Mon', hours: 6.5, quality: 6 }, { day: 'Tue', hours: 7.0, quality: 7 },
  { day: 'Wed', hours: 7.8, quality: 8 }, { day: 'Thu', hours: 6.2, quality: 5 },
  { day: 'Fri', hours: 7.2, quality: 8 }, { day: 'Sat', hours: 8.5, quality: 9 },
  { day: 'Sun', hours: 7.0, quality: 7 },
];

const FALLBACK_FORECAST = [
  { day: 'Mon', recovery: 68, burnout: 32 }, { day: 'Tue', recovery: 62, burnout: 38 },
  { day: 'Wed', recovery: 75, burnout: 25 }, { day: 'Thu', recovery: 70, burnout: 30 },
  { day: 'Fri', recovery: 72, burnout: 28 }, { day: 'Sat', recovery: 80, burnout: 20 },
  { day: 'Sun', recovery: 85, burnout: 15 },
];

// Health Memory — built from milestones; future: persist to DB
const HEALTH_MEMORY = [
  { date: 'Apr 11', title: 'Connected AI Coach', context: 'Started getting personalized insights', lucideIcon: Bot, color: 'var(--c-blue)' },
  { date: 'Mar 28', title: 'Hit 10K steps for first time', context: 'During a high-stress work week', lucideIcon: PersonStanding, color: 'var(--c-teal)' },
  { date: 'Mar 21', title: 'Meditation streak: 7 days', context: 'After starting morning routine', lucideIcon: Waves, color: 'var(--c-purple)' },
  { date: 'Mar 14', title: 'Sleep improved 6h → 7.5h', context: 'Removed late-night screen time', lucideIcon: Moon, color: 'var(--c-blue)' },
  { date: 'Mar 7',  title: 'Started wellness journey', context: 'Initial wellness score: 52', lucideIcon: Leaf, color: 'var(--c-green)' },
];

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: 'var(--c-bg-elevated)', border: '1px solid var(--c-border-strong)', borderRadius: 12, padding: '10px 14px', fontSize: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>
      <div style={{ color: 'var(--c-text-muted)', marginBottom: 6, fontWeight: 600 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.stroke || p.fill, fontWeight: 600, marginBottom: 2 }}>
          {p.name}: <span style={{ color: 'var(--c-text-primary)' }}>{p.value}</span>
        </div>
      ))}
    </div>
  );
};

const TrendIcon = ({ trend }) => {
  if (trend === 'increasing') return <TrendingUp size={13} color="var(--c-teal)" />;
  if (trend === 'decreasing') return <TrendingDown size={13} color="var(--c-red)" />;
  return <Minus size={13} color="var(--c-text-muted)" />;
};

export default function ActivityPage() {
  const liveSensors = useMetricsStore(s => s.liveSensors);
  const todayMetrics = useMetricsStore(s => s.todayMetrics);
  const [prediction, setPrediction] = useState(null);
  const [recovery, setRecovery] = useState(null);
  const [trend, setTrend] = useState([]);
  const [memoryData, setMemoryData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedMemory, setExpandedMemory] = useState(null);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);

  // Live sensor-derived metrics
  const liveSteps = liveSensors.steps || 0;
  const liveCalories = Math.round(liveSensors.activeCalories || 0);
  const sleepHours = todayMetrics?.sleep?.hours || 0;
  const liveSpeed = liveSensors.speed != null ? liveSensors.speed : null;
  const liveLocation = liveSensors.location;

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [predRes, recRes, trendRes, memRes] = await Promise.allSettled([
          api.get('/activity/prediction'),
          api.get('/activity/recovery'),
          api.get('/metrics/trend?days=7'),
          api.get('/activity/memory')
        ]);

        if (predRes.status === 'fulfilled') setPrediction(predRes.value?.data);
        if (recRes.status === 'fulfilled') setRecovery(recRes.value?.data);
        if (trendRes.status === 'fulfilled') setTrend(trendRes.value?.data || []);
        if (memRes.status === 'fulfilled') setMemoryData(memRes.value?.data || []);
      } catch (e) {
        console.warn('Activity data fetch error:', e.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();

    const handleUpdate = () => fetchAll();
    window.addEventListener('metrics-updated', handleUpdate);
    return () => window.removeEventListener('metrics-updated', handleUpdate);
  }, []);

  // Build chart data from real metrics trend or fallback
  const activityChartData = trend.length >= 3
    ? trend.map((m) => ({
        day: new Date(m.date).toLocaleDateString('en', { weekday: 'short' }),
        steps: m.steps || 0,
        calories: m.nutrition?.calories || 0,
        active: m.steps ? Math.round(m.steps / 130) : 0,
      }))
    : FALLBACK_ACTIVITY;

  const sleepChartData = trend.length >= 3
    ? trend.map((m, index) => {
        const isToday = index === trend.length - 1;
        return {
          day: new Date(m.date).toLocaleDateString('en', { weekday: 'short' }),
          hours: isToday && sleepHours > 0 ? sleepHours : (m.sleep?.hours || 0),
          quality: m.sleep?.quality || 0,
        };
      })
    : FALLBACK_SLEEP;

  const recoveryScore = recovery?.recoveryScore ?? 72;
  const fatigueRisk = prediction?.predictions?.fatigueRisk ?? 'low';
  const avgSteps = prediction?.weeklyAverages?.steps ?? 7842;
  const avgSleep = prediction?.weeklyAverages?.sleepHours ?? 7.0;
  const stepsTrend = prediction?.trends?.steps ?? 'stable';
  const recommendedIntensity = prediction?.predictions?.recommendedIntensity ?? 'moderate';
  const hasRealData = !!prediction?.dataPoints && prediction.dataPoints >= 3;

  const intensityLabel = {
    high: { label: 'High Intensity', color: 'var(--c-orange)', bg: 'rgba(255,121,64,0.15)' },
    moderate: { label: 'Moderate', color: 'var(--c-teal)', bg: 'rgba(0,212,170,0.12)' },
    light: { label: 'Light Only', color: 'var(--c-blue)', bg: 'rgba(79,141,255,0.12)' },
    light_or_rest: { label: 'Rest Day', color: 'var(--c-purple)', bg: 'rgba(155,109,255,0.12)' },
  }[recommendedIntensity] || { label: 'Moderate', color: 'var(--c-teal)', bg: 'rgba(0,212,170,0.12)' };

  const riskColor = { low: 'var(--c-teal)', moderate: 'var(--c-yellow)', high: 'var(--c-red)' }[fatigueRisk] || 'var(--c-teal)';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1100 }}>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: -10 }}>
        <button onClick={() => setIsManualModalOpen(true)} style={{ background: 'var(--c-teal)', color: 'var(--c-bg-primary)', border: 'none', padding: '8px 16px', borderRadius: 99, fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', boxShadow: '0 4px 12px rgba(0,212,170,0.2)' }}>
          <Edit3 size={14} /> Log Data Manually
        </button>
      </div>

      {/* Weather + Outdoor Suitability Strip */}
      {liveSensors?.weather ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
          <WeatherWidget weather={liveSensors.weather} compact />
          {(() => {
            const s = getOutdoorSuitability(liveSensors.weather);
            return s ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', borderRadius: 12, background: `${s.color}15`, border: `1px solid ${s.color}35`, flex: 1 }}>
                <span style={{ fontSize: 20 }}>{['🚫','🏠','⚠️','🚶','🏃','🌟'][s.score]}</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: s.color }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>Based on current conditions in {liveSensors.weather.city || 'your area'}</div>
                </div>
              </div>
            ) : null;
          })()}
        </div>
      ) : null}

      <AnimatePresence>
        {isManualModalOpen && <ManualLogModal isOpen={isManualModalOpen} onClose={() => setIsManualModalOpen(false)} />}
      </AnimatePresence>

      {/* No real data notice */}
      {!loading && !hasRealData && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            padding: '12px 18px', borderRadius: 'var(--r-lg)',
            background: 'rgba(79,141,255,0.08)', border: '1px solid rgba(79,141,255,0.2)',
            display: 'flex', alignItems: 'center', gap: 10, fontSize: 13,
          }}
        >
          <Brain size={15} color="var(--c-blue)" />
          <span style={{ color: 'var(--c-text-secondary)' }}>
            Showing sample data. Log your daily metrics to unlock real AI predictions.
          </span>
        </motion.div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Footprints, label: 'Steps', value: liveSteps.toLocaleString(),
            sub: '/ 10,000', pct: Math.min(Math.round((liveSteps / 10000) * 100), 100),
            color: 'var(--c-teal)', trend: stepsTrend,
          },
          {
            icon: Moon, label: 'Sleep', value: `${sleepHours || avgSleep}h`,
            sub: '/ 8h', pct: Math.min(Math.round(((sleepHours || avgSleep) / 8) * 100), 100), 
            color: 'var(--c-purple)', trend: 'stable',
          },
          {
            icon: Zap, label: 'Burned', value: liveCalories.toString(),
            sub: 'kcal', pct: Math.min(Math.round((liveCalories / 600) * 100), 100), color: 'var(--c-orange)', trend: 'stable',
          },
          {
            icon: Battery, label: 'Recovery', value: `${recoveryScore}%`,
            sub: recovery?.status ?? 'Moderate', pct: recoveryScore,
            color: riskColor, trend: fatigueRisk === 'high' ? 'decreasing' : fatigueRisk === 'low' ? 'increasing' : 'stable',
          },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            className="stat-card"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="stat-icon-wrap" style={{ background: s.color + '18' }}>
                <s.icon size={17} color={s.color} />
              </div>
              <TrendIcon trend={s.trend} />
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
                animate={{ width: `${s.pct}%` }}
                transition={{ duration: 1, delay: 0.4 + i * 0.07 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Steps + Sleep Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--c-text-primary)' }}>Weekly Steps</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <TrendIcon trend={stepsTrend} />
              <span className="badge badge-teal">
                {stepsTrend === 'increasing' ? '↑' : stepsTrend === 'decreasing' ? '↓' : '→'} {stepsTrend}
              </span>
            </div>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={activityChartData}>
                <defs>
                  <linearGradient id="stepsG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#4f8dff" />
                    <stop offset="100%" stopColor="#9b6dff" stopOpacity={0.5} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--c-text-muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--c-text-muted)' }} />
                <Tooltip content={<ChartTooltip />} />
                <Bar dataKey="steps" fill="url(#stepsG)" radius={[6, 6, 0, 0]} name="Steps" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }} className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--c-text-primary)', display: 'flex', alignItems: 'center', gap: 6 }}><Moon size={15} color="var(--c-purple)" /> Sleep Trends</span>
            <span className="badge badge-blue">Avg: {avgSleep}h</span>
          </div>
          <div style={{ height: 200 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sleepChartData}>
                <defs>
                  <linearGradient id="sleepG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#9b6dff" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#9b6dff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--c-text-muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--c-text-muted)' }} domain={[4, 10]} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="hours" stroke="#9b6dff" strokeWidth={2.5} fill="url(#sleepG)" name="Hours" dot={{ r: 4, fill: '#9b6dff', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recovery Forecast + Health Memory */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Predictive Recovery Chart */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="glass-card">
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Zap size={14} color="var(--c-blue)" />
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--c-text-primary)' }}>Weekly Forecast</span>
              <span className="badge badge-blue" style={{ marginLeft: 'auto' }}>AI Predicted</span>
            </div>
            <p style={{ fontSize: 11, color: 'var(--c-text-muted)', marginTop: 4 }}>Recovery vs burnout risk predicted by AI</p>
          </div>
          <div style={{ height: 190 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={FALLBACK_FORECAST}>
                <defs>
                  <linearGradient id="recG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00d4aa" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#00d4aa" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="burnG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ff5b5b" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#ff5b5b" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--c-text-muted)' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: 'var(--c-text-muted)' }} />
                <Tooltip content={<ChartTooltip />} />
                <Area type="monotone" dataKey="recovery" stroke="#00d4aa" strokeWidth={2.5} fill="url(#recG)" name="Recovery" dot={false} />
                <Area type="monotone" dataKey="burnout" stroke="#ff5b5b" strokeWidth={2} fill="url(#burnG)" name="Burnout Risk" dot={false} strokeDasharray="4 4" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* AI Recommendation cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" style={{ marginTop: 14 }}>
            {[
              {
                title: intensityLabel.label,
                desc: `Recovery at ${recoveryScore}% — ${fatigueRisk} fatigue risk.`,
                color: intensityLabel.color,
                bg: intensityLabel.bg,
                border: intensityLabel.color + '33',
                lucideIcon: Zap,
              },
              {
                title: 'Energy Tip',
                desc: prediction?.suggestedRestWindows?.[0]?.reason || 'Power nap 1–3 PM boosts afternoon performance.',
                color: 'var(--c-yellow)',
                bg: 'rgba(251,191,36,0.08)',
                border: 'rgba(251,191,36,0.2)',
                lucideIcon: Battery,
              },
              {
                title: 'Sleep Goal',
                desc: `Log ${(8 - avgSleep).toFixed(1)}h more per night to hit optimal recovery.`,
                color: 'var(--c-purple)',
                bg: 'rgba(155,109,255,0.08)',
                border: 'rgba(155,109,255,0.2)',
                lucideIcon: Moon,
              },
            ].map((r) => {
              const CardIcon = r.lucideIcon;
              return (
                <div key={r.title} style={{ padding: '12px 14px', borderRadius: 'var(--r-md)', background: r.bg, border: `1px solid ${r.border}` }}>
                  <div style={{ marginBottom: 8 }}><CardIcon size={16} color={r.color} /></div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: r.color, marginBottom: 4 }}>{r.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--c-text-secondary)', lineHeight: 1.4 }}>{r.desc}</div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ✅ Health Memory Timeline — fully rendered */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.52 }}
          className="glass-card"
          style={{ overflowY: 'auto', maxHeight: 460 }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Dna size={15} color="var(--c-purple)" />
              <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--c-text-primary)' }}>Health Memory</span>
            </div>
            <span className="badge badge-purple" style={{ fontSize: 10 }}>{HEALTH_MEMORY.length} events</span>
          </div>

          {/* Timeline */}
          <div style={{ position: 'relative' }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute', left: 24, top: 0, bottom: 0, width: 2,
              background: 'linear-gradient(to bottom, var(--c-blue), var(--c-purple), transparent)',
              opacity: 0.3,
            }} />

            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {(memoryData.length > 0 ? memoryData : HEALTH_MEMORY).map((event, i) => {
                // Ensure date formatting handles raw ISO strings if from DB
                const dateLabel = event.date.includes('T') ? new Date(event.date).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : event.date;
                return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.55 + i * 0.08 }}
                  onClick={() => setExpandedMemory(expandedMemory === i ? null : i)}
                  style={{
                    display: 'flex', gap: 14, paddingLeft: 8, paddingBottom: 16,
                    cursor: 'pointer',
                    borderRadius: 'var(--r-md)',
                    transition: 'background 150ms ease',
                    padding: '10px 10px 10px 8px',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  {/* Dot */}
                  <div style={{
                    width: 32, height: 32, borderRadius: 10,
                    background: event.color + '20',
                    border: `1.5px solid ${event.color}50`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0, zIndex: 1,
                    boxShadow: `0 0 12px ${event.color}20`,
                  }}>
                    {event.lucideIcon
                      ? (() => { const I = event.lucideIcon; return <I size={16} color={event.color} />; })()
                      : <MapPin size={16} color={event.color} />}
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--c-text-primary)', lineHeight: 1.3, marginBottom: 3 }}>
                      {event.title}
                    </div>
                    <AnimatePresence>
                      {expandedMemory === i && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          style={{ fontSize: 11, color: 'var(--c-text-secondary)', lineHeight: 1.5, marginBottom: 4, overflow: 'hidden' }}
                        >
                          {event.context}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div style={{ fontSize: 10, color: 'var(--c-text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ color: event.color, fontWeight: 600 }}>{dateLabel}</span>
                      <span>·</span>
                      <span>{event.context}</span>
                    </div>
                  </div>

                  <ChevronRight
                    size={13}
                    color="var(--c-text-muted)"
                    style={{ flexShrink: 0, transform: expandedMemory === i ? 'rotate(90deg)' : 'none', transition: 'transform 200ms ease', marginTop: 4 }}
                  />
                </motion.div>
              )})}
            </div>
          </div>

          {/* Footer hint */}
          <div style={{
            marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--c-border)',
            fontSize: 11, color: 'var(--c-text-muted)', textAlign: 'center', lineHeight: 1.5,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6
          }}>
            <MapPin size={11} color="var(--c-text-muted)" /> Milestones auto-detected from your data
          </div>
        </motion.div>
      </div>

      {/* AI Week Planner */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Zap size={16} color="var(--c-orange)" />
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--c-text-primary)' }}>AI Week Planner</span>
          </div>
          <span className="badge badge-orange">Adaptive Plan</span>
        </div>

        <div className="coach-emotion-scroll" style={{ display: 'flex', gap: 12, paddingBottom: 10 }}>
          {[
            { day: 'Mon', focus: 'Cardio', intensity: 'High', color: 'var(--c-orange)' },
            { day: 'Tue', focus: 'Strength', intensity: 'Medium', color: 'var(--c-blue)' },
            { day: 'Wed', focus: 'Active Recovery', intensity: 'Low', color: 'var(--c-teal)' },
            { day: 'Thu', focus: 'Strength', intensity: 'Medium', color: 'var(--c-blue)' },
            { day: 'Fri', focus: 'HIIT', intensity: 'High', color: 'var(--c-orange)' },
            { day: 'Sat', focus: 'Long Rest', intensity: 'Rest', color: 'var(--c-purple)' },
            { day: 'Sun', focus: 'Yoga/Mobility', intensity: 'Low', color: 'var(--c-teal)' },
          ].map((plan, i) => {
            const isToday = new Date().getDay() === [1,2,3,4,5,6,0][i];
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 + i * 0.05 }}
                style={{
                  minWidth: 100, flex: 1,
                  padding: '14px 10px',
                  background: isToday ? plan.color + '18' : 'rgba(255,255,255,0.03)',
                  borderRadius: 'var(--r-md)',
                  border: `1px solid ${isToday ? plan.color + '50' : plan.color + '30'}`,
                  textAlign: 'center',
                  display: 'flex', flexDirection: 'column', gap: 6,
                  position: 'relative',
                  transition: 'transform 150ms ease',
                  cursor: 'default',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'none'}
              >
                {isToday && (
                  <div style={{
                    position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)',
                    background: plan.color, borderRadius: 'var(--r-full)',
                    fontSize: 9, fontWeight: 700, color: 'white', padding: '2px 8px', whiteSpace: 'nowrap',
                  }}>
                    TODAY
                  </div>
                )}
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--c-text-primary)' }}>{plan.day}</div>
                <div style={{ fontSize: 11, color: 'var(--c-text-secondary)', minHeight: 28, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {plan.focus}
                </div>
                <div style={{ fontSize: 10, fontWeight: 600, color: plan.color, background: plan.color + '15', padding: '2px 0', borderRadius: 4 }}>
                  {plan.intensity}
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
