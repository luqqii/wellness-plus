import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, ChevronRight } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import useAuthStore from '../store/authStore';

// --- Wellness+ Style Option Button ---
function QuizOption({ label, selected, onClick }) {
  return (
    <div 
      onClick={onClick}
      style={{
        background: selected ? 'var(--c-blue-dim)' : '#FFFFFF',
        border: `2px solid ${selected ? 'var(--c-blue)' : '#EAE6DF'}`,
        borderRadius: 12, padding: '18px 24px', cursor: 'pointer',
        fontSize: 18, fontWeight: 600, color: '#1A1D20',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 150ms ease', marginBottom: 12,
        boxShadow: selected ? '0 8px 20px rgba(59,130,246,0.1)' : '0 4px 10px rgba(0,0,0,0.02)'
      }}
    >
      <span>{label}</span>
      {selected ? <Check size={20} color="var(--c-blue)" strokeWidth={3} /> : <div style={{width:20, height:20, borderRadius:'50%', border:'2px solid #EAE6DF'}} />}
    </div>
  );
}

// --- Steps ---
function WelcomeStep({ onNext }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <h1 style={{ fontSize: 36, fontWeight: 900, color: '#1A1D20', marginBottom: 16, letterSpacing: '-1px' }}>
        Ready to take control?
      </h1>
      <p style={{ fontSize: 18, color: '#4A5568', marginBottom: 40, lineHeight: 1.5 }}>
        We just need to ask a few questions to understand your psychology, lifestyle, and goals. It only takes 2 minutes.
      </p>
      <button onClick={onNext} className="btn" style={{ background: 'var(--c-orange)', color: 'white', width: '100%', padding: '20px 0', fontSize: 18, fontWeight: 700 }}>
        Start my assessment
      </button>
    </div>
  );
}

function BodyStep({ data, onChange, onNext }) {
  return (
    <div>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1A1D20', marginBottom: 8 }}>Let's talk about your body</h2>
      <p style={{ color: '#4A5568', marginBottom: 32, fontSize: 16 }}>Be honest — this helps us calculate your personalized timeline.</p>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: '#1A1D20' }}>Current Weight (kg)</label>
          <input type="number" placeholder="e.g. 85" value={data.weight} onChange={e=>onChange('weight', e.target.value)}
            style={{ width: '100%', padding: 18, borderRadius: 12, border: '2px solid #EAE6DF', fontSize: 18, outline: 'none' }} />
        </div>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: 8, color: '#1A1D20' }}>Ideal Target Weight (kg)</label>
          <input type="number" placeholder="e.g. 70" value={data.targetWeight} onChange={e=>onChange('targetWeight', e.target.value)}
            style={{ width: '100%', padding: 18, borderRadius: 12, border: '2px solid #EAE6DF', fontSize: 18, outline: 'none' }} />
        </div>
      </div>
      
      <button 
        onClick={onNext} disabled={!data.weight || !data.targetWeight}
        className="btn" style={{ background: (!data.weight || !data.targetWeight) ? '#EAE6DF' : 'var(--c-orange)', color: (!data.weight || !data.targetWeight) ? '#9CA3AF' : 'white', width: '100%', padding: '20px 0', fontSize: 18, fontWeight: 700, marginTop: 40 }}
      >
        Continue
      </button>
    </div>
  );
}

function PsychologyStep({ data, onChange, onNext }) {
  const options = ["Emotional eating", "Late-night snacking", "Lack of motivation", "Busy schedule / No time", "Sweet tooth cravings"];
  return (
    <div>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1A1D20', marginBottom: 8 }}>What's your biggest roadblock?</h2>
      <p style={{ color: '#4A5568', marginBottom: 32, fontSize: 16 }}>Usually, there's an underlying behavior driving our physical habits.</p>
      
      <div>
        {options.map(opt => (
          <QuizOption key={opt} label={opt} selected={data.roadblock === opt} onClick={() => onChange('roadblock', opt)} />
        ))}
      </div>

      <button 
        onClick={onNext} disabled={!data.roadblock}
        className="btn" style={{ background: !data.roadblock ? '#EAE6DF' : 'var(--c-orange)', color: !data.roadblock ? '#9CA3AF' : 'white', width: '100%', padding: '20px 0', fontSize: 18, fontWeight: 700, marginTop: 20 }}
      >
        Continue
      </button>
    </div>
  );
}

