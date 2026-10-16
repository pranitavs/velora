import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Settings,
  User,
  Coins,
  Download,
  Trash2,
  CheckCircle2,
  Sparkles,
  AlertTriangle,
  Save,
} from 'lucide-react';
import { Card } from '../components/common/Card.tsx';
import { Button } from '../components/common/Button.tsx';
import { Input } from '../components/common/Input.tsx';
import { Select } from '../components/common/Select.tsx';
import { Modal } from '../components/common/Modal.tsx';
import { CURRENCY_MAP } from '../lib/finance.js';
import {
  updateUser,
  exportTransactionsCSV,
  clearAllData,
  seedDemoData,
  getState,
} from '../lib/storage.js';

export const SettingsPage: React.FC = () => {
  const { appState } = useOutletContext<any>();
  const user = appState?.user || {};

  const [name, setName] = useState(user.name || '');
  const [currency, setCurrency] = useState(user.currency || 'INR');
  const [incomeFrequency, setIncomeFrequency] = useState(user.incomeFrequency || 'monthly');
  const [saveFeedback, setSaveFeedback] = useState(false);

  // Clear data confirmation modal
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [clearInput, setClearInput] = useState('');
  const [seedFeedback, setSeedFeedback] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser({
      name: name.trim(),
      currency,
      incomeFrequency,
    });
    setSaveFeedback(true);
    setTimeout(() => setSaveFeedback(false), 2500);
  };

  const handleExportJSON = () => {
    const fullState = getState();
    const blob = new Blob([JSON.stringify(fullState, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `velora-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSeedDemo = () => {
    seedDemoData(currency);
    setSeedFeedback(true);
    setTimeout(() => setSeedFeedback(false), 2500);
  };

  const handleConfirmClear = () => {
    if (clearInput.toUpperCase() === 'CLEAR') {
      clearAllData();
      setIsClearModalOpen(false);
      setClearInput('');
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '800px' }}>
      <div>
        <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-serif)', color: 'var(--cream)' }}>
          System Configuration & Data Control
        </h2>
        <p style={{ fontSize: '0.8125rem', color: 'var(--cream-dim)' }}>
          Manage your ledger currency, user profile, and export or wipe your local data.
        </p>
      </div>

      {saveFeedback && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--positive-bg)',
            border: '1px solid rgba(76, 175, 130, 0.3)',
            color: 'var(--positive)',
            fontSize: '0.8125rem',
          }}
        >
          <CheckCircle2 size={16} />
          <span>Profile configuration saved successfully.</span>
        </div>
      )}

      {/* User & Currency Settings Form */}
      <Card>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} style={{ color: 'var(--accent)' }} />
            <h3 className="card-title">Profile & Ledger Setup</h3>
          </div>
        </div>

        <form onSubmit={handleSaveProfile}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex Chen"
            />

            <Input
              label="Registered Email"
              value={user.email || ''}
              disabled
              helperText="Managed by local session."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Primary Ledger Currency</label>
              <select
                className="form-select"
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {(Object.keys(CURRENCY_MAP) as Array<'INR' | 'USD' | 'EUR' | 'GBP'>).map((code) => (
                  <option key={code} value={code}>
                    {CURRENCY_MAP[code].symbol} — {code} ({CURRENCY_MAP[code].name})
                  </option>
                ))}
              </select>
              <p style={{ fontSize: '0.75rem', color: 'var(--cream-subtle)', marginTop: '0.25rem' }}>
                All balances and charts will immediately reformat to {(CURRENCY_MAP as any)[currency]?.symbol}.
              </p>
            </div>

            <Select
              label="Income Cadence"
              value={incomeFrequency}
              onChange={(e) => setIncomeFrequency(e.target.value)}
              options={[
                { value: 'monthly', label: 'Monthly Stipend / Salary' },
                { value: 'weekly', label: 'Weekly Allowance / Hourly' },
                { value: 'irregular', label: 'Irregular Freelance / Gig Cashflow' },
              ]}
            />
          </div>

          <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="primary" type="submit" icon={<Save size={15} />}>
              Save Configuration
            </Button>
          </div>
        </form>
      </Card>

      {/* Data Export & Demo Seeding */}
      <Card>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={18} style={{ color: 'var(--positive)' }} />
            <h3 className="card-title">Data Sovereignty & Backups</h3>
          </div>
        </div>

        <p style={{ fontSize: '0.8125rem', color: 'var(--cream-dim)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
          Your financial data is stored locally in your browser. Download your records anytime in standard CSV spreadsheet format or structured JSON.
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <Button
            variant="secondary"
            onClick={exportTransactionsCSV}
            icon={<Download size={15} />}
          >
            Export Ledger as CSV
          </Button>

          <Button
            variant="secondary"
            onClick={handleExportJSON}
            icon={<Download size={15} />}
          >
            Download Full JSON Backup
          </Button>

          <Button
            variant="ghost"
            onClick={handleSeedDemo}
            icon={<Sparkles size={15} style={{ color: 'var(--accent)' }} />}
          >
            {seedFeedback ? 'Demo Data Loaded ✓' : 'Reload Student Demo Data'}
          </Button>
        </div>
      </Card>

      {/* Danger Zone: Clear Data */}
      <Card style={{ borderColor: 'rgba(217, 96, 74, 0.3)', backgroundColor: 'rgba(217, 96, 74, 0.04)' }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <AlertTriangle size={18} style={{ color: 'var(--negative)' }} />
            <h3 className="card-title" style={{ color: 'var(--negative)' }}>
              Danger Zone: Wipe Local Storage
            </h3>
          </div>
        </div>

        <p style={{ fontSize: '0.8125rem', color: 'var(--cream-dim)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
          Permanently delete all transactions, savings goals, and daily streak records from this browser. This operation cannot be reversed.
        </p>

        <Button
          variant="danger"
          onClick={() => {
            setClearInput('');
            setIsClearModalOpen(true);
          }}
          icon={<Trash2 size={15} />}
        >
          Clear All Ledger Data
        </Button>
      </Card>

      {/* Wipe Confirmation Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => setIsClearModalOpen(false)}
        title="Confirm Factory Reset"
        subtitle="Irreversible ledger deletion"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsClearModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              disabled={clearInput.trim().toUpperCase() !== 'CLEAR'}
              onClick={handleConfirmClear}
            >
              Wipe Everything
            </Button>
          </>
        }
      >
        <p style={{ fontSize: '0.875rem', color: 'var(--cream-dim)', marginBottom: '1rem', lineHeight: '1.5' }}>
          This will wipe all transactions, progress on your savings targets, and streak activity from your localStorage.
          Please type <strong style={{ color: 'var(--negative)' }}>CLEAR</strong> below to confirm.
        </p>

        <Input
          placeholder="Type CLEAR to confirm"
          value={clearInput}
          onChange={(e) => setClearInput(e.target.value)}
          autoFocus
        />
      </Modal>
    </div>
  );
};
