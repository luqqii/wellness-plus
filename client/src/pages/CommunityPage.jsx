import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Video, Calendar, Clock, Star, ChevronRight } from 'lucide-react';

const SESSIONS = [
  {
    id: 1,
    title: 'Emotional Eating Deep Dive',
    coach: 'Dr. Sarah Lee',
    emoji: '🧠',
    day: 'Tuesday',
    time: '7:00 PM EST',
    spots: 4,
    maxSpots: 15,
    tags: ['Psychology', 'Beginner'],
    rating: 4.9,
    description: 'Learn to identify and interrupt emotional eating cycles using CBT-based journaling and breathwork techniques.'
  },
  {
    id: 2,
    title: 'Meal Prep for Busy People',
    coach: 'Carlos Ruiz, RD',
    emoji: '🥗',
    day: 'Wednesday',
    time: '12:00 PM EST',
    spots: 8,
    maxSpots: 20,
    tags: ['Nutrition', 'Practical'],
    rating: 4.8,
    description: 'A hands-on session to plan a full week of Green-food-forward meals in under 30 minutes.'
  },
  {
    id: 3,
    title: 'Breaking the All-or-Nothing Cycle',
    coach: 'Priya Mehta, PhD',
    emoji: '⚡',
    day: 'Thursday',
    time: '8:00 PM EST',
    spots: 2,
    maxSpots: 10,
    tags: ['Psychology', 'Advanced'],
    rating: 5.0,
    description: 'For perfectionists who sabotage their own progress. We will rewire the binary thinking that causes binge/restrict cycles.'
  },
  {
    id: 4,
    title: 'Movement as Medicine: Habit Edition',
    coach: 'James Rivera',
    emoji: '🏃',
    day: 'Friday',
    time: '6:30 AM EST',
    spots: 11,
    maxSpots: 25,
    tags: ['Activity', 'Morning'],
    rating: 4.7,
    description: 'Rethink exercise as a mood tool, not a punishment. Build a 5-minute daily movement habit that actually sticks.'
  },
  {
    id: 5,
    title: 'Weekend Mindful Eating Challenge',
    coach: 'Dr. Sarah Lee',
    emoji: '🌿',
    day: 'Saturday',
    time: '10:00 AM EST',
    spots: 14,
    maxSpots: 30,
    tags: ['Mindfulness', 'Weekend'],
    rating: 4.9,
    description: 'A live group challenge: eat one meal completely mindfully and share your observations in real time.'
  },
];

const TABS = ['All', 'Psychology', 'Nutrition', 'Activity', 'Mindfulness'];

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [joined, setJoined] = useState({});

  const filtered = activeTab === 'All'
    ? SESSIONS
    : SESSIONS.filter(s => s.tags.includes(activeTab));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 900 }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        style={{ background: 'linear-gradient(135deg, #0C2B35 0%, #1A3D4A 100%)', borderRadius: 24, padding: 32, color: '#FFFFFF' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <Users size={28} color="#EC5A42" />
          <div>
            <h1 style={{ fontSize: 26, fontWeight: 900, margin: 0 }}>Group Sessions</h1>
            <p style={{ margin: '4px 0 0', color: '#9CA3AF', fontSize: 15 }}>Live coaching led by Wellness+ health experts</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', marginTop: 20 }}>
          {[
            { icon: Users, label: '45M+ Members' },
            { icon: Video, label: 'Live Sessions Daily' },
            { icon: Star, label: 'Expert-Led' },
          ].map(({ icon: Icon, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#D1D5DB', fontSize: 14, fontWeight: 600 }}>
              <Icon size={16} color="#EC5A42" /> {label}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: '8px 20px', borderRadius: 999, border: `2px solid ${activeTab === t ? '#EC5A42' : '#E8DED8'}`,
            background: activeTab === t ? '#EC5A42' : '#FFFFFF',
            color: activeTab === t ? '#FFFFFF' : '#0C2B35',
            fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'all 150ms ease'
          }}>{t}</button>
        ))}
      </div>

      {/* Sessions Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {filtered.map((s, i) => {
          const spotsLeft = s.maxSpots - s.spots;
          const isAlmostFull = spotsLeft <= 3;
          const isJoined = joined[s.id];

          return (
            <motion.div key={s.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              style={{ background: '#FFFFFF', borderRadius: 20, padding: 24, border: '1px solid #E8DED8', display: 'flex', gap: 20, flexWrap: 'wrap', alignItems: 'flex-start' }}>

              {/* Emoji Icon */}
              <div style={{ width: 56, height: 56, borderRadius: 16, background: '#F7EBE3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, flexShrink: 0 }}>
                {s.emoji}
              </div>

              <div style={{ flex: 1, minWidth: 240 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
                  {s.tags.map(t => (
                    <span key={t} style={{ fontSize: 11, background: '#F7EBE3', color: '#EC5A42', fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>{t}</span>
                  ))}
                  {isAlmostFull && (
                    <span style={{ fontSize: 11, background: '#FEF3C7', color: '#B45309', fontWeight: 700, padding: '3px 10px', borderRadius: 999 }}>⚡ Almost Full</span>
                  )}
                </div>
                <h3 style={{ fontSize: 18, fontWeight: 800, color: '#0C2B35', marginBottom: 6 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#4A5568', lineHeight: 1.5, marginBottom: 12 }}>{s.description}</p>
                <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#718096', fontWeight: 600 }}>
                    <Calendar size={14} /> {s.day}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#718096', fontWeight: 600 }}>
                    <Clock size={14} /> {s.time}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#718096', fontWeight: 600 }}>
                    <Users size={14} /> {spotsLeft} spots left
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: '#B45309', fontWeight: 700 }}>
                    <Star size={13} fill="#F59E0B" color="#F59E0B" /> {s.rating}
                  </div>
                </div>
                <div style={{ marginTop: 8, fontSize: 13, color: '#0C2B35', fontWeight: 700 }}>Hosted by {s.coach}</div>
              </div>

              {/* Action */}
              <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <button
                  onClick={() => setJoined(p => ({ ...p, [s.id]: !p[s.id] }))}
                  style={{
                    background: isJoined ? '#14B8A6' : '#EC5A42',
                    color: 'white', border: 'none', borderRadius: 999,
                    padding: '12px 24px', fontWeight: 800, cursor: 'pointer', fontSize: 14,
                    display: 'flex', alignItems: 'center', gap: 6, transition: 'all 150ms ease'
                  }}>
                  {isJoined ? '✓ Joined' : <>Join Session <ChevronRight size={16} /></>}
                </button>
                {/* Spots progress bar */}
                <div style={{ width: 120 }}>
                  <div style={{ height: 4, background: '#EAE6DF', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(s.spots / s.maxSpots) * 100}%`, background: isAlmostFull ? '#EC5A42' : '#14B8A6', transition: 'width 0.5s ease' }} />
                  </div>
                  <div style={{ fontSize: 11, color: '#9CA3AF', marginTop: 4, textAlign: 'right' }}>{s.spots}/{s.maxSpots} joined</div>
                </div>
              </div>

            </motion.div>
          );
        })}
      </div>

    </div>
  );
}
