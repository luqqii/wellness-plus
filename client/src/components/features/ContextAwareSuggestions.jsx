import React, { useState, useEffect } from 'react';
import { CloudRain, Sun, Calendar, Moon, Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import useMetricsStore from '../../store/metricsStore';

export default function ContextAwareSuggestions({ metrics }) {
  const [suggestion, setSuggestion] = useState(null);
  const liveSensors = useMetricsStore((s) => s.liveSensors);

  useEffect(() => {
    // Dynamic override based on live sensors
    if (liveSensors.isWorkoutActive || liveSensors.heartRate > 120) {
      setSuggestion({
        icon: <Activity size={24} color="var(--c-teal)" />,
        title: "Workout Detected",
        text: `You're currently active! Heart rate is ${liveSensors.heartRate} bpm. Keep up the great work!`,
        color: "var(--c-teal)"
      });
      return;
    }

    const fetchContextSuggestion = async () => {
      try {
        const { default: api } = await import('../../services/api');
        
        // Mocking dynamic context (in real life, maybe use navigator.geolocation or browser time)
        const currentHour = new Date().getHours();
        const mockWeather = currentHour < 12 ? 'clear' : 'rain';
        const mockCalendar = currentHour > 9 && currentHour < 17;

        const res = await api.post('/insights/context-aware', {
          weather: mockWeather,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          localTime: new Date().toISOString(),
          calendarBusy: mockCalendar
        });
        
        const data = res.data?.data;
        if (data && data.title) {
          // Map string iconName to React component
          let IconComponent = Sun;
          if (data.iconName === 'CloudRain') IconComponent = CloudRain;
          if (data.iconName === 'Moon') IconComponent = Moon;
          if (data.iconName === 'Calendar') IconComponent = Calendar;

          setSuggestion({
            icon: <IconComponent size={24} color={data.color || "var(--c-blue)"} />,
            title: data.title,
            text: data.text,
            color: data.color || "var(--c-blue)"
          });
        }
      } catch (error) {
        console.error("Failed to fetch context suggestion:", error);
        // Fallback
        setSuggestion({
          icon: <Sun size={24} color="var(--c-orange)" />,
          title: "Perfect Conditions",
          text: "The weather is beautiful. Perfect time for a 30-min run!",
          color: "var(--c-orange)"
        });
      }
    };

    fetchContextSuggestion();
  }, [metrics, liveSensors.isWorkoutActive, liveSensors.heartRate]);

  if (!suggestion) return null;

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
