import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ChevronDown, Check, Star, Brain, PieChart, Activity, Stethoscope, Video, Pill, ShieldCheck, Heart, Users, ChevronRight } from 'lucide-react';

/* ─── Free Tools dropdown items ─── */
const FREE_TOOLS_ITEMS = [
  { label: 'BMI Calculator',                href: '/bmi-calculator',             desc: 'Find your body mass index' },
  { label: 'Macro Calculator',              href: '/macro-calculator',           desc: 'Protein, carb & fat targets' },
  { label: 'Calorie Deficit Calculator',    href: '/calorie-deficit-calculator', desc: 'Daily calorie goal' },
  { label: 'Weight Loss Personality Quiz',  href: '/personality-quiz',           desc: 'Discover your eating style' },
  { label: 'Food Color Guide',              href: '/food-guide',                 desc: 'Green / Yellow / Orange system' },
];

function DropdownMenu({ title, items }) {
  const [open, setOpen] = useState(false);
  const timerRef = useRef(null);

  const show = () => { clearTimeout(timerRef.current); setOpen(true); };
  const hide = () => { timerRef.current = setTimeout(() => setOpen(false), 120); };

  return (
    <div style={{ position: 'relative' }} onMouseEnter={show} onMouseLeave={hide}>
      <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, fontWeight: 700, fontSize: 16, color: '#0C2B35', fontFamily: 'inherit', padding: '6px 0', transition: 'color 0.2s' }}
        onMouseEnter={e => e.currentTarget.style.color = '#EC5A42'}
        onMouseLeave={e => e.currentTarget.style.color = '#0C2B35'}
      >
        {title} <ChevronDown size={14} style={{ transition: 'transform 200ms', transform: open ? 'rotate(180deg)' : 'rotate(0)' }} />
      </button>
      {open && <div style={{ position: 'absolute', top: 24, left: -20, width: 340, height: 20, zIndex: 999 }} />}
      {open && (
        <div
          onMouseEnter={show} onMouseLeave={hide}
          style={{
            position: 'absolute', top: 44, left: -20, width: 330,
            background: '#FFFFFF', borderRadius: 20, boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
            border: '1px solid #E8DED8', padding: '12px 10px', zIndex: 1000,
            animation: 'fadeSlideDown 200ms cubic-bezier(0.16, 1, 0.3, 1)'
          }}
        >
          <style>{`@keyframes fadeSlideDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }`}</style>
          {items.map(item => (
            <Link key={item.href} to={item.href} onClick={() => setOpen(false)}
              style={{ display: 'flex', flexDirection: 'column', gap: 3, padding: '12px 16px', borderRadius: 14, textDecoration: 'none', transition: 'background 120ms ease' }}
              onMouseEnter={e => e.currentTarget.style.background = '#FFF3EB'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <span style={{ fontSize: 15, fontWeight: 800, color: '#0C2B35' }}>{item.label}</span>
              {item.desc && <span style={{ fontSize: 13, color: '#718096', fontWeight: 500 }}>{item.desc}</span>}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [sliderVal, setSliderVal] = useState(15);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div style={{ background: '#FFF3EB', minHeight: '100vh', color: '#0C2B35', fontFamily: '"Nunito", "Inter", sans-serif', overflowX: 'hidden' }}>
      
      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 900, height: 72,
        background: scrolled ? 'rgba(255,243,235,0.97)' : 'rgba(255,243,235,0.97)',
        backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #E8DED8',
        transition: 'all 300ms ease',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 5%',
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#EC5A42', boxShadow: '0 4px 12px rgba(236,90,66,0.3)' }} />
          <span style={{ fontSize: 22, fontWeight: 900, color: '#0C2B35', letterSpacing: '-0.5px' }}>Wellness+</span>
        </Link>

        {/* Desktop Nav Links — hidden on mobile via JS */}
        {!mobileMenuOpen && (
          <div id="desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
            <style>{`
              @media (max-width: 768px) { #desktop-nav { display: none !important; } #desktop-cta { display: none !important; } #hamburger { display: flex !important; } }
              @media (min-width: 769px) { #hamburger { display: none !important; } }
            `}</style>
            <Link to="/weight-loss" style={{ textDecoration: 'none', color: '#0C2B35', fontWeight: 700, fontSize: 15 }}>Weight Loss</Link>
            <DropdownMenu title="Free Tools" items={FREE_TOOLS_ITEMS} />
            <Link to="/research" style={{ textDecoration: 'none', color: '#0C2B35', fontWeight: 700, fontSize: 15 }}>Science</Link>
            <Link to="/pricing" style={{ textDecoration: 'none', color: '#0C2B35', fontWeight: 700, fontSize: 15 }}>Pricing</Link>
          </div>
        )}

        {/* Desktop CTA Buttons */}
        <div id="desktop-cta" style={{ display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0 }}>
          {isAuthenticated ? (
            <Link to="/dashboard" style={{ background: '#EC5A42', color: 'white', padding: '10px 22px', borderRadius: 999, textDecoration: 'none', fontWeight: 800, fontSize: 14, boxShadow: '0 4px 12px rgba(236,90,66,0.2)', whiteSpace: 'nowrap' }}>Go to Dashboard</Link>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none', color: '#0C2B35', fontWeight: 700, fontSize: 15, whiteSpace: 'nowrap' }}>Log In</Link>
              <Link to="/signup" style={{ background: '#EC5A42', color: 'white', padding: '10px 20px', borderRadius: 999, textDecoration: 'none', fontWeight: 800, fontSize: 14, whiteSpace: 'nowrap' }}>Sign Up</Link>
            </>
          )}
        </div>

        {/* Hamburger — mobile only */}
        <button
          id="hamburger"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ background: 'none', border: 'none', padding: 6, cursor: 'pointer', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 5 }}
          aria-label="Toggle menu"
        >
          <div style={{ width: 24, height: 2.5, background: '#0C2B35', borderRadius: 2, transition: 'all 200ms', transform: mobileMenuOpen ? 'rotate(45deg) translateY(7px)' : 'none' }} />
          <div style={{ width: 24, height: 2.5, background: '#0C2B35', borderRadius: 2, transition: 'all 200ms', opacity: mobileMenuOpen ? 0 : 1 }} />
          <div style={{ width: 24, height: 2.5, background: '#0C2B35', borderRadius: 2, transition: 'all 200ms', transform: mobileMenuOpen ? 'rotate(-45deg) translateY(-7px)' : 'none' }} />
        </button>
      </nav>

      {/* ── Mobile Menu Drawer ── */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', top: 72, left: 0, right: 0, zIndex: 899,
              background: '#FFF3EB', borderBottom: '2px solid #E8DED8',
              padding: '24px 5% 32px',
              display: 'flex', flexDirection: 'column', gap: 6
            }}
          >
            {/* Nav Links */}
            {[
              { label: 'Weight Loss', href: '/weight-loss' },
              { label: 'Free Tools', href: '/bmi-calculator' },
              { label: 'Recipes', href: '/recipes' },
              { label: 'Science', href: '/research' },
              { label: 'Pricing', href: '/pricing' },
            ].map(item => (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setMobileMenuOpen(false)}
                style={{
                  padding: '14px 0', fontSize: 18, fontWeight: 700, color: '#0C2B35',
                  textDecoration: 'none', borderBottom: '1px solid #E8DED8',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                }}
              >
                {item.label} <ChevronRight size={18} color="#EC5A42" />
              </Link>
            ))}

            {/* CTA Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 16 }}>
              {isAuthenticated ? (
                <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)}
                  style={{ background: '#EC5A42', color: 'white', padding: '16px', borderRadius: 999, textDecoration: 'none', fontWeight: 800, fontSize: 17, textAlign: 'center', boxShadow: '0 6px 20px rgba(236,90,66,0.25)' }}
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/signup" onClick={() => setMobileMenuOpen(false)}
                    style={{ background: '#EC5A42', color: 'white', padding: '16px', borderRadius: 999, textDecoration: 'none', fontWeight: 800, fontSize: 17, textAlign: 'center', boxShadow: '0 6px 20px rgba(236,90,66,0.25)' }}
                  >
                    Get Started — It's Free
                  </Link>
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}
                    style={{ background: 'white', color: '#0C2B35', padding: '14px', borderRadius: 999, textDecoration: 'none', fontWeight: 700, fontSize: 16, textAlign: 'center', border: '2px solid #E8DED8' }}
                  >
                    Log In
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── HERO ── */}
      <section style={{ paddingTop: 140, paddingBottom: 60, paddingLeft: '4%', paddingRight: '4%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ fontSize: 'clamp(44px, 7vw, 90px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-2.5px', marginBottom: 20, color: '#0C2B35', maxWidth: 900, textAlign: 'center' }}>
          Empowering everyone everywhere to live better longer.
        </h1>
        <p style={{ fontSize: 'clamp(18px, 2.5vw, 24px)', color: '#4A5568', maxWidth: 700, marginBottom: 56, lineHeight: 1.5, fontWeight: 500, textAlign: 'center' }}>
          Choose the path that fits you best. Psychology-backed behavior change, or clinical GLP-1 weight loss medication.
        </p>

        {/* Dual Offering Split Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 24, width: '100%', maxWidth: 1100, marginBottom: 60 }}>
          
          {/* Wellness+ Core Card */}
          <div style={{ background: '#FFFFFF', borderRadius: 32, padding: '40px 32px', boxShadow: '0 24px 50px rgba(0,0,0,0.06)', border: '1px solid #E8DED8', display: 'flex', flexDirection: 'column' }}>
             <div style={{ display: 'inline-block', padding: '6px 14px', background: '#FFF3EB', color: '#EC5A42', borderRadius: 99, fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24, alignSelf: 'flex-start' }}>Wellness+ Core</div>
             <h2 style={{ fontSize: 36, fontWeight: 900, color: '#0C2B35', marginBottom: 16, lineHeight: 1.1, letterSpacing: '-1px' }}>Build habits that last a lifetime.</h2>
             <p style={{ fontSize: 18, color: '#4A5568', marginBottom: 32, lineHeight: 1.5, flex: 1 }}>Lose weight and keep it off with our psychology-based behavior change program. No forbidden foods, no strict rules.</p>
             <button onClick={() => navigate('/signup')}
                style={{ background: '#EC5A42', color: 'white', width: '100%', padding: '20px', borderRadius: 999, fontSize: 18, fontWeight: 900, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 24px rgba(236,90,66,0.25)', transition: 'transform 200ms ease, box-shadow 200ms ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(236,90,66,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(236,90,66,0.25)'; }}>
                Get Your Diet Plan <ArrowRight size={20} strokeWidth={3} />
             </button>
          </div>

          {/* Wellness+ Clinical Card */}
          <div style={{ background: '#F1FBFA', borderRadius: 32, padding: '40px 32px', boxShadow: '0 24px 50px rgba(20,184,166,0.08)', border: '1px solid rgba(20,184,166,0.2)', display: 'flex', flexDirection: 'column' }}>
             <div style={{ display: 'inline-block', padding: '6px 14px', background: 'rgba(20,184,166,0.15)', color: '#164654', borderRadius: 99, fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24, alignSelf: 'flex-start' }}>Wellness+ Clinical</div>
             <h2 style={{ fontSize: 36, fontWeight: 900, color: '#164654', marginBottom: 16, lineHeight: 1.1, letterSpacing: '-1px' }}>Clinical care with GLP-1 support.</h2>
             <p style={{ fontSize: 18, color: '#4A5568', marginBottom: 32, lineHeight: 1.5, flex: 1 }}>Combine the power of biology and psychology. Get paired with clinical experts to access medications like Wegovy® or Zepbound™.</p>
             <button onClick={() => navigate('/signup')}
                style={{ background: '#14B8A6', color: 'white', width: '100%', padding: '20px', borderRadius: 999, fontSize: 18, fontWeight: 900, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, boxShadow: '0 8px 24px rgba(20,184,166,0.25)', transition: 'transform 200ms ease, box-shadow 200ms ease' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.02)'; e.currentTarget.style.boxShadow = '0 12px 32px rgba(20,184,166,0.35)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(20,184,166,0.25)'; }}>
                See if you qualify <ArrowRight size={20} strokeWidth={3} />
             </button>
          </div>
        </div>

        <p style={{ fontSize: 13, color: '#9CA3AF', fontWeight: 600 }}>Over 45 million people trust Wellness+ worldwide.</p>
      </section>

      {/* ── AS SEEN IN ── */}
      <section style={{ background: '#FFFFFF', padding: '40px 5%', borderTop: '1px solid #E8DED8', borderBottom: '1px solid #E8DED8', overflow: 'hidden' }}>
        <p style={{ textAlign: 'center', fontSize: 12, letterSpacing: '2.5px', fontWeight: 800, color: '#9CA3AF', textTransform: 'uppercase', marginBottom: 28 }}>Featured In</p>
        <div style={{ display: 'flex', gap: 'clamp(30px, 6vw, 60px)', justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center', opacity: 0.6, filter: 'grayscale(100%)' }}>
          <span style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 900, color: '#0C2B35', letterSpacing: '-0.5px' }}>The New York Times</span>
          <span style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 900, color: '#0C2B35', letterSpacing: '-0.5px' }}>Forbes</span>
          <span style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 900, color: '#0C2B35', letterSpacing: '-0.5px' }}>Women's Health</span>
          <span style={{ fontSize: 'clamp(22px, 3vw, 28px)', fontWeight: 900, color: '#0C2B35', letterSpacing: '-0.5px' }}>TIME</span>
          <span style={{ fontSize: 'clamp(20px, 3vw, 24px)', fontWeight: 900, color: '#0C2B35', letterSpacing: '-0.5px' }}>Harvard Health</span>
        </div>
      </section>

      {/* ── INTERACTIVE FUNNEL ── */}
      <section style={{ padding: '100px 5%', background: '#FFF3EB' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', background: '#FFFFFF', borderRadius: 32, padding: 'clamp(32px, 6vw, 56px)', boxShadow: '0 30px 60px rgba(0,0,0,0.06)', border: '1px solid #E8DED8', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 900, color: '#0C2B35', marginBottom: 16, letterSpacing: '-1px' }}>How much weight do you want to lose?</h2>
          <p style={{ fontSize: 18, color: '#718096', marginBottom: 48, fontWeight: 500 }}>Shift the slider to build your custom plan.</p>
          
          <div style={{ marginBottom: 48, padding: '0 20px' }}>
            <div style={{ fontSize: 'clamp(64px, 10vw, 88px)', fontWeight: 900, color: '#EC5A42', lineHeight: 1, marginBottom: 32, letterSpacing: '-2px' }}>
              {sliderVal} <span style={{ fontSize: 24, color: '#0C2B35', fontWeight: 700, letterSpacing: '0px' }}>lbs</span>
            </div>
            
            <div style={{ position: 'relative' }}>
               <input type="range" className="Wellness+-slider" min="1" max="100" value={sliderVal} onChange={e => setSliderVal(e.target.value)} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, fontSize: 13, color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1 }}>
              <span>Not Sure</span><span>A Lot</span>
            </div>
          </div>

          <button onClick={() => navigate('/signup')} style={{ background: '#EC5A42', color: 'white', width: '100%', padding: '20px', borderRadius: 999, fontSize: 18, fontWeight: 900, border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(236,90,66,0.3)', transition: 'transform 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            Create my plan <ArrowRight size={20} strokeWidth={3} />
          </button>
        </div>
      </section>

      {/* ── Wellness+ Core GRID ── */}
      <section style={{ padding: '100px 5%', background: '#FFFFFF' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 80 }}>
            <h2 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900, letterSpacing: '-1.5px', color: '#0C2B35', marginBottom: 20 }}>More than just a weight loss app.</h2>
            <p style={{ fontSize: 20, color: '#718096', maxWidth: 640, margin: '0 auto', lineHeight: 1.5 }}>Wellness+ doesn't restrict food. We use psychology to change the way you think, eat, and live.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
            {[
              { icon: Brain, color: '#EC5A42', title: 'Psychology First', body: 'Mini daily lessons teach you about cognitive behavioral therapy, triggers, and mindful eating.' },
              { icon: PieChart, color: '#F59E0B', title: 'Color-Coded Food', body: 'No food is off-limits. Learn to balance caloric density using our Green, Yellow, and Orange categorization system.' },
              { icon: Users, color: '#8B5CF6', title: '1:1 Coaching', body: 'Get a dedicated coach to hold you accountable, answer questions, and celebrate your wins every week.' },
              { icon: Activity, color: '#14B8A6', title: 'Progress Tracking', body: 'Seamlessly track your meals, weight, sleep, and steps in one unified dashboard.' }
            ].map((f, i) => (
              <div key={i} style={{ background: '#FDFBF8', border: '1px solid #E8DED8', padding: 40, borderRadius: 32, transition: 'transform 0.3s' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'} onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}>
                <div style={{ width: 64, height: 64, borderRadius: 20, background: `${f.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
                  <f.icon size={32} color={f.color} />
                </div>
                <h3 style={{ fontSize: 24, fontWeight: 900, color: '#0C2B35', marginBottom: 12, letterSpacing: '-0.5px' }}>{f.title}</h3>
                <p style={{ fontSize: 16, color: '#4A5568', lineHeight: 1.6 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Wellness+ Clinical GLP-1 INTRO ── */}
      <section style={{ padding: '100px 5%', background: '#164654', color: '#FFFFFF' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <div style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.1)', color: '#14B8A6', borderRadius: 99, fontWeight: 800, fontSize: 13, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 24 }}>Introducing Wellness+ Clinical</div>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 900, marginBottom: 24, letterSpacing: '-1.5px', lineHeight: 1.1 }}>Access GLP-1 medications <br />with clinical support.</h2>
          <p style={{ fontSize: 20, color: '#94A3B8', maxWidth: 600, marginBottom: 60, lineHeight: 1.5 }}>Our newest program combines medical weight loss prescriptions like Semaglutide with our proven psychology platform.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, width: '100%', marginBottom: 60 }}>
            {[
              { icon: ShieldCheck, title: 'Insurance Support', desc: 'Our concierge team navigates your insurance to find maximum coverage for meds.' },
              { icon: Stethoscope, title: 'Prescribing Doctors', desc: 'Consult via video with board-certified physicians who tailor medications to you.' },
              { icon: Pill, title: 'Compounded Options', desc: 'Can\'t get brand names? We provide high-quality compounded alternatives starting at $149/mo.' }
            ].map((m, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: 32, borderRadius: 24, border: '1px solid rgba(255,255,255,0.1)', textAlign: 'left' }}>
                <m.icon size={32} color="#14B8A6" style={{ marginBottom: 20 }} />
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#FFFFFF', marginBottom: 12 }}>{m.title}</h3>
                <p style={{ fontSize: 15, color: '#94A3B8', lineHeight: 1.5 }}>{m.desc}</p>
              </div>
            ))}
          </div>

          <button onClick={() => navigate('/med')} style={{ background: '#14B8A6', color: 'white', padding: '20px 48px', borderRadius: 999, fontSize: 18, fontWeight: 900, border: 'none', cursor: 'pointer', boxShadow: '0 8px 24px rgba(20,184,166,0.3)' }}>
            Learn About Wellness+ Clinical
          </button>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '100px 5%', background: '#FDFBF8' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(36px, 5vw, 52px)', fontWeight: 900, textAlign: 'center', letterSpacing: '-1px', color: '#0C2B35', marginBottom: 64 }}>Hear from our success stories.</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
            {[
              { name: 'Sarah', lost: '28 lbs', quote: 'I stopped obsessing over calories for the first time in 10 years. The psychology lessons changed everything.', program: 'Wellness+ Core' },
              { name: 'James', lost: '42 lbs', quote: 'I needed the extra boost. The clinical team at Wellness+ Clinical prescribed me exactly what I needed without judgment.', program: 'Wellness+ Clinical' },
              { name: 'David', lost: '22 lbs', quote: "I’ve tried everything. This is the first program that addresses WHY I overeat, not just the food itself.", program: 'Wellness+ Core' }
            ].map((t, i) => (
              <div key={i} style={{ background: '#FFFFFF', borderRadius: 32, padding: 36, border: '1px solid #E8DED8', boxShadow: '0 12px 30px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', gap: 2, marginBottom: 20 }}>
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={18} fill="#F59E0B" color="#F59E0B" />)}
                </div>
                <p style={{ fontSize: 18, color: '#0C2B35', lineHeight: 1.6, fontStyle: 'italic', marginBottom: 24, fontWeight: 500 }}>"{t.quote}"</p>
                <div style={{ paddingTop: 20, borderTop: '1px solid #E8DED8' }}>
                  <div style={{ fontWeight: 900, color: '#0C2B35', fontSize: 18, letterSpacing: '-0.5px' }}>{t.name}</div>
                  <div style={{ color: t.program === 'Wellness+ Clinical' ? '#14B8A6' : '#EC5A42', fontWeight: 800, fontSize: 14, marginTop: 4 }}>Lost {t.lost} with {t.program}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#0C2B35', color: '#FFFFFF', padding: '100px 5% 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 80 }}>
            <div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#FFFFFF', marginBottom: 20, letterSpacing: '-1px' }}>Wellness+</div>
              <p style={{ fontSize: 15, lineHeight: 1.6, color: '#94A3B8' }}>Stop dieting. Get lifelong results with our psychology-based program and clinical GLP-1 care.</p>
            </div>
            {[
              {
                heading: 'Programs',
                links: [['Wellness+ Core', '/weight-loss'], ['Wellness+ Clinical', '/med'], ['Wellness+ Teams', '/work']]
              },
              {
                heading: 'Explore',
                links: [['Free Tools', '/free-tools'], ['Science', '/research'], ['About Us', '/about'], ['Careers', '/careers']]
              },
              {
                heading: 'Legal',
                links: [['Privacy Policy', '/privacy'], ['Terms & Conditions', '/terms'], ['Contact Support', '/support']]
              }
            ].map(col => (
              <div key={col.heading}>
                <h4 style={{ fontWeight: 800, color: '#FFFFFF', marginBottom: 24, fontSize: 14, textTransform: 'uppercase', letterSpacing: '1px' }}>{col.heading}</h4>
                {col.links.map(([label, href]) => (
                  <div key={label} style={{ marginBottom: 14 }}>
                    <Link to={href} style={{ color: '#94A3B8', textDecoration: 'none', fontSize: 15, fontWeight: 500, transition: 'color 0.2s' }}
                      onMouseEnter={e => e.target.style.color = '#FFFFFF'} onMouseLeave={e => e.target.style.color = '#94A3B8'}>
                      {label}
                    </Link>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 32, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: '#64748B' }}>© {new Date().getFullYear()} Wellness+ Inc. All rights reserved.</span>
            <span style={{ fontSize: 14, color: '#64748B' }}>This application is structurally modeled after Wellness+.com for aesthetic testing.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
