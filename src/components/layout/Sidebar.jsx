import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ReceiptText,
  LineChart,
  PieChart,
  Target,
  Flame,
  Bot,
  Compass,
  Settings,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import BRAND from '../../config/brand.js';

export default function Sidebar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return 'V';
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const navGroups = [
    {
      group: 'MONEY',
      links: [
        { to: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { to: '/app/transactions', label: 'Transactions', icon: ReceiptText },
        { to: '/app/analytics', label: 'Analytics', icon: LineChart },
        { to: '/app/budgets', label: 'Budgets', icon: PieChart }
      ]
    },
    {
      group: 'GOALS',
      links: [
        { to: '/app/savings-goals', label: 'Savings Goals', icon: Target },
        { to: '/app/streaks', label: 'Streaks & Habits', icon: Flame }
      ]
    },
    {
      group: 'AI TOOLS',
      links: [
        { to: '/app/assistant', label: 'Assistant', icon: Bot },
        { to: '/app/trip-planner', label: 'Trip Planner', icon: Compass }
      ]
    },
    {
      group: 'ACCOUNT',
      links: [
        { to: '/app/settings', label: 'Settings', icon: Settings }
      ]
    }
  ];

  return (
    <aside
      style={{
        width: '240px',
        height: '100vh',
        background: 'var(--color-ink-deep)',
        borderRight: '1px solid var(--color-ink-border)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0
      }}
      className="desktop-sidebar"
    >
      {/* Top brand header */}
      <div>
        <div style={{ padding: '24px 20px 20px' }}>
          <NavLink to="/app/dashboard" style={{ textDecoration: 'none' }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                color: 'var(--color-cream)',
                letterSpacing: '-0.01em'
              }}
            >
              {BRAND.name}
            </span>
          </NavLink>
        </div>

        {/* Navigation list */}
        <nav style={{ padding: '8px 0', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {navGroups.map((grp) => (
            <div key={grp.group}>
              <div
                className="ui-label"
                style={{
                  padding: '0 20px 8px',
                  fontSize: '0.625rem',
                  letterSpacing: '0.1em'
                }}
              >
                {grp.group}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {grp.links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <NavLink
                      key={link.to}
                      to={link.to}
                      style={({ isActive }) => ({
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '10px 20px',
                        textDecoration: 'none',
                        fontSize: 'var(--text-body-sm)',
                        fontWeight: 500,
                        color: isActive ? 'var(--color-cream)' : 'var(--color-cream-dim)',
                        borderLeft: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
                        background: 'transparent',
                        transition: 'color 0.15s ease, border-color 0.15s ease'
                      })}
                    >
                      <Icon size={20} strokeWidth={1.5} />
                      <span>{link.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* User profile and logout at bottom */}
      <div
        style={{
          borderTop: '1px solid var(--color-ink-border)',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', overflow: 'hidden' }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: '50%',
              background: 'var(--color-ink-raised)',
              border: '1px solid var(--color-ink-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-accent)',
              fontWeight: 600,
              fontSize: '0.8125rem',
              flexShrink: 0
            }}
          >
            {getInitials(profile?.full_name || user?.user_metadata?.full_name)}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--color-cream)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {profile?.full_name || user?.user_metadata?.full_name || 'Account'}
            </div>
            <div
              style={{
                fontSize: '0.6875rem',
                color: 'var(--color-cream-dim)',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {user?.email || 'user@velora.finance'}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          aria-label="Sign out"
          title="Sign out"
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--color-cream-dim)',
            cursor: 'pointer',
            padding: 6,
            borderRadius: 'var(--radius-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <LogOut size={18} strokeWidth={1.5} />
        </button>
      </div>
    </aside>
  );
}
