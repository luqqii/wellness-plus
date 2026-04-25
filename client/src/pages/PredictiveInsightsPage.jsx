import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ActivitySquare, AlertTriangle, ArrowLeft, Battery, BatteryWarning, Brain, CheckCircle2, ChevronRight, HeartPulse, RefreshCw, Sparkles, TrendingDown, Loader2 } from 'lucide-react';
import api from '../services/api';

const QUIZ_DATA = {
  fatigue: {
    title: "Fatigue Anticipation",
    icon: BatteryWarning,
    color: "#14B8A6",
    desc: "Real-time energy depletion model",
    questions: [
      { q: "How many hours of uninterrupted sleep did you get last night?", options: [{text: "7+ hours", score: 1}, {text: "5-6 hours", score: 2}, {text: "Broken, poor quality sleep", score: 3}, {text: "4 hours or less", score: 4}] },
      { q: "How would you rate your current physical energy level?", options: [{text: "High and sustained", score: 1}, {text: "Normal", score: 2}, {text: "Sluggish, need caffeine", score: 3}, {text: "Completely depleted", score: 4}] },
      { q: "Are you experiencing unusual muscle soreness or heaviness?", options: [{text: "None at all", score: 1}, {text: "Mild, expected soreness", score: 2}, {text: "Noticeably heavy legs/arms", score: 3}, {text: "Severe, lingering soreness", score: 4}] },
      { q: "How difficult is it to concentrate on complex tasks right now?", options: [{text: "Easy, sharp focus", score: 1}, {text: "Normal effort required", score: 2}, {text: "Easily distracted, brain fog", score: 3}, {text: "Cannot focus at all", score: 4}] },
      { q: "How does your resting heart rate feel today compared to normal?", options: [{text: "Normal / Low", score: 1}, {text: "Haven't noticed", score: 2}, {text: "Slightly elevated", score: 3}, {text: "Noticeably pounding", score: 4}] }
    ]
  },
  overtraining: {
    title: "Overtraining Risk",
    icon: HeartPulse,
    color: "#F97316",
    desc: "Strain vs. Recovery analysis",
    questions: [
      { q: "How many days have you trained at high intensity in the last 7 days without rest?", options: [{text: "0-2 days", score: 1}, {text: "3-4 days", score: 2}, {text: "5-6 days", score: 3}, {text: "7 days straight", score: 4}] },
      { q: "Has your workout performance or strength unexpectedly decreased recently?", options: [{text: "No, making progress", score: 1}, {text: "Plateaued", score: 2}, {text: "Slight decrease", score: 3}, {text: "Significant drop in performance", score: 4}] },
      { q: "Are you experiencing persistent minor aches, pains, or joint stiffness?", options: [{text: "No pain", score: 1}, {text: "Normal post-workout ache", score: 2}, {text: "Lingering joint stiffness", score: 3}, {text: "Sharp or persistent pain", score: 4}] },
      { q: "How has your appetite been over the last few days?", options: [{text: "Normal/Healthy", score: 1}, {text: "Slightly increased", score: 2}, {text: "Slightly decreased", score: 3}, {text: "Completely lost appetite", score: 4}] },
      { q: "How is your motivation to work out compared to your usual baseline?", options: [{text: "Highly motivated", score: 1}, {text: "Normal", score: 2}, {text: "Feeling it's a chore", score: 3}, {text: "Dreading the gym", score: 4}] }
    ]
  },
  burnout: {
    title: "Burnout Prediction",
    icon: TrendingDown,
    color: "#EF4444",
    desc: "Long-term systemic stress model",
    questions: [
      { q: "How often do you feel emotionally drained or exhausted by your daily responsibilities?", options: [{text: "Rarely", score: 1}, {text: "Sometimes", score: 2}, {text: "Frequently", score: 3}, {text: "Every single day", score: 4}] },
      { q: "Do you find yourself feeling increasingly cynical or detached from your work/activities?", options: [{text: "Not at all", score: 1}, {text: "Occasionally", score: 2}, {text: "Often", score: 3}, {text: "Completely detached", score: 4}] },
      { q: "How has your sleep quality been over the last 2-4 weeks?", options: [{text: "Consistently good", score: 1}, {text: "Hit or miss", score: 2}, {text: "Trouble falling/staying asleep", score: 3}, {text: "Chronic insomnia", score: 4}] },
      { q: "Do you feel a sense of reduced accomplishment or that your efforts don't matter?", options: [{text: "I feel accomplished", score: 1}, {text: "Sometimes doubt my impact", score: 2}, {text: "Often feel ineffective", score: 3}, {text: "Feel completely useless", score: 4}] },
      { q: "How frequently do you experience unexplained physical symptoms like headaches or stomach issues?", options: [{text: "Never", score: 1}, {text: "Rarely", score: 2}, {text: "A few times a week", score: 3}, {text: "Constantly", score: 4}] }
    ]
  }
};

