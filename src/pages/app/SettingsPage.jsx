import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Shield, Download, Lock, Trash2, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Card from '../../components/ui/Card.jsx';
import Button from '../../components/ui/Button.jsx';
import Input from '../../components/ui/Input.jsx';
import Select from '../../components/ui/Select.jsx';
import { useAuth } from '../../hooks/useAuth.js';
import { useTransactions } from '../../hooks/useTransactions.js';
import { useSavingsGoals } from '../../hooks/useSavingsGoals.js';
import BRAND from '../../config/brand.js';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, profile, updateProfile, resetPassword, signOut } = useAuth();
  const { transactions } = useTransactions();
  const { goals, contributions } = useSavingsGoals();

  const [fullName, setFullName] = useState(profile?.full_name || user?.user_metadata?.full_name || '');
  const [currencyCode, setCurrencyCode] = useState(profile?.currency_code || 'INR');
  const [incomeFrequency, setIncomeFrequency] = useState(profile?.income_frequency || 'monthly');

  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [pwdResetSent, setPwdResetSent] = useState(false);
  const [pwdLoading, setPwdLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess(false);

    const currencyMap = {
      INR: '₹',
      USD: '$',
      EUR: '€',
      GBP: '£'
    };

    try {
      await updateProfile({
        full_name: fullName.trim(),
        currency_code: currencyCode,
        currency_symbol: currencyMap[currencyCode] || '₹',
        income_frequency: incomeFrequency
      });
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update profile:', err);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async () => {
    if (!user?.email) return;
    setPwdLoading(true);
    try {
      await resetPassword(user.email);
      setPwdResetSent(true);
    } catch (err) {
      console.error(err);
    } finally {
      setPwdLoading(false);
    }
  };

  const handleExportAllTransactions = () => {
    if (!transactions || transactions.length === 0) {
      alert('No transactions to export.');
      return;
    }
    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount', 'Payment Method', 'Notes'];
    const rows = transactions.map(t => [
      `"${t.date || ''}"`,
      `"${t.type || ''}"`,
      `"${(t.category || '').replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      Number(t.amount || 0).toFixed(2),
      `"${(t.payment_method || '').replace(/"/g, '""')}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadFile(csv, `velora_all_transactions_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  };

  const handleExportSavings = () => {
    if (!goals || goals.length === 0) {
      alert('No savings goals to export.');
      return;
    }
    const headers = ['Goal Name', 'Target Amount', 'Current Amount', 'Status', 'Target Date'];
    const rows = goals.map(g => [
      `"${g.name}"`,
      Number(g.target_amount || 0).toFixed(2),
      Number(g.current_amount || 0).toFixed(2),
      `"${g.status || 'active'}"`,
      `"${g.target_date || ''}"`
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    downloadFile(csv, `velora_savings_goals_${new Date().toISOString().split('T')[0]}.csv`, 'text/csv');
  };

  const downloadFile = (content, filename, type) => {
    const blob = new Blob([content], { type: `${type};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDeleteAccount = async () => {
    const confirmed = window.confirm(
      'Are you completely sure you want to delete your VELORA account? All transaction ledgers and savings targets will be permanently removed.'
    );
    if (confirmed) {
      localStorage.clear();
      await signOut();
      navigate('/signup');
    }
  };

  return (
    <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: 28 }}>
      <PageHeader
        title="Settings & Preferences"
        subtitle="Manage your identity, currency standards, privacy agreements, and data exports."
      />

      {/* SECTION 1: PROFILE & PREFERENCES */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <User size={20} strokeWidth={1.5} color="var(--color-accent)" />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-cream)' }}>
            Profile & Currency
          </h3>
        </div>

        {profileSuccess && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 6, background: 'rgba(76, 175, 130, 0.12)', color: 'var(--color-positive)', marginBottom: 16 }}>
            <CheckCircle2 size={16} strokeWidth={2} /> Profile preferences updated successfully.
          </div>
        )}

        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Input
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <div className="form-group">
            <label className="ui-label">Email Address</label>
            <input
              type="email"
              disabled
              value={user?.email || 'user@velora.finance'}
              style={{
                background: 'var(--color-ink)',
                border: '1px solid var(--color-ink-border)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--color-cream-dim)',
                padding: '12px 16px',
                fontSize: 'var(--text-body)',
                cursor: 'not-allowed'
              }}
            />
            <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-faint)', marginTop: 4 }}>
              To modify your primary security email, contact security@{BRAND.name.toLowerCase()}.finance.
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Select
              label="Display Currency"
              value={currencyCode}
              onChange={(e) => setCurrencyCode(e.target.value)}
              options={[
                { value: 'INR', label: 'INR (₹) - Indian Rupee' },
                { value: 'USD', label: 'USD ($) - US Dollar' },
                { value: 'EUR', label: 'EUR (€) - Euro' },
                { value: 'GBP', label: 'GBP (£) - British Pound' }
              ]}
            />

            <Select
              label="Income Frequency"
              value={incomeFrequency}
              onChange={(e) => setIncomeFrequency(e.target.value)}
              options={[
                { value: 'monthly', label: 'Monthly' },
                { value: 'weekly', label: 'Weekly' },
                { value: 'fortnightly', label: 'Fortnightly' }
              ]}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
            <Button type="submit" variant="primary" loading={savingProfile}>
              Save Preferences
            </Button>
          </div>
        </form>
      </Card>

      {/* SECTION 2: DATA EXPORT */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Download size={20} strokeWidth={1.5} color="var(--color-accent)" />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-cream)' }}>
            Data Portability
          </h3>
        </div>
        <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-cream-dim)', marginBottom: 16 }}>
          Export your complete financial records into standard CSV format for external spreadsheets or tax filing.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Button variant="secondary" onClick={handleExportAllTransactions}>
            <Download size={16} strokeWidth={1.5} /> Export Transactions CSV
          </Button>
          <Button variant="secondary" onClick={handleExportSavings}>
            <Download size={16} strokeWidth={1.5} /> Export Savings Goals CSV
          </Button>
        </div>
      </Card>

      {/* SECTION 3: SECURITY & PRIVACY */}
      <Card>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <Lock size={20} strokeWidth={1.5} color="var(--color-accent)" />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-cream)' }}>
            Security & Credentials
          </h3>
        </div>

        {pwdResetSent ? (
          <div style={{ padding: '10px 14px', borderRadius: 6, background: 'rgba(76, 175, 130, 0.12)', color: 'var(--color-positive)', fontSize: 'var(--text-body-sm)' }}>
            Password reset link dispatched to your registered email. Check your inbox.
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontWeight: 500, fontSize: 'var(--text-body-sm)' }}>Password Management</div>
              <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)' }}>
                Send an encrypted authorization link to update your password.
              </div>
            </div>
            <Button variant="secondary" onClick={handleChangePassword} loading={pwdLoading}>
              Reset Password
            </Button>
          </div>
        )}

        <div style={{ borderTop: '1px solid var(--color-ink-border)', marginTop: 20, paddingTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontWeight: 500, fontSize: 'var(--text-body-sm)' }}>Privacy & Legal Disclosures</div>
            <div style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)' }}>
              Inspect placeholder project terms and GDPR/academic privacy declarations.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <Link to="/privacy-policy" style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-accent)', textDecoration: 'none' }}>
              Privacy Policy
            </Link>
            <Link to="/terms-of-use" style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-accent)', textDecoration: 'none' }}>
              Terms of Use
            </Link>
          </div>
        </div>
      </Card>

      {/* SECTION 4: DESTRUCTIVE ZONE */}
      <Card style={{ borderColor: 'rgba(217, 96, 74, 0.3)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <Trash2 size={20} strokeWidth={1.5} color="var(--color-negative)" />
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-negative)' }}>
            Delete Account
          </h3>
        </div>
        <p style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-cream-dim)', marginBottom: 16 }}>
          Permanently delete your profile, transactions, budgets, and savings history. This action cannot be reversed.
        </p>
        <Button variant="destructive" onClick={handleDeleteAccount}>
          Delete Account & Purge Data
        </Button>
      </Card>
    </div>
  );
}
