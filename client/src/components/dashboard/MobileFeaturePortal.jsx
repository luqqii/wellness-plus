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
        gap: 12 
      }}>
        {portalFeatures.map((feature, i) => (
          <motion.div
            key={feature.path}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate(feature.path)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '14px',
              background: '#FFFFFF',
              borderRadius: 16,
              border: '1px solid #EAE6DF',
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
              cursor: 'pointer'
            }}
          >
            <div style={{ 
              width: 32, 
              height: 32, 
              borderRadius: 10, 
              background: feature.label.includes('Calculator') || feature.label.includes('Quiz') ? 'var(--c-orange-dim)' : 'var(--c-blue-dim)',
              color: feature.label.includes('Calculator') || feature.label.includes('Quiz') ? 'var(--c-orange)' : 'var(--c-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <feature.icon size={18} />
            </div>
            
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ 
                fontSize: 13, 
                fontWeight: 700, 
                color: 'var(--c-text-primary)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
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
