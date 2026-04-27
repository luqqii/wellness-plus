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
        style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }} 
      />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }} 
        animate={{ opacity: 1, scale: 1, y: 0 }} 
        style={{ position: 'relative', background: 'var(--c-bg-primary)', borderRadius: 24, padding: 32, width: '100%', maxWidth: 400, boxShadow: '0 24px 48px rgba(0,0,0,0.2)' }}
      >
        <button onClick={onClose} style={{ position: 'absolute', top: 20, right: 20, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-text-muted)' }}>
          <X size={20} />
        </button>

        <h2 style={{ fontSize: 22, fontWeight: 900, color: 'var(--c-text-primary)', marginBottom: 8, marginTop: 0 }}>Log Metrics Manually</h2>
        <p style={{ fontSize: 14, color: 'var(--c-text-secondary)', marginBottom: 24, marginTop: 0 }}>
          Override your daily data if your wearable didn't sync correctly.
        </p>

        {/* Steps Input */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--c-teal)', marginBottom: 8 }}>
            <Footprints size={14} /> Step Count
          </label>
          <input 
            type="number" 
            value={steps} 
            onChange={e => setSteps(e.target.value)}
            placeholder="e.g. 10000"
            style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid var(--c-border)', fontSize: 16, fontWeight: 600, color: 'var(--c-text-primary)', background: 'var(--c-bg-secondary)', boxSizing: 'border-box' }}
          />
        </div>

        {/* Sleep Input */}
        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 700, color: 'var(--c-purple)', marginBottom: 8 }}>
            <Moon size={14} /> Hours of Sleep
          </label>
          <input 
            type="number" 
            step="0.1"
            value={sleep} 
            onChange={e => setSleep(e.target.value)}
            placeholder="e.g. 7.5"
            style={{ width: '100%', padding: '14px 16px', borderRadius: 12, border: '1px solid var(--c-border)', fontSize: 16, fontWeight: 600, color: 'var(--c-text-primary)', background: 'var(--c-bg-secondary)', boxSizing: 'border-box' }}
          />
        </div>

        <button 
          onClick={handleSave}
          disabled={isSaving || success}
          style={{ width: '100%', padding: '16px', borderRadius: 14, background: success ? '#22C55E' : 'var(--c-text-primary)', color: 'var(--c-bg-primary)', border: 'none', fontSize: 16, fontWeight: 800, cursor: (isSaving || success) ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}
        >
          {isSaving ? <Loader2 size={18} className="animate-spin" /> : success ? <Check size={18} /> : null}
          {isSaving ? 'Saving...' : success ? 'Saved!' : 'Save Metrics'}
        </button>
      </motion.div>
    </div>
  );
}
