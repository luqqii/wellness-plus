import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Watch, Smartphone, Heart, Calendar, Activity, RefreshCw } from 'lucide-react';

export default function CrossSourceDataSyncPage() {
  const [sources, setSources] = useState([
    { id: 'apple', name: 'Apple Health', icon: <Heart size={24} color="#FF2D55" />, connected: true, lastSync: '10 mins ago', desc: 'Sync steps, sleep, and vitals from your iPhone and Apple Watch.' },
    { id: 'google', name: 'Google Fit', icon: <Activity size={24} color="#4285F4" />, connected: false, lastSync: null, desc: 'Connect to sync activity data from Android devices.' },
    { id: 'garmin', name: 'Garmin Connect', icon: <Watch size={24} color="#000000" />, connected: false, lastSync: null, desc: 'Import workouts and advanced recovery metrics from Garmin.' },
    { id: 'oura', name: 'Oura Ring', icon: <Smartphone size={24} color="#1F2937" />, connected: false, lastSync: null, desc: 'Sync detailed sleep stages and readiness scores.' },
    { id: 'calendar', name: 'Google Calendar', icon: <Calendar size={24} color="#FABB05" />, connected: true, lastSync: '1 hour ago', desc: 'Sync your schedule to power Context-Aware Suggestions.' },
  ]);

  const [syncing, setSyncing] = useState(false);

  const toggleConnection = (id) => {
    setSources(sources.map(s => s.id === id ? { ...s, connected: !s.connected, lastSync: !s.connected ? 'Just now' : null } : s));
  };

  const handleSyncAll = () => {
    setSyncing(true);
    setTimeout(() => {
      setSources(sources.map(s => s.connected ? { ...s, lastSync: 'Just now' } : s));
      setSyncing(false);
    }, 1500);
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div>
          <h1 style={{ fontSize: '32px', fontWeight: 900, color: 'var(--c-text-primary)', marginBottom: '8px' }}>Cross-Source Data Sync</h1>
          <p style={{ fontSize: '16px', color: 'var(--c-text-secondary)', maxWidth: '600px' }}>
            Pull data seamlessly from wearables, calendars, and health apps to fuel your Predictive Insights and AI Coach.
          </p>
        </div>
        <button 
          onClick={handleSyncAll} 
          disabled={syncing}
          className="btn-primary" 
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <RefreshCw size={18} className={syncing ? 'spin' : ''} />
          {syncing ? 'Syncing...' : 'Sync Now'}
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px' }}>
        {sources.map(source => (
          <motion.div 
            key={source.id}
            whileHover={{ y: -4 }}
            className="glass-card"
            style={{ 
              padding: '24px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '16px',
              border: source.connected ? '1px solid var(--c-teal)' : '1px solid var(--c-border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: 48, height: 48, borderRadius: '12px', background: 'var(--c-bg-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {source.icon}
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--c-text-primary)' }}>{source.name}</div>
                  <div style={{ fontSize: '12px', color: 'var(--c-text-muted)' }}>
                    {source.connected ? `Last synced: ${source.lastSync}` : 'Not connected'}
                  </div>
                </div>
              </div>
              
              {/* Custom Toggle Switch */}
              <div 
                onClick={() => toggleConnection(source.id)}
                style={{
                  width: '44px', height: '24px', borderRadius: '12px', 
                  background: source.connected ? 'var(--c-teal)' : 'var(--c-border-strong)',
                  position: 'relative', cursor: 'pointer', transition: 'background 0.2s'
                }}
              >
                <motion.div 
                  layout
                  initial={false}
                  animate={{ x: source.connected ? 22 : 2 }}
                  style={{
                    width: '20px', height: '20px', borderRadius: '50%', background: 'white',
                    position: 'absolute', top: '2px', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                  }}
                />
              </div>
            </div>
            
            <p style={{ fontSize: '14px', color: 'var(--c-text-secondary)', lineHeight: 1.5, margin: 0 }}>
              {source.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
