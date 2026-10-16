import React, { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import {
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Edit2,
  Receipt,
  Calendar,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Button } from '../components/common/Button.tsx';
import { Card } from '../components/common/Card.tsx';
import { Input } from '../components/common/Input.tsx';
import { Select } from '../components/common/Select.tsx';
import { EmptyState } from '../components/common/EmptyState.tsx';
import { TransactionModal } from '../components/transactions/TransactionModal.tsx';
import {
  formatCurrency,
  groupTransactionsByDate,
  CATEGORIES,
} from '../lib/finance.js';
import {
  addTransaction,
  updateTransaction,
  deleteTransaction,
  exportTransactionsCSV,
} from '../lib/storage.js';

export const TransactionsPage: React.FC = () => {
  const { appState } = useOutletContext<any>();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const currency = appState?.user?.currency || 'INR';
  const transactions = appState?.transactions || [];

  // Filter logic
  const filtered = transactions.filter((t: any) => {
    const matchesSearch = (t.description || '').toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    const matchesCat = categoryFilter === 'all' || t.category === categoryFilter;
    return matchesSearch && matchesType && matchesCat;
  });

  const grouped = groupTransactionsByDate(filtered);

  // Totals for filtered subset
  const filteredIncome = filtered
    .filter((t: any) => t.type === 'income')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const filteredExpense = filtered
    .filter((t: any) => t.type === 'expense')
    .reduce((sum: number, t: any) => sum + t.amount, 0);

  const handleOpenAdd = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: any) => {
    setEditingTransaction(t);
    setIsModalOpen(true);
  };

  const handleSave = (txData: any) => {
    if (editingTransaction?.id) {
      updateTransaction(editingTransaction.id, txData);
    } else {
      addTransaction(txData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteTransaction(id);
    setDeleteConfirmId(null);
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Top Controls: Search, Filters, CSV Export, Add */}
      <Card style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontFamily: 'var(--font-serif)', color: 'var(--cream)' }}>
              Ledger Feed
            </h2>
            <div className="meta-unboxed-row" style={{ marginTop: '0.2rem' }}>
              <span>{filtered.length} entries shown</span>
              <span className="meta-dot-sep">·</span>
              <span style={{ color: 'var(--positive)' }}>+{formatCurrency(filteredIncome, currency)}</span>
              <span className="meta-dot-sep">·</span>
              <span style={{ color: 'var(--negative)' }}>-{formatCurrency(filteredExpense, currency)}</span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <Button
              variant="secondary"
              size="sm"
              onClick={exportTransactionsCSV}
              icon={<Download size={14} />}
            >
              Export CSV
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleOpenAdd}
              icon={<Plus size={15} />}
            >
              Record Transaction
            </Button>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: '0.75rem' }}>
          <div style={{ position: 'relative' }}>
            <Input
              placeholder="Search description (e.g. Canteen, Stipend)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftAddon={<Search size={15} />}
              style={{ minHeight: '38px', fontSize: '0.8125rem' }}
            />
          </div>

          <div>
            <select
              className="form-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as any)}
              style={{ minHeight: '38px', fontSize: '0.8125rem' }}
            >
              <option value="all">All Types (Inflow & Outflow)</option>
              <option value="income">Income Only (Inflow)</option>
              <option value="expense">Expense Only (Outflow)</option>
            </select>
          </div>

          <div>
            <select
              className="form-select"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              style={{ minHeight: '38px', fontSize: '0.8125rem' }}
            >
              <option value="all">All Categories</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* Date-Grouped Transaction List */}
      {grouped.length === 0 ? (
        <EmptyState
          icon={<Receipt size={32} />}
          title="No transactions match your query"
          description={
            search || typeFilter !== 'all' || categoryFilter !== 'all'
              ? 'Try resetting your search query or filters to view all entries.'
              : 'Your ledger is completely empty. Record your first campus expense or income.'
          }
          action={
            search || typeFilter !== 'all' || categoryFilter !== 'all'
              ? {
                  label: 'Clear Filters',
                  onClick: () => {
                    setSearch('');
                    setTypeFilter('all');
                    setCategoryFilter('all');
                  },
                }
              : {
                  label: '+ Record First Entry',
                  onClick: handleOpenAdd,
                }
          }
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {grouped.map((group) => {
            const dateObj = new Date(group.date);
            const dateFormatted = isNaN(dateObj.getTime())
              ? group.date
              : dateObj.toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                });

            return (
              <div key={group.date} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {/* Date header bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.4rem 0.5rem',
                    borderBottom: '1px solid var(--ink-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--cream-dim)', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    <Calendar size={13} />
                    <span>{dateFormatted}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--cream-subtle)' }}>
                    {group.dayIncome > 0 && (
                      <span style={{ color: 'var(--positive)', marginRight: '0.5rem' }}>
                        +{formatCurrency(group.dayIncome, currency)}
                      </span>
                    )}
                    {group.dayExpense > 0 && (
                      <span style={{ color: 'var(--negative)' }}>
                        -{formatCurrency(group.dayExpense, currency)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Items in this date */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {group.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="velora-card card-hover-lift"
                      style={{
                        padding: '0.85rem 1.1rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1rem',
                      }}
                    >
                      {/* Left: type icon + details */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: 'var(--radius-sm)',
                            backgroundColor: item.type === 'income' ? 'var(--positive-bg)' : 'var(--negative-bg)',
                            color: item.type === 'income' ? 'var(--positive)' : 'var(--negative)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                          }}
                        >
                          {item.type === 'income' ? <ArrowUpRight size={18} /> : <ArrowDownRight size={18} />}
                        </div>

                        <div style={{ overflow: 'hidden' }}>
                          <p style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--cream)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                            {item.description}
                          </p>
                          <div className="meta-unboxed-row" style={{ marginTop: '0.2rem' }}>
                            <span style={{ color: 'var(--accent)', fontWeight: 500 }}>{item.category}</span>
                            <span className="meta-dot-sep">·</span>
                            <span>{item.paymentMethod || 'UPI'}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right: Amount + Actions */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexShrink: 0 }}>
                        <div
                          style={{
                            fontFamily: 'var(--font-serif)',
                            fontSize: '1.125rem',
                            fontWeight: 600,
                            color: item.type === 'income' ? 'var(--positive)' : 'var(--cream)',
                            textAlign: 'right',
                          }}
                        >
                          {item.type === 'income' ? '+' : '-'} {formatCurrency(item.amount, currency)}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <button
                            onClick={() => handleOpenEdit(item)}
                            title="Edit transaction"
                            className="velora-btn btn-ghost btn-sm"
                            style={{ padding: '0.35rem', minHeight: 'auto' }}
                          >
                            <Edit2 size={14} />
                          </button>

                          {deleteConfirmId === item.id ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                              <button
                                onClick={() => handleDelete(item.id)}
                                title="Confirm Delete"
                                className="velora-btn btn-danger btn-sm"
                                style={{ padding: '0.2rem 0.5rem', fontSize: '0.6875rem', minHeight: 'auto' }}
                              >
                                Delete
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="velora-btn btn-ghost btn-sm"
                                style={{ padding: '0.2rem 0.4rem', fontSize: '0.6875rem', minHeight: 'auto' }}
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirmId(item.id)}
                              title="Delete transaction"
                              className="velora-btn btn-ghost btn-sm"
                              style={{ padding: '0.35rem', minHeight: 'auto', color: 'var(--cream-subtle)' }}
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add / Edit Transaction Modal */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        initialData={editingTransaction}
        currency={currency}
      />
    </div>
  );
};
