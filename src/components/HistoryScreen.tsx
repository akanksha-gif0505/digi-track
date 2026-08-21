import React, { useState, useMemo } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { Expense } from '../types';
import { DownloadExpensesModal } from './DownloadExpensesModal';

type DateRangePreset = 'all' | 'today' | 'week' | 'month' | 'custom';

export const HistoryScreen: React.FC = () => {
  const { expenses, categories, deleteExpense, updateExpense, formatCurrency, triggerSync, syncStatus } = useExpense();
  
  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [datePreset, setDatePreset] = useState<DateRangePreset>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [showCustomDateInputs, setShowCustomDateInputs] = useState<boolean>(false);
  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);

  // Edit / Details Modal State
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editAmount, setEditAmount] = useState('');
  const [editNote, setEditNote] = useState('');
  const [editCategory, setEditCategory] = useState('');

  // Calculate Date bounds for filtering
  const dateBounds = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    if (datePreset === 'today') {
      return { start: todayStr, end: todayStr };
    }

    if (datePreset === 'week') {
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(now.getDate() - 7);
      return { start: sevenDaysAgo.toISOString().split('T')[0], end: todayStr };
    }

    if (datePreset === 'month') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return { start: startOfMonth.toISOString().split('T')[0], end: todayStr };
    }

    if (datePreset === 'custom') {
      return {
        start: startDate || '1970-01-01',
        end: endDate || '2099-12-31',
      };
    }

    return { start: '', end: '' };
  }, [datePreset, startDate, endDate]);

  // Filter expenses based on search query, category, and date range
  const filteredExpenses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    return expenses.filter((exp) => {
      // 1. Category Filter
      const matchCategory =
        selectedCategory === 'all' ||
        exp.category.toLowerCase() === selectedCategory.toLowerCase();

      if (!matchCategory) return false;

      // 2. Date Range Filter
      if (datePreset !== 'all' && (dateBounds.start || dateBounds.end)) {
        if (dateBounds.start && exp.date < dateBounds.start) return false;
        if (dateBounds.end && exp.date > dateBounds.end) return false;
      }

      // 3. Search Query Filter (Merchant name / title, category name, notes, amount, payment mode)
      if (query !== '') {
        const catObj = categories.find((c) => c.id.toLowerCase() === exp.category.toLowerCase());
        const catName = catObj ? catObj.name.toLowerCase() : '';
        const titleMatch = exp.title.toLowerCase().includes(query);
        const catMatch = exp.category.toLowerCase().includes(query) || catName.includes(query);
        const noteMatch = !!exp.note && exp.note.toLowerCase().includes(query);
        const amountMatch = exp.amount.toString().includes(query);
        const modeMatch = exp.paymentMode.toLowerCase().includes(query);
        const dateMatch = exp.date.includes(query);

        if (!titleMatch && !catMatch && !noteMatch && !amountMatch && !modeMatch && !dateMatch) {
          return false;
        }
      }

      return true;
    });
  }, [expenses, selectedCategory, datePreset, dateBounds, searchQuery, categories]);

  // Calculate filtered total amount
  const totalFilteredAmount = useMemo(() => {
    return filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  }, [filteredExpenses]);

  // Check if any filter is active
  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'all' || datePreset !== 'all';

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setDatePreset('all');
    setStartDate('');
    setEndDate('');
    setShowCustomDateInputs(false);
  };

  // Group by Date formatted string
  const groupedExpenses = useMemo(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterdayStr = yesterdayDate.toISOString().split('T')[0];

    const groups: { [key: string]: { label: string; items: Expense[] } } = {};

    filteredExpenses.forEach((exp) => {
      const groupKey = exp.date;
      let label = exp.date;

      if (exp.date === todayStr) {
        label = `Today, ${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      } else if (exp.date === yesterdayStr) {
        label = `Yesterday, ${yesterdayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      } else {
        const d = new Date(exp.date);
        if (!isNaN(d.getTime())) {
          label = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        }
      }

      if (!groups[groupKey]) {
        groups[groupKey] = { label, items: [] };
      }
      groups[groupKey].items.push(exp);
    });

    // Return sorted groups
    return Object.keys(groups)
      .sort((a, b) => b.localeCompare(a))
      .map((key) => groups[key]);
  }, [filteredExpenses]);

  const handleOpenDetail = (exp: Expense) => {
    setSelectedExpense(exp);
    setEditTitle(exp.title);
    setEditAmount(exp.amount.toString());
    setEditNote(exp.note || '');
    setEditCategory(exp.category);
    setIsEditing(false);
  };

  const handleSaveEdit = () => {
    if (!selectedExpense) return;
    const num = parseFloat(editAmount);
    if (isNaN(num) || num <= 0) return;

    updateExpense(selectedExpense.id, {
      title: editTitle.trim() || selectedExpense.title,
      amount: num,
      note: editNote,
      category: editCategory,
    });
    setSelectedExpense(null);
  };

  const handleDelete = () => {
    if (!selectedExpense) return;
    deleteExpense(selectedExpense.id);
    setSelectedExpense(null);
  };

  return (
    <div className="flex flex-col gap-4 pb-28 md:pb-12 max-w-2xl mx-auto w-full px-4 pt-3">
      {/* Search & Filter Header Section */}
      <section className="bg-white rounded-2xl p-3.5 shadow-elevation-1 border border-[#eff4ff] flex flex-col gap-3">
        {/* Search Input Bar */}
        <div className="relative w-full">
          <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-[#005c55] text-[22px]">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search merchant, category, note, or amount..."
            className="w-full pl-11 pr-10 py-2.5 h-[48px] bg-[#eff4ff] border border-[#bdc9c6]/50 rounded-xl font-sans text-[14px] text-[#0b1c30] placeholder-[#6e7977] focus:outline-none focus:border-[#005c55] focus:ring-2 focus:ring-[#005c55]/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6e7977] hover:text-[#0b1c30] p-1 rounded-full hover:bg-[#dce9ff]"
              title="Clear search"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
        </div>

        {/* Date Range Presets */}
        <div className="flex flex-col gap-1.5 pt-1">
          <div className="flex items-center justify-between px-1">
            <span className="text-[11px] font-semibold text-[#6e7977] uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">calendar_month</span>
              Date Range
            </span>
            {datePreset === 'custom' && (
              <button
                onClick={() => setShowCustomDateInputs(!showCustomDateInputs)}
                className="text-[11px] text-[#005c55] font-semibold hover:underline flex items-center gap-0.5"
              >
                {showCustomDateInputs ? 'Hide Custom Picker' : 'Show Custom Picker'}
              </button>
            )}
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
            {[
              { id: 'all', label: 'All Time' },
              { id: 'today', label: 'Today' },
              { id: 'week', label: 'Last 7 Days' },
              { id: 'month', label: 'This Month' },
              { id: 'custom', label: 'Custom Range' },
            ].map((preset) => {
              const isSelected = datePreset === preset.id;
              return (
                <button
                  key={preset.id}
                  onClick={() => {
                    setDatePreset(preset.id as DateRangePreset);
                    if (preset.id === 'custom') {
                      setShowCustomDateInputs(true);
                    } else {
                      setShowCustomDateInputs(false);
                    }
                  }}
                  className={`shrink-0 h-[32px] px-3 rounded-lg font-sans text-[12px] font-medium transition-all ${
                    isSelected
                      ? 'bg-[#005c55] text-white font-semibold shadow-xs'
                      : 'bg-[#eff4ff] text-[#3e4947] hover:bg-[#e5eeff]'
                  }`}
                >
                  {preset.label}
                </button>
              );
            })}
          </div>

          {/* Custom Date Range Pickers */}
          {(datePreset === 'custom' || showCustomDateInputs) && (
            <div className="mt-1 p-2.5 bg-[#f8f9ff] rounded-xl border border-[#bdc9c6]/40 grid grid-cols-1 sm:grid-cols-2 gap-2 animate-in fade-in">
              <div>
                <label className="text-[11px] font-semibold text-[#6e7977] uppercase block mb-1">
                  From Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setDatePreset('custom');
                  }}
                  className="w-full px-2.5 py-1.5 bg-white border border-[#bdc9c6] rounded-lg text-[13px] text-[#0b1c30] focus:ring-1 focus:ring-[#005c55] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[#6e7977] uppercase block mb-1">
                  To Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setDatePreset('custom');
                  }}
                  className="w-full px-2.5 py-1.5 bg-white border border-[#bdc9c6] rounded-lg text-[13px] text-[#0b1c30] focus:ring-1 focus:ring-[#005c55] focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Category Filter Chips */}
        <div className="flex flex-col gap-1.5 pt-1 border-t border-[#eff4ff]">
          <div className="px-1 text-[11px] font-semibold text-[#6e7977] uppercase tracking-wider flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">category</span>
            Categories
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar -mx-1 px-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`shrink-0 h-[34px] px-3.5 rounded-full font-sans text-[12px] font-semibold uppercase tracking-wider flex items-center transition-all ${
                selectedCategory === 'all'
                  ? 'bg-[#0f766e] text-[#a3faef] shadow-sm'
                  : 'bg-white border border-[#bdc9c6]/60 text-[#0b1c30] hover:bg-[#eff4ff]'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`shrink-0 h-[34px] px-3.5 rounded-full font-sans text-[12px] font-semibold tracking-wider flex items-center gap-1.5 transition-all ${
                    isSelected
                      ? 'bg-[#0f766e] text-white shadow-sm'
                      : 'bg-white border border-[#bdc9c6]/60 text-[#0b1c30] hover:bg-[#eff4ff]'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">{cat.icon}</span>
                  <span>{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Filter Summary & Refresh / Download Bar */}
      <div className="flex flex-wrap justify-between items-center px-1 text-xs gap-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[#3e4947] font-medium">
            Showing <strong className="text-[#0b1c30]">{filteredExpenses.length}</strong>{' '}
            transaction{filteredExpenses.length !== 1 ? 's' : ''}
          </span>
          <span className="text-[#bdc9c6]">•</span>
          <span className="text-[#005c55] font-semibold">
            Total: {formatCurrency(totalFilteredAmount)}
          </span>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="text-[#ba1a1a] hover:underline flex items-center gap-0.5 ml-1 font-semibold"
            >
              <span className="material-symbols-outlined text-[14px]">filter_alt_off</span>
              Clear Filters
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowDownloadModal(true)}
            className="flex items-center gap-1 px-2.5 py-1 bg-[#005c55] hover:bg-[#004d47] text-white font-bold rounded-lg shadow-xs transition-all active:scale-95"
            title="Download CSV, JSON, or statement"
          >
            <span className="material-symbols-outlined text-[16px]">file_download</span>
            <span>Download</span>
          </button>

          <button
            onClick={triggerSync}
            className="flex items-center gap-1 text-[#005c55] font-semibold hover:underline p-1"
            title="Refresh transactions"
          >
            <span className={`material-symbols-outlined text-[16px] ${syncStatus === 'syncing' ? 'animate-spin' : ''}`}>
              refresh
            </span>
          </button>
        </div>
      </div>

      {/* Expense List Grouped by Date */}
      {groupedExpenses.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-elevation-1 border border-[#eff4ff] flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-[#eff4ff] flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-[32px] text-[#6e7977]">
              search_off
            </span>
          </div>
          <p className="font-display text-[16px] font-semibold text-[#0b1c30]">
            No matching transactions found
          </p>
          <p className="font-sans text-[13px] text-[#6e7977] mt-1 max-w-xs">
            {hasActiveFilters
              ? 'Try relaxing your search terms, choosing a different category, or broadening your date range.'
              : 'No transactions logged yet.'}
          </p>
          {hasActiveFilters && (
            <button
              onClick={handleResetFilters}
              className="mt-4 px-4 py-2 bg-[#005c55] text-white text-[13px] font-semibold rounded-xl hover:bg-[#0f766e] transition-colors"
            >
              Reset All Filters
            </button>
          )}
        </div>
      ) : (
        groupedExpenses.map((group) => (
          <section key={group.label} className="flex flex-col gap-2">
            <h2 className="font-sans text-[12px] font-semibold text-[#6e7977] uppercase tracking-widest pl-2">
              {group.label}
            </h2>
            <div className="bg-white rounded-2xl shadow-elevation-1 border border-[#eff4ff] overflow-hidden flex flex-col divide-y divide-[#eff4ff]">
              {group.items.map((item) => {
                const catObj = categories.find((c) => c.id.toLowerCase() === item.category.toLowerCase());
                return (
                  <div
                    key={item.id}
                    onClick={() => handleOpenDetail(item)}
                    className="flex items-center p-3.5 min-h-[68px] hover:bg-[#eff4ff]/60 active:bg-[#e5eeff] transition-colors cursor-pointer group"
                  >
                    {/* Category Icon */}
                    <div
                      className={`w-11 h-11 rounded-full flex items-center justify-center shrink-0 mr-3.5 ${
                        catObj?.bgClass || 'bg-[#e5eeff]'
                      } ${catObj?.iconColorClass || 'text-[#005c55]'}`}
                    >
                      <span className="material-symbols-outlined fill-1 text-[22px]">
                        {catObj?.icon || 'payments'}
                      </span>
                    </div>

                    {/* Merchant / Title & Details */}
                    <div className="flex-grow flex flex-col justify-center overflow-hidden pr-2">
                      <span className="font-sans text-[15px] font-semibold text-[#0b1c30] truncate group-hover:text-[#005c55] transition-colors">
                        {item.title}
                      </span>
                      <span className="font-sans text-[12px] text-[#6e7977] truncate">
                        {catObj?.name || 'General'}{' '}
                        {item.note ? `• ${item.note}` : ''}
                      </span>
                    </div>

                    {/* Amount & Mode */}
                    <div className="shrink-0 text-right">
                      <span className="font-display text-[16px] sm:text-[17px] font-bold text-[#0b1c30] block">
                        {formatCurrency(item.amount)}
                      </span>
                      <span className="font-sans text-[11px] font-semibold text-[#6e7977] uppercase block mt-0.5 tracking-wider">
                        {item.paymentMode}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))
      )}

      {/* End of list */}
      <div className="flex justify-center pt-3 pb-8">
        <p className="font-sans text-[12px] text-[#6e7977]">
          End of transactions list
        </p>
      </div>

      {/* Transaction Details & Edit Modal */}
      {selectedExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-2xl border border-[#bdc9c6]/40 flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-[#eff4ff] pb-3">
              <h3 className="font-display text-[18px] font-bold text-[#0b1c30]">
                {isEditing ? 'Edit Transaction' : 'Transaction Details'}
              </h3>
              <button
                onClick={() => setSelectedExpense(null)}
                className="text-[#6e7977] hover:text-[#0b1c30] p-1 rounded-full hover:bg-[#eff4ff]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {isEditing ? (
              <div className="flex flex-col gap-3">
                <div>
                  <label className="text-[12px] font-semibold text-[#6e7977] uppercase block mb-1">
                    Merchant Name / Title
                  </label>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-[#bdc9c6] rounded-xl text-[14px] focus:ring-2 focus:ring-[#005c55] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-[#6e7977] uppercase block mb-1">
                    Category
                  </label>
                  <select
                    value={editCategory}
                    onChange={(e) => setEditCategory(e.target.value)}
                    className="w-full px-3 py-2 border border-[#bdc9c6] rounded-xl text-[14px] bg-white focus:ring-2 focus:ring-[#005c55] focus:outline-none"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-[#6e7977] uppercase block mb-1">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={editAmount}
                    onChange={(e) => setEditAmount(e.target.value)}
                    className="w-full px-3 py-2 border border-[#bdc9c6] rounded-xl text-[14px] font-bold focus:ring-2 focus:ring-[#005c55] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-[#6e7977] uppercase block mb-1">
                    Note / Details
                  </label>
                  <textarea
                    rows={2}
                    value={editNote}
                    onChange={(e) => setEditNote(e.target.value)}
                    className="w-full px-3 py-2 border border-[#bdc9c6] rounded-xl text-[13px] focus:ring-2 focus:ring-[#005c55] focus:outline-none"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 py-2.5 bg-[#005c55] text-white rounded-xl font-semibold text-[14px]"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-4 py-2.5 bg-[#eff4ff] text-[#3e4947] rounded-xl font-semibold text-[14px]"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between bg-[#eff4ff] p-3 rounded-xl">
                  <div>
                    <span className="text-[12px] text-[#6e7977] uppercase block">Amount</span>
                    <span className="font-display text-[22px] font-bold text-[#005c55]">
                      {formatCurrency(selectedExpense.amount)}
                    </span>
                  </div>
                  <span className="px-3 py-1 bg-white text-[#005c55] text-[12px] font-bold rounded-full border border-[#bdc9c6]/40">
                    {selectedExpense.paymentMode}
                  </span>
                </div>

                <div className="text-[14px] space-y-2 text-[#3e4947]">
                  <p>
                    <strong className="text-[#0b1c30]">Merchant / Title:</strong> {selectedExpense.title}
                  </p>
                  <p>
                    <strong className="text-[#0b1c30]">Category:</strong>{' '}
                    {categories.find((c) => c.id.toLowerCase() === selectedExpense.category.toLowerCase())?.name || selectedExpense.category}
                  </p>
                  <p>
                    <strong className="text-[#0b1c30]">Date & Time:</strong> {selectedExpense.date} at{' '}
                    {selectedExpense.time}
                  </p>
                  {selectedExpense.note && (
                    <p className="bg-[#f8f9ff] p-2.5 rounded-lg border border-[#bdc9c6]/30 text-[13px]">
                      <strong className="text-[#0b1c30] block mb-0.5">Note:</strong> {selectedExpense.note}
                    </p>
                  )}
                </div>

                <div className="flex gap-2 pt-2 border-t border-[#eff4ff]">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 py-2.5 bg-[#e5eeff] hover:bg-[#dce9ff] text-[#005c55] font-semibold text-[14px] rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">edit</span>
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2.5 bg-[#ffdad6] hover:bg-[#ffb690] text-[#ba1a1a] font-semibold text-[14px] rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Download Expenses Modal */}
      <DownloadExpensesModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
        filteredExpenses={filteredExpenses}
      />
    </div>
  );
};

