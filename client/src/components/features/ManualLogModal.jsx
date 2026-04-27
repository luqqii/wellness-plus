import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Footprints, Moon, X, Check, Loader2 } from 'lucide-react';
import useMetricsStore from '../../store/metricsStore';
import api from '../../services/api';

export default function ManualLogModal({ isOpen, onClose }) {
  const { todayMetrics, liveSensors, saveManualMetrics } = useMetricsStore();
  const [steps, setSteps] = useState('');
  const [sleep, setSleep] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Initialize with current values when opened
  useEffect(() => {
    if (isOpen) {
      setSteps(liveSensors?.steps || todayMetrics?.steps || 0);
      setSleep(todayMetrics?.sleep?.hours || 0);
      setSuccess(false);
    }
  }, [isOpen, liveSensors?.steps, todayMetrics?.steps, todayMetrics?.sleep?.hours]);

  if (!isOpen) return null;

  const handleSave = async () => {
    setIsSaving(true);
    const result = await saveManualMetrics(api, {
      steps: steps === '' ? undefined : Number(steps),
      sleepHours: sleep === '' ? undefined : Number(sleep),
    });
    
    setIsSaving(false);
    if (result) {
      setSuccess(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    }
  };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)' }} 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        style={{ 
          position: 'relative', 
          background: 'var(--c-bg-card)', 
          borderRadius: 24, 
          padding: 32, 
          width: '100%', 
          maxWidth: 420, 
          boxShadow: '0 24px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
          border: '1px solid var(--c-border)'
        }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: 24, right: 24, background: 'var(--c-bg-secondary)', border: 'none', cursor: 'pointer', color: 'var(--c-text-muted)', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--c-text-primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--c-text-muted)'}>
          <X size={18} />
        </button>

        <h2 style={{ fontSize: 24, fontWeight: 900, color: 'var(--c-text-primary)', marginBottom: 8, marginTop: 0, letterSpacing: '-0.5px' }}>Log Metrics Manually</h2>
        <p style={{ fontSize: 14, color: 'var(--c-text-secondary)', marginBottom: 28, marginTop: 0, lineHeight: 1.5 }}>
          Override your daily data if your wearable didn't sync correctly.
        </p>

        {/* Steps Input */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--c-teal)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <Footprints size={14} /> Step Count
          </label>
          <input 
            type="number" 
            value={steps} 
            onChange={e => setSteps(e.target.value)}
            placeholder="e.g. 10000"
            style={{ 
              width: '100%', padding: '16px 20px', borderRadius: 16, 
              border: '2px solid transparent', 
              fontSize: 18, fontWeight: 700, color: 'var(--c-text-primary)', 
              background: 'var(--c-bg-hover)', boxSizing: 'border-box',
              outline: 'none', transition: 'all 0.2s',
              fontFamily: 'inherit'
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--c-teal)'}
            onBlur={e => e.currentTarget.style.borderColor = 'transparent'}
          />
        </div>

        {/* Sleep Input */}
        <div style={{ marginBottom: 32 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--c-purple)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            <Moon size={14} /> Hours of Sleep
          </label>
          <input 
            type="number" 
            step="0.1"
            value={sleep} 
            onChange={e => setSleep(e.target.value)}
            placeholder="e.g. 7.5"
            style={{ 
              width: '100%', padding: '16px 20px', borderRadius: 16, 
              border: '2px solid transparent', 
              fontSize: 18, fontWeight: 700, color: 'var(--c-text-primary)', 
              background: 'var(--c-bg-hover)', boxSizing: 'border-box',
              outline: 'none', transition: 'all 0.2s',
              fontFamily: 'inherit'
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--c-purple)'}
            onBlur={e => e.currentTarget.style.borderColor = 'transparent'}
          />
        </div>

        <button 
          onClick={handleSave}
          disabled={isSaving || success}
          style={{ 
            width: '100%', padding: '18px', borderRadius: 16, 
            background: success ? '#22C55E' : 'linear-gradient(135deg, var(--c-teal), var(--c-blue))', 
            color: '#fff', border: 'none', fontSize: 16, fontWeight: 800, 
            cursor: (isSaving || success) ? 'default' : 'pointer', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, 
            transition: 'all 0.2s', boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
          }}
          onMouseEnter={e => { if(!isSaving && !success) e.currentTarget.style.transform = 'translateY(-2px)'; }}
          onMouseLeave={e => { if(!isSaving && !success) e.currentTarget.style.transform = 'none'; }}
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : success ? <Check size={18} /> : null}
          {isSaving ? 'Saving Data...' : success ? 'Successfully Saved!' : 'Save Metrics'}
        </button>
      </motion.div>
    </div>
  );
}
