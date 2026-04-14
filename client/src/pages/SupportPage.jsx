import React, { useState } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/layout/PublicNavbar';

const FAQS = [
  { q: "How much does Wellness+ cost?", a: "We offer several subscription tiers starting at $15/month for our baseline AI curriculum. You can cancel at any time directly from the settings panel." },
  { q: "Do I have to restrict what I eat?", a: "Absolutely not. Wellness+ uses a color-coded caloric density system. No foods are off limits. We simply teach you to balance green, yellow, and orange foods so you feel full while losing weight." },
  { q: "How does the AI Coach work?", a: "Your personalized AI Coach uses Cognitive Behavioral Therapy (CBT) paradigms to understand your eating triggers and suggest 10-minute micro-lessons to rewire your psychology." },
  { q: "Is this safe for pregnant women?", a: "While Wellness+ is designed to build healthy habits, you should always consult your primary care physician or OB-GYN before significantly altering your caloric intake during pregnancy." },
  { q: "How do I log my meals?", a: "Just navigate to the Nutrition tab inside the platform! You can use our database search, barcode scanner, or the AI's smart meal suggestions." }
];

export default function SupportPage() {
  const navigate = useNavigate();
  const [openQ, setOpenQ] = useState(null);
  const [query, setQuery] = useState('');

  const filteredFaqs = FAQS.filter(f => f.q.toLowerCase().includes(query.toLowerCase()) || f.a.toLowerCase().includes(query.toLowerCase()));

  return (
    <div style={{ background: '#FFF3EB', minHeight: '100vh', color: '#0C2B35', fontFamily: '"Nunito", "Inter", sans-serif' }}>
      <PublicNavbar />

      {/* Hero */}
      <div style={{ background: '#0C2B35', color: '#FFFFFF', padding: '100px 20px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 'clamp(36px, 6vw, 56px)', fontWeight: 900, marginBottom: 20 }}>Support & FAQ</h1>
        <p style={{ fontSize: 20, color: '#E8DED8', marginBottom: 40 }}>How can we help you on your psychology journey today?</p>
        
        <div style={{ maxWidth: 600, margin: '0 auto', position: 'relative' }}>
           <Search style={{ position: 'absolute', top: 20, left: 24, padding: 0 }} size={24} color="#718096" />
           <input 
             value={query}
             onChange={e => setQuery(e.target.value)}
             placeholder="Search for answers..."
             style={{ width: '100%', padding: '20px 20px 20px 60px', borderRadius: 999, border: 'none', fontSize: 18, color: '#0C2B35', outline: 'none', boxShadow: '0 12px 30px rgba(0,0,0,0.1)' }}
           />
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '60px 20px 100px' }}>
         <h2 style={{ fontSize: 28, fontWeight: 800, marginBottom: 30 }}>Frequently Asked Questions</h2>
         
         <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
           {filteredFaqs.length === 0 ? (
             <div style={{ textAlign: 'center', color: '#718096', padding: 40 }}>No results found for "{query}".</div>
           ) : (
             filteredFaqs.map((faq, i) => (
               <div key={i} style={{ background: '#FFFFFF', borderRadius: 16, border: '2px solid #E8DED8', overflow: 'hidden' }}>
                 <div onClick={() => setOpenQ(openQ === i ? null : i)} style={{ padding: 24, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontWeight: 700, fontSize: 18 }}>
                   {faq.q}
                   {openQ === i ? <ChevronUp size={20} color="#EC5A42" /> : <ChevronDown size={20} color="#0C2B35" />}
                 </div>
                 {openQ === i && (
                   <div style={{ padding: '0 24px 24px', color: '#4A5568', fontSize: 16, lineHeight: 1.6 }}>
                     {faq.a}
                   </div>
                 )}
               </div>
             ))
           )}
         </div>

         <div style={{ marginTop: 60, background: '#FDFBF8', padding: 40, borderRadius: 24, border: '1px solid #E8DED8', textAlign: 'center' }}>
           <h3 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Still need help?</h3>
           <p style={{ color: '#4A5568', marginBottom: 24 }}>Can't find what you're looking for? Reach out to our billing and technical support team.</p>
           <button onClick={() => window.location.href = 'mailto:support@wellnessplus.com'} className="btn" style={{ background: '#EC5A42', color: 'white', padding: '16px 40px', fontSize: 16, borderRadius: 999, fontWeight: 800 }}>
             Contact Human Support
           </button>
         </div>

      </div>
    </div>
  );
}
