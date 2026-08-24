import React, { useState, useRef, useEffect } from 'react';
import { useExpense } from '../context/ExpenseContext';

interface HeaderProps {
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenProfile }) => {
  const { userProfile, syncStatus, triggerSync, setActiveTab, logout } = useExpense();
  const [showSyncTooltip, setShowSyncTooltip] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="w-full sticky top-0 bg-white shadow-sm z-40 border-b border-[#eff4ff]">
      <div className="flex justify-between items-center px-4 py-3 w-full max-w-5xl mx-auto">
        {/* Brand */}
        <div
          className="flex items-center gap-2 cursor-pointer select-none group"
          onClick={() => setActiveTab('dashboard')}
        >
          <div className="w-9 h-9 rounded-full bg-[#005c55]/10 flex items-center justify-center text-[#005c55] group-hover:bg-[#005c55]/15 transition-colors flex-shrink-0">
            <span className="material-symbols-outlined fill-1 text-[22px] text-[#005c55]">
              account_balance_wallet
            </span>
          </div>
          <div className="flex flex-col">
            <h1 className="font-display text-[18px] sm:text-[20px] leading-[24px] font-bold text-[#005c55] tracking-tight whitespace-nowrap">
              Digi Track
            </h1>
            <span className="text-[10px] text-[#6e7977] font-medium leading-none hidden sm:inline">
              Daily Expense & Budget
            </span>
          </div>
        </div>

        {/* Right Section: Sync status & User Avatar */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Sync indicator */}
          <button
            onClick={triggerSync}
            onMouseEnter={() => setShowSyncTooltip(true)}
            onMouseLeave={() => setShowSyncTooltip(false)}
            title="Click to sync offline data"
            className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-xs font-medium bg-[#eff4ff] hover:bg-[#e5eeff] text-[#005c55] transition-all relative border border-[#bdc9c6]/40"
          >
            <span
              className={`material-symbols-outlined text-[16px] ${
                syncStatus === 'syncing' ? 'animate-spin text-[#fd761a]' : 'text-[#005c55]'
              }`}
            >
              {syncStatus === 'syncing' ? 'sync' : syncStatus === 'offline' ? 'wifi_off' : 'cloud_done'}
            </span>
            <span className="hidden sm:inline whitespace-nowrap">
              {syncStatus === 'syncing' ? 'Syncing...' : syncStatus === 'offline' ? 'Offline Mode' : 'Synced'}
            </span>
            
            {showSyncTooltip && (
              <div className="absolute top-full right-0 mt-1 px-2.5 py-1 bg-[#0b1c30] text-white text-[11px] rounded shadow-lg whitespace-nowrap z-50 animate-in fade-in">
                Offline-First: All changes saved locally & auto-synced
              </div>
            )}
          </button>

          {/* User Profile / Auth State */}
          {userProfile.isAuthenticated ? (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="w-9 h-9 rounded-full overflow-hidden border-2 border-[#bdc9c6] hover:border-[#005c55] transition-colors focus:outline-none focus:ring-2 focus:ring-[#005c55]/30 flex items-center justify-center flex-shrink-0"
                title={`${userProfile.name} - Account Menu`}
              >
                <img
                  src={userProfile.avatarUrl}
                  alt={userProfile.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>

              {/* User Dropdown Menu */}
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-[#bdc9c6]/40 p-2 z-50 animate-in fade-in zoom-in-95">
                  <div className="p-2.5 border-b border-[#eff4ff] flex items-center gap-2.5">
                    <img
                      src={userProfile.avatarUrl}
                      alt={userProfile.name}
                      className="w-9 h-9 rounded-full object-cover border border-[#bdc9c6] flex-shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col overflow-hidden flex-1 min-w-0">
                      <span className="text-[13px] font-bold text-[#0b1c30] truncate">
                        {userProfile.name}
                      </span>
                      <span className="text-[11px] text-[#6e7977] truncate">
                        {userProfile.email}
                      </span>
                    </div>
                  </div>

                  <div className="py-1 flex flex-col gap-0.5">
                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        if (onOpenProfile) onOpenProfile();
                        else setActiveTab('settings');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-[#0b1c30] hover:bg-[#eff4ff] rounded-xl transition-colors text-left"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#005c55]">
                        settings
                      </span>
                      <span>Account Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        setActiveTab('auth');
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-medium text-[#0b1c30] hover:bg-[#eff4ff] rounded-xl transition-colors text-left"
                    >
                      <span className="material-symbols-outlined text-[18px] text-[#004eaa]">
                        switch_account
                      </span>
                      <span>Switch Account / Sign In</span>
                    </button>

                    <div className="border-t border-[#eff4ff] my-1" />

                    <button
                      onClick={() => {
                        setShowUserMenu(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-[13px] font-semibold text-[#ba1a1a] hover:bg-[#ffdad6]/40 rounded-xl transition-colors text-left"
                    >
                      <span className="material-symbols-outlined text-[18px]">logout</span>
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setActiveTab('auth')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#005c55] hover:bg-[#004d47] text-white rounded-xl text-[13px] font-bold shadow-xs transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[16px]">login</span>
              <span className="hidden sm:inline">Sign In</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
