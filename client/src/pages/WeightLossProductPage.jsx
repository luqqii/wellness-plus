import React from 'react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/layout/PublicNavbar';

export default function WeightLossProductPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#FFF3EB', minHeight: '100vh', color: '#0C2B35', fontFamily: '"Nunito", "Inter", sans-serif', paddingBottom: 100 }}>
      <PublicNavbar />

      {/* Hero */}
      <div style={{ textAlign: 'center', padding: '80px 20px', background: '#FFF3EB' }}>
        <h1 style={{ fontSize: 'clamp(40px, 8vw, 72px)', fontWeight: 900, letterSpacing: '-2px', marginBottom: 24, lineHeight: 1.1 }}>
          The psychology of losing weight for good.
        </h1>
        <p style={{ fontSize: 22, color: '#4A5568', maxWidth: 700, margin: '0 auto 40px', lineHeight: 1.5 }}>
          Wellness+ uses a psychology-based approach to change your eating habits instead of just restricting your diet.
        </p>
        <button onClick={() => navigate('/signup')} className="btn" style={{ background: '#EC5A42', color: 'white', padding: '18px 40px', fontSize: 18, borderRadius: 999, fontWeight: 800 }}>
          Get your custom plan
        </button>
      </div>

      {/* Content Breakdown matching Wellness+'s Product explanation */}
      <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 60, padding: '0 20px' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 400px' }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 20 }}>No good foods. No bad foods.</h2>
            <p style={{ fontSize: 18, color: '#4A5568', lineHeight: 1.6 }}>
              With our color-coded system, no food is strictly off-limits. Green foods fill you up with fewer calories, while orange foods are more calorie-dense. We teach you how to balance them so you never feel deprived.
            </p>
          </div>
          <div style={{ flex: '1 1 400px', background: '#FFFFFF', padding: 40, borderRadius: 24, boxShadow: '0 12px 30px rgba(0,0,0,0.05)' }}>
             <div style={{ padding: 12, borderLeft: '4px solid #14B8A6', marginBottom: 16 }}>
               <h4 style={{ margin:0, fontSize:18, fontWeight: 800 }}>Green</h4>
               <span style={{ fontSize: 14, color: '#4A5568' }}>Grapes, Spinach, Oatmeal</span>
             </div>
             <div style={{ padding: 12, borderLeft: '4px solid #EAB308', marginBottom: 16 }}>
               <h4 style={{ margin:0, fontSize:18, fontWeight: 800 }}>Yellow</h4>
               <span style={{ fontSize: 14, color: '#4A5568' }}>Chicken breast, Eggs, Quinoa</span>
             </div>
             <div style={{ padding: 12, borderLeft: '4px solid #EC5A42' }}>
               <h4 style={{ margin:0, fontSize:18, fontWeight: 800 }}>Orange</h4>
               <span style={{ fontSize: 14, color: '#4A5568' }}>Olive oil, Cake, Nuts</span>
             </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 40, flexWrap: 'wrap-reverse' }}>
          <div style={{ flex: '1 1 400px', background: '#0C2B35', color: '#FFF3EB', padding: 50, borderRadius: 24 }}>
            <h3 style={{ fontSize: 28, fontWeight: 800, marginBottom: 20 }}>10 minutes a day.</h3>
            <p style={{ fontSize: 18, lineHeight: 1.6, opacity: 0.9 }}>
              We know you're busy. That's why the Wellness+ daily lessons are designed to fit perfectly into your coffee break or morning commute. Just 10 minutes to rewire your brain.
            </p>
          </div>
          <div style={{ flex: '1 1 400px' }}>
            <h2 style={{ fontSize: 36, fontWeight: 900, marginBottom: 20 }}>Change your mind. Change your body.</h2>
            <p style={{ fontSize: 18, color: '#4A5568', lineHeight: 1.6 }}>
              Diets fail because they try to change what you eat without changing *how* you think. Our curriculum uses Cognitive Behavioral Therapy (CBT) principles to identify your eating triggers.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
