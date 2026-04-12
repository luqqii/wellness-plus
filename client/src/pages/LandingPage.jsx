import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  return (
    <div style={{ background: '#FDFBF8', minHeight: '100vh', color: 'var(--c-text-primary)', fontFamily: '"Inter", sans-serif' }}>
      
      {/* Top Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 5%', height: 72,
        background: '#FFFFFF',
        position: 'sticky', top: 0, zIndex: 100,
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 24, fontWeight: 900, color: 'var(--c-orange)', letterSpacing: '-1px' }}>
            Wellness+
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary" style={{ background: 'var(--c-orange)' }}>
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: 15, color: 'var(--c-text-primary)', textDecoration: 'none', fontWeight: 600 }}>
                Log In
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero Quiz Hook Section */}
      <section style={{ padding: '80px 20px 100px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <h1 style={{
          fontSize: 'clamp(40px, 8vw, 72px)',
          fontWeight: 900, lineHeight: 1.1,
          letterSpacing: '-2px',
          marginBottom: 30,
          color: '#1A1D20',
          maxWidth: 900
        }}>
          Lose weight for good.
        </h1>
        <p style={{ fontSize: 22, color: '#4A5568', maxWidth: 660, marginBottom: 50, lineHeight: 1.4, fontWeight: 500 }}>
          Take the psychology-based quiz to stop dieting and start building healthy habits that last.
        </p>

        {/* The Noom-style interactive prompt box */}
        <div style={{ 
          background: '#FFFFFF', padding: '40px', borderRadius: 24, 
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)', width: '100%', maxWidth: 500 
        }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 24, color: '#1A1D20' }}>
            What is your primary goal?
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              "Lose weight",
              "Get fit and tone up",
              "Build healthy habits",
              "Reduce stress and anxiety"
            ].map(goal => (
              <button 
                key={goal}
                onClick={() => navigate('/signup')}
                style={{
                  background: '#F5F3EF',
                  border: '2px solid transparent',
                  padding: '20px',
                  borderRadius: 999,
                  fontSize: 18,
                  fontWeight: 600,
                  color: '#1A1D20',
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  textAlign: 'left'
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--c-orange)'; e.currentTarget.style.background = '#FFFFFF'; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = '#F5F3EF'; }}
              >
                {goal}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof / Methodology */}
      <section style={{ padding: '80px 20px', background: '#FFFFFF', textAlign: 'center' }}>
         <h2 style={{ fontSize: 40, fontWeight: 800, marginBottom: 20, color: '#1A1D20', letterSpacing: '-1px' }}>
           Why Wellness+ works
         </h2>
         <p style={{ fontSize: 18, color: '#4A5568', maxWidth: 700, margin: '0 auto 60px', lineHeight: 1.6 }}>
           Our program is built on behavioral psychology to help you understand your relationship with food, so you can change your habits for the long term.
         </p>

         <div style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 1000, margin: '0 auto' }}>
            {[
              { num: 'No', title: 'Food restrictions', desc: 'No foods are bad foods. Learn to eat the foods you love while still losing weight.' },
              { num: '10', title: 'Minutes a day', desc: 'Read bite-sized lessons every day to master your mindset and conquer cravings.' },
              { num: 'AI', title: 'Personalized Coaching', desc: 'Get 24/7 support from our intelligent psychology coach to stay on track.' },
            ].map(feature => (
               <div key={feature.title} style={{ flex: '1 1 250px', padding: 30, background: '#FDFBF8', borderRadius: 24 }}>
                  <div style={{ fontSize: 48, fontWeight: 900, color: 'var(--c-orange)', marginBottom: 10 }}>{feature.num}</div>
                  <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 10 }}>{feature.title}</h3>
                  <p style={{ fontSize: 15, color: '#4A5568', lineHeight: 1.5 }}>{feature.desc}</p>
               </div>
            ))}
         </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '40px 5%', background: '#F5F3EF', borderTop: '1px solid #EAE6DF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20 }}>
        <span style={{ fontSize: 18, fontWeight: 900, color: 'var(--c-orange)' }}>Wellness+</span>
        <div style={{ display: 'flex', gap: 30 }}>
          {['Science', 'Articles', 'Login', 'Help'].map(l => (
            <a key={l} href="#" style={{ fontSize: 14, color: '#4A5568', textDecoration: 'none', fontWeight: 600 }}
              onMouseEnter={e => e.target.style.color = '#1A1D20'}
              onMouseLeave={e => e.target.style.color = '#4A5568'}
            >{l}</a>
          ))}
        </div>
      </footer>

    </div>
  );
}
