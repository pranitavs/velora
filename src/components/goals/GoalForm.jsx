import React, { useState } from 'react';
import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';
import Input from '../ui/Input.jsx';

export default function GoalForm({
  isOpen,
  onClose,
  onSave,
  currencySymbol = '₹'
}) {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [startingAmount, setStartingAmount] = useState('');
  const [emoji, setEmoji] = useState('🎯');

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Goal name is required';
    const tgt = parseFloat(targetAmount);
    if (isNaN(tgt) || tgt <= 0) errs.targetAmount = 'Target amount must be greater than 0';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await onSave({
        name: name.trim(),
        target_amount: parseFloat(targetAmount),
        target_date: targetDate || null,
        starting_amount: parseFloat(startingAmount) || 0,
        emoji
      });
      onClose();
      // Reset form
      setName('');
      setTargetAmount('');
      setTargetDate('');
      setStartingAmount('');
      setEmoji('🎯');
    } catch (err) {
      console.error('Error creating goal:', err);
      setErrors({ submit: err.message || 'Failed to create goal.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Savings Goal"
      subtitle="Define a clear financial benchmark to build momentum."
    >
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {errors.submit && (
          <div style={{ padding: 10, borderRadius: 6, background: 'rgba(217,96,74,0.1)', color: 'var(--color-negative)', fontSize: '0.875rem' }}>
            {errors.submit}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '70px 1fr', gap: 12 }}>
          <Input
            label="Icon"
            placeholder="🎯"
            value={emoji}
            onChange={(e) => setEmoji(e.target.value)}
          />
          <Input
            label="Goal Name"
            placeholder="e.g. New Laptop, Emergency Fund"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={errors.name}
            required
            autoFocus
          />
        </div>

        <Input
          label={`Target Amount (${currencySymbol})`}
          type="number"
          placeholder="50000"
          value={targetAmount}
          onChange={(e) => setTargetAmount(e.target.value)}
          error={errors.targetAmount}
          required
          className="tabular-nums"
        />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <Input
            label="Target Date (Optional)"
            type="date"
            value={targetDate}
            onChange={(e) => setTargetDate(e.target.value)}
          />

          <Input
            label={`Starting Balance (${currencySymbol})`}
            type="number"
            placeholder="0"
            value={startingAmount}
            onChange={(e) => setStartingAmount(e.target.value)}
            className="tabular-nums"
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 12 }}>
          <Button variant="ghost" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" loading={loading}>
            Create Goal
          </Button>
        </div>
      </form>
    </Modal>
  );
}
