import React from 'react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import ChatInterface from '../../components/ai/ChatInterface.jsx';
import { useTransactions } from '../../hooks/useTransactions.js';
import { useSavingsGoals } from '../../hooks/useSavingsGoals.js';
import { useCurrency } from '../../contexts/CurrencyContext.jsx';

export default function AssistantPage() {
  const { transactions } = useTransactions();
  const { goals } = useSavingsGoals();
  const { currencySymbol } = useCurrency();

  return (
    <div>
      <PageHeader
        title="Financial Assistant"
        subtitle="Private intelligence grounded strictly in your verified transactions and savings benchmarks."
      />

      <ChatInterface
        transactions={transactions}
        goals={goals}
        currencySymbol={currencySymbol}
      />
    </div>
  );
}
