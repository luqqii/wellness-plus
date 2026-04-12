import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileNav from './MobileNav';
import { useSocket } from '../../hooks/useSocket';

export default function AppLayout() {
  // Initialize Global Socket connection for currently logged in user
  useSocket();

  // Item #11: Adaptive Theme based on time of day
  React.useEffect(() => {
    const hour = new Date().getHours();
    const root = document.documentElement;
    if (hour >= 5 && hour < 12) {
      // Morning
      root.style.setProperty('--c-bg-base', '#0c0f12');
      root.style.setProperty('--c-bg-surface', '#13171e');
    } else if (hour >= 12 && hour < 17) {
      // Afternoon
      root.style.setProperty('--c-bg-base', '#0a0b0f');
      root.style.setProperty('--c-bg-surface', '#111318');
    } else if (hour >= 17 && hour < 21) {
      // Evening
      root.style.setProperty('--c-bg-base', '#110b0a'); // warm tint
      root.style.setProperty('--c-bg-surface', '#181211');
    } else {
      // Night
      root.style.setProperty('--c-bg-base', '#050608'); // dark tint
      root.style.setProperty('--c-bg-surface', '#0b0d12');
    }
  }, []);

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-area">
        <TopBar />
        <div className="page-content">
          <Outlet />
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
