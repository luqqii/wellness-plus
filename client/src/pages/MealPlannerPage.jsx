import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Sparkles, ShoppingCart, ChevronDown, ChevronUp,
  RefreshCw, CheckCircle2, Plus, Loader2, Package, Leaf,
  Clock, Flame
} from 'lucide-react';
import api from '../services/api';

const MEAL_ICONS = { breakfast: '☀️', lunch: '🥙', snack: '🍎', dinner: '🌙' };
const MEAL_COLORS = {
  breakfast: { bg: 'rgba(255,193,7,0.08)', border: 'rgba(255,193,7,0.2)', accent: '#ffc107' },
  lunch:     { bg: 'rgba(0,212,170,0.08)', border: 'rgba(0,212,170,0.2)', accent: '#00d4aa' },
  snack:     { bg: 'rgba(255,121,64,0.08)', border: 'rgba(255,121,64,0.2)', accent: '#ff7940' },
  dinner:    { bg: 'rgba(155,109,255,0.08)', border: 'rgba(155,109,255,0.2)', accent: '#9b6dff' },
};
const GROCERY_ICONS = { Proteins: '🥩', Vegetables: '🥦', Fruits: '🍓', 'Grains & Carbs': '🌾', 'Dairy & Eggs': '🥛', 'Pantry & Spices': '🫙' };

