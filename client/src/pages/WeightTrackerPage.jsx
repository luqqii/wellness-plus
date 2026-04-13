import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Plus, TrendingDown, TrendingUp, Minus } from 'lucide-react';

export default function WeightTrackerPage() {
  const [entries, setEntries] = useState([
    { date: '2025-03-01', weight: 88.0 },
    { date: '2025-03-08', weight: 87.2 },
    { date: '2025-03-15', weight: 86.5 },
    { date: '2025-03-22', weight: 85.9 },
    { date: '2025-03-29', weight: 85.1 },
    { date: '2025-04-05', weight: 84.4 },
    { date: '2025-04-12', weight: 83.8 },
  ]);
  const [newWeight, setNewWeight] = useState('');
  const [targetWeight, setTargetWeight] = useState(75);
  const [showAdd, setShowAdd] = useState(false);

  const addEntry = () => {
    if (!newWeight) return;
    const today = new Date().toISOString().split('T')[0];
    setEntries(p => [...p, { date: today, weight: Number(newWeight) }]);
    setNewWeight('');
    setShowAdd(false);
  };

  const latest = entries[entries.length - 1]?.weight || 0;
  const first = entries[0]?.weight || latest;
  const totalLost = (first - latest).toFixed(1);
  const toGo = (latest - targetWeight).toFixed(1);

  const chartData = entries.map(e => ({
    date: new Date(e.date + 'T12:00:00').toLocaleDateString('en', { month: 'short', day: 'numeric' }),
    weight: e.weight,
    target: targetWeight
  }));

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{ background: '#FFFFFF', border: '2px solid #E8DED8', borderRadius: 12, padding: '10px 16px' }}>
        <div style={{ fontSize: 12, color: '#718096', marginBottom: 4 }}>{label}</div>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#0C2B35' }}>{payload[0]?.value} kg</div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800 }}>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
        {[
          { label: 'Current', value: `${latest} kg`, icon: Minus, color: '#0C2B35' },
          { label: 'Lost so far', value: `${totalLost} kg`, icon: TrendingDown, color: '#14B8A6' },
          { label: 'Still to go', value: `${toGo} kg`, icon: TrendingUp, color: '#EC5A42' },
        ].map((stat, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid #E8DED8', textAlign: 'center' }}>
            <stat.icon size={24} color={stat.color} style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 28, fontWeight: 900, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: 13, color: '#718096', fontWeight: 600, marginTop: 4 }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Chart */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        style={{ background: '#FFFFFF', borderRadius: 24, padding: 28, border: '1px solid #E8DED8' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0C2B35', margin: 0 }}>Weight Over Time</h2>
          <button onClick={() => setShowAdd(!showAdd)}
            style={{ display: 'flex', alignItems: 'center', gap: 6, background: '#EC5A42', color: 'white', border: 'none', borderRadius: 999, padding: '10px 20px', fontWeight: 800, cursor: 'pointer', fontSize: 14 }}>
            <Plus size={16} /> Log Weight
          </button>
        </div>

        {showAdd && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            style={{ marginBottom: 20, display: 'flex', gap: 12, alignItems: 'center' }}>
            <input
              type="number" step="0.1" placeholder="Today's weight (kg)"
              value={newWeight} onChange={e => setNewWeight(e.target.value)}
              style={{ flex: 1, padding: '14px 18px', borderRadius: 12, border: '2px solid #E8DED8', fontSize: 16, outline: 'none' }}
            />
            <button onClick={addEntry}
              style={{ background: '#0C2B35', color: 'white', border: 'none', borderRadius: 12, padding: '14px 24px', fontWeight: 800, cursor: 'pointer', fontSize: 15 }}>
              Save
            </button>
          </motion.div>
        )}

        <div style={{ height: 260 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#F7EBE3" />
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} />
              <YAxis domain={['auto', 'auto']} axisLine={false} tickLine={false} tick={{ fill: '#9CA3AF', fontSize: 12 }} width={40} />
              <Tooltip content={<CustomTooltip />} />
              <ReferenceLine y={targetWeight} stroke="#14B8A6" strokeDasharray="6 3" label={{ value: 'Goal', fill: '#14B8A6', fontSize: 12 }} />
              <Line type="monotone" dataKey="weight" stroke="#EC5A42" strokeWidth={3}
                dot={{ r: 5, fill: '#FFFFFF', stroke: '#EC5A42', strokeWidth: 3 }}
                activeDot={{ r: 7, fill: '#EC5A42' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Target setter */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        style={{ background: '#FDFBF8', borderRadius: 20, padding: 24, border: '2px solid #E8DED8' }}>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0C2B35', marginBottom: 16 }}>Goal Weight</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <input type="range" min="40" max="150" value={targetWeight} onChange={e => setTargetWeight(Number(e.target.value))}
            className="wellness-slider" style={{ flex: 1 }} />
          <div style={{ fontSize: 28, fontWeight: 900, color: '#EC5A42', minWidth: 80 }}>{targetWeight} kg</div>
        </div>
      </motion.div>

      {/* History Table */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid #E8DED8' }}>
        <h3 style={{ fontSize: 17, fontWeight: 800, color: '#0C2B35', marginBottom: 16 }}>Log History</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[...entries].reverse().map((e, i) => {
            const prev = entries[entries.length - 2 - i];
            const diff = prev ? (e.weight - prev.weight).toFixed(1) : null;
            return (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', background: '#FDFBF8', borderRadius: 12 }}>
                <span style={{ fontSize: 14, color: '#718096', fontWeight: 600 }}>
                  {new Date(e.date + 'T12:00:00').toLocaleDateString('en', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  {diff !== null && (
                    <span style={{ fontSize: 13, fontWeight: 700, color: Number(diff) < 0 ? '#14B8A6' : '#EC5A42' }}>
                      {Number(diff) > 0 ? '+' : ''}{diff} kg
                    </span>
                  )}
                  <span style={{ fontSize: 18, fontWeight: 900, color: '#0C2B35' }}>{e.weight} kg</span>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

    </div>
  );
}
