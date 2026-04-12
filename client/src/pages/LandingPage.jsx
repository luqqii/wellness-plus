import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Brain, Zap, BarChart3, Sparkles, Shield, ChevronRight } from 'lucide-react';

const FEATURES = [
  { icon: Brain,    col: 'var(--c-purple)', title: 'AI Coaching',       desc: 'Personalized guidance adapting to your lifestyle in real time.' },
  { icon: Zap,      col: 'var(--c-orange)', title: 'Smart Habits',      desc: 'Context-aware tracking with streak motivation and nudges.' },
  { icon: BarChart3,col: 'var(--c-blue)',   title: 'Predictive Analytics', desc: 'Forecast burnout, recovery, and peak performance windows.' },
  { icon: Sparkles, col: 'var(--c-teal)',   title: 'Nutrition AI',      desc: 'Macro tracking with AI meal suggestions and photo logging.' },
];

const CHECKS = [
  '14M+ food database', 'AI coach available 24/7', 'Barcode scanning',
  'Apple Health & Fitbit sync', 'Weekly forecast reports', 'Emotion-aware guidance',
];

export default function LandingPage() {
  return (
    <div style={{ background: 'var(--c-bg-base)', minHeight: '100vh', color: 'var(--c-text-primary)' }}>
      {/* Nav */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px', height: 64,
        borderBottom: '1px solid var(--c-border)',
        background: 'rgba(10,11,15,0.8)', backdropFilter: 'blur(12px)',
        position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'linear-gradient(135deg, var(--c-blue), var(--c-purple))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: 'var(--shadow-glow-blue)',
          }}>
            <Sparkles size={16} color="white" />
          </div>
          <span style={{ fontSize: 18, fontWeight: 800, letterSpacing: '-0.5px' }}
            className="grad-blue-purple">Wellness+</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link to="/dashboard" style={{ fontSize: 14, color: 'var(--c-text-secondary)', textDecoration: 'none', fontWeight: 500, padding: '8px 12px', borderRadius: 8, transition: 'color 150ms' }}
            onMouseEnter={e => e.target.style.color = 'var(--c-text-primary)'}
            onMouseLeave={e => e.target.style.color = 'var(--c-text-secondary)'}
          >
            Log In
          </Link>
          <Link to="/dashboard" className="btn btn-primary" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6 }}>
            Get Started <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', padding: '100px 48px 80px', overflow: 'hidden' }}>
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />
        <div className="hero-grid" />

        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 999,
              border: '1px solid rgba(79,141,255,0.25)',
              background: 'rgba(79,141,255,0.08)',
              color: 'var(--c-blue)', fontSize: 13, fontWeight: 500,
              marginBottom: 28,
            }}>
              <Zap size={13} /> AI-Powered Health Optimization
            </div>

            <h1 style={{
              fontSize: 'clamp(40px, 6vw, 72px)',
              fontWeight: 900, lineHeight: 1.05,
              letterSpacing: '-2.5px',
              marginBottom: 22,
            }}>
              Your Personal{' '}
              <span className="grad-blue-purple">AI Health</span>
              <br />
              Optimization Coach
            </h1>

            <p style={{ fontSize: 18, color: 'var(--c-text-secondary)', maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}>
              Not just a tracker. A smart, adaptive coach that learns your patterns,
              predicts roadblocks, and delivers personalized plans in real time.
            </p>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <Link to="/dashboard" className="btn btn-primary btn-lg" style={{ textDecoration: 'none', gap: 8 }}>
                Start Your Journey <ArrowRight size={17} />
              </Link>
              <Link to="/coach" className="btn btn-secondary btn-lg" style={{ textDecoration: 'none', gap: 8 }}>
                <Brain size={17} /> Talk to AI Coach
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: '60px 48px', background: 'var(--c-bg-surface)' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-1px', marginBottom: 10 }}>
              Everything you need to <span className="grad-blue-purple">thrive</span>
            </h2>
            <p style={{ color: 'var(--c-text-secondary)', maxWidth: 440, margin: '0 auto' }}>
              Six powerful modules — all powered by AI that lives inside your data.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card"
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 14,
                    background: f.col + '18',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <f.icon size={20} color={f.col} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{f.title}</h3>
                    <p style={{ fontSize: 13, color: 'var(--c-text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 10, color: f.col, fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      Learn more <ChevronRight size={12} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Checklist section */}
      <section style={{ padding: '60px 48px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-1px', marginBottom: 32 }}>
            Everything you need to succeed
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, textAlign: 'left' }}>
            {CHECKS.map((c) => (
              <div key={c} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, background: 'var(--c-bg-surface)', border: '1px solid var(--c-border)' }}>
                <div style={{ width: 22, height: 22, borderRadius: '50%', background: 'var(--c-blue-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={13} color="var(--c-blue)" />
                </div>
                <span style={{ fontSize: 13, fontWeight: 500 }}>{c}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 48px', background: 'var(--c-bg-surface)' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}
        >
          <div className="glass-card" style={{ padding: '48px 40px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(79,141,255,0.05), rgba(155,109,255,0.05))', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginBottom: 20 }}>
                <Shield size={22} color="var(--c-blue)" />
                <BarChart3 size={22} color="var(--c-purple)" />
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 12 }}>
                Ready to transform your health?
              </h2>
              <p style={{ color: 'var(--c-text-secondary)', marginBottom: 24, lineHeight: 1.7 }}>
                Join thousands who improved their wellness score by 34% in 30 days.
              </p>
              <Link to="/dashboard" className="btn btn-primary btn-lg" style={{ textDecoration: 'none', gap: 8, display: 'inline-flex' }}>
                Get Started Free <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '24px 48px', borderTop: '1px solid var(--c-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 13, fontWeight: 700 }} className="grad-blue-purple">Wellness+</span>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms', 'API', 'Support'].map(l => (
            <a key={l} href="#" style={{ fontSize: 12, color: 'var(--c-text-muted)', textDecoration: 'none', transition: 'color 150ms' }}
              onMouseEnter={e => e.target.style.color = 'var(--c-text-primary)'}
              onMouseLeave={e => e.target.style.color = 'var(--c-text-muted)'}
            >{l}</a>
          ))}
        </div>
        <span style={{ fontSize: 12, color: 'var(--c-text-muted)' }}>© 2026 Wellness+</span>
      </footer>
    </div>
  );
}
