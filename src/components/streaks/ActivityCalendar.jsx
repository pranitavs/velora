import React, { useMemo } from 'react';
import Card from '../ui/Card.jsx';
import Tooltip from '../ui/Tooltip.jsx';
import { formatDate } from '../../lib/dates.js';

export default function ActivityCalendar({ activities = [] }) {
  // Generate dates for the past 52 weeks (364 days)
  const calendarDays = useMemo(() => {
    const days = [];
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activitySet = new Map();
    for (const a of activities) {
      activitySet.set(a.activity_date, a.activity_type || 'Active Check-in');
    }

    for (let i = 363; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const iso = d.toISOString().split('T')[0];
      const hasActivity = activitySet.has(iso);
      days.push({
        date: iso,
        formatted: formatDate(d),
        active: hasActivity,
        type: activitySet.get(iso) || 'No activity recorded'
      });
    }

    return days;
  }, [activities]);

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', color: 'var(--color-cream)' }}>
            Annual Activity Frequency
          </h3>
          <p style={{ fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)' }}>
            Past 52 weeks of consistency. Each column represents one week.
          </p>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 'var(--text-caption)', color: 'var(--color-cream-dim)' }}>
          <span>Less</span>
          <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--color-ink-muted)' }} />
          <span style={{ width: 10, height: 10, borderRadius: 2, background: 'rgba(201, 168, 76, 0.4)' }} />
          <span style={{ width: 10, height: 10, borderRadius: 2, background: 'var(--color-accent)' }} />
          <span>More</span>
        </div>
      </div>

      {/* Calendar Grid: 52 columns x 7 rows */}
      <div style={{ overflowX: 'auto', paddingBottom: 8 }}>
        <div
          style={{
            display: 'grid',
            gridAutoFlow: 'column',
            gridTemplateRows: 'repeat(7, 12px)',
            gap: '4px',
            minWidth: '700px'
          }}
        >
          {calendarDays.map((day, idx) => {
            return (
              <Tooltip key={day.date} content={`${day.formatted}: ${day.type}`}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: 2,
                    background: day.active ? 'var(--color-accent)' : 'var(--color-ink-muted)',
                    cursor: 'pointer',
                    animation: `fadeIn 0.3s ease ${Math.min(idx * 0.003, 1)}s both`
                  }}
                  aria-label={`${day.formatted} - ${day.type}`}
                />
              </Tooltip>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