function TimelineStep({ data, onFinish }) {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setTimeout(() => setLoading(false), 2000);
  }, []);

  const d1 = new Date();
  const d2 = new Date(); d2.setMonth(d2.getMonth() + 4);
  const chartData = [
    { name: 'Today', weight: Number(data.weight) || 85 },
    { name: d2.toLocaleDateString('en',{month:'short'}), weight: Number(data.targetWeight) || 70 }
  ];

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div style={{ width: 60, height: 60, border: '4px solid #EAE6DF', borderTopColor: 'var(--c-orange)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 24px' }} />
      <h2 style={{ fontSize: 24, fontWeight: 800, color: '#1A1D20' }}>Personalizing your plan...</h2>
      <p style={{ color: '#4A5568', marginTop: 12 }}>Analyzing your psychology and biology parameters.</p>
      <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ textAlign: 'center' }}>
      <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1A1D20', marginBottom: 8 }}>Good news!</h2>
      <p style={{ color: '#4A5568', marginBottom: 32, fontSize: 16, lineHeight: 1.5 }}>
        Based on our clinical data, you can overcome <strong>{data.roadblock || 'your roadblock'}</strong> and reach your goal weight of <strong>{data.targetWeight}kg</strong> by {d2.toLocaleDateString('en', {month:'long', day:'numeric'})}.
      </p>

      <div style={{ height: 260, width: '100%', background: '#FFFFFF', borderRadius: 20, padding: '20px', boxShadow: '0 12px 30px rgba(0,0,0,0.05)', marginBottom: 40 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{top:20, right:20, left:0, bottom:0}}>
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#718096', fontSize: 12}} />
            <YAxis domain={['auto','auto']} width={40} axisLine={false} tickLine={false} tick={{fill: '#718096', fontSize: 12}} />
            <Line type="stepAfter" dataKey="weight" stroke="var(--c-orange)" strokeWidth={4} dot={{r: 6, fill: '#FFFFFF', stroke: 'var(--c-orange)', strokeWidth: 3}} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <button onClick={onFinish} className="btn" style={{ background: 'var(--c-orange)', color: 'white', width: '100%', padding: '20px 0', fontSize: 18, fontWeight: 700 }}>
        Claim my plan
      </button>
    </div>
  );
}

// --- Main App ---
export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ weight: '', targetWeight: '', roadblock: '' });
  const { updateUser } = useAuthStore();

  const STEPS = [WelcomeStep, BodyStep, PsychologyStep, TimelineStep];
  const CurrentComp = STEPS[step];
  
  const progress = step === 0 ? 5 : (step / (STEPS.length - 1)) * 100;

  const onNext = () => setStep(p => Math.min(STEPS.length-1, p+1));
  const onBack = () => setStep(p => Math.max(0, p-1));
  
  const onFinish = async () => {
    // Attempt real database save
    try {
      const api = (await import('../services/api')).default;
      const res = await api.put('/auth/details', { 
        goals: ['weight_loss'], 
        weight: Number(data.weight),
        targetWeight: Number(data.targetWeight)
      });
      // Update local state and skip to dash
      updateUser(res.data.user || res.data);
    } catch(e) {
      console.warn('Failed to save to mock DB, pushing to dash anyway.');
    }
    navigate('/dashboard');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF8', display: 'flex', flexDirection: 'column' }}>
      {/* Top Banner & Progress */}
      <div style={{ position: 'sticky', top: 0, background: '#FDFBF8', zIndex: 10 }}>
        <div style={{ height: 6, background: '#EAE6DF', width: '100%' }}>
          <div style={{ height: '100%', background: 'var(--c-orange)', width: `${progress}%`, transition: 'width 0.5s ease', borderRadius: '0 4px 4px 0' }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px' }}>
          {step > 0 && <button onClick={onBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}><ArrowLeft size={24} color="#1A1D20" /></button>}
          <span style={{ fontSize: 18, fontWeight: 800, color: 'var(--c-orange)', marginLeft: step>0 ? 10 : 0 }}>Wellness+</span>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 20 }}>
        <div style={{ width: '100%', maxWidth: 500, padding: '0 20px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CurrentComp data={data} onChange={(f,v) => setData(p => ({...p, [f]: v}))} onNext={onNext} onFinish={onFinish} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
