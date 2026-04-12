import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Coffee, Sun, Moon, Apple } from 'lucide-react';
import api from '../services/api';
import FoodSearchModal from '../components/nutrition/FoodSearchModal';
import useAuthStore from '../store/authStore';

const MEALS = [
  { id: 'breakfast', label: 'Breakfast', icon: Coffee },
  { id: 'lunch', label: 'Lunch', icon: Sun },
  { id: 'dinner', label: 'Dinner', icon: Moon },
  { id: 'snacks', label: 'Snacks', icon: Apple },
];

export default function NutritionDiary() {
  const { user } = useAuthStore();
  const [log, setLog] = useState(null);
  const [activeMeal, setActiveMeal] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchLog = async () => {
    try {
      const { data } = await api.get(`/nutrition/log/${date}`);
      setLog(data.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchLog();
  }, [date]);

  // Assuming MFP-style 2000 goal calculation or BMR
  const goal = 2200; 
  const foodTotal = log?.totals?.calories || 0;
  const remaining = goal - foodTotal;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', paddingBottom: 100 }}>
      {/* Header MFP Style Equation */}
      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 20 }}>Diary</h1>

      <div className="glass-card" style={{ padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: 13, textTransform: 'uppercase', color: 'var(--c-text-secondary)', fontWeight: 700, marginBottom: 12 }}>Calories Remaining</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{goal}</div>
            <div style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>Goal</div>
          </div>
          <div style={{ fontSize: 20, color: 'var(--c-text-muted)' }}>-</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{foodTotal}</div>
            <div style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>Food</div>
          </div>
          <div style={{ fontSize: 20, color: 'var(--c-text-muted)' }}>=</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: remaining >= 0 ? 'var(--c-green)' : 'var(--c-red)' }}>{remaining}</div>
            <div style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>Remaining</div>
          </div>

        </div>
      </div>

      {/* Diary Tables */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {MEALS.map((meal) => {
          const items = log ? log[meal.id] : [];
          const mealCals = items.reduce((acc, i) => acc + (i.customFood?.calories || 0) * i.servingsConsumed, 0);

          return (
            <div key={meal.id} className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Table Header */}
              <div style={{ background: 'var(--bg-elevated)', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--c-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <meal.icon size={18} color="var(--c-blue)" />
                  <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--c-blue)' }}>{meal.label}</span>
                </div>
                <div style={{ fontWeight: 700 }}>{mealCals}</div>
              </div>

              {/* Items */}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {items.length === 0 ? (
                  <div style={{ padding: '16px 20px', color: 'var(--c-text-muted)', fontSize: 14 }}>No items logged.</div>
                ) : (
                  items.map((entry, idx) => (
                    <div key={idx} style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: idx !== items.length - 1 ? '1px solid var(--c-border)' : 'none' }}>
                      <div>
                        <div style={{ fontSize: 15, fontWeight: 500 }}>{entry.customFood?.name}</div>
                        <div style={{ fontSize: 12, color: 'var(--c-text-secondary)', marginTop: 2 }}>
                          {entry.servingsConsumed} serving • {entry.customFood?.carbs}g C, {entry.customFood?.protein}g P, {entry.customFood?.fat}g F
                        </div>
                      </div>
                      <div style={{ fontWeight: 600 }}>{entry.customFood?.calories * entry.servingsConsumed}</div>
                    </div>
                  ))
                )}
              </div>

              {/* Add Food Button */}
              <button 
                onClick={() => setActiveMeal(meal.id)}
                style={{ width: '100%', padding: '14px 20px', background: 'transparent', borderTop: '1px solid var(--c-border)', color: 'var(--c-blue)', fontSize: 15, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', outline: 'none', border: 'none', textAlign: 'left' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Plus size={16} /> Add Food
              </button>
            </div>
          );
        })}
      </div>

      <FoodSearchModal 
        isOpen={!!activeMeal} 
        onClose={() => setActiveMeal(null)} 
        mealType={activeMeal} 
        date={date} 
        onFoodAdded={() => fetchLog()} 
      />
    </div>
  );
}
