import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles, ArrowRight, ArrowLeft, Check,
  Target, Zap, Moon, Heart, Scale, Brain,
  Sun, Coffee, Dumbbell, Salad, Clock,
  Activity, TrendingUp,
} from 'lucide-react';

// ─── Step Data ───────────────────────────────────────────────

const GOALS = [
  { id: 'weight_loss',    icon: '⚖️',  title: 'Lose Weight',         desc: 'Burn fat, improve body composition' },
  { id: 'muscle_gain',   icon: '💪',  title: 'Build Muscle',        desc: 'Strength training & protein goals' },
  { id: 'stress',        icon: '🧘',  title: 'Reduce Stress',       desc: 'Mindfulness, recovery & sleep' },
  { id: 'energy',        icon: '⚡',  title: 'Boost Energy',        desc: 'Better sleep, nutrition & habits' },
  { id: 'nutrition',     icon: '🥗',  title: 'Eat Healthier',       desc: 'Macro tracking & meal planning' },
  { id: 'fitness',       icon: '🏃',  title: 'Get Fitter',          desc: 'Cardio, steps & activity goals' },
];

const LIFESTYLES = [
  { id: 'sedentary',   icon: '🪑', title: 'Sedentary',    desc: 'Mostly desk work, little movement' },
  { id: 'light',       icon: '🚶', title: 'Lightly Active',desc: 'Walk 1–3x/week, some movement' },
  { id: 'moderate',    icon: '🏋️', title: 'Moderately Active', desc: 'Exercise 3–5x/week regularly' },
  { id: 'very_active', icon: '🏃', title: 'Very Active',   desc: 'Daily intense exercise' },
];

const SCHEDULE_TIMES = ['5:00 AM','6:00 AM','7:00 AM','8:00 AM','9:00 AM','10:00 AM'];
const SLEEP_TIMES    = ['8:00 PM','9:00 PM','10:00 PM','11:00 PM','12:00 AM','1:00 AM'];

// ─── Step 1: Welcome ─────────────────────────────────────────
function WelcomeStep({ onNext }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 20 }}
        style={{
          width: 80, height: 80, borderRadius: 24,
          background: 'linear-gradient(135deg, var(--c-blue), var(--c-purple))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 28px',
          boxShadow: 'var(--shadow-glow-blue)',
        }}
      >
        <Sparkles size={36} color="white" />
      </motion.div>

      <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-1px', marginBottom: 12 }}>
        Welcome to{' '}
        <span className="grad-blue-purple">Wellness+</span>
      </h1>
      <p style={{ color: 'var(--c-text-secondary)', lineHeight: 1.7, marginBottom: 36, maxWidth: 380, margin: '0 auto 36px' }}>
        We'll set up your personalized AI health coach in just a few steps.
        This takes about <strong style={{ color: 'var(--c-text-primary)' }}>2 minutes</strong>.
      </p>

      {/* Highlights */}
      {[
        { icon: Brain,    col: 'var(--c-purple)', label: 'AI coaching tailored to you' },
        { icon: TrendingUp, col: 'var(--c-blue)',  label: 'Predictive health analytics' },
        { icon: Heart,    col: 'var(--c-red)',    label: 'Emotion-aware guidance' },
      ].map(({ icon: Icon, col, label }) => (
        <div key={label} style={{
          display: 'flex', alignItems: 'center', gap: 12,
          padding: '10px 14px', borderRadius: 12,
          background: 'var(--c-bg-hover)', border: '1px solid var(--c-border)',
          marginBottom: 10, textAlign: 'left',
        }}>
          <div style={{ width: 34, height: 34, borderRadius: 10, background: col + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Icon size={17} color={col} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 500 }}>{label}</span>
          <Check size={14} color="var(--c-teal)" style={{ marginLeft: 'auto', flexShrink: 0 }} />
        </div>
      ))}

      <button onClick={onNext} className="btn btn-primary" style={{ width: '100%', padding: '14px 18px', fontSize: 15, justifyContent: 'center', gap: 8, marginTop: 28 }}>
        Let's Get Started <ArrowRight size={17} />
      </button>
    </div>
  );
}

