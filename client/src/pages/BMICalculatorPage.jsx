import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const BMI_CATEGORIES = [
  { max: 18.5, label: 'Underweight', color: '#3B82F6', desc: 'You may need to gain weight. Speak to your doctor about a healthy approach.' },
  { max: 25,   label: 'Healthy Weight', color: '#14B8A6', desc: 'Great job! Your BMI is in the healthy range. Focus on maintaining your current habits.' },
  { max: 30,   label: 'Overweight', color: '#EAB308', desc: 'A modest weight loss can significantly lower your risk of chronic disease.' },
  { max: Infinity, label: 'Obese', color: '#EC5A42', desc: 'We strongly recommend speaking with your doctor and starting a psychology-based program.' },
];

export default function BMICalculatorPage() {
  const [data, setData] = useState({ height: '', weight: '', unit: 'metric' });
  const [result, setResult] = useState(null);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const calculate = () => {
    let h = Number(data.height) / 100; // cm to m
    let w = Number(data.weight);
    if (!h || !w) return;
    const bmi = w / (h * h);
    const cat = BMI_CATEGORIES.find(c => bmi < c.max);
    setResult({ bmi: bmi.toFixed(1), ...cat });
  };

  return (
    <div style={{ background: isAuthenticated ? 'transparent' : '#FFF3EB', minHeight: '100vh', color: '#0C2B35', fontFamily: '"Nunito", "Inter", sans-serif' }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: isAuthenticated ? '24px 16px 100px' : '120px 20px 40px' }}>
        <h1 style={{ fontSize: 40, fontWeight: 900, textAlign: 'center', marginBottom: 8, letterSpacing: '-1px' }}>BMI Calculator</h1>
        <p style={{ textAlign: 'center', color: '#718096', fontSize: 17, marginBottom: 40 }}>Body Mass Index is a quick screening tool — not a complete health picture.</p>

        <div style={{ background: '#FFFFFF', borderRadius: 24, padding: 36, boxShadow: '0 12px 40px rgba(0,0,0,0.06)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
            <div>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: 8 }}>Height (cm)</label>
              <input type="number" placeholder="170" value={data.height}
                onChange={e => setData({ ...data, height: e.target.value })}
                style={{ width: '100%', padding: 16, borderRadius: 12, border: '2px solid #E8DED8', fontSize: 18, outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: 700, marginBottom: 8 }}>Weight (kg)</label>
              <input type="number" placeholder="75" value={data.weight}
                onChange={e => setData({ ...data, weight: e.target.value })}
                style={{ width: '100%', padding: 16, borderRadius: 12, border: '2px solid #E8DED8', fontSize: 18, outline: 'none' }} />
            </div>
          </div>

          <button onClick={calculate} className="btn"
            style={{ background: '#EC5A42', color: 'white', width: '100%', padding: '18px', fontSize: 18, fontWeight: 800, borderRadius: 999 }}>
            Calculate My BMI
          </button>

          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              style={{ marginTop: 32, textAlign: 'center', padding: 28, background: '#FDFBF8', borderRadius: 20, border: `2px solid ${result.color}` }}>
              <div style={{ fontSize: 64, fontWeight: 900, color: result.color, letterSpacing: '-2px' }}>{result.bmi}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: result.color, marginBottom: 12 }}>{result.label}</div>
              <p style={{ fontSize: 15, color: '#4A5568', lineHeight: 1.6 }}>{result.desc}</p>

              {/* BMI Scale Visual */}
              <div style={{ marginTop: 24, position: 'relative' }}>
                <div style={{ display: 'flex', height: 16, borderRadius: 8, overflow: 'hidden' }}>
                  <div style={{ flex: 1, background: '#3B82F6' }} />
                  <div style={{ flex: 1.3, background: '#14B8A6' }} />
                  <div style={{ flex: 1, background: '#EAB308' }} />
                  <div style={{ flex: 1.5, background: '#EC5A42' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: '#9CA3AF', fontWeight: 600 }}>
                  <span>Underweight</span><span>Normal</span><span>Overweight</span><span>Obese</span>
                </div>
              </div>

              <button
                onClick={() => isAuthenticated ? navigate('/weight-tracker') : window.location.href = '/signup'}
                style={{ marginTop: 24, background: '#0C2B35', color: 'white', border: 'none', borderRadius: 999, padding: '14px 32px', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>
                {isAuthenticated ? 'View My Weight Tracker' : 'Start My Wellness+ Plan'}
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
