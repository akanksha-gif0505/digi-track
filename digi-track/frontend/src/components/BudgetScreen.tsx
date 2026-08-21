import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';

export const BudgetScreen: React.FC = () => {
  const {
    budget,
    updateBudget,
    updateCategoryCap,
    categoryBreakdown,
    totalSpentThisMonth,
    budgetPercentage,
    safeSpendToday,
    formatCurrency,
    categories,
    addCategory,
  } = useExpense();

  const [showEditTotalModal, setShowEditTotalModal] = useState(false);
  const [newTotalBudget, setNewTotalBudget] = useState(budget.totalMonthlyBudget.toString());

  const [selectedCategoryCap, setSelectedCategoryCap] = useState<{ id: string; name: string; currentCap: number } | null>(null);
  const [newCategoryCapVal, setNewCategoryCapVal] = useState('');

  const [showAddCapModal, setShowAddCapModal] = useState(false);
  const [newCatName, setNewCatName] = useState('');
  const [newCatCap, setNewCatCap] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('category');

  const handleSaveTotalBudget = () => {
    const val = parseFloat(newTotalBudget);
    if (!isNaN(val) && val > 0) {
      updateBudget({ totalMonthlyBudget: val });
      setShowEditTotalModal(false);
    }
  };

  const handleSaveCategoryCap = () => {
    if (!selectedCategoryCap) return;
    const val = parseFloat(newCategoryCapVal);
    if (!isNaN(val) && val >= 0) {
      updateCategoryCap(selectedCategoryCap.id, val);
      setSelectedCategoryCap(null);
    }
  };

  const handleCreateNewCategory = () => {
    if (!newCatName.trim()) return;
    const cap = parseFloat(newCatCap) || 5000;
    addCategory({
      name: newCatName.trim(),
      icon: newCatIcon,
      bgClass: 'bg-[#eff4ff]',
      iconColorClass: 'text-[#005c55]',
      badgeBgClass: 'bg-[#e5eeff]',
      badgeTextClass: 'text-[#005c55]',
      colorHex: '#005c55',
      defaultCap: cap,
    });
    setShowAddCapModal(false);
    setNewCatName('');
    setNewCatCap('');
  };

  return (
    <div className="flex flex-col gap-4 pb-28 md:pb-12 max-w-2xl mx-auto w-full px-4 pt-3">
      {/* Header / Month Selector */}
      <div className="flex justify-between items-center mb-1">
        <h1 className="font-display text-[20px] sm:text-[22px] font-bold text-[#0b1c30]">
          Monthly Budget
        </h1>
        <div className="flex items-center gap-1 px-3.5 py-1.5 bg-white border border-[#bdc9c6]/50 rounded-full text-[#005c55] shadow-xs text-[12px] font-semibold uppercase tracking-wider">
          <span>{budget.selectedMonth}</span>
          <span className="material-symbols-outlined text-[18px]">
            arrow_drop_down
          </span>
        </div>
      </div>

      {/* 1. Total Budget Card */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-elevation-1 border border-[#eff4ff] flex flex-col gap-3">
        <div className="flex justify-between items-start">
          <div>
            <span className="font-sans text-[12px] font-semibold text-[#6e7977] uppercase tracking-wider block mb-1">
              Total Spent
            </span>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[30px] sm:text-[34px] font-bold text-[#0b1c30] tracking-tight">
                {formatCurrency(totalSpentThisMonth)}
              </span>
              <span className="font-sans text-[14px] text-[#6e7977]">
                of {formatCurrency(budget.totalMonthlyBudget)}
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setNewTotalBudget(budget.totalMonthlyBudget.toString());
              setShowEditTotalModal(true);
            }}
            aria-label="Edit Budget"
            className="w-10 h-10 rounded-full flex items-center justify-center text-[#005c55] bg-[#005c55]/10 hover:bg-[#005c55]/20 transition-colors"
          >
            <span className="material-symbols-outlined text-[20px]">edit</span>
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full h-2.5 bg-[#d3e4fe]/60 rounded-full overflow-hidden relative">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              budgetPercentage >= 100
                ? 'bg-[#ba1a1a]'
                : budgetPercentage >= 85
                ? 'bg-[#fd761a]'
                : 'bg-[#005c55]'
            }`}
            style={{ width: `${Math.min(100, budgetPercentage)}%` }}
          />
        </div>

        {/* Safe to spend daily highlight */}
        <div className="flex justify-between items-center pt-2.5 border-t border-[#eff4ff]">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#0f766e] animate-pulse" />
            <span className="font-sans text-[13px] text-[#3e4947] font-medium">
              Safe to spend today
            </span>
          </div>
          <span className="font-display text-[16px] font-bold text-[#005c55]">
            {formatCurrency(safeSpendToday)}
          </span>
        </div>
      </div>

      {/* 2. Category Limits Section */}
      <div>
        <div className="flex justify-between items-center mb-2.5 mt-2">
          <h2 className="font-display text-[18px] sm:text-[20px] font-semibold text-[#0b1c30]">
            Category Limits
          </h2>
          <span className="text-[12px] text-[#6e7977] font-medium">
            Tap card to modify cap
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {categoryBreakdown.map((item) => {
            const percentageUsed = item.cap > 0 ? Math.round((item.total / item.cap) * 100) : 0;
            const isOver = item.status === 'over';
            const isWarning = item.status === 'warning';

            return (
              <div
                key={item.category.id}
                onClick={() => {
                  setSelectedCategoryCap({
                    id: item.category.id,
                    name: item.category.name,
                    currentCap: item.cap,
                  });
                  setNewCategoryCapVal(item.cap.toString());
                }}
                className={`bg-white rounded-2xl p-4 shadow-elevation-1 transition-all cursor-pointer hover:border-[#005c55] border ${
                  isOver
                    ? 'border-[#ba1a1a]/30 bg-[#fff5f5]'
                    : isWarning
                    ? 'border-[#fd761a]/30'
                    : 'border-[#eff4ff]'
                }`}
              >
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center ${
                        isOver
                          ? 'bg-[#ffdad6] text-[#ba1a1a]'
                          : isWarning
                          ? 'bg-[#ffdbca] text-[#9d4300]'
                          : item.category.bgClass
                      } ${
                        isOver ? 'text-[#ba1a1a]' : isWarning ? 'text-[#9d4300]' : item.category.iconColorClass
                      }`}
                    >
                      <span className="material-symbols-outlined fill-1 text-[18px]">
                        {item.category.icon}
                      </span>
                    </div>
                    <span
                      className={`font-sans text-[15px] font-semibold ${
                        isOver ? 'text-[#ba1a1a]' : 'text-[#0b1c30]'
                      }`}
                    >
                      {item.category.name}
                    </span>
                  </div>
                  <span
                    className={`font-display text-[15px] sm:text-[16px] font-bold ${
                      isOver
                        ? 'text-[#ba1a1a]'
                        : isWarning
                        ? 'text-[#9d4300]'
                        : 'text-[#0b1c30]'
                    }`}
                  >
                    {formatCurrency(item.total)}
                  </span>
                </div>

                {/* Progress bar */}
                <div
                  className={`w-full h-2 rounded-full overflow-hidden mb-1.5 ${
                    isOver ? 'bg-[#ffdad6]' : 'bg-[#eff4ff]'
                  }`}
                >
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isOver
                        ? 'bg-[#ba1a1a] w-full'
                        : isWarning
                        ? 'bg-[#fd761a]'
                        : 'bg-[#005c55]'
                    }`}
                    style={{
                      width: isOver ? '100%' : `${Math.min(100, percentageUsed)}%`,
                    }}
                  />
                </div>

                {/* Subtext info */}
                <div className="flex justify-between text-[11px] font-medium">
                  <span
                    className={
                      isOver
                        ? 'text-[#ba1a1a] font-semibold'
                        : isWarning
                        ? 'text-[#9d4300] font-semibold'
                        : 'text-[#6e7977]'
                    }
                  >
                    {isOver
                      ? `Over by ${formatCurrency(item.total - item.cap)}`
                      : `${percentageUsed}% used`}
                  </span>
                  <span className="text-[#6e7977]">
                    Cap: {formatCurrency(item.cap)}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Add Category Cap Button */}
          <button
            onClick={() => setShowAddCapModal(true)}
            className="bg-[#eff4ff]/60 hover:bg-[#eff4ff] border-2 border-dashed border-[#bdc9c6] rounded-2xl p-4 flex items-center justify-center gap-2 text-[#005c55] transition-all min-h-[96px] font-sans font-semibold text-[14px] active:scale-98"
          >
            <span className="material-symbols-outlined text-[22px]">add</span>
            <span>Add Category Cap</span>
          </button>
        </div>
      </div>

      {/* Edit Total Budget Modal */}
      {showEditTotalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-xs p-5 shadow-xl border border-[#bdc9c6]/40 flex flex-col gap-4">
            <h3 className="font-display text-[17px] font-bold text-[#0b1c30]">
              Edit Monthly Budget Target
            </h3>
            <div>
              <label className="text-[12px] font-semibold text-[#6e7977] uppercase block mb-1">
                Total Budget (INR)
              </label>
              <input
                type="number"
                value={newTotalBudget}
                onChange={(e) => setNewTotalBudget(e.target.value)}
                className="w-full p-3 border border-[#bdc9c6] rounded-xl font-display text-[18px] font-bold text-[#0b1c30] focus:ring-2 focus:ring-[#005c55] focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowEditTotalModal(false)}
                className="flex-1 py-2.5 bg-[#eff4ff] text-[#3e4947] font-semibold text-[13px] rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveTotalBudget}
                className="flex-1 py-2.5 bg-[#005c55] text-white font-semibold text-[13px] rounded-xl"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Cap Modal */}
      {selectedCategoryCap && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-xs p-5 shadow-xl border border-[#bdc9c6]/40 flex flex-col gap-4">
            <h3 className="font-display text-[17px] font-bold text-[#0b1c30]">
              Edit Cap: {selectedCategoryCap.name}
            </h3>
            <div>
              <label className="text-[12px] font-semibold text-[#6e7977] uppercase block mb-1">
                Monthly Cap (INR)
              </label>
              <input
                type="number"
                value={newCategoryCapVal}
                onChange={(e) => setNewCategoryCapVal(e.target.value)}
                className="w-full p-3 border border-[#bdc9c6] rounded-xl font-display text-[18px] font-bold text-[#0b1c30] focus:ring-2 focus:ring-[#005c55] focus:outline-none"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategoryCap(null)}
                className="flex-1 py-2.5 bg-[#eff4ff] text-[#3e4947] font-semibold text-[13px] rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveCategoryCap}
                className="flex-1 py-2.5 bg-[#005c55] text-white font-semibold text-[13px] rounded-xl"
              >
                Update Cap
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Category Cap Modal */}
      {showAddCapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-xl border border-[#bdc9c6]/40 flex flex-col gap-3">
            <h3 className="font-display text-[17px] font-bold text-[#0b1c30]">
              Add Category Cap
            </h3>
            <div>
              <label className="text-[12px] font-semibold text-[#6e7977] uppercase block mb-1">
                Category Name
              </label>
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="e.g. Subscriptions, Healthcare"
                className="w-full px-3 py-2 border border-[#bdc9c6] rounded-xl text-[14px] focus:ring-2 focus:ring-[#005c55] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#6e7977] uppercase block mb-1">
                Monthly Cap (₹)
              </label>
              <input
                type="number"
                value={newCatCap}
                onChange={(e) => setNewCatCap(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full px-3 py-2 border border-[#bdc9c6] rounded-xl text-[14px] font-semibold focus:ring-2 focus:ring-[#005c55] focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[12px] font-semibold text-[#6e7977] uppercase block mb-1">
                Icon
              </label>
              <div className="flex gap-2 flex-wrap">
                {['local_hospital', 'subscriptions', 'fitness_center', 'school', 'pets', 'child_care', 'flight'].map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setNewCatIcon(ic)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                      newCatIcon === ic ? 'bg-[#0f766e] text-white border-[#0f766e]' : 'bg-[#eff4ff] text-[#3e4947] border-[#bdc9c6]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{ic}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              <button
                onClick={() => setShowAddCapModal(false)}
                className="flex-1 py-2.5 bg-[#eff4ff] text-[#3e4947] font-semibold text-[13px] rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateNewCategory}
                className="flex-1 py-2.5 bg-[#005c55] text-white font-semibold text-[13px] rounded-xl"
              >
                Create Cap
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
