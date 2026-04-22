import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileNav from './MobileNav';
import MobileMoreMenu from './MobileMoreMenu';
import { useSocket } from '../../hooks/useSocket';
import useSensorSimulation from '../../hooks/useSensorSimulation';
import useUIStore from '../../store/uiStore';

export default function AppLayout() {
  // Initialize Global Socket connection for currently logged in user
  useSocket();
  
  // Initialize Global Live Sensor Simulation
  useSensorSimulation();

  const { mobileMenuOpen, setMobileMenuOpen } = useUIStore();

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
      <MobileMoreMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
    </div>
  );
}
