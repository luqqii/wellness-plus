import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Camera, Bot, User, Sparkles, BarChart3, Brain } from 'lucide-react';
import useChat from '../hooks/useChat';
import useMetricsStore from '../store/metricsStore';
import api from '../services/api';
import DynamicIcon from '../components/ui/DynamicIcon';

const EMOTIONS = [
  { label: 'Neutral', emoji: '😐' },
  { label: 'Motivated', emoji: '💪' },
  { label: 'Tired', emoji: '😴' },
  { label: 'Stressed', emoji: '😰' },
  { label: 'Positive', emoji: '😊' },
  { label: 'Negative', emoji: '😞' },
];

export default function CoachPage() {
  const { messages, isTyping, inputValue, setInputValue, sendMessage, currentSentiment, addMessage, setTypingStatus } = useChat();
  const liveSensors = useMetricsStore(s => s.liveSensors);
  const [detectedEmotion, setDetectedEmotion] = useState('Neutral');
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  // Build a hidden sensor context string appended to every user message
  const buildSensorContext = () => {
    const parts = [];
    if (liveSensors.steps > 0) parts.push(`Steps today: ${liveSensors.steps}`);
    if (liveSensors.heartRate) parts.push(`Heart rate: ${liveSensors.heartRate} bpm`);
    if (liveSensors.activeCalories > 0) parts.push(`Active calories: ${Math.round(liveSensors.activeCalories)} kcal`);
    if (liveSensors.location) parts.push(`Location: ${liveSensors.location.latitude?.toFixed(3)}, ${liveSensors.location.longitude?.toFixed(3)}`);
    if (liveSensors.speed != null) parts.push(`Speed: ${liveSensors.speed} km/h`);
    if (liveSensors.battery) parts.push(`Battery: ${liveSensors.battery.level}%${liveSensors.battery.charging ? ' (charging)' : ''}`);
    if (liveSensors.ambientLight != null) parts.push(`Ambient light: ${liveSensors.ambientLight} lux`);
    if (!parts.length) return '';
    return `\n\n[Sensor Context — ${new Date().toLocaleTimeString()}: ${parts.join(' | ')}]`;
  };


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  useEffect(() => {
    setDetectedEmotion(currentSentiment);
  }, [currentSentiment]);

  useEffect(() => {
    // Setup Web Speech API if supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      
      recognition.onresult = (event) => {
        let ft = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) ft += event.results[i][0].transcript;
        }
        if (ft) setInputValue(p => p + (p && !p.endsWith(' ') ? ' ' : '') + ft);
      };

      recognition.onerror = (e) => {
        console.error("Speech recognition error", e);
        setIsListening(false);
      };
      
      recognition.onend = () => setIsListening(false);

      recognitionRef.current = recognition;
    }
  }, [setInputValue]);

  const toggleListen = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setInputValue(''); // Clear before talking
      recognitionRef.current?.start();
    }
  };

  const handleSend = () => {
    const context = buildSensorContext();
    sendMessage(inputValue + context);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset input value so the same file can be selected again
    if (fileInputRef.current) fileInputRef.current.value = '';

    const imagePreviewUrl = URL.createObjectURL(file);
    addMessage({ role: 'user', content: 'Analyze this food photo for me.', image: imagePreviewUrl });
    setTypingStatus(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const token = localStorage.getItem('wellness_token');
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api/v1';
      
      const response = await fetch(`${baseUrl}/nutrition/scan-photo`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      
      if (!response.ok) throw new Error('Upload failed');
      
      const resData = await response.json();
      const detection = resData.data?.matches?.[0];
      
      if (detection) {
        const aiResponseText = `I analyzed the photo! It looks like you're having **${detection.name}**. This contains roughly **${detection.cal} calories** (${detection.p}g Protein, ${detection.c}g Carbs, ${detection.f}g Fat). How can I help you fit this into your daily plan?`;
        addMessage({ role: 'ai', content: aiResponseText });
      } else {
        addMessage({ role: 'ai', content: "I couldn't quite identify the food in this picture. Could you tell me what it is?" });
      }
    } catch (err) {
      console.error('Scan failed', err);
      addMessage({ role: 'ai', content: "Sorry, I had trouble analyzing that photo right now. Please try again." });
    } finally {
      setTypingStatus(false);
      // We don't revoke the ObjectURL so it stays visible in the chat log
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const formatTime = (d) => new Date(d).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ height: 'calc(100vh - 108px)', display: 'flex', flexDirection: 'column', maxWidth: 860, margin: '0 auto', position: 'relative' }}>
      
      {/* Ambient background glow */}
      <div style={{
        position: 'absolute', top: -100, left: '20%', width: 400, height: 400,
        background: 'radial-gradient(circle, rgba(79,141,255,0.08) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none', borderRadius: '50%',
        filter: 'blur(40px)'
      }} />
      <div style={{
        position: 'absolute', bottom: 100, right: '10%', width: 300, height: 300,
        background: 'radial-gradient(circle, rgba(155,109,255,0.06) 0%, transparent 70%)',
        zIndex: 0, pointerEvents: 'none', borderRadius: '50%',
        filter: 'blur(50px)'
      }} />

      {/* Header */}
      <div className="glass-card" style={{ zIndex: 1, borderRadius: 'var(--r-xl) var(--r-xl) 0 0', borderBottom: '1px solid var(--c-border)', padding: '16px 24px', flexShrink: 0, background: 'var(--c-bg-card)' }}>
        <div className="coach-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 42, height: 42,
              borderRadius: 'var(--r-md)',
              background: 'linear-gradient(135deg, var(--c-blue), var(--c-purple))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: 'var(--shadow-glow-blue)',
            }}>
              <Sparkles size={20} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--c-text-primary)' }}>Conversational AI Coach</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--c-teal)', display: 'inline-block' }} />
                <span style={{ fontSize: 11, color: 'var(--c-text-muted)', whiteSpace: 'nowrap' }}>AI Personalized Coaching Active</span>
              </div>
            </div>
          </div>

          {/* Emotion & Stress Detection */}
          <div className="coach-emotion-scroll" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 10, fontWeight: 800, color: 'var(--c-purple)', textTransform: 'uppercase' }}>Emotion & Stress Detection</span>
              <span style={{ fontSize: 11, color: 'var(--c-text-muted)', whiteSpace: 'nowrap' }}>Extracted tone:</span>
            </div>
            {EMOTIONS.map((e) => (
              <button
                key={e.label}
                onClick={() => setDetectedEmotion(e.label)}
                style={{
                  padding: '4px 10px', borderRadius: 'var(--r-full)',
                  background: detectedEmotion === e.label ? 'var(--c-blue-dim)' : 'transparent',
                  border: `1px solid ${detectedEmotion === e.label ? 'rgba(79,141,255,0.3)' : 'var(--c-border)'}`,
                  color: detectedEmotion === e.label ? 'var(--c-blue)' : 'var(--c-text-muted)',
                  fontSize: 11, fontWeight: 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4
                }}
              >
                <DynamicIcon icon={e.emoji} size={14} color={detectedEmotion === e.label ? 'var(--c-blue)' : 'var(--c-text-muted)'} /> 
                {e.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="glass-card" style={{
        zIndex: 1,
        flex: 1, overflowY: 'auto',
        borderRadius: 0, borderTop: 'none', borderBottom: 'none',
        padding: '24px 24px', display: 'flex', flexDirection: 'column', gap: 20,
        background: 'rgba(255, 255, 255, 0.4)',
        backdropFilter: 'blur(32px)',
        WebkitBackdropFilter: 'blur(32px)'
      }}>
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            className={`chat-bubble-wrap ${msg.role}`}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ 
              type: 'spring', 
              stiffness: 260, 
              damping: 20, 
              delay: i < 6 ? i * 0.08 : 0 
            }}
          >
            <div className={`chat-avatar ${msg.role === 'ai' ? 'chat-avatar-ai' : 'chat-avatar-user'}`}>
              {msg.role === 'ai' ? <Bot size={14} color="white" /> : <User size={14} color="var(--c-text-secondary)" />}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxWidth: '75%' }}>
              <div className={`chat-bubble ${msg.role}`}>
                {msg.image && (
                  <img src={msg.image} alt="Uploaded food" style={{ width: '100%', borderRadius: 12, marginBottom: 8, objectFit: 'cover' }} />
                )}
                <p style={{ margin: 0 }}>{msg.content}</p>
                <p className="chat-time">{formatTime(msg.timestamp)}</p>
              </div>
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {isTyping && (
            <motion.div
              className="chat-bubble-wrap ai"
              initial={{ opacity: 0, scale: 0.95, y: 15 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: 'spring', stiffness: 260, damping: 20 }}
            >
              <div className="chat-avatar chat-avatar-ai"><Bot size={14} color="white" /></div>
              <div className="chat-bubble ai" style={{ padding: '12px 16px', display: 'flex', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <div className="typing-dot" style={{ width: 6, height: 6 }} />
                  <div className="typing-dot" style={{ width: 6, height: 6 }} />
                  <div className="typing-dot" style={{ width: 6, height: 6 }} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={chatEndRef} />
      </div>

      {/* Input */}
      <div className="glass-card" style={{ zIndex: 1, borderRadius: '0 0 var(--r-xl) var(--r-xl)', borderTop: '1px solid var(--c-border)', padding: '16px 24px', flexShrink: 0, background: 'var(--c-bg-card)' }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: 'var(--c-teal)', textTransform: 'uppercase', marginBottom: 8, letterSpacing: '0.5px' }}>Multimodal Input Active</div>
        <div className="chat-input-box">
          {/* Multimodal buttons */}
          <button 
            className={`btn btn-icon ${isListening ? 'voice-active-pulse' : ''}`} 
            title={isListening ? "Listening... Click to stop" : "Voice input"} 
            onClick={toggleListen}
            style={{ 
              color: isListening ? 'var(--c-red)' : 'inherit',
              border: isListening ? '1px solid var(--c-red-dim)' : 'var(--c-border)',
              position: 'relative'
            }}
          >
            <Mic size={16} />
            {isListening && <motion.div 
              layoutId="pulse"
              className="absolute inset-0 rounded-md bg-red-500/10"
              animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />}
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleImageUpload} 
            accept="image/*" 
            style={{ display: 'none' }} 
          />
          <button 
            className="btn btn-icon" 
            title="Scan Food Photo"
            onClick={() => fileInputRef.current?.click()}
          >
            <Camera size={16} />
          </button>

          <textarea

            ref={textareaRef}
            className="chat-textarea"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKey}
            placeholder={isListening ? "Listening to your voice..." : "Ask your AI coach anything..."}
            rows={1}
          />
          <button
            className="chat-send-btn"
            onClick={handleSend}
            disabled={!inputValue.trim()}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
