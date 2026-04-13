import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileNav from './MobileNav';
import { useSocket } from '../../hooks/useSocket';

export default function AppLayout() {
  // Initialize Global Socket connection for currently logged in user
  useSocket();

  // (Adaptive dark theme removed — app now uses Wellness+ Light Mode exclusively)

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
