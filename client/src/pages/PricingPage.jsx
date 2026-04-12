import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Star, Shield, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PLANS = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$16',
    period: '/month',
    billing: 'Billed monthly',
    popular: false,
  },
  {
    id: 'annual',
    name: 'Annual',
    price: '$9',
    period: '/month',
    billing: 'Billed $108 annually — save 44%',
    popular: true,
    badge: 'Most Popular',
  },
  {
    id: 'med',
    name: 'Wellness+ Med',
    price: '$49',
    period: '/month',
    billing: 'Includes GLP-1 consultation + support',
    popular: false,
    badge: 'New',
    isSpecial: true,
  }
];

const FEATURES = [
  { label: 'Personalized psychology curriculum', monthly: true, annual: true, med: true },
  { label: 'Unlimited AI Coach access', monthly: true, annual: true, med: true },
  { label: 'Color-coded food logging', monthly: true, annual: true, med: true },
  { label: 'Weight Tracker + goal projections', monthly: true, annual: true, med: true },
  { label: 'Habit tracking & streaks', monthly: true, annual: true, med: true },
  { label: 'Meal Planner + 1000+ recipes', monthly: false, annual: true, med: true },
  { label: 'Weekly Group Coaching Sessions', monthly: false, annual: true, med: true },
  { label: 'Priority AI response time', monthly: false, annual: true, med: true },
  { label: 'Medication consultation (GLP-1)', monthly: false, annual: false, med: true },
  { label: 'Licensed physician access', monthly: false, annual: false, med: true },
  { label: 'Lab order management', monthly: false, annual: false, med: true },
];

const TESTIMONIALS = [
  { name: 'Sarah M.', result: '28 lbs lost in 5 months', quote: 'The psychology lessons changed how I think about food completely.', emoji: '⭐⭐⭐⭐⭐' },
  { name: 'James R.', result: '40 lbs lost in 8 months', quote: 'I tried every diet in the book. Wellness+ is different — it works because it targets the root cause.', emoji: '⭐⭐⭐⭐⭐' },
  { name: 'Priya K.', result: '15 lbs lost in 3 months', quote: 'The AI Coach is like having a therapist and nutritionist in my pocket.', emoji: '⭐⭐⭐⭐⭐' },
];

