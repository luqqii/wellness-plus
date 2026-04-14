import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import PublicNavbar from '../components/layout/PublicNavbar';

const FOOD_DB = [
  // GREEN FOODS
  { name: 'Spinach', cal: 7, color: 'green', category: 'Vegetables', emoji: '🥬', why: 'Extremely low calorie density. Eat as much as you want.' },
  { name: 'Cucumber', cal: 16, color: 'green', category: 'Vegetables', emoji: '🥒', why: 'Mostly water. Great for staying full.' },
  { name: 'Tomato', cal: 18, color: 'green', category: 'Vegetables', emoji: '🍅', why: 'High water content, rich in lycopene.' },
  { name: 'Apple', cal: 52, color: 'green', category: 'Fruits', emoji: '🍎', why: 'High fiber keeps you full longer.' },
  { name: 'Strawberries', cal: 32, color: 'green', category: 'Fruits', emoji: '🍓', why: 'Low calorie, high antioxidants.' },
  { name: 'Oatmeal', cal: 68, color: 'green', category: 'Grains', emoji: '🥣', why: 'Complex carbs with high fiber — keeps you full for hours.' },
  { name: 'Non-fat Yogurt', cal: 56, color: 'green', category: 'Dairy', emoji: '🍶', why: 'High protein, relatively low calorie.' },
  { name: 'Lentils', cal: 116, color: 'green', category: 'Legumes', emoji: '🫘', why: 'Protein + fiber powerhouse. Very filling per calorie.' },
  { name: 'Blueberries', cal: 57, color: 'green', category: 'Fruits', emoji: '🫐', why: 'Low sugar, high antioxidants.' },
  { name: 'Broccoli', cal: 34, color: 'green', category: 'Vegetables', emoji: '🥦', why: 'High fiber and vitamins per calorie.' },

  // YELLOW FOODS
  { name: 'Chicken Breast', cal: 165, color: 'yellow', category: 'Protein', emoji: '🍗', why: 'Lean protein. Moderate calories, high satiety.' },
  { name: 'Salmon', cal: 208, color: 'yellow', category: 'Protein', emoji: '🐟', why: 'Healthy omega-3 fats. Eat in moderation.' },
  { name: 'Eggs', cal: 155, color: 'yellow', category: 'Protein', emoji: '🥚', why: 'Complete protein. Filling but calorie-dense.' },
  { name: 'Quinoa', cal: 120, color: 'yellow', category: 'Grains', emoji: '🌾', why: 'Complete protein grain. Great in controlled portions.' },
  { name: 'Brown Rice', cal: 130, color: 'yellow', category: 'Grains', emoji: '🍚', why: 'Whole grain. Better than white rice but still calorie-dense.' },
  { name: 'Avocado', cal: 160, color: 'yellow', category: 'Fruits', emoji: '🥑', why: 'Healthy fats but high in calories. Half an avocado = ideal.' },
  { name: 'Banana', cal: 89, color: 'yellow', category: 'Fruits', emoji: '🍌', why: 'Higher sugar than most fruits. Fine in small amounts.' },
  { name: 'Whole Wheat Bread', cal: 247, color: 'yellow', category: 'Grains', emoji: '🍞', why: 'Better than white but still calorie-dense. 1-2 slices.' },
  { name: 'Hummus', cal: 177, color: 'yellow', category: 'Legumes', emoji: '🧆', why: 'Healthy but calorie-dense. 2 tbsp is a serving.' },
  { name: 'Milk (whole)', cal: 149, color: 'yellow', category: 'Dairy', emoji: '🥛', why: 'Full-fat dairy — contains beneficial fats but more calories.' },

  // ORANGE FOODS
  { name: 'Olive Oil', cal: 884, color: 'orange', category: 'Oils', emoji: '🫙', why: 'Healthy fat but extremely calorie-dense. Use sparingly.' },
  { name: 'Almonds', cal: 579, color: 'orange', category: 'Nuts', emoji: '🥜', why: 'Nutritious but very calorie-dense. Limit to a small handful.' },
  { name: 'Chocolate Cake', cal: 371, color: 'orange', category: 'Sweets', emoji: '🍰', why: 'High in sugar and fat. Enjoy occasionally and mindfully.' },
  { name: 'French Fries', cal: 312, color: 'orange', category: 'Fast Food', emoji: '🍟', why: 'Deep-fried. High fat, high calorie, low nutrition.' },
  { name: 'Butter', cal: 717, color: 'orange', category: 'Oils', emoji: '🧈', why: 'Pure saturated fat. Use very sparingly as a flavoring.' },
  { name: 'Cheddar Cheese', cal: 403, color: 'orange', category: 'Dairy', emoji: '🧀', why: 'High fat dairy. A small portion adds a lot of calories.' },
  { name: 'Bacon', cal: 541, color: 'orange', category: 'Protein', emoji: '🥓', why: 'High in saturated fat and sodium. Enjoy rarely.' },
  { name: 'Soda (regular)', cal: 150, color: 'orange', category: 'Drinks', emoji: '🥤', why: 'Empty liquid calories. Zero nutritional value.' },
  { name: 'Chips (potato)', cal: 536, color: 'orange', category: 'Snacks', emoji: '🍿', why: 'Trigger food for many people. Easy to overconsume.' },
  { name: 'Ice Cream', cal: 207, color: 'orange', category: 'Sweets', emoji: '🍦', why: 'High sugar and fat. Enjoy mindfully in small portions.' },
];

