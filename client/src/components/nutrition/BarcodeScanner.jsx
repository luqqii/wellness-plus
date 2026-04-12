import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { X, Camera, RefreshCw, AlertCircle } from 'lucide-react';

/**
 * BarcodeScanner — Uses @zxing/browser to read EAN/UPC barcodes via webcam,
 * then fetches nutrition from Open Food Facts API (free, no key needed).
 */
export default function BarcodeScanner({ onResult, onClose }) {
  const videoRef = useRef(null);
  const readerRef = useRef(null);
  const [status, setStatus] = useState('starting'); // starting | scanning | error | fetching | done
  const [error, setError] = useState('');
  const [lastCode, setLastCode] = useState('');

  useEffect(() => {
    let controls = null;

    const startScanner = async () => {
      try {
        const { BrowserMultiFormatReader } = await import('@zxing/browser');
        const reader = new BrowserMultiFormatReader();
        readerRef.current = reader;

        const devices = await BrowserMultiFormatReader.listVideoInputDevices();
        if (!devices || devices.length === 0) {
          setError('No camera found on this device.');
          setStatus('error');
          return;
        }

        // Prefer back camera on mobile
        const device = devices.find(d => d.label.toLowerCase().includes('back') || d.label.toLowerCase().includes('rear')) || devices[0];
        setStatus('scanning');

        controls = await reader.decodeFromVideoDevice(device.deviceId, videoRef.current, async (result, err) => {
          if (result) {
            const code = result.getText();
            if (code === lastCode) return; // deduplicate
            setLastCode(code);
            setStatus('fetching');
            await lookupBarcode(code);
          }
        });
      } catch (err) {
        console.error('Barcode scanner error:', err);
        setError(err.message || 'Camera access denied. Please allow camera permissions.');
        setStatus('error');
      }
    };

    startScanner();

    return () => {
      if (controls) {
        try { controls.stop(); } catch(e) {}
      }
      if (readerRef.current) {
        try { readerRef.current.reset(); } catch(e) {}
      }
    };
  }, []);

  const lookupBarcode = async (barcode) => {
    try {
      const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
      const data = await response.json();

      if (data.status !== 1 || !data.product) {
        setError(`No product found for barcode: ${barcode}`);
        setStatus('error');
        return;
      }

      const p = data.product;
      const nutriments = p.nutriments || {};

      const food = {
        name: p.product_name || p.generic_name || 'Unknown Product',
        calories: Math.round(nutriments['energy-kcal_100g'] || nutriments['energy-kcal'] || 0),
        protein: Math.round(nutriments.proteins_100g || nutriments.proteins || 0),
        carbs: Math.round(nutriments.carbohydrates_100g || nutriments.carbohydrates || 0),
        fat: Math.round(nutriments.fat_100g || nutriments.fat || 0),
        fiber: Math.round(nutriments.fiber_100g || nutriments.fiber || 0),
        sugar: Math.round(nutriments.sugars_100g || nutriments.sugars || 0),
        sodium: Math.round(nutriments.sodium_100g || nutriments.sodium || 0),
        brandName: p.brands || '',
        servingSize: { amount: 100, unit: 'g' },
        macros: {
          protein: Math.round(nutriments.proteins_100g || nutriments.proteins || 0),
          carbs: Math.round(nutriments.carbohydrates_100g || nutriments.carbohydrates || 0),
          fat: Math.round(nutriments.fat_100g || nutriments.fat || 0),
        }
      };

      setStatus('done');
      onResult(food);
    } catch (err) {
      console.error('Open Food Facts error:', err);
      setError('Failed to fetch product. Check your connection.');
      setStatus('error');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)',
        zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 20,
      }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        style={{
          background: 'rgba(16,18,24,0.95)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 24,
          width: '100%', maxWidth: 420,
          overflow: 'hidden',
          boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '18px 20px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 10,
              background: 'linear-gradient(135deg, #4f8dff, #9b6dff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Camera size={16} color="white" />
            </div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'white' }}>Barcode Scanner</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>Point at a food package barcode</div>
            </div>
          </div>
          <button onClick={onClose} style={{
            width: 30, height: 30, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}>
            <X size={14} />
          </button>
        </div>

        {/* Camera View */}
        <div style={{ position: 'relative', background: '#000', aspectRatio: '4/3' }}>
          <video
            ref={videoRef}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            autoPlay
            muted
            playsInline
          />

          {/* Scan overlay */}
          {status === 'scanning' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {/* Corner guides */}
              {[
                { top: '25%', left: '15%', borderTop: '3px solid #4f8dff', borderLeft: '3px solid #4f8dff' },
                { top: '25%', right: '15%', borderTop: '3px solid #4f8dff', borderRight: '3px solid #4f8dff' },
                { bottom: '25%', left: '15%', borderBottom: '3px solid #4f8dff', borderLeft: '3px solid #4f8dff' },
                { bottom: '25%', right: '15%', borderBottom: '3px solid #4f8dff', borderRight: '3px solid #4f8dff' },
              ].map((s, i) => (
                <div key={i} style={{ position: 'absolute', width: 28, height: 28, borderRadius: 3, ...s }} />
              ))}
              {/* Scan line animation */}
              <motion.div
                animate={{ top: ['28%', '68%', '28%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                style={{
                  position: 'absolute', left: '15%', right: '15%',
                  height: 2,
                  background: 'linear-gradient(90deg, transparent, #4f8dff, transparent)',
                  boxShadow: '0 0 8px #4f8dff',
                }}
              />
            </div>
          )}

          {/* Status overlays */}
          {status === 'starting' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.6)', gap: 10 }}>
              <RefreshCw size={28} color="#4f8dff" style={{ animation: 'spin 1s linear infinite' }} />
              <span style={{ color: 'white', fontSize: 13 }}>Starting camera…</span>
            </div>
          )}
          {status === 'fetching' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', gap: 10 }}>
              <RefreshCw size={28} color="#00d4aa" style={{ animation: 'spin 0.7s linear infinite' }} />
              <span style={{ color: 'white', fontSize: 13 }}>Looking up product…</span>
            </div>
          )}
          {status === 'error' && (
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.75)', gap: 12, padding: 24 }}>
              <AlertCircle size={32} color="#ff5b5b" />
              <span style={{ color: 'white', fontSize: 13, textAlign: 'center', lineHeight: 1.5 }}>{error}</span>
              <button
                onClick={() => { setStatus('starting'); setError(''); setLastCode(''); }}
                style={{ padding: '8px 20px', borderRadius: 10, background: '#4f8dff', border: 'none', color: 'white', fontSize: 13, cursor: 'pointer' }}
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Footer hint */}
        <div style={{ padding: '14px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', margin: 0 }}>
            Supports EAN-13, UPC-A, QR codes · Powered by Open Food Facts
          </p>
        </div>
      </motion.div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </motion.div>
  );
}
