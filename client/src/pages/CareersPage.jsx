import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const ROLES = [
  { dept: 'Engineering', title: 'Senior Full-Stack Engineer (React / Node)', location: 'Remote', type: 'Full-Time' },
  { dept: 'Engineering', title: 'Machine Learning Engineer — Behavioral AI', location: 'Remote', type: 'Full-Time' },
  { dept: 'Psychology', title: 'Curriculum Designer — Cognitive Behavioral Therapy', location: 'New York, NY', type: 'Full-Time' },
  { dept: 'Marketing', title: 'Growth Marketing Lead — Paid Acquisition', location: 'Remote', type: 'Full-Time' },
  { dept: 'Design', title: 'Senior Product Designer — Mobile', location: 'Remote', type: 'Full-Time' },
  { dept: 'Science', title: 'Clinical Research Scientist', location: 'Boston, MA', type: 'Full-Time' },
];

const PERKS = [
  { emoji: '🏖️', title: 'Unlimited PTO', desc: 'We trust you to do great work and recharge when you need to.' },
  { emoji: '💊', title: 'Full Health Coverage', desc: 'Medical, dental, and vision for you and your dependents.' },
  { emoji: '🌍', title: 'Remote First', desc: 'Work from anywhere in the world. Seriously.' },
  { emoji: '📚', title: 'Learning Budget', desc: '$2,500 annual budget for courses, books, and conferences.' },
  { emoji: '🧘', title: 'Wellness Stipend', desc: 'Free Wellness+ subscription plus a monthly gym stipend.' },
  { emoji: '🤝', title: 'Equity for Everyone', desc: 'Every full-time employee receives meaningful stock options.' },
];

const DEPTS = ['All', 'Engineering', 'Psychology', 'Marketing', 'Design', 'Science'];

export default function CareersPage() {
  const navigate = useNavigate();
  const [activeDept, setActiveDept] = useState('All');
  const filtered = activeDept === 'All' ? ROLES : ROLES.filter(r => r.dept === activeDept);

  return (
    <div style={{ background: '#FFF3EB', minHeight: '100vh', color: '#0C2B35', fontFamily: '"Nunito", "Inter", sans-serif' }}>
      <nav style={{ padding: '0 5%', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E8DED8', background: '#FFFFFF' }}>
        <div style={{ fontSize: 26, fontWeight: 800, cursor: 'pointer' }} onClick={() => navigate('/')}>Wellness+</div>
        <button onClick={() => navigate('/signup')} className="btn" style={{ background: '#EC5A42', color: 'white', padding: '12px 28px', fontSize: 15, borderRadius: 999 }}>Get Started</button>
      </nav>

      {/* Hero */}
      <section style={{ padding: '100px 20px 80px', textAlign: 'center', background: '#0C2B35' }}>
        <h1 style={{ fontSize: 'clamp(40px, 8vw, 68px)', fontWeight: 900, letterSpacing: '-2px', color: '#FFFFFF', marginBottom: 20 }}>
          Build the future of health.
        </h1>
        <p style={{ fontSize: 20, color: '#E8DED8', maxWidth: 620, margin: '0 auto' }}>
          Wellness+ is on a mission to help millions of people live healthier lives. Join a team of scientists, engineers, and psychologists who are rewriting what wellness technology looks like.
        </p>
      </section>

      {/* Perks */}
      <section style={{ background: '#FFFFFF', padding: '80px 20px', borderBottom: '1px solid #E8DED8' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: 34, fontWeight: 900, textAlign: 'center', marginBottom: 50 }}>Why Wellness+?</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {PERKS.map(p => (
              <div key={p.title} style={{ padding: 28, borderRadius: 20, border: '1px solid #E8DED8', background: '#FDFBF8' }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>{p.emoji}</div>
                <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: '#4A5568', lineHeight: 1.5 }}>{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section style={{ maxWidth: 900, margin: '0 auto', padding: '80px 20px' }}>
        <h2 style={{ fontSize: 34, fontWeight: 900, marginBottom: 30 }}>Open Positions</h2>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}>
          {DEPTS.map(d => (
            <button key={d} onClick={() => setActiveDept(d)} style={{
              padding: '8px 20px', borderRadius: 999, border: `2px solid ${activeDept === d ? '#EC5A42' : '#E8DED8'}`,
              background: activeDept === d ? '#EC5A42' : '#FFFFFF', color: activeDept === d ? '#FFFFFF' : '#0C2B35',
              fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 150ms ease'
            }}>{d}</button>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map((r, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              style={{ background: '#FFFFFF', padding: '24px 28px', borderRadius: 18, border: '2px solid #E8DED8', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#EC5A42'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#E8DED8'}
            >
              <div>
                <span style={{ fontSize: 12, background: '#F7EBE3', color: '#EC5A42', fontWeight: 700, padding: '3px 10px', borderRadius: 999, marginBottom: 8, display: 'inline-block' }}>{r.dept}</span>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: '4px 0' }}>{r.title}</h3>
                <div style={{ fontSize: 14, color: '#718096', fontWeight: 600 }}>{r.location} · {r.type}</div>
              </div>
              <div style={{ color: '#EC5A42', fontWeight: 800, fontSize: 15 }}>Apply →</div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
