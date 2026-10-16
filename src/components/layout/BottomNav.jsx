import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ReceiptText, Target, Bot, Settings } from 'lucide-react';

export default function BottomNav() {
  const navItems = [
    { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/app/transactions', label: 'Transactions', icon: ReceiptText },
    { to: '/app/savings-goals', label: 'Goals', icon: Target },
    { to: '/app/assistant', label: 'AI', icon: Bot },
    { to: '/app/settings', label: 'Profile', icon: Settings }
  ];

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '56px',
        background: 'var(--color-ink-deep)',
        borderTop: '1px solid var(--color-ink-border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        zIndex: 50
      }}
      className="mobile-bottomnav"
      aria-label="Mobile Navigation"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            aria-label={item.label}
            title={item.label}
            style={({ isActive }) => ({
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-md)',
              color: isActive ? 'var(--color-accent)' : 'var(--color-cream-dim)',
              textDecoration: 'none',
              transition: 'color 0.15s ease'
            })}
          >
            <Icon size={20} strokeWidth={1.5} />
            <span style={{ fontSize: '0.625rem', marginTop: 2, fontWeight: 500 }}>
              {item.label}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
}
