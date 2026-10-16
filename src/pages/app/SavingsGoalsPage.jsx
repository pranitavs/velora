import React, { useState } from 'react';
import { Plus, Target } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import GoalCard from '../../components/goals/GoalCard.jsx';
import GoalForm from '../../components/goals/GoalForm.jsx';
import ContributionHistory from '../../components/goals/ContributionHistory.jsx';
import { useSavingsGoals } from '../../hooks/useSavingsGoals.js';
import { useCurrency } from '../../contexts/CurrencyContext.jsx';

export default function SavingsGoalsPage() {
  const { currencySymbol } = useCurrency();
  const {
    goals,
    contributions,
    loading,
    addGoal,
    addContribution
  } = useSavingsGoals();

  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [activeGoalForContribution, setActiveGoalForContribution] = useState(null);

  const handleDeposit = (goal) => {
    setActiveGoalForContribution(goal);
  };

  const handleViewHistory = (goal) => {
    setActiveGoalForContribution(goal);
  };

  return (
    <div>
      <PageHeader
        title="Savings Goals"
        subtitle="Dedicated targets for emergency funds, major milestones, and purposeful reserves."
        action={
          <Button variant="primary" onClick={() => setIsAddGoalOpen(true)}>
            <Plus size={16} strokeWidth={1.5} /> Create Goal
          </Button>
        }
      />

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          <Skeleton height="240px" />
          <Skeleton height="240px" />
        </div>
      ) : goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="No savings goals yet"
          description="Give your money intentional direction. Define your first target to monitor required monthly paces."
          actionLabel="Create your first goal"
          onAction={() => setIsAddGoalOpen(true)}
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: 24
          }}
        >
          {goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              currencySymbol={currencySymbol}
              onAddContribution={handleDeposit}
              onViewHistory={handleViewHistory}
            />
          ))}
        </div>
      )}

      {/* Add Goal Modal */}
      <GoalForm
        isOpen={isAddGoalOpen}
        onClose={() => setIsAddGoalOpen(false)}
        onSave={addGoal}
        currencySymbol={currencySymbol}
      />

      {/* Contribution & History Modal */}
      <ContributionHistory
        isOpen={Boolean(activeGoalForContribution)}
        onClose={() => setActiveGoalForContribution(null)}
        goal={activeGoalForContribution}
        contributions={contributions}
        onAddDeposit={addContribution}
        currencySymbol={currencySymbol}
      />
    </div>
  );
}
