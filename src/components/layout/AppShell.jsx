import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
import TopBar from './TopBar.jsx';
import BottomNav from './BottomNav.jsx';

export default function AppShell() {
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        background: 'var(--color-ink)',
        color: 'var(--color-cream)'
      }}
      className="app-shell"
    >
      {/* Desktop Sidebar (>=1024px) */}
      <div className="desktop-only">
        <Sidebar />
      </div>

      {/* Main Content Column */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          minHeight: '100vh'
        }}
      >
        {/* Mobile Top Bar (<1024px) */}
        <div className="mobile-only">
          <TopBar />
        </div>

        {/* Scrollable Viewport Area */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto'
          }}
          className="app-main-viewport"
        >
          <div
            style={{
              maxWidth: '1440px',
              margin: '0 auto',
              width: '100%'
            }}
            className="app-content-container"
          >
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation (<1024px) */}
        <div className="mobile-only">
          <BottomNav />
        </div>
      </div>
    </div>
  );
}
