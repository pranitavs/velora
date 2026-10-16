import React, { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import PageHeader from '../../components/layout/PageHeader.jsx';
import Button from '../../components/ui/Button.jsx';
import TransactionFilters from '../../components/transactions/TransactionFilters.jsx';
import TransactionList from '../../components/transactions/TransactionList.jsx';
import TransactionForm from '../../components/transactions/TransactionForm.jsx';
import Skeleton from '../../components/ui/Skeleton.jsx';
import { useTransactions } from '../../hooks/useTransactions.js';
import { useCurrency } from '../../contexts/CurrencyContext.jsx';

const PAGE_SIZE = 50;

export default function TransactionsPage() {
  const { currencySymbol } = useCurrency();
  const {
    transactions,
    loading,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    deleteMultipleTransactions
  } = useTransactions();

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [paymentMethodFilter, setPaymentMethodFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date_desc');

  // Pagination state
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Bulk Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // Modal State
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  // Extract unique categories for filter dropdown
  const uniqueCategories = useMemo(() => {
    const set = new Set(transactions.map(t => t.category).filter(Boolean));
    return Array.from(set).sort();
  }, [transactions]);

  // Filter & Sort Logic
  const filteredAndSorted = useMemo(() => {
    let result = [...transactions];

    // Search
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      result = result.filter(t =>
        (t.description || '').toLowerCase().includes(q) ||
        (t.notes || '').toLowerCase().includes(q)
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      result = result.filter(t => t.type === typeFilter);
    }

    // Category filter
    if (categoryFilter !== 'all') {
      result = result.filter(t => t.category === categoryFilter);
    }

    // Payment method filter
    if (paymentMethodFilter !== 'all') {
      result = result.filter(t => t.payment_method === paymentMethodFilter);
    }

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'date_desc') return b.date.localeCompare(a.date);
      if (sortBy === 'date_asc') return a.date.localeCompare(b.date);
      if (sortBy === 'amount_desc') return (Number(b.amount) || 0) - (Number(a.amount) || 0);
      if (sortBy === 'amount_asc') return (Number(a.amount) || 0) - (Number(b.amount) || 0);
      if (sortBy === 'category') return (a.category || '').localeCompare(b.category || '');
      return 0;
    });

    return result;
  }, [transactions, searchTerm, typeFilter, categoryFilter, paymentMethodFilter, sortBy]);

  // Paginated visible slice
  const paginatedTransactions = useMemo(() => {
    return filteredAndSorted.slice(0, visibleCount);
  }, [filteredAndSorted, visibleCount]);

  // Toggle single item selection
  const handleToggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Toggle select all
  const handleToggleSelectAll = () => {
    if (selectedIds.length === filteredAndSorted.length && filteredAndSorted.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredAndSorted.map(t => t.id));
    }
  };

  // Delete selected with confirmation
  const handleDeleteSelected = async () => {
    if (selectedIds.length === 0) return;
    const confirmed = window.confirm(`Are you sure you want to delete ${selectedIds.length} selected transaction(s)? This action cannot be undone.`);
    if (confirmed) {
      await deleteMultipleTransactions(selectedIds);
      setSelectedIds([]);
    }
  };

  // Single delete with confirmation
  const handleDeleteSingle = async (id) => {
    const confirmed = window.confirm('Delete this transaction?');
    if (confirmed) {
      await deleteTransaction(id);
      setSelectedIds(prev => prev.filter(i => i !== id));
    }
  };

  // Open edit modal
  const handleEdit = (tx) => {
    setEditingTransaction(tx);
    setIsFormOpen(true);
  };

  // Save add/edit
  const handleSaveForm = async (txData) => {
    if (editingTransaction?.id) {
      await updateTransaction(editingTransaction.id, txData);
    } else {
      await addTransaction(txData);
    }
    setEditingTransaction(null);
  };

  // Export to CSV
  const handleExportCSV = () => {
    if (filteredAndSorted.length === 0) {
      alert('No transactions available to export under current filters.');
      return;
    }

    const headers = ['Date', 'Type', 'Category', 'Description', 'Amount', 'Payment Method', 'Notes'];
    const rows = filteredAndSorted.map(t => [
      `"${t.date || ''}"`,
      `"${t.type || ''}"`,
      `"${(t.category || '').replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`,
      Number(t.amount || 0).toFixed(2),
      `"${(t.payment_method || '').replace(/"/g, '""')}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `velora_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <PageHeader
        title="Transactions"
        subtitle="Complete chronological ledger of your financial inflows and expenses."
        action={
          <Button
            variant="primary"
            onClick={() => {
              setEditingTransaction(null);
              setIsFormOpen(true);
            }}
          >
            <Plus size={16} strokeWidth={1.5} /> Record Transaction
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <TransactionFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        categories={uniqueCategories}
        paymentMethodFilter={paymentMethodFilter}
        onPaymentMethodFilterChange={setPaymentMethodFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
        onExportCSV={handleExportCSV}
        selectedCount={selectedIds.length}
        onDeleteSelected={handleDeleteSelected}
        allSelected={filteredAndSorted.length > 0 && selectedIds.length === filteredAndSorted.length}
        onToggleSelectAll={handleToggleSelectAll}
      />

      {/* Transaction List Grouped by Date */}
      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <Skeleton height="72px" />
          <Skeleton height="72px" />
          <Skeleton height="72px" />
          <Skeleton height="72px" />
        </div>
      ) : (
        <>
          <TransactionList
            transactions={paginatedTransactions}
            currencySymbol={currencySymbol}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onEdit={handleEdit}
            onDelete={handleDeleteSingle}
            onAddNew={() => {
              setEditingTransaction(null);
              setIsFormOpen(true);
            }}
          />

          {/* Load More Button for Pagination (50 at a time) */}
          {visibleCount < filteredAndSorted.length && (
            <div style={{ textAlign: 'center', marginTop: 28 }}>
              <Button
                variant="secondary"
                onClick={() => setVisibleCount(prev => prev + PAGE_SIZE)}
              >
                Load more transactions ({filteredAndSorted.length - visibleCount} remaining)
              </Button>
            </div>
          )}
        </>
      )}

      {/* Add / Edit Transaction Modal */}
      <TransactionForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingTransaction(null);
        }}
        initialData={editingTransaction}
        onSave={handleSaveForm}
        currencySymbol={currencySymbol}
      />
    </div>
  );
}
