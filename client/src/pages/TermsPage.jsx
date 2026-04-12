import React from 'react';
import { useNavigate } from 'react-router-dom';

const SECTION = ({ title, children }) => (
  <div style={{ marginBottom: 48 }}>
    <h2 style={{ fontSize: 22, fontWeight: 800, marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid #E8DED8' }}>{title}</h2>
    <div style={{ fontSize: 16, color: '#4A5568', lineHeight: 1.8 }}>{children}</div>
  </div>
);

export default function TermsPage() {
  const navigate = useNavigate();
  return (
    <div style={{ background: '#FFF3EB', minHeight: '100vh', color: '#0C2B35', fontFamily: '"Nunito", "Inter", sans-serif' }}>
      <nav style={{ padding: '0 5%', height: 80, display: 'flex', alignItems: 'center', borderBottom: '1px solid #E8DED8', background: '#FFFFFF' }}>
        <div style={{ fontSize: 26, fontWeight: 800, cursor: 'pointer' }} onClick={() => navigate('/')}>Wellness+</div>
      </nav>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '80px 20px' }}>
        <h1 style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-1px', marginBottom: 12 }}>Terms & Conditions</h1>
        <p style={{ color: '#718096', marginBottom: 60, fontSize: 15 }}>Last Updated: April 1, 2025</p>
        <SECTION title="1. Acceptance of Terms">
          By accessing or using Wellness+, you agree to be bound by these Terms and Conditions. If you do not agree, you may not use our services.
        </SECTION>
        <SECTION title="2. Description of Service">
          Wellness+ provides a psychology-based health and wellness platform including personalized lesson curricula, AI coaching, food logging, and habit tracking. The service is not a substitute for professional medical advice.
        </SECTION>
        <SECTION title="3. User Accounts">
          You must be 18 years or older to create an account. You are responsible for maintaining the confidentiality of your account credentials. Wellness+ reserves the right to terminate accounts that violate these terms.
        </SECTION>
        <SECTION title="4. Subscriptions & Billing">
          Wellness+ offers monthly and annual subscription plans. All subscriptions automatically renew unless canceled. You may cancel at any time from your account Settings page. Refunds are available within 14 days of initial purchase only.
        </SECTION>
        <SECTION title="5. Intellectual Property">
          All content, curricula, algorithms, and software within Wellness+ are the exclusive intellectual property of Wellness+ Inc. Unauthorized reproduction or commercial use is strictly prohibited.
        </SECTION>
        <SECTION title="6. Limitation of Liability">
          Wellness+ is NOT a medical device or healthcare provider. Always consult a licensed physician before making significant dietary changes. Wellness+ Inc. is not liable for health outcomes.
        </SECTION>
        <SECTION title="7. Contact">
          Legal Inquiries: legal@wellnessplus.com
        </SECTION>
      </div>
    </div>
  );
}
