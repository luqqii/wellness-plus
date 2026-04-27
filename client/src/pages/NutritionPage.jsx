import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip
} from 'recharts';
import { Plus, ChevronLeft, ChevronRight, Check, Sparkles, Apple, Watch, Trash2, X, Settings2 } from 'lucide-react';
import api from '../services/api';
import FoodSearchModal from '../components/nutrition/FoodSearchModal';
import DynamicIcon from '../components/ui/DynamicIcon';
import useMetricsStore from '../store/metricsStore';

const MOCK_AI_SUGGESTIONS = [
  { name: 'Grilled Salmon + Quinoa', cal: 480, protein: 38, tag: 'High Protein', why: 'Closes your protein gap by 38g' },
  { name: 'Mediterranean Veggie Bowl', cal: 420, protein: 18, tag: 'Plant Based', why: 'Matches your fiber targets' },
  { name: 'Protein Smoothie Bowl', cal: 350, protein: 28, tag: 'Post-Workout', why: 'Optimal for your 6 PM session' },
];

export default function NutritionPage() {
  const liveSensors = useMetricsStore(s => s.liveSensors);
  const liveExerciseCal = Math.round(liveSensors.activeCalories || 0);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [log, setLog] = useState(null);
  const [activeMeal, setActiveMeal] = useState(null);
  
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(true);

  const [showGoalModal, setShowGoalModal] = useState(false);
  const [goalForm, setGoalForm] = useState({ target: 2200, mode: 'deficit' });

  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [exerciseForm, setExerciseForm] = useState({ calories: 0, duration: 0 });

  const todayMetrics = useMetricsStore(s => s.todayMetrics);
  const { saveManualMetrics } = useMetricsStore();

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await api.get('/users/profile');
        const pref = res.data?.data?.preferences?.nutrition;
        if (pref) {
          setGoalForm({ target: pref.calorieGoal || 2200, mode: pref.goalMode || 'deficit' });
        }
      } catch (e) {}
    }
    loadUser();
  }, []);

  const handleSaveGoal = async () => {
    try {
      await api.put('/users/profile', {
        preferences: { nutrition: { calorieGoal: goalForm.target, goalMode: goalForm.mode } }
      });
      setShowGoalModal(false);
    } catch (e) {
      console.error(e);
      alert('Failed to save goal: ' + e.message);
    }
  };

  const handleDeleteFood = async (mealKey, itemId) => {
    if(!window.confirm('Remove this item?')) return;
    try {
      await api.delete(`/nutrition/log/${date}/${mealKey}/${itemId}`);
      fetchLog();
    } catch (e) {
      console.error(e);
    }
  };

  const handleWaterClick = async (amount) => {
    // If clicking the current amount, decrement by 1 (toggle off)
    const newAmount = (todayMetrics?.nutrition?.water === amount) ? amount - 1 : amount;
    await saveManualMetrics(api, { water: newAmount });
  };

  const handleSaveExercise = async () => {
    try {
      await saveManualMetrics(api, { 
        activeCalories: exerciseForm.calories, 
        exerciseDuration: exerciseForm.duration 
      });
      setShowExerciseModal(false);
    } catch (e) {
      console.error(e);
    }
  };

  // Derive Data
  const targetCalories = goalForm.target;
  const targetProtein = Math.round(targetCalories * 0.3 / 4);
  const targetCarbs = Math.round(targetCalories * 0.4 / 4);
  const targetFat = Math.round(targetCalories * 0.3 / 9);

  const fetchLog = async () => {
    try {
      // api interceptor returns response.data, so result = { success, data }
      const result = await api.get(`/nutrition/log/${date}`);
      setLog(result.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLog();
  }, [date]);

  useEffect(() => {
    async function loadSuggestions() {
      try {
        // api interceptor returns response.data = { success, data: { suggestion, ... } }
        const result = await api.get('/nutrition/suggestions');
        const suggestion = result?.data?.suggestion;
        if (Array.isArray(suggestion) && suggestion.length > 0) {
          setAiSuggestions(suggestion);
        } else {
          setAiSuggestions(MOCK_AI_SUGGESTIONS);
        }
      } catch (err) {
        setAiSuggestions(MOCK_AI_SUGGESTIONS);
      } finally {
        setLoadingSuggestions(false);
      }
    }
    loadSuggestions();
  }, []);

  // Wellness+ Traffic Light Caloric Density Approximation
  const getFoodColor = (food) => {
    if (!food) return 'var(--c-yellow)';
    const n = (food.name || '').toLowerCase();
    // Green (Eat freely)
    if (n.includes('salad') || n.includes('veggie') || n.includes('apple') || n.includes('fruit') || n.includes('spinach')) return 'var(--c-green)';
    // Orange/Red (Eat sparingly)
    if (n.includes('cake') || n.includes('butter') || n.includes('oil') || n.includes('sugar') || food.calories > 450) return 'var(--c-orange)';
    // Yellow (Eat moderately)
    return 'var(--c-yellow)';
  };

  const getMealItems = (mealKey) => log ? log[mealKey] || [] : [];
  
  const calcTotalCal = (items) => items.reduce((acc, i) => acc + (i.customFood?.calories || 0) * i.servingsConsumed, 0);
  const calcTotalP = (items) => items.reduce((acc, i) => acc + (i.customFood?.protein || 0) * i.servingsConsumed, 0);
  const calcTotalC = (items) => items.reduce((acc, i) => acc + (i.customFood?.carbs || 0) * i.servingsConsumed, 0);
  const calcTotalF = (items) => items.reduce((acc, i) => acc + (i.customFood?.fat || 0) * i.servingsConsumed, 0);
  const calcTotalFiber = (items) => items.reduce((acc, i) => acc + (i.customFood?.fiber || 0) * i.servingsConsumed, 0);
  const calcTotalSugar = (items) => items.reduce((acc, i) => acc + (i.customFood?.sugar || 0) * i.servingsConsumed, 0);
  const calcTotalSodium = (items) => items.reduce((acc, i) => acc + (i.customFood?.sodium || 0) * i.servingsConsumed, 0);

  const sections = [
    { key: 'breakfast', name: 'Breakfast', icon: '☀️', items: getMealItems('breakfast') },
    { key: 'lunch', name: 'Lunch', icon: '🥙', items: getMealItems('lunch') },
    { key: 'snacks', name: 'Snack', icon: '🍎', items: getMealItems('snacks') },
    { key: 'dinner', name: 'Dinner', icon: '🌙', items: getMealItems('dinner') },
  ];

  const totalCal = sections.reduce((acc, s) => acc + calcTotalCal(s.items), 0);
  const totalP = sections.reduce((acc, s) => acc + calcTotalP(s.items), 0);
  const totalC = sections.reduce((acc, s) => acc + calcTotalC(s.items), 0);
  const totalF = sections.reduce((acc, s) => acc + calcTotalF(s.items), 0);
  const totalFiber = sections.reduce((acc, s) => acc + calcTotalFiber(s.items), 0);
  const totalSugar = sections.reduce((acc, s) => acc + calcTotalSugar(s.items), 0);
  const totalSodium = sections.reduce((acc, s) => acc + calcTotalSodium(s.items), 0);

  const remaining = targetCalories - totalCal;

  const MACRO_DATA = [
    { name: 'Carbs',   value: totalC, target: targetCarbs, color: 'var(--c-teal)',   hex: '#00d4aa' },
    { name: 'Protein', value: totalP, target: targetProtein, color: 'var(--c-orange)', hex: '#ff7940' },
    { name: 'Fat',     value: totalF, target: targetFat, color: 'var(--c-purple)', hex: '#9b6dff' },
  ];

  const WEEK_DAYS = ['S','M','T','W','T','F','S'];
  const DONE_DAYS = [true, true, true, true, false, false, false];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1100 }}>
      {/* === Day Header === */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            className="btn btn-icon"
            onClick={() => {
              const d = new Date(date);
              d.setDate(d.getDate() - 1);
              setDate(d.toISOString().split('T')[0]);
            }}
          >
            <ChevronLeft size={14} />
          </button>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--c-text-primary)', minWidth: 80, textAlign: 'center' }}>
            {date === new Date().toISOString().split('T')[0]
              ? 'Today'
              : new Date(date + 'T12:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' })
            }
          </span>
          <button
            className="btn btn-icon"
            disabled={date >= new Date().toISOString().split('T')[0]}
            onClick={() => {
              const d = new Date(date);
              d.setDate(d.getDate() + 1);
              const newDate = d.toISOString().split('T')[0];
              if (newDate <= new Date().toISOString().split('T')[0]) setDate(newDate);
            }}
          >
            <ChevronRight size={14} />
          </button>
        </div>
          {/* Week day circles */}
          <div style={{ display: 'flex', gap: 6 }}>
            {WEEK_DAYS.map((d, i) => (
              <div key={i} className={`day-circle ${DONE_DAYS[i] ? 'done' : i === 4 ? 'today' : 'upcoming'}`}>
                {DONE_DAYS[i] ? <Check size={13} /> : d}
              </div>
            ))}
          </div>
          {/* Integrations */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>Data from:</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--r-full)', border: '1px solid var(--c-border)' }}>
              <Apple size={13} color="var(--c-text-secondary)" />
              <span style={{ fontSize: 11, color: 'var(--c-text-secondary)', fontWeight: 500 }}>Health</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 10px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--r-full)', border: '1px solid var(--c-border)' }}>
              <Watch size={13} color="var(--c-blue)" />
              <span style={{ fontSize: 11, color: 'var(--c-text-secondary)', fontWeight: 500 }}>Fitbit</span>
            </div>
          </div>
        </div>

        {/* Calorie equation */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-text-primary)' }}>Daily Targets</span>
          <button onClick={() => setShowGoalModal(true)} className="btn btn-sm btn-ghost" style={{ fontSize: 12 }}>
            <Settings2 size={13} style={{ marginRight: 4 }} /> Edit Goal
          </button>
        </div>
        <div className="macro-equation" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          gap: 14, padding: '16px 20px',
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 'var(--r-lg)', border: '1px solid var(--c-border)',
          marginBottom: 16
        }}>
          {[
            { val: targetCalories.toLocaleString(), label: 'Goal', color: 'var(--c-text-primary)' },
            { val: '−', label: '', color: 'var(--c-text-muted)', isSym: true },
            { val: totalCal.toLocaleString(), label: 'Food', color: 'var(--c-orange)' },
            { val: '+', label: '', color: 'var(--c-text-muted)', isSym: true },
            { val: liveExerciseCal.toString(), label: 'Exercise', color: 'var(--c-teal)', isClickable: true, onClick: () => { setExerciseForm({ calories: liveExerciseCal, duration: todayMetrics?.activity?.duration || 0 }); setShowExerciseModal(true); } },
            { val: '=', label: '', color: 'var(--c-text-muted)', isSym: true },
            { 
              val: Math.abs(targetCalories - totalCal + liveExerciseCal).toLocaleString(), 
              label: goalForm.mode === 'deficit' ? 'Remaining' : 'To Eat', 
              color: goalForm.mode === 'deficit' 
                ? ((targetCalories - totalCal + liveExerciseCal) < 0 ? 'var(--c-red)' : 'var(--c-blue)')
                : ((targetCalories - totalCal + liveExerciseCal) <= 0 ? 'var(--c-green)' : 'var(--c-blue)') 
            },
          ].map((item, i) => (
            <div key={i} style={{ textAlign: 'center', cursor: item.isClickable ? 'pointer' : 'default' }} onClick={item.onClick}>
              <div className={item.isSym ? 'macro-equation-sym' : 'macro-equation-val'} style={{ fontSize: item.isSym ? 20 : 26, fontWeight: 800, color: item.color, letterSpacing: '-1px', lineHeight: 1 }}>
                {item.val}
                {item.isClickable && <Settings2 size={12} style={{ display: 'inline', marginLeft: 4, opacity: 0.5 }} />}
              </div>
              {item.label && <div style={{ fontSize: 10, color: 'var(--c-text-muted)', marginTop: 3, fontWeight: 500 }}>{item.label}</div>}
            </div>
          ))}
        </div>

        {/* Overall calorie bar */}
        <div style={{ marginBottom: 6 }}>
          <div className="progress-track" style={{ height: 8 }}>
            <motion.div className="progress-fill progress-fill-orange"
              initial={{ width: 0 }}
              animate={{ width: `${Math.min((totalCal / targetCalories) * 100, 100)}%` }}
              transition={{ duration: 1 }}
            />
          </div>
        </div>
      </motion.div>

      {/* === Main 2-col grid === */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* LEFT: Food Diary */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--c-text-primary)' }}>Food Diary</span>
            <span className="badge badge-neutral">{totalCal} / {targetCalories} cal</span>
          </div>

          {sections.map((section) => {
            const sectionCal = calcTotalCal(section.items);
            return (
              <div key={section.name} className="diary-section">
                <div className="diary-meal-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <DynamicIcon icon={section.icon} size={20} color="var(--c-text-primary)" />
                    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-text-primary)' }}>{section.name}</span>
                    {sectionCal > 0 && (
                      <span style={{ fontSize: 12, color: 'var(--c-text-muted)' }}>{sectionCal} cal</span>
                    )}
                  </div>
                  <button onClick={() => setActiveMeal(section.key)} className="btn btn-primary btn-sm">
                    <Plus size={12} /> Log
                  </button>
                </div>

                {section.items.map((item, ii) => {
                  const foodColor = getFoodColor(item.customFood);
                  return (
                    <div key={ii} className="diary-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #EAE6DF' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                        {/* Wellness+ Food Density Dot */}
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: foodColor, marginTop: 4, flexShrink: 0 }} />
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--c-text-primary)' }}>{item.customFood?.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--c-text-muted)', marginTop: 2 }}>
                            {item.servingsConsumed} serving(s) · C: {item.customFood?.carbs}g · P: {item.customFood?.protein}g · F: {item.customFood?.fat}g
                          </div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-text-primary)' }}>{item.customFood?.calories * item.servingsConsumed}</div>
                          <div style={{ fontSize: 10, color: 'var(--c-text-muted)' }}>cal</div>
                        </div>
                        <button onClick={() => handleDeleteFood(section.key, item._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-text-muted)', padding: 4 }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}

                {section.items.length === 0 && (
                  <div style={{ padding: '14px 4px', textAlign: 'center' }}>
                    <p style={{ fontSize: 12, color: 'var(--c-text-muted)', fontStyle: 'italic' }}>No entries yet</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Water */}
          <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--c-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <DynamicIcon icon="💧" size={16} color="var(--c-blue)" />
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-text-primary)' }}>Water</span>
              </div>
              <span style={{ fontSize: 12, color: 'var(--c-text-muted)' }}>{todayMetrics?.nutrition?.water || 0} / 8 glasses</span>
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              {Array.from({ length: 8 }).map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => handleWaterClick(i + 1)}
                  style={{
                    flex: 1, height: 28, borderRadius: 6,
                    background: i < (todayMetrics?.nutrition?.water || 0) ? 'rgba(79,141,255,0.5)' : 'rgba(255,255,255,0.06)',
                    border: `1px solid ${i < (todayMetrics?.nutrition?.water || 0) ? 'rgba(79,141,255,0.4)' : 'var(--c-border)'}`,
                    cursor: 'pointer', transition: 'all 150ms ease',
                  }}
                />
              ))}
            </div>
          </div>
        </motion.div>

        {/* RIGHT: Macro Rings + AI suggestions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Macro Ring Widget */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-text-primary)' }}>Macro Breakdown</span>
            </div>

            {/* Visual donut chart */}
            <div style={{ position: 'relative', height: 160, marginBottom: 16 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={MACRO_DATA}
                    cx="50%" cy="50%"
                    innerRadius={48} outerRadius={68}
                    paddingAngle={3}
                    dataKey="value"
                    startAngle={90} endAngle={-270}
                    stroke="none"
                  >
                    {MACRO_DATA.map((entry, i) => (
                      <Cell key={i} fill={entry.hex} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      background: 'var(--c-bg-card)',
                      border: '1px solid var(--c-border-strong)',
                      borderRadius: 10, fontSize: 12
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Center text */}
              <div style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
              }}>
                <div style={{ fontSize: 20, fontWeight: 900, color: 'var(--c-text-primary)', letterSpacing: '-1px' }}>{totalCal}</div>
                <div style={{ fontSize: 10, color: 'var(--c-text-muted)' }}>kcal</div>
              </div>
            </div>

            {/* Macro rows */}
            {MACRO_DATA.map((m) => (
              <div key={m.name} style={{ marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: m.color }} />
                    <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--c-text-secondary)' }}>{m.name}</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--c-text-primary)' }}>
                    {m.value}g <span style={{ color: 'var(--c-text-muted)', fontWeight: 400 }}>/ {m.target}g</span>
                  </span>
                </div>
                <div className="progress-track">
                  <motion.div
                    className="progress-fill"
                    style={{ background: m.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${(m.value / m.target) * 100}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </div>
            ))}

            {/* Micronutrient row */}
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              {[
                { label: 'Fiber', val: totalFiber, unit: 'g', target: 25 },
                { label: 'Sugar', val: totalSugar, unit: 'g', target: 50 },
                { label: 'Sodium', val: totalSodium, unit: 'mg', target: 2300 }
              ].map(mi => (
                <div key={mi.label} style={{ flex: 1, background: 'rgba(255,255,255,0.03)', padding: '10px 4px', borderRadius: 10, border: '1px solid var(--c-border)', textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--c-text-primary)' }}>{mi.val}{mi.unit}</div>
                  <div style={{ fontSize: 10, color: 'var(--c-text-muted)', marginBottom: 6 }}>{mi.label}</div>
                  <div style={{ height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, margin: '0 4px' }}>
                    <div style={{ height: '100%', background: 'var(--c-text-secondary)', borderRadius: 2, width: `${Math.min((mi.val / mi.target) * 100, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* AI Meal Suggestions */}
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <Sparkles size={14} color="var(--c-purple)" />
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--c-text-primary)' }}>AI Meal Suggestions</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {loadingSuggestions ? (
                <div style={{ fontSize: 12, color: 'var(--c-text-muted)', textAlign: 'center', padding: '10px' }}>Loading AI generated suggestions...</div>
              ) : aiSuggestions.map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}
                  style={{
                    padding: '11px 13px',
                    borderRadius: 'var(--r-md)',
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--c-border)',
                    cursor: 'pointer', transition: 'all 150ms ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(155,109,255,0.3)'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--c-border)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-text-primary)' }}>{s.name || s.mealName}</span>
                    <span className="badge badge-purple" style={{ fontSize: 10 }}>{s.tag || 'Suggestion'}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>{s.cal || s.calories} cal · P: {s.protein}g</div>
                  <div style={{ fontSize: 11, color: 'var(--c-purple)', marginTop: 3 }}>✨ {s.why || s.reasoning}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Modal */}
      <AnimatePresence>
        {activeMeal && (
          <FoodSearchModal 
            isOpen={true} 
            onClose={() => setActiveMeal(null)} 
            mealType={activeMeal} 
            date={date} 
            onFoodAdded={() => fetchLog()} 
          />
        )}
        {showGoalModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} style={{ background: 'var(--c-bg-card)', borderRadius: 20, padding: 24, width: '100%', maxWidth: 400, border: '1px solid var(--c-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--c-text-primary)' }}>Nutrition Goals</div>
                <button onClick={() => setShowGoalModal(false)} className="btn btn-icon"><X size={18} /></button>
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--c-text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Daily Calorie Target</label>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 12, padding: '12px 16px', width: '100%' }}>
                  <input type="number" value={goalForm.target} onChange={e => setGoalForm(p => ({ ...p, target: Number(e.target.value) }))} style={{ flex: 1, minWidth: 0, width: '100%', background: 'transparent', border: 'none', color: 'var(--c-text-primary)', fontSize: 24, fontWeight: 800, outline: 'none', padding: 0 }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--c-text-muted)', marginLeft: 8 }}>kcal</span>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--c-text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Goal Mode</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  <button onClick={() => setGoalForm(p => ({ ...p, mode: 'deficit' }))} style={{ padding: '12px', borderRadius: 12, border: `1px solid ${goalForm.mode === 'deficit' ? 'var(--c-blue)' : 'var(--c-border)'}`, background: goalForm.mode === 'deficit' ? 'rgba(79,141,255,0.1)' : 'transparent', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: goalForm.mode === 'deficit' ? 'var(--c-blue)' : 'var(--c-text-primary)' }}>Deficit</div>
                    <div style={{ fontSize: 11, color: 'var(--c-text-muted)', marginTop: 4 }}>Weight Loss</div>
                  </button>
                  <button onClick={() => setGoalForm(p => ({ ...p, mode: 'surplus' }))} style={{ padding: '12px', borderRadius: 12, border: `1px solid ${goalForm.mode === 'surplus' ? 'var(--c-green)' : 'var(--c-border)'}`, background: goalForm.mode === 'surplus' ? 'rgba(34,197,94,0.1)' : 'transparent', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: goalForm.mode === 'surplus' ? 'var(--c-green)' : 'var(--c-text-primary)' }}>Surplus</div>
                    <div style={{ fontSize: 11, color: 'var(--c-text-muted)', marginTop: 4 }}>Bulking / Maint.</div>
                  </button>
                </div>
              </div>

              <button onClick={handleSaveGoal} className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: 15 }}>Save Goals</button>
            </motion.div>
          </div>
        )}
        {showExerciseModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} style={{ background: 'var(--c-bg-card)', borderRadius: 20, padding: 24, width: '100%', maxWidth: 400, border: '1px solid var(--c-border)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--c-text-primary)' }}>Log Exercise</div>
                <button onClick={() => setShowExerciseModal(false)} className="btn btn-icon"><X size={18} /></button>
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--c-text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Active Calories Burned</label>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 12, padding: '12px 16px', width: '100%' }}>
                  <input type="number" value={exerciseForm.calories} onChange={e => setExerciseForm(p => ({ ...p, calories: Number(e.target.value) }))} style={{ flex: 1, minWidth: 0, width: '100%', background: 'transparent', border: 'none', color: 'var(--c-text-primary)', fontSize: 24, fontWeight: 800, outline: 'none', padding: 0 }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--c-text-muted)', marginLeft: 8 }}>kcal</span>
                </div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--c-text-muted)', marginBottom: 8, textTransform: 'uppercase' }}>Duration</label>
                <div style={{ display: 'flex', alignItems: 'center', background: 'var(--c-bg)', border: '1px solid var(--c-border)', borderRadius: 12, padding: '12px 16px', width: '100%' }}>
                  <input type="number" value={exerciseForm.duration} onChange={e => setExerciseForm(p => ({ ...p, duration: Number(e.target.value) }))} style={{ flex: 1, minWidth: 0, width: '100%', background: 'transparent', border: 'none', color: 'var(--c-text-primary)', fontSize: 24, fontWeight: 800, outline: 'none', padding: 0 }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--c-text-muted)', marginLeft: 8 }}>min</span>
                </div>
              </div>

              <button onClick={handleSaveExercise} className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: 15 }}>Save Exercise</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
