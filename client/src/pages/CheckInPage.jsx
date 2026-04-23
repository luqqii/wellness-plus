import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle, ChevronRight, Smile, Laugh, Meh, Frown, AlertCircle,
  Flame, Battery, BatteryLow, BatteryMedium, BatteryFull, BatteryWarning,
  Zap, Coffee, Wind, Moon, TrendingDown,
  HeartPulse, Brain, Apple, Footprints, BookOpen, Dumbbell, Droplets, BedDouble
} from 'lucide-react';

// ── Mood Options (Lucide instead of emoji) ───────────────────────────────────
const MOODS = [
  { Icon: Laugh,      label: 'Great', value: 5, color: '#22C55E' },
  { Icon: Smile,      label: 'Good',  value: 4, color: '#84CC16' },
  { Icon: Meh,        label: 'Okay',  value: 3, color: '#EAB308' },
  { Icon: Frown,      label: 'Low',   value: 2, color: '#F97316' },
  { Icon: AlertCircle, label: 'Bad',  value: 1, color: '#EC5A42' },
];

// ── Hunger Options ────────────────────────────────────────────────────────────
const HUNGER_LEVELS = [
  { Icon: Flame,          label: 'Stuffed',   value: 5 },
  { Icon: BatteryFull,    label: 'Satisfied', value: 4 },
  { Icon: BatteryMedium,  label: 'Neutral',   value: 3 },
  { Icon: BatteryLow,     label: 'Hungry',    value: 2 },
  { Icon: BatteryWarning, label: 'Starving',  value: 1 },
];

// ── Energy Options ────────────────────────────────────────────────────────────
const ENERGY_LEVELS = [
  { Icon: Zap,        label: 'Energized', value: 5 },
  { Icon: Coffee,     label: 'Good',      value: 4 },
  { Icon: Wind,       label: 'Okay',      value: 3 },
  { Icon: TrendingDown, label: 'Tired',   value: 2 },
  { Icon: Moon,       label: 'Exhausted', value: 1 },
];

const TRIGGERS = ['Stress', 'Boredom', 'Social pressure', 'Habit', 'Celebration', 'Loneliness', 'Reward', 'None today'];

