import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth.js';
import supabase from '../../config/supabase.js';
import BRAND from '../../config/brand.js';
import './auth.css';

const CURRENCIES = [
  { code: 'INR', symbol: '₹', label: 'Indian Rupee (₹)' },
  { code: 'USD', symbol: '$', label: 'US Dollar ($)' },
  { code: 'EUR', symbol: '€', label: 'Euro (€)' },
  { code: 'GBP', symbol: '£', label: 'British Pound (£)' }
];

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { user, profile, updateProfile, refreshProfile } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  // Step 1: Currency
  const [selectedCurrency, setSelectedCurrency] = useState('INR');

  // Step 2: Income
  const [incomeFrequency, setIncomeFrequency] = useState('monthly');
  const [monthlyIncome, setMonthlyIncome] = useState('');

  // Step 3: First Goal
  const [goalName, setGoalName] = useState('Emergency fund');
  const [goalTargetAmount, setGoalTargetAmount] = useState('30000');

  const handleFinishOnboarding = async (skipOptional = false) => {
    setLoading(true);
    try {
      const currencyObj = CURRENCIES.find(c => c.code === selectedCurrency) || CURRENCIES[0];

      // Update profiles row
      await updateProfile({
        currency_code: currencyObj.code,
        currency_symbol: currencyObj.symbol,
        income_frequency: incomeFrequency,
        monthly_income: !skipOptional && monthlyIncome ? parseFloat(monthlyIncome) : null,
        primary_goal: !skipOptional && goalName ? goalName.trim() : 'Emergency fund',
        onboarding_complete: true
      });

      // If user provided a goal, insert it into savings_goals table
      if (user?.id) {
        const finalGoalName = (!skipOptional && goalName.trim()) ? goalName.trim() : 'Emergency fund';
        const finalTarget = (!skipOptional && parseFloat(goalTargetAmount) > 0) ? parseFloat(goalTargetAmount) : 30000;

        await supabase.from('savings_goals').insert({
          user_id: user.id,
          name: finalGoalName,
          target_amount: finalTarget,
          current_amount: 0,
          color: '#C9A84C',
          emoji: '🛡️',
          status: 'active'
        });
      }

      await refreshProfile();
      navigate('/app/dashboard');
    } catch (err) {
      console.error('Onboarding update failed:', err);
      // Still navigate to dashboard so user is not trapped
      navigate('/app/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleFinishOnboarding(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card" style={{ maxWidth: '520px' }}>
        {/* Progress Tracker */}
        <div className="onboarding-progress">
          <div className="progress-step-item">
            <div className={`step-circle ${step === 1 ? 'active' : step > 1 ? 'completed' : ''}`}>
              {step > 1 ? <Check size={14} strokeWidth={2.5} /> : '1'}
            </div>
            <span className="ui-label" style={{ fontSize: '0.625rem' }}>Currency</span>
          </div>

          <div className="progress-step-item">
            <div className={`step-circle ${step === 2 ? 'active' : step > 2 ? 'completed' : ''}`}>
              {step > 2 ? <Check size={14} strokeWidth={2.5} /> : '2'}
            </div>
            <span className="ui-label" style={{ fontSize: '0.625rem' }}>Income</span>
          </div>

          <div className="progress-step-item">
            <div className={`step-circle ${step === 3 ? 'active' : ''}`}>
              3
            </div>
            <span className="ui-label" style={{ fontSize: '0.625rem' }}>First Goal</span>
          </div>
        </div>

        <div className="auth-logo-area" style={{ textAlign: 'left', marginBottom: 24 }}>
          <span className="ui-label">Step {step} of 3</span>
          {step === 1 && (
            <>
              <h1 className="auth-title" style={{ marginTop: 6 }}>Select your primary currency</h1>
              <p className="auth-subtitle">All dashboards, transactions, and AI insights will use this symbol.</p>
            </>
          )}
          {step === 2 && (
            <>
              <h1 className="auth-title" style={{ marginTop: 6 }}>Your income rhythm</h1>
              <p className="auth-subtitle">Helps calculate realistic savings rates and monthly spending capacity.</p>
            </>
          )}
          {step === 3 && (
            <>
              <h1 className="auth-title" style={{ marginTop: 6 }}>Create your first goal</h1>
              <p className="auth-subtitle">A financial target gives your savings purpose from day one.</p>
            </>
          )}
        </div>

        {/* STEP 1: CURRENCY */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {CURRENCIES.map(curr => (
              <label
                key={curr.code}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  borderRadius: 'var(--radius-md)',
                  background: selectedCurrency === curr.code ? 'var(--color-ink)' : 'transparent',
                  border: `1px solid ${selectedCurrency === curr.code ? 'var(--color-accent)' : 'var(--color-ink-border)'}`,
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <input
                    type="radio"
                    name="currency"
                    value={curr.code}
                    checked={selectedCurrency === curr.code}
                    onChange={() => setSelectedCurrency(curr.code)}
                    style={{ accentColor: 'var(--color-accent)' }}
                  />
                  <span style={{ fontWeight: 500, color: 'var(--color-cream)' }}>{curr.label}</span>
                </div>
                <span className="tabular-nums" style={{ color: 'var(--color-accent)', fontWeight: 600 }}>{curr.symbol}</span>
              </label>
            ))}

            <button
              type="button"
              onClick={nextStep}
              className="btn-primary"
              style={{ width: '100%', marginTop: 16 }}
            >
              Continue <ArrowRight size={16} strokeWidth={1.5} style={{ marginLeft: 8 }} />
            </button>
          </div>
        )}

        {/* STEP 2: INCOME */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label className="form-label">Payment Cadence</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => setIncomeFrequency('monthly')}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: incomeFrequency === 'monthly' ? 'var(--color-ink)' : 'transparent',
                    border: `1px solid ${incomeFrequency === 'monthly' ? 'var(--color-accent)' : 'var(--color-ink-border)'}`,
                    color: 'var(--color-cream)',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Monthly Salary / Allowance
                </button>
                <button
                  type="button"
                  onClick={() => setIncomeFrequency('weekly')}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    background: incomeFrequency === 'weekly' ? 'var(--color-ink)' : 'transparent',
                    border: `1px solid ${incomeFrequency === 'weekly' ? 'var(--color-accent)' : 'var(--color-ink-border)'}`,
                    color: 'var(--color-cream)',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Weekly / Stipend
                </button>
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <label htmlFor="onboardingIncome" className="form-label">Approximate Monthly Inflow</label>
                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-faint)' }}>Optional</span>
              </div>
              <input
                id="onboardingIncome"
                type="number"
                placeholder="e.g. 45000"
                value={monthlyIncome}
                onChange={(e) => setMonthlyIncome(e.target.value)}
                className="form-input tabular-nums"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <button
                type="button"
                onClick={nextStep}
                className="btn-ghost"
                style={{ padding: 0 }}
              >
                Skip for now
              </button>
              <button
                type="button"
                onClick={nextStep}
                className="btn-primary"
              >
                Continue <ArrowRight size={16} strokeWidth={1.5} style={{ marginLeft: 8 }} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: FIRST GOAL */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div className="form-group">
              <label htmlFor="goalName" className="form-label">Goal Title</label>
              <input
                id="goalName"
                type="text"
                placeholder="e.g. Emergency fund, New Laptop, Goa Trip"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="goalTarget" className="form-label">Target Amount ({CURRENCIES.find(c => c.code === selectedCurrency)?.symbol || '₹'})</label>
              <input
                id="goalTarget"
                type="number"
                placeholder="30000"
                value={goalTargetAmount}
                onChange={(e) => setGoalTargetAmount(e.target.value)}
                className="form-input tabular-nums"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
              <button
                type="button"
                onClick={() => handleFinishOnboarding(true)}
                className="btn-ghost"
                style={{ padding: 0 }}
              >
                Skip
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={() => handleFinishOnboarding(false)}
                className="btn-primary"
              >
                {loading ? 'Finalizing...' : 'Complete & Open Dashboard'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
