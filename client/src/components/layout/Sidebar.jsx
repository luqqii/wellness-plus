import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Target, MessageCircle, Utensils, Activity,
  User, Settings, ChevronLeft, ChevronRight, Sparkles, Brain, Calendar, ChefHat,
  Calculator, FlaskConical, PersonStanding, Scale, BookOpen, LogOut, Users, Salad, Heart
} from 'lucide-react';
import useUIStore from '../../store/uiStore';
import useAuthStore from '../../store/authStore';

const NAV_ITEMS = [
  { path: '/dashboard',     label: 'Dashboard',      icon: LayoutDashboard },
  { path: '/check-in',      label: 'Daily Check-in', icon: Heart, badge: 'New' },
  { path: '/habits',        label: 'Habits',         icon: Target },
  { path: '/coach',         label: 'AI Coach',       icon: Brain, badge: 'AI' },
  { path: '/nutrition',     label: 'Food Diary',     icon: Utensils },
  { path: '/meal-planner',  label: 'Meal Planner',   icon: Calendar },
  { path: '/recipes',       label: 'Recipes',        icon: ChefHat },
  { path: '/activity',      label: 'Activity',       icon: Activity },
  { path: '/lessons',       label: 'Courses',        icon: BookOpen },
  { path: '/weight-tracker',label: 'Weight Tracker', icon: Scale },
  { path: '/community',     label: 'Group Sessions', icon: Users },
  { path: '/food-guide',    label: 'Food Color Guide',icon: Salad },
];

const FREE_TOOLS = [
  { path: '/macro-calculator',          label: 'Macro Calculator',  icon: Calculator },
  { path: '/calorie-deficit-calculator', label: 'Calorie Calc',     icon: FlaskConical },
  { path: '/personality-quiz',           label: 'Personality Quiz', icon: PersonStanding },
  { path: '/bmi-calculator',             label: 'BMI Calculator',   icon: Scale },
];

const BOTTOM_ITEMS = [
  { path: '/profile',  label: 'Profile',  icon: User },
  { path: '/settings', label: 'Settings', icon: Settings },
];

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
