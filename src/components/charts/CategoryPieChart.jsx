import React from 'react';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip);

const CHART_COLORS = [
  '#C9A84C', // Chart 1 - Gold
  '#4CAF82', // Chart 2 - Green
  '#7B9FD4', // Chart 3 - Blue
  '#D9604A', // Chart 4 - Red
  '#B57FD4', // Chart 5 - Purple
  '#4FBFBF'  // Chart 6 - Cyan
];

export default function CategoryPieChart({
  categoryTotals = [],
  currencySymbol = '₹',
  selectedCategory,
  onSelectCategory
}) {
  if (!categoryTotals || categoryTotals.length === 0) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: 'var(--color-cream-dim)' }}>
        No category expenditure recorded in this period.
      </div>
    );
  }

  const labels = categoryTotals.map(c => c.category);
  const dataValues = categoryTotals.map(c => c.amount);
  const backgroundColors = categoryTotals.map((_, i) => CHART_COLORS[i % CHART_COLORS.length]);

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: backgroundColors,
        borderColor: '#0E0D0B',
        borderWidth: 2,
        hoverOffset: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '72%',
    animation: {
      duration: 800,
      easing: 'easeOutQuart'
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#080807',
        titleColor: '#F0EDE6',
        bodyColor: '#A89F94',
        borderColor: '#C9A84C',
        borderWidth: 1,
        padding: 8,
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${currencySymbol}${ctx.parsed.toLocaleString('en-IN')}`
        }
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
      {/* Donut chart container */}
      <div style={{ width: '160px', height: '160px', position: 'relative', flexShrink: 0 }}>
        <Doughnut data={data} options={options} />
      </div>

      {/* Category List */}
      <div style={{ flex: 1, minWidth: '180px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {categoryTotals.slice(0, 6).map((cat, i) => {
          const isSelected = selectedCategory === cat.category;
          return (
            <div
              key={cat.category}
              onClick={() => onSelectCategory && onSelectCategory(isSelected ? null : cat.category)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                background: isSelected ? 'var(--color-ink)' : 'transparent',
                cursor: onSelectCategory ? 'pointer' : 'default',
                border: isSelected ? '1px solid var(--color-accent)' : '1px solid transparent',
                transition: 'background 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span
                  style={{
                    width: 10,
                    height: 10,
                    borderRadius: '50%',
                    background: CHART_COLORS[i % CHART_COLORS.length]
                  }}
                />
                <span style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-cream)', fontWeight: 500 }}>
                  {cat.category}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                <span className="tabular-nums" style={{ fontSize: 'var(--text-body-sm)', color: 'var(--color-cream)' }}>
                  {currencySymbol}{cat.amount.toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)' }}>
                  {cat.percentage}%
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
