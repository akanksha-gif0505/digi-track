import React, { useState } from 'react';
import { useExpense } from '../context/ExpenseContext';
import { DownloadExpensesModal } from './DownloadExpensesModal';

interface SettingsScreenProps {
  onOpenArchitecture: () => void;
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ onOpenArchitecture }) => {
  const {
    userProfile,
    updateUserProfile,
    savingsConfig,
    updateSavingsConfig,
    formatCurrency,
    spendableBudget,
    exportToCSV,
    clearAllData,
    resetToDefaults,
    categories,
    deleteCategory,
    addCategory,
    expenses,
    setActiveTab,
    logout,
  } = useExpense();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDownloadModal, setShowDownloadModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Profile & Salary Edit State
  const [nameInput, setNameInput] = useState(userProfile.name);
  const [emailInput, setEmailInput] = useState(userProfile.email);
  const [phoneInput, setPhoneInput] = useState(userProfile.phone || '');
  const [jobTitleInput, setJobTitleInput] = useState(userProfile.jobTitle || '');
  const [salaryInput, setSalaryInput] = useState(savingsConfig.monthlySalary.toString());
  const [savingsGoalInput, setSavingsGoalInput] = useState(savingsConfig.monthlySavingsGoal.toString());

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Category Add State
  const [newCatName, setNewCatName] = useState('');

  const currencies = [
    { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
    { code: 'USD', symbol: '$', label: 'US Dollar' },
    { code: 'EUR', symbol: '€', label: 'Euro' },
    { code: 'GBP', symbol: '£', label: 'British Pound' },
    { code: 'AED', symbol: 'AED', label: 'UAE Dirham' },
    { code: 'SGD', symbol: 'S$', label: 'Singapore Dollar' },
  ];

  const handleOpenProfileModal = () => {
    setNameInput(userProfile.name);
    setEmailInput(userProfile.email);
    setPhoneInput(userProfile.phone || '');
    setJobTitleInput(userProfile.jobTitle || '');
    setSalaryInput(savingsConfig.monthlySalary.toString());
    setSavingsGoalInput(savingsConfig.monthlySavingsGoal.toString());
    setShowProfileModal(true);
  };

  const handleSaveProfile = () => {
    const parsedSalary = Math.max(0, parseFloat(salaryInput) || savingsConfig.monthlySalary);
    const parsedSavings = Math.max(0, parseFloat(savingsGoalInput) || savingsConfig.monthlySavingsGoal);

    // Update Profile
    updateUserProfile({
      name: nameInput.trim() || userProfile.name,
      email: emailInput.trim() || userProfile.email,
      phone: phoneInput.trim() || undefined,
      jobTitle: jobTitleInput.trim() || undefined,
    });

    // Update Salary and Savings Goal
    updateSavingsConfig({
      monthlySalary: parsedSalary,
      monthlySavingsGoal: Math.min(parsedSavings, parsedSalary),
    });

    setShowProfileModal(false);
    showToast('Profile & Salary settings updated successfully! ✨');
  };

  const handleAddCustomCategory = () => {
    if (!newCatName.trim()) return;
    addCategory({
      name: newCatName.trim(),
      icon: 'label',
      bgClass: 'bg-[#eff4ff]',
      iconColorClass: 'text-[#005c55]',
      badgeBgClass: 'bg-[#e5eeff]',
      badgeTextClass: 'text-[#005c55]',
      colorHex: '#0f766e',
      defaultCap: 5000,
    });
    setNewCatName('');
  };

  // Preview calculations for modal
  const previewSalary = Math.max(0, parseFloat(salaryInput) || 0);
  const previewSavings = Math.max(0, parseFloat(savingsGoalInput) || 0);
  const previewSpendable = Math.max(0, previewSalary - previewSavings);
  const previewSavingsPct = previewSalary > 0 ? Math.round((previewSavings / previewSalary) * 100) : 0;
  const previewDailySafe = Math.round(previewSpendable / 30);

  return (
    <div className="flex flex-col gap-4 pb-28 md:pb-12 max-w-2xl mx-auto w-full px-4 pt-3">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#0b1c30] text-white px-4 py-2.5 rounded-2xl shadow-xl border border-white/20 text-[13px] font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-3">
          <span className="material-symbols-outlined text-[18px] text-[#a3faef]">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Title */}
      <div className="mb-1">
        <h2 className="font-display text-[22px] sm:text-[24px] font-bold text-[#0b1c30]">
          Settings &amp; Profile
        </h2>
        <p className="font-sans text-[13px] text-[#3e4947] mt-0.5">
          Manage your account profile, monthly salary, and app preferences.
        </p>
      </div>

      {/* 1. Account & Salary Group */}
      <section className="bg-white rounded-3xl shadow-elevation-1 border border-[#eff4ff] overflow-hidden flex flex-col">
        <div className="px-4 py-3 border-b border-[#eff4ff] bg-[#eff4ff]/60 flex justify-between items-center">
          <h3 className="font-sans text-[12px] font-bold text-[#005c55] uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px]">account_circle</span>
            Profile &amp; Monthly Salary
          </h3>
          <span className="text-[11px] font-semibold text-[#6e7977]">
            Update anytime
          </span>
        </div>

        {/* Profile & Salary Card Overview */}
        <div className="p-4 sm:p-5 flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                {userProfile.avatarUrl ? (
                  <img
                    src={userProfile.avatarUrl}
                    alt={userProfile.name}
                    className="w-13 h-13 rounded-2xl object-cover border border-[#005c55]/20 shadow-xs"
                  />
                ) : (
                  <div className="w-13 h-13 rounded-2xl bg-[#005c55] text-white flex items-center justify-center font-bold text-[18px]">
                    {userProfile.name.charAt(0)}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#005c55] text-white flex items-center justify-center shadow-xs border-2 border-white">
                  <span className="material-symbols-outlined text-[12px]">edit</span>
                </div>
              </div>

              <div>
                <h4 className="font-display text-[16px] font-bold text-[#0b1c30] flex items-center gap-1.5">
                  {userProfile.name}
                  {userProfile.isPremium && (
                    <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-[#ffdbca] text-[#9d4300] font-bold uppercase">
                      PRO
                    </span>
                  )}
                </h4>
                <p className="text-[12px] text-[#6e7977]">
                  {userProfile.email}
                  {userProfile.jobTitle ? ` • ${userProfile.jobTitle}` : ''}
                </p>
                {userProfile.phone && (
                  <p className="text-[11px] text-[#6e7977]">
                    📱 {userProfile.phone}
                  </p>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleOpenProfileModal}
              className="px-3.5 py-2 rounded-xl bg-[#eff4ff] hover:bg-[#e5eeff] text-[#005c55] text-[12px] font-bold flex items-center gap-1.5 transition-all border border-[#005c55]/20 active:scale-98"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
              <span>Edit Profile &amp; Salary</span>
            </button>
          </div>

          {/* Monthly Salary & Spendable Budget Highlight Widget */}
          <div className="p-3.5 bg-gradient-to-r from-[#eff4ff] via-[#f8fafc] to-[#eef7f6] rounded-2xl border border-[#005c55]/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#005c55] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-[22px]">payments</span>
              </div>
              <div>
                <span className="text-[11px] font-bold text-[#6e7977] uppercase tracking-wider block">
                  Monthly Take-Home Salary
                </span>
                <span className="font-display text-[18px] font-extrabold text-[#005c55]">
                  {formatCurrency(savingsConfig.monthlySalary)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:border-l sm:border-[#005c55]/20 sm:pl-4 text-[12px]">
              <div className="flex flex-col">
                <span className="text-[#6e7977] text-[11px]">Spendable Budget:</span>
                <strong className="text-[#0b1c30]">{formatCurrency(spendableBudget)}</strong>
              </div>
              <span className="text-[#6e7977]">•</span>
              <div className="flex flex-col">
                <span className="text-[#6e7977] text-[11px]">Protected Savings:</span>
                <strong className="text-[#005c55]">{formatCurrency(savingsConfig.monthlySavingsGoal)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* Other Account Options */}
        <div className="divide-y divide-[#eff4ff] border-t border-[#eff4ff]">
          {/* Switch / Sign In with another account */}
          <button
            onClick={() => setActiveTab('auth')}
            className="w-full flex items-center justify-between px-4 py-3 min-h-[56px] hover:bg-[#eff4ff]/60 transition-colors text-left group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#e5eeff] text-[#004eaa] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">switch_account</span>
              </div>
              <div>
                <p className="font-sans text-[15px] text-[#0b1c30] font-semibold">
                  Switch Account / Sign In
                </p>
                <p className="font-sans text-[12px] text-[#6e7977]">
                  Log in with another email or demo profile
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#6e7977] group-hover:text-[#004eaa] transition-colors">
              chevron_right
            </span>
          </button>

          {/* Premium */}
          <button
            onClick={() => setShowPremiumModal(true)}
            className="w-full flex items-center justify-between px-4 py-3 min-h-[56px] hover:bg-[#eff4ff]/60 transition-colors text-left group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#fd761a] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined fill-1 text-[22px]">
                  workspace_premium
                </span>
              </div>
              <div>
                <p className="font-sans text-[15px] text-[#0b1c30] font-semibold flex items-center gap-1.5">
                  Digi Track Premium
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ffdbca] text-[#9d4300] font-bold uppercase">
                    Pro
                  </span>
                </p>
                <p className="font-sans text-[12px] text-[#6e7977]">
                  Go Ad-Free & Unlock Cloud Sync
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#6e7977] group-hover:text-[#9d4300] transition-colors">
              chevron_right
            </span>
          </button>

          {/* Log Out Button */}
          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full flex items-center justify-between px-4 py-3 min-h-[56px] hover:bg-[#ffdad6]/30 transition-colors text-left group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">logout</span>
              </div>
              <div>
                <p className="font-sans text-[15px] text-[#ba1a1a] font-semibold">
                  Log Out
                </p>
                <p className="font-sans text-[12px] text-[#ba1a1a]/80">
                  Sign out of {userProfile.name}
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#ba1a1a]/80 group-hover:text-[#ba1a1a] transition-colors">
              chevron_right
            </span>
          </button>
        </div>
      </section>

      {/* 2. Preferences Group */}
      <section className="bg-white rounded-2xl shadow-elevation-1 border border-[#eff4ff] overflow-hidden">
        <div className="px-4 py-2.5 border-b border-[#eff4ff] bg-[#eff4ff]/60">
          <h3 className="font-sans text-[12px] font-semibold text-[#005c55] uppercase tracking-wider">
            Preferences
          </h3>
        </div>
        <div className="divide-y divide-[#eff4ff]">
          {/* Categories */}
          <button
            onClick={() => setShowCategoriesModal(true)}
            className="w-full flex items-center justify-between px-4 py-3 min-h-[56px] hover:bg-[#eff4ff]/60 transition-colors text-left group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#d3e4fe] text-[#0b1c30] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">category</span>
              </div>
              <div>
                <p className="font-sans text-[15px] text-[#0b1c30] font-semibold">
                  Categories
                </p>
                <p className="font-sans text-[12px] text-[#6e7977]">
                  Manage custom tags ({categories.length} active)
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#6e7977] group-hover:text-[#005c55] transition-colors">
              chevron_right
            </span>
          </button>

          {/* Currency */}
          <button
            onClick={() => setShowCurrencyModal(true)}
            className="w-full flex items-center justify-between px-4 py-3 min-h-[56px] hover:bg-[#eff4ff]/60 transition-colors text-left group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#d3e4fe] text-[#0b1c30] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">payments</span>
              </div>
              <div>
                <p className="font-sans text-[15px] text-[#0b1c30] font-semibold">
                  Currency
                </p>
                <p className="font-sans text-[12px] text-[#6e7977]">
                  Default currency for new entries
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-display text-[15px] font-bold text-[#005c55]">
                {userProfile.currencyCode} ({userProfile.currencySymbol})
              </span>
              <span className="material-symbols-outlined text-[#6e7977]">
                expand_more
              </span>
            </div>
          </button>

          {/* Architecture / System Design Viewer */}
          <button
            onClick={onOpenArchitecture}
            className="w-full flex items-center justify-between px-4 py-3 min-h-[56px] hover:bg-[#eff4ff]/60 transition-colors text-left group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#e5eeff] text-[#0165d8] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">schema</span>
              </div>
              <div>
                <p className="font-sans text-[15px] text-[#0b1c30] font-semibold">
                  SaaS Architecture & System Design
                </p>
                <p className="font-sans text-[12px] text-[#6e7977]">
                  Multi-tenant cloud & offline-first engine
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#6e7977] group-hover:text-[#0165d8] transition-colors">
              chevron_right
            </span>
          </button>
        </div>
      </section>

      {/* 3. Data & Privacy Group */}
      <section className="bg-white rounded-2xl shadow-elevation-1 border border-[#eff4ff] overflow-hidden">
        <div className="px-4 py-2.5 border-b border-[#eff4ff] bg-[#eff4ff]/60">
          <h3 className="font-sans text-[12px] font-semibold text-[#005c55] uppercase tracking-wider">
            Data &amp; Privacy
          </h3>
        </div>
        <div className="divide-y divide-[#eff4ff]">
          {/* Export */}
          <button
            onClick={() => setShowDownloadModal(true)}
            className="w-full flex items-center justify-between px-4 py-3 min-h-[56px] hover:bg-[#eff4ff]/60 transition-colors text-left group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#d3e4fe] text-[#0b1c30] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">download</span>
              </div>
              <div>
                <p className="font-sans text-[15px] text-[#0b1c30] font-semibold">
                  Export / Download Data
                </p>
                <p className="font-sans text-[12px] text-[#6e7977]">
                  Download CSV, JSON, or statement of all {expenses.length} transactions
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#6e7977] group-hover:text-[#005c55] transition-colors">
              chevron_right
            </span>
          </button>

          {/* Reset Demo Data */}
          <button
            onClick={resetToDefaults}
            className="w-full flex items-center justify-between px-4 py-3 min-h-[56px] hover:bg-[#eff4ff]/60 transition-colors text-left group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#dce9ff] text-[#004eaa] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">restart_alt</span>
              </div>
              <div>
                <p className="font-sans text-[15px] text-[#004eaa] font-semibold">
                  Reset Sample Data
                </p>
                <p className="font-sans text-[12px] text-[#6e7977]">
                  Restore default transactions and categories
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#6e7977] group-hover:text-[#004eaa] transition-colors">
              chevron_right
            </span>
          </button>

          {/* Delete Data */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full flex items-center justify-between px-4 py-3 min-h-[56px] hover:bg-[#ffdad6]/40 transition-colors text-left group"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-full bg-[#ffdad6] text-[#ba1a1a] flex items-center justify-center">
                <span className="material-symbols-outlined text-[22px]">delete_forever</span>
              </div>
              <div>
                <p className="font-sans text-[15px] text-[#ba1a1a] font-semibold">
                  Delete My Data
                </p>
                <p className="font-sans text-[12px] text-[#ba1a1a]/80">
                  Permanently remove all records
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#ba1a1a]/80 group-hover:text-[#ba1a1a] transition-colors">
              chevron_right
            </span>
          </button>
        </div>
      </section>

      {/* Version Tag */}
      <div className="text-center pt-2 pb-6">
        <p className="font-sans text-[12px] text-[#6e7977] font-medium">
          Digi Track v2.1.4 • Offline-First Mobile SaaS
        </p>
        <button
          onClick={() => setActiveTab('onboarding')}
          className="text-[12px] text-[#005c55] font-semibold hover:underline mt-1 inline-block"
        >
          View Onboarding Intro
        </button>
      </div>

      {/* Profile & Salary Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg p-5 sm:p-6 shadow-2xl border border-[#eff4ff] flex flex-col gap-4 max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-start pb-2 border-b border-[#eff4ff]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#005c55] text-white flex items-center justify-center shadow-xs">
                  <span className="material-symbols-outlined text-[24px]">manage_accounts</span>
                </div>
                <div>
                  <h3 className="font-display text-[18px] font-bold text-[#0b1c30]">
                    Profile &amp; Salary Settings
                  </h3>
                  <p className="text-[12px] text-[#6e7977]">
                    Update personal info, monthly salary, and savings goals anytime.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#6e7977] hover:bg-[#eff4ff] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* SECTION 1: Personal Details */}
            <div className="flex flex-col gap-3">
              <span className="text-[11px] font-bold text-[#005c55] uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">person</span>
                Personal Information
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[12px] font-semibold text-[#0b1c30] block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="e.g. Akanksha D"
                    className="w-full px-3.5 py-2.5 border border-[#bdc9c6] rounded-xl text-[14px] font-medium focus:ring-2 focus:ring-[#005c55] focus:outline-none bg-[#f8fafc]"
                  />
                </div>

                <div>
                  <label className="text-[12px] font-semibold text-[#0b1c30] block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 border border-[#bdc9c6] rounded-xl text-[14px] font-medium focus:ring-2 focus:ring-[#005c55] focus:outline-none bg-[#f8fafc]"
                  />
                </div>

                <div>
                  <label className="text-[12px] font-semibold text-[#0b1c30] block mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 border border-[#bdc9c6] rounded-xl text-[14px] font-medium focus:ring-2 focus:ring-[#005c55] focus:outline-none bg-[#f8fafc]"
                  />
                </div>

                <div>
                  <label className="text-[12px] font-semibold text-[#0b1c30] block mb-1">
                    Job Title / Role (Optional)
                  </label>
                  <input
                    type="text"
                    value={jobTitleInput}
                    onChange={(e) => setJobTitleInput(e.target.value)}
                    placeholder="e.g. Product Designer"
                    className="w-full px-3.5 py-2.5 border border-[#bdc9c6] rounded-xl text-[14px] font-medium focus:ring-2 focus:ring-[#005c55] focus:outline-none bg-[#f8fafc]"
                  />
                </div>
              </div>
            </div>

            <hr className="border-[#eff4ff]" />

            {/* SECTION 2: Monthly Salary & Savings Configuration */}
            <div className="flex flex-col gap-3.5">
              <div className="flex justify-between items-center">
                <span className="text-[11px] font-bold text-[#005c55] uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[15px]">savings</span>
                  Monthly Salary &amp; Savings Target
                </span>
                <span className="text-[11px] text-[#6e7977] font-semibold">
                  Manual Adjustments
                </span>
              </div>

              {/* Monthly Salary Input */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[12px] font-semibold text-[#0b1c30]">
                    Monthly Take-Home Salary (₹)
                  </label>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() =>
                        setSalaryInput((prev) =>
                          Math.max(0, (parseFloat(prev) || 0) - 5000).toString()
                        )
                      }
                      className="px-2 py-0.5 rounded-md bg-[#eff4ff] text-[#005c55] text-[11px] font-bold hover:bg-[#e5eeff]"
                    >
                      -5k
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setSalaryInput((prev) =>
                          ((parseFloat(prev) || 0) + 5000).toString()
                        )
                      }
                      className="px-2 py-0.5 rounded-md bg-[#eff4ff] text-[#005c55] text-[11px] font-bold hover:bg-[#e5eeff]"
                    >
                      +5k
                    </button>
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[#005c55] text-[16px]">
                    {userProfile.currencySymbol || '₹'}
                  </span>
                  <input
                    type="number"
                    value={salaryInput}
                    onChange={(e) => setSalaryInput(e.target.value)}
                    placeholder="60000"
                    min="0"
                    step="1000"
                    className="w-full pl-8 pr-3.5 py-2.5 border border-[#bdc9c6] rounded-xl text-[15px] font-bold text-[#0b1c30] focus:ring-2 focus:ring-[#005c55] focus:outline-none bg-white"
                  />
                </div>

                {/* Quick Salary Chips */}
                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                  <span className="text-[10px] text-[#6e7977] font-semibold uppercase">Presets:</span>
                  {[30000, 50000, 60000, 80000, 100000, 150000].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setSalaryInput(amt.toString())}
                      className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-colors ${
                        parseFloat(salaryInput) === amt
                          ? 'bg-[#005c55] text-white'
                          : 'bg-[#eff4ff] text-[#005c55] hover:bg-[#e5eeff]'
                      }`}
                    >
                      {formatCurrency(amt)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monthly Savings Goal Input */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-[12px] font-semibold text-[#0b1c30]">
                    Monthly Protected Savings Target (₹)
                  </label>
                  <span className="text-[11px] font-bold text-[#005c55]">
                    {previewSavingsPct}% of salary
                  </span>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-[#005c55] text-[16px]">
                    {userProfile.currencySymbol || '₹'}
                  </span>
                  <input
                    type="number"
                    value={savingsGoalInput}
                    onChange={(e) => setSavingsGoalInput(e.target.value)}
                    placeholder="20000"
                    min="0"
                    max={salaryInput}
                    step="1000"
                    className="w-full pl-8 pr-3.5 py-2.5 border border-[#bdc9c6] rounded-xl text-[15px] font-bold text-[#0b1c30] focus:ring-2 focus:ring-[#005c55] focus:outline-none bg-white"
                  />
                </div>

                {/* Percentage Savings Goal Chips */}
                <div className="flex items-center gap-1.5 flex-wrap mt-2">
                  <span className="text-[10px] text-[#6e7977] font-semibold uppercase">Quick %:</span>
                  {[
                    { label: '20%', pct: 0.2 },
                    { label: '25%', pct: 0.25 },
                    { label: '33% (1/3)', pct: 0.3333 },
                    { label: '40%', pct: 0.4 },
                    { label: '50%', pct: 0.5 },
                  ].map((chip) => {
                    const calculated = Math.round((parseFloat(salaryInput) || 0) * chip.pct);
                    return (
                      <button
                        key={chip.label}
                        type="button"
                        onClick={() => setSavingsGoalInput(calculated.toString())}
                        className="px-2 py-0.5 rounded-lg bg-[#eef7f6] text-[#005c55] hover:bg-[#d8ece9] text-[11px] font-bold border border-[#005c55]/20"
                      >
                        {chip.label} ({formatCurrency(calculated)})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Live Financial Recap Card */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#eff4ff] to-[#eef7f6] border border-[#005c55]/20 flex flex-col gap-2">
                <div className="flex justify-between items-center text-[11px] font-bold text-[#005c55] uppercase tracking-wider">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">calculate</span>
                    Recalculated Monthly Limits
                  </span>
                  <span>Live Preview</span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[12px] pt-1">
                  <div className="bg-white/80 p-2.5 rounded-xl border border-[#005c55]/10">
                    <span className="text-[#6e7977] text-[11px] block">Spendable Budget</span>
                    <strong className="text-[#0b1c30] text-[15px] font-display font-bold">
                      {formatCurrency(previewSpendable)}
                    </strong>
                    <span className="text-[10px] text-[#6e7977] block mt-0.5">
                      ~{formatCurrency(previewDailySafe)}/day safe limit
                    </span>
                  </div>

                  <div className="bg-white/80 p-2.5 rounded-xl border border-[#005c55]/10">
                    <span className="text-[#6e7977] text-[11px] block">Protected Vault</span>
                    <strong className="text-[#005c55] text-[15px] font-display font-bold">
                      {formatCurrency(previewSavings)}
                    </strong>
                    <span className="text-[10px] text-[#005c55] font-semibold block mt-0.5">
                      {previewSavingsPct}% of monthly income
                    </span>
                  </div>
                </div>

                <p className="text-[11px] text-[#6e7977] italic mt-0.5">
                  💡 Updating your salary recalculates your remaining spendable budget, protected vault, and budget health warnings across Digi Track in real time.
                </p>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex gap-2.5 pt-2 border-t border-[#eff4ff]">
              <button
                type="button"
                onClick={() => setShowProfileModal(false)}
                className="flex-1 py-3 bg-[#eff4ff] text-[#3e4947] font-display font-bold text-[14px] rounded-2xl hover:bg-[#e5eeff] transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="flex-2 py-3 bg-[#005c55] hover:bg-[#004d47] text-white font-display font-bold text-[14px] rounded-2xl shadow-md shadow-[#005c55]/20 flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">save</span>
                <span>Save Profile &amp; Salary</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Currency Modal */}
      {showCurrencyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-xs p-5 shadow-xl border border-[#bdc9c6]/40 flex flex-col gap-3">
            <h3 className="font-display text-[17px] font-bold text-[#0b1c30]">
              Select Default Currency
            </h3>
            <div className="flex flex-col gap-1.5 max-h-60 overflow-y-auto pr-1">
              {currencies.map((c) => (
                <button
                  key={c.code}
                  onClick={() => {
                    updateUserProfile({
                      currencyCode: c.code,
                      currencySymbol: c.symbol,
                    });
                    setShowCurrencyModal(false);
                  }}
                  className={`flex items-center justify-between p-3 rounded-xl transition-colors ${
                    userProfile.currencyCode === c.code
                      ? 'bg-[#0f766e] text-white font-semibold'
                      : 'hover:bg-[#eff4ff] text-[#0b1c30]'
                  }`}
                >
                  <span>{c.label} ({c.code})</span>
                  <span className="font-bold">{c.symbol}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowCurrencyModal(false)}
              className="w-full py-2 bg-[#eff4ff] text-[#3e4947] font-semibold text-[13px] rounded-xl mt-1"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Premium Pro Modal */}
      {showPremiumModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-xl border border-[#bdc9c6]/40 flex flex-col gap-4 text-center">
            <div className="w-14 h-14 rounded-full bg-[#fd761a] text-white mx-auto flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined fill-1 text-[32px]">
                workspace_premium
              </span>
            </div>
            <div>
              <h3 className="font-display text-[20px] font-bold text-[#0b1c30]">
                Digi Track Premium
              </h3>
              <p className="font-sans text-[13px] text-[#6e7977] mt-1">
                Unlock high-performance multi-tenant sync and automated receipt OCR.
              </p>
            </div>
            <div className="text-left bg-[#eff4ff] p-3.5 rounded-xl space-y-2 text-[13px] text-[#3e4947]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#005c55] text-[18px]">check_circle</span>
                <span>Unlimited SQLite / Cloud real-time sync</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#005c55] text-[18px]">check_circle</span>
                <span>Automated weekly PDF / Excel financial summaries</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#005c55] text-[18px]">check_circle</span>
                <span>Ad-Free zero latency experience</span>
              </div>
            </div>
            <button
              onClick={() => {
                updateUserProfile({ isPremium: true });
                setShowPremiumModal(false);
              }}
              className="w-full py-3 bg-[#005c55] hover:bg-[#0f766e] text-white font-semibold text-[15px] rounded-xl shadow-md"
            >
              Activate Lifetime Pro (Demo)
            </button>
            <button
              onClick={() => setShowPremiumModal(false)}
              className="text-[13px] text-[#6e7977] hover:underline"
            >
              Maybe Later
            </button>
          </div>
        </div>
      )}

      {/* Manage Categories Modal */}
      {showCategoriesModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-xl border border-[#bdc9c6]/40 flex flex-col gap-3 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-[#eff4ff] pb-2">
              <h3 className="font-display text-[17px] font-bold text-[#0b1c30]">
                Manage Custom Categories
              </h3>
              <button
                onClick={() => setShowCategoriesModal(false)}
                className="text-[#6e7977] hover:text-[#0b1c30]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Add input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                placeholder="New Category tag..."
                className="flex-1 px-3 py-2 border border-[#bdc9c6] rounded-xl text-[14px]"
              />
              <button
                onClick={handleAddCustomCategory}
                className="px-3.5 py-2 bg-[#005c55] text-white rounded-xl font-semibold text-[13px]"
              >
                Add
              </button>
            </div>

            {/* Category list */}
            <div className="flex flex-col divide-y divide-[#eff4ff] mt-2">
              {categories.map((c) => (
                <div key={c.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-[#005c55] text-[18px]">
                      {c.icon}
                    </span>
                    <span className="text-[14px] font-medium text-[#0b1c30]">{c.name}</span>
                  </div>
                  {categories.length > 3 && (
                    <button
                      onClick={() => deleteCategory(c.id)}
                      className="text-[#ba1a1a] hover:bg-[#ffdad6] p-1 rounded-lg"
                      title="Delete category"
                    >
                      <span className="material-symbols-outlined text-[16px]">delete</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowCategoriesModal(false)}
              className="w-full py-2.5 bg-[#eff4ff] text-[#3e4947] font-semibold text-[13px] rounded-xl mt-2"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-xs p-5 shadow-xl border border-[#ba1a1a]/30 flex flex-col gap-4 text-center">
            <div className="w-12 h-12 rounded-full bg-[#ffdad6] text-[#ba1a1a] mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[28px]">warning</span>
            </div>
            <div>
              <h3 className="font-display text-[17px] font-bold text-[#ba1a1a]">
                Delete All Data?
              </h3>
              <p className="font-sans text-[13px] text-[#6e7977] mt-1">
                This will permanently remove all tracked transactions from your device.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 bg-[#eff4ff] text-[#3e4947] font-semibold text-[13px] rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  clearAllData();
                  setShowDeleteConfirm(false);
                }}
                className="flex-1 py-2.5 bg-[#ba1a1a] text-white font-semibold text-[13px] rounded-xl"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl w-full max-w-xs p-5 shadow-xl border border-[#bdc9c6]/40 flex flex-col gap-4 text-center animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-[#ffdad6] text-[#ba1a1a] mx-auto flex items-center justify-center">
              <span className="material-symbols-outlined text-[26px]">logout</span>
            </div>
            <div>
              <h3 className="font-display text-[18px] font-bold text-[#0b1c30]">
                Sign Out?
              </h3>
              <p className="font-sans text-[13px] text-[#6e7977] mt-1">
                You will be redirected to the sign-in screen. Your local data remains safely stored.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 bg-[#eff4ff] text-[#3e4947] font-semibold text-[13px] rounded-xl hover:bg-[#e5eeff] transition-colors"
              >
                Stay Signed In
              </button>
              <button
                onClick={() => {
                  setShowLogoutConfirm(false);
                  logout();
                }}
                className="flex-1 py-2.5 bg-[#ba1a1a] hover:bg-[#93000a] text-white font-semibold text-[13px] rounded-xl shadow-xs transition-colors"
              >
                Log Out
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Download Expenses Modal */}
      <DownloadExpensesModal
        isOpen={showDownloadModal}
        onClose={() => setShowDownloadModal(false)}
      />
    </div>
  );
};
