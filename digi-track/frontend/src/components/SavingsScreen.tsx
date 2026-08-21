import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { SavingsGoal } from '../types';

export const SavingsScreen: React.FC = () => {
  const {
    savingsConfig,
    updateSavingsConfig,
    addSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    totalSpentThisMonth,
    spendableBudget,
    remainingSpendableBudget,
    savingsIntactAmount,
    savingsBreachedAmount,
    deficitAmount,
    savingsHealth,
    savingsPercentagePreserved,
    safeSpendToday,
    formatCurrency,
    setActiveTab,
    expenses,
    budget,
  } = useExpense();

  // Salary & Savings Edit Modal State
  const [showEditConfigModal, setShowEditConfigModal] = useState(false);
  const [salaryInput, setSalaryInput] = useState(savingsConfig.monthlySalary.toString());
  const [savingsGoalInput, setSavingsGoalInput] = useState(savingsConfig.monthlySavingsGoal.toString());
  const [emergencyReserveInput, setEmergencyReserveInput] = useState(savingsConfig.emergencyFundReserve.toString());
  const [lockToggle, setLockToggle] = useState(savingsConfig.savingsLockEnabled);

  // Sub-goal Modal State
  const [showAddGoalModal, setShowAddGoalModal] = useState(false);
  const [goalName, setGoalName] = useState('');
  const [goalTarget, setGoalTarget] = useState('');
  const [goalCurrent, setGoalCurrent] = useState('');
  const [goalDate, setGoalDate] = useState('');
  const [goalCategory, setGoalCategory] = useState<'emergency' | 'vacation' | 'investment' | 'purchase' | 'general'>('general');
  const [goalIcon, setGoalIcon] = useState('savings');

  // Edit Sub-goal State
  const [selectedGoal, setSelectedGoal] = useState<SavingsGoal | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [showDepositModal, setShowDepositModal] = useState(false);

  // What-If Simulator State
  const [simPurchaseAmount, setSimPurchaseAmount] = useState('');

  // Handle Save Configuration
  const handleSaveConfig = () => {
    const s = parseFloat(salaryInput);
    const g = parseFloat(savingsGoalInput);
    const e = parseFloat(emergencyReserveInput) || 0;

    if (isNaN(s) || s <= 0) {
      alert('Please enter a valid monthly salary greater than 0');
      return;
    }
    if (isNaN(g) || g < 0) {
      alert('Please enter a valid savings goal (0 or more)');
      return;
    }
    if (g > s) {
      alert('Monthly savings goal cannot be higher than your total salary');
      return;
    }

    updateSavingsConfig({
      monthlySalary: s,
      monthlySavingsGoal: g,
      emergencyFundReserve: e,
      savingsLockEnabled: lockToggle,
    });
    setShowEditConfigModal(false);
  };

  // Quick Preset Handlers (e.g. 20%, 30%, 33.3%, 50%)
  const applyPresetPercentage = (pct: number) => {
    const s = parseFloat(salaryInput) || savingsConfig.monthlySalary;
    const g = Math.round((s * pct) / 100);
    setSavingsGoalInput(g.toString());
  };

  // Handle Create Sub-Goal
  const handleCreateGoal = () => {
    if (!goalName.trim()) return;
    const target = parseFloat(goalTarget);
    if (isNaN(target) || target <= 0) {
      alert('Please enter a valid target amount');
      return;
    }
    const current = parseFloat(goalCurrent) || 0;

    addSavingsGoal({
      name: goalName.trim(),
      targetAmount: target,
      currentAmount: current,
      targetDate: goalDate || undefined,
      category: goalCategory,
      icon: goalIcon,
    });

    setShowAddGoalModal(false);
    setGoalName('');
    setGoalTarget('');
    setGoalCurrent('');
    setGoalDate('');
  };

  // Handle Deposit to Goal
  const handleGoalDeposit = () => {
    if (!selectedGoal) return;
    const amt = parseFloat(depositAmount);
    if (isNaN(amt) || amt <= 0) return;

    updateSavingsGoal(selectedGoal.id, {
      currentAmount: selectedGoal.currentAmount + amt,
    });
    setShowDepositModal(false);
    setSelectedGoal(null);
    setDepositAmount('');
  };

  // Month stats for burn rate
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const currentDay = now.getDate();
  const daysRemaining = Math.max(1, daysInMonth - currentDay + 1);

  // Projected spending at current velocity
  const avgDailySpent = currentDay > 0 ? totalSpentThisMonth / currentDay : 0;
  const projectedMonthEndSpent = Math.round(avgDailySpent * daysInMonth);
  const projectedSavings = Math.max(0, savingsConfig.monthlySalary - projectedMonthEndSpent);

  // Simulation calculation
  const simAmountNum = parseFloat(simPurchaseAmount) || 0;
  const simNewTotal = totalSpentThisMonth + simAmountNum;
  const simWouldBreach = simNewTotal > spendableBudget;
  const simBreachedAmount = simWouldBreach ? Math.min(savingsConfig.monthlySavingsGoal, simNewTotal - spendableBudget) : 0;
  const simWouldDeficit = simNewTotal > savingsConfig.monthlySalary;

  return (
    <div className="flex flex-col gap-4 pb-28 md:pb-12 max-w-2xl mx-auto w-full px-4 pt-3">
      {/* Header with Quick Actions */}
      <div className="flex justify-between items-center mb-1">
        <div>
          <h1 className="font-display text-[22px] sm:text-[24px] font-bold text-[#0b1c30] tracking-tight">
            Savings & Salary Vault
          </h1>
          <p className="font-sans text-[13px] text-[#6e7977]">
            Keep your saved money separate, protected, and track spendable limits.
          </p>
        </div>
        <button
          onClick={() => {
            setSalaryInput(savingsConfig.monthlySalary.toString());
            setSavingsGoalInput(savingsConfig.monthlySavingsGoal.toString());
            setEmergencyReserveInput(savingsConfig.emergencyFundReserve.toString());
            setLockToggle(savingsConfig.savingsLockEnabled);
            setShowEditConfigModal(true);
          }}
          className="flex items-center gap-1 px-3 py-1.5 bg-[#005c55]/10 hover:bg-[#005c55]/20 text-[#005c55] rounded-xl font-sans text-[12px] font-bold transition-all active:scale-95 shrink-0"
        >
          <span className="material-symbols-outlined text-[16px]">tune</span>
          <span>Edit Goals</span>
        </button>
      </div>

      {/* 1. CRITICAL ALERT / WARNING BANNER (When Savings Are Breached or Endangered) */}
      {savingsHealth === 'deficit' && (
        <div className="bg-[#ba1a1a] text-white rounded-2xl p-4 shadow-elevation-2 border border-[#ba1a1a] flex items-start gap-3 animate-pulse">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px] text-white">emergency_home</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-[15px] font-bold">SALARY & SAVINGS DEPLETED!</h3>
              <span className="text-[11px] uppercase tracking-wider font-extrabold bg-white text-[#ba1a1a] px-2 py-0.5 rounded-full">
                Deficit
              </span>
            </div>
            <p className="text-[13px] mt-1 opacity-95">
              You have spent <strong>{formatCurrency(totalSpentThisMonth)}</strong>, which exceeds your entire salary of {formatCurrency(savingsConfig.monthlySalary)}. You have drained 100% of your {formatCurrency(savingsConfig.monthlySavingsGoal)} savings vault and are in a deficit of <strong>{formatCurrency(deficitAmount)}</strong>!
            </p>
          </div>
        </div>
      )}

      {savingsHealth === 'breached' && (
        <div className="bg-gradient-to-r from-[#ba1a1a] to-[#d93838] text-white rounded-2xl p-4 shadow-elevation-2 border border-[#ba1a1a]/30 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[24px] text-white">warning</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-[15px] font-bold">SAVINGS VAULT BREACHED!</h3>
              <span className="text-[11px] uppercase tracking-wider font-extrabold bg-white text-[#ba1a1a] px-2 py-0.5 rounded-full">
                Eating into Savings
              </span>
            </div>
            <p className="text-[13px] mt-1 opacity-95">
              You exceeded your <strong>{formatCurrency(spendableBudget)}</strong> spendable budget! You are currently using <strong className="underline underline-offset-2">{formatCurrency(savingsBreachedAmount)}</strong> from your locked <strong>{formatCurrency(savingsConfig.monthlySavingsGoal)}</strong> savings vault. Only {formatCurrency(savingsIntactAmount)} remains safe.
            </p>
          </div>
        </div>
      )}

      {savingsHealth === 'borderline' && (
        <div className="bg-[#fff3e0] text-[#8f4a00] rounded-2xl p-4 shadow-elevation-1 border border-[#ffb74d] flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#ffe0b2] text-[#e65100] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[22px]">notification_important</span>
          </div>
          <div className="flex-1">
            <h3 className="font-display text-[14px] font-bold text-[#8f4a00]">Borderline Warning: Reaching Spendable Cap</h3>
            <p className="text-[12px] text-[#8f4a00]/90 mt-0.5">
              Only <strong>{formatCurrency(remainingSpendableBudget)}</strong> left in your spendable budget. Any further spending will start eating directly into your {formatCurrency(savingsConfig.monthlySavingsGoal)} savings!
            </p>
          </div>
        </div>
      )}

      {savingsHealth === 'caution' && (
        <div className="bg-[#eff4ff] text-[#004eaa] rounded-2xl p-3.5 shadow-elevation-1 border border-[#d8e2ff] flex items-center gap-3">
          <span className="material-symbols-outlined text-[22px] text-[#004eaa]">info</span>
          <p className="text-[12px] font-medium text-[#004eaa]">
            You have used over 75% of your discretionary spendable budget ({formatCurrency(totalSpentThisMonth)} / {formatCurrency(spendableBudget)}). {formatCurrency(savingsConfig.monthlySavingsGoal)} savings remain safely locked.
          </p>
        </div>
      )}

      {/* 2. PROTECTED SAVINGS VAULT (HERO CARD) */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#003833] via-[#005c55] to-[#0f766e] text-white p-5 sm:p-6 shadow-elevation-2 border border-[#0f766e]/40">
        {/* Decorative background watermarks */}
        <div className="absolute -right-8 -top-8 w-44 h-44 bg-white/5 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute right-3 bottom-3 opacity-10 pointer-events-none">
          <span className="material-symbols-outlined text-[110px]">shield_locked</span>
        </div>

        <div className="relative z-10 flex flex-col gap-4">
          {/* Top Lock Badge & Month Indicator */}
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2 px-3 py-1 bg-black/25 backdrop-blur-xs rounded-full border border-white/20">
              <span className="material-symbols-outlined text-[16px] text-[#a3faef]">
                {savingsConfig.savingsLockEnabled ? 'lock' : 'lock_open'}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#a3faef]">
                {savingsConfig.savingsLockEnabled ? 'Protected Savings Vault' : 'Savings Vault (Unlocked)'}
              </span>
            </div>

            <span className="text-[12px] font-medium text-white/80">
              {budget.selectedMonth || 'This Month'}
            </span>
          </div>

          {/* Big Protected Amount Display */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 pt-1">
            <div>
              <span className="text-[12px] uppercase font-bold tracking-wider text-white/70 block mb-1">
                Protected Savings Preserved
              </span>
              <div className="flex items-baseline gap-2.5">
                <span className="font-display text-[34px] sm:text-[40px] font-bold text-white tracking-tight">
                  {formatCurrency(savingsIntactAmount)}
                </span>
                <span className="text-[15px] font-medium text-white/80">
                  of {formatCurrency(savingsConfig.monthlySavingsGoal)} goal
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-xs px-3.5 py-2 rounded-2xl border border-white/15">
              <div className="text-right">
                <span className="text-[10px] uppercase font-bold text-white/70 block">Vault Integrity</span>
                <span className={`text-[15px] font-bold ${savingsPercentagePreserved === 100 ? 'text-[#a3faef]' : savingsPercentagePreserved > 50 ? 'text-[#ffdbca]' : 'text-[#ffdad6]'}`}>
                  {savingsPercentagePreserved}% Safe
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
                <span className="material-symbols-outlined text-[20px] text-[#a3faef]">
                  {savingsPercentagePreserved === 100 ? 'verified' : 'gpp_maybe'}
                </span>
              </div>
            </div>
          </div>

          {/* Protected Savings Visual Bar */}
          <div className="flex flex-col gap-1.5 pt-1">
            <div className="w-full h-3 bg-black/30 rounded-full overflow-hidden p-0.5 border border-white/15">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  savingsPercentagePreserved === 100
                    ? 'bg-gradient-to-r from-[#a3faef] to-[#34d399]'
                    : savingsPercentagePreserved > 50
                    ? 'bg-gradient-to-r from-[#fd761a] to-[#f59e0b]'
                    : 'bg-[#ba1a1a]'
                }`}
                style={{ width: `${savingsPercentagePreserved}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] font-medium text-white/80">
              <span>{formatCurrency(savingsIntactAmount)} locked away</span>
              {savingsBreachedAmount > 0 && (
                <span className="text-[#ffdad6] font-bold">
                  ⚠️ -{formatCurrency(savingsBreachedAmount)} used for expenses
                </span>
              )}
            </div>
          </div>

          {/* Quick Sub-Stats inside Vault Card */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-white/15">
            <div className="bg-black/15 p-2.5 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-white/70 block">Monthly Salary</span>
              <span className="font-display text-[15px] font-bold text-white">
                {formatCurrency(savingsConfig.monthlySalary)}
              </span>
            </div>
            <div className="bg-black/15 p-2.5 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-white/70 block">Spendable Budget</span>
              <span className="font-display text-[15px] font-bold text-[#a3faef]">
                {formatCurrency(spendableBudget)}
              </span>
            </div>
            <div className="col-span-2 sm:col-span-1 bg-black/15 p-2.5 rounded-xl">
              <span className="text-[10px] uppercase font-bold text-white/70 block">Remaining Spend</span>
              <span className={`font-display text-[15px] font-bold ${remainingSpendableBudget > 0 ? 'text-white' : 'text-[#ffdad6]'}`}>
                {formatCurrency(remainingSpendableBudget)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CASH FLOW & SALARY WATERFALL BREAKDOWN */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-elevation-1 border border-[#eff4ff] flex flex-col gap-3.5">
        <div className="flex justify-between items-center">
          <h2 className="font-display text-[17px] font-bold text-[#0b1c30]">
            Salary Allocation & Spending Waterfall
          </h2>
          <span className="text-[11px] font-semibold text-[#6e7977] bg-[#eff4ff] px-2 py-0.5 rounded-md">
            Discretionary vs Protected
          </span>
        </div>

        {/* Step-by-step visual waterfall list */}
        <div className="space-y-2.5">
          {/* Total Monthly Salary */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff]/60 border border-[#d8e2ff]/60">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#005c55]/10 text-[#005c55] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">payments</span>
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#0b1c30]">1. Total Monthly Salary</p>
                <p className="text-[11px] text-[#6e7977]">Your total net income for the month</p>
              </div>
            </div>
            <span className="font-display text-[15px] font-bold text-[#005c55]">
              +{formatCurrency(savingsConfig.monthlySalary)}
            </span>
          </div>

          {/* Minus Savings Goal */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#e5eeff]/60 border border-[#d8e2ff]/60">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#004eaa]/10 text-[#004eaa] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">lock</span>
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#0b1c30]">2. Protected Savings Goal</p>
                <p className="text-[11px] text-[#6e7977]">
                  {Math.round((savingsConfig.monthlySavingsGoal / (savingsConfig.monthlySalary || 1)) * 100)}% locked away immediately
                </p>
              </div>
            </div>
            <span className="font-display text-[15px] font-bold text-[#004eaa]">
              -{formatCurrency(savingsConfig.monthlySavingsGoal)}
            </span>
          </div>

          {/* Equals Spendable Budget */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#eff4ff] border border-[#005c55]/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#005c55] text-white flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">account_balance_wallet</span>
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#005c55]">3. Max Spendable Budget</p>
                <p className="text-[11px] text-[#3e4947]">Allowed monthly expense limit</p>
              </div>
            </div>
            <span className="font-display text-[16px] font-extrabold text-[#005c55]">
              = {formatCurrency(spendableBudget)}
            </span>
          </div>

          {/* Minus Total Spent so far */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#fff5f5] border border-[#ba1a1a]/20">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#ba1a1a]/10 text-[#ba1a1a] flex items-center justify-center font-bold">
                <span className="material-symbols-outlined text-[18px]">shopping_cart_checkout</span>
              </div>
              <div>
                <p className="text-[13px] font-bold text-[#ba1a1a]">4. Total Spent So Far</p>
                <p className="text-[11px] text-[#6e7977]">{expenses.length} transactions logged this month</p>
              </div>
            </div>
            <span className="font-display text-[15px] font-bold text-[#ba1a1a]">
              -{formatCurrency(totalSpentThisMonth)}
            </span>
          </div>

          {/* Equals Safe Remaining Spend */}
          <div className={`flex items-center justify-between p-3.5 rounded-xl border ${
            remainingSpendableBudget > 0
              ? 'bg-gradient-to-r from-[#005c55]/10 to-[#0f766e]/10 border-[#005c55]/30'
              : 'bg-[#ba1a1a]/10 border-[#ba1a1a]/40'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                remainingSpendableBudget > 0 ? 'bg-[#005c55] text-white' : 'bg-[#ba1a1a] text-white'
              }`}>
                <span className="material-symbols-outlined text-[18px]">
                  {remainingSpendableBudget > 0 ? 'check_circle' : 'cancel'}
                </span>
              </div>
              <div>
                <p className={`text-[14px] font-bold ${remainingSpendableBudget > 0 ? 'text-[#005c55]' : 'text-[#ba1a1a]'}`}>
                  {remainingSpendableBudget > 0 ? 'Safe Remaining to Spend' : 'Overspending Deficit'}
                </p>
                <p className="text-[11px] text-[#6e7977]">
                  {remainingSpendableBudget > 0
                    ? `Safe daily limit: ${formatCurrency(safeSpendToday)} / day for ${daysRemaining} days`
                    : `Exceeded spendable budget by ${formatCurrency(totalSpentThisMonth - spendableBudget)}`}
                </p>
              </div>
            </div>
            <span className={`font-display text-[18px] font-black ${
              remainingSpendableBudget > 0 ? 'text-[#005c55]' : 'text-[#ba1a1a]'
            }`}>
              {remainingSpendableBudget > 0 ? formatCurrency(remainingSpendableBudget) : `-${formatCurrency(totalSpentThisMonth - spendableBudget)}`}
            </span>
          </div>
        </div>
      </section>

      {/* 4. "WHAT-IF" PURCHASE SIMULATOR */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-elevation-1 border border-[#eff4ff] flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-[#fd761a]/10 text-[#fd761a] flex items-center justify-center">
            <span className="material-symbols-outlined text-[20px]">calculate</span>
          </div>
          <div>
            <h2 className="font-display text-[16px] font-bold text-[#0b1c30]">
              Purchase Simulator: Will it Eat into Savings?
            </h2>
            <p className="text-[12px] text-[#6e7977]">
              Test an upcoming purchase to see if it breaches your protected vault.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-2.5 font-display text-[16px] font-bold text-[#6e7977]">₹</span>
            <input
              type="number"
              value={simPurchaseAmount}
              onChange={(e) => setSimPurchaseAmount(e.target.value)}
              placeholder="Enter planned expense (e.g. 8000)"
              className="w-full pl-8 pr-3 py-2 border border-[#bdc9c6] rounded-xl text-[15px] font-bold text-[#0b1c30] focus:ring-2 focus:ring-[#005c55] focus:outline-none"
            />
          </div>
          {simPurchaseAmount && (
            <button
              onClick={() => setSimPurchaseAmount('')}
              className="px-3 py-2 text-[12px] font-semibold text-[#6e7977] bg-[#eff4ff] rounded-xl hover:bg-[#d8e2ff]"
            >
              Clear
            </button>
          )}
        </div>

        {/* Simulator Result Preview */}
        {simAmountNum > 0 && (
          <div className={`p-3.5 rounded-xl border transition-all ${
            simWouldDeficit
              ? 'bg-[#fff5f5] border-[#ba1a1a] text-[#ba1a1a]'
              : simWouldBreach
              ? 'bg-[#fff5f5] border-[#ba1a1a]/60 text-[#ba1a1a]'
              : 'bg-[#eff4ff] border-[#005c55]/30 text-[#005c55]'
          }`}>
            <div className="flex items-start gap-2.5">
              <span className="material-symbols-outlined text-[22px] shrink-0 mt-0.5">
                {simWouldBreach ? 'warning' : 'check_circle'}
              </span>
              <div>
                <p className="text-[13px] font-bold">
                  {simWouldDeficit
                    ? `🚨 DEFICIT ALERT: Spending ₹${simAmountNum.toLocaleString('en-IN')} will completely drain your savings and exceed your salary!`
                    : simWouldBreach
                    ? `⚠️ SAVINGS BREACH: Spending ₹${simAmountNum.toLocaleString('en-IN')} will eat ₹${simBreachedAmount.toLocaleString('en-IN')} from your protected savings vault!`
                    : `✅ SAFE TO SPEND: Spending ₹${simAmountNum.toLocaleString('en-IN')} leaves ₹${(remainingSpendableBudget - simAmountNum).toLocaleString('en-IN')} in your budget and keeps your ₹${savingsConfig.monthlySavingsGoal.toLocaleString('en-IN')} savings 100% untouched.`}
                </p>
                <p className="text-[11px] opacity-80 mt-1">
                  New Total Spent: {formatCurrency(simNewTotal)} / {formatCurrency(spendableBudget)} spendable limit.
                </p>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* 5. SAVINGS SUB-GOALS (Emergency Fund, Goa Trip, etc.) */}
      <section className="bg-white rounded-2xl p-4 sm:p-5 shadow-elevation-1 border border-[#eff4ff] flex flex-col gap-3.5">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="font-display text-[17px] font-bold text-[#0b1c30]">
              Target Savings Goals
            </h2>
            <p className="text-[12px] text-[#6e7977]">
              Organize your savings into dedicated goal buckets.
            </p>
          </div>
          <button
            onClick={() => setShowAddGoalModal(true)}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#005c55] hover:bg-[#004d47] text-white rounded-xl text-[12px] font-bold transition-all shadow-xs active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>New Goal</span>
          </button>
        </div>

        {/* Goal Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {savingsConfig.savingsGoals.map((g) => {
            const pct = Math.min(100, Math.round((g.currentAmount / (g.targetAmount || 1)) * 100));
            return (
              <div
                key={g.id}
                className="p-4 rounded-2xl border border-[#eff4ff] bg-[#eff4ff]/40 hover:border-[#005c55] transition-all flex flex-col justify-between gap-3 group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-[#005c55]/10 text-[#005c55] flex items-center justify-center">
                      <span className="material-symbols-outlined text-[22px]">{g.icon || 'savings'}</span>
                    </div>
                    <div>
                      <h3 className="font-sans text-[14px] font-bold text-[#0b1c30]">{g.name}</h3>
                      {g.targetDate && (
                        <span className="text-[11px] text-[#6e7977]">Target: {g.targetDate}</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => deleteSavingsGoal(g.id)}
                    className="text-[#6e7977] hover:text-[#ba1a1a] p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete goal"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>

                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <span className="font-display text-[16px] font-bold text-[#005c55]">
                      {formatCurrency(g.currentAmount)}
                    </span>
                    <span className="text-[12px] text-[#6e7977]">
                      of {formatCurrency(g.targetAmount)} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-[#d8e2ff] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#005c55] rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-[#d8e2ff]/50">
                  <span className="text-[11px] font-medium text-[#6e7977]">
                    {formatCurrency(Math.max(0, g.targetAmount - g.currentAmount))} remaining
                  </span>
                  <button
                    onClick={() => {
                      setSelectedGoal(g);
                      setDepositAmount('');
                      setShowDepositModal(true);
                    }}
                    className="text-[12px] font-bold text-[#005c55] hover:underline flex items-center gap-0.5"
                  >
                    <span className="material-symbols-outlined text-[14px]">add_circle</span>
                    <span>Deposit</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. AI & SMART SAVINGS ADVISOR */}
      <section className="bg-gradient-to-br from-[#eff4ff] to-[#e5eeff] rounded-2xl p-4 sm:p-5 border border-[#005c55]/20 flex flex-col gap-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#005c55] text-white flex items-center justify-center">
            <span className="material-symbols-outlined text-[18px]">psychology</span>
          </div>
          <h3 className="font-display text-[15px] font-bold text-[#005c55]">
            Digi Track Savings Insights
          </h3>
        </div>

        <div className="text-[13px] text-[#3e4947] space-y-1.5 leading-relaxed">
          <p>
            • <strong>Month-End Projection:</strong> At your current burn rate of {formatCurrency(Math.round(avgDailySpent))}/day, you are projected to finish the month having spent <strong>{formatCurrency(projectedMonthEndSpent)}</strong>, retaining <strong>{formatCurrency(projectedSavings)}</strong> in total savings.
          </p>
          <p>
            • <strong>Discipline Tip:</strong> With {daysRemaining} days left, limiting daily spend to <strong>{formatCurrency(safeSpendToday)}</strong> guarantees your <strong>{formatCurrency(savingsConfig.monthlySavingsGoal)}</strong> savings vault remains 100% intact.
          </p>
        </div>
      </section>

      {/* EDIT CONFIG MODAL */}
      {showEditConfigModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-md p-5 sm:p-6 shadow-2xl border border-[#eff4ff] flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-[18px] font-bold text-[#0b1c30]">
                Set Salary & Savings Target
              </h3>
              <button
                onClick={() => setShowEditConfigModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#6e7977] hover:bg-[#eff4ff]"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Monthly Salary Input */}
            <div>
              <label className="text-[12px] font-bold text-[#3e4947] uppercase block mb-1">
                Monthly Net Salary (INR)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-3 font-display text-[18px] font-bold text-[#6e7977]">₹</span>
                <input
                  type="number"
                  value={salaryInput}
                  onChange={(e) => setSalaryInput(e.target.value)}
                  placeholder="e.g. 60000"
                  className="w-full pl-9 pr-4 py-2.5 border border-[#bdc9c6] rounded-xl font-display text-[18px] font-bold text-[#0b1c30] focus:ring-2 focus:ring-[#005c55] focus:outline-none"
                />
              </div>
            </div>

            {/* Monthly Savings Goal Input */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[12px] font-bold text-[#3e4947] uppercase block">
                  Monthly Savings Target (INR)
                </label>
                <span className="text-[11px] font-bold text-[#005c55]">
                  {salaryInput && savingsGoalInput
                    ? `${Math.round(((parseFloat(savingsGoalInput) || 0) / (parseFloat(salaryInput) || 1)) * 100)}% of Salary`
                    : ''}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-3.5 top-3 font-display text-[18px] font-bold text-[#6e7977]">₹</span>
                <input
                  type="number"
                  value={savingsGoalInput}
                  onChange={(e) => setSavingsGoalInput(e.target.value)}
                  placeholder="e.g. 20000"
                  className="w-full pl-9 pr-4 py-2.5 border border-[#bdc9c6] rounded-xl font-display text-[18px] font-bold text-[#005c55] focus:ring-2 focus:ring-[#005c55] focus:outline-none"
                />
              </div>

              {/* Quick % Presets */}
              <div className="flex gap-1.5 mt-2 flex-wrap">
                {[
                  { label: '20% (₹' + Math.round(((parseFloat(salaryInput) || 60000) * 0.2)).toLocaleString('en-IN') + ')', pct: 20 },
                  { label: '30%', pct: 30 },
                  { label: '33.3% (₹20k)', pct: 33.33 },
                  { label: '50%', pct: 50 },
                ].map((item) => (
                  <button
                    key={item.pct}
                    type="button"
                    onClick={() => applyPresetPercentage(item.pct)}
                    className="px-2.5 py-1 text-[11px] font-bold bg-[#eff4ff] hover:bg-[#d8e2ff] text-[#005c55] rounded-lg transition-colors"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Spendable Budget Calculated Result */}
            <div className="p-3 bg-[#eff4ff] rounded-xl border border-[#005c55]/20 flex justify-between items-center">
              <div>
                <span className="text-[11px] font-bold uppercase text-[#3e4947] block">Remaining Spendable Budget</span>
                <span className="text-[11px] text-[#6e7977]">Discretionary limit for monthly expenses</span>
              </div>
              <span className="font-display text-[18px] font-extrabold text-[#005c55]">
                ₹{Math.max(0, (parseFloat(salaryInput) || 0) - (parseFloat(savingsGoalInput) || 0)).toLocaleString('en-IN')}
              </span>
            </div>

            {/* Savings Lock Protection Toggle */}
            <div className="flex items-center justify-between p-3 rounded-xl border border-[#bdc9c6]/60">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-[22px] text-[#005c55]">shield_locked</span>
                <div>
                  <p className="text-[13px] font-bold text-[#0b1c30]">Strict Savings Protection</p>
                  <p className="text-[11px] text-[#6e7977]">Display active warnings if spending dips into savings</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={lockToggle}
                onChange={(e) => setLockToggle(e.target.checked)}
                className="w-5 h-5 accent-[#005c55] rounded cursor-pointer"
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowEditConfigModal(false)}
                className="flex-1 py-3 bg-[#eff4ff] text-[#3e4947] font-bold text-[14px] rounded-xl hover:bg-[#d8e2ff]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveConfig}
                className="flex-1 py-3 bg-[#005c55] hover:bg-[#004d47] text-white font-bold text-[14px] rounded-xl shadow-xs"
              >
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE SUB-GOAL MODAL */}
      {showAddGoalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-sm p-5 sm:p-6 shadow-2xl border border-[#eff4ff] flex flex-col gap-3">
            <h3 className="font-display text-[18px] font-bold text-[#0b1c30]">
              Create New Savings Goal
            </h3>

            <div>
              <label className="text-[12px] font-bold text-[#6e7977] uppercase block mb-1">Goal Name</label>
              <input
                type="text"
                value={goalName}
                onChange={(e) => setGoalName(e.target.value)}
                placeholder="e.g. Wedding Fund, Bike Downpayment"
                className="w-full px-3 py-2 border border-[#bdc9c6] rounded-xl text-[14px] focus:ring-2 focus:ring-[#005c55] focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[12px] font-bold text-[#6e7977] uppercase block mb-1">Target Amount (₹)</label>
                <input
                  type="number"
                  value={goalTarget}
                  onChange={(e) => setGoalTarget(e.target.value)}
                  placeholder="50000"
                  className="w-full px-3 py-2 border border-[#bdc9c6] rounded-xl text-[14px] font-bold focus:ring-2 focus:ring-[#005c55] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[12px] font-bold text-[#6e7977] uppercase block mb-1">Starting Amount (₹)</label>
                <input
                  type="number"
                  value={goalCurrent}
                  onChange={(e) => setGoalCurrent(e.target.value)}
                  placeholder="0"
                  className="w-full px-3 py-2 border border-[#bdc9c6] rounded-xl text-[14px] focus:ring-2 focus:ring-[#005c55] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="text-[12px] font-bold text-[#6e7977] uppercase block mb-1">Target Date (Optional)</label>
              <input
                type="date"
                value={goalDate}
                onChange={(e) => setGoalDate(e.target.value)}
                className="w-full px-3 py-2 border border-[#bdc9c6] rounded-xl text-[13px] focus:ring-2 focus:ring-[#005c55] focus:outline-none"
              />
            </div>

            <div>
              <label className="text-[12px] font-bold text-[#6e7977] uppercase block mb-1">Icon</label>
              <div className="flex gap-2 flex-wrap">
                {['savings', 'shield_locked', 'beach_access', 'laptop_mac', 'directions_car', 'home', 'flight', 'redeem'].map((ic) => (
                  <button
                    key={ic}
                    type="button"
                    onClick={() => setGoalIcon(ic)}
                    className={`w-9 h-9 rounded-xl flex items-center justify-center border ${
                      goalIcon === ic ? 'bg-[#005c55] text-white border-[#005c55]' : 'bg-[#eff4ff] text-[#3e4947] border-[#bdc9c6]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{ic}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowAddGoalModal(false)}
                className="flex-1 py-2.5 bg-[#eff4ff] text-[#3e4947] font-bold text-[13px] rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateGoal}
                className="flex-1 py-2.5 bg-[#005c55] text-white font-bold text-[13px] rounded-xl"
              >
                Create Goal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DEPOSIT MODAL */}
      {showDepositModal && selectedGoal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl w-full max-w-xs p-5 shadow-2xl border border-[#eff4ff] flex flex-col gap-3">
            <h3 className="font-display text-[17px] font-bold text-[#0b1c30]">
              Deposit to {selectedGoal.name}
            </h3>
            <p className="text-[12px] text-[#6e7977]">
              Current Balance: {formatCurrency(selectedGoal.currentAmount)}
            </p>

            <div>
              <label className="text-[12px] font-bold text-[#6e7977] uppercase block mb-1">
                Deposit Amount (INR)
              </label>
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full p-3 border border-[#bdc9c6] rounded-xl font-display text-[18px] font-bold text-[#005c55] focus:ring-2 focus:ring-[#005c55] focus:outline-none"
              />
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowDepositModal(false)}
                className="flex-1 py-2.5 bg-[#eff4ff] text-[#3e4947] font-bold text-[13px] rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleGoalDeposit}
                className="flex-1 py-2.5 bg-[#005c55] text-white font-bold text-[13px] rounded-xl"
              >
                Deposit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
