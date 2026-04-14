import React from 'react';
import { Outlet } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import PublicNavbar from './PublicNavbar';
import AppLayout from './AppLayout';

/**
 * ToolLayout - Renders Free Tools inside the dashboard shell when authenticated,
 * or with the PublicNavbar when not authenticated.
 */
export default function ToolLayout() {
  const { isAuthenticated } = useAuthStore();

  if (isAuthenticated) {
    // Render the tool page within the dashboard shell (sidebar + topbar)
    return <AppLayout />;
  }

  // For public (logged-out) users, wrap with the public navbar context
  return (
    <div>
      <PublicNavbar />
      <Outlet />
    </div>
  );
}
