import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { ArrowRight, Info } from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  const [sliderVal, setSliderVal] = useState(15); // Default "lose 15 kg"

  const handleSliderChange = (e) => {
    setSliderVal(e.target.value);
  };

  const handleStart = () => {
    // In a real flow, this would save the target weight loss goal to localStorage
    navigate('/signup');
  };

  return (
    <div style={{ background: '#FFF3EB', minHeight: '100vh', color: '#0C2B35', fontFamily: '"Nunito", "Inter", sans-serif' }}>
      
      {/* Exact Noom Top Navbar */}
      <nav style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 5%', height: 80,
        background: '#FFF3EB', // Noom navbar is typically transparent or beige on the homepage
        position: 'absolute', top: 0, left: 0, right: 0, zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
          {/* Noom uses a sun icon. We will use an orange circle to mimic */}
          <div style={{ width: 24, height: 24, borderRadius: '50%', background: '#EC5A42' }} />
          <span style={{ fontSize: 26, fontWeight: 800, color: '#0C2B35', letterSpacing: '-0.5px' }}>
            Wellness+
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 30 }}>
          <Link to="/weight-loss" style={{ textDecoration: 'none', color: '#0C2B35', fontWeight: 700, fontSize: 16 }}>Weight Loss</Link>
          <Link to="/support" style={{ textDecoration: 'none', color: '#0C2B35', fontWeight: 700, fontSize: 16 }}>Support</Link>
          
          {/* Mock Dropdown for Free Tools */}
          <div style={{ position: 'relative', cursor: 'pointer' }} className="nav-dropdown-group">
            <span style={{ fontSize: 16, color: '#0C2B35', fontWeight: 700 }}>Free Tools</span>
            <div className="nav-dropdown-menu" style={{ position: 'absolute', top: 30, left: -60, background: '#FFFFFF', padding: 20, borderRadius: 16, width: 280, boxShadow: '0 12px 30px rgba(0,0,0,0.08)', display: 'none', flexDirection: 'column', gap: 14 }}>
              <Link to="/macro-calculator" style={{ textDecoration: 'none', color: '#0C2B35', fontWeight: 600, fontSize: 15 }}>Macro Calculator</Link>
              <Link to="/calorie-deficit-calculator" style={{ textDecoration: 'none', color: '#0C2B35', fontWeight: 600, fontSize: 15 }}>Calorie Deficit Calculator</Link>
              <Link to="/personality-quiz" style={{ textDecoration: 'none', color: '#0C2B35', fontWeight: 600, fontSize: 15 }}>Weight Loss Personality Quiz</Link>
            </div>
            <style>{`.nav-dropdown-group:hover .nav-dropdown-menu { display: flex !important; }`}</style>
          </div>

          {isAuthenticated ? (
            <Link to="/dashboard" style={{ fontSize: 16, color: '#EC5A42', textDecoration: 'none', fontWeight: 700 }}>
              Dashboard
            </Link>
          ) : (
            <Link to="/login" style={{ fontSize: 16, color: '#0C2B35', textDecoration: 'none', fontWeight: 700 }}>
              Log In
            </Link>
          )}
        </div>
      </nav>

      {/* Exact Noom Hero Section */}
      <section style={{ paddingTop: 160, paddingBottom: 100, paddingLeft: 20, paddingRight: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <h1 style={{
          fontSize: 'clamp(48px, 9vw, 84px)',
          fontWeight: 900, lineHeight: 1.05,
          letterSpacing: '-2px',
          marginBottom: 24,
          color: '#0C2B35',
          maxWidth: 900
        }}>
          Stop dieting.<br />Get lifelong results.
        </h1>
        <p style={{ fontSize: 24, color: '#0C2B35', maxWidth: 660, marginBottom: 60, lineHeight: 1.4, fontWeight: 500 }}>
          Build healthy habits with our psychology-based program.
        </p>

        {/* The Exact Noom Interactive Slider Box */}
        <div style={{ 
          background: '#FFFFFF', padding: '48px 40px', borderRadius: 24, 
          boxShadow: '0 20px 40px rgba(0,0,0,0.06)', width: '100%', maxWidth: 540 
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 32, color: '#0C2B35' }}>
            How much weight do you want to lose?
          </h2>
          
          <div style={{ position: 'relative', marginBottom: 40 }}>
            {/* The giant number display */}
            <div style={{ fontSize: 64, fontWeight: 900, color: '#EC5A42', marginBottom: 20, lineHeight: 1 }}>
              {sliderVal} <span style={{ fontSize: 24, color: '#0C2B35' }}>kg</span>
            </div>

            {/* Custom Range Slider mimicking Noom */}
            <input 
              type="range" 
              className="noom-slider"
              min="1" 
              max="50" 
              value={sliderVal} 
              onChange={handleSliderChange}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: 14, color: '#718096', fontWeight: 600 }}>
              <span>Not sure</span>
              <span>A lot</span>
            </div>
          </div>

          <button 
            onClick={handleStart}
            style={{
              background: '#EC5A42', color: 'white', width: '100%', padding: '20px', 
              borderRadius: 999, fontSize: 20, fontWeight: 800, border: 'none',
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              boxShadow: '0 8px 16px rgba(236,90,66,0.25)', transition: 'transform 150ms ease'
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          >
            Get Your Plan <ArrowRight size={20} strokeWidth={3} />
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginTop: 24, color: '#4A5568', fontSize: 13 }}>
            <Info size={14} /> Takes 2 minutes
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section style={{ padding: '40px 20px', background: '#FFFFFF', textAlign: 'center', borderTop: '1px solid #E8DED8' }}>
         <h2 style={{ fontSize: 14, textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 800, color: '#718096', marginBottom: 24 }}>
           Trusted by millions
         </h2>
         <div style={{ display: 'flex', gap: 40, justifyContent: 'center', flexWrap: 'wrap', opacity: 0.8 }}>
            {['The New York Times', 'Forbes', "Women's Health", 'Harvard Medical'].map(brand => (
               <div key={brand} style={{ fontSize: 20, fontWeight: 900, color: '#0C2B35' }}>
                  {brand}
               </div>
            ))}
         </div>
      </section>

      {/* Full Noom-Style Footer */}
      <footer style={{ background: '#0C2B35', color: '#E8DED8', padding: '60px 5% 40px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: 40, marginBottom: 60 }}>
            
            <div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#FFFFFF', marginBottom: 24 }}>Wellness+</div>
              <p style={{ fontSize: 14, lineHeight: 1.7, color: '#9CA3AF' }}>Stop dieting. Get lifelong results with our psychology-based program.</p>
            </div>

            <div>
              <h4 style={{ fontWeight: 800, color: '#FFFFFF', marginBottom: 20, fontSize: 14, textTransform: 'uppercase', letterSpacing: '1px' }}>Program</h4>
              {[['Weight Loss', '/weight-loss'], ['Research & Science', '/research'], ['About Us', '/about'], ['Press', '/press']].map(([label, href]) => (
                <div key={label} style={{ marginBottom: 12 }}>
                  <Link to={href} style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: 15, fontWeight: 600 }}
                    onMouseEnter={e => e.target.style.color = '#FFFFFF'} onMouseLeave={e => e.target.style.color = '#9CA3AF'}>
                    {label}
                  </Link>
                </div>
              ))}
            </div>

            <div>
              <h4 style={{ fontWeight: 800, color: '#FFFFFF', marginBottom: 20, fontSize: 14, textTransform: 'uppercase', letterSpacing: '1px' }}>Free Tools</h4>
              {[['Macro Calculator', '/macro-calculator'], ['Calorie Calculator', '/calorie-deficit-calculator'], ['Personality Quiz', '/personality-quiz']].map(([label, href]) => (
                <div key={label} style={{ marginBottom: 12 }}>
                  <Link to={href} style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: 15, fontWeight: 600 }}
                    onMouseEnter={e => e.target.style.color = '#FFFFFF'} onMouseLeave={e => e.target.style.color = '#9CA3AF'}>
                    {label}
                  </Link>
                </div>
              ))}
            </div>

            <div>
              <h4 style={{ fontWeight: 800, color: '#FFFFFF', marginBottom: 20, fontSize: 14, textTransform: 'uppercase', letterSpacing: '1px' }}>Company</h4>
              {[['Careers', '/careers'], ['Support', '/support'], ['Privacy Policy', '/privacy'], ['Terms & Conditions', '/terms']].map(([label, href]) => (
                <div key={label} style={{ marginBottom: 12 }}>
                  <Link to={href} style={{ color: '#9CA3AF', textDecoration: 'none', fontSize: 15, fontWeight: 600 }}
                    onMouseEnter={e => e.target.style.color = '#FFFFFF'} onMouseLeave={e => e.target.style.color = '#9CA3AF'}>
                    {label}
                  </Link>
                </div>
              ))}
            </div>

          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: 30, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, alignItems: 'center' }}>
            <span style={{ fontSize: 14, color: '#6B7280' }}>© {new Date().getFullYear()} Wellness+ Inc. All rights reserved.</span>
            <span style={{ fontSize: 14, color: '#6B7280' }}>This app does not provide medical advice.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}

