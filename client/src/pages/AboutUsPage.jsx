import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const STATS = [
  { val: '45M+', label: 'People helped' },
  { val: '60+', label: 'Countries reached' },
  { val: '98%', label: 'Would recommend' },
  { val: '10 min', label: 'A day is all it takes' },
];

const TEAM = [
  { name: 'Dr. Sarah Lee', role: 'Chief Clinical Officer', emoji: '👩‍⚕️' },
  { name: 'James Rivera', role: 'Head of AI & Engineering', emoji: '👨‍💻' },
  { name: 'Priya Mehta', role: 'Lead Behavioral Psychologist', emoji: '🧠' },
  { name: 'Carlos Ruiz', role: 'Director of Nutrition Science', emoji: '🥗' },
];

const TIMELINE = [
  { year: '2016', event: 'Founded with a mission to make psychological weight loss accessible to everyone.' },
  { year: '2018', event: 'Reached 1 million users. Launched the color-coded food system.' },
  { year: '2020', event: 'Published first peer-reviewed study on psychology-based weight loss.' },
  { year: '2022', event: 'Expanded to 60+ countries. Introduced AI coaching.' },
  { year: '2024', event: 'Wellness+ launched—the next evolution of science-backed wellness.' },
];

export default function AboutUsPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#FFF3EB', minHeight: '100vh', color: '#0C2B35', fontFamily: '"Nunito", "Inter", sans-serif' }}>
      <nav style={{ padding: '0 5%', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E8DED8', background: '#FFFFFF' }}>
        <div style={{ fontSize: 26, fontWeight: 800, cursor: 'pointer' }} onClick={() => navigate('/')}>Wellness+</div>
        <button onClick={() => navigate('/signup')} className="btn" style={{ background: '#EC5A42', color: 'white', padding: '12px 28px', fontSize: 15, borderRadius: 999 }}>Get Started</button>
      </nav>

      {/* Hero */}
      <section style={{ background: '#0C2B35', color: '#FFFFFF', padding: '120px 20px 100px', textAlign: 'center' }}>
        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 'clamp(40px, 8vw, 72px)', fontWeight: 900, letterSpacing: '-2px', marginBottom: 24, lineHeight: 1.1 }}>
          We're not a diet app.
        </motion.h1>
        <p style={{ fontSize: 22, color: '#E8DED8', maxWidth: 680, margin: '0 auto', lineHeight: 1.5 }}>
          Wellness+ is a psychology and science-based program that helps people build sustainable healthy habits — for good.
        </p>
      </section>

      {/* Stats */}
      <section style={{ background: '#FFFFFF', padding: '60px 20px', borderBottom: '1px solid #E8DED8' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 30, textAlign: 'center' }}>
          {STATS.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 48, fontWeight: 900, color: '#EC5A42', letterSpacing: '-1px' }}>{s.val}</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#4A5568', marginTop: 4 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 38, fontWeight: 900, marginBottom: 24, letterSpacing: '-1px' }}>Our Mission</h2>
        <p style={{ fontSize: 20, color: '#4A5568', lineHeight: 1.7 }}>
          We believe lasting health change doesn't come from willpower — it comes from understanding <em>why</em> you eat what you eat. Our team of scientists, psychologists, and engineers built Wellness+ to give everyone access to tools previously reserved for expensive therapy rooms.
        </p>
      </section>

      {/* Timeline */}
      <section style={{ background: '#FFFFFF', padding: '80px 20px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, textAlign: 'center', marginBottom: 50 }}>Our Story</h2>
          <div style={{ position: 'relative', paddingLeft: 40 }}>
            {/* vertical line */}
            <div style={{ position: 'absolute', left: 16, top: 0, bottom: 0, width: 2, background: '#E8DED8', borderRadius: 2 }} />
            {TIMELINE.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                style={{ marginBottom: 40, position: 'relative' }}>
                <div style={{ position: 'absolute', left: -32, width: 14, height: 14, borderRadius: '50%', background: '#EC5A42', border: '3px solid #FFFFFF', top: 4 }} />
                <div style={{ fontSize: 14, fontWeight: 800, color: '#EC5A42', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 6 }}>{t.year}</div>
                <div style={{ fontSize: 17, color: '#0C2B35', lineHeight: 1.5 }}>{t.event}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section style={{ padding: '60px 20px 100px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, textAlign: 'center', marginBottom: 50 }}>Meet the Team</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {TEAM.map(m => (
              <div key={m.name} style={{ background: '#FFFFFF', borderRadius: 20, padding: 30, textAlign: 'center', border: '1px solid #E8DED8' }}>
                <div style={{ fontSize: 54, marginBottom: 16 }}>{m.emoji}</div>
                <div style={{ fontSize: 17, fontWeight: 800, color: '#0C2B35', marginBottom: 6 }}>{m.name}</div>
                <div style={{ fontSize: 13, color: '#718096', fontWeight: 600 }}>{m.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section style={{ background: '#EC5A42', padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 40, fontWeight: 900, color: '#FFFFFF', marginBottom: 20 }}>Ready to join millions?</h2>
        <button onClick={() => navigate('/signup')} style={{ background: '#FFFFFF', color: '#EC5A42', padding: '18px 48px', fontSize: 18, fontWeight: 800, borderRadius: 999, border: 'none', cursor: 'pointer' }}>
          Start Your Free Trial
        </button>
      </section>
    </div>
  );
}
