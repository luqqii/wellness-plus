import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Watch, Smartphone, Heart, Calendar, Activity, RefreshCw, Bluetooth, CheckCircle2, XCircle, Loader2, Zap, X, AlertTriangle, Link } from 'lucide-react';
import useMetricsStore from '../store/metricsStore';

// Per-source metadata
const SOURCES_META = [
  { id: 'apple',    name: 'Apple Health',    color: '#FF2D55', Icon: Heart,      desc: 'Sync steps, sleep, and vitals from your iPhone and Apple Watch.', connectMethod: 'oauth', oauthNote: 'Requires iPhone or iPad with Apple Health app.' },
  { id: 'google',   name: 'Google Fit',      color: '#4285F4', Icon: Activity,   desc: 'Connect to sync activity data from Android devices.',              connectMethod: 'oauth', oauthNote: 'Requires a Google account with Fit enabled.' },
  { id: 'garmin',   name: 'Garmin Connect',  color: '#0B6EFD', Icon: Watch,      desc: 'Import workouts and advanced recovery metrics from Garmin.',       connectMethod: 'oauth', oauthNote: 'Connects via Garmin Cloud Health API.' },
  { id: 'oura',     name: 'Oura Ring',       color: '#7C3AED', Icon: Smartphone, desc: 'Sync detailed sleep stages and readiness scores.',                  connectMethod: 'oauth', oauthNote: 'Requires Oura account and Ring gen 3+.' },
  { id: 'calendar', name: 'Google Calendar', color: '#FABB05', Icon: Calendar,   desc: 'Sync your schedule to power Context-Aware Suggestions.',            connectMethod: 'oauth', oauthNote: 'Read-only access to your calendar events.' },
];

// Simple Toast Component
function Toast({ message, type, onDismiss }) {
  useEffect(() => { const t = setTimeout(onDismiss, 4000); return () => clearTimeout(t); }, [onDismiss]);
  const colors = { success: '#14B8A6', error: '#EF4444', info: '#4F8DFF' };
  const Icons = { success: CheckCircle2, error: XCircle, info: Zap };
  const Icon = Icons[type] || Zap;
  return (
    <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}
      style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 14, background: 'var(--c-bg-card)', border: `1px solid ${colors[type]}40`, boxShadow: '0 8px 32px rgba(0,0,0,0.2)', minWidth: 260, maxWidth: 360 }}>
      <Icon size={18} color={colors[type]} style={{ flexShrink: 0 }} />
      <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--c-text-primary)', flex: 1 }}>{message}</span>
      <button onClick={onDismiss} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-text-muted)', padding: 2 }}><X size={14} /></button>
    </motion.div>
  );
}

