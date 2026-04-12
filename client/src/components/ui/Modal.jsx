import React, { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

/**
 * Modal — animated with backdrop blur, portal-based
 */
export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  footer,
  size = 'md', // sm | md | lg | xl | full
  showClose = true,
  closeOnBackdrop = true,
}) {
  const overlayRef = useRef(null);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ESC key to close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape' && isOpen) onClose?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  const widths = {
    sm:   480,
    md:   560,
    lg:   680,
    xl:   800,
    full: '100%',
  };

  const modal = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={overlayRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => { if (closeOnBackdrop && e.target === overlayRef.current) onClose?.(); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 20,
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 12 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            style={{
              width: '100%',
              maxWidth: widths[size],
              maxHeight: 'calc(100vh - 40px)',
              background: 'var(--c-bg-elevated)',
              border: '1px solid var(--c-border-strong)',
              borderRadius: 'var(--r-2xl)',
              boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            {/* Top shimmer */}
            <div style={{
              position: 'absolute', top: 0, left: 0, right: 0, height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
              pointerEvents: 'none',
            }} />

            {/* Header */}
            {(title || showClose) && (
              <div style={{
                padding: '20px 24px',
                borderBottom: '1px solid var(--c-border)',
                display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
                flexShrink: 0,
              }}>
                <div>
                  {title && (
                    <h2 style={{
                      fontSize: 17, fontWeight: 700,
                      color: 'var(--c-text-primary)', letterSpacing: '-0.3px',
                    }}>
                      {title}
                    </h2>
                  )}
                  {subtitle && (
                    <p style={{ fontSize: 13, color: 'var(--c-text-secondary)', marginTop: 3 }}>
                      {subtitle}
                    </p>
                  )}
                </div>
                {showClose && (
                  <button
                    onClick={onClose}
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid var(--c-border)',
                      borderRadius: 'var(--r-md)',
                      width: 32, height: 32,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer', color: 'var(--c-text-muted)',
                      transition: 'all var(--t-fast)', flexShrink: 0, marginLeft: 12,
                    }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                      e.currentTarget.style.color = 'var(--c-text-primary)';
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
                      e.currentTarget.style.color = 'var(--c-text-muted)';
                    }}
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            )}

            {/* Body */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '24px' }}>
              {children}
            </div>

            {/* Footer */}
            {footer && (
              <div style={{
                padding: '16px 24px',
                borderTop: '1px solid var(--c-border)',
                flexShrink: 0,
                display: 'flex', justifyContent: 'flex-end', gap: 10,
              }}>
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modal, document.body);
}
