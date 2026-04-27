import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Check, Sparkles, User, Activity, Clock, ShieldCheck } from 'lucide-react';
import useAuthStore from '../store/authStore';

const QUIZ_QUESTIONS = [
  {
    id: 'q1',
    title: 'What is your ultimate wellness objective?',
    options: ['Weight Loss', 'Muscle Gain', 'Improved Endurance', 'Stress Reduction']
  },
  {
    id: 'q2',
    title: 'How many days a week do you currently exercise?',
    options: ['None', '1-2 days', '3-4 days', '5+ days']
  },
  {
    id: 'q3',
    title: 'How familiar are you with fitness and nutrition?',
    options: ['Beginner', 'Intermediate', 'Advanced']
  },
  {
    id: 'q4',
    title: 'What type of training do you enjoy the most?',
    options: ['Cardio/Running', 'Weightlifting', 'Bodyweight/HIIT', 'Yoga/Flexibility']
  },
  {
    id: 'q5',
    title: 'How would you describe your current eating habits?',
    options: ['Strictly healthy', 'Balanced but struggle with cravings', 'Frequently eat out', 'Specialized diet']
  },
  {
    id: 'q6',
    title: 'How many hours of restful sleep do you average per night?',
    options: ['< 5 hours', '5-6 hours', '7-8 hours', '9+ hours']
  },
  {
    id: 'q7',
    title: 'How would you rate your typical daily stress level?',
    options: ['Very High', 'Moderate', 'Low']
  },
  {
    id: 'q8',
    title: 'How much time can you realistically dedicate to a workout?',
    options: ['< 20 mins', '30-45 mins', '60+ mins']
  },
  {
    id: 'q9',
    title: 'What has been your biggest roadblock in the past?',
    options: ['Lack of time', 'Lack of knowledge', 'Loss of motivation', 'Injury/Discomfort']
  },
  {
    id: 'q10',
    title: 'How fast are you looking to see significant progress?',
    options: ['Within 30 days', 'Within 3 months', '6+ months / Long-term lifestyle']
  }
];