export default function PredictiveInsightsPage() {
  const [activeQuiz, setActiveQuiz] = useState(null); 
  const [qIndex, setQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(false);

  const startQuiz = (type) => {
    setActiveQuiz(type);
    setQIndex(0);
    setUserAnswers([]);
  };

  const handleAnswer = async (opt) => {
    const questionText = QUIZ_DATA[activeQuiz].questions[qIndex].q;
    const newAnswers = [...userAnswers, { q: questionText, text: opt.text, score: opt.score }];
    
    if (qIndex < 4) {
      setUserAnswers(newAnswers);
      setQIndex(prev => prev + 1);
    } else {
      // Finished - Call AI Backend
      setLoading(true);
      try {
        const response = await api.post('/insights/analyze-quiz', {
          quizType: activeQuiz,
          answers: newAnswers
        });
        
        const aiResult = response.data.data;
        // Map Risk Level to Color
        const colorMap = {
          'Low Risk': '#14B8A6',
          'Moderate Risk': '#F97316',
          'High Risk': '#EF4444'
        };
        
        setResults(prev => ({ 
          ...prev, 
          [activeQuiz]: { 
            ...aiResult, 
            color: colorMap[aiResult.level] || '#9333EA' 
          } 
        }));
        setActiveQuiz(null);
      } catch (error) {
        console.error("AI Analysis failed:", error);
        // Fallback UI if needed, but the backend has a deterministic fallback too
      } finally {
        setLoading(false);
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
  };

  return (
    <div className="page-container" style={{ paddingBottom: '100px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: 30 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 16,
            background: 'linear-gradient(135deg, var(--c-purple), var(--c-blue))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', boxShadow: '0 8px 16px rgba(147, 51, 234, 0.2)'
          }}>
            <Brain size={24} />
          </div>
          <div>
            <h1 className="page-title" style={{ margin: 0, fontSize: 28 }}>Predictive Insights</h1>
            <p className="page-subtitle" style={{ margin: 0 }}>AI-Driven diagnostic assessments for your health trajectory.</p>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeQuiz ? (
          <motion.div
            key="quiz-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="glass-card"
            style={{ padding: '30px', borderTop: `4px solid ${QUIZ_DATA[activeQuiz].color}`, position: 'relative' }}
          >
            {loading && (
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(4px)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 10, borderRadius: 16 }}>
                <Loader2 className="animate-spin" size={40} color="var(--c-purple)" />
                <p style={{ marginTop: 12, fontWeight: 700, color: 'var(--c-text-primary)' }}>AI is analyzing your results...</p>
              </div>
            )}

            <button 
              disabled={loading}
              onClick={() => setActiveQuiz(null)}
              style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: 'var(--c-text-muted)', fontSize: 13, fontWeight: 700, cursor: loading ? 'default' : 'pointer', marginBottom: 24, padding: 0 }}
            >
              <ArrowLeft size={14} /> Back to Modules
            </button>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{QUIZ_DATA[activeQuiz].title}</h2>
              <div style={{ fontSize: 14, fontWeight: 800, color: QUIZ_DATA[activeQuiz].color }}>Question {qIndex + 1}/5</div>
            </div>
            
            <div style={{ height: 6, background: 'var(--c-bg-tertiary)', borderRadius: 3, marginBottom: 30, overflow: 'hidden' }}>
              <motion.div 
                initial={{ width: `${(qIndex / 5) * 100}%` }}
                animate={{ width: `${((qIndex + 1) / 5) * 100}%` }}
                style={{ height: '100%', background: QUIZ_DATA[activeQuiz].color, borderRadius: 3 }}
              />
            </div>

            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 30, lineHeight: 1.4 }}>
              {QUIZ_DATA[activeQuiz].questions[qIndex].q}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {QUIZ_DATA[activeQuiz].questions[qIndex].options.map((opt, i) => (
                <motion.button
                  key={i}
                  disabled={loading}
                  whileHover={loading ? {} : { scale: 1.01 }}
                  whileTap={loading ? {} : { scale: 0.99 }}
                  onClick={() => handleAnswer(opt)}
                  style={{
                    padding: '16px 20px', background: 'var(--c-bg-secondary)', border: '1px solid var(--c-border)',
                    borderRadius: 12, fontSize: 15, fontWeight: 600, color: 'var(--c-text-primary)',
                    textAlign: 'left', cursor: loading ? 'default' : 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    transition: 'border-color 0.2s ease, background 0.2s ease'
                  }}
                  onMouseOver={(e) => { if(!loading) { e.currentTarget.style.borderColor = QUIZ_DATA[activeQuiz].color; e.currentTarget.style.background = `${QUIZ_DATA[activeQuiz].color}0a`; } }}
                  onMouseOut={(e) => { if(!loading) { e.currentTarget.style.borderColor = 'var(--c-border)'; e.currentTarget.style.background = 'var(--c-bg-secondary)'; } }}
                >
                  {opt.text}
                  <ChevronRight size={16} color="var(--c-text-muted)" />
                </motion.button>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="list-view"
            variants={containerVariants} 
            initial="hidden" 
            animate="show"
            style={{ display: 'flex', flexDirection: 'column', gap: 20 }}
          >
            {Object.entries(QUIZ_DATA).map(([key, data]) => {
              const result = results[key];
              const displayColor = result ? result.color : data.color;
              const Icon = data.icon;
              
              return (
                <motion.div key={key} variants={itemVariants} className="glass-card" style={{ padding: 24, borderLeft: `4px solid ${displayColor}`, position: 'relative', overflow: 'hidden' }}>
                  <div style={{ position: 'absolute', top: -20, right: -20, opacity: 0.05, color: displayColor }}>
                    <Icon size={140} />
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: result ? 20 : 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                      <div style={{ padding: 12, background: `${displayColor}15`, borderRadius: 14, color: displayColor }}>
                        <Icon size={24} />
                      </div>
                      <div>
                        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 800 }}>{data.title}</h2>
                        <div style={{ fontSize: 13, color: 'var(--c-text-muted)', marginTop: 2 }}>{data.desc}</div>
                      </div>
                    </div>
                    
                    {!result ? (
                      <button 
                        onClick={() => startQuiz(key)}
                        style={{
                          background: `${data.color}15`, color: data.color, border: 'none', borderRadius: 20,
                          padding: '8px 16px', fontSize: 13, fontWeight: 800, cursor: 'pointer',
                          display: 'flex', alignItems: 'center', gap: 6, transition: 'transform 0.2s ease'
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                      >
                        <Sparkles size={14} /> Take Assessment
                      </button>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                        <div style={{ padding: '6px 14px', background: `${result.color}15`, color: result.color, borderRadius: 20, fontSize: 13, fontWeight: 800, textTransform: 'uppercase' }}>
                          {result.level}
                        </div>
                        <button 
                          onClick={() => startQuiz(key)}
                          style={{ background: 'none', border: 'none', color: 'var(--c-text-muted)', fontSize: 11, fontWeight: 700, marginTop: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
                        >
                          <RefreshCw size={10} /> Retake
                        </button>
                      </div>
                    )}
                  </div>

                  {result && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} style={{ background: 'var(--c-bg-tertiary)', borderRadius: 12, padding: 16 }}>
                      <h4 style={{ margin: '0 0 12px 0', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--c-text-muted)', fontWeight: 800 }}>AI Personalized Tips</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {result.tips.map((tip, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                            <CheckCircle2 size={16} color={result.color} style={{ flexShrink: 0, marginTop: 2 }} />
                            <span style={{ fontSize: 14, color: 'var(--c-text-secondary)', lineHeight: 1.5 }}>{tip}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
