import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import MobileNav from './MobileNav';
import MobileMoreMenu from './MobileMoreMenu';
import { useSocket } from '../../hooks/useSocket';
import useDeviceSensors from '../../hooks/useDeviceSensors';
import useWeather from '../../hooks/useWeather';
import useSleepTracker from '../../hooks/useSleepTracker';
import useUIStore from '../../store/uiStore';

export default function AppLayout() {
  // Initialize Global Socket connection for currently logged in user
  useSocket();
  
  // Real device sensors: GPS, accelerometer, orientation, battery, network
  useDeviceSensors();
  // Real weather from GPS location via Open-Meteo (no key needed)
  useWeather();
  // Sleep pattern tracking via screen visibility + motion inactivity
  useSleepTracker();

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