export default function PricingPage() {
  const [selected, setSelected] = useState('annual');
  const navigate = useNavigate();

  return (
    <div style={{ background: '#FFF3EB', minHeight: '100vh', color: '#0C2B35', fontFamily: '"Nunito", "Inter", sans-serif' }}>
      <nav style={{ padding: '0 5%', height: 80, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #E8DED8', background: '#FFFFFF' }}>
        <div style={{ fontSize: 26, fontWeight: 800, cursor: 'pointer' }} onClick={() => navigate('/')}>Wellness+</div>
        <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', fontWeight: 700, fontSize: 15, color: '#0C2B35', cursor: 'pointer' }}>Log In</button>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '80px 20px 60px' }}>
        <div style={{ display: 'inline-block', background: '#F9E4E1', color: '#EC5A42', fontWeight: 800, fontSize: 13, padding: '6px 18px', borderRadius: 999, marginBottom: 20 }}>Limited Time Offer — Save 44%</div>
        <h1 style={{ fontSize: 'clamp(40px, 7vw, 60px)', fontWeight: 900, letterSpacing: '-2px', marginBottom: 16, lineHeight: 1.1 }}>
          Start your Wellness+ journey today.
        </h1>
        <p style={{ fontSize: 20, color: '#4A5568', maxWidth: 600, margin: '0 auto' }}>
          Join over 45 million people who have transformed their health through psychology, not willpower.
        </p>
      </section>

      {/* Plans */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '0 20px 80px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 60 }}>
          {PLANS.map(plan => (
            <motion.div key={plan.id} whileHover={{ y: -4 }} transition={{ duration: 0.2 }}
              onClick={() => setSelected(plan.id)}
              style={{
                background: selected === plan.id ? '#0C2B35' : '#FFFFFF',
                borderRadius: 24, padding: 32, border: `2px solid ${selected === plan.id ? '#0C2B35' : plan.isSpecial ? '#EC5A42' : '#E8DED8'}`,
                cursor: 'pointer', position: 'relative', transition: 'all 200ms ease'
              }}>
              {plan.badge && (
                <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: plan.isSpecial ? '#EC5A42' : '#0C2B35', color: 'white', fontWeight: 800, fontSize: 12, padding: '4px 14px', borderRadius: 999, whiteSpace: 'nowrap' }}>
                  {plan.badge}
                </div>
              )}
              <h3 style={{ fontSize: 18, fontWeight: 900, color: selected === plan.id ? '#FFFFFF' : '#0C2B35', marginBottom: 16 }}>{plan.name}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                <span style={{ fontSize: 48, fontWeight: 900, color: selected === plan.id ? '#FFFFFF' : '#EC5A42', lineHeight: 1 }}>{plan.price}</span>
                <span style={{ fontSize: 18, color: selected === plan.id ? '#9CA3AF' : '#718096' }}>{plan.period}</span>
              </div>
              <div style={{ fontSize: 13, color: selected === plan.id ? '#9CA3AF' : '#718096', marginBottom: 24, fontWeight: 600 }}>{plan.billing}</div>
              <button onClick={(e) => { e.stopPropagation(); navigate('/signup'); }}
                style={{ width: '100%', padding: '14px', background: selected === plan.id ? '#EC5A42' : plan.isSpecial ? '#EC5A42' : '#0C2B35', color: 'white', border: 'none', borderRadius: 999, fontWeight: 800, fontSize: 16, cursor: 'pointer' }}>
                Get Started
              </button>
            </motion.div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div style={{ background: '#FFFFFF', borderRadius: 24, overflow: 'hidden', border: '1px solid #E8DED8' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 100px', background: '#0C2B35', padding: '16px 24px', color: '#FFFFFF', fontWeight: 800, fontSize: 14 }}>
            <div>Feature</div>
            {PLANS.map(p => <div key={p.id} style={{ textAlign: 'center' }}>{p.name.split(' ')[0]}</div>)}
          </div>
          {FEATURES.map((f, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 80px 100px', padding: '14px 24px', background: i % 2 === 0 ? '#FFFFFF' : '#FDFBF8', borderBottom: '1px solid #F0EAE2' }}>
              <div style={{ fontSize: 14, color: '#0C2B35', fontWeight: 600 }}>{f.label}</div>
              {['monthly', 'annual', 'med'].map(k => (
                <div key={k} style={{ textAlign: 'center' }}>
                  {f[k]
                    ? <Check size={18} color="#14B8A6" strokeWidth={3} style={{ margin: '0 auto' }} />
                    : <span style={{ fontSize: 18, color: '#E8DED8' }}>–</span>}
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ background: '#FFFFFF', padding: '80px 20px', borderTop: '1px solid #E8DED8' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <h2 style={{ fontSize: 36, fontWeight: 900, textAlign: 'center', marginBottom: 50 }}>Real people. Real results.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 24 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: '#FDFBF8', borderRadius: 20, padding: 28, border: '1px solid #E8DED8' }}>
                <div style={{ fontSize: 18, marginBottom: 12 }}>{t.emoji}</div>
                <p style={{ fontSize: 16, color: '#0C2B35', fontWeight: 600, lineHeight: 1.5, fontStyle: 'italic', marginBottom: 16 }}>"{t.quote}"</p>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0C2B35' }}>{t.name}</div>
                <div style={{ fontSize: 13, color: '#EC5A42', fontWeight: 700, marginTop: 4 }}>{t.result}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ background: '#EC5A42', padding: '80px 20px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 40, fontWeight: 900, color: '#FFFFFF', marginBottom: 20 }}>Your best health starts today.</h2>
        <button onClick={() => navigate('/signup')} style={{ background: '#FFFFFF', color: '#EC5A42', padding: '18px 48px', fontSize: 18, fontWeight: 900, borderRadius: 999, border: 'none', cursor: 'pointer' }}>
          Start Free Trial
        </button>
        <p style={{ color: 'rgba(255,255,255,0.7)', marginTop: 16, fontSize: 14 }}>No credit card required · Cancel anytime</p>
      </section>
    </div>
  );
}
