import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, ShieldPlus, Globe, BookOpen, HeartPulse, Handshake, X, Send, CheckCircle } from 'lucide-react';
import PublicNavbar from '../components/layout/PublicNavbar';

const ROLES = [
  { dept: 'Clinical', title: 'Lead Clinical Psychologist', location: 'Remote', type: 'Full-Time', desc: 'Guide the development of our evidence-based CBT curriculum and oversee clinical protocols for behavioral health interventions.' },
  { dept: 'Nutrition', title: 'Registered Dietitian (RD)', location: 'New York, NY', type: 'Full-Time', desc: 'Design personalized macro and nutrition plans within the platform and review AI-generated dietary recommendations for accuracy.' },
  { dept: 'Science', title: 'Behavioral Scientist', location: 'Boston, MA', type: 'Full-Time', desc: 'Research and translate behavioral psychology findings into actionable product features that drive lasting habit change.' },
  { dept: 'Clinical', title: 'Licensed Therapist (Online)', location: 'Remote', type: 'Part-Time', desc: 'Provide 1-on-1 mental wellness coaching sessions to Wellness+ Premium members through our integrated telehealth platform.' },
  { dept: 'Design', title: 'Senior Product Designer — Health UX', location: 'Remote', type: 'Full-Time', desc: 'Lead the design of health dashboards, onboarding flows, and data visualizations that make wellness data beautiful and actionable.' },
  { dept: 'Nutrition', title: 'Sports Nutrition Specialist', location: 'Remote', type: 'Full-Time', desc: 'Develop athletic performance nutrition programs and recovery protocols for our high-performance user segment.' },
];

const PERKS = [
  { icon: Plane,      title: 'Unlimited PTO',       desc: 'We trust you to do great work and recharge when you need to.',           color: '#4F8DFF' },
  { icon: ShieldPlus, title: 'Full Health Coverage', desc: 'Medical, dental, and vision for you and your dependents.',               color: '#14B8A6' },
  { icon: Globe,      title: 'Remote First',         desc: 'Work from anywhere in the world. Seriously.',                           color: '#9F7AEA' },
  { icon: BookOpen,   title: 'Learning Budget',      desc: '$2,500 annual budget for courses, books, and conferences.',              color: '#ED8936' },
  { icon: HeartPulse, title: 'Wellness Stipend',     desc: 'Free Wellness+ subscription plus a monthly gym stipend.',               color: '#E53E3E' },
  { icon: Handshake,  title: 'Equity for Everyone',  desc: 'Every full-time employee receives meaningful stock options.',            color: '#38B2AC' },
];

const DEPTS = ['All', 'Clinical', 'Nutrition', 'Science', 'Design'];