function QuizOption({ label, selected, onClick }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onClick}
      style={{
        background: selected ? 'var(--c-teal-dim)' : '#FFFFFF',
        border: `2px solid ${selected ? 'var(--c-teal)' : 'var(--c-border)'}`,
        borderRadius: 16, padding: '20px 24px', cursor: 'pointer',
        fontSize: 16, fontWeight: 700, color: 'var(--c-text-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        transition: 'all 0.2s ease', marginBottom: 12,
        boxShadow: selected ? '0 8px 20px rgba(20, 184, 166, 0.15)' : '0 4px 10px rgba(0,0,0,0.03)'
      }}
    >
      <span>{label}</span>
      <div style={{
        width: 24, height: 24, borderRadius: '50%', 
        background: selected ? 'var(--c-teal)' : 'transparent',
        border: `2px solid ${selected ? 'var(--c-teal)' : 'var(--c-border-strong)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        {selected && <Check size={14} color="#FFF" strokeWidth={3} />}
      </div>
    </motion.div>
  );
}

function WelcomeStep({ onNext }) {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ width: 80, height: 80, background: 'var(--c-teal-dim)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
        <User size={40} color="var(--c-teal)" />
      </div>
      <h1 style={{ fontSize: 32, fontWeight: 900, color: 'var(--c-text-primary)', marginBottom: 16, letterSpacing: '-1px' }}>
        Meet Your AI Personal Trainer
      </h1>
      <p style={{ fontSize: 16, color: 'var(--c-text-secondary)', marginBottom: 40, lineHeight: 1.6 }}>
        To build your perfect protocol, I need to understand your biology, habits, and goals. It only takes 10 questions.
      </p>
      <button onClick={onNext} className="btn" style={{ background: 'var(--c-teal)', color: 'white', width: '100%', padding: '18px 0', fontSize: 18, fontWeight: 800, borderRadius: 16 }}>
        Start Assessment
      </button>
    </div>
  );
}

function QuizStep({ question, answer, onAnswer, onNext }) {
  return (
    <div style={{ padding: '20px', maxWidth: 500, margin: '0 auto' }}>
      <h2 style={{ fontSize: 26, fontWeight: 800, color: 'var(--c-text-primary)', marginBottom: 32, lineHeight: 1.3 }}>
        {question.title}
      </h2>
      
      <div>
        {question.options.map(opt => (
          <QuizOption key={opt} label={opt} selected={answer === opt} onClick={() => {
            onAnswer(opt);
            setTimeout(onNext, 400); // Auto-advance after a brief delay
          }} />
        ))}
      </div>
    </div>
  );
}

function AnalyzingStep() {
  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', maxWidth: 480, margin: '0 auto' }}>
      <div style={{ position: 'relative', width: 100, height: 100, margin: '0 auto 32px' }}>
        <div style={{ position: 'absolute', inset: 0, border: '4px solid var(--c-border)', borderRadius: '50%' }} />
        <motion.div 
          animate={{ rotate: 360 }} 
          transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
          style={{ position: 'absolute', inset: 0, border: '4px solid transparent', borderTopColor: 'var(--c-teal)', borderRadius: '50%' }} 
        />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Sparkles size={32} color="var(--c-teal)" />
        </div>
      </div>
      
      <h2 style={{ fontSize: 24, fontWeight: 800, color: 'var(--c-text-primary)', marginBottom: 12 }}>
        Building Your Protocol...
      </h2>
      <p style={{ color: 'var(--c-text-secondary)', fontSize: 16 }}>
        Analyzing your 10 responses with Gemini AI to generate your personalized coaching plan.
      </p>
    </div>
  );
}

function ResultStep({ assessment, onFinish }) {
  return (
    <div style={{ padding: '20px', maxWidth: 600, margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--c-teal-dim)', color: 'var(--c-teal)', padding: '6px 14px', borderRadius: 99, fontSize: 14, fontWeight: 800, textTransform: 'uppercase', marginBottom: 16 }}>
          <ShieldCheck size={18} /> Assessment Complete
        </div>
        <h2 style={{ fontSize: 32, fontWeight: 900, color: 'var(--c-text-primary)' }}>Your Professional Plan</h2>
      </div>

      <div className="glass-card" style={{ padding: 24, marginBottom: 24, borderLeft: '4px solid var(--c-teal)' }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, textTransform: 'uppercase', color: 'var(--c-text-muted)', marginBottom: 8 }}>Recommended Focus</h3>
        <p style={{ fontSize: 20, fontWeight: 800, color: 'var(--c-text-primary)', margin: 0 }}>
          {assessment.recommendedFocus}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, marginBottom: 40 }}>
        <div>
          <h4 style={{ fontSize: 18, fontWeight: 800, color: 'var(--c-text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Activity size={20} color="var(--c-blue)" /> Current Status & Strengths
          </h4>
          <p style={{ color: 'var(--c-text-secondary)', lineHeight: 1.6, fontSize: 15, margin: 0 }}>{assessment.status}</p>
        </div>
        
        <div>
          <h4 style={{ fontSize: 18, fontWeight: 800, color: 'var(--c-text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Clock size={20} color="var(--c-orange)" /> Major Roadblocks & Adjustments
          </h4>
          <p style={{ color: 'var(--c-text-secondary)', lineHeight: 1.6, fontSize: 15, margin: 0 }}>{assessment.roadblocks}</p>
        </div>
        
        <div>
          <h4 style={{ fontSize: 18, fontWeight: 800, color: 'var(--c-text-primary)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={20} color="var(--c-teal)" /> Immediate Next Steps
          </h4>
          <p style={{ color: 'var(--c-text-secondary)', lineHeight: 1.6, fontSize: 15, margin: 0 }}>{assessment.nextSteps}</p>
        </div>
      </div>

      <button onClick={onFinish} className="btn" style={{ background: 'var(--c-text-primary)', color: 'white', width: '100%', padding: '20px 0', fontSize: 18, fontWeight: 800, borderRadius: 16 }}>
        Enter My Dashboard
      </button>
    </div>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(-1); // -1: Welcome, 0-9: Questions, 10: Analyzing, 11: Result
  const [answers, setAnswers] = useState({});
  const [assessment, setAssessment] = useState(null);
  
  const { updateUser } = useAuthStore();

  const handleAnswer = (qId, value) => {
    setAnswers(prev => ({ ...prev, [qId]: value }));
  };

  const handleNext = async () => {
    if (step < QUIZ_QUESTIONS.length - 1) {
      setStep(s => s + 1);
    } else if (step === QUIZ_QUESTIONS.length - 1) {
      // Finished quiz, go to analyzing
      setStep(QUIZ_QUESTIONS.length);
      
      try {
        const api = (await import('../services/api')).default;
        
        // 1. Get Assessment from AI
        const res = await api.post('/insights/onboarding-assessment', { answers });
        setAssessment(res.data);
        
        // 2. Save goals/completion to DB
        let goalEnum = 'fitness';
        if (answers.q1 === 'Weight Loss') goalEnum = 'weight_loss';
        else if (answers.q1 === 'Muscle Gain') goalEnum = 'muscle_gain';
        else if (answers.q1 === 'Stress Reduction') goalEnum = 'stress';
        else if (answers.q1 === 'Improved Endurance') goalEnum = 'energy';

        const dbRes = await api.put('/auth/details', { 
          goals: [goalEnum], 
          onboardingCompleted: true
        });
        updateUser(dbRes.data.user || dbRes.data);
        
        // Move to result screen
        setStep(QUIZ_QUESTIONS.length + 1);
      } catch (e) {
        console.error("Assessment failed:", e);
        // Fallback
        setAssessment({
          status: "You are building a solid foundation.",
          roadblocks: "Time and consistency are common hurdles we will overcome together.",
          nextSteps: "Let's start your journey on the dashboard.",
          recommendedFocus: "General Wellness"
        });
        updateUser({ onboarding: { completed: true } });
        setStep(QUIZ_QUESTIONS.length + 1);
      }
    }
  };

  const handleBack = () => {
    if (step >= 0 && step < QUIZ_QUESTIONS.length) {
      setStep(s => s - 1);
    }
  };

  const handleFinish = () => {
    navigate('/dashboard');
  };

  // Progress Bar Calculation
  const progress = step === -1 ? 0 : step >= QUIZ_QUESTIONS.length ? 100 : ((step + 1) / QUIZ_QUESTIONS.length) * 100;

  return (
    <div style={{ minHeight: '100vh', background: '#FDFBF8', display: 'flex', flexDirection: 'column' }}>
      
      {/* Top Banner & Progress */}
      {step < QUIZ_QUESTIONS.length + 1 && (
        <div style={{ position: 'sticky', top: 0, background: '#FDFBF8', zIndex: 10 }}>
          <div style={{ height: 6, background: 'var(--c-border)', width: '100%' }}>
            <div style={{ height: '100%', background: 'var(--c-teal)', width: `${progress}%`, transition: 'width 0.4s ease', borderRadius: '0 4px 4px 0' }} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', maxWidth: 800, margin: '0 auto' }}>
            {step >= 0 && step < QUIZ_QUESTIONS.length && (
              <button onClick={handleBack} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, color: 'var(--c-text-secondary)' }}>
                <ArrowLeft size={20} /> Back
              </button>
            )}
            <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--c-teal)', marginLeft: step >= 0 ? 'auto' : 0 }}>Wellness+</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: step === -1 ? 60 : 20 }}>
        <div style={{ width: '100%', padding: '0 20px' }}>
          <AnimatePresence mode="wait">
            
            {step === -1 && (
              <motion.div key="welcome" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
                <WelcomeStep onNext={() => setStep(0)} />
              </motion.div>
            )}

            {step >= 0 && step < QUIZ_QUESTIONS.length && (
              <motion.div key={`q${step}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                <QuizStep 
                  question={QUIZ_QUESTIONS[step]} 
                  answer={answers[QUIZ_QUESTIONS[step].id]}
                  onAnswer={(val) => handleAnswer(QUIZ_QUESTIONS[step].id, val)}
                  onNext={handleNext} 
                />
              </motion.div>
            )}

            {step === QUIZ_QUESTIONS.length && (
              <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <AnalyzingStep />
              </motion.div>
            )}

            {step === QUIZ_QUESTIONS.length + 1 && assessment && (
              <motion.div key="result" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <ResultStep assessment={assessment} onFinish={handleFinish} />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
