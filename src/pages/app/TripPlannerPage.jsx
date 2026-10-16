import React, { useState } from 'react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import TripPlannerForm from '../../components/ai/TripPlannerForm.jsx';
import GoalForm from '../../components/goals/GoalForm.jsx';
import { useCurrency } from '../../contexts/CurrencyContext.jsx';
import { useSavingsGoals } from '../../hooks/useSavingsGoals.js';

export default function TripPlannerPage() {
  const { currencySymbol } = useCurrency();
  const { addGoal } = useSavingsGoals();

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [prefilledGoalData, setPrefilledGoalData] = useState(null);

  const handleConvertGoal = (tripData) => {
    setPrefilledGoalData(tripData);
    setIsGoalModalOpen(true);
  };

  const handleSaveGoal = async (goalPayload) => {
    await addGoal({
      ...goalPayload,
      name: prefilledGoalData?.name || goalPayload.name,
      target_amount: prefilledGoalData?.targetAmount || goalPayload.target_amount,
      emoji: prefilledGoalData?.emoji || '✈️'
    });
    setIsGoalModalOpen(false);
    setPrefilledGoalData(null);
  };

  return (
    <div>
      <PageHeader
        title="AI Trip Budget Planner"
        subtitle="Formulate realistic travel estimates and transform itineraries directly into achievable savings targets."
      />

      <TripPlannerForm
        currencySymbol={currencySymbol}
        onSaveToGoal={handleConvertGoal}
      />

      {/* Goal Modal pre-filled from trip */}
      <GoalForm
        isOpen={isGoalModalOpen}
        onClose={() => {
          setIsGoalModalOpen(false);
          setPrefilledGoalData(null);
        }}
        onSave={handleSaveGoal}
        currencySymbol={currencySymbol}
      />
    </div>
  );
}