function ApplyModal({ role, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, padding: '20px',
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#FFFFFF', borderRadius: 24, padding: 36,
          maxWidth: 520, width: '100%', position: 'relative',
          boxShadow: '0 32px 80px rgba(0,0,0,0.2)',
        }}
      >
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: 20, right: 20, background: '#F5F3EF', border: 'none', borderRadius: '50%', width: 36, height: 36, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <X size={18} color="#4A5568" />
        </button>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <CheckCircle size={56} color="#14B8A6" style={{ marginBottom: 16 }} />
            <h3 style={{ fontSize: 24, fontWeight: 900, color: '#0C2B35', marginBottom: 8 }}>Application Sent!</h3>
            <p style={{ fontSize: 15, color: '#4A5568', lineHeight: 1.6, marginBottom: 24 }}>
              Thank you, <strong>{form.name}</strong>! We'll review your application for <strong>{role.title}</strong> and reach out within 5 business days.
            </p>
            <button onClick={onClose} style={{ background: '#EC5A42', color: '#FFF', border: 'none', borderRadius: 12, padding: '14px 32px', fontWeight: 800, fontSize: 15, cursor: 'pointer' }}>
              Close
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 24 }}>
              <span style={{ fontSize: 12, background: '#F7EBE3', color: '#EC5A42', fontWeight: 700, padding: '3px 10px', borderRadius: 999, display: 'inline-block', marginBottom: 10 }}>{role.dept}</span>
              <h3 style={{ fontSize: 22, fontWeight: 900, color: '#0C2B35', marginBottom: 4 }}>{role.title}</h3>
              <p style={{ fontSize: 13, color: '#718096', fontWeight: 600 }}>{role.location} · {role.type}</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#0C2B35', display: 'block', marginBottom: 6 }}>Full Name *</label>
                <input
                  required value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Dr. Jane Smith"
                  style={{ width: '100%', border: '2px solid #E8DED8', borderRadius: 12, padding: '12px 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = '#EC5A42'}
                  onBlur={e => e.target.style.borderColor = '#E8DED8'}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#0C2B35', display: 'block', marginBottom: 6 }}>Email *</label>
                <input
                  required type="email" value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  style={{ width: '100%', border: '2px solid #E8DED8', borderRadius: 12, padding: '12px 16px', fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = '#EC5A42'}
                  onBlur={e => e.target.style.borderColor = '#E8DED8'}
                />
              </div>
              <div>
                <label style={{ fontSize: 13, fontWeight: 700, color: '#0C2B35', display: 'block', marginBottom: 6 }}>Why Wellness+? (optional)</label>
                <textarea
                  rows={3} value={form.message}
                  onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us why you're excited about this role..."
                  style={{ width: '100%', border: '2px solid #E8DED8', borderRadius: 12, padding: '12px 16px', fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  onFocus={e => e.target.style.borderColor = '#EC5A42'}
                  onBlur={e => e.target.style.borderColor = '#E8DED8'}
                />
              </div>
              <button
                type="submit" disabled={loading}
                style={{
                  background: loading ? '#E8DED8' : '#EC5A42', color: '#FFF',
                  border: 'none', borderRadius: 12, padding: '15px 0',
                  fontWeight: 800, fontSize: 16, cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  transition: 'background 150ms ease',
                }}
              >
                <Send size={18} /> {loading ? 'Sending...' : 'Submit Application'}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

export default function CareersPage() {
  const [activeDept, setActiveDept] = useState('All');
  const [applyingTo, setApplyingTo] = useState(null);
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
          Wellness+ is on a mission to help millions of people live healthier lives. Join a team of clinicians, scientists, and designers who are rewriting what wellness technology looks like.
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
              style={{ background: '#FFFFFF', padding: '24px 28px', borderRadius: 18, border: '2px solid #E8DED8', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, transition: 'border-color 150ms ease' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = '#EC5A42'}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#E8DED8'}
            >
              <div style={{ flex: 1 }}>
                <span style={{ fontSize: 12, background: '#F7EBE3', color: '#EC5A42', fontWeight: 700, padding: '3px 10px', borderRadius: 999, marginBottom: 8, display: 'inline-block' }}>{r.dept}</span>
                <h3 style={{ fontSize: 18, fontWeight: 800, margin: '4px 0' }}>{r.title}</h3>
                <div style={{ fontSize: 14, color: '#718096', fontWeight: 600, marginBottom: 8 }}>{r.location} · {r.type}</div>
                <p style={{ fontSize: 13, color: '#4A5568', lineHeight: 1.5, margin: 0 }}>{r.desc}</p>
              </div>
              <button
                onClick={() => setApplyingTo(r)}
                style={{
                  background: '#EC5A42', color: '#FFF', border: 'none',
                  borderRadius: 10, padding: '10px 22px',
                  fontWeight: 800, fontSize: 14, cursor: 'pointer',
                  whiteSpace: 'nowrap', transition: 'background 150ms ease', flexShrink: 0,
                }}
                onMouseEnter={e => e.target.style.background = '#D94B34'}
                onMouseLeave={e => e.target.style.background = '#EC5A42'}
              >
                Apply →
              </button>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Apply Modal */}
      <AnimatePresence>
        {applyingTo && <ApplyModal role={applyingTo} onClose={() => setApplyingTo(null)} />}
      </AnimatePresence>
    </div>
  );
}
