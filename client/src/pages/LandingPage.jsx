import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { ArrowRight, ChevronDown, Star, Check, Brain, Utensils, Users, BookOpen, Scale, Heart } from 'lucide-react';

/* ─── Free Tools dropdown items ─── */
const FREE_TOOLS_ITEMS = [
  { label: 'BMI Calculator',                href: '/bmi-calculator',             desc: 'Find your body mass index' },
  { label: 'Macro Calculator',              href: '/macro-calculator',           desc: 'Protein, carb & fat targets' },
  { label: 'Calorie Deficit Calculator',    href: '/calorie-deficit-calculator', desc: 'Daily calorie goal' },
  { label: 'Weight Loss Personality Quiz',  href: '/personality-quiz',           desc: 'Discover your eating style' },
  { label: 'Food Color Guide',              href: '/food-guide',                 desc: 'Green / Yellow / Orange system' },
];

/* ─── Dropdown using React state (fixes the cursor-gap bug) ─── */
function FreeToolsDropdown({ isAuthenticated }) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);

  const show = () => { clearTimeout(timerRef.current); setOpen(true); };
  const hide = () => { timerRef.current = setTimeout(() => setOpen(false), 120); };

  return (
    <div
      style={{ position: 'relative' }}
      onMouseEnter={show}
      onMouseLeave={hide}
    >
      {/* Trigger */}
      <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, fontSize: 15, color: '#0C2B35', fontFamily: 'inherit', padding: '4px 0' }}>
        Free Tools <ChevronDown size={14} style={{ transition: 'transform 200ms', transform: open ? 'rotate(180deg)' : 'rotate(0)' }} />
      </button>

      {/* Invisible bridge — fills gap between trigger and panel */}
      {open && (
        <div style={{ position: 'absolute', top: 20, left: -20, width: 340, height: 20, zIndex: 999 }} />
      )}

      {/* Dropdown panel */}
      {open && (
        <div
          onMouseEnter={show}
          onMouseLeave={hide}
          style={{
            position: 'absolute', top: 40, left: -20, width: 320,
            background: '#FFFFFF', borderRadius: 18, boxShadow: '0 16px 48px rgba(0,0,0,0.12)',
            border: '1px solid #E8DED8', padding: '10px 8px', zIndex: 1000,
            animation: 'fadeSlideDown 150ms ease'
          }}
        >
          <style>{`@keyframes fadeSlideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }`}</style>
          {FREE_TOOLS_ITEMS.map(item => (
            <Link key={item.href} to={item.href} onClick={() => setOpen(false)}
              style={{ display: 'flex', flexDirection: 'column', gap: 2, padding: '10px 14px', borderRadius: 12, textDecoration: 'none', transition: 'background 120ms ease' }}
              onMouseEnter={e => e.currentTarget.style.background = '#FFF3EB'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0C2B35' }}>{item.label}</span>
              <span style={{ fontSize: 12, color: '#9CA3AF' }}>{item.desc}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─── Main Landing Page ─── */
export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [sliderVal, setSliderVal] = useState(15);
  const [scrolled, setScrolled] = useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ background: '#FFF3EB', minHeight: '100vh', color: '#0C2B35', fontFamily: '"Nunito", "Inter", sans-serif' }}>

      {/* ── Sticky Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
        height: 72,
        background: scrolled ? 'rgba(255,243,235,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid #E8DED8' : '1px solid transparent',
        boxShadow: scrolled ? '0 2px 12px rgba(0,0,0,0.04)' : 'none',
        transition: 'all 300ms ease',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 5%',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#EC5A42' }} />
          <span style={{ fontSize: 22, fontWeight: 900, color: '#0C2B35', letterSpacing: '-0.5px' }}>Wellness+</span>
        </Link>

        {/* Center links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <Link to="/weight-loss" style={{ textDecoration: 'none', color: '#0C2B35', fontWeight: 700, fontSize: 15 }}>Weight Loss</Link>
          <FreeToolsDropdown isAuthenticated={isAuthenticated} />
          <Link to="/pricing" style={{ textDecoration: 'none', color: '#0C2B35', fontWeight: 700, fontSize: 15 }}>Pricing</Link>
          <Link to="/research" style={{ textDecoration: 'none', color: '#0C2B35', fontWeight: 700, fontSize: 15 }}>Research</Link>
          <Link to="/about" style={{ textDecoration: 'none', color: '#0C2B35', fontWeight: 700, fontSize: 15 }}>About</Link>
        </div>

        {/* Right CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {isAuthenticated ? (
            <Link to="/dashboard" style={{ background: '#EC5A42', color: 'white', padding: '10px 24px', borderRadius: 999, textDecoration: 'none', fontWeight: 800, fontSize: 15 }}>Dashboard</Link>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none', color: '#0C2B35', fontWeight: 700, fontSize: 15 }}>Log In</Link>
              <Link to="/signup" style={{ background: '#EC5A42', color: 'white', padding: '10px 24px', borderRadius: 999, textDecoration: 'none', fontWeight: 800, fontSize: 15 }}>Get Started</Link>
            </>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ paddingTop: 160, paddingBottom: 100, paddingLeft: 20, paddingRight: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#FFFFFF', border: '1px solid #E8DED8', borderRadius: 999, padding: '6px 16px', marginBottom: 28, fontSize: 13, fontWeight: 700, color: '#EC5A42' }}>
          ⭐ Over 45 million people trust Wellness+
        </div>

        <h1 style={{ fontSize: 'clamp(48px, 8vw, 80px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 24, color: '#0C2B35', maxWidth: 820 }}>
          Stop dieting.<br />Get lifelong results.
        </h1>
        <p style={{ fontSize: 22, color: '#718096', maxWidth: 580, marginBottom: 64, lineHeight: 1.5, fontWeight: 500 }}>
          Build sustainable habits with our psychology-based program — no meal plans, no calorie obsession.
        </p>

        {/* Slider Card */}
        <div style={{ background: '#FFFFFF', padding: 'clamp(28px, 5vw, 48px) clamp(24px, 5vw, 44px)', borderRadius: 28, boxShadow: '0 24px 60px rgba(0,0,0,0.08)', width: '100%', maxWidth: 520 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 36, color: '#0C2B35' }}>How much weight do you want to lose?</h2>
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 76, fontWeight: 900, color: '#EC5A42', lineHeight: 1, marginBottom: 24 }}>
              {sliderVal} <span style={{ fontSize: 28, color: '#0C2B35', fontWeight: 700 }}>kg</span>
            </div>
            <input type="range" className="noom-slider" min="1" max="50" value={sliderVal} onChange={e => setSliderVal(e.target.value)} />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10, fontSize: 13, color: '#9CA3AF', fontWeight: 600 }}>
              <span>Not sure</span><span>A lot</span>
            </div>
          </div>
          <button onClick={() => navigate('/signup')}
            style={{ background: '#EC5A42', color: 'white', width: '100%', padding: '18px', borderRadius: 999, fontSize: 19, fontWeight: 900, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 24px rgba(236,90,66,0.28)', transition: 'transform 150ms ease, box-shadow 150ms ease' }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(236,90,66,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(236,90,66,0.28)'; }}>
            Get My Plan <ArrowRight size={22} strokeWidth={3} />
          </button>
          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#9CA3AF', fontWeight: 600 }}>Takes 2 minutes · No credit card required</p>
        </div>
      </section>

      {/* ── AS SEEN IN ── */}
      <section style={{ background: '#FFFFFF', padding: '36px 5%', borderTop: '1px solid #E8DED8', borderBottom: '1px solid #E8DED8' }}>
        <p style={{ textAlign: 'center', fontSize: 12, letterSpacing: '2.5px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 24 }}>As seen in</p>
        <div style={{ display: 'flex', gap: 48, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}>
          {['The New York Times', 'Forbes', "Women's Health", 'TIME', 'Harvard Health'].map(b => (
            <span key={b} style={{ fontSize: 18, fontWeight: 900, color: '#CBD5E0', letterSpacing: '-0.5px' }}>{b}</span>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section style={{ padding: '80px 5%', background: '#FFF3EB' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 40, textAlign: 'center' }}>
          {[
            { stat: '45M+', label: 'People enrolled' },
            { stat: '78%',  label: 'Keep weight off after 1 year' },
            { stat: '16 lbs', label: 'Average weight lost in 16 weeks' },
            { stat: '3.7×', label: 'More effective than dieting alone' },
          ].map(({ stat, label }) => (
            <div key={stat}>
              <div style={{ fontSize: 52, fontWeight: 900, color: '#EC5A42', lineHeight: 1.1, letterSpacing: '-2px' }}>{stat}</div>
              <div style={{ fontSize: 16, color: '#4A5568', fontWeight: 600, marginTop: 8 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ padding: '80px 5%', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 900, textAlign: 'center', letterSpacing: '-1.5px', marginBottom: 20 }}>How Wellness+ works</h2>
          <p style={{ textAlign: 'center', fontSize: 18, color: '#718096', marginBottom: 60, maxWidth: 560, margin: '0 auto 60px' }}>
            A psychology-based system that changes your relationship with food — not just what you eat.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 28 }}>
            {[
              { icon: Brain,   color: '#EC5A42', title: 'Understand Your Brain', body: 'Learn why you eat the way you do using Cognitive Behavioral Therapy (CBT) — the same technique used by leading psychologists.' },
              { icon: Utensils, color: '#14B8A6', title: 'Eat Without Restriction', body: 'No foods are off-limits. Our color-coded density system (Green/Yellow/Orange) teaches you to make smarter choices naturally.' },
              { icon: BookOpen, color: '#8B5CF6', title: 'Daily Psychology Lessons', body: '10-minute daily lessons that build long-term habit change through behavioural science.' },
              { icon: Users,    color: '#EAB308', title: 'Live Group Coaching', body: 'Weekly group sessions with certified health coaches who hold you accountable and celebrate your wins.' },
              { icon: Scale,    color: '#22C55E', title: 'Track Real Progress', body: 'Log your weight, food, and habits. See the trends that actually matter to long-term success.' },
              { icon: Heart,    color: '#EC5A42', title: 'Daily Check-ins', body: 'A 60-second daily mood and hunger check-in builds the self-awareness that drives lasting change.' },
            ].map(({ icon: Icon, color, title, body }) => (
              <div key={title} style={{ background: '#FDFBF8', border: '1px solid #E8DED8', borderRadius: 24, padding: 28 }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.07)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: `${color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
                  <Icon size={24} color={color} />
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0C2B35', marginBottom: 10 }}>{title}</h3>
                <p style={{ fontSize: 15, color: '#4A5568', lineHeight: 1.6 }}>{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '80px 5%', background: '#FFF3EB' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, textAlign: 'center', letterSpacing: '-1px', marginBottom: 16 }}>Real people. Real results.</h2>
          <p style={{ textAlign: 'center', fontSize: 17, color: '#718096', marginBottom: 52 }}>Join millions who've transformed their health — not just their weight.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {[
              { name: 'Sarah M., 34', result: '–28 lbs in 5 months', quote: 'I stopped obsessing over calories for the first time in 10 years. The psychology lessons changed everything.', stars: 5 },
              { name: 'James R., 41', result: '–40 lbs in 8 months', quote: "Every other app counted calories. Wellness+ changed how I think about food. That\u2019s why it actually worked.", stars: 5 },
              { name: 'Priya K., 29', result: '–15 lbs in 3 months', quote: 'The AI Coach is like having a nutritionist and therapist in my pocket 24/7. Absolutely worth it.', stars: 5 },
              { name: 'David L., 52', result: '–22 lbs in 4 months', quote: "I\u2019ve tried everything. This is the first program that addresses WHY I overeat, not just the food itself.", stars: 5 },
            ].map(t => (
              <div key={t.name} style={{ background: '#FFFFFF', borderRadius: 24, padding: 28, border: '1px solid #E8DED8' }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 16 }}>
                  {Array.from({ length: t.stars }).map((_, i) => <Star key={i} size={16} fill="#F59E0B" color="#F59E0B" />)}
                </div>
                <p style={{ fontSize: 16, color: '#0C2B35', lineHeight: 1.6, fontStyle: 'italic', marginBottom: 20 }}>"{t.quote}"</p>
                <div>
                  <div style={{ fontWeight: 800, color: '#0C2B35', fontSize: 15 }}>{t.name}</div>
                  <div style={{ color: '#EC5A42', fontWeight: 700, fontSize: 14, marginTop: 3 }}>{t.result}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{ background: '#0C2B35', padding: '100px 5%', textAlign: 'center' }}>
        <h2 style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-1.5px', marginBottom: 20, lineHeight: 1.1 }}>
          Your best health starts<br />with one good decision.
        </h2>
        <p style={{ fontSize: 18, color: '#9CA3AF', marginBottom: 40 }}>Join 45M+ people who chose science over willpower.</p>
        <button onClick={() => navigate('/signup')}
          style={{ background: '#EC5A42', color: 'white', padding: '20px 52px', borderRadius: 999, fontSize: 20, fontWeight: 900, border: 'none', cursor: 'pointer', boxShadow: '0 8px 32px rgba(236,90,66,0.3)', transition: 'transform 150ms ease' }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.03)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
          Start My Free Trial
        </button>
        <p style={{ marginTop: 18, color: '#6B7280', fontSize: 14 }}>No credit card required · Cancel anytime</p>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#060F12', color: '#E8DED8', padding: '64px 5% 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 44, marginBottom: 60 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', marginBottom: 16 }}>Wellness+</div>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: '#6B7280' }}>Stop dieting. Get lifelong results with our psychology-based program.</p>
            </div>
            {[
              {
                heading: 'Program',
                links: [['Weight Loss', '/weight-loss'], ['Research & Science', '/research'], ['About Us', '/about'], ['Press', '/press'], ['Careers', '/careers']],
              },
              {
                heading: 'Free Tools',
                links: [['BMI Calculator', '/bmi-calculator'], ['Macro Calculator', '/macro-calculator'], ['Calorie Calculator', '/calorie-deficit-calculator'], ['Personality Quiz', '/personality-quiz'], ['Food Color Guide', '/food-guide']],
              },
              {
                heading: 'Company',
                links: [['Pricing', '/pricing'], ['Support', '/support'], ['Privacy Policy', '/privacy'], ['Terms & Conditions', '/terms']],
              },
            ].map(col => (
              <div key={col.heading}>
                <h4 style={{ fontWeight: 800, color: '#FFFFFF', marginBottom: 18, fontSize: 13, textTransform: 'uppercase', letterSpacing: '1.5px' }}>{col.heading}</h4>
                {col.links.map(([label, href]) => (
                  <div key={label} style={{ marginBottom: 12 }}>
                    <Link to={href} style={{ color: '#6B7280', textDecoration: 'none', fontSize: 14, fontWeight: 600, transition: 'color 150ms ease' }}
                      onMouseEnter={e => e.target.style.color = '#FFFFFF'}
                      onMouseLeave={e => e.target.style.color = '#6B7280'}>
                      {label}
                    </Link>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, alignItems: 'center' }}>
            <span style={{ fontSize: 13, color: '#374151' }}>© {new Date().getFullYear()} Wellness+ Inc. All rights reserved.</span>
            <span style={{ fontSize: 13, color: '#374151' }}>This app does not provide medical advice.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
