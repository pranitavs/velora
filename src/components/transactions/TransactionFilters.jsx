import React, { useState, useEffect } from 'react';
import { Search, Download, Trash2 } from 'lucide-react';
import Button from '../ui/Button.jsx';

export default function TransactionFilters({
  searchTerm,
  onSearchChange,
  typeFilter,
  onTypeFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  categories = [],
  paymentMethodFilter,
  onPaymentMethodFilterChange,
  sortBy,
  onSortChange,
  onExportCSV,
  selectedCount = 0,
  onDeleteSelected,
  allSelected = false,
  onToggleSelectAll
}) {
  const [localSearch, setLocalSearch] = useState(searchTerm);

  // 300ms search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange(localSearch);
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch, onSearchChange]);

  return (
    <div
      style={{
        background: 'var(--color-ink-raised)',
        border: '1px solid var(--color-ink-border)',
        borderRadius: 'var(--radius-lg)',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px'
      }}
    >
      {/* Top row: Search input + Actions */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search
            size={18}
            strokeWidth={1.5}
            style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-cream-dim)' }}
          />
          <input
            type="text"
            placeholder="Search by description or merchant..."
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            style={{
              width: '100%',
              background: 'var(--color-ink)',
              border: '1px solid var(--color-ink-border)',
              borderRadius: 'var(--radius-md)',
              color: 'var(--color-cream)',
              padding: '10px 14px 10px 40px',
              fontSize: 'var(--text-body)',
              outline: 'none'
            }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {selectedCount > 0 && (
            <Button variant="destructive" size="sm" onClick={onDeleteSelected}>
              <Trash2 size={16} strokeWidth={1.5} /> Delete Selected ({selectedCount})
            </Button>
          )}

          <Button variant="secondary" size="sm" onClick={onExportCSV}>
            <Download size={16} strokeWidth={1.5} /> Export CSV
          </Button>
        </div>
      </div>

      {/* Filter Row */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', fontSize: 'var(--text-body-sm)' }}>
        {/* Select All Checkbox */}
        <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', color: 'var(--color-cream-dim)', marginRight: 8 }}>
          <input
            type="checkbox"
            checked={allSelected}
            onChange={onToggleSelectAll}
            style={{ accentColor: 'var(--color-accent)', width: 16, height: 16 }}
          />
          <span className="ui-label" style={{ fontSize: '0.6875rem' }}>Select All</span>
        </label>

        {/* Type Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="ui-label">Type:</span>
          <select
            value={typeFilter}
            onChange={(e) => onTypeFilterChange(e.target.value)}
            style={{
              background: 'var(--color-ink)',
              border: '1px solid var(--color-ink-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-cream)',
              padding: '6px 10px',
              fontSize: 'var(--text-body-sm)',
              outline: 'none'
            }}
          >
            <option value="all">All</option>
            <option value="expense">Expenses Only</option>
            <option value="income">Income Only</option>
          </select>
        </div>

        {/* Category Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="ui-label">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryFilterChange(e.target.value)}
            style={{
              background: 'var(--color-ink)',
              border: '1px solid var(--color-ink-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-cream)',
              padding: '6px 10px',
              fontSize: 'var(--text-body-sm)',
              outline: 'none'
            }}
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Payment Method */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span className="ui-label">Payment:</span>
          <select
            value={paymentMethodFilter}
            onChange={(e) => onPaymentMethodFilterChange(e.target.value)}
            style={{
              background: 'var(--color-ink)',
              border: '1px solid var(--color-ink-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-cream)',
              padding: '6px 10px',
              fontSize: 'var(--text-body-sm)',
              outline: 'none'
            }}
          >
            <option value="all">All Methods</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cash">Cash</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Sort */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 'auto' }}>
          <span className="ui-label">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            style={{
              background: 'var(--color-ink)',
              border: '1px solid var(--color-ink-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-cream)',
              padding: '6px 10px',
              fontSize: 'var(--text-body-sm)',
              outline: 'none'
            }}
          >
            <option value="date_desc">Date (Newest first)</option>
            <option value="date_asc">Date (Oldest first)</option>
            <option value="amount_desc">Amount (Highest)</option>
            <option value="amount_asc">Amount (Lowest)</option>
            <option value="category">Category</option>
          </select>
        </div>
      </div>
    </div>
  );
}
