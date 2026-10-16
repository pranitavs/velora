import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from 'lucide-react';
import BRAND from '../../config/brand.js';

export default function TopBar() {
  const location = useLocation();

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/dashboard')) return 'Dashboard';
    if (path.includes('/transactions')) return 'Transactions';
    if (path.includes('/analytics')) return 'Analytics';
    if (path.includes('/budgets')) return 'Budgets';
    if (path.includes('/savings-goals')) return 'Savings Goals';
    if (path.includes('/streaks')) return 'Streaks & Habits';
    if (path.includes('/assistant')) return 'Financial Assistant';
    if (path.includes('/trip-planner')) return 'Trip Planner';
    if (path.includes('/settings')) return 'Settings';
    return BRAND.name;
  };

  return (
    <header
      style={{
        height: '56px',
        background: 'var(--color-ink-deep)',
        borderBottom: '1px solid var(--color-ink-border)',
        padding: '0 16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 40
      }}
      className="mobile-topbar"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-cream)' }}>
          {getPageTitle()}
        </span>
      </div>

      <Link
        to="/app/settings"
        aria-label="Account Settings"
        style={{
          width: 32,
          height: 32,
          borderRadius: '50%',
          background: 'var(--color-ink-raised)',
          border: '1px solid var(--color-ink-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--color-cream)'
        }}
      >
        <User size={16} strokeWidth={1.5} />
      </Link>
    </header>
  );
}
