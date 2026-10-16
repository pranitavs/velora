import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowRight, ArrowLeft, Target, Coins, Calendar, Sparkles } from 'lucide-react';
import { Button } from '../components/common/Button.tsx';
import { Input } from '../components/common/Input.tsx';
import { Select } from '../components/common/Select.tsx';
import { updateUser, addGoal, seedDemoData, getState, saveState } from '../lib/storage.js';
import { CURRENCY_MAP } from '../lib/finance.js';

export const OnboardingPage: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [currency, setCurrency] = useState<'INR' | 'USD' | 'EUR' | 'GBP'>('INR');
  const [incomeFrequency, setIncomeFrequency] = useState<'monthly' | 'weekly' | 'irregular'>('monthly');
  const [estimatedIncome, setEstimatedIncome] = useState<string>('25000');

  // Step 3: First savings goal
  const [goalTitle, setGoalTitle] = useState('Graduation Tech Setup (M3 MacBook)');
  const [goalTarget, setGoalTarget] = useState('120000');
  const [goalDate, setGoalDate] = useState('2027-05-30');
  const [goalCategory, setGoalCategory] = useState('Education');

  // Choice: Seed realistic demo data or start empty
  const [dataChoice, setDataChoice] = useState<'demo' | 'empty'>('demo');

  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Finalize onboarding
      if (dataChoice === 'demo') {
        seedDemoData(currency);
        updateUser({
          currency,
          incomeFrequency,
          hasCompletedOnboarding: true,
        });
      } else {
        updateUser({
          currency,
          incomeFrequency,
          hasCompletedOnboarding: true,
        });
        if (goalTitle && goalTarget) {
          addGoal({
            title: goalTitle,
            targetAmount: parseFloat(goalTarget) || 0,
            currentAmount: 0,
            targetDate: goalDate,
            category: goalCategory,
          });
        }
      }
      navigate('/dashboard');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--ink)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1.5rem',
      }}
    >
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div className="brand-mark" style={{ justifyContent: 'center' }}>
          <span className="accent-symbol">◆</span>
          <span>VELORA</span>
        </div>
        <p style={{ fontSize: '0.8125rem', color: 'var(--cream-dim)', marginTop: '0.35rem' }}>
          Configuring Your Ledger Environment · Step {step} of 3
        </p>

        {/* Step Indicator Bars */}
        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginTop: '1rem' }}>
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              style={{
                width: '48px',
                height: '4px',
                borderRadius: '2px',
                backgroundColor: s <= step ? 'var(--accent)' : 'var(--ink-border)',
                transition: 'background-color 0.2s ease',
              }}
            />
          ))}
        </div>
      </div>

      <div
        className="velora-card animate-fade-in"
        style={{
          maxWidth: '520px',
          width: '100%',
          padding: '2.5rem',
          backgroundColor: 'var(--ink-raised)',
        }}
      >
        {/* Step 1: Currency Selection */}
        {step === 1 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--accent-muted)', color: 'var(--accent)' }}>
                <Coins size={20} />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)' }}>
                Choose Your Primary Currency
              </h2>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--cream-dim)', marginBottom: '1.75rem', lineHeight: '1.5' }}>
              Select the currency unit for your daily ledgers, savings goals, and cashflow reports. You can switch currencies anytime in Settings.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem', marginBottom: '2rem' }}>
              {(Object.keys(CURRENCY_MAP) as Array<'INR' | 'USD' | 'EUR' | 'GBP'>).map((code) => {
                const info = CURRENCY_MAP[code];
                const isSelected = currency === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => {
                      setCurrency(code);
                      if (code === 'INR') {
                        setGoalTarget('120000');
                        setEstimatedIncome('25000');
                      } else {
                        setGoalTarget('1500');
                        setEstimatedIncome('850');
                      }
                    }}
                    style={{
                      padding: '1.1rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--accent-muted)' : 'var(--ink)',
                      border: isSelected ? '1px solid var(--accent)' : '1px solid var(--ink-border)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.5rem', fontFamily: 'var(--font-serif)', color: isSelected ? 'var(--accent)' : 'var(--cream)' }}>
                        {info.symbol}
                      </span>
                      {isSelected && <Check size={16} style={{ color: 'var(--accent)' }} />}
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--cream)' }}>
                      {code}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--cream-dim)' }}>
                      {info.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 2: Income Frequency */}
        {step === 2 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--positive-bg)', color: 'var(--positive)' }}>
                <Calendar size={20} />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)' }}>
                Cash Inflow Frequency
              </h2>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--cream-dim)', marginBottom: '1.75rem', lineHeight: '1.5' }}>
              How do you receive allowances, research stipends, part-time wages, or freelance payouts?
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.75rem' }}>
              {[
                { id: 'monthly', title: 'Monthly Stipend / Allowance', desc: 'Fixed transfer at the start or end of each month.' },
                { id: 'weekly', title: 'Weekly Allowance / Hourly Wage', desc: 'Regular weekly or bi-weekly disbursements.' },
                { id: 'irregular', title: 'Irregular Freelance / Gig Cashflow', desc: 'Milestone-based project earnings and flexible gigs.' },
              ].map((opt) => {
                const isSelected = incomeFrequency === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setIncomeFrequency(opt.id as any)}
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: isSelected ? 'var(--accent-muted)' : 'var(--ink)',
                      border: isSelected ? '1px solid var(--accent)' : '1px solid var(--ink-border)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--cream)' }}>{opt.title}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--cream-dim)', marginTop: '0.15rem' }}>{opt.desc}</p>
                    </div>
                    {isSelected && <Check size={18} style={{ color: 'var(--accent)' }} />}
                  </button>
                );
              })}
            </div>

            <Input
              label={`Estimated ${incomeFrequency === 'monthly' ? 'Monthly' : 'Weekly'} Inflow (${CURRENCY_MAP[currency].symbol})`}
              type="number"
              value={estimatedIncome}
              onChange={(e) => setEstimatedIncome(e.target.value)}
              placeholder="e.g. 25000"
              leftAddon={<span style={{ color: 'var(--cream)', fontWeight: 600 }}>{CURRENCY_MAP[currency].symbol}</span>}
            />
          </div>
        )}

        {/* Step 3: First Savings Goal + Data Initialization Choice */}
        {step === 3 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1rem' }}>
              <div style={{ padding: '0.4rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--warning-bg)', color: 'var(--warning)' }}>
                <Target size={20} />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-serif)' }}>
                First Savings Target & Data Choice
              </h2>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--cream-dim)', marginBottom: '1.5rem', lineHeight: '1.5' }}>
              Target what matters most—whether a study setup, security cushion, or tech gear.
            </p>

            <Input
              label="Goal Title"
              type="text"
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
              placeholder="e.g. MacBook Pro M3, Hostel Cushion"
            />

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <Input
                label={`Target Amount (${CURRENCY_MAP[currency].symbol})`}
                type="number"
                value={goalTarget}
                onChange={(e) => setGoalTarget(e.target.value)}
                leftAddon={<span style={{ color: 'var(--cream)', fontWeight: 600 }}>{CURRENCY_MAP[currency].symbol}</span>}
              />
              <Input
                label="Target Date"
                type="date"
                value={goalDate}
                onChange={(e) => setGoalDate(e.target.value)}
              />
            </div>

            {/* Initialization Choice */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid var(--ink-border)' }}>
              <label className="form-label" style={{ marginBottom: '0.65rem', display: 'block' }}>
                Account Initialization Preference
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setDataChoice('demo')}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: dataChoice === 'demo' ? 'var(--accent-muted)' : 'var(--ink)',
                    border: dataChoice === 'demo' ? '1px solid var(--accent)' : '1px solid var(--ink-border)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent)', fontWeight: 600, fontSize: '0.8125rem' }}>
                    <Sparkles size={14} />
                    <span>Load Demo Data</span>
                  </div>
                  <p style={{ fontSize: '0.6875rem', color: 'var(--cream-dim)', marginTop: '0.25rem' }}>
                    Explore with 13 realistic student expenses, 3 goals, and a 12-day streak.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setDataChoice('empty')}
                  style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: dataChoice === 'empty' ? 'var(--accent-muted)' : 'var(--ink)',
                    border: dataChoice === 'empty' ? '1px solid var(--accent)' : '1px solid var(--ink-border)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--cream)', fontWeight: 600, fontSize: '0.8125rem' }}>
                    <Target size={14} />
                    <span>Start Empty</span>
                  </div>
                  <p style={{ fontSize: '0.6875rem', color: 'var(--cream-dim)', marginTop: '0.25rem' }}>
                    Clean slate with zero transactions. Log entries manually from scratch.
                  </p>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2rem', paddingTop: '1.25rem', borderTop: '1px solid var(--ink-border)' }}>
          {step > 1 ? (
            <Button
              variant="ghost"
              onClick={() => setStep(step - 1)}
              icon={<ArrowLeft size={16} />}
            >
              Back
            </Button>
          ) : (
            <div />
          )}

          <Button
            variant="primary"
            onClick={handleNext}
            icon={<ArrowRight size={16} />}
          >
            {step === 3 ? 'Launch Velora Cockpit' : 'Next Step'}
          </Button>
        </div>
      </div>
    </div>
  );
};
