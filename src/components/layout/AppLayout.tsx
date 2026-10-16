import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Sidebar } from './Sidebar.tsx';
import { MobileNav } from './MobileNav.tsx';
import { Header } from './Header.tsx';
import { TransactionModal } from '../transactions/TransactionModal.tsx';
import {
  getState,
  subscribeToStorage,
  addTransaction,
  getSession,
  checkDailyReset,
} from '../../lib/storage.js';

export const AppLayout: React.FC = () => {
  const [appState, setAppState] = useState(getState());
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    checkDailyReset();
    const unsubscribe = subscribeToStorage((newState: any) => {
      setAppState(newState);
    });
    return () => unsubscribe();
  }, []);

  // Check auth session
  useEffect(() => {
    const session = getSession();
    if (!session || !session.isLoggedIn) {
      navigate('/login');
    }
  }, [location.pathname, navigate]);

  // Determine page title based on path
  const getHeaderMeta = () => {
    const path = location.pathname;
    if (path.includes('dashboard')) {
      return { title: 'Financial Cockpit', subtitle: 'Live cashflow balances and performance velocity' };
    }
    if (path.includes('transactions')) {
      return { title: 'Ledger Records', subtitle: 'Historical inflow, outflow, and payment audit' };
    }
    if (path.includes('analytics')) {
      return { title: 'Analytics & Trends', subtitle: 'Category breakdowns, cashflow margins, and observations' };
    }
    if (path.includes('goals')) {
      return { title: 'Savings Targets', subtitle: 'Capital targets, time horizons, and accelerated contributions' };
    }
    if (path.includes('streaks')) {
      return { title: 'Streaks & Activity Matrix', subtitle: '90-day discipline matrix and daily financial check-ins' };
    }
    if (path.includes('assistant')) {
      return { title: 'Terminal AI Mentor', subtitle: 'Institutional-grade student finance advisor' };
    }
    if (path.includes('settings')) {
      return { title: 'System Settings', subtitle: 'Data sovereignty, currency switches, and ledger configuration' };
    }
    return { title: 'VELORA', subtitle: 'Personal Finance Terminal' };
  };

  const meta = getHeaderMeta();

  const handleSaveTransaction = (tx: any) => {
    addTransaction(tx);
  };

  return (
    <div className="app-container">
      {/* Desktop Sidebar */}
      <Sidebar user={appState.user} />

      {/* Main Content Area */}
      <div className="main-wrapper">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onOpenAddTransaction={() => setIsTxModalOpen(true)}
          streakCount={appState.streak?.currentStreak || 0}
          currency={appState.user?.currency || 'INR'}
        />

        <main className="content-viewport">
          <Outlet context={{ appState, onOpenAddTransaction: () => setIsTxModalOpen(true) }} />
        </main>
      </div>

      {/* Mobile Sticky Bottom Nav */}
      <MobileNav />

      {/* Global Transaction Modal */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        onSave={handleSaveTransaction}
        currency={appState.user?.currency || 'INR'}
      />
    </div>
  );
};
