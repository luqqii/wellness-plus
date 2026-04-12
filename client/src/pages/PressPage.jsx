import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ARTICLES = [
  { outlet: 'The New York Times', headline: '"Wellness+ is the rare diet app that doesn\'t feel like a diet app — because it isn\'t one."', date: 'March 2025' },
  { outlet: 'Forbes', headline: '"The psychology-first approach to weight loss that\'s disrupting a multi-billion dollar industry."', date: 'January 2025' },
  { outlet: "Women's Health", headline: '"We tried 12 weight loss apps. Wellness+ was the only one backed by actual cognitive science."', date: 'November 2024' },
  { outlet: 'Harvard Medical School Blog', headline: '"How habit stacking and CBT-based micro-lessons are redefining digital health."', date: 'September 2024' },
  { outlet: 'TechCrunch', headline: '"Wellness+ raises $100M Series C to scale its behavioral AI coaching platform."', date: 'August 2024' },
];

export default function PressPage() {
  const navigate = useNavigate();
  return (
    <div style={{ background: '#FFF3EB', minHeight: '100vh', color: '#0C2B35', fontFamily: '"Nunito", "Inter", sans-serif' }}>
      <nav style={{ padding: '0 5%', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E8DED8', background: '#FFFFFF' }}>
        <div style={{ fontSize: 26, fontWeight: 800, cursor: 'pointer' }} onClick={() => navigate('/')}>Wellness+</div>
        <button onClick={() => navigate('/signup')} className="btn" style={{ background: '#EC5A42', color: 'white', padding: '12px 28px', fontSize: 15, borderRadius: 999 }}>Get Started</button>
      </nav>

      <section style={{ padding: '100px 20px 80px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(40px, 8vw, 68px)', fontWeight: 900, letterSpacing: '-2px', marginBottom: 16 }}>Press & Media</h1>
        <p style={{ fontSize: 20, color: '#4A5568', maxWidth: 600, margin: '0 auto 16px' }}>What the world is saying about Wellness+.</p>
        <a href="mailto:press@wellnessplus.com" style={{ color: '#EC5A42', fontWeight: 700, fontSize: 16, textDecoration: 'none' }}>press@wellnessplus.com →</a>
      </section>

      <section style={{ maxWidth: 900, margin: '0 auto', padding: '20px 20px 100px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {ARTICLES.map((a, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            style={{ background: '#FFFFFF', borderRadius: 20, padding: 32, border: '1px solid #E8DED8', cursor: 'pointer' }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = '0 12px 30px rgba(0,0,0,0.07)'}
            onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
              <span style={{ fontSize: 16, fontWeight: 900, color: '#EC5A42' }}>{a.outlet}</span>
              <span style={{ fontSize: 13, color: '#718096', fontWeight: 600 }}>{a.date}</span>
            </div>
            <p style={{ fontSize: 20, fontWeight: 700, lineHeight: 1.4, color: '#0C2B35', fontStyle: 'italic' }}>{a.headline}</p>
          </motion.div>
        ))}
      </section>

      {/* Media Kit CTA */}
      <section style={{ background: '#0C2B35', padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 34, fontWeight: 900, color: '#FFFFFF', marginBottom: 16 }}>Need our brand assets?</h2>
        <p style={{ color: '#E8DED8', marginBottom: 30, fontSize: 17 }}>Download our official media kit with logos, screenshots, and approved messaging.</p>
        <button style={{ background: '#EC5A42', color: 'white', padding: '18px 48px', fontSize: 17, fontWeight: 800, borderRadius: 999, border: 'none', cursor: 'pointer' }}>
          Download Media Kit
        </button>
      </section>
    </div>
  );
}
