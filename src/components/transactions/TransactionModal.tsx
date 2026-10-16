import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal.tsx';
import { Button } from '../common/Button.tsx';
import { Input } from '../common/Input.tsx';
import { Select } from '../common/Select.tsx';
import { CATEGORIES, PAYMENT_METHODS, CURRENCY_MAP } from '../../lib/finance.js';

interface Transaction {
  id?: string;
  type: 'income' | 'expense';
  amount: number;
  description: string;
  category: string;
  date: string;
  paymentMethod: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: Transaction) => void;
  initialData?: Transaction | null;
  currency?: string;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  currency = 'INR',
}) => {
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<string>('Food');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [paymentMethod, setPaymentMethod] = useState<string>('UPI');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const currencySymbol = (CURRENCY_MAP as any)[currency]?.symbol || '₹';

  useEffect(() => {
    if (initialData) {
      setType(initialData.type || 'expense');
      setAmount(initialData.amount ? String(initialData.amount) : '');
      setDescription(initialData.description || '');
      setCategory(initialData.category || 'Food');
      setDate(initialData.date || new Date().toISOString().split('T')[0]);
      setPaymentMethod(initialData.paymentMethod || 'UPI');
    } else {
      setType('expense');
      setAmount('');
      setDescription('');
      setCategory('Food');
      setDate(new Date().toISOString().split('T')[0]);
      setPaymentMethod('UPI');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    const parsedAmount = parseFloat(amount);
    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      newErrors.amount = 'Please enter a valid amount greater than 0';
    }

    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!date) {
      newErrors.date = 'Date is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      id: initialData?.id,
      type,
      amount: parsedAmount,
      description: description.trim(),
      category,
      date,
      paymentMethod,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Edit Transaction' : 'Record Transaction'}
      subtitle={initialData ? 'Update details in your ledger' : 'Log new cashflow into your ledger'}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit} type="button">
            {initialData ? 'Save Changes' : 'Record Entry'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {/* Inflow vs Outflow toggle */}
        <div style={{ marginBottom: '1.25rem' }}>
          <label className="form-label" style={{ marginBottom: '0.4rem', display: 'block' }}>
            Transaction Type
          </label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0.5rem',
              background: 'var(--ink)',
              padding: '4px',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--ink-border)',
            }}
          >
            <button
              type="button"
              onClick={() => {
                setType('expense');
                if (category === 'Education' && !initialData) setCategory('Food');
              }}
              style={{
                padding: '0.55rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.8125rem',
                backgroundColor: type === 'expense' ? 'var(--negative-bg)' : 'transparent',
                color: type === 'expense' ? 'var(--negative)' : 'var(--cream-dim)',
                borderBottom: type === 'expense' ? '2px solid var(--negative)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              Expense (Outflow)
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                if (category === 'Food' && !initialData) setCategory('Education');
              }}
              style={{
                padding: '0.55rem',
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.8125rem',
                backgroundColor: type === 'income' ? 'var(--positive-bg)' : 'transparent',
                color: type === 'income' ? 'var(--positive)' : 'var(--cream-dim)',
                borderBottom: type === 'income' ? '2px solid var(--positive)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              Income (Inflow)
            </button>
          </div>
        </div>

        {/* Amount */}
        <Input
          label="Amount"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amount}
          leftAddon={<span style={{ fontWeight: 600, color: 'var(--cream)' }}>{currencySymbol}</span>}
          autoFocus
        />

        {/* Description */}
        <Input
          label="Description"
          type="text"
          placeholder="e.g. Campus Cafeteria, Research Stipend, Books"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={errors.description}
        />

        {/* Category & Payment Method 2-column */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <Select
            label="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            options={CATEGORIES}
          />

          <Select
            label="Payment Method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            options={PAYMENT_METHODS}
          />
        </div>

        {/* Date */}
        <Input
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          error={errors.date}
        />
      </form>
    </Modal>
  );
};
