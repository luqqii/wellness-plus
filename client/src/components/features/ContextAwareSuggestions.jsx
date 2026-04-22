import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Calendar, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContextAwareSuggestions({ metrics }) {
  const [contextData, setContextData] = useState({
    weather: 'rain', // Mock weather
    calendarBusy: true, // Mock calendar status
  });

  const getSuggestion = () => {
    if (contextData.weather === 'rain' && contextData.calendarBusy) {
      return {
        icon: <CloudRain size={24} color="var(--c-blue)" />,
        title: "Busy & Raining",
        text: "Since it's raining and you have back-to-back meetings, try a 10-minute desk stretch instead of your outdoor walk.",
        color: "var(--c-blue)"
      };
    } else if (metrics?.sleep?.hours < 6) {
      return {
        icon: <Moon size={24} color="var(--c-purple)" />,
        title: "Poor Sleep Detected",
        text: "Your sleep was low last night. Swap your HIIT workout for gentle yoga to avoid spiking cortisol.",
        color: "var(--c-purple)"
      };
    }
    return {
      icon: <Sun size={24} color="var(--c-orange)" />,
      title: "Perfect Conditions",
      text: "The weather is beautiful and your schedule is open at 4 PM. Perfect time for a 30-min run!",
      color: "var(--c-orange)"
    };
  };

  const suggestion = getSuggestion();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      style={{
        background: `linear-gradient(135deg, ${suggestion.color}0A, ${suggestion.color}15)`,
        border: `1px solid ${suggestion.color}30`,
        borderRadius: 'var(--r-lg)',
        padding: '20px',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start'
      }}
    >
      <div style={{
        background: `${suggestion.color}20`,
        padding: '12px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {suggestion.icon}
      </div>
      <div>
        <div style={{ fontSize: '11px', fontWeight: 700, color: suggestion.color, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '4px' }}>
          Context-Aware Suggestion
        </div>
        <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--c-text-primary)', margin: '0 0 4px 0' }}>{suggestion.title}</h4>
        <p style={{ fontSize: '13px', color: 'var(--c-text-secondary)', margin: 0, lineHeight: 1.5 }}>{suggestion.text}</p>
      </div>
    </motion.div>
  );
}
