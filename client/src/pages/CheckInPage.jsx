import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChevronRight } from 'lucide-react';

const MOODS = [
  { emoji: '😄', label: 'Great', value: 5, color: '#22C55E' },
  { emoji: '🙂', label: 'Good',  value: 4, color: '#84CC16' },
  { emoji: '😐', label: 'Okay',  value: 3, color: '#EAB308' },
  { emoji: '😔', label: 'Low',   value: 2, color: '#F97316' },
  { emoji: '😢', label: 'Bad',   value: 1, color: '#EC5A42' },
];

const HUNGER_LEVELS = [
  { emoji: '😤', label: 'Stuffed', value: 5 },
  { emoji: '😊', label: 'Satisfied', value: 4 },
  { emoji: '😐', label: 'Neutral', value: 3 },
  { emoji: '🤔', label: 'Hungry', value: 2 },
  { emoji: '🫙', label: 'Starving', value: 1 },
];

const ENERGY_LEVELS = [
  { emoji: '⚡', label: 'Energized', value: 5 },
  { emoji: '😊', label: 'Good', value: 4 },
  { emoji: '😐', label: 'Okay', value: 3 },
  { emoji: '😴', label: 'Tired', value: 2 },
  { emoji: '💤', label: 'Exhausted', value: 1 },
];

const TRIGGERS = ['Stress', 'Boredom', 'Social pressure', 'Habit', 'Celebration', 'Loneliness', 'Reward', 'None today'];

export default function CheckInPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ mood: null, hunger: null, energy: null, triggers: [], note: '' });
  const [done, setDone] = useState(false);

  const steps = [
    {
      title: 'How are you feeling right now?',
      sub: 'Your emotional state affects your food choices.',
      items: MOODS,
      key: 'mood',
    },
    {
      title: 'How hungry are you?',
      sub: 'Check in with your body, not just the clock.',
      items: HUNGER_LEVELS,
      key: 'hunger',
    },
    {
      title: 'What\'s your energy level?',
      sub: 'Low energy often leads to poor food decisions.',
      items: ENERGY_LEVELS,
      key: 'energy',
    },
  ];

  const handleSelect = (key, value) => {
    setAnswers(p => ({ ...p, [key]: value }));
    setTimeout(() => {
      if (step < steps.length - 1) setStep(s => s + 1);
      else setStep(steps.length); // go to triggers screen
    }, 400);
  };

  const toggleTrigger = (t) => {
    setAnswers(p => ({
      ...p,
      triggers: p.triggers.includes(t) ? p.triggers.filter(x => x !== t) : [...p.triggers, t]
    }));
  };

  const handleSubmit = () => setDone(true);

  if (done) {
    const moodObj = MOODS.find(m => m.value === answers.mood);
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 20, textAlign: 'center' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
          <CheckCircle size={80} color="#22C55E" />
        </motion.div>
        <h2 style={{ fontSize: 28, fontWeight: 900, color: '#0C2B35' }}>Check-in Complete! 🎉</h2>
        <p style={{ fontSize: 17, color: '#4A5568', maxWidth: 400 }}>
          You're feeling <strong>{moodObj?.label}</strong> today. Self-awareness is the first step to change — great work logging in.
        </p>
        <div style={{ background: '#F9E4E1', padding: '16px 32px', borderRadius: 20, border: '2px solid #EC5A42' }}>
          <div style={{ fontSize: 40 }}>{moodObj?.emoji}</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#EC5A42', marginTop: 4 }}>+5 streak points</div>
        </div>
        <button onClick={() => { setStep(0); setAnswers({ mood: null, hunger: null, energy: null, triggers: [], note: '' }); setDone(false); }}
          style={{ marginTop: 10, background: '#0C2B35', color: 'white', padding: '14px 32px', borderRadius: 999, fontSize: 15, fontWeight: 800, border: 'none', cursor: 'pointer' }}>
          Check in again
        </button>
      </div>
    );
  }

  // Triggers + Note Step
  if (step === steps.length) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          style={{ background: '#0C2B35', borderRadius: 24, padding: 28, color: '#FFFFFF', textAlign: 'center' }}>
          <h2 style={{ fontSize: 22, fontWeight: 900, marginBottom: 8 }}>Any eating triggers today?</h2>
          <p style={{ color: '#9CA3AF', fontSize: 15 }}>Identifying patterns is the core of CBT-based change.</p>
        </motion.div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {TRIGGERS.map(t => (
            <button key={t} onClick={() => toggleTrigger(t)} style={{
              padding: '10px 20px', borderRadius: 999, border: `2px solid ${answers.triggers.includes(t) ? '#EC5A42' : '#E8DED8'}`,
              background: answers.triggers.includes(t) ? '#F9E4E1' : '#FFFFFF',
              color: answers.triggers.includes(t) ? '#EC5A42' : '#4A5568',
              fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 150ms ease'
            }}>{t}</button>
          ))}
        </div>

        <div style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid #E8DED8' }}>
          <label style={{ display: 'block', fontWeight: 700, marginBottom: 10, color: '#0C2B35' }}>Optional note to yourself:</label>
          <textarea
            rows={3} value={answers.note} onChange={e => setAnswers(p => ({ ...p, note: e.target.value }))}
            placeholder="What's on your mind? How was your day so far?"
            style={{ width: '100%', padding: 14, borderRadius: 12, border: '2px solid #E8DED8', fontSize: 15, outline: 'none', resize: 'vertical', color: '#0C2B35', background: '#FDFBF8' }}
          />
        </div>

        <button onClick={handleSubmit}
          style={{ background: '#EC5A42', color: 'white', padding: '18px', borderRadius: 999, fontSize: 17, fontWeight: 900, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          Complete Check-in <ChevronRight size={20} />
        </button>
      </div>
    );
  }

  const currentStep = steps[step];
  const progress = ((step) / (steps.length + 1)) * 100;

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 28 }}>
      {/* Progress */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#9CA3AF' }}>Step {step + 1} of {steps.length + 1}</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: '#EC5A42' }}>{Math.round(progress)}%</span>
        </div>
        <div style={{ height: 6, background: '#EAE6DF', borderRadius: 3, overflow: 'hidden' }}>
          <motion.div animate={{ width: `${progress}%` }} style={{ height: '100%', background: '#EC5A42', borderRadius: 3 }} />
        </div>
      </div>

      {/* Question Card */}
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
          style={{ background: '#0C2B35', borderRadius: 24, padding: 32, color: '#FFFFFF', textAlign: 'center' }}>
          <h2 style={{ fontSize: 24, fontWeight: 900, marginBottom: 8 }}>{currentStep.title}</h2>
          <p style={{ fontSize: 16, color: '#9CA3AF' }}>{currentStep.sub}</p>
        </motion.div>
      </AnimatePresence>

      {/* Options */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        {currentStep.items.map(item => (
          <motion.button key={item.value} whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.05 }}
            onClick={() => handleSelect(currentStep.key, item.value)}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              padding: '20px 24px', borderRadius: 20, border: `2px solid ${answers[currentStep.key] === item.value ? item.color || '#EC5A42' : '#E8DED8'}`,
              background: answers[currentStep.key] === item.value ? '#F9E4E1' : '#FFFFFF',
              cursor: 'pointer', transition: 'all 150ms ease', minWidth: 80
            }}>
            <span style={{ fontSize: 40 }}>{item.emoji}</span>
            <span style={{ fontSize: 13, fontWeight: 800, color: '#0C2B35' }}>{item.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
