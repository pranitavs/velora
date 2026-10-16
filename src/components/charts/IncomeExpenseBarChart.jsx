import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function IncomeExpenseBarChart({
  transactions = [],
  currencySymbol = '₹',
  height = 300
}) {
  if (!transactions || transactions.length === 0) {
    return (
      <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-cream-dim)' }}>
        No transactions in this period to plot income vs expenses.
      </div>
    );
  }

  // Group by day or month
  const periodMap = new Map();
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));

  for (const t of sorted) {
    const key = t.date;
    if (!periodMap.has(key)) {
      periodMap.set(key, { income: 0, expense: 0 });
    }
    const val = periodMap.get(key);
    if (t.type === 'income') val.income += Number(t.amount) || 0;
    if (t.type === 'expense') val.expense += Number(t.amount) || 0;
  }

  const labels = Array.from(periodMap.keys()).map(k => {
    const parts = k.split('-');
    return `${parts[2]}/${parts[1]}`;
  });
  const incomeValues = Array.from(periodMap.values()).map(v => v.income);
  const expenseValues = Array.from(periodMap.values()).map(v => v.expense);

  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeValues,
        backgroundColor: '#4CAF82', // --color-positive
        borderRadius: 4
      },
      {
        label: 'Expenses',
        data: expenseValues,
        backgroundColor: '#D9604A', // --color-negative
        borderRadius: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 800 },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#A89F94',
          font: { family: 'DM Sans', size: 12 },
          usePointStyle: true,
          boxWidth: 8
        }
      },
      tooltip: {
        backgroundColor: '#080807',
        titleColor: '#F0EDE6',
        bodyColor: '#A89F94',
        borderColor: '#C9A84C',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ${currencySymbol}${ctx.parsed.y.toLocaleString('en-IN')}`
        }
      }
    },
    scales: {
      x: {
        grid: { color: '#2C2A26' },
        ticks: { color: '#A89F94', font: { family: 'DM Sans', size: 11 } }
      },
      y: {
        grid: { color: '#2C2A26' },
        ticks: {
          color: '#A89F94',
          font: { family: 'DM Sans', size: 11 },
          callback: (v) => `${currencySymbol}${v}`
        }
      }
    }
  };

  return (
    <div style={{ height, width: '100%', position: 'relative' }}>
      <Bar data={data} options={options} />
    </div>
  );
}
