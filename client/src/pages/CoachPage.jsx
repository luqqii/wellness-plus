import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Camera, Bot, User, Sparkles, BarChart3, Brain } from 'lucide-react';
import useChat from '../hooks/useChat';
import api from '../services/api';

const EMOTIONS = [
  { label: 'Neutral', emoji: '😐' },
  { label: 'Motivated', emoji: '💪' },
  { label: 'Tired', emoji: '😴' },
  { label: 'Stressed', emoji: '😰' },
  { label: 'Positive', emoji: '😊' },
  { label: 'Negative', emoji: '😞' },
];

export default function CoachPage() {
  const { messages, isTyping, inputValue, setInputValue, sendMessage, currentSentiment } = useChat();
  const [detectedEmotion, setDetectedEmotion] = useState('Neutral');
  const [isListening, setIsListening] = useState(false);
  const chatEndRef = useRef(null);
  const textareaRef = useRef(null);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);


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
    sendMessage(inputValue);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      setInputValue('Analyzing food photo...');
      const res = await api.post('/nutrition/scan-photo', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const detection = res.data.data.matches[0];
      if (detection) {
        setInputValue(`I'm eating ${detection.name}. It has around ${detection.cal} calories.`);
        sendMessage(`I'm eating ${detection.name}. Analyze this for me?`, {
          context: `Detected ${detection.name} (${detection.cal} cal, ${detection.p}g Protein, ${detection.c}g Carbs, ${detection.f}g Fat).`
        });
      }
    } catch (err) {
      console.error('Scan failed', err);
      setInputValue('');
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
      <div className="glass-card" style={{ zIndex: 1, borderRadius: 'var(--r-xl) var(--r-xl) 0 0', borderBottom: 'none', padding: '14px 20px', flexShrink: 0, background: 'rgba(28, 32, 48, 0.85)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--c-text-primary)' }}>AI Wellness Coach</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 2 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--c-teal)', display: 'inline-block' }} />
                <span style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>Online · Analyzing your data in real time</span>
              </div>
            </div>
          </div>

          {/* Emotion Detection */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 11, color: 'var(--c-text-muted)' }}>Detected mood:</span>
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
                {e.emoji} {e.label}
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
        background: 'rgba(23, 27, 40, 0.55)',
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
      <div className="glass-card" style={{ zIndex: 1, borderRadius: '0 0 var(--r-xl) var(--r-xl)', borderTop: 'none', padding: '16px 24px', flexShrink: 0, background: 'rgba(28, 32, 48, 0.85)' }}>
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
