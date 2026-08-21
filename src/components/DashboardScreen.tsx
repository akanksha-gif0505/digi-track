import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { CategorySpendingGraph } from './CategorySpendingGraph';
import { DownloadExpensesModal } from './DownloadExpensesModal';

export const DashboardScreen: React.FC = () => {
  const {
    expenses,
    budget,
    savingsConfig,
    totalSpentThisMonth,
    remainingBudget,
    budgetPercentage,
    spendableBudget,
    remainingSpendableBudget,
    savingsIntactAmount,
    savingsBreachedAmount,
    deficitAmount,
    savingsHealth,
    savingsPercentagePreserved,
    categoryBreakdown,
    formatCurrency,
    userProfile,
    setActiveTab,
  } = useExpense();

  const [showDownloadModal, setShowDownloadModal] = useState<boolean>(false);

  // Sort and pick recent expenses (top 5)
  const recentExpenses = expenses.slice(0, 5);

  // Group top categories for stacked bar
  const activeCategories = categoryBreakdown.filter((c) => c.total > 0);
  const displayCategories = activeCategories.length > 0
    ? activeCategories.slice(0, 4)
    : categoryBreakdown.slice(0, 4);

  return (
    <div className="flex flex-col gap-4 pb-28 md:pb-12 max-w-2xl mx-auto w-full px-4 pt-4">
      {/* Critical Savings Breached / Deficit Alert on Dashboard */}
      {savingsHealth === 'deficit' && (
        <div
          onClick={() => setActiveTab('savings')}
          className="bg-[#ba1a1a] text-white rounded-2xl p-4 shadow-elevation-2 border border-[#ba1a1a] flex items-start gap-3 cursor-pointer hover:opacity-95 transition-opacity"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px] text-white">emergency_home</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-[15px] font-bold">SALARY & SAVINGS DEPLETED!</h3>
              <span className="text-[10px] uppercase font-bold bg-white text-[#ba1a1a] px-2 py-0.5 rounded-full">
                View Vault
              </span>
            </div>
            <p className="text-[12px] mt-1 opacity-95">
              You've spent {formatCurrency(totalSpentThisMonth)}, draining your ₹{savingsConfig.monthlySavingsGoal.toLocaleString('en-IN')} savings and creating a {formatCurrency(deficitAmount)} deficit. Tap to manage.
            </p>
          </div>
        </div>
      )}

      {savingsHealth === 'breached' && (
        <div
          onClick={() => setActiveTab('savings')}
          className="bg-gradient-to-r from-[#ba1a1a] to-[#d93838] text-white rounded-2xl p-4 shadow-elevation-2 border border-[#ba1a1a]/30 flex items-start gap-3 cursor-pointer hover:opacity-95 transition-opacity"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px] text-white">warning</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-[15px] font-bold">SAVINGS VAULT BREACHED!</h3>
              <span className="text-[10px] uppercase font-bold bg-white text-[#ba1a1a] px-2 py-0.5 rounded-full">
                View Vault
              </span>
            </div>
            <p className="text-[12px] mt-1 opacity-95">
              Warning: Overspending by {formatCurrency(totalSpentThisMonth - spendableBudget)} is eating into your locked {formatCurrency(savingsConfig.monthlySavingsGoal)} savings vault! Only {formatCurrency(savingsIntactAmount)} remains safe. Tap to inspect.
            </p>
          </div>
        </div>
      )}

      {/* 1. Protected Savings & Spendable Limit (Hero Card on Dashboard) */}
      <section
        onClick={() => setActiveTab('savings')}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#003833] via-[#005c55] to-[#0f766e] text-white p-4 sm:p-5 shadow-elevation-2 border border-[#0f766e]/40 cursor-pointer hover:shadow-lg transition-all group"
      >
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-black/25 rounded-full border border-white/20">
            <span className="material-symbols-outlined text-[14px] text-[#a3faef]">shield_locked</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#a3faef]">
              Protected Savings Vault
            </span>
          </div>
          <span className="text-[11px] text-white/80 group-hover:text-white flex items-center gap-0.5">
            Manage <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
          </span>
        </div>

        <div className="flex items-baseline justify-between mt-1">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-white/70 block">
              Untouched Savings
            </span>
            <h2 className="font-display text-[28px] sm:text-[32px] font-bold text-white tracking-tight leading-tight">
              {formatCurrency(savingsIntactAmount)}
            </h2>
          </div>
          <div className="text-right">
            <span className="text-[11px] text-white/70 block">Monthly Goal</span>
            <span className="text-[14px] font-bold text-[#a3faef]">
              {formatCurrency(savingsConfig.monthlySavingsGoal)} ({savingsPercentagePreserved}%)
            </span>
          </div>
        </div>

        {/* Proportional Spendable Progress Bar */}
        <div className="w-full h-2 bg-black/30 rounded-full overflow-hidden mt-3 p-0.5 border border-white/15">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              savingsPercentagePreserved === 100
                ? 'bg-gradient-to-r from-[#a3faef] to-[#34d399]'
                : 'bg-[#ba1a1a]'
            }`}
            style={{ width: `${savingsPercentagePreserved}%` }}
          />
        </div>

        <div className="flex justify-between text-[11px] font-medium text-white/80 mt-1.5">
          <span>Spendable limit: {formatCurrency(spendableBudget)}</span>
          <span className={remainingSpendableBudget > 0 ? 'text-[#a3faef] font-bold' : 'text-[#ffdad6] font-bold'}>
            {remainingSpendableBudget > 0 ? `${formatCurrency(remainingSpendableBudget)} spendable left` : 'Over budget!'}
          </span>
        </div>
      </section>

      {/* 2. Total Spending Card */}
      <section className="bg-white shadow-elevation-1 rounded-2xl p-4 sm:p-5 flex flex-col gap-1 border border-[#eff4ff] transition-all hover:border-[#bdc9c6]">
        <span className="font-sans text-[12px] font-semibold text-[#6e7977] uppercase tracking-wider">
          Current Month Spending
        </span>
        <div className="flex items-end justify-between mt-1">
          <h2 className="font-display text-[30px] sm:text-[34px] leading-tight font-bold text-[#0b1c30] tracking-tight">
            {formatCurrency(totalSpentThisMonth)}
          </h2>
          <div className="text-right">
            <span className="text-[11px] text-[#6e7977] block">Out of Salary</span>
            <span className="font-sans text-[14px] font-bold text-[#005c55]">
              {formatCurrency(savingsConfig.monthlySalary)}
            </span>
          </div>
        </div>
      </section>

      {/* Quick Action Shortcuts */}
      <section className="grid grid-cols-4 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('savings')}
          className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-white border border-[#eff4ff] shadow-elevation-1 hover:border-[#005c55] hover:bg-[#eff4ff]/60 active:scale-95 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#005c55]/10 text-[#005c55] flex items-center justify-center mb-1 group-hover:bg-[#005c55] group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">savings</span>
          </div>
          <span className="text-[11px] font-bold text-[#0b1c30]">Savings</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('add')}
          className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-white border border-[#eff4ff] shadow-elevation-1 hover:border-[#005c55] hover:bg-[#eff4ff]/60 active:scale-95 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#005c55]/10 text-[#005c55] flex items-center justify-center mb-1 group-hover:bg-[#005c55] group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">add_circle</span>
          </div>
          <span className="text-[11px] font-bold text-[#0b1c30]">Add Spend</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('split')}
          className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-white border border-[#eff4ff] shadow-elevation-1 hover:border-[#005c55] hover:bg-[#eff4ff]/60 active:scale-95 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#004eaa]/10 text-[#004eaa] flex items-center justify-center mb-1 group-hover:bg-[#004eaa] group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">call_split</span>
          </div>
          <span className="text-[11px] font-bold text-[#0b1c30]">Split Bill</span>
        </button>

        <button
          type="button"
          onClick={() => setShowDownloadModal(true)}
          className="flex flex-col items-center justify-center p-2.5 sm:p-3 rounded-2xl bg-white border border-[#eff4ff] shadow-elevation-1 hover:border-[#005c55] hover:bg-[#eff4ff]/60 active:scale-95 transition-all group"
        >
          <div className="w-9 h-9 rounded-xl bg-[#fd761a]/10 text-[#fd761a] flex items-center justify-center mb-1 group-hover:bg-[#fd761a] group-hover:text-white transition-colors">
            <span className="material-symbols-outlined text-[20px]">download</span>
          </div>
          <span className="text-[11px] font-bold text-[#0b1c30]">Download</span>
        </button>
      </section>

      {/* 3. Categorized Spending Graph */}
      <CategorySpendingGraph />

      {/* 5. Recent Activity */}
      <section className="flex flex-col gap-2 mt-1">
        <div className="flex justify-between items-center px-1">
          <span className="font-display text-[18px] sm:text-[20px] font-semibold text-[#0b1c30]">
            Recent Activity
          </span>
          <button
            onClick={() => setActiveTab('history')}
            className="font-sans text-[12px] font-semibold text-[#005c55] uppercase tracking-wider hover:underline"
          >
            View All
          </button>
        </div>

        <div className="bg-white shadow-elevation-1 rounded-2xl p-2 border border-[#eff4ff] flex flex-col divide-y divide-[#eff4ff]">
          {recentExpenses.length === 0 ? (
            <div className="py-8 text-center text-[#6e7977] text-[14px]">
              No expenses recorded yet. Tap + to add one!
            </div>
          ) : (
            recentExpenses.map((expense) => {
              const catObj = categoryBreakdown.find((c) => c.category.id === expense.category)?.category;
              return (
                <div
                  key={expense.id}
                  onClick={() => setActiveTab('history')}
                  className="flex items-center justify-between min-h-[56px] p-2.5 hover:bg-[#eff4ff]/60 active:bg-[#e5eeff] transition-colors rounded-xl cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        catObj?.bgClass || 'bg-[#e5eeff]'
                      } ${catObj?.iconColorClass || 'text-[#005c55]'}`}
                    >
                      <span className="material-symbols-outlined fill-1 text-[20px]">
                        {catObj?.icon || 'payments'}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-sans text-[14px] sm:text-[15px] text-[#0b1c30] font-semibold leading-tight group-hover:text-[#005c55] transition-colors">
                        {expense.title}
                      </span>
                      <span className="font-sans text-[12px] text-[#6e7977] mt-0.5">
                        {expense.date} • {expense.time}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-sans text-[15px] sm:text-[16px] font-semibold text-[#0b1c30] block">
                      -{formatCurrency(expense.amount)}
                    </span>
                    <span className="font-sans text-[10px] text-[#6e7977] uppercase font-semibold">
                      {expense.paymentMode}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Floating Action Button (FAB) on Mobile */}
      <button
        onClick={() => setActiveTab('add')}
        aria-label="Add Expense"
        className="fixed bottom-20 md:bottom-8 right-5 bg-[#005c55] hover:bg-[#0f766e] text-white w-14 h-14 rounded-full flex items-center justify-center shadow-elevation-2 z-40 active:scale-95 transition-all duration-150 focus:outline-none focus:ring-4 focus:ring-[#005c55]/20"
      >
        <span className="material-symbols-outlined text-[30px]">add</span>
      </button>

      {/* Download Expenses Modal */}
      <DownloadExpensesModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />
    </div>
  );
};

