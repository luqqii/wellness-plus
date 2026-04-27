import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Smartphone, Shield, LogOut, Download, Trash2, X, AlertTriangle, Loader2, CheckCircle2 } from 'lucide-react';
import useAuthStore from '../store/authStore';
import userService from '../services/userService';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Toggle({ on, onToggle }) {
  return (
    <button className={`toggle-track ${on ? 'on' : ''}`} onClick={onToggle}>
      <div className="toggle-thumb" />
    </button>
  );
}

const SETTINGS = {
  notifications: [
    { key: 'push',   label: 'Push Notifications', desc: 'Real-time alerts on your device' },
    { key: 'email',  label: 'Email Digest',        desc: 'Weekly progress summaries via email' },
    { key: 'daily',  label: 'Daily Reminders',     desc: 'Habit check-in reminders' },
    { key: 'weekly', label: 'Weekly Report',       desc: 'AI-generated health report every Monday' },
    { key: 'context',label: 'Context-Aware Nudges (Beta)', desc: 'AI suggestions based on local weather & location' },
  ],
};

export default function SettingsPage() {
  const { logout, user } = useAuthStore();
  const navigate = useNavigate();
  const [prefs, setPrefs] = useState({ push: true, email: true, daily: true, weekly: false, context: false, dataSharing: false });
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [toast, setToast] = useState(null); // { message, type: 'success'|'error' }

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const toggle = (key) => setPrefs(s => ({ ...s, [key]: !s[key] }));

  const handleExport = async () => {
    try {
      setIsExporting(true);
      
      const [habitsRes, metricsRes] = await Promise.all([
         api.get('/habits'),
         api.get('/metrics/trend?days=365')
      ]);

      const exportData = { 
        user: { name: user?.name, email: user?.email, joined: user?.createdAt }, 
        exportedAt: new Date().toISOString(), 
        app: 'Wellness+',
        habits: habitsRes.data,
        metrics: metricsRes.data
      };

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `wellness_plus_data_${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showToast('Data exported successfully!');
    } catch (err) {
      showToast('Failed to export data: ' + err.message, 'error');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setIsDeleting(true);
      await userService.deleteAccount();
      logout();
      navigate('/signup');
    } catch (err) {
      showToast('Failed to delete account: ' + err.message, 'error');
      setShowConfirm(false);
    } finally {
      setIsDeleting(false);
    }
  };

  const S = ({ title, children }) => (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ marginBottom: 16 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-text-primary)', marginBottom: 16 }}>{title}</div>
      {children}
    </motion.div>
  );

  const Row = ({ label, desc, right }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--c-text-primary)' }}>{label}</div>
        {desc && <div style={{ fontSize: 11, color: 'var(--c-text-muted)', marginTop: 2 }}>{desc}</div>}
      </div>
      {right}
    </div>
  );

  return (
    <div style={{ maxWidth: 640, position: 'relative' }}>
      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.95 }}
            style={{
              position: 'fixed', top: 20, right: 20, zIndex: 9999,
              padding: '12px 18px', borderRadius: 14,
              background: toast.type === 'error' ? 'rgba(255,91,91,0.15)' : 'rgba(0,212,170,0.15)',
              border: `1px solid ${toast.type === 'error' ? 'rgba(255,91,91,0.3)' : 'rgba(0,212,170,0.3)'}`,
              backdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', gap: 10,
              fontSize: 13, fontWeight: 500, color: 'var(--c-text-primary)',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            }}
          >
            <CheckCircle2 size={16} color={toast.type === 'error' ? 'var(--c-red)' : 'var(--c-teal)'} />
            {toast.message}
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.5px', color: 'var(--c-text-primary)' }}>Settings</h1>
        <p style={{ fontSize: 13, color: 'var(--c-text-muted)', marginTop: 4 }}>Manage your Wellness+ preferences</p>
      </div>

      <S title="🔔 Notifications">
        {SETTINGS.notifications.map(n => (
          <Row key={n.key} label={n.label} desc={n.desc} right={<Toggle on={prefs[n.key]} onToggle={() => toggle(n.key)} />} />
        ))}
      </S>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>

      <S title="🔒 Privacy & Data">
        <Row
          label="Anonymous Data Sharing"
          desc="Help improve Wellness+ recommendations for everyone"
          right={<Toggle on={prefs.dataSharing} onToggle={() => toggle('dataSharing')} />}
        />
        <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px',
              borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: 'rgba(255,255,255,0.05)', border: '1px solid var(--c-border)',
              color: 'var(--c-text-secondary)',
              opacity: isExporting ? 0.6 : 1
            }}
          >
            {isExporting ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />} 
            {isExporting ? 'Exporting...' : 'Export My Data'}
          </button>
          <button 
            onClick={() => setShowConfirm(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '9px 14px',
              borderRadius: 10, fontSize: 12, fontWeight: 600, cursor: 'pointer',
              background: 'rgba(255,91,91,0.08)', border: '1px solid rgba(255,91,91,0.2)',
              color: 'var(--c-red)',
            }}
          >
            <Trash2 size={14} /> Delete Account
          </button>
        </div>
      </S>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
          background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
          padding: 20
        }}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-card" 
            style={{ maxWidth: 400, width: '100%', padding: 24, textAlign: 'center' }}
          >
            <div style={{ 
              width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,91,91,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
            }}>
              <AlertTriangle color="var(--c-red)" size={28} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Permanent Account Deletion</h3>
            <p style={{ fontSize: 14, color: 'var(--c-text-muted)', marginBottom: 24, lineHeight: 1.5 }}>
              Are you sure you want to delete your account? This action is <b>irreversible</b> and all your wellness data will be permanently wiped.
            </p>
            
            <div style={{ display: 'flex', gap: 12 }}>
              <button 
                onClick={() => setShowConfirm(false)}
                disabled={isDeleting}
                style={{
                  flex: 1, padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                  background: 'rgba(255,255,255,0.05)', border: '1px solid var(--c-border)',
                  color: 'var(--c-text-primary)', cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button 
                onClick={handleDeleteAccount}
                disabled={isDeleting}
                style={{
                  flex: 1, padding: '12px', borderRadius: 12, fontSize: 14, fontWeight: 600,
                  background: 'var(--c-red)', border: 'none',
                  color: 'white', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                }}
              >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : null}
                {isDeleting ? 'Deleting...' : 'Yes, Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      <button
        onClick={logout}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, width: '100%',
          justifyContent: 'center', padding: '12px',
          background: 'transparent', border: '1px solid var(--c-border)',
          borderRadius: 12, fontSize: 14, fontWeight: 600, cursor: 'pointer',
          color: 'var(--c-text-muted)', transition: 'all 200ms ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = 'var(--c-red)'; e.currentTarget.style.borderColor = 'rgba(255,91,91,0.3)'; }}
        onMouseLeave={e => { e.currentTarget.style.color = 'var(--c-text-muted)'; e.currentTarget.style.borderColor = 'var(--c-border)'; }}
      >
        <LogOut size={15} /> Sign Out
      </button>
    </div>
  );
}
