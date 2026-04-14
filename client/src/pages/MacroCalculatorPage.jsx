import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function MacroCalculatorPage() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({ gender: '', age: '', weight: '', height: '', goal: '', activity: '' });
  const [results, setResults] = useState(null);
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const calculateMacros = () => {
    // Basic accurate Mifflin-St Jeor Equation clone for Wellness+ behavior
    const w = Number(data.weight) || 75;
    const h = Number(data.height) || 170;
    const a = Number(data.age) || 30;
    
    let bmr = (10 * w) + (6.25 * h) - (5 * a);
    bmr = data.gender === 'Female' ? bmr - 161 : bmr + 5;
    
    const multipliers = { 'sedentary': 1.2, 'light': 1.375, 'moderate': 1.55, 'active': 1.725 };
    const tdee = bmr * (multipliers[data.activity] || 1.375);
    
    let targetCals = tdee;
    if (data.goal === 'lose') targetCals -= 500;
    if (data.goal === 'gain') targetCals += 300;

    // Standard Macro Split (Wellness+ leans high protein/moderate carb)
    const protein = Math.round((targetCals * 0.3) / 4);
    const fat = Math.round((targetCals * 0.3) / 9);
    const carbs = Math.round((targetCals * 0.4) / 4);

    setResults({ calories: Math.round(targetCals), protein, fat, carbs });
    setStep(3);
  };

  const handleNext = () => {
    if (step === 1 && data.gender && data.age && data.weight && data.height) setStep(2);
    else if (step === 2 && data.goal && data.activity) calculateMacros();
  };

  return (
    <div style={{ background: isAuthenticated ? 'transparent' : '#FFF3EB', minHeight: '100vh', color: '#0C2B35', fontFamily: '"Nunito", "Inter", sans-serif' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', padding: isAuthenticated ? '24px 16px 100px' : '120px 20px 80px' }}>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: 20 }}>
          Wellness+ Macro Calculator
        </h1>
        <p style={{ fontSize: 20, color: '#4A5568', marginBottom: 40, lineHeight: 1.5 }}>
          Discover the exact balance of proteins, fats, and carbs your body needs to reach your goals.
        </p>

        <div style={{ background: '#FFFFFF', padding: 40, borderRadius: 24, boxShadow: '0 12px 40px rgba(0,0,0,0.06)', textAlign: 'left' }}>
          
          {step === 1 && (
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Step 1: Your Baseline</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
                <div>
                  <label style={{ display:'block', fontWeight:700, marginBottom:8 }}>Gender</label>
                  <select value={data.gender} onChange={e=>setData({...data, gender:e.target.value})} style={{ width:'100%', padding:16, borderRadius:12, border:'2px solid #E8DED8', fontSize:16, outline:'none' }}>
                    <option value="">Select</option><option value="Female">Female</option><option value="Male">Male</option>
                  </select>
                </div>
                <div>
                  <label style={{ display:'block', fontWeight:700, marginBottom:8 }}>Age</label>
                  <input type="number" placeholder="Years" value={data.age} onChange={e=>setData({...data, age:e.target.value})} style={{ width:'100%', padding:16, borderRadius:12, border:'2px solid #E8DED8', fontSize:16, outline:'none' }} />
                </div>
                <div>
                  <label style={{ display:'block', fontWeight:700, marginBottom:8 }}>Weight (kg)</label>
                  <input type="number" placeholder="85" value={data.weight} onChange={e=>setData({...data, weight:e.target.value})} style={{ width:'100%', padding:16, borderRadius:12, border:'2px solid #E8DED8', fontSize:16, outline:'none' }} />
                </div>
                <div>
                  <label style={{ display:'block', fontWeight:700, marginBottom:8 }}>Height (cm)</label>
                  <input type="number" placeholder="170" value={data.height} onChange={e=>setData({...data, height:e.target.value})} style={{ width:'100%', padding:16, borderRadius:12, border:'2px solid #E8DED8', fontSize:16, outline:'none' }} />
                </div>
              </div>
              <button onClick={handleNext} disabled={!data.gender||!data.age||!data.weight||!data.height} className="btn" style={{ background: '#EC5A42', color: 'white', padding: '18px 0', width: '100%', fontSize: 18 }}>Continue</button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 24 }}>Step 2: Lifestyle & Goals</h2>
              <div style={{ display: 'flex', flexDirection:'column', gap: 20, marginBottom: 30 }}>
                <div>
                  <label style={{ display:'block', fontWeight:700, marginBottom:12 }}>Activity Level</label>
                  <select value={data.activity} onChange={e=>setData({...data, activity:e.target.value})} style={{ width:'100%', padding:16, borderRadius:12, border:'2px solid #E8DED8', fontSize:16, outline:'none' }}>
                    <option value="">Select Activity Level</option>
                    <option value="sedentary">Sedentary (desk job, little exercise)</option>
                    <option value="light">Lightly Active (1-3 days/week)</option>
                    <option value="moderate">Moderately Active (3-5 days/week)</option>
                    <option value="active">Very Active (6-7 days/week)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display:'block', fontWeight:700, marginBottom:12 }}>Primary Goal</label>
                  <select value={data.goal} onChange={e=>setData({...data, goal:e.target.value})} style={{ width:'100%', padding:16, borderRadius:12, border:'2px solid #E8DED8', fontSize:16, outline:'none' }}>
                    <option value="">Select Goal</option>
                    <option value="lose">Lose Weight</option>
                    <option value="maintain">Maintain Weight</option>
                    <option value="gain">Build Muscle / Gain Weight</option>
                  </select>
                </div>
              </div>
              <button onClick={handleNext} disabled={!data.goal||!data.activity} className="btn" style={{ background: '#EC5A42', color: 'white', padding: '18px 0', width: '100%', fontSize: 18 }}>Calculate My Macros</button>
            </motion.div>
          )}

          {step === 3 && results && (
            <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}}>
              <div style={{ textAlign: 'center', marginBottom: 30 }}>
                <h2 style={{ fontSize: 32, fontWeight: 900, color: '#0C2B35', marginBottom: 10 }}>Your Macro Targets</h2>
                <p style={{ fontSize: 18, color: '#4A5568' }}>To optimally hit your goals, eat roughly:</p>
                <div style={{ fontSize: 48, fontWeight: 900, color: '#EC5A42', margin: '20px 0' }}>{results.calories} <span style={{fontSize: 20, color: '#0C2B35'}}>kcal/day</span></div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 16, marginBottom: 40, textAlign: 'center' }}>
                <div style={{ padding: 24, background: '#F7EBE3', borderRadius: 16 }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#EC5A42' }}>{results.protein}g</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0C2B35' }}>Protein</div>
                </div>
                <div style={{ padding: 24, background: '#F7EBE3', borderRadius: 16 }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#EC5A42' }}>{results.carbs}g</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0C2B35' }}>Carbs</div>
                </div>
                <div style={{ padding: 24, background: '#F7EBE3', borderRadius: 16 }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: '#EC5A42' }}>{results.fat}g</div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0C2B35' }}>Fats</div>
                </div>
              </div>

              {isAuthenticated ? (
                <button onClick={() => navigate('/dashboard')} className="btn" style={{ background: '#0C2B35', color: 'white', padding: '18px 0', width: '100%', fontSize: 18 }}>
                  Go to My Dashboard
                </button>
              ) : (
                <button onClick={() => window.location.href = '/signup'} className="btn" style={{ background: '#0C2B35', color: 'white', padding: '18px 0', width: '100%', fontSize: 18 }}>
                  Start tracking with Wellness+
                </button>
              )}
            </motion.div>
          )}

        </div>
      </div>
    </div>
  );
}
