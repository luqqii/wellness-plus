import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Plus, X, Loader2, UtensilsCrossed, CheckCircle2, ScanLine, Mic, Camera, AlertCircle, MicOff } from 'lucide-react';
import api from '../../services/api';
import BarcodeScanner from './BarcodeScanner';

export default function FoodSearchModal({ isOpen, onClose, mealType, date, onFoodAdded }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [addedId, setAddedId] = useState(null);
  const [activeTab, setActiveTab] = useState('search'); // 'search' | 'barcode' | 'voice' | 'photo'
  const [isListening, setIsListening] = useState(false);
  const [voiceStatus, setVoiceStatus] = useState('');
  const [photoLoading, setPhotoLoading] = useState(false);
  const [photoResult, setPhotoResult] = useState(null);
  const [photoError, setPhotoError] = useState('');
  const inputRef = useRef(null);
  const debounceRef = useRef(null);
  const recognitionRef = useRef(null);
  const photoInputRef = useRef(null);

  // Reset on open/close
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setActiveTab('search');
    } else {
      setQuery(''); setResults([]); setHasSearched(false); setAddedId(null);
      setIsListening(false); setVoiceStatus(''); setPhotoResult(null); setPhotoError('');
      stopListening();
    }
  }, [isOpen]);

  // Debounced live search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults([]); setHasSearched(false); return; }
    debounceRef.current = setTimeout(async () => {
      setIsLoading(true); setHasSearched(true);
      try {
        const result = await api.get(`/nutrition/search?query=${encodeURIComponent(query.trim())}`);
        setResults(result.data || []);
      } catch (e) { setResults([]); } finally { setIsLoading(false); }
    }, 400);
    return () => clearTimeout(debounceRef.current);
  }, [query]);

  const handleAdd = async (food, idx) => {
    try {
      await api.post(`/nutrition/log/${date}`, {
        mealType,
        customFood: {
          name: food.name,
          calories: food.calories,
          protein: food.macros?.protein ?? food.protein ?? 0,
          carbs: food.macros?.carbs ?? food.carbs ?? 0,
          fat: food.macros?.fat ?? food.fat ?? 0,
          fiber: food.fiber ?? 0,
          sugar: food.sugar ?? 0,
          sodium: food.sodium ?? 0,
        },
        servingsConsumed: 1,
      });
      setAddedId(idx);
      onFoodAdded();
      setTimeout(() => onClose(), 700);
    } catch (e) { alert('Failed to add food. Please try again.'); }
  };

  // Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  // ── Voice Logging ──
  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) { setVoiceStatus('Voice not supported in this browser.'); return; }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;
    recognition.onstart = () => { setIsListening(true); setVoiceStatus('Listening… say a food name'); };
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setVoiceStatus(`Heard: "${transcript}" — searching…`);
      setIsListening(false);
      setQuery(transcript);
      setActiveTab('search');
    };
    recognition.onerror = (e) => { setVoiceStatus(`Error: ${e.error}`); setIsListening(false); };
    recognition.onend = () => setIsListening(false);
    recognition.start();
  };

  const stopListening = () => {
    try { recognitionRef.current?.stop(); } catch(e) {}
    setIsListening(false);
  };

  // ── Photo Scan ──
  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoLoading(true); setPhotoError(''); setPhotoResult(null);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const res = await api.post('/nutrition/scan-photo', formData);
      const match = res.data?.matches?.[0];
      if (match) {
        setPhotoResult({
          name: match.name,
          calories: match.cal,
          protein: match.p,
          carbs: match.c,
          fat: match.f,
          macros: { protein: match.p, carbs: match.c, fat: match.f },
          confidence: match.confidence,
        });
      } else {
        setPhotoError('Could not analyze this image.');
      }
    } catch(e) {
      setPhotoError('Photo scan failed. Make sure the server is running.');
    } finally { setPhotoLoading(false); }
  };

  // ── Barcode result handler ──
  const handleBarcodeResult = (food) => {
    setResults([food]);
    setHasSearched(true);
    setActiveTab('search');
  };

  if (!isOpen) return null;
  const mealLabel = mealType ? mealType.charAt(0).toUpperCase() + mealType.slice(1) : '';

  const TABS = [
    { id: 'search', icon: Search, label: 'Search' },
    { id: 'barcode', icon: ScanLine, label: 'Barcode' },
    { id: 'voice', icon: Mic, label: 'Voice' },
    { id: 'photo', icon: Camera, label: 'Photo' },
  ];

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(8px)',
        zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: 'spring', stiffness: 280, damping: 25 }}
        style={{
          background: 'rgba(23, 23, 28, 0.7)',
          backdropFilter: 'blur(32px) saturate(150%)',
          width: '100%', maxWidth: 540,
          maxHeight: '85vh',
          borderRadius: 28,
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '18px 22px 0',
          borderBottom: '1px solid var(--c-border)',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 700, margin: 0, color: 'var(--c-text-primary)' }}>Add to {mealLabel}</h2>
              <p style={{ fontSize: 11, color: 'var(--c-text-muted)', margin: '2px 0 0' }}>Search, scan barcode, speak, or photograph your food</p>
            </div>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'rgba(255,255,255,0.06)', border: '1px solid var(--c-border)',
              color: 'var(--c-text-secondary)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', cursor: 'pointer',
            }}>
              <X size={15} />
            </button>
          </div>

          {/* Tab bar */}
          <div style={{ display: 'flex', gap: 4, marginBottom: -1 }}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '7px 13px', borderRadius: '10px 10px 0 0',
                  border: '1px solid transparent',
                  borderBottom: 'none',
                  background: activeTab === tab.id ? 'rgba(79,141,255,0.12)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--c-blue)' : 'var(--c-text-muted)',
                  fontSize: 12, fontWeight: activeTab === tab.id ? 700 : 500,
                  cursor: 'pointer',
                  borderColor: activeTab === tab.id ? 'rgba(79,141,255,0.2)' : 'transparent',
                  transition: 'all 150ms',
                }}
              >
                <tab.icon size={13} />
                {tab.label}
                {tab.id === 'voice' && isListening && (
                  <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#ff5b5b', animation: 'pulse-dot 0.8s ease infinite alternate' }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* ── Tab: Search ── */}
        {activeTab === 'search' && (
          <>
            <div style={{ padding: '14px 22px', borderBottom: '1px solid var(--c-border)', flexShrink: 0 }}>
              <div style={{ position: 'relative' }}>
                <div style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: isLoading ? 'var(--c-blue)' : 'var(--c-text-muted)', display: 'flex' }}>
                  {isLoading ? <Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> : <Search size={16} />}
                </div>
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={`Search foods for ${mealLabel}...`}
                  style={{
                    width: '100%', padding: '12px 38px 12px 40px',
                    background: 'rgba(255,255,255,0.06)', border: '1px solid var(--c-border-strong)',
                    borderRadius: 13, color: 'var(--c-text-primary)', outline: 'none', fontSize: 14, fontFamily: 'Inter, sans-serif',
                  }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(79,141,255,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(79,141,255,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--c-border-strong)'; e.target.style.boxShadow = 'none'; }}
                />
                {query && (
                  <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--c-text-muted)' }}>
                    <X size={11} />
                  </button>
                )}
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '14px 22px' }}>
              {!isLoading && !hasSearched && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--c-text-muted)' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(79,141,255,0.1)', border: '1px solid rgba(79,141,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}><Search size={22} color="var(--c-blue)" /></div>
                  <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 6, color: 'var(--c-text-secondary)' }}>Start typing to search</p>
                  <p style={{ fontSize: 12 }}>Or use barcode scan, voice, or photo above</p>
                </div>
              )}
              {!isLoading && hasSearched && results.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--c-text-muted)' }}>
                  <div style={{ width: 52, height: 52, borderRadius: 16, background: 'rgba(255,91,91,0.1)', border: '1px solid rgba(255,91,91,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}><UtensilsCrossed size={22} color="var(--c-red)" /></div>
                  <p style={{ fontSize: 14, fontWeight: 500, marginBottom: 6, color: 'var(--c-text-secondary)' }}>No results for "{query}"</p>
                  <p style={{ fontSize: 12 }}>Try a different spelling or use barcode scan</p>
                </div>
              )}
              {isLoading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {[1,2,3,4].map(i => <div key={i} style={{ height: 64, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: '1px solid var(--c-border)', animation: `pulse ${0.8+i*0.1}s ease-in-out infinite alternate` }} />)}
                </div>
              )}
              <AnimatePresence>
                {!isLoading && results.map((food, i) => {
                  const isAdded = addedId === i;
                  return (
                    <motion.div key={`${food.name}-${i}`} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: Math.min(i * 0.04, 0.3) }}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: isAdded ? 'rgba(45,212,164,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isAdded ? 'rgba(45,212,164,0.3)' : 'var(--c-border)'}`, borderRadius: 13, marginBottom: 8, cursor: 'pointer', gap: 12 }}
                      onMouseEnter={e => { if (!isAdded) { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.borderColor='rgba(79,141,255,0.4)'; }}}
                      onMouseLeave={e => { if (!isAdded) { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor='var(--c-border)'; }}}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 3, color: 'var(--c-text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {food.name}
                          {food.brandName && food.brandName !== 'Generic' && <span style={{ fontSize: 11, color: 'var(--c-text-muted)', fontWeight: 400, marginLeft: 6 }}>({food.brandName})</span>}
                        </div>
                        <div style={{ fontSize: 12, color: 'var(--c-text-secondary)', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                          <span style={{ color: 'var(--c-orange)', fontWeight: 600 }}>{food.calories} kcal</span>
                          <span style={{ color: 'var(--c-text-muted)' }}>•</span>
                          <span>C:<b style={{ color: 'var(--c-teal)' }}>{food.macros?.carbs ?? food.carbs}g</b></span>
                          <span>P:<b style={{ color: 'var(--c-orange)' }}>{food.macros?.protein ?? food.protein}g</b></span>
                          <span>F:<b style={{ color: 'var(--c-purple)' }}>{food.macros?.fat ?? food.fat}g</b></span>
                          {food.fiber > 0 && <span style={{ color: 'var(--c-text-muted)' }}>Fiber:{food.fiber}g</span>}
                        </div>
                      </div>
                      <button onClick={() => handleAdd(food, i)} disabled={isAdded}
                        style={{ flexShrink: 0, width: 36, height: 36, borderRadius: 10, background: isAdded ? 'rgba(45,212,164,0.2)' : 'var(--c-blue)', border: 'none', color: isAdded ? 'var(--c-green)' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: isAdded ? 'default' : 'pointer', boxShadow: isAdded ? 'none' : '0 4px 12px rgba(79,141,255,0.3)' }}
                        onMouseEnter={e => { if (!isAdded) e.currentTarget.style.background='#6b9fff'; }}
                        onMouseLeave={e => { if (!isAdded) e.currentTarget.style.background='var(--c-blue)'; }}
                      >
                        {isAdded ? <CheckCircle2 size={16} /> : <Plus size={16} />}
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </>
        )}

        {/* ── Tab: Barcode ── */}
        {activeTab === 'barcode' && (
          <BarcodeScanner
            onResult={(food) => handleBarcodeResult(food)}
            onClose={() => setActiveTab('search')}
          />
        )}

        {/* ── Tab: Voice ── */}
        {activeTab === 'voice' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 20 }}>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={isListening ? stopListening : startListening}
              style={{
                width: 96, height: 96, borderRadius: '50%',
                background: isListening
                  ? 'linear-gradient(135deg, #ff5b5b, #ff8040)'
                  : 'linear-gradient(135deg, #4f8dff, #9b6dff)',
                border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: isListening ? '0 0 0 16px rgba(255,91,91,0.15), 0 8px 32px rgba(255,91,91,0.3)' : '0 8px 32px rgba(79,141,255,0.35)',
                transition: 'all 300ms',
              }}
            >
              {isListening ? <MicOff size={36} color="white" /> : <Mic size={36} color="white" />}
            </motion.button>

            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: 16, fontWeight: 700, color: 'var(--c-text-primary)', marginBottom: 6 }}>
                {isListening ? 'Listening…' : 'Tap to speak'}
              </p>
              <p style={{ fontSize: 13, color: 'var(--c-text-muted)', lineHeight: 1.5 }}>
                {isListening ? 'Say something like "two eggs and toast"' : 'Speak a food name and we\'ll search for it'}
              </p>
              {voiceStatus && (
                <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} style={{ fontSize: 13, color: 'var(--c-teal)', marginTop: 10, fontWeight: 500 }}>
                  {voiceStatus}
                </motion.p>
              )}
            </div>
          </div>
        )}

        {/* ── Tab: Photo Scan ── */}
        {activeTab === 'photo' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 32, gap: 18 }}>
            {!photoResult ? (
              <>
                <div style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg, rgba(0,212,170,0.15), rgba(79,141,255,0.15))', border: '1px solid rgba(0,212,170,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Camera size={36} color="var(--c-teal)" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 15, fontWeight: 700, color: 'var(--c-text-primary)', marginBottom: 6 }}>AI Food Photo Scan</p>
                  <p style={{ fontSize: 13, color: 'var(--c-text-muted)', lineHeight: 1.5 }}>Take or upload a photo of your meal and our AI will analyze its nutrition automatically</p>
                </div>
                {photoError && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: 'rgba(255,91,91,0.1)', border: '1px solid rgba(255,91,91,0.2)', borderRadius: 10 }}>
                    <AlertCircle size={14} color="var(--c-red)" />
                    <span style={{ fontSize: 12, color: 'var(--c-red)' }}>{photoError}</span>
                  </div>
                )}
                <input ref={photoInputRef} type="file" accept="image/*" capture="environment" onChange={handlePhotoSelect} style={{ display: 'none' }} />
                <button
                  onClick={() => photoInputRef.current?.click()}
                  disabled={photoLoading}
                  style={{ padding: '12px 28px', borderRadius: 12, background: 'linear-gradient(135deg, #00d4aa, #4f8dff)', border: 'none', color: 'white', fontSize: 14, fontWeight: 700, cursor: photoLoading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}
                >
                  {photoLoading ? <><Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Analyzing…</> : <><Camera size={16} /> Choose Photo</>}
                </button>
              </>
            ) : (
              <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} style={{ width: '100%', padding: 20, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(0,212,170,0.3)', borderRadius: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                  <CheckCircle2 size={18} color="var(--c-teal)" />
                  <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--c-text-primary)' }}>Food Detected!</span>
                  <span style={{ fontSize: 11, color: 'var(--c-text-muted)', marginLeft: 'auto' }}>{Math.round((photoResult.confidence || 0.9) * 100)}% confident</span>
                </div>
                <p style={{ fontSize: 15, fontWeight: 600, color: 'var(--c-text-primary)', marginBottom: 10 }}>{photoResult.name}</p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 16 }}>
                  {[
                    { label: 'Calories', val: photoResult.calories, color: 'var(--c-orange)' },
                    { label: 'Protein', val: `${photoResult.protein}g`, color: '#ff7940' },
                    { label: 'Carbs', val: `${photoResult.carbs}g`, color: 'var(--c-teal)' },
                    { label: 'Fat', val: `${photoResult.fat}g`, color: 'var(--c-purple)' },
                  ].map(m => (
                    <div key={m.label} style={{ flex: 1, minWidth: 60, textAlign: 'center', padding: '8px 4px', background: 'rgba(255,255,255,0.04)', borderRadius: 10, border: '1px solid var(--c-border)' }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: m.color }}>{m.val}</div>
                      <div style={{ fontSize: 10, color: 'var(--c-text-muted)' }}>{m.label}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={() => { setPhotoResult(null); setPhotoError(''); }} style={{ flex: 1, padding: '10px', borderRadius: 10, background: 'rgba(255,255,255,0.06)', border: '1px solid var(--c-border)', color: 'var(--c-text-secondary)', fontSize: 13, cursor: 'pointer' }}>Retake</button>
                  <button onClick={() => handleAdd(photoResult, 'photo')} style={{ flex: 2, padding: '10px', borderRadius: 10, background: 'var(--c-blue)', border: 'none', color: 'white', fontSize: 13, fontWeight: 700, cursor: 'pointer' }}>
                    <Plus size={14} style={{ display: 'inline', marginRight: 4 }} />Add to {mealLabel}
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </motion.div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes pulse { from { opacity: 0.4; } to { opacity: 0.8; } }
        @keyframes pulse-dot { from { opacity: 0.4; } to { opacity: 1; } }
      `}</style>
    </div>
  );
}
