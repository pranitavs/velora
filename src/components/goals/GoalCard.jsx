import React, { useState } from 'react';
import { Target, Calendar, Plus, Clock, History, CheckCircle, Calculator } from 'lucide-react';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import Badge from '../ui/Badge.jsx';
import { getDaysRemaining } from '../../lib/dates.js';
import { calculateRequiredMonthlyContribution, estimateGoalCompletion } from '../../lib/finance.js';

export default function GoalCard({
  goal,
  currencySymbol = '₹',
  onAddContribution,
  onViewHistory
}) {
  const current = Number(goal.current_amount) || 0;
  const target = Number(goal.target_amount) || 1;
  const percentage = Math.min(100, Math.round((current / target) * 100));
  const isCompleted = current >= target || goal.status === 'completed';

  const daysRemaining = getDaysRemaining(goal.target_date);
  const requiredMonthly = calculateRequiredMonthlyContribution(current, target, goal.target_date);

  // Contribution Simulator State
  const [simulatorContribution, setSimulatorContribution] = useState(
    requiredMonthly > 0 ? String(Math.round(requiredMonthly)) : '2000'
  );
  const estimatedMonths = estimateGoalCompletion(current, target, parseFloat(simulatorContribution) || 0);

  return (
    <Card
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: '20px',
        position: 'relative'
      }}
    >
      {/* Top Header */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {goal.emoji ? (
              <span style={{ fontSize: '1.25rem' }}>{goal.emoji}</span>
            ) : (
              <Target size={20} strokeWidth={1.5} color="var(--color-accent)" />
            )}
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-cream)' }}>
              {goal.name}
            </h3>
          </div>

          {isCompleted ? (
            <Badge variant="positive">
              <CheckCircle size={12} strokeWidth={2} /> Target Met!
            </Badge>
          ) : (
            <span className="tabular-nums" style={{ color: 'var(--color-accent)', fontWeight: 600, fontSize: '0.875rem' }}>
              {percentage}%
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div
          style={{
            width: '100%',
            height: '10px',
            background: 'var(--color-ink)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden',
            margin: '12px 0 10px'
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${percentage}%`,
              background: isCompleted ? 'var(--color-positive)' : (goal.color || 'var(--color-accent)'),
              borderRadius: 'var(--radius-full)',
              transition: 'width 0.6s cubic-bezier(0.25, 0.1, 0.25, 1)'
            }}
          />
        </div>

        {/* Amount numbers */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', fontSize: 'var(--text-body-sm)' }}>
          <span className="tabular-nums" style={{ fontWeight: 600, color: 'var(--color-cream)' }}>
            {currencySymbol}{current.toLocaleString('en-IN')}
          </span>
          <span className="tabular-nums" style={{ color: 'var(--color-cream-dim)' }}>
            Target: {currencySymbol}{target.toLocaleString('en-IN')}
          </span>
        </div>
      </div>

      {/* Target Date & Pace Metrics */}
      <div
        style={{
          background: 'var(--color-ink)',
          border: '1px solid var(--color-ink-border)',
          borderRadius: 'var(--radius-md)',
          padding: '12px 14px',
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          fontSize: 'var(--text-caption)',
          color: 'var(--color-cream-dim)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Calendar size={14} strokeWidth={1.5} />
            {goal.target_date ? `Deadline: ${goal.target_date}` : 'No target date'}
          </span>
          {daysRemaining !== null && (
            <span className="tabular-nums">{daysRemaining} days left</span>
          )}
        </div>

        {requiredMonthly > 0 && !isCompleted && (
          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--color-ink-border)', paddingTop: 6 }}>
            <span>Required monthly pace:</span>
            <span className="tabular-nums" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>
              {currencySymbol}{requiredMonthly.toLocaleString('en-IN')} / mo
            </span>
          </div>
        )}
      </div>

      {/* CONTRIBUTION SIMULATOR */}
      {!isCompleted && (
        <div
          style={{
            background: 'var(--color-ink-deep)',
            border: '1px solid var(--color-ink-border)',
            borderRadius: 'var(--radius-md)',
            padding: '12px',
            fontSize: 'var(--text-caption)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: 'var(--color-cream)' }}>
            <Calculator size={14} strokeWidth={1.5} color="var(--color-accent)" />
            <span className="ui-label" style={{ fontSize: '0.625rem' }}>Contribution Simulator</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ color: 'var(--color-cream-dim)', whiteSpace: 'nowrap' }}>If I save {currencySymbol}</span>
            <input
              type="number"
              value={simulatorContribution}
              onChange={(e) => setSimulatorContribution(e.target.value)}
              className="tabular-nums"
              style={{
                width: '80px',
                background: 'var(--color-ink)',
                border: '1px solid var(--color-ink-border)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--color-cream)',
                padding: '4px 8px',
                fontSize: '0.75rem',
                outline: 'none'
              }}
            />
            <span style={{ color: 'var(--color-cream-dim)' }}>/ month:</span>
          </div>
          <div style={{ marginTop: 6, color: 'var(--color-accent)', fontWeight: 500 }}>
            {estimatedMonths === null ? (
              'Enter a positive monthly amount'
            ) : estimatedMonths === 0 ? (
              'Goal reached!'
            ) : (
              `Completed in ~${estimatedMonths} month${estimatedMonths === 1 ? '' : 's'}`
            )}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 8, justifyContent: 'space-between', marginTop: 4 }}>
        <Button variant="ghost" size="sm" onClick={() => onViewHistory(goal)}>
          <History size={16} strokeWidth={1.5} /> History
        </Button>

        {!isCompleted && (
          <Button variant="primary" size="sm" onClick={() => onAddContribution(goal)}>
            <Plus size={16} strokeWidth={1.5} /> Deposit
          </Button>
        )}
      </div>
    </Card>
  );
}
