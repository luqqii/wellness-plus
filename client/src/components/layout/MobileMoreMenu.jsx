import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogOut, ChevronRight, Sparkles } from 'lucide-react';
import { NAV_ITEMS, FREE_TOOLS, BOTTOM_ITEMS } from '../../utils/navigation';
import useAuthStore from '../../store/authStore';

export default function MobileMoreMenu({ isOpen, onClose }) {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="mobile-menu-backdrop"
          />

          {/* Menu Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="mobile-menu-drawer-full"
          >
            <div className="mobile-menu-header-full">
              <div className="sidebar-logo" style={{ border: 'none', padding: 0 }}>
                <div className="sidebar-logo-icon">
                  <Sparkles size={16} color="white" />
                </div>
                <span className="sidebar-logo-text">Wellness+</span>
              </div>
              <button onClick={onClose} className="mobile-menu-close">
                <X size={20} />
              </button>
            </div>

            <div className="mobile-menu-content">
              {/* Main Nav Items */}
              <div className="mobile-menu-section">
                <div className="mobile-menu-list">
                  {NAV_ITEMS.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className="mobile-menu-list-item-clean"
                    >
                      <div className="nav-icon">
                        <item.icon size={20} />
                      </div>
                      <span className="nav-label">{item.label}</span>
                      {item.badge && <span className="nav-badge">{item.badge}</span>}
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* Free Tools */}
              <div className="mobile-menu-section" style={{ marginTop: 24 }}>
                <div className="mobile-menu-section-label" style={{ color: 'var(--c-orange)', marginLeft: 12 }}>Free Tools</div>
                <div className="mobile-menu-list">
                  {FREE_TOOLS.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className="mobile-menu-list-item-clean"
                    >
                      <div className="nav-icon">
                        <item.icon size={18} />
                      </div>
                      <span className="nav-label">{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* Account & Settings */}
              <div className="mobile-menu-section" style={{ marginTop: 24, borderTop: '1px solid var(--c-border)', paddingTop: 16 }}>
                <div className="mobile-menu-list">
                  {BOTTOM_ITEMS.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onClose}
                      className="mobile-menu-list-item-clean"
                      style={{ color: 'var(--c-text-muted)' }}
                    >
                      <div className="nav-icon">
                        <item.icon size={18} />
                      </div>
                      <span className="nav-label">{item.label}</span>
                    </NavLink>
                  ))}
                  <button onClick={handleLogout} className="mobile-menu-list-item-clean logout" style={{ width: '100%', textAlign: 'left', border: 'none', background: 'none' }}>
                    <div className="nav-icon">
                      <LogOut size={18} color="var(--c-red)" />
                    </div>
                    <span className="nav-label" style={{ color: 'var(--c-red)' }}>Logout</span>
                  </button>
                </div>
              </div>
            </div>
            
            <div style={{ height: 40 }} /> {/* Bottom padding */}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

