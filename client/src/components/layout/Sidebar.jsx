import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { NAV_ITEMS, FREE_TOOLS, BOTTOM_ITEMS } from '../../utils/navigation';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import useUIStore from '../../store/uiStore';
import useAuthStore from '../../store/authStore';

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
  const { logout } = useAuthStore();
  const location = useLocation();

  return (
    <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`} style={{ position: 'relative' }}>
      <div className="sidebar-inner">
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Sparkles size={16} color="white" />
          </div>
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.span
                className="sidebar-logo-text"
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.2 }}
              >
                Wellness+
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Nav */}
        <nav className="sidebar-nav">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <span className="nav-icon">
                  <item.icon size={18} />
                </span>
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span
                      className="nav-label"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                {item.badge && !sidebarCollapsed && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Free Tools Section */}
        {!sidebarCollapsed && (
          <div style={{ padding: '8px 12px 4px', fontSize: 10, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: '#EC5A42', marginTop: 8 }}>Free Tools</div>
        )}
        <nav className="sidebar-nav" style={{ marginTop: 0 }}>
          {FREE_TOOLS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink key={item.path} to={item.path} className={`nav-item ${isActive ? 'active' : ''}`} title={sidebarCollapsed ? item.label : undefined}>
                <span className="nav-icon"><item.icon size={16} /></span>
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span className="nav-label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer nav */}
        <div className="sidebar-footer">
          {BOTTOM_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`nav-item ${isActive ? 'active' : ''}`}
                style={{ color: 'var(--c-text-muted)' }}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <span className="nav-icon"><item.icon size={16} /></span>
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.span className="nav-label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.15 }}>
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Collapse toggle */}
      <button className="sidebar-collapse-btn" onClick={toggleSidebar} title={sidebarCollapsed ? 'Expand' : 'Collapse'}>
        {sidebarCollapsed
          ? <ChevronRight size={11} />
          : <ChevronLeft size={11} />
        }
      </button>
    </div>

  );
}
