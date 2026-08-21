import React, { useState } from 'react';
import { ExpenseProvider, useExpense } from './context/ExpenseContext';
import { Header } from './components/Header';
import { BottomNav, DesktopSidebar } from './components/Navigation';
import { OnboardingScreen } from './components/OnboardingScreen';
import { DashboardScreen } from './components/DashboardScreen';
import { HistoryScreen } from './components/HistoryScreen';
import { AddExpenseScreen } from './components/AddExpenseScreen';
import { BudgetScreen } from './components/BudgetScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { SplitExpenseScreen } from './components/SplitExpenseScreen';
import { SavingsScreen } from './components/SavingsScreen';
import { AuthScreen } from './components/AuthScreen';
import { ArchitectureModal } from './components/ArchitectureModal';

const AppContent: React.FC = () => {
  const { activeTab, setActiveTab, userProfile } = useExpense();
  const [showArchModal, setShowArchModal] = useState(false);

  if (activeTab === 'onboarding') {
    return <OnboardingScreen />;
  }

  // If user is not authenticated or explicitly navigated to auth tab
  if (!userProfile.isAuthenticated || activeTab === 'auth') {
    return (
      <AuthScreen
        initialMode={userProfile.isAuthenticated ? 'signin' : 'signin'}
        onSuccess={() => setActiveTab('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#0b1c30] flex flex-col antialiased">
      {/* Desktop Sidebar (visible on md+) */}
      <DesktopSidebar />

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 flex flex-col min-h-screen">
        {/* Sticky Header */}
        <Header onOpenProfile={() => setActiveTab('settings')} />

        {/* Dynamic Screen View */}
        <main className="flex-1 flex flex-col relative w-full">
          {activeTab === 'dashboard' && <DashboardScreen />}
          {activeTab === 'savings' && <SavingsScreen />}
          {activeTab === 'history' && <HistoryScreen />}
          {activeTab === 'add' && <AddExpenseScreen />}
          {activeTab === 'split' && <SplitExpenseScreen />}
          {activeTab === 'budget' && <BudgetScreen />}
          {activeTab === 'settings' && (
            <SettingsScreen onOpenArchitecture={() => setShowArchModal(true)} />
          )}
        </main>

        {/* Bottom Navigation Bar on Mobile */}
        <BottomNav />
      </div>

      {/* Architecture Modal */}
      <ArchitectureModal
        isOpen={showArchModal}
        onClose={() => setShowArchModal(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ExpenseProvider>
      <AppContent />
    </ExpenseProvider>
  );
}
