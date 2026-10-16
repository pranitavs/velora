import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import EmptyState from '../ui/EmptyState.jsx';
import { TrendingUp } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function SpendingLineChart({
  transactions = [],
  currencySymbol = '₹',
  height = 280
}) {
  if (!transactions || transactions.length === 0) {
    return (
      <EmptyState
        icon={TrendingUp}
        title="No spending trend yet"
        description="Add your first transaction to see your spending trend over time."
        style={{ height }}
      />
    );
  }

  // Aggregate income and expense by date
  const dateMap = new Map();
  // Sort transactions by date ascending for line plot
  const sorted = [...transactions].sort((a, b) => a.date.localeCompare(b.date));

  for (const t of sorted) {
    const d = t.date;
    if (!dateMap.has(d)) {
      dateMap.set(d, { income: 0, expense: 0 });
    }
    const entry = dateMap.get(d);
    if (t.type === 'income') entry.income += Number(t.amount) || 0;
    if (t.type === 'expense') entry.expense += Number(t.amount) || 0;
  }

  const labels = Array.from(dateMap.keys()).map(d => {
    const parts = d.split('-');
    return `${parts[2]}/${parts[1]}`;
  });
  const incomeData = Array.from(dateMap.values()).map(v => v.income);
  const expenseData = Array.from(dateMap.values()).map(v => v.expense);

  const data = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        borderColor: '#4CAF82', // --color-positive
        backgroundColor: 'rgba(76, 175, 130, 0.08)',
        borderWidth: 2,
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#4CAF82',
        pointRadius: 3
      },
      {
        label: 'Expenses',
        data: expenseData,
        borderColor: '#D9604A', // --color-negative
        backgroundColor: 'rgba(217, 96, 74, 0.08)',
        borderWidth: 2,
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#D9604A',
        pointRadius: 3
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 800,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#A89F94', // --color-cream-dim
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
        boxPadding: 4,
        callbacks: {
          label: (context) => ` ${context.dataset.label}: ${currencySymbol}${context.parsed.y.toLocaleString('en-IN')}`
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: '#2C2A26',
          lineWidth: 1
        },
        ticks: {
          color: '#A89F94',
          font: { family: 'DM Sans', size: 11 }
        }
      },
      y: {
        grid: {
          color: '#2C2A26',
          lineWidth: 1
        },
        ticks: {
          color: '#A89F94',
          font: { family: 'DM Sans', size: 11 },
          callback: (value) => `${currencySymbol}${value}`
        }
      }
    }
  };

  return (
    <div style={{ height, width: '100%', position: 'relative' }}>
      <Line data={data} options={options} />
    </div>
  );
}