// OAuth Consent Modal
function OAuthModal({ source, onConfirm, onCancel, loading }) {
  if (!source) return null;
  const { Icon, color, name, oauthNote } = source;
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        style={{ background: 'var(--c-bg-card)', borderRadius: 20, padding: 32, maxWidth: 420, width: '100%', border: `1px solid ${color}40`, boxShadow: '0 24px 48px rgba(0,0,0,0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={26} color={color} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--c-text-primary)' }}>Connect {name}</div>
            <div style={{ fontSize: 13, color: 'var(--c-text-muted)', marginTop: 2 }}>{oauthNote}</div>
          </div>
        </div>
        <div style={{ background: 'var(--c-bg-secondary)', borderRadius: 12, padding: '14px 16px', marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 800, textTransform: 'uppercase', color: 'var(--c-text-muted)', marginBottom: 8 }}>Data Wellness+ will access:</div>
          {['Daily step count & activity minutes', 'Sleep duration & quality scores', 'Heart rate & stress indicators', 'Workout history & recovery metrics'].map(p => (
            <div key={p} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <CheckCircle2 size={14} color={color} />
              <span style={{ fontSize: 13, color: 'var(--c-text-secondary)' }}>{p}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={onCancel} disabled={loading} style={{ flex: 1, padding: '12px 0', borderRadius: 12, background: 'var(--c-bg-secondary)', border: '1px solid var(--c-border)', fontSize: 14, fontWeight: 700, cursor: 'pointer', color: 'var(--c-text-secondary)' }}>Cancel</button>
          <button onClick={onConfirm} disabled={loading}
            style={{ flex: 2, padding: '12px 0', borderRadius: 12, background: color, border: 'none', fontSize: 14, fontWeight: 800, cursor: 'pointer', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            {loading ? <><Loader2 size={16} className="animate-spin" /> Authorizing…</> : <><Link size={16} /> Authorize & Connect</>}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function CrossSourceDataSyncPage() {
  const fetchMetrics = useMetricsStore(s => s.fetchData);
  const [sources, setSources] = useState(SOURCES_META.map(s => ({ ...s, connected: false, lastSync: null })));
  const [togglingId, setTogglingId] = useState(null);
  const [syncingId, setSyncingId] = useState(null);
  const [syncingAll, setSyncingAll] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [oauthModal, setOauthModal] = useState(null); // source meta
  const [oauthLoading, setOauthLoading] = useState(false);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  }, []);

  const removeToast = useCallback((id) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  // Load saved integrations on mount
  useEffect(() => {
    const load = async () => {
      try {
        const { default: api } = await import('../services/api');
        const res = await api.get('/users/profile');
        const userIntegrations = res?.integrations || [];
        if (userIntegrations.length > 0) {
          setSources(prev => prev.map(s => {
            const match = userIntegrations.find(i => i.provider === s.id);
            return match ? { ...s, connected: true, lastSync: new Date(match.lastSync).toLocaleString() } : s;
          }));
        }
      } catch (e) { console.error('[DataSync] Load failed:', e); }
    };
    load();
  }, []);

  // Refresh metrics store after any sync
  const refreshMetrics = useCallback(async () => {
    try {
      const { default: api } = await import('../services/api');
      await fetchMetrics(api);
    } catch (e) { console.warn('[DataSync] Metrics refresh failed:', e); }
  }, [fetchMetrics]);

  // Real OAuth connect flow using popup
  const handleOAuthConnect = () => {
    if (!oauthModal) return;
    setOauthLoading(true);

    // Get current session token to pass to popup so backend knows who to link
    // Wellness+ stores token in localStorage or cookie depending on auth. We'll try both or let interceptor handle it
    const sessionToken = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1] || '';
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';
    const authUrl = `${backendUrl}/integrations/auth/${oauthModal.id}?token=${sessionToken}`;

    // Open popup
    const popup = window.open(authUrl, `Connect ${oauthModal.name}`, 'width=500,height=600');
    
    // Fallback if popup blocked
    if (!popup) {
      addToast('Popup blocked! Please allow popups for this site.', 'error');
      setOauthLoading(false);
      return;
    }

    // Set timeout in case user closes it or it hangs
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        if (oauthLoading) setOauthLoading(false); // Only if it wasn't successful
      }
    }, 1000);
  };

  // Listen for OAuth success from popup
  useEffect(() => {
    const handleMessage = async (event) => {
      // In production, verify event.origin here!
      if (event.data?.type === 'OAUTH_SUCCESS') {
        const { provider } = event.data;
        addToast(`Successfully connected to ${provider}! Initial sync in progress…`, 'success');
        
        // Refresh local UI state
        setOauthModal(null);
        setOauthLoading(false);
        
        try {
          const { default: api } = await import('../services/api');
          const res = await api.get('/users/profile');
          const userIntegrations = res?.integrations || [];
          setSources(prev => prev.map(s => {
            const match = userIntegrations.find(i => i.provider === s.id);
            return match ? { ...s, connected: true, lastSync: new Date(match.lastSync).toLocaleString() } : s;
          }));
        } catch (e) {
          console.error('[DataSync] Failed to fetch updated profile:', e);
        }
        
        setTimeout(refreshMetrics, 1500);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [addToast, refreshMetrics]);

  // Toggle connection (entry point — routes to OAuth or BT modal)
  const handleToggle = async (source) => {
    if (togglingId) return;
    if (source.connected) {
      // Disconnect
      setTogglingId(source.id);
      try {
        const { default: api } = await import('../services/api');
        const res = await api.post(`/integrations/${source.id}/toggle`);
        const integrations = res?.integrations || [];
        setSources(prev => prev.map(s => {
          const match = integrations.find(i => i.provider === s.id);
          return { ...s, connected: !!match, lastSync: match ? new Date(match.lastSync).toLocaleString() : null };
        }));
        addToast(`${source.name} disconnected.`, 'info');
      } catch (e) {
        addToast(`Failed to disconnect ${source.name}: ${e.message}`, 'error');
      } finally {
        setTogglingId(null);
      }
    } else {
      // Connect — show OAuth modal
      setOauthModal(source);
    }
  };

  // Per-provider sync
  const handleSync = async (source) => {
    if (syncingId) return;
    setSyncingId(source.id);
    try {
      const { default: api } = await import('../services/api');
      const res = await api.post(`/integrations/${source.id}/sync`);
      const integrations = res?.integrations || [];
      setSources(prev => prev.map(s => {
        const match = integrations.find(i => i.provider === s.id);
        return match ? { ...s, lastSync: 'Just now' } : s;
      }));
      addToast(`${source.name} synced — data updated!`, 'success');
      await refreshMetrics();
    } catch (e) {
      addToast(`Sync failed for ${source.name}: ${e.message}`, 'error');
    } finally {
      setSyncingId(null);
    }
  };

  // Sync all
  const handleSyncAll = async () => {
    const connected = sources.filter(s => s.connected);
    if (connected.length === 0) { addToast('Connect at least one source to sync.', 'info'); return; }
    setSyncingAll(true);
    try {
      const { default: api } = await import('../services/api');
      const res = await api.post('/integrations/sync-all');
      const integrations = res?.integrations || [];
      setSources(prev => prev.map(s => {
        const match = integrations.find(i => i.provider === s.id);
        return match ? { ...s, lastSync: 'Just now' } : s;
      }));
      addToast(res?.message || 'All sources synced!', 'success');
      await refreshMetrics();
    } catch (e) {
      addToast(e.message || 'Sync All failed. Check your connections.', 'error');
    } finally {
      setSyncingAll(false);
    }
  };

  const connectedCount = sources.filter(s => s.connected).length;

  return (
    <div style={{ maxWidth: 960, margin: '0 auto', padding: '24px', paddingBottom: 100 }}>
      {/* Toast Container */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 2000, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <AnimatePresence>
          {toasts.map(t => <Toast key={t.id} message={t.message} type={t.type} onDismiss={() => removeToast(t.id)} />)}
        </AnimatePresence>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {oauthModal && <OAuthModal source={oauthModal} onConfirm={handleOAuthConnect} onCancel={() => setOauthModal(null)} loading={oauthLoading} />}
      </AnimatePresence>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h1 style={{ fontSize: 30, fontWeight: 900, color: 'var(--c-text-primary)', margin: '0 0 8px' }}>Data Sync</h1>
            <p style={{ fontSize: 15, color: 'var(--c-text-secondary)', margin: 0, maxWidth: 560 }}>
              Connect health platforms and wearables to fuel AI-powered insights. Data syncs directly into your Dashboard and Predictive Insights.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <button onClick={handleSyncAll} disabled={syncingAll || connectedCount === 0}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 14, background: connectedCount === 0 ? 'var(--c-bg-secondary)' : 'var(--c-purple)', color: connectedCount === 0 ? 'var(--c-text-muted)' : 'white', border: 'none', fontSize: 14, fontWeight: 800, cursor: connectedCount === 0 ? 'not-allowed' : 'pointer' }}>
              {syncingAll ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
              {syncingAll ? 'Syncing…' : 'Sync All Now'}
            </button>
            {connectedCount > 0 && <span style={{ fontSize: 12, color: 'var(--c-text-muted)' }}>{connectedCount} source{connectedCount !== 1 ? 's' : ''} connected</span>}
          </div>
        </div>
      </motion.div>

      {/* Status Bar */}
      {connectedCount === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 18px', borderRadius: 14, background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.2)', marginBottom: 24 }}>
          <AlertTriangle size={16} color="#EAB308" />
          <span style={{ fontSize: 13, color: '#EAB308', fontWeight: 600 }}>No sources connected yet. Toggle a device below to connect and start syncing data.</span>
        </motion.div>
      )}

      {/* Source Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
        {sources.map((source, idx) => {
          const { Icon, color, id, name, desc, connected, lastSync, connectMethod } = source;
          const isToggling = togglingId === id;
          const isSyncing = syncingId === id;

          return (
            <motion.div key={id} variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } }}
              initial="hidden" animate="show" transition={{ delay: idx * 0.06 }}
              className="glass-card"
              style={{ padding: 24, border: connected ? `1px solid ${color}40` : '1px solid var(--c-border)', position: 'relative', overflow: 'hidden' }}>

              {/* Connected pulse dot */}
              {connected && (
                <div style={{ position: 'absolute', top: 14, right: 14, width: 8, height: 8, borderRadius: '50%', background: '#22C55E', boxShadow: '0 0 0 3px rgba(34,197,94,0.2)', animation: 'pulse-dot 1.4s ease infinite alternate' }} />
              )}

              {/* Header Row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 46, height: 46, borderRadius: 13, background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={22} color={color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--c-text-primary)' }}>{name}</div>
                    <div style={{ fontSize: 11, color: connected ? '#22C55E' : 'var(--c-text-muted)', fontWeight: 700, marginTop: 2 }}>
                      {connected ? `Synced: ${lastSync || 'recently'}` : connectMethod === 'bluetooth' ? '📶 Bluetooth LE' : '🔐 OAuth'}
                    </div>
                  </div>
                </div>

                {/* Toggle Switch */}
                <div onClick={() => !isToggling && handleToggle(source)} style={{ width: 48, height: 26, borderRadius: 13, background: connected ? color : 'var(--c-border-strong)', position: 'relative', cursor: isToggling ? 'wait' : 'pointer', transition: 'background 0.2s', flexShrink: 0 }}>
                  {isToggling
                    ? <Loader2 size={14} color="white" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} className="animate-spin" />
                    : <motion.div layout initial={false} animate={{ x: connected ? 24 : 2 }}
                        style={{ width: 22, height: 22, borderRadius: '50%', background: 'white', position: 'absolute', top: 2, boxShadow: '0 2px 4px rgba(0,0,0,0.25)' }} />
                  }
                </div>
              </div>

              {/* Description */}
              <p style={{ fontSize: 13, color: 'var(--c-text-secondary)', lineHeight: 1.6, margin: '0 0 14px' }}>{desc}</p>

              {/* Sync button — only when connected */}
              {connected && (
                <button onClick={() => handleSync(source)} disabled={isSyncing}
                  style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '7px 14px', borderRadius: 10, background: `${color}12`, border: `1px solid ${color}30`, color, fontSize: 12, fontWeight: 800, cursor: isSyncing ? 'wait' : 'pointer' }}>
                  {isSyncing ? <><Loader2 size={12} className="animate-spin" /> Syncing…</> : <><RefreshCw size={12} /> Sync Now</>}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      <style>{`
        @keyframes pulse-dot { from { opacity: 0.5; transform: scale(0.9); } to { opacity: 1; transform: scale(1.1); } }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
