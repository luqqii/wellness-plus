import React from 'react';
import { useNavigate } from 'react-router-dom';

const SECTION = ({ title, children }) => (
  <div style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid #E8DED8' }}>{title}</h2>
    <div style={{ fontSize: 16, color: '#4A5568', lineHeight: 1.8 }}>{children}</div>
  </div>
);

export default function PrivacyPage() {
  const navigate = useNavigate();
  return (
    <div style={{ background: '#FFF3EB', minHeight: '100vh', color: '#0C2B35', fontFamily: '"Nunito", "Inter", sans-serif' }}>
      <nav style={{ padding: '0 5%', height: 80, display: 'flex', alignItems: 'center', borderBottom: '1px solid #E8DED8', background: '#FFFFFF' }}>
        <div style={{ fontSize: 26, fontWeight: 800, cursor: 'pointer' }} onClick={() => navigate('/')}>Wellness+</div>
      </nav>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 20px' }}>
        <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-1px', marginBottom: 12 }}>Privacy Policy</h1>
        <p style={{ color: '#718096', marginBottom: 60, fontSize: 15 }}>Last Updated: April 1, 2025</p>
        <SECTION title="1. Information We Collect">
          We collect information you provide directly to us including your name, email address, password, date of birth, height, weight, and health goals. We also collect data on how you interact with our app including lesson completion, food logs, and exercise records.
        </SECTION>
        <SECTION title="2. How We Use Your Information">
          We use your information to provide and improve the Wellness+ service, personalize your experience, communicate with you, and conduct research to improve our psychology-based methodology. We never sell your personal health data to third parties.
        </SECTION>
        <SECTION title="3. Data Sharing">
          We do not sell, trade, rent, or share your personally identifiable health information with third parties for marketing purposes. We may share aggregated, de-identified data with research partners to advance the science of behavioral health.
        </SECTION>
        <SECTION title="4. Data Security">
          We implement industry-standard encryption and security measures including AES-256 encryption at rest and TLS  in transit. Your health data is stored on SOC 2 Type II certified infrastructure.
        </SECTION>
        <SECTION title="5. Your Rights">
          You have the right to access, correct, or delete your personal data at any time. You may export your complete data history from the Settings panel. To request permanent account deletion, contact privacy@wellnessplus.com.
        </SECTION>
        <SECTION title="6. Contact Us">
          Privacy Officer: Wellness+ Inc., 123 Wellness Way, Suite 100, New York, NY 10001<br/>
          Email: privacy@wellnessplus.com
        </SECTION>
      </div>
    </div>
  );
}
