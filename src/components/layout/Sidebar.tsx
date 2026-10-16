import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  ReceiptText,
  BarChart3,
  Target,
  Flame,
  Bot,
  Settings,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { logout } from '../../lib/storage.js';

interface SidebarProps {
  user: {
    name: string;
    email: string;
    currency: string;
  };
}

export const Sidebar: React.FC<SidebarProps> = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <NavLink to="/dashboard" className="brand-mark">
          <span className="accent-symbol">◆</span>
          <span>VELORA</span>
        </NavLink>
      </div>

      <div className="sidebar-scroll">
        {/* Group: MONEY */}
        <div>
          <p className="nav-group-title">Money</p>
          <ul className="nav-links-list">
            <li>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/transactions"
                className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
              >
                <ReceiptText size={18} />
                <span>Transactions</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/analytics"
                className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
              >
                <BarChart3 size={18} />
                <span>Analytics</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Group: GOALS & HABITS */}
        <div>
          <p className="nav-group-title">Goals & Streaks</p>
          <ul className="nav-links-list">
            <li>
              <NavLink
                to="/goals"
                className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
              >
                <Target size={18} />
                <span>Savings Goals</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/streaks"
                className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
              >
                <Flame size={18} style={{ color: 'var(--accent)' }} />
                <span>Streaks & Matrix</span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Group: INTELLIGENCE */}
        <div>
          <p className="nav-group-title">Intelligence</p>
          <ul className="nav-links-list">
            <li>
              <NavLink
                to="/assistant"
                className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
              >
                <Bot size={18} />
                <span>AI Terminal</span>
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: '0.625rem',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    backgroundColor: 'rgba(201, 168, 76, 0.2)',
                    color: 'var(--accent)',
                    fontWeight: 600,
                  }}
                >
                  LIVE
                </span>
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Group: SYSTEM */}
        <div>
          <p className="nav-group-title">System</p>
          <ul className="nav-links-list">
            <li>
              <NavLink
                to="/settings"
                className={({ isActive }) => `nav-link-item ${isActive ? 'active' : ''}`}
              >
                <Settings size={18} />
                <span>Settings</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>

      {/* User Footer */}
      <div className="sidebar-footer">
        <div className="user-snippet">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', overflow: 'hidden' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '6px',
                backgroundColor: 'var(--ink-border)',
                border: '1px solid rgba(240, 237, 230, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
                fontWeight: 700,
                fontSize: '0.8125rem',
                flexShrink: 0,
              }}
            >
              {(user.name || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <div className="user-name">{user.name || 'User'}</div>
              <div className="user-status">{user.currency || 'INR'} Ledger</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log out"
            className="velora-btn btn-ghost btn-sm"
            style={{ padding: '0.4rem', minHeight: 'auto' }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};