// ─── Step 2: Goals ───────────────────────────────────────────
function GoalsStep({ data, onChange }) {
  const selected = data.goals || [];
  function toggle(id) {
    if (selected.includes(id)) {
      onChange('goals', selected.filter(g => g !== id));
    } else if (selected.length < 3) {
      onChange('goals', [...selected, id]);
    }
  }
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8 }}>
        What are your goals?
      </h2>
      <p style={{ color: 'var(--c-text-secondary)', marginBottom: 24, fontSize: 14 }}>
        Pick up to <strong style={{ color: 'var(--c-text-primary)' }}>3 goals</strong> — we'll build your personalized plan.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {GOALS.map(g => (
          <div
            key={g.id}
            className={`goal-option ${selected.includes(g.id) ? 'selected' : ''}`}
            onClick={() => toggle(g.id)}
            style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 8, padding: '14px 16px', position: 'relative' }}
          >
            {selected.includes(g.id) && (
              <div style={{
                position: 'absolute', top: 10, right: 10,
                width: 18, height: 18, borderRadius: '50%',
                background: 'var(--c-blue)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Check size={11} color="white" strokeWidth={3} />
              </div>
            )}
            <div className="goal-option-icon">{g.icon}</div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{g.title}</p>
              <p style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>{g.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 3: Lifestyle ───────────────────────────────────────
function LifestyleStep({ data, onChange }) {
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8 }}>
        How active are you?
      </h2>
      <p style={{ color: 'var(--c-text-secondary)', marginBottom: 24, fontSize: 14 }}>
        Be honest — this helps us calibrate your targets accurately.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {LIFESTYLES.map(l => (
          <div
            key={l.id}
            className={`goal-option ${data.lifestyle === l.id ? 'selected' : ''}`}
            onClick={() => onChange('lifestyle', l.id)}
          >
            <div className="goal-option-icon">{l.icon}</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{l.title}</p>
              <p style={{ fontSize: 12, color: 'var(--c-text-muted)' }}>{l.desc}</p>
            </div>
            {data.lifestyle === l.id && (
              <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--c-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Check size={13} color="white" strokeWidth={3} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Step 4: Schedule ────────────────────────────────────────
function ScheduleStep({ data, onChange }) {
  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8 }}>
        Your daily schedule
      </h2>
      <p style={{ color: 'var(--c-text-secondary)', marginBottom: 28, fontSize: 14 }}>
        We'll time your nudges and coaching to your routine.
      </p>

      {/* Wake time */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--c-orange-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sun size={15} color="var(--c-orange)" />
          </div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>I wake up around</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SCHEDULE_TIMES.map(t => (
            <button key={t} onClick={() => onChange('wakeTime', t)}
              style={{
                padding: '8px 14px', borderRadius: 'var(--r-full)',
                border: `1.5px solid ${data.wakeTime === t ? 'var(--c-blue)' : 'var(--c-border-strong)'}`,
                background: data.wakeTime === t ? 'var(--c-blue-dim)' : 'var(--c-bg-hover)',
                color: data.wakeTime === t ? 'var(--c-blue)' : 'var(--c-text-secondary)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                transition: 'all var(--t-fast)', fontFamily: 'Inter, sans-serif',
              }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Sleep time */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <div style={{ width: 32, height: 32, borderRadius: 10, background: 'var(--c-purple-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Moon size={15} color="var(--c-purple)" />
          </div>
          <span style={{ fontSize: 14, fontWeight: 600 }}>I usually sleep around</span>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SLEEP_TIMES.map(t => (
            <button key={t} onClick={() => onChange('sleepTime', t)}
              style={{
                padding: '8px 14px', borderRadius: 'var(--r-full)',
                border: `1.5px solid ${data.sleepTime === t ? 'var(--c-purple)' : 'var(--c-border-strong)'}`,
                background: data.sleepTime === t ? 'var(--c-purple-dim)' : 'var(--c-bg-hover)',
                color: data.sleepTime === t ? 'var(--c-purple)' : 'var(--c-text-secondary)',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                transition: 'all var(--t-fast)', fontFamily: 'Inter, sans-serif',
              }}>
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function BaselineField({ label, field, unit, placeholder, icon: Icon, color = 'var(--c-blue)', data, onChange }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={14} color={color} />
        </div>
        <label style={{ fontSize: 13, fontWeight: 600, color: 'var(--c-text-secondary)' }}>{label}</label>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        <input
          type="number"
          value={data[field] || ''}
          onChange={e => onChange(field, e.target.value)}
          placeholder={placeholder}
          style={{
            flex: 1, background: 'var(--c-bg-card)',
            border: '1px solid var(--c-border-strong)',
            borderRadius: 'var(--r-md) 0 0 var(--r-md)',
            padding: '11px 14px', color: 'var(--c-text-primary)', fontSize: 15,
            fontWeight: 600, fontFamily: 'Inter, sans-serif', outline: 'none',
          }}
        />
        <div style={{
          padding: '11px 14px', background: 'var(--c-bg-hover)',
          border: '1px solid var(--c-border-strong)', borderLeft: 'none',
          borderRadius: '0 var(--r-md) var(--r-md) 0',
          fontSize: 12, color: 'var(--c-text-muted)', fontWeight: 600, whiteSpace: 'nowrap',
        }}>
          {unit}
        </div>
      </div>
    </div>
  );
}

// ─── Step 5: Baseline Metrics ────────────────────────────────
function BaselineStep({ data, onChange }) {

  return (
    <div>
      <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 8 }}>
        Baseline metrics
      </h2>
      <p style={{ color: 'var(--c-text-secondary)', marginBottom: 28, fontSize: 14 }}>
        Optional — helps calibrate your wellness score. You can skip and add later.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <BaselineField label="Current Weight" field="weight" unit="kg" placeholder="70" icon={Scale} color="var(--c-blue)" data={data} onChange={onChange} />
        <BaselineField label="Height" field="height" unit="cm" placeholder="175" icon={Activity} color="var(--c-teal)" data={data} onChange={onChange} />
        <BaselineField label="Daily Step Goal" field="stepGoal" unit="steps" placeholder="8000" icon={Zap} color="var(--c-orange)" data={data} onChange={onChange} />
        <BaselineField label="Target Sleep" field="sleepGoal" unit="hrs" placeholder="8" icon={Moon} color="var(--c-purple)" data={data} onChange={onChange} />
      </div>
      <p style={{ fontSize: 11, color: 'var(--c-text-muted)', marginTop: 16, textAlign: 'center' }}>
        🔒 Your data is private and never shared without consent.
      </p>
    </div>
  );
}

// ─── Step Configs ─────────────────────────────────────────────
const STEPS = [
  { id: 'welcome',   label: 'Welcome',   component: WelcomeStep,   noBack: true, noFooter: true },
  { id: 'goals',     label: 'Goals',     component: GoalsStep,     canSkip: false },
  { id: 'lifestyle', label: 'Lifestyle', component: LifestyleStep, canSkip: false },
  { id: 'schedule',  label: 'Schedule',  component: ScheduleStep,  canSkip: true },
  { id: 'baseline',  label: 'Baseline',  component: BaselineStep,  canSkip: true, isLast: true },
];

// ─── Main Onboarding Page ─────────────────────────────────────
export default function OnboardingPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState({
    goals: [], lifestyle: '', wakeTime: '', sleepTime: '',
    weight: '', height: '', stepGoal: '', sleepGoal: '',
  });
  const [saving, setSaving] = useState(false);
  const [dir, setDir] = useState(1); // 1=forward, -1=backward

  const step = STEPS[currentStep];
  const progress = currentStep === 0 ? 0 : (currentStep / (STEPS.length - 1)) * 100;

  function updateData(field, value) {
    setData(p => ({ ...p, [field]: value }));
  }

  function goNext() {
    setDir(1);
    if (currentStep < STEPS.length - 1) setCurrentStep(p => p + 1);
  }

  function goBack() {
    setDir(-1);
    if (currentStep > 1) setCurrentStep(p => p - 1);
  }

  async function finish() {
    setSaving(true);
    // Simulate save (will connect to real API later)
    await new Promise(r => setTimeout(r, 1500));
    setSaving(false);
    navigate('/dashboard');
  }

  const canGoNext = () => {
    if (step.id === 'goals') return data.goals.length > 0;
    if (step.id === 'lifestyle') return !!data.lifestyle;
    return true;
  };

  const stepVariants = {
    enter:  dir => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
    center: { opacity: 1, x: 0 },
    exit:   dir => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
  };

  return (
    <div className="onboarding-page">
      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', width: 500, height: 500, borderRadius: '50%', top: '-15%', right: '-10%', background: 'radial-gradient(circle, rgba(255,107,74,0.05) 0%, transparent 70%)' }} />
        <div style={{ position: 'absolute', width: 400, height: 400, borderRadius: '50%', bottom: '-10%', left: '-8%', background: 'radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%)' }} />
      </div>

      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32, zIndex: 2 }}>
        <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, var(--c-blue), var(--c-purple))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'var(--shadow-glow-blue)' }}>
          <Sparkles size={16} color="white" />
        </div>
        <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.5px' }} className="grad-blue-purple">Wellness+</span>
      </div>

      {/* Progress bar (hidden on welcome) */}
      {currentStep > 0 && (
        <div style={{ width: '100%', maxWidth: 560, zIndex: 2, marginBottom: 12 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 12, color: 'var(--c-text-muted)' }}>
              Step {currentStep} of {STEPS.length - 1}
            </span>
            <span className="badge badge-blue">{step.label}</span>
          </div>
          <div className="onboarding-progress-bar">
            <div className="onboarding-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      {/* Card */}
      <div className="onboarding-card" style={{ zIndex: 2, overflow: 'hidden' }}>
        <AnimatePresence mode="wait" custom={dir}>
          <motion.div
            key={step.id}
            custom={dir}
            variants={stepVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
          >
            {step.id === 'welcome' ? (
              <WelcomeStep onNext={goNext} />
            ) : step.id === 'goals' ? (
              <GoalsStep data={data} onChange={updateData} />
            ) : step.id === 'lifestyle' ? (
              <LifestyleStep data={data} onChange={updateData} />
            ) : step.id === 'schedule' ? (
              <ScheduleStep data={data} onChange={updateData} />
            ) : (
              <BaselineStep data={data} onChange={updateData} />
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation footer (not shown on welcome) */}
        {!step.noFooter && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--c-border)' }}>
            <button
              onClick={goBack}
              className="btn btn-secondary"
              style={{ gap: 6 }}
            >
              <ArrowLeft size={15} /> Back
            </button>

            <div style={{ display: 'flex', gap: 10 }}>
              {step.canSkip && (
                <button
                  onClick={step.isLast ? finish : goNext}
                  className="btn btn-ghost"
                  style={{ fontSize: 13 }}
                >
                  Skip
                </button>
              )}
              <button
                disabled={!canGoNext() || saving}
                onClick={step.isLast ? finish : goNext}
                className="btn btn-primary"
                style={{ gap: 7, opacity: !canGoNext() ? 0.4 : 1 }}
              >
                {saving ? (
                  <>
                    <svg style={{ animation: 'spin 1s linear infinite' }} width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeDasharray="31.4" strokeDashoffset="8" />
                    </svg>
                    Setting up...
                  </>
                ) : step.isLast ? (
                  <>Finish Setup <Sparkles size={14} /></>
                ) : (
                  <>Continue <ArrowRight size={14} /></>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
