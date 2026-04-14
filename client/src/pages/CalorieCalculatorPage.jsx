import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PublicNavbar from '../components/layout/PublicNavbar';

export default function CalorieCalculatorPage() {
  const [data, setData] = useState({ gender: '', weight: '', targetWeight: '', months: '6', activity: 'sedentary' });
  const [result, setResult] = useState(null);

  const calculateDeficit = () => {
    const w = Number(data.weight) || 80;
    const tw = Number(data.targetWeight) || 70;
    const m = Number(data.months) || 6;
    
    // 1 kg of fat is ~7700 calories
    const weightLossNeeded = w - tw;
    const totalDeficit = weightLossNeeded * 7700;
    
    // Days to lose string
    const days = m * 30;
    const dailyDeficit = Math.round(totalDeficit / days);

    // BMR estimate
    const bmr = data.gender === 'Female' ? 1400 : 1800; // rough baseline for simplicity
    const multipliers = { 'sedentary': 1.2, 'light': 1.375, 'moderate': 1.55, 'active': 1.725 };
    const tdee = bmr * multipliers[data.activity];

    const targetCals = tdee - dailyDeficit;

    setResult({
      dailyDeficit,
      targetCals: Math.max(1200, Math.round(targetCals)) // safety floor
    });
  };

  return (
    <div style={{ background: '#FFF3EB', minHeight: '100vh', color: '#0C2B35', fontFamily: '"Nunito", "Inter", sans-serif' }}>
      <PublicNavbar />
      <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center', padding: '120px 20px 80px' }}>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 48px)', fontWeight: 900, letterSpacing: '-1px', marginBottom: 20 }}>
          Calorie Deficit Calculator
        </h1>
        <p style={{ fontSize: 20, color: '#4A5568', marginBottom: 40 }}>
          Find out exactly how many calories you need to cut to hit your target weight.
        </p>

        <div style={{ background: '#FFFFFF', padding: 40, borderRadius: 24, boxShadow: '0 12px 40px rgba(0,0,0,0.06)', textAlign: 'left' }}>
          
          <div style={{ display: 'grid', gap: 24, marginBottom: 40 }}>
            <div>
              <label style={{ display:'block', fontWeight:700, marginBottom:8 }}>Gender</label>
              <select value={data.gender} onChange={e=>setData({...data, gender:e.target.value})} style={{ width:'100%', padding:16, borderRadius:12, border:'2px solid #E8DED8', fontSize:16, outline:'none' }}>
                <option value="">Select</option><option value="Female">Female</option><option value="Male">Male</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', gap: 20 }}>
              <div style={{ flex: 1 }}>
                <label style={{ display:'block', fontWeight:700, marginBottom:8 }}>Current Weight (kg)</label>
                <input type="number" value={data.weight} onChange={e=>setData({...data, weight:e.target.value})} style={{ width:'100%', padding:16, borderRadius:12, border:'2px solid #E8DED8', fontSize:16, outline:'none' }} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ display:'block', fontWeight:700, marginBottom:8 }}>Target Weight (kg)</label>
                <input type="number" value={data.targetWeight} onChange={e=>setData({...data, targetWeight:e.target.value})} style={{ width:'100%', padding:16, borderRadius:12, border:'2px solid #E8DED8', fontSize:16, outline:'none' }} />
              </div>
            </div>

            <div>
               <label style={{ display:'block', fontWeight:700, marginBottom:8 }}>Timeline (Months)</label>
               <input type="range" className="Wellness+-slider" min="1" max="12" value={data.months} onChange={e=>setData({...data, months:e.target.value})} />
               <div style={{ textAlign: 'center', marginTop: 10, fontWeight: 700, color: '#EC5A42' }}>{data.months} Months</div>
            </div>
          </div>

          <button onClick={calculateDeficit} disabled={!data.gender || !data.weight || !data.targetWeight} className="btn" style={{ background: '#0C2B35', color: 'white', padding: '18px 0', width: '100%', fontSize: 18 }}>
            Calculate Deficit
          </button>

          {result && (
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} style={{ marginTop: 40, padding: 30, background: '#FDFBF8', borderRadius: 16, border: '2px solid #E8DED8', textAlign: 'center' }}>
              <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 10 }}>Your Personalized Target</h3>
              <div style={{ fontSize: 56, fontWeight: 900, color: '#EC5A42' }}>{result.targetCals} <span style={{fontSize:20, color:'#4A5568'}}>kcal/day</span></div>
              <p style={{ marginTop: 16, fontSize: 16, color: '#4A5568' }}>
                To reach your goal safely, you need a daily deficit of <strong>{result.dailyDeficit} calories</strong>. Let us help you track it effortlessly.
              </p>
              <button onClick={() => window.location.href='/signup'} className="btn" style={{ background: '#EC5A42', color: 'white', marginTop: 24, width: '100%', padding: '16px' }}>Start Tracking Free</button>
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
