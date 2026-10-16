import React, { useState } from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import { getTodayISO, formatDate } from '../../lib/dates.js';
import { PlusCircle, History } from 'lucide-react';

export default function ContributionHistory({
  isOpen,
  onClose,
  goal,
  contributions = [],
  onAddDeposit,
  currencySymbol = '₹'
}) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [depositDate, setDepositDate] = useState(getTodayISO());
  const [depositNote, setDepositNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!goal) return null;

  const goalContributions = contributions.filter(c => c.goal_id === goal.id);

  const handleDepositSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) {
      setError('Please enter a positive contribution amount.');
      return;
    }

    setLoading(true);
    try {
      await onAddDeposit(goal.id, amt, depositNote);
      setDepositAmount('');
      setDepositNote('');
      setShowAddForm(false);
    } catch (err) {
      setError(err.message || 'Deposit failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${goal.emoji || '🎯'} ${goal.name}`}
      subtitle={`Target: ${currencySymbol}${Number(goal.target_amount).toLocaleString('en-IN')}`}
      maxWidth="560px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {/* Toggle Form / Deposit CTA */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="ui-label">
            {goalContributions.length} Deposit Record{goalContributions.length === 1 ? '' : 's'}
          </span>
          <Button
            variant={showAddForm ? 'secondary' : 'primary'}
            size="sm"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? 'View History' : '+ Add Deposit'}
          </Button>
        </div>

        {/* Deposit Form */}
        {showAddForm ? (
          <form onSubmit={handleDepositSubmit} style={{ background: 'var(--color-ink)', padding: 16, borderRadius: 8, border: '1px solid var(--color-ink-border)', display: 'flex', flexDirection: 'column', gap: 14 }}>
            <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>Record Contribution</h4>
            {error && (
              <div style={{ color: 'var(--color-negative)', fontSize: '0.8125rem' }}>{error}</div>
            )}
            <Input
              label={`Deposit Amount (${currencySymbol})`}
              type="number"
              step="0.01"
              required
              autoFocus
              placeholder="e.g. 5000"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              className="tabular-nums"
            />
            <Input
              label="Date"
              type="date"
              required
              value={depositDate}
              onChange={(e) => setDepositDate(e.target.value)}
            />
            <Input
              label="Note (Optional)"
              placeholder="e.g. Freelance project bonus"
              value={depositNote}
              onChange={(e) => setDepositNote(e.target.value)}
            />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 4 }}>
              <Button variant="ghost" size="sm" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="sm" loading={loading}>
                Confirm Deposit
              </Button>
            </div>
          </form>
        ) : (
          /* Contribution Log */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: '300px', overflowY: 'auto' }}>
            {goalContributions.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 12px', color: 'var(--color-cream-dim)', fontSize: 'var(--text-body-sm)' }}>
                No deposits recorded for this goal yet. Click "+ Add Deposit" above.
              </div>
            ) : (
              goalContributions.map((c) => (
                <div
                  key={c.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    background: 'var(--color-ink)',
                    borderRadius: 6,
                    border: '1px solid var(--color-ink-border)'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500, fontSize: '0.875rem' }}>{c.note || 'Contribution deposit'}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-cream-dim)' }}>{formatDate(c.date)}</div>
                  </div>
                  <div className="tabular-nums" style={{ color: 'var(--color-positive)', fontWeight: 600 }}>
                    +{currencySymbol}{Number(c.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