// ── Smart Day Plan Generator ──────────────────────────────────────────────────
function generateDayPlan(answers) {
  const { mood, hunger, energy, triggers } = answers;
  const plan = [];

  // --- MOOD-based suggestions ---
  if (mood <= 2) {
    plan.push({ Icon: Brain, color: '#9F7AEA', title: 'Mood Reset Session', desc: '10 minutes of guided breathing or a short walk outside. Low mood is often amplified by stillness.' });
    plan.push({ Icon: BookOpen, color: '#4F8DFF', title: 'Journal 3 Gratitudes', desc: 'Write down 3 things that went well recently. CBT research shows this reframes negative thought spirals in under 5 minutes.' });
  } else if (mood === 3) {
    plan.push({ Icon: Footprints, color: '#14B8A6', title: '15-Min Walk After Lunch', desc: 'A short walk after eating stabilizes blood sugar and improves afternoon mood significantly.' });
  } else {
    plan.push({ Icon: Dumbbell, color: '#EC5A42', title: 'Capitalize on Your Energy', desc: 'Your mood is great — this is the best window to tackle your hardest workout or most demanding task.' });
  }

  // --- HUNGER-based suggestions ---
  if (hunger <= 2) {
    plan.push({ Icon: Apple, color: '#22C55E', title: 'Eat a Balanced Meal Now', desc: 'Hunger triggers impulsive food choices. Eat a protein + vegetable focused meal within the next 30 minutes to avoid cravings.' });
    plan.push({ Icon: Droplets, color: '#3B82F6', title: 'Hydrate First', desc: 'Thirst is often mistaken for hunger. Drink a full glass of water before your meal to calibrate your appetite correctly.' });
  } else if (hunger >= 5) {
    plan.push({ Icon: Apple, color: '#F97316', title: 'Mindful Portion Check', desc: "You feel full, which is great. Avoid eating for another 2-3 hours and stay hydrated. Don't eat out of boredom." });
  } else {
    plan.push({ Icon: Apple, color: '#84CC16', title: 'Stick to Your Meal Plan', desc: 'Your hunger is well-regulated. Keep following your nutrition schedule to maintain this balanced state.' });
  }

  // --- ENERGY-based suggestions ---
  if (energy <= 2) {
    plan.push({ Icon: BedDouble, color: '#9F7AEA', title: 'Schedule a Power Nap', desc: '10-20 minutes of rest between 1-3 PM restores alertness without disrupting your sleep tonight.' });
    plan.push({ Icon: Coffee, color: '#F59E0B', title: 'Strategic Caffeine Timing', desc: 'If you need caffeine, take it before 2 PM to avoid disrupting your sleep cycle. Pair it with a protein snack.' });
  } else if (energy >= 4) {
    plan.push({ Icon: HeartPulse, color: '#EC5A42', title: 'High-Intensity Training Window', desc: 'Your energy is optimal for a challenging workout. Aim for strength training or an interval session today.' });
  }

  // --- TRIGGER-based suggestions ---
  if (triggers.includes('Stress')) {
    plan.push({ Icon: Wind, color: '#14B8A6', title: 'Stress Protocol: Box Breathing', desc: 'Inhale 4s → Hold 4s → Exhale 4s → Hold 4s. Repeat 4 times. This activates your parasympathetic nervous system immediately.' });
  }
  if (triggers.includes('Boredom') || triggers.includes('Loneliness')) {
    plan.push({ Icon: Brain, color: '#4F8DFF', title: 'Structured Activity Block', desc: 'Schedule a specific activity for the next hour — a class, a call with a friend, or a creative task — to remove the boredom trigger.' });
  }

  // Ensure at least 3 cards
  if (plan.length < 3) {
    plan.push({ Icon: Droplets, color: '#3B82F6', title: 'Hit Your Water Goal', desc: 'Aim for 8 glasses of water today. Proper hydration improves cognitive performance by up to 14% and reduces false hunger signals.' });
  }

  return plan.slice(0, 5); // max 5 cards
}

