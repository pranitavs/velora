import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext.jsx';
import { CurrencyProvider } from '../contexts/CurrencyContext.jsx';
import ProtectedRoute from './ProtectedRoute.jsx';
import AppShell from '../components/layout/AppShell.jsx';
import Spinner from '../components/ui/Spinner.jsx';

// Lazy-loaded Pages
const LandingPage = lazy(() => import('../pages/landing/LandingPage.jsx'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage.jsx'));
const SignupPage = lazy(() => import('../pages/auth/SignupPage.jsx'));
const OnboardingPage = lazy(() => import('../pages/auth/OnboardingPage.jsx'));
const PasswordResetPage = lazy(() => import('../pages/auth/PasswordResetPage.jsx'));
const PrivacyPolicyPage = lazy(() => import('../pages/legal/PrivacyPolicyPage.jsx'));
const TermsPage = lazy(() => import('../pages/legal/TermsPage.jsx'));

// App Pages
const DashboardPage = lazy(() => import('../pages/app/DashboardPage.jsx'));
const TransactionsPage = lazy(() => import('../pages/app/TransactionsPage.jsx'));
const AnalyticsPage = lazy(() => import('../pages/app/AnalyticsPage.jsx'));
const BudgetsPage = lazy(() => import('../pages/app/BudgetsPage.jsx'));
const SavingsGoalsPage = lazy(() => import('../pages/app/SavingsGoalsPage.jsx'));
const StreaksPage = lazy(() => import('../pages/app/StreaksPage.jsx'));
const AssistantPage = lazy(() => import('../pages/app/AssistantPage.jsx'));
const TripPlannerPage = lazy(() => import('../pages/app/TripPlannerPage.jsx'));
const SettingsPage = lazy(() => import('../pages/app/SettingsPage.jsx'));

function LoadingFallback() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-ink)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Spinner size={36} />
    </div>
  );
}

export default function AppRouter() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CurrencyProvider>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/reset-password" element={<PasswordResetPage />} />
              <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="/terms-of-use" element={<TermsPage />} />

              {/* Onboarding Route (requires login session, but onboarding_complete is false) */}
              <Route
                path="/onboarding"
                element={
                  <ProtectedRoute allowIncompleteOnboarding={true}>
                    <OnboardingPage />
                  </ProtectedRoute>
                }
              />

              {/* Authenticated Application Routes (wrapped in AppShell & ProtectedRoute) */}
              <Route
                path="/app"
                element={
                  <ProtectedRoute>
                    <AppShell />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/app/dashboard" replace />} />
                <Route path="dashboard" element={<DashboardPage />} />
                <Route path="transactions" element={<TransactionsPage />} />
                <Route path="analytics" element={<AnalyticsPage />} />
                <Route path="budgets" element={<BudgetsPage />} />
                <Route path="savings-goals" element={<SavingsGoalsPage />} />
                <Route path="streaks" element={<StreaksPage />} />
                <Route path="assistant" element={<AssistantPage />} />
                <Route path="trip-planner" element={<TripPlannerPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>

              {/* Catch-all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </CurrencyProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
