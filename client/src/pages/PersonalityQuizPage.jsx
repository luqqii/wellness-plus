import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUIZ_QUESTIONS = [
  {
    q: "When you feel stressed, what is your first instinct?",
    options: ["Raid the pantry for comfort food", "Skip meals entirely", "Go for a walk or exercise", "Binge watch TV"]
  },
  {
    q: "How would you describe your historical relationship with diets?",
    options: ["All or nothing (perfectionist)", "I try for a few days then give up", "Slow and steady", "I've never dieted before"]
  },
  {
    q: "What's your biggest barrier to eating healthy?",
    options: ["Lack of time", "Sweet tooth", "Social events & eating out", "Emotional eating"]
  }
];

export default function PersonalityQuizPage() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSelect = (optionIdx) => {
    setAnswers({ ...answers, [step]: optionIdx });
    if (step < QUIZ_QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      generateResult();
    }
  };

  const generateResult = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      // Mock logic based on answers
      let type = "The Perfectionist";
      let desc = "You have an 'all or nothing' mindset. If you make one mistake, you throw the whole day away. Wellness+ will teach you the psychology of self-compassion.";
      
      if (answers[0] === 0 || answers[2] === 3) {
        type = "The Emotional Eater";
        desc = "You use food to self-soothe. Wellness+ will help you identify your triggers and build healthier coping mechanisms.";
      } else if (answers[1] === 1 || answers[2] === 0) {
        type = "The Busy Bee";
        desc = "Your lifestyle makes consistency hard. We will provide 10-minute micro-lessons to fit your chaotic schedule.";
      }

      setResult({ type, desc });
    }, 2000);
  };

  if (result) {
    return (
      <div style={{ background: '#FFF3EB', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <motion.div initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} style={{ background: '#FFFFFF', padding: 40, borderRadius: 24, maxWidth: 600, textAlign: 'center', boxShadow: '0 20px 40px rgba(0,0,0,0.08)' }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: '#EC5A42', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 16 }}>Your Eating Personality</div>
          <h1 style={{ fontSize: 40, fontWeight: 900, color: '#0C2B35', marginBottom: 20, lineHeight: 1.1 }}>{result.type}</h1>
          <p style={{ fontSize: 18, color: '#4A5568', lineHeight: 1.6, marginBottom: 40 }}>{result.desc}</p>
          <button onClick={() => window.location.href='/signup'} className="btn" style={{ background: '#EC5A42', color: 'white', padding: '18px 40px', fontSize: 18, borderRadius: 999 }}>
            Start Your Custom Plan
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div style={{ background: '#FFF3EB', minHeight: '100vh', color: '#0C2B35', fontFamily: '"Nunito", "Inter", sans-serif', paddingTop: 100 }}>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 20px' }}>
        
        {loading ? (
          <div style={{ textAlign: 'center', marginTop: 100 }}>
            <div style={{ width: 60, height: 60, border: '4px solid #EAE6DF', borderTopColor: '#EC5A42', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 24px' }} />
            <h2 style={{ fontSize: 24, fontWeight: 800 }}>Analyzing your psychology...</h2>
            <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 40 }}>
              <div style={{ height: 8, background: '#E8DED8', borderRadius: 4, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: '#EC5A42', width: `${((step)/QUIZ_QUESTIONS.length)*100}%`, transition: 'width 0.3s ease' }} />
              </div>
              <div style={{ marginTop: 12, fontWeight: 700, color: '#718096', fontSize: 14 }}>Question {step + 1} of {QUIZ_QUESTIONS.length}</div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <h1 style={{ fontSize: 32, fontWeight: 900, marginBottom: 30, lineHeight: 1.2 }}>
                  {QUIZ_QUESTIONS[step].q}
                </h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {QUIZ_QUESTIONS[step].options.map((opt, i) => (
                    <div 
                      key={i} 
                      onClick={() => handleSelect(i)}
                      style={{
                        padding: '20px 24px', background: '#FFFFFF', borderRadius: 16,
                        border: '2px solid #E8DED8', fontSize: 18, fontWeight: 600, cursor: 'pointer',
                        transition: 'all 150ms ease', boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
                      }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = '#EC5A42'}
                      onMouseLeave={e => e.currentTarget.style.borderColor = '#E8DED8'}
                    >
                      {opt}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </>
        )}

      </div>
    </div>
  );
}
