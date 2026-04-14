import { useNavigate } from 'react-router-dom';
import PublicNavbar from '../components/layout/PublicNavbar';

export default function CookiePolicyPage() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#FFF3EB', minHeight: '100vh', color: '#0C2B35', fontFamily: '"Nunito", "Inter", sans-serif' }}>
      <PublicNavbar />
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '120px 20px 80px' }}>
        <h1 style={{ fontSize: 'clamp(32px, 6vw, 48px)', fontWeight: 900, marginBottom: 20 }}>Cookie Policy</h1>
        <p style={{ color: '#4A5568', fontSize: 16, marginBottom: 40 }}>Last updated: April 2026</p>

        <div style={{ background: '#FFFFFF', padding: 40, borderRadius: 24, boxShadow: '0 12px 30px rgba(0,0,0,0.03)' }}>
          
          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>1. What are cookies?</h2>
          <p style={{ fontSize: 16, color: '#4A5568', lineHeight: 1.6, marginBottom: 32 }}>
            Cookies are simple text files that are stored on your computer or mobile device by a website's server. Each cookie is unique to your web browser. They help Wellness+ remember things like your preferences, login credentials, and how you use our platform so we can personalize your health journey.
          </p>

          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>2. How we use cookies</h2>
          <p style={{ fontSize: 16, color: '#4A5568', lineHeight: 1.6, marginBottom: 16 }}>
            We use the following types of cookies:
          </p>
          <ul style={{ paddingLeft: 20, marginBottom: 32, fontSize: 16, color: '#4A5568', lineHeight: 1.6 }}>
            <li style={{ marginBottom: 8 }}><strong>Essential Cookies:</strong> Required to authenticate your login sessions and ensure platform security.</li>
            <li style={{ marginBottom: 8 }}><strong>Performance Cookies:</strong> Used to track anonymously how users interact with the app, helping us fix bugs and improve performance.</li>
            <li style={{ marginBottom: 8 }}><strong>Functionality Cookies:</strong> Remember your personalization settings, such as your dietary preferences or active phase.</li>
            <li><strong>Marketing Cookies:</strong> Used to provide you with relevant Wellness+ updates across the web.</li>
          </ul>

          <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 16 }}>3. Managing your cookies</h2>
          <p style={{ fontSize: 16, color: '#4A5568', lineHeight: 1.6 }}>
            You can set your browser not to accept cookies. However, because our Psychology AI and session tracking require cookies to remember your progress, some features of our app may not function properly if you disable them completely.
          </p>

        </div>
      </div>
    </div>
  );
}