export default function MealPlannerPage() {
  const [plan, setPlan] = useState(null);
  const [groceryList, setGroceryList] = useState(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [loadingGrocery, setLoadingGrocery] = useState(false);
  const [selectedDay, setSelectedDay] = useState(0);
  const [expandedMeal, setExpandedMeal] = useState(null);
  const [checkedItems, setCheckedItems] = useState({});
  const [addedMeals, setAddedMeals] = useState({});

  const generatePlan = async () => {
    setLoadingPlan(true);
    setPlan(null);
    setGroceryList(null);
    setCheckedItems({});
    setAddedMeals({});
    try {
      const res = await api.get('/nutrition/meal-plan');
      setPlan(res.data);
    } catch (e) {
      console.error('Meal plan error:', e);
    } finally {
      setLoadingPlan(false);
    }
  };

  const generateGrocery = async () => {
    setLoadingGrocery(true);
    try {
      const res = await api.post('/nutrition/grocery-list', { mealPlan: plan });
      setGroceryList(res.data);
    } catch (e) {
      console.error('Grocery list error:', e);
    } finally {
      setLoadingGrocery(false);
    }
  };

  const addMealToDiary = async (meal, mealType, dayLabel) => {
    const today = new Date().toISOString().split('T')[0];
    const key = `${dayLabel}-${mealType}`;
    try {
      await api.post(`/nutrition/log/${today}`, {
        mealType: mealType === 'snack' ? 'snacks' : mealType,
        customFood: {
          name: meal.name,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
        },
        servingsConsumed: 1,
      });
      setAddedMeals(prev => ({ ...prev, [key]: true }));
    } catch (e) {
      console.error('Add meal error:', e);
    }
  };

  const toggleGroceryItem = (catIdx, itemIdx) => {
    const key = `${catIdx}-${itemIdx}`;
    setCheckedItems(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const currentDay = plan?.days?.[selectedDay];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 1100 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: 14, background: 'linear-gradient(135deg, #4f8dff, #9b6dff)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Calendar size={20} color="white" />
            </div>
            <div>
              <h1 style={{ fontSize: 20, fontWeight: 800, color: 'var(--c-text-primary)', margin: 0 }}>Weekly Meal Planner</h1>
              <p style={{ fontSize: 12, color: 'var(--c-text-muted)', margin: '2px 0 0' }}>AI-generated 7-day nutrition plan tailored to your goals</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {plan && (
              <button
                onClick={generateGrocery}
                disabled={loadingGrocery}
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, background: 'rgba(0,212,170,0.1)', border: '1px solid rgba(0,212,170,0.25)', color: 'var(--c-teal)', fontSize: 13, fontWeight: 600, cursor: loadingGrocery ? 'not-allowed' : 'pointer' }}
              >
                {loadingGrocery ? <Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> : <ShoppingCart size={14} />}
                {loadingGrocery ? 'Generating…' : 'Grocery List'}
              </button>
            )}
            <button
              onClick={generatePlan}
              disabled={loadingPlan}
              style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 18px', borderRadius: 10, background: 'linear-gradient(135deg, #4f8dff, #9b6dff)', border: 'none', color: 'white', fontSize: 13, fontWeight: 700, cursor: loadingPlan ? 'not-allowed' : 'pointer', opacity: loadingPlan ? 0.7 : 1 }}
            >
              {loadingPlan ? <><Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Generating…</> : <><Sparkles size={14} /> {plan ? 'Regenerate' : 'Generate AI Plan'}</>}
            </button>
          </div>
        </div>

        {/* Stats row */}
        {plan && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ display: 'flex', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
            {[
              { icon: Flame, label: 'Target Daily', val: `${plan.targetCalories} cal`, color: 'var(--c-orange)' },
              { icon: Calendar, label: 'Days Planned', val: `${plan.days?.length || 7} days`, color: 'var(--c-blue)' },
              { icon: Leaf, label: 'Meals Total', val: `${(plan.days?.length || 7) * 4} meals`, color: 'var(--c-teal)' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--c-border)', borderRadius: 10 }}>
                <s.icon size={14} color={s.color} />
                <span style={{ fontSize: 12, color: 'var(--c-text-muted)' }}>{s.label}:</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: s.color }}>{s.val}</span>
              </div>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Loading state */}
      {loadingPlan && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: 20, background: 'linear-gradient(135deg, rgba(79,141,255,0.2), rgba(155,109,255,0.2))', border: '1px solid rgba(79,141,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Sparkles size={28} color="var(--c-blue)" />
          </div>
          <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--c-text-primary)', marginBottom: 8 }}>Generating Your Personalized Plan…</p>
          <p style={{ fontSize: 13, color: 'var(--c-text-muted)' }}>Our AI is crafting 7 days of meals tailored to your goals</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
            {[0,1,2].map(i => (
              <motion.div key={i} animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.2, delay: i * 0.3, repeat: Infinity }} style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--c-blue)' }} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Empty state */}
      {!loadingPlan && !plan && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: 60, textAlign: 'center' }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>📅</div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--c-text-primary)', marginBottom: 8 }}>No Meal Plan Yet</h2>
          <p style={{ fontSize: 14, color: 'var(--c-text-muted)', marginBottom: 24, maxWidth: 360, margin: '0 auto 24px' }}>
            Click "Generate AI Plan" and our AI will create a complete 7-day meal plan based on your goals and calorie targets.
          </p>
          <button onClick={generatePlan} style={{ padding: '12px 28px', borderRadius: 12, background: 'linear-gradient(135deg, #4f8dff, #9b6dff)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={16} /> Generate My Plan
          </button>
        </motion.div>
      )}

      {/* Main Plan View */}
      {plan && !loadingPlan && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          {/* Day Tabs */}
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ padding: '14px 16px' }}>
            <div style={{ display: 'flex', gap: 6, overflowX: 'auto', paddingBottom: 4 }}>
              {plan.days.map((d, i) => (
                <button
                  key={i}
                  onClick={() => { setSelectedDay(i); setExpandedMeal(null); }}
                  style={{
                    flexShrink: 0, padding: '8px 16px', borderRadius: 10,
                    background: selectedDay === i ? 'linear-gradient(135deg, #4f8dff, #9b6dff)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${selectedDay === i ? 'transparent' : 'var(--c-border)'}`,
                    color: selectedDay === i ? 'white' : 'var(--c-text-secondary)',
                    fontSize: 13, fontWeight: selectedDay === i ? 700 : 500,
                    cursor: 'pointer', transition: 'all 150ms',
                  }}
                >
                  {d.day.slice(0, 3)}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Meals for selected day */}
          <AnimatePresence mode="wait">
            {currentDay && (
              <motion.div key={selectedDay} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 14 }}
              >
                {['breakfast', 'lunch', 'snack', 'dinner'].map(mealType => {
                  const meal = currentDay[mealType];
                  if (!meal) return null;
                  const c = MEAL_COLORS[mealType];
                  const isExpanded = expandedMeal === mealType;
                  const addKey = `${currentDay.day}-${mealType}`;
                  const isAdded = addedMeals[addKey];

                  return (
                    <motion.div key={mealType} layout className="glass-card"
                      style={{ padding: 16, background: c.bg, border: `1px solid ${c.border}`, borderRadius: 16 }}
                    >
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <span style={{ fontSize: 16 }}>{MEAL_ICONS[mealType]}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: c.accent, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{mealType}</span>
                          </div>
                          <p style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-text-primary)', margin: 0, lineHeight: 1.3 }}>{meal.name}</p>
                        </div>
                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color: c.accent }}>{meal.calories}</div>
                          <div style={{ fontSize: 10, color: 'var(--c-text-muted)' }}>kcal</div>
                        </div>
                      </div>

                      {/* Macros mini pills */}
                      <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                        {[
                          { label: 'P', val: meal.protein, color: '#ff7940' },
                          { label: 'C', val: meal.carbs, color: '#00d4aa' },
                          { label: 'F', val: meal.fat, color: '#9b6dff' },
                        ].map(m => (
                          <span key={m.label} style={{ padding: '2px 8px', borderRadius: 20, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--c-border)', fontSize: 11, color: m.color, fontWeight: 600 }}>
                            {m.label}: {m.val}g
                          </span>
                        ))}
                      </div>

                      {/* Expandable ingredients */}
                      {meal.ingredients?.length > 0 && (
                        <>
                          <button onClick={() => setExpandedMeal(isExpanded ? null : mealType)}
                            style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'var(--c-text-muted)', fontSize: 12, cursor: 'pointer', padding: 0, marginBottom: isExpanded ? 8 : 0 }}
                          >
                            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                            {isExpanded ? 'Hide' : 'Show'} ingredients
                          </button>
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                                style={{ overflow: 'hidden', marginBottom: 10 }}
                              >
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                                  {meal.ingredients.map((ing, i) => (
                                    <span key={i} style={{ padding: '3px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.06)', fontSize: 11, color: 'var(--c-text-secondary)' }}>{ing}</span>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </>
                      )}

                      <button
                        onClick={() => addMealToDiary(meal, mealType, currentDay.day)}
                        disabled={isAdded}
                        style={{ width: '100%', padding: '8px', borderRadius: 9, background: isAdded ? 'rgba(45,212,164,0.15)' : c.bg, border: `1px solid ${isAdded ? 'rgba(45,212,164,0.4)' : c.border}`, color: isAdded ? 'var(--c-teal)' : c.accent, fontSize: 12, fontWeight: 700, cursor: isAdded ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}
                      >
                        {isAdded ? <><CheckCircle2 size={13} /> Added to Diary</> : <><Plus size={13} /> Add to Today's Diary</>}
                      </button>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Grocery List */}
      <AnimatePresence>
        {groceryList && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <div style={{ width: 36, height: 36, borderRadius: 11, background: 'rgba(0,212,170,0.12)', border: '1px solid rgba(0,212,170,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShoppingCart size={17} color="var(--c-teal)" />
              </div>
              <div>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--c-text-primary)', margin: 0 }}>Grocery List</h2>
                <p style={{ fontSize: 11, color: 'var(--c-text-muted)', margin: '2px 0 0' }}>
                  Tap items to check off · {Object.values(checkedItems).filter(Boolean).length} / {groceryList.reduce((acc, c) => acc + c.items.length, 0)} done
                </p>
              </div>
            </div>

            <div className="responsive-grid-3">
              {groceryList.map((category, catIdx) => (
                <div key={catIdx} style={{ padding: 14, background: 'rgba(255,255,255,0.03)', borderRadius: 14, border: '1px solid var(--c-border)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
                    <span style={{ fontSize: 18 }}>{GROCERY_ICONS[category.category] || '🛒'}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--c-text-primary)' }}>{category.category}</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                    {category.items.map((item, itemIdx) => {
                      const key = `${catIdx}-${itemIdx}`;
                      const isDone = checkedItems[key];
                      return (
                        <button key={itemIdx} onClick={() => toggleGroceryItem(catIdx, itemIdx)}
                          style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'none', border: 'none', cursor: 'pointer', padding: '4px 0', textAlign: 'left', width: '100%' }}
                        >
                          <div style={{ width: 16, height: 16, borderRadius: 5, border: `2px solid ${isDone ? 'var(--c-teal)' : 'var(--c-border-strong)'}`, background: isDone ? 'rgba(0,212,170,0.2)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 150ms' }}>
                            {isDone && <CheckCircle2 size={10} color="var(--c-teal)" />}
                          </div>
                          <span style={{ fontSize: 13, color: isDone ? 'var(--c-text-muted)' : 'var(--c-text-secondary)', textDecoration: isDone ? 'line-through' : 'none', flex: 1 }}>{item.name}</span>
                          <span style={{ fontSize: 11, color: 'var(--c-text-muted)', flexShrink: 0 }}>{item.quantity}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
