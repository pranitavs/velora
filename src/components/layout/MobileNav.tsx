import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ReceiptText,
  Target,
  Flame,
  Bot,
} from 'lucide-react';

export const MobileNav: React.FC = () => {
  return (
    <nav className="mobile-nav-bar" aria-label="Mobile Navigation">
      <ul className="mobile-nav-list">
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <LayoutDashboard size={18} />
            <span>Cockpit</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/transactions"
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <ReceiptText size={18} />
            <span>Ledger</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/goals"
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <Target size={18} />
            <span>Goals</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/streaks"
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <Flame size={18} />
            <span>Streaks</span>
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/assistant"
            className={({ isActive }) => `mobile-nav-item ${isActive ? 'active' : ''}`}
          >
            <Bot size={18} />
            <span>AI Mentor</span>
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
