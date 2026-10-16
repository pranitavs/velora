import React, { useState, useEffect } from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';
import Select from '../ui/Select.jsx';
import { getTodayISO } from '../../lib/dates.js';

const EXPENSE_CATEGORIES = [
  { value: 'Food & Dining', label: 'Food & Dining' },
  { value: 'Rent & Living', label: 'Rent & Living' },
  { value: 'Transport', label: 'Transport & Commute' },
  { value: 'Academic & Books', label: 'Academic & Books' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Health', label: 'Health & Fitness' },
  { value: 'Bills & Utilities', label: 'Bills & Utilities' },
  { value: 'Other Expense', label: 'Other Expense' }
];

const INCOME_CATEGORIES = [
  { value: 'Salary', label: 'Salary / Stipend' },
  { value: 'Freelance', label: 'Freelance / Consulting' },
  { value: 'Allowance', label: 'Family Allowance' },
  { value: 'Investment', label: 'Dividends & Interest' },
  { value: 'Refund', label: 'Refund / Cash Back' },
  { value: 'Other Income', label: 'Other Income' }
];

const PAYMENT_METHODS = [
  { value: 'UPI', label: 'UPI (GPay / PhonePe / Paytm)' },
  { value: 'Card', label: 'Debit / Credit Card' },
  { value: 'Bank Transfer', label: 'Net Banking / Transfer' },
  { value: 'Cash', label: 'Cash' },
  { value: 'Other', label: 'Other' }
];

export default function TransactionForm({
  isOpen,
  onClose,
  initialData = null,
  onSave,
  currencySymbol = '₹'
}) {
  const isEditing = Boolean(initialData?.id);

  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food & Dining');
  const [date, setDate] = useState(getTodayISO());
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [notes, setNotes] = useState('');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setType(initialData.type || 'expense');
      setAmount(initialData.amount ? String(initialData.amount) : '');
      setDescription(initialData.description || '');
      setCategory(initialData.category || (initialData.type === 'income' ? 'Salary' : 'Food & Dining'));
      setDate(initialData.date || getTodayISO());
      setPaymentMethod(initialData.payment_method || 'UPI');
      setNotes(initialData.notes || '');
    } else {
      setType('expense');
      setAmount('');
      setDescription('');
      setCategory('Food & Dining');
      setDate(getTodayISO());
      setPaymentMethod('UPI');
      setNotes('');
    }
    setErrors({});
  }, [initialData, isOpen]);

  const handleTypeChange = (newType) => {
    setType(newType);
    setCategory(newType === 'income' ? 'Salary' : 'Food & Dining');
  };

  const validate = () => {
    const errs = {};
    const amtNum = parseFloat(amount);
    if (isNaN(amtNum) || amtNum <= 0) {
      errs.amount = 'Please enter a valid amount greater than 0';
    }
    if (!description.trim()) {
      errs.description = 'Description is required';
    }
    if (!category) {
      errs.category = 'Category is required';
    }
    if (!date) {
      errs.date = 'Date is required';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSave({
        type,
        amount: parseFloat(amount),
        description: description.trim(),
        category,
        date,
        payment_method: paymentMethod,
        notes: notes.trim()
      });
      onClose();
    } catch (err) {
      console.error('Error saving transaction:', err);
      setErrors({ submit: err.message || 'Failed to save transaction.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Transaction' : 'Record Transaction'}
      subtitle="Keep your financial records accurate and timely."
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {errors.submit && (
          <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(217,96,74,0.1)', color: 'var(--color-negative)', fontSize: 'var(--text-body-sm)' }}>
            {errors.submit}
          </div>
        )}

        {/* Type Toggle: Income / Expense */}
        <div>
          <label className="ui-label" style={{ display: 'block', marginBottom: 8 }}>Transaction Type</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              style={{
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                background: type === 'expense' ? 'rgba(217, 96, 74, 0.15)' : 'var(--color-ink)',
                border: `1px solid ${type === 'expense' ? 'var(--color-negative)' : 'var(--color-ink-border)'}`,
                color: type === 'expense' ? 'var(--color-negative)' : 'var(--color-cream-dim)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Expense
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              style={{
                padding: '10px',
                borderRadius: 'var(--radius-md)',
                background: type === 'income' ? 'rgba(76, 175, 130, 0.15)' : 'var(--color-ink)',
                border: `1px solid ${type === 'income' ? 'var(--color-positive)' : 'var(--color-ink-border)'}`,
                color: type === 'income' ? 'var(--color-positive)' : 'var(--color-cream-dim)',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              Income
            </button>
          </div>
        </div>

        {/* Amount */}
        <Input
          label={`Amount (${currencySymbol})`}
          type="number"
          step="0.01"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          error={errors.amount}
          required
          autoFocus
          className="tabular-nums"
        />

        {/* Description */}
        <Input
          label="Description"
          placeholder="e.g. Swiggy lunch, College textbook, Metro recharge"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          error={errors.description}
          required
        />

        {/* Category & Date Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Select
            label="Category"
            options={type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            error={errors.category}
            required
          />

          <Input
            label="Date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            error={errors.date}
            required
          />
        </div>

        {/* Payment Method */}
        <Select
          label="Payment Method"
          options={PAYMENT_METHODS}
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
        />

        {/* Notes */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <label htmlFor="txNotes" className="ui-label">Notes (Optional)</label>
          <textarea
            id="txNotes"
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Add relevant context or tags..."
            style={{
              background: 'var(--color-ink-raised)',
              border: '1px solid var(--color-ink-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-cream)',
              padding: '10px 14px',
              fontSize: 'var(--text-body)',
              resize: 'none',
              outline: 'none'
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            {isEditing ? 'Save Changes' : 'Record Transaction'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