// ── Result Screen ─────────────────────────────────────────────────────────────
function ResultScreen({ answers, onReset }) {
  const moodObj = MOODS.find(m => m.value === answers.mood);
  const MoodIcon = moodObj?.Icon || CheckCircle;
  const dayPlan = generateDayPlan(answers);

  const moodSummary = {
    5: 'You are in peak mental state today.',
    4: 'You are in a positive headspace.',
    3: 'You are holding steady — let\'s optimize your day.',
    2: 'Your mood is low. Your plan today prioritizes recovery.',
    1: 'You\'re struggling today. That\'s okay — your plan focuses on self-care.',
  }[answers.mood] || 'Check-in complete.';

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: '#0C2B35', borderRadius: 24, padding: 32, color: '#FFFFFF', textAlign: 'center' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 280, delay: 0.1 }}
          style={{ display: 'inline-flex', padding: 16, borderRadius: '50%', background: moodObj?.color + '25', marginBottom: 16 }}>
          <MoodIcon size={48} color={moodObj?.color || '#22C55E'} strokeWidth={1.5} />
        </motion.div>
        <h2 style={{ fontSize: 26, fontWeight: 900, marginBottom: 8 }}>Check-in Complete</h2>
        <p style={{ fontSize: 16, color: '#9CA3AF', lineHeight: 1.6 }}>{moodSummary}</p>
        <div style={{ display: 'inline-flex', gap: 8, marginTop: 16, background: 'rgba(255,255,255,0.08)', borderRadius: 99, padding: '8px 20px' }}>
          <CheckCircle size={16} color="#22C55E" />
          <span style={{ fontSize: 13, fontWeight: 700, color: '#E5E7EB' }}>+5 streak points earned</span>
        </div>
      </motion.div>

      {/* AI Day Plan */}
      <div>
        <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0C2B35', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Zap size={18} color="#EC5A42" /> Your Personalized Day Plan
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {dayPlan.map((item, i) => {
            const PlanIcon = item.Icon;
            return (
              <motion.div key={i}
                initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.08 }}
                style={{ background: '#FFFFFF', border: `2px solid ${item.color}25`, borderLeft: `4px solid ${item.color}`, borderRadius: 16, padding: '16px 20px', display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                <div style={{ flexShrink: 0, padding: 10, borderRadius: 12, background: item.color + '15' }}>
                  <PlanIcon size={20} color={item.color} strokeWidth={2} />
                </div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#0C2B35', marginBottom: 4 }}>{item.title}</div>
                  <p style={{ fontSize: 13, color: '#4A5568', lineHeight: 1.55, margin: 0 }}>{item.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <button onClick={onReset}
        style={{ background: '#0C2B35', color: 'white', padding: '16px', borderRadius: 999, fontSize: 15, fontWeight: 800, border: 'none', cursor: 'pointer' }}>
        Check in again
      </button>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function CheckInPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({ mood: null, hunger: null, energy: null, triggers: [], note: '' });
  const [done, setDone] = useState(false);

  const steps = [
    { title: 'How are you feeling right now?',  sub: 'Your emotional state drives your food and activity choices.', items: MOODS,          key: 'mood'   },
    { title: 'How hungry are you?',             sub: 'Check in with your body, not just the clock.',                items: HUNGER_LEVELS,  key: 'hunger' },
    { title: "What's your energy level?",       sub: 'Low energy often leads to poor nutritional decisions.',       items: ENERGY_LEVELS,  key: 'energy' },
  ];

  const handleSelect = (key, value) => {
    setAnswers(p => ({ ...p, [key]: value }));
    setTimeout(() => {
      if (step < steps.length - 1) setStep(s => s + 1);
      else setStep(steps.length);
    }, 350);
  };

  const toggleTrigger = (t) =>
    setAnswers(p => ({
      ...p,
      triggers: p.triggers.includes(t) ? p.triggers.filter(x => x !== t) : [...p.triggers, t]
    }));

  const handleReset = () => {
    setStep(0);
    setAnswers({ mood: null, hunger: null, energy: null, triggers: [], note: '' });
    setDone(false);
  };

  if (done) return <ResultScreen answers={answers} onReset={handleReset} />;

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
              padding: '10px 20px', borderRadius: 999,
              border: `2px solid ${answers.triggers.includes(t) ? '#EC5A42' : '#E8DED8'}`,
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
            style={{ width: '100%', padding: 14, borderRadius: 12, border: '2px solid #E8DED8', fontSize: 15, outline: 'none', resize: 'vertical', color: '#0C2B35', background: '#FDFBF8', boxSizing: 'border-box' }}
          />
        </div>

        <button onClick={() => setDone(true)}
          style={{ background: '#EC5A42', color: 'white', padding: '18px', borderRadius: 999, fontSize: 17, fontWeight: 900, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          See My Day Plan <ChevronRight size={20} />
        </button>
      </div>
    );
  }

  const currentStep = steps[step];
  const progress = (step / (steps.length + 1)) * 100;

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

      {/* Options — Lucide icon buttons */}
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        {currentStep.items.map(item => {
          const ItemIcon = item.Icon;
          const isSelected = answers[currentStep.key] === item.value;
          const accentColor = item.color || '#EC5A42';
          return (
            <motion.button key={item.value} whileTap={{ scale: 0.92 }} whileHover={{ scale: 1.05 }}
              onClick={() => handleSelect(currentStep.key, item.value)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
                padding: '20px 22px', borderRadius: 20,
                border: `2px solid ${isSelected ? accentColor : '#E8DED8'}`,
                background: isSelected ? accentColor + '18' : '#FFFFFF',
                cursor: 'pointer', transition: 'all 150ms ease', minWidth: 88,
              }}>
              <div style={{ padding: 10, borderRadius: 12, background: isSelected ? accentColor + '25' : '#F5F3EF' }}>
                <ItemIcon size={28} color={isSelected ? accentColor : '#718096'} strokeWidth={1.8} />
              </div>
              <span style={{ fontSize: 13, fontWeight: 800, color: isSelected ? accentColor : '#0C2B35' }}>{item.label}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
