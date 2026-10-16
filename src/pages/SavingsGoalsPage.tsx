import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Target,
  Plus,
  TrendingUp,
  Calendar,
  Sparkles,
  Zap,
  Trash2,
  CheckCircle2,
  Clock,
  ArrowRight,
  PiggyBank,
} from 'lucide-react';
import { Button } from '../components/common/Button.tsx';
import { Card } from '../components/common/Card.tsx';
import { Modal } from '../components/common/Modal.tsx';
import { Input } from '../components/common/Input.tsx';
import { Select } from '../components/common/Select.tsx';
import { EmptyState } from '../components/common/EmptyState.tsx';
import {
  formatCurrency,
  calculateGoalMetrics,
  simulateContribution,
  CATEGORIES,
} from '../lib/finance.js';
import {
  addGoal,
  deleteGoal,
  contributeToGoal,
} from '../lib/storage.js';

export const SavingsGoalsPage: React.FC = () => {
  const { appState } = useOutletContext<any>();
  const currency = appState?.user?.currency || 'INR';
  const goals = appState?.goals || [];

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isContributeModalOpen, setIsContributeModalOpen] = useState(false);
  const [activeGoalForContribute, setActiveGoalForContribute] = useState<any | null>(null);
  const [contributeAmount, setContributeAmount] = useState('');
  const [contributeError, setContributeError] = useState('');

  // Add Goal form state
  const [newTitle, setNewTitle] = useState('');
  const [newTarget, setNewTarget] = useState('');
  const [newCurrent, setNewCurrent] = useState('0');
  const [newDate, setNewDate] = useState('');
  const [newCategory, setNewCategory] = useState('Education');
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Simulator state
  const [simGoalId, setSimGoalId] = useState<string>(goals[0]?.id || '');
  const [simExtraAmount, setSimExtraAmount] = useState<number>(currency === 'INR' ? 1000 : 25);

  const selectedSimGoal = goals.find((g: any) => g.id === simGoalId) || goals[0];
  const simResult = selectedSimGoal ? simulateContribution(selectedSimGoal, simExtraAmount) : null;

  const handleOpenContribute = (goal: any) => {
    setActiveGoalForContribute(goal);
    setContributeAmount('');
    setContributeError('');
    setIsContributeModalOpen(true);
  };

  const handleSaveContribution = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(contributeAmount);
    if (!contributeAmount || isNaN(amt) || amt <= 0) {
      setContributeError('Please enter a positive contribution amount');
      return;
    }
    if (activeGoalForContribute) {
      contributeToGoal(activeGoalForContribute.id, amt);
    }
    setIsContributeModalOpen(false);
  };

  const handleAddGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: { [key: string]: string } = {};

    if (!newTitle.trim()) errs.title = 'Goal title is required';
    const targetNum = parseFloat(newTarget);
    if (!newTarget || isNaN(targetNum) || targetNum <= 0) {
      errs.target = 'Valid target amount is required';
    }
    if (!newDate) errs.date = 'Target completion date is required';

    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    addGoal({
      title: newTitle.trim(),
      targetAmount: targetNum,
      currentAmount: parseFloat(newCurrent) || 0,
      targetDate: newDate,
      category: newCategory,
    });

    setNewTitle('');
    setNewTarget('');
    setNewCurrent('0');
    setNewDate('');
    setIsAddModalOpen(false);
    setFormErrors({});
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header & Action */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.75rem', fontFamily: 'var(--font-serif)', color: 'var(--cream)' }}>
            Savings Targets & Capital Cushions
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--cream-dim)' }}>
            Track time horizons, required monthly contributions, and simulate accelerated timelines.
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => {
            setFormErrors({});
            setIsAddModalOpen(true);
          }}
          icon={<Plus size={16} />}
        >
          Create Target
        </Button>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <EmptyState
          icon={<Target size={36} />}
          title="No Active Savings Goals"
          description="Establish your first target—like a laptop upgrade, emergency hostel cushion, or graduate travel fund."
          action={{
            label: '+ Create Your First Goal',
            onClick: () => setIsAddModalOpen(true),
          }}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '1.25rem' }}>
          {goals.map((goal: any) => {
            const m = calculateGoalMetrics(goal);
            return (
              <div key={goal.id} className="velora-card card-hover-lift" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  {/* Category and Status */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {goal.category || 'Savings'}
                    </span>
                    {m.isCompleted ? (
                      <span className="velora-badge badge-positive">
                        <CheckCircle2 size={12} />
                        <span>Completed</span>
                      </span>
                    ) : (
                      <span className="velora-badge badge-neutral">
                        <Clock size={12} />
                        <span>{m.daysRemaining} days remaining</span>
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: '1.2rem', fontFamily: 'var(--font-serif)', color: 'var(--cream)', marginBottom: '1rem' }}>
                    {goal.title}
                  </h3>

                  {/* Progress bar */}
                  <div style={{ marginBottom: '0.65rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '0.35rem' }}>
                      <span style={{ color: 'var(--cream)', fontWeight: 600 }}>
                        {formatCurrency(goal.currentAmount, currency)}
                      </span>
                      <span style={{ color: 'var(--cream-dim)' }}>
                        of {formatCurrency(goal.targetAmount, currency)} ({m.progressPercent}%)
                      </span>
                    </div>
                    <div className="progress-track">
                      <div
                        className="progress-fill"
                        style={{
                          width: `${m.progressPercent}%`,
                          backgroundColor: m.isCompleted ? 'var(--positive)' : 'var(--accent)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Required monthly breakdown */}
                  <div
                    style={{
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: 'var(--ink)',
                      border: '1px solid var(--ink-border)',
                      marginTop: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.75rem',
                    }}
                  >
                    <span style={{ color: 'var(--cream-dim)' }}>Required Monthly:</span>
                    <strong style={{ color: 'var(--cream)', fontFamily: 'var(--font-serif)', fontSize: '0.9375rem' }}>
                      {m.isCompleted ? 'Achieved' : `${formatCurrency(m.requiredMonthly, currency)} / mo`}
                    </strong>
                  </div>
                </div>

                {/* Bottom Card Actions */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--ink-border)' }}>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="velora-btn btn-ghost btn-sm"
                    style={{ color: 'var(--cream-subtle)', padding: '0.2rem 0.5rem' }}
                    title="Delete goal"
                  >
                    <Trash2 size={14} />
                  </button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleOpenContribute(goal)}
                    disabled={m.isCompleted}
                    icon={<Plus size={14} />}
                  >
                    Contribute
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Contribution Simulator Section */}
      {goals.length > 0 && selectedSimGoal && (
        <Card style={{ backgroundColor: '#131210', border: '1px solid var(--ink-border)' }}>
          <div className="card-header">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ padding: '0.35rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--accent-muted)', color: 'var(--accent)' }}>
                <Zap size={20} />
              </div>
              <div>
                <h3 className="card-title">Interactive Contribution Simulator</h3>
                <p className="card-subtitle">"What if I save extra every month?"</p>
              </div>
            </div>

            {/* Select active goal for simulator */}
            <div style={{ minWidth: '220px' }}>
              <select
                className="form-select"
                value={simGoalId}
                onChange={(e) => setSimGoalId(e.target.value)}
                style={{ minHeight: '36px', fontSize: '0.8125rem' }}
              >
                {goals.map((g: any) => (
                  <option key={g.id} value={g.id}>
                    {g.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'center', marginTop: '1rem' }}>
            <div>
              <p style={{ fontSize: '0.875rem', color: 'var(--cream)', marginBottom: '0.75rem', lineHeight: '1.5' }}>
                Simulate accelerating <strong>{selectedSimGoal.title}</strong> by adding an extra recurring allocation from your allowance or gig earnings.
              </p>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Extra Monthly Contribution</span>
                  <strong style={{ color: 'var(--accent)', fontFamily: 'var(--font-serif)' }}>
                    +{formatCurrency(simExtraAmount, currency)}
                  </strong>
                </label>
                <input
                  type="range"
                  min={currency === 'INR' ? 100 : 5}
                  max={currency === 'INR' ? 20000 : 300}
                  step={currency === 'INR' ? 100 : 5}
                  value={simExtraAmount}
                  onChange={(e) => setSimExtraAmount(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--accent)', cursor: 'pointer' }}
                />
              </div>

              {/* Quick preset buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                {(currency === 'INR' ? [500, 1000, 2500, 5000] : [15, 30, 60, 100]).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setSimExtraAmount(preset)}
                    className="velora-btn btn-secondary btn-sm"
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.2rem 0.5rem',
                      backgroundColor: simExtraAmount === preset ? 'var(--accent-muted)' : undefined,
                      borderColor: simExtraAmount === preset ? 'var(--accent)' : undefined,
                      color: simExtraAmount === preset ? 'var(--accent)' : undefined,
                    }}
                  >
                    +{formatCurrency(preset, currency)}
                  </button>
                ))}
              </div>
            </div>

            {/* Simulated Outcome Box */}
            <div
              style={{
                backgroundColor: 'var(--ink)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.5rem',
                border: '1px solid var(--ink-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Sparkles size={16} style={{ color: 'var(--accent)' }} />
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--cream-dim)' }}>
                  Simulation Outcome
                </span>
              </div>

              {simResult ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '2.25rem', fontFamily: 'var(--font-serif)', color: 'var(--positive)', lineHeight: 1 }}>
                      {simResult.monthsSaved} Months
                    </span>
                    <span style={{ fontSize: '0.875rem', color: 'var(--cream-dim)' }}>saved</span>
                  </div>

                  <p style={{ fontSize: '0.8125rem', color: 'var(--cream-dim)', lineHeight: '1.5', marginTop: '0.5rem' }}>
                    By increasing your monthly allocation from {formatCurrency(simResult.baseMonthly, currency)} to{' '}
                    <strong style={{ color: 'var(--cream)' }}>{formatCurrency(simResult.newMonthly, currency)}</strong>, you will reach this target on{' '}
                    <strong style={{ color: 'var(--accent)' }}>{simResult.newCompletionDate}</strong> instead of {selectedSimGoal.targetDate}.
                  </p>
                </div>
              ) : null}
            </div>
          </div>
        </Card>
      )}

      {/* Add Goal Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Establish New Savings Goal"
        subtitle="Set a capital target with a deadline to calculate monthly allocation velocity"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddGoal}>
              Create Target
            </Button>
          </>
        }
      >
        <form onSubmit={handleAddGoal}>
          <Input
            label="Goal Title"
            placeholder="e.g. Graduation Trip to Goa, M3 MacBook Air"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            error={formErrors.title}
            autoFocus
          />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label={`Target Amount (${currency})`}
              type="number"
              placeholder="0.00"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              error={formErrors.target}
            />

            <Input
              label={`Initial Saved (${currency})`}
              type="number"
              placeholder="0.00"
              value={newCurrent}
              onChange={(e) => setNewCurrent(e.target.value)}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <Input
              label="Target Completion Date"
              type="date"
              value={newDate}
              onChange={(e) => setNewDate(e.target.value)}
              error={formErrors.date}
            />

            <Select
              label="Category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              options={CATEGORIES}
            />
          </div>
        </form>
      </Modal>

      {/* Contribution Modal */}
      <Modal
        isOpen={isContributeModalOpen}
        onClose={() => setIsContributeModalOpen(false)}
        title={`Contribute to ${activeGoalForContribute?.title || 'Goal'}`}
        subtitle="Deposit funds towards this target"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsContributeModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleSaveContribution}>
              Confirm Contribution
            </Button>
          </>
        }
      >
        <form onSubmit={handleSaveContribution}>
          {activeGoalForContribute && (
            <div style={{ marginBottom: '1.25rem', padding: '0.85rem', backgroundColor: 'var(--ink)', borderRadius: 'var(--radius-md)', border: '1px solid var(--ink-border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem' }}>
                <span style={{ color: 'var(--cream-dim)' }}>Current Balance:</span>
                <span style={{ color: 'var(--cream)', fontWeight: 600 }}>
                  {formatCurrency(activeGoalForContribute.currentAmount, currency)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginTop: '0.25rem' }}>
                <span style={{ color: 'var(--cream-dim)' }}>Target:</span>
                <span style={{ color: 'var(--accent)', fontWeight: 600 }}>
                  {formatCurrency(activeGoalForContribute.targetAmount, currency)}
                </span>
              </div>
            </div>
          )}

          <Input
            label={`Contribution Amount (${currency})`}
            type="number"
            step="0.01"
            placeholder="0.00"
            value={contributeAmount}
            onChange={(e) => setContributeAmount(e.target.value)}
            error={contributeError}
            autoFocus
          />
        </form>
      </Modal>
    </div>
  );
};
