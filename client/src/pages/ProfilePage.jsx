import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Mail, Target, TrendingUp, Award, Edit3, Save, X, CheckCircle2, Plus, Loader2 } from 'lucide-react';
import useAuthStore from '../store/authStore';
import useHabitStore from '../store/habitStore';
import api from '../services/api';

// Achievements are now calculated dynamically inside the component

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const { habits } = useHabitStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ 
    name: user?.name || '', 
    goals: user?.goals || [] 
  });
  const [saving, setSaving] = useState(false);
  const [wellnessScore, setWellnessScore] = useState(user?.wellnessScore || null);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoal, setNewGoal] = useState('');
  const [addingGoal, setAddingGoal] = useState(false);

  // Dynamic achievement logic
  const maxStreak = habits.length > 0 ? Math.max(0, ...habits.map(h => h.streak?.current || 0)) : 0;
  const meditation = habits.find(h => h.title.toLowerCase().includes('medit'))?.streak?.current || 0;
  const water = habits.find(h => h.title.toLowerCase().includes('water'))?.streak?.current || 0;

  const achievements = [
    { icon: '🔥', title: '7-Day Streak', desc: 'Any habit for 7 days', earned: maxStreak >= 7, color: 'var(--c-orange)', pct: Math.min(100, (maxStreak/7)*100) },
    { icon: '🧘', title: 'Zen Master',   desc: '30 days of meditation', earned: meditation >= 30, color: 'var(--c-purple)', pct: Math.min(100, (meditation/30)*100) },
    { icon: '💧', title: 'Hydro Hero',   desc: 'Hit water goal for 14 days', earned: water >= 14, color: 'var(--c-blue)', pct: Math.min(100, (water/14)*100) },
  ];

  useEffect(() => {
    // Load most recent wellness score from metrics
    api.get('/metrics').then(res => {
      if (res?.data?.wellnessScore) setWellnessScore(res.data.wellnessScore);
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await api.put('/auth/details', { name: formData.name });
      updateUser(res.data?.user || res.data);
      setIsEditing(false);
    } catch (err) {
      console.error('Update failed', err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddGoal = async () => {
    if (!newGoal.trim()) return;
    setAddingGoal(true);
    try {
      const currentGoals = user?.goals || [];
      const updated = [...currentGoals, { type: newGoal.trim() }];
      const res = await api.put('/auth/details', { goals: updated });
      updateUser(res.data?.user || res.data);
      setNewGoal('');
      setShowAddGoal(false);
    } catch (err) {
      console.error('Add goal failed', err);
    } finally {
      setAddingGoal(false);
    }
  };

  const fileInputRef = React.useRef(null);
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = reader.result;
        const res = await api.put('/auth/details', { profilePic: base64String });
        updateUser(res.data.user);
      } catch (err) {
        console.error('Failed to update profile picture', err);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ maxWidth: 760 }}>
      {/* Profile Header */}
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="glass-card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ position: 'relative' }}>
            <div style={{
              width: 80, height: 80, borderRadius: 20,
              background: user?.profilePic ? `url(${user.profilePic}) center/cover no-repeat` : 'linear-gradient(135deg, var(--c-blue), var(--c-purple))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, fontWeight: 800, color: 'white',
              boxShadow: 'var(--shadow-glow-blue)',
            }}>
              {!user?.profilePic && (user?.name?.charAt(0) || 'A')}
            </div>
            <input 
              type="file" 
              accept="image/*"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handlePhotoUpload}
            />
            <button 
              className="btn-icon-sm" 
              style={{ position: 'absolute', bottom: -5, right: -5, background: 'var(--c-bg-card)' }}
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera size={12} />
            </button>
          </div>

          <div style={{ flex: 1 }}>
            <AnimatePresence mode="wait">
              {!isEditing ? (
                <motion.div key="view" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
                    <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--c-text-primary)' }}>{user?.name}</h1>
                    <button onClick={() => setIsEditing(true)} className="btn btn-ghost btn-sm" style={{ padding: '4px 8px', height: 'auto' }}>
                      <Edit3 size={12} /> Edit
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                    <Mail size={12} color="var(--c-text-muted)" />
                    <span style={{ fontSize: 13, color: 'var(--c-text-muted)' }}>{user?.email}</span>
                  </div>
                </motion.div>
              ) : (
                <motion.div key="edit" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <input 
                    className="input-base" 
                    value={formData.name} 
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    placeholder="Enter your name"
                    autoFocus
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--c-blue)', padding: '6px 12px', borderRadius: 8, color: 'white', outline: 'none' }}
                  />
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handleSave} disabled={saving} className="btn btn-primary btn-sm">
                      <Save size={12} /> {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button onClick={() => setIsEditing(false)} className="btn btn-secondary btn-sm">
                      <X size={12} /> Cancel
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
              {user?.goals?.map((g, i) => (
                <span key={i} className="badge badge-blue">{g.type || g}</span>
              ))}
              <button
                onClick={() => setShowAddGoal(true)}
                className="badge badge-neutral"
                style={{ cursor: 'pointer', border: '1px dashed var(--c-border-strong)', background: 'transparent', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                <Plus size={10} /> Add Goal
              </button>
            </div>

            {/* Add Goal inline form */}
            <AnimatePresence>
              {showAddGoal && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ overflow: 'hidden', marginTop: 8 }}
                >
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input
                      autoFocus
                      value={newGoal}
                      onChange={e => setNewGoal(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleAddGoal()}
                      placeholder="e.g. weight_loss, sleep_better..."
                      style={{
                        flex: 1, padding: '6px 12px', borderRadius: 8, fontSize: 13,
                        background: 'rgba(255,255,255,0.05)', border: '1px solid var(--c-blue)',
                        color: 'var(--c-text-primary)', outline: 'none', fontFamily: 'Inter, sans-serif',
                      }}
                    />
                    <button onClick={handleAddGoal} disabled={addingGoal} className="btn btn-primary btn-sm">
                      {addingGoal ? <Loader2 size={12} /> : <CheckCircle2 size={12} />} Add
                    </button>
                    <button onClick={() => { setShowAddGoal(false); setNewGoal(''); }} className="btn btn-ghost btn-sm">
                      <X size={12} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--c-blue)', letterSpacing: '-2px', lineHeight: 1 }}>
              {wellnessScore ?? '—'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--c-text-muted)', fontWeight: 500 }}>WELLNESS SCORE</div>
            {!wellnessScore && (
              <div style={{ fontSize: 10, color: 'var(--c-text-muted)', marginTop: 4 }}>Log metrics to see score</div>
            )}
          </div>
        </div>
      </motion.div>

      <div className="responsive-split-reverse">
        {/* Achievements Group */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Award size={15} color="var(--c-yellow)" />
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-text-primary)' }}>Milestones</span>
              </div>
            </div>
            <div className="responsive-grid-2">
              {achievements.map((ach) => (
                <div key={ach.title} style={{
                  padding: '12px 14px', borderRadius: 12,
                  background: ach.earned ? `${ach.color}10` : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${ach.earned ? ach.color + '25' : 'var(--c-border)'}`,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 24 }}>{ach.icon}</span>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--c-text-primary)' }}>{ach.title}</div>
                        {ach.earned && <CheckCircle2 size={12} color={ach.color} />}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--c-text-muted)', marginTop: 2 }}>{ach.desc}</div>
                      {!ach.earned && (
                        <div className="progress-track" style={{ height: 3, marginTop: 6, borderRadius: 2 }}>
                           <div className="progress-fill" style={{ width: `${ach.pct}%`, background: ach.color, borderRadius: 2 }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="glass-card" style={{ background: 'var(--c-blue-dim)', borderColor: 'var(--c-blue-glow)' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <CheckCircle2 size={24} color="var(--c-blue)" />
                <div>
                   <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-text-primary)' }}>You are on track!</div>
                   <div style={{ fontSize: 12, color: 'var(--c-blue)', marginTop: 2 }}>Keep up the momentum to reach Zen Master level.</div>
                </div>
             </div>
          </motion.div>
        </div>

        {/* Info Column */}
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card">
           <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
             <Target size={14} color="var(--c-teal)" />
             <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-text-primary)' }}>Statistics</span>
           </div>
           <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { label: 'Active Streak', value: '7 Days', color: 'var(--c-orange)' },
                { label: 'Total Steps', value: '142,500', color: 'var(--c-teal)' },
                { label: 'Workouts', value: '12', color: 'var(--c-blue)' },
                { label: 'Weight Change', value: '-2.4 kg', color: 'var(--c-green)' },
              ].map(s => (
                <div key={s.label}>
                   <div style={{ fontSize: 11, color: 'var(--c-text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</div>
                   <div style={{ fontSize: 18, fontWeight: 800, color: s.color, marginTop: 2 }}>{s.value}</div>
                </div>
              ))}
           </div>
        </motion.div>
      </div>
    </div>
  );
}
