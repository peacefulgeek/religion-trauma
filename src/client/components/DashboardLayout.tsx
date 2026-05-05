import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { MobileHeader } from './MobileHeader';
import { ReadingProgress } from './ReadingProgress';

interface Props {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="dashboard-layout">
      <ReadingProgress />

      {/* Mobile Header */}
      <MobileHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="dashboard-main" id="main-content">
        <div className="dashboard-content">
          {children}
        </div>
      </main>

      <style>{`
        .dashboard-layout {
          display: flex;
          min-height: 100vh;
          background: var(--color-bg);
        }

        .dashboard-main {
          flex: 1;
          margin-left: var(--sidebar-width);
          min-height: 100vh;
          transition: margin-left var(--transition-base);
        }

        .dashboard-content {
          max-width: 1100px;
          margin: 0 auto;
          padding: var(--space-8) var(--space-8) var(--space-16);
        }

        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(34, 30, 26, 0.5);
          z-index: calc(var(--z-sidebar) - 1);
          backdrop-filter: blur(2px);
        }

        @media (max-width: 1024px) {
          .dashboard-main {
            margin-left: 0;
            padding-top: 64px;
          }

          .sidebar-overlay {
            display: block;
          }

          .dashboard-content {
            padding: var(--space-6) var(--space-4) var(--space-12);
          }
        }

        @media (max-width: 640px) {
          .dashboard-content {
            padding: var(--space-4) var(--space-3) var(--space-10);
          }
        }
      `}</style>
    </div>
  );
}
