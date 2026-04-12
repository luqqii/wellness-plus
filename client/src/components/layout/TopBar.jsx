import React from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import NotificationBell from '../notifications/NotificationBell';
import Avatar from '../ui/Avatar';

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

export default function TopBar() {
  const { user } = useAuthStore();
  const [searchTerm, setSearchTerm] = React.useState('');
  const navigate = useNavigate();
  
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      const s = searchTerm.toLowerCase().trim();
      if (!s) return;
      if (s.includes('plan') || s.includes('grocery') || s.includes('list') || s.includes('meal')) navigate('/meal-planner');
      else if (s.includes('recipe') || s.includes('cook')) navigate('/recipes');
      else if (s.includes('food') || s.includes('cal') || s.includes('lunch') || s.includes('eat') || s.includes('diary') || s.includes('scan')) navigate('/nutrition');
      else if (s.includes('habit') || s.includes('track') || s.includes('task')) navigate('/habits');
      else if (s.includes('coach') || s.includes('ai') || s.includes('chat')) navigate('/coach');
      else if (s.includes('step') || s.includes('sleep') || s.includes('activity') || s.includes('walk') || s.includes('run')) navigate('/activity');
      else if (s.includes('profile') || s.includes('me') || s.includes('goal')) navigate('/profile');
      else if (s.includes('set') || s.includes('config')) navigate('/settings');
      setSearchTerm('');
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

      {/* Left (Mobile Logo) */}
      <div className="mobile-only-logo" style={{ alignItems: 'center', gap: 6 }}>
        <div style={{ padding: '0 10px', height: 32, borderRadius: 10, background: 'var(--c-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <span style={{color:'white', fontWeight: 900, fontSize: 14, letterSpacing: '-0.5px'}}>Wellness+</span>
        </div>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Search */}
        <div className="search-input-wrap mobile-hide" style={{ display: 'flex' }}>
          <Search size={14} color="var(--c-text-muted)" />
          <input 
            placeholder="Search foods, habits..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          />
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
