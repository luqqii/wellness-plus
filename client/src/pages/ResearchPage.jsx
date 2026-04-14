import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import PublicNavbar from '../components/layout/PublicNavbar';

const STUDIES = [
  {
    title: 'Psychology-Based Weight Loss vs. Caloric Restriction: A 12-Month Comparative Study',
    journal: 'American Journal of Preventive Medicine',
    year: '2023',
    result: 'Participants using CBT-based behavior modification lost 2.3x more weight and maintained results after 12 months vs. calorie-restriction-only groups.',
    tag: 'Weight Loss'
  },
  {
    title: 'Habit Formation via Digital Micro-Learning: Sustained Engagement at 90 Days',
    journal: 'Journal of Behavioral Medicine',
    year: '2022',
    result: '10-minute daily psychological lessons drove 78% retention at 90 days vs. 34% in traditional app cohorts.',
    tag: 'Engagement'
  },
  {
    title: 'Color-Coded Caloric Density Systems: Reducing Decision Fatigue in Dietary Choices',
    journal: 'Obesity Reviews',
    year: '2021',
    result: 'Users with visual food categorization (Green/Yellow/Orange) reported 64% lower decision fatigue and improved diet quality scores at 6 weeks.',
    tag: 'Nutrition'
  },
  {
    title: 'AI Personalization in Behavioral Health: Outcomes Across 500,000 Users',
    journal: 'NPJ Digital Medicine',
    year: '2024',
    result: 'AI-personalized coaching nudges increased on-time lesson completion by 54% and improved 30-day weight loss outcomes by 1.8kg on average.',
    tag: 'AI & Tech'
  },
];

const PILLARS = [
  { icon: '🧠', title: 'Cognitive Behavioral Therapy (CBT)', desc: 'Our curriculum is co-designed with licensed clinical psychologists to help you identify and reframe negative thought patterns around food.' },
  { icon: '🔬', title: 'Evidence-Based Nutrition', desc: 'Our caloric density system is built on peer-reviewed macronutrient science, not trend diets.' },
  { icon: '📊', title: 'Behavioral Data & AI', desc: 'We analyze thousands of biometric and behavioral signals to personalize your learning curve and predict slip points before they happen.' },
];


export default function ResearchPage() {
  const navigate = useNavigate();
  return (
    <div style={{ background: '#FFF3EB', minHeight: '100vh', color: '#0C2B35', fontFamily: '"Nunito", "Inter", sans-serif' }}>
      <PublicNavbar />

      {/* Hero */}
      <section style={{ padding: '100px 20px 80px', textAlign: 'center', background: '#0C2B35', color: '#FFFFFF' }}>
        <h1 style={{ fontSize: 'clamp(40px, 7vw, 64px)', fontWeight: 900, letterSpacing: '-2px', marginBottom: 20 }}>Backed by Science. Proven by Millions.</h1>
        <p style={{ fontSize: 20, color: '#E8DED8', maxWidth: 680, margin: '0 auto' }}>Every feature in Wellness+ is grounded in published clinical research and behavioral psychology.</p>
      </section>

      {/* 3 Pillars */}
      <section style={{ padding: '80px 20px', background: '#FFFFFF', borderBottom: '1px solid #E8DED8' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: 34, fontWeight: 900, textAlign: 'center', marginBottom: 50 }}>The Science Behind Wellness+</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 30 }}>
            {PILLARS.map(p => (
              <div key={p.title} style={{ background: '#FDFBF8', padding: 32, borderRadius: 20, border: '1px solid #E8DED8' }}>
                <div style={{ fontSize: 44, marginBottom: 20 }}>{p.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 12 }}>{p.title}</h3>
                <p style={{ color: '#4A5568', lineHeight: 1.6, fontSize: 15 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Studies */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '80px 20px' }}>
        <h2 style={{ fontSize: 34, fontWeight: 900, marginBottom: 10 }}>Clinical Studies & Publications</h2>
        <p style={{ color: '#4A5568', marginBottom: 50, fontSize: 17 }}>A selection of peer-reviewed research informing our platform methodology.</p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {STUDIES.map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              style={{ background: '#FFFFFF', padding: 32, borderRadius: 20, border: '1px solid #E8DED8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <span style={{ background: '#F7EBE3', color: '#EC5A42', fontWeight: 700, fontSize: 12, padding: '4px 12px', borderRadius: 999 }}>{s.tag}</span>
                <span style={{ fontSize: 13, color: '#718096', fontWeight: 600 }}>{s.journal} · {s.year}</span>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 14, lineHeight: 1.4 }}>{s.title}</h3>
              <p style={{ color: '#4A5568', lineHeight: 1.6, fontSize: 15, borderLeft: '3px solid #EC5A42', paddingLeft: 16 }}>{s.result}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={{ background: '#EC5A42', padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 36, fontWeight: 900, color: '#FFFFFF', marginBottom: 20 }}>Put the science to work for you.</h2>
        <button onClick={() => navigate('/signup')} style={{ background: '#FFFFFF', color: '#EC5A42', padding: '18px 48px', fontSize: 18, fontWeight: 800, borderRadius: 999, border: 'none', cursor: 'pointer' }}>
          Start Free Trial
        </button>
      </section>
    </div>
  );
}
