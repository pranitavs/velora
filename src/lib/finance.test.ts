import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBalance,
  calculateCategoryTotals,
  calculateSpendingByPeriod,
  calculateBudgetUsage,
  calculateSavingsRate,
  estimateGoalCompletion,
  calculateRequiredMonthlyContribution,
  calculateStreakFromActivity
} from './finance.js';

test('calculateBalance correctly computes income, expenses, and balance', () => {
  const transactions = [
    { type: 'income', amount: 50000, category: 'Salary' },
    { type: 'expense', amount: 12000, category: 'Rent' },
    { type: 'expense', amount: 3500, category: 'Food' },
    { type: 'income', amount: 2000, category: 'Goal Transfer' } // should be excluded from income
  ];

  const result = calculateBalance(transactions);
  assert.equal(result.income, 50000);
  assert.equal(result.expenses, 15500);
  assert.equal(result.balance, 34500);
});

test('calculateCategoryTotals aggregates by category and sorts descending', () => {
  const transactions = [
    { type: 'expense', amount: 500, category: 'Food' },
    { type: 'expense', amount: 1500, category: 'Food' },
    { type: 'expense', amount: 3000, category: 'Rent' },
    { type: 'expense', amount: 200, category: 'Transport' }
  ];

  const totals = calculateCategoryTotals(transactions, 'expense');
  assert.equal(totals.length, 3);
  assert.equal(totals[0].category, 'Rent');
  assert.equal(totals[0].amount, 3000);
  assert.equal(totals[1].category, 'Food');
  assert.equal(totals[1].amount, 2000);
  assert.equal(totals[1].count, 2);
  assert.equal(totals[2].category, 'Transport');
  assert.equal(totals[2].amount, 200);
});

test('calculateSavingsRate computes rate and handles zero income', () => {
  assert.equal(calculateSavingsRate(50000, 35000), 30);
  assert.equal(calculateSavingsRate(0, 5000), 0);
  assert.equal(calculateSavingsRate(40000, 50000), 0);
});

test('estimateGoalCompletion returns required months or null for 0 contribution', () => {
  assert.equal(estimateGoalCompletion(10000, 50000, 10000), 4);
  assert.equal(estimateGoalCompletion(50000, 50000, 10000), 0);
  assert.equal(estimateGoalCompletion(10000, 50000, 0), null);
});

test('calculateRequiredMonthlyContribution estimates needed monthly savings', () => {
  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + 5);

  const needed = calculateRequiredMonthlyContribution(10000, 60000, targetDate.toISOString());
  assert.equal(needed, 10000);
});

test('calculateStreakFromActivity counts consecutive days correctly', () => {
  const today = '2026-10-16';
  const activities = [
    '2026-10-16',
    '2026-10-15',
    '2026-10-14',
    '2026-10-13'
  ];
  assert.equal(calculateStreakFromActivity(activities, today), 4);

  // If user only did activity yesterday, streak should still be 3
  const yesterdayOnly = [
    '2026-10-15',
    '2026-10-14',
    '2026-10-13'
  ];
  assert.equal(calculateStreakFromActivity(yesterdayOnly, today), 3);

  // Gap breaks streak
  const brokenStreak = [
    '2026-10-16',
    '2026-10-14'
  ];
  assert.equal(calculateStreakFromActivity(brokenStreak, today), 1);
});
