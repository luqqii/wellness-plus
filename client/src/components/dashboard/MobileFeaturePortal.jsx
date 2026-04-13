import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { NAV_ITEMS, FREE_TOOLS } from '../../utils/navigation';

export default function MobileFeaturePortal() {
  const navigate = useNavigate();

  // Combine relevant features for the portal grid
  const portalFeatures = [
    ...NAV_ITEMS.filter(item => 
      ['Daily Check-in', 'Courses', 'Weight Tracker', 'Group Sessions', 'Food Color Guide'].includes(item.label)
    ),
    ...FREE_TOOLS
  ];

  return (
    <div className="mobile-only-block" style={{ marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 800, color: 'var(--c-text-primary)' }}>Explore Wellness+</h3>
        <span style={{ fontSize: 12, color: 'var(--c-orange)', fontWeight: 600 }}>Quick Access</span>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(2, 1fr)', 
        gap: 10 
      }}>
        {portalFeatures.map((feature, i) => (
          <motion.div
            key={feature.path}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate(feature.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px',
              background: '#FFFFFF',
              borderRadius: 14,
              border: '1px solid #EAE6DF',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              cursor: 'pointer'
            }}
          >
            <div style={{ 
              width: 30, 
              height: 30, 
              borderRadius: 10, 
              background: feature.label.includes('Calculator') || feature.label.includes('Quiz') ? 'var(--c-orange-dim)' : 'var(--c-blue-dim)',
              color: feature.label.includes('Calculator') || feature.label.includes('Quiz') ? 'var(--c-orange)' : 'var(--c-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              {feature.icon ? <feature.icon size={16} /> : <div style={{width: 16, height: 16, background: 'currentColor', borderRadius: '50%'}} />}
            </div>
            
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ 
                fontSize: 12, 
                fontWeight: 700, 
                lineHeight: 1.25,
                color: 'var(--c-text-primary)'
              }}>
                {feature.label}
              </div>
              {feature.badge && (
                <span style={{ 
                  fontSize: 10, 
                  background: 'var(--c-blue)', 
                  color: 'white', 
                  padding: '1px 5px', 
                  borderRadius: 4,
                  fontWeight: 800
                }}>
                  {feature.badge}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
