import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Plane, ShieldPlus, Globe, BookOpen, HeartPulse, Handshake } from 'lucide-react';
import PublicNavbar from '../components/layout/PublicNavbar';

const ROLES = [
  { dept: 'Engineering', title: 'Senior Mobile Engineer (React Native)', location: 'Remote', type: 'Full-Time' },
  { dept: 'Clinical', title: 'Lead Clinical Psychologist', location: 'Remote', type: 'Full-Time' },
  { dept: 'Nutrition', title: 'Registered Dietitian (RD)', location: 'New York, NY', type: 'Full-Time' },
  { dept: 'Engineering', title: 'Backend Engineer — Wearable Integrations', location: 'Remote', type: 'Full-Time' },
  { dept: 'Design', title: 'Senior Product Designer — Wellness Platform', location: 'Remote', type: 'Full-Time' },
  { dept: 'Science', title: 'Behavioral Scientist', location: 'Boston, MA', type: 'Full-Time' },
];

const PERKS = [
  { icon: Plane, title: 'Unlimited PTO', desc: 'We trust you to do great work and recharge when you need to.', color: '#4F8DFF' },
  { icon: ShieldPlus, title: 'Full Health Coverage', desc: 'Medical, dental, and vision for you and your dependents.', color: '#14B8A6' },
  { icon: Globe, title: 'Remote First', desc: 'Work from anywhere in the world. Seriously.', color: '#9F7AEA' },
  { icon: BookOpen, title: 'Learning Budget', desc: '$2,500 annual budget for courses, books, and conferences.', color: '#ED8936' },
  { icon: HeartPulse, title: 'Wellness Stipend', desc: 'Free Wellness+ subscription plus a monthly gym stipend.', color: '#E53E3E' },
  { icon: Handshake, title: 'Equity for Everyone', desc: 'Every full-time employee receives meaningful stock options.', color: '#38B2AC' },
];

const DEPTS = ['All', 'Engineering', 'Clinical', 'Nutrition', 'Design', 'Science'];

export default function CareersPage() {
  const navigate = useNavigate();
  const [activeDept, setActiveDept] = useState('All');
  const filtered = activeDept === 'All' ? ROLES : ROLES.filter(r => r.dept === activeDept);

  return (
    <div style={{ background: '#FFF3EB', minHeight: '100vh', color: '#0C2B35', fontFamily: '"Nunito", "Inter", sans-serif' }}>
      <PublicNavbar />

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
            {PERKS.map(p => {
              const Icon = p.icon;
              return (
                <div key={p.title} style={{ padding: 28, borderRadius: 20, border: '1px solid #E8DED8', background: '#FDFBF8' }}>
                  <div style={{ marginBottom: 16, display: 'inline-flex', padding: 12, borderRadius: 12, background: `${p.color}15` }}>
                    <Icon size={28} color={p.color} strokeWidth={2.5} />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>{p.title}</h3>
                  <p style={{ fontSize: 14, color: '#4A5568', lineHeight: 1.5 }}>{p.desc}</p>
                </div>
              );
            })}
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
