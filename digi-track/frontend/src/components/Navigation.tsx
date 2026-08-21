import React from 'react';
import { useExpense } from '../context/ExpenseContext';
import { TabType } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab } = useExpense();

  const navItems: { id: TabType; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Home', icon: 'dashboard' },
    { id: 'savings', label: 'Savings', icon: 'savings' },
    { id: 'add', label: 'Add', icon: 'add_circle' },
    { id: 'split', label: 'Split', icon: 'call_split' },
    { id: 'history', label: 'History', icon: 'history' },
    { id: 'budget', label: 'Budget', icon: 'account_balance' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-white shadow-[0px_-4px_16px_rgba(15,118,110,0.08)] border-t border-[#eff4ff] md:hidden">
      <div className="flex justify-around items-center px-1 py-1.5 w-full max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 min-w-[48px] py-1 px-1.5 rounded-xl ${
                isActive
                  ? 'bg-[#0f766e] text-[#a3faef] shadow-sm font-medium'
                  : 'text-[#3e4947] hover:bg-[#eff4ff] font-normal'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] ${isActive ? 'fill-1 text-white' : 'text-[#3e4947]'}`}
              >
                {item.icon}
              </span>
              <span
                className={`font-sans text-[10px] leading-tight mt-0.5 ${
                  isActive ? 'text-white font-bold' : 'text-[#3e4947]'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export const DesktopSidebar: React.FC = () => {
  const { activeTab, setActiveTab, userProfile } = useExpense();

  const navItems: { id: TabType; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'savings', label: 'Savings & Vault', icon: 'savings' },
    { id: 'split', label: 'Split Expenses', icon: 'call_split' },
    { id: 'history', label: 'History', icon: 'history' },
    { id: 'budget', label: 'Budget Plan', icon: 'account_balance' },
    { id: 'settings', label: 'Settings', icon: 'settings' },
  ];

  return (
    <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-64 bg-white shadow-sm z-30 pt-6 px-4 border-r border-[#eff4ff]">
      {/* Brand */}
      <div
        className="flex items-center gap-3 mb-8 px-2 cursor-pointer select-none"
        onClick={() => setActiveTab('dashboard')}
      >
        <div className="w-10 h-10 rounded-full bg-[#005c55]/10 flex items-center justify-center text-[#005c55]">
          <span className="material-symbols-outlined fill-1 text-[26px]">
            account_balance_wallet
          </span>
        </div>
        <div>
          <h1 className="font-display text-[22px] font-bold text-[#005c55] tracking-tight">
            Digi Track
          </h1>
          <span className="text-[11px] text-[#6e7977] font-medium">
            Smart Rupee Tracker
          </span>
        </div>
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1.5">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center gap-3.5 px-4 py-3 rounded-xl transition-all duration-150 text-left ${
                isActive
                  ? 'bg-[#0f766e] text-white font-semibold shadow-sm'
                  : 'text-[#3e4947] hover:bg-[#eff4ff] font-medium'
              }`}
            >
              <span
                className={`material-symbols-outlined text-[22px] ${
                  isActive ? 'fill-1 text-white' : 'text-[#3e4947]'
                }`}
              >
                {item.icon}
              </span>
              <span className="font-sans text-[15px]">{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User profile preview */}
      <div className="mt-auto pb-4 pt-4 border-t border-[#eff4ff]">
        <div
          onClick={() => setActiveTab('settings')}
          className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#eff4ff] cursor-pointer transition-colors mb-4"
        >
          <img
            src={userProfile.avatarUrl}
            alt={userProfile.name}
            className="w-10 h-10 rounded-full object-cover border border-[#bdc9c6]"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col overflow-hidden">
            <span className="font-sans text-[14px] font-semibold text-[#0b1c30] truncate">
              {userProfile.name}
            </span>
            <span className="font-sans text-[12px] text-[#6e7977] truncate">
              {userProfile.email}
            </span>
          </div>
        </div>

        {/* Big Add Expense Action Button */}
        <button
          onClick={() => setActiveTab('add')}
          className="w-full h-12 bg-[#005c55] hover:bg-[#0f766e] text-white rounded-full font-display text-[15px] font-semibold tracking-wide flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-98"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          Add Expense
        </button>
      </div>
    </aside>
  );
};