const COLOR_META = {
  green:  { bg: '#DCFCE7', border: '#86EFAC', dot: '#22C55E', label: 'Green — Eat Freely',   tip: 'These foods are low in caloric density. Fill half your plate with them!' },
  yellow: { bg: '#FEF9C3', border: '#FDE047', dot: '#EAB308', label: 'Yellow — Eat Moderately', tip: 'Good nutrition but more calories. Be mindful of portion sizes.' },
  orange: { bg: '#FFE4E6', border: '#FCA5A5', dot: '#EC5A42', label: 'Orange — Eat Sparingly', tip: 'High caloric density. Enjoy occasionally and in small amounts.' },
};


export default function FoodColorGuidePage() {
  const [query, setQuery] = useState('');
  const [filterColor, setFilterColor] = useState('all');

  const filtered = FOOD_DB.filter(f => {
    const matchesQ = f.name.toLowerCase().includes(query.toLowerCase()) || f.category.toLowerCase().includes(query.toLowerCase());
    const matchesC = filterColor === 'all' || f.color === filterColor;
    return matchesQ && matchesC;
  });

  return (
    <div style={{ background: '#FFF3EB', minHeight: '100vh', color: '#0C2B35', fontFamily: '"Nunito", "Inter", sans-serif' }}>
       <PublicNavbar />
       <div style={{ maxWidth: 1000, margin: '0 auto', padding: '120px 20px 80px', display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: '#0C2B35', borderRadius: 24, padding: 32, color: '#FFFFFF' }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Food Color Guide</h1>
        <p style={{ color: '#9CA3AF', fontSize: 15, lineHeight: 1.6 }}>
          Every food fits into our traffic-light density system. No food is forbidden. Use this guide to make smarter choices.
        </p>
        {/* 3 Pill Legend */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 }}>
          {Object.entries(COLOR_META).map(([key, m]) => (
            <div key={key} style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 999, padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: m.dot }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#E5E7EB' }}>{m.label}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Color Info Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
        {Object.entries(COLOR_META).map(([key, m]) => (
          <div key={key} style={{ background: m.bg, border: `2px solid ${m.border}`, borderRadius: 20, padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 20, height: 20, borderRadius: '50%', background: m.dot }} />
              <span style={{ fontWeight: 800, fontSize: 16, color: '#0C2B35' }}>{m.label.split(' — ')[1]}</span>
            </div>
            <p style={{ fontSize: 14, color: '#374151', lineHeight: 1.5 }}>{m.tip}</p>
          </div>
        ))}
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ flex: 1, minWidth: 220, position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search any food..."
            style={{ width: '100%', padding: '12px 16px 12px 42px', borderRadius: 999, border: '2px solid #E8DED8', fontSize: 15, outline: 'none', background: '#FFFFFF' }}
          />
        </div>
        {['all', 'green', 'yellow', 'orange'].map(c => (
          <button key={c} onClick={() => setFilterColor(c)} style={{
            padding: '10px 20px', borderRadius: 999,
            background: filterColor === c ? (c === 'all' ? '#0C2B35' : COLOR_META[c]?.dot || '#0C2B35') : '#FFFFFF',
            color: filterColor === c ? '#FFFFFF' : '#0C2B35',
            border: '2px solid #E8DED8', fontWeight: 700, fontSize: 14, cursor: 'pointer', textTransform: 'capitalize'
          }}>{c === 'all' ? 'All Foods' : c}</button>
        ))}
      </div>

      {/* Food Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 14 }}>
        {filtered.map((food, i) => {
          const m = COLOR_META[food.color];
          return (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02 }}
              style={{ background: '#FFFFFF', borderRadius: 16, padding: 18, border: `2px solid ${m.border}`, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
              <div style={{ fontSize: 32, flexShrink: 0 }}>{food.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#0C2B35' }}>{food.name}</span>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: m.dot, flexShrink: 0 }} />
                </div>
                <div style={{ fontSize: 12, color: '#718096', fontWeight: 600, marginBottom: 6 }}>{food.category} · {food.cal} kcal/100g</div>
                <p style={{ fontSize: 12, color: '#4A5568', lineHeight: 1.5 }}>{food.why}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      </div>
    </div>
  );
}
