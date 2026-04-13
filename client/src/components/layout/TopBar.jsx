import { Search, Compass, BookOpen, Apple, Activity, Brain, User as UserIcon, Cog, ChevronRight, Utensils, CheckSquare, CalendarDays, GraduationCap, TrendingUp, Users, Layers, Calculator, Flame, Sparkles, BarChart2, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuthStore from '../../store/authStore';
import useUIStore from '../../store/uiStore';
import NotificationBell from '../notifications/NotificationBell';
import Avatar from '../ui/Avatar';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

const SEARCH_ROUTES = [
  // Core app pages
  { name: 'Dashboard',           keywords: 'home overview dashboard main',              route: '/dashboard',                  icon: Compass,   color: 'var(--c-blue)'   },
  { name: 'Daily Check-in',      keywords: 'check in daily log mood checkin new',       route: '/check-in',                   icon: CheckSquare, color: 'var(--c-teal)' },
  { name: 'Habit Tracker',       keywords: 'habit track streak task',                   route: '/habits',                     icon: BookOpen,  color: 'var(--c-purple)' },
  { name: 'AI Coach',            keywords: 'coach ai help chat psychology lesson',       route: '/coach',                      icon: Brain,     color: 'var(--c-pink)'   },
  { name: 'Food Diary',          keywords: 'food diary nutrition eat scan water macro',  route: '/nutrition',                  icon: Apple,     color: 'var(--c-teal)'   },
  { name: 'Meal Planner',        keywords: 'plan meal diet grocery list planner',        route: '/meal-planner',               icon: CalendarDays, color: 'var(--c-yellow)' },
  { name: 'Recipes',             keywords: 'recipe cook dinner breakfast lunch',         route: '/recipes',                    icon: Utensils,  color: 'var(--c-orange)' },
  { name: 'Activity & Sleep',    keywords: 'step sleep work run activity fitness workout', route: '/activity',                 icon: Activity,  color: 'var(--c-blue)'   },
  { name: 'Courses & Lessons',   keywords: 'course lesson learn program education',      route: '/lessons',                    icon: GraduationCap, color: 'var(--c-purple)' },
  { name: 'Weight Tracker',      keywords: 'weight tracker log scale body',             route: '/weight-tracker',             icon: TrendingUp, color: 'var(--c-teal)'  },
  { name: 'Group Sessions',      keywords: 'group session community social',             route: '/community',                  icon: Users,     color: 'var(--c-blue)'   },
  { name: 'Food Color Guide',    keywords: 'food color guide green yellow red Wellness+',     route: '/food-guide',                 icon: Layers,    color: 'var(--c-orange)' },
  // Free Tools
  { name: 'Macro Calculator',    keywords: 'macro calculator protein carbs fat',         route: '/macro-calculator',           icon: Calculator, color: 'var(--c-yellow)' },
  { name: 'Calorie Calculator',  keywords: 'calorie calculator deficit calories',        route: '/calorie-deficit-calculator', icon: Flame,     color: 'var(--c-orange)' },
  { name: 'Personality Quiz',    keywords: 'personality quiz type eating behaviour',     route: '/personality-quiz',           icon: Sparkles,  color: 'var(--c-pink)'   },
  { name: 'BMI Calculator',      keywords: 'bmi body mass index calculator',             route: '/bmi-calculator',             icon: BarChart2, color: 'var(--c-teal)'   },
  // Account
  { name: 'My Profile',          keywords: 'profile me account user goals',             route: '/profile',                    icon: UserIcon,  color: 'var(--c-text-primary)' },
  { name: 'Settings',            keywords: 'settings config theme notifications',        route: '/settings',                   icon: Cog,       color: 'var(--c-text-muted)'  },
];

export default function TopBar() {
  const { user } = useAuthStore();
  const { setMobileMenuOpen } = useUIStore();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isFocused, setIsFocused] = React.useState(false);
  const navigate = useNavigate();
  
  const filteredRoutes = React.useMemo(() => {
    if (!searchTerm) return [];
    const s = searchTerm.toLowerCase().trim();
    return SEARCH_ROUTES.filter(r => 
      r.name.toLowerCase().includes(s) || r.keywords.includes(s)
    );
  }, [searchTerm]);

  const executeSearch = (targetRoute) => {
    if (targetRoute) {
      navigate(targetRoute);
    } else if (filteredRoutes.length > 0) {
      navigate(filteredRoutes[0].route);
    } else {
      navigate('/dashboard');
    }
    setSearchTerm('');
    setIsFocused(false);
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  };

  return (
    <div className="topbar">
      {/* Left */}
      <div className="mobile-hide" style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <span style={{ fontSize: 12, color: 'var(--c-text-muted)', fontWeight: 400 }}>
          {getGreeting()} 👋
        </span>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--c-text-primary)' }}>
          {user?.name || 'Alex'}
        </span>
      </div>

      {/* Left (Mobile Logo & Hamburger) */}
      <div className="mobile-only-logo" style={{ alignItems: 'center', gap: 12, display: 'flex' }}>
        <button 
          onClick={() => setMobileMenuOpen(true)}
          style={{ background: 'none', border: 'none', padding: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--c-text-primary)' }}
        >
          <Menu size={24} />
        </button>
        <div 
          onClick={() => navigate('/dashboard')}
          style={{ padding: '0 10px', height: 32, borderRadius: 10, background: 'var(--c-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
        >
           <span style={{color:'white', fontWeight: 900, fontSize: 14, letterSpacing: '-0.5px'}}>Wellness+</span>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Search */}
        <div className="search-input-wrap mobile-hide" style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--r-md)', padding: '6px 12px', border: '1px solid var(--c-border)', position: 'relative' }}>
          <Search 
            size={16} 
            color="var(--c-text-muted)" 
            style={{ cursor: 'pointer', marginRight: 6 }} 
            onClick={() => executeSearch()} 
          />
          <input 
            placeholder="Search foods, habits, recipes..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            style={{ background: 'transparent', border: 'none', outline: 'none', color: 'var(--c-text-primary)', fontSize: 13, width: '220px' }}
          />

          {/* Live Search Dropdown */}
          <AnimatePresence>
            {searchTerm && isFocused && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                style={{
                  position: 'absolute', top: 'calc(100% + 8px)', left: 0, width: '100%',
                  background: 'var(--c-bg-card)', border: '1px solid var(--c-border-strong)',
                  borderRadius: 12, boxShadow: 'var(--shadow-lg)', overflow: 'hidden', zIndex: 100
                }}
              >
                {filteredRoutes.length > 0 ? (
                  <div style={{ padding: '6px 0' }}>
                    {filteredRoutes.map((route, i) => (
                      <div 
                        key={i}
                        onClick={() => executeSearch(route.route)}
                        style={{
                          display: 'flex', alignItems: 'center', padding: '10px 14px', gap: 12,
                          cursor: 'pointer', transition: 'background var(--t-fast)'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--c-bg-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                         <route.icon size={16} color={route.color} />
                         <span style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--c-text-primary)' }}>{route.name}</span>
                         <ChevronRight size={14} color="var(--c-text-muted)" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ padding: '16px', textAlign: 'center', fontSize: 13, color: 'var(--c-text-muted)' }}>
                    No modules match "{searchTerm}"
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Notification Bell with dropdown panel */}
        <NotificationBell />

        {/* User Avatar */}
        <Avatar
          name={user?.name || 'Alex'}
          src={user?.profilePic}
          size="sm"
          status="online"
          onClick={() => navigate('/profile')}
          style={{ cursor: 'pointer', borderRadius: 'var(--r-md)' }}
        />
      </div>
    </div>
  );
}
