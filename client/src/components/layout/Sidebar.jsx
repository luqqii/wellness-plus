import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Target, MessageCircle, Utensils, Activity,
  User, Settings, ChevronLeft, ChevronRight, Sparkles, Brain, Calendar, ChefHat
} from 'lucide-react';
import useUIStore from '../../store/uiStore';

const NAV_ITEMS = [
  { path: '/dashboard',    label: 'Dashboard',     icon: LayoutDashboard },
  { path: '/habits',       label: 'Habits',        icon: Target },
  { path: '/coach',        label: 'AI Coach',      icon: Brain,  badge: 'AI' },
  { path: '/nutrition',    label: 'Food Diary',    icon: Utensils },
  { path: '/meal-planner', label: 'Meal Planner',  icon: Calendar },
  { path: '/recipes',      label: 'Recipes',       icon: ChefHat },
  { path: '/activity',     label: 'Activity',      icon: Activity },
];

const BOTTOM_ITEMS = [
  { path: '/profile',  label: 'Profile',  icon: User },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar } = useUIStore();
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
