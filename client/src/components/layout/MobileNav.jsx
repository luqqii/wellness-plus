import useUIStore from '../../store/uiStore';

const MAIN_ITEMS = [
  { path: '/dashboard',    label: 'Home',    icon: LayoutDashboard },
  { path: '/nutrition',    label: 'Diary',   icon: Utensils },
  { path: '/coach',        label: 'Coach',   icon: Brain },
  { path: '/meal-planner', label: 'Planner', icon: Calendar },
];

export default function MobileNav() {
  const location = useLocation();
  const { setMobileMenuOpen } = useUIStore();

  return (
    <nav className="mobile-nav">
      {MAIN_ITEMS.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            style={{
              color: isActive ? 'var(--c-orange)' : 'var(--c-text-muted)',
              position: 'relative',
            }}
          >
            {isActive && (
              <motion.div
                layoutId="mobile-indicator"
                style={{
                  position: 'absolute', top: 0, left: '50%',
                  transform: 'translateX(-50%)',
                  width: 20, height: 2,
                  background: 'var(--c-blue)',
                  borderRadius: '0 0 4px 4px',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <item.icon size={20} />
            <span className="mobile-nav-label">{item.label}</span>
          </NavLink>
        );
      })}

      {/* More Button */}
      <button
        onClick={() => setMobileMenuOpen(true)}
        className="mobile-nav-item"
        style={{
          color: 'var(--c-text-muted)',
          background: 'none',
          border: 'none',
          padding: '8px 12px',
        }}
      >
        <Menu size={20} />
        <span className="mobile-nav-label">More</span>
      </button>
    </nav>
  );
}

