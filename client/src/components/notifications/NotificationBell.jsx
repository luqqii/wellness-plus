import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Check, CheckCheck, Zap, Heart, Target, Brain, X } from 'lucide-react';
import { formatRelativeTime } from '../../utils/formatters';

const MOCK_NOTIFICATIONS = [
  { id: 1, type: 'coach',   title: 'AI Insight Ready',       body: 'Your stress forecast for this week is ready.',         time: new Date(Date.now() - 1000*60*5),  read: false },
  { id: 2, type: 'habit',   title: 'Habit Streak! 🔥',        body: 'You\'ve completed Morning Run for 7 days straight.',   time: new Date(Date.now() - 1000*60*30), read: false },
  { id: 3, type: 'goal',    title: 'Goal Milestone',          body: 'You\'re 80% towards your weekly step goal!',           time: new Date(Date.now() - 1000*60*90), read: true  },
  { id: 4, type: 'health',  title: 'Recovery Tip',            body: 'Your HRV suggests a rest day tomorrow would help.',    time: new Date(Date.now() - 1000*60*60*3), read: true },
];

const TYPE_ICONS = {
  coach:  { Icon: Brain,  color: 'var(--c-purple)' },
  habit:  { Icon: Zap,    color: 'var(--c-orange)' },
  goal:   { Icon: Target, color: 'var(--c-blue)'   },
  health: { Icon: Heart,  color: 'var(--c-red)'    },
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const panelRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Close on outside click
  useEffect(() => {
    function handler(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  function markAllRead() {
    setNotifications(p => p.map(n => ({ ...n, read: true })));
  }

  function markRead(id) {
    setNotifications(p => p.map(n => n.id === id ? { ...n, read: true } : n));
  }

  function dismiss(id) {
    setNotifications(p => p.filter(n => n.id !== id));
  }

  return (
    <div ref={panelRef} style={{ position: 'relative' }}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(p => !p)}
        className="btn-icon"
        style={{
          position: 'relative',
          background: open ? 'rgba(79,141,255,0.1)' : undefined,
          borderColor: open ? 'rgba(79,141,255,0.3)' : undefined,
          color: open ? 'var(--c-blue)' : undefined,
        }}
        aria-label="Notifications"
      >
        <Bell size={16} />
        {unreadCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            style={{
              position: 'absolute', top: -4, right: -4,
              width: 16, height: 16, borderRadius: '50%',
              background: 'var(--c-blue)',
              border: '2px solid var(--c-bg-surface)',
              fontSize: 9, fontWeight: 800, color: 'white',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {unreadCount}
          </motion.span>
        )}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            className="notif-panel"
          >
            {/* Header */}
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--c-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>Notifications</span>
                {unreadCount > 0 && (
                  <span className="badge badge-blue">{unreadCount} new</span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', color: 'var(--c-blue)', cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: 'Inter, sans-serif' }}
                >
                  <CheckCheck size={13} /> Mark all read
                </button>
              )}
            </div>

            {/* Notification items */}
            <div style={{ maxHeight: 360, overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <div style={{ padding: 32, textAlign: 'center' }}>
                  <Bell size={28} color="var(--c-text-muted)" style={{ margin: '0 auto 10px' }} />
                  <p style={{ fontSize: 13, color: 'var(--c-text-muted)' }}>All caught up!</p>
                </div>
              ) : (
                notifications.map(n => {
                  const { Icon, color } = TYPE_ICONS[n.type] || TYPE_ICONS.goal;
                  return (
                    <div
                      key={n.id}
                      className={`notif-item ${!n.read ? 'unread' : ''}`}
                      onClick={() => markRead(n.id)}
                    >
                      {!n.read && <div className="notif-dot" />}
                      {n.read && <div style={{ width: 7 }} />}
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Icon size={15} color={color} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{n.title}</p>
                        <p style={{ fontSize: 12, color: 'var(--c-text-secondary)', lineHeight: 1.4 }}>{n.body}</p>
                        <span style={{ fontSize: 10, color: 'var(--c-text-muted)' }}>{formatRelativeTime(n.time)}</span>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); dismiss(n.id); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--c-text-muted)', padding: 2, flexShrink: 0 }}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '10px 16px', borderTop: '1px solid var(--c-border)', textAlign: 'center' }}>
              <button style={{ background: 'none', border: 'none', color: 'var(--c-blue)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'Inter, sans-serif' }}>
                View all notifications →
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
