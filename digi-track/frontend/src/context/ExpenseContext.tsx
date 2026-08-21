import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Expense, CategoryInfo, BudgetConfig, UserProfile, TabType, SplitBill, SavingsConfig, SavingsGoal } from '../types';
import { DEFAULT_CATEGORIES, INITIAL_EXPENSES, DEFAULT_BUDGET, DEFAULT_USER_PROFILE, INITIAL_SPLITS, DEFAULT_SAVINGS_CONFIG } from '../data/initialData';

export type SavingsHealthStatus = 'safe' | 'caution' | 'borderline' | 'breached' | 'deficit';

interface ExpenseContextType {
  expenses: Expense[];
  categories: CategoryInfo[];
  budget: BudgetConfig;
  userProfile: UserProfile;
  splitBills: SplitBill[];
  savingsConfig: SavingsConfig;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt'>) => Expense;
  updateExpense: (id: string, updated: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  updateBudget: (newBudget: Partial<BudgetConfig>) => void;
  updateCategoryCap: (categoryId: string, cap: number) => void;
  addCategory: (category: Omit<CategoryInfo, 'id'>) => void;
  deleteCategory: (id: string) => void;
  updateUserProfile: (profile: Partial<UserProfile>) => void;
  updateSavingsConfig: (newConfig: Partial<SavingsConfig>) => void;
  addSavingsGoal: (goal: Omit<SavingsGoal, 'id'>) => SavingsGoal;
  updateSavingsGoal: (id: string, updated: Partial<SavingsGoal>) => void;
  deleteSavingsGoal: (id: string) => void;
  login: (email: string, name?: string, avatarUrl?: string) => void;
  logout: () => void;
  signup: (name: string, email: string, currencySymbol?: string, currencyCode?: string) => void;
  addSplitBill: (bill: Omit<SplitBill, 'id' | 'createdAt'>) => SplitBill;
  deleteSplitBill: (id: string) => void;
  toggleSettlementStatus: (splitId: string, settlementIndex: number) => void;
  settleDebt: (splitId: string, settlementIndex: number, paymentMode?: string, recordAsExpense?: boolean) => void;
  settleAllDebtsInBill: (splitId: string) => void;
  exportToCSV: (customExpenses?: Expense[]) => void;
  exportToJSON: (customExpenses?: Expense[]) => void;
  exportStatementText: (customExpenses?: Expense[]) => string;
  clearAllData: () => void;
  resetToDefaults: () => void;
  // Calculations
  totalSpentThisMonth: number;
  remainingBudget: number;
  budgetPercentage: number;
  spendableBudget: number;
  remainingSpendableBudget: number;
  savingsIntactAmount: number;
  savingsBreachedAmount: number;
  deficitAmount: number;
  savingsHealth: SavingsHealthStatus;
  savingsPercentagePreserved: number;
  categoryBreakdown: { category: CategoryInfo; total: number; percentage: number; cap: number; status: 'safe' | 'warning' | 'over' }[];
  safeSpendToday: number;
  formatCurrency: (amount: number) => string;
  isOnline: boolean;
  syncStatus: 'synced' | 'syncing' | 'offline';
  triggerSync: () => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_EXPENSES = 'digitrack_expenses_v2';
const LOCAL_STORAGE_KEY_CATEGORIES = 'digitrack_categories_v2';
const LOCAL_STORAGE_KEY_BUDGET = 'digitrack_budget_v2';
const LOCAL_STORAGE_KEY_PROFILE = 'digitrack_profile_v2';
const LOCAL_STORAGE_KEY_SPLITS = 'digitrack_splits_v2';
const LOCAL_STORAGE_KEY_SAVINGS = 'digitrack_savings_v2';

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_EXPENSES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_EXPENSES;
  });

  const [categories, setCategories] = useState<CategoryInfo[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_CATEGORIES);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_CATEGORIES;
  });

  const [budget, setBudget] = useState<BudgetConfig>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_BUDGET);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_BUDGET;
  });

  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_USER_PROFILE;
  });

  const [splitBills, setSplitBills] = useState<SplitBill[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SPLITS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return INITIAL_SPLITS;
  });

  const [savingsConfig, setSavingsConfig] = useState<SavingsConfig>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_SAVINGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return DEFAULT_SAVINGS_CONFIG;
  });

  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'syncing' | 'offline'>('synced');

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_EXPENSES, JSON.stringify(expenses));
    } catch (e) {
      console.error(e);
    }
  }, [expenses]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.error(e);
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_BUDGET, JSON.stringify(budget));
    } catch (e) {
      console.error(e);
    }
  }, [budget]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_PROFILE, JSON.stringify(userProfile));
    } catch (e) {
      console.error(e);
    }
  }, [userProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SPLITS, JSON.stringify(splitBills));
    } catch (e) {
      console.error(e);
    }
  }, [splitBills]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_SAVINGS, JSON.stringify(savingsConfig));
    } catch (e) {
      console.error(e);
    }
  }, [savingsConfig]);

  // Online / offline listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus('syncing');
      setTimeout(() => setSyncStatus('synced'), 1200);
    };
    const handleOffline = () => {
      setIsOnline(false);
      setSyncStatus('offline');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const triggerSync = () => {
    setSyncStatus('syncing');
    setTimeout(() => {
      setSyncStatus('synced');
    }, 900);
  };

  const addExpense = (expenseData: Omit<Expense, 'id' | 'createdAt'>): Expense => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      createdAt: Date.now(),
    };
    setExpenses((prev) => [newExpense, ...prev]);
    return newExpense;
  };

  const updateExpense = (id: string, updated: Partial<Expense>) => {
    setExpenses((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updated } : item))
    );
  };

  const deleteExpense = (id: string) => {
    setExpenses((prev) => prev.filter((item) => item.id !== id));
  };

  const updateBudget = (newBudget: Partial<BudgetConfig>) => {
    setBudget((prev) => ({ ...prev, ...newBudget }));
  };

  const updateCategoryCap = (categoryId: string, cap: number) => {
    setBudget((prev) => ({
      ...prev,
      categoryCaps: {
        ...prev.categoryCaps,
        [categoryId]: cap,
      },
    }));
  };

  const addCategory = (categoryData: Omit<CategoryInfo, 'id'>) => {
    const id = categoryData.name.toLowerCase().replace(/\s+/g, '-');
    const newCat: CategoryInfo = {
      ...categoryData,
      id,
    };
    setCategories((prev) => [...prev, newCat]);
    if (categoryData.defaultCap) {
      updateCategoryCap(id, categoryData.defaultCap);
    }
  };

  const deleteCategory = (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
  };

  const updateUserProfile = (profile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...profile }));
  };

  const updateSavingsConfig = (newConfig: Partial<SavingsConfig>) => {
    setSavingsConfig((prev) => {
      const updated = { ...prev, ...newConfig };
      // Also sync totalMonthlyBudget if salary or savings goal changes
      if (newConfig.monthlySalary !== undefined || newConfig.monthlySavingsGoal !== undefined) {
        const salary = updated.monthlySalary || 0;
        const goal = updated.monthlySavingsGoal || 0;
        const newSpendable = Math.max(0, salary - goal);
        setBudget((b) => ({ ...b, totalMonthlyBudget: newSpendable }));
      }
      return updated;
    });
  };

  const addSavingsGoal = (goalData: Omit<SavingsGoal, 'id'>): SavingsGoal => {
    const newGoal: SavingsGoal = {
      ...goalData,
      id: `goal-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };
    setSavingsConfig((prev) => ({
      ...prev,
      savingsGoals: [newGoal, ...prev.savingsGoals],
    }));
    return newGoal;
  };

  const updateSavingsGoal = (id: string, updated: Partial<SavingsGoal>) => {
    setSavingsConfig((prev) => ({
      ...prev,
      savingsGoals: prev.savingsGoals.map((g) => (g.id === id ? { ...g, ...updated } : g)),
    }));
  };

  const deleteSavingsGoal = (id: string) => {
    setSavingsConfig((prev) => ({
      ...prev,
      savingsGoals: prev.savingsGoals.filter((g) => g.id !== id),
    }));
  };

  const login = (email: string, name?: string, avatarUrl?: string) => {
    const formattedName = name || email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
    setUserProfile((prev) => ({
      ...prev,
      email,
      name: formattedName,
      avatarUrl: avatarUrl || prev.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isAuthenticated: true,
    }));
    setActiveTab('dashboard');
  };

  const logout = () => {
    setUserProfile((prev) => ({
      ...prev,
      isAuthenticated: false,
    }));
    setActiveTab('auth');
  };

  const signup = (name: string, email: string, currencySymbol = '₹', currencyCode = 'INR') => {
    setUserProfile((prev) => ({
      ...prev,
      name,
      email,
      currencySymbol,
      currencyCode,
      isAuthenticated: true,
    }));
    setActiveTab('dashboard');
  };

  const clearAllData = () => {
    setExpenses([]);
    setCategories(DEFAULT_CATEGORIES);
    setSplitBills([]);
    setSavingsConfig({ ...DEFAULT_SAVINGS_CONFIG, savingsGoals: [] });
    setBudget(DEFAULT_BUDGET);
    localStorage.removeItem(LOCAL_STORAGE_KEY_EXPENSES);
    localStorage.removeItem(LOCAL_STORAGE_KEY_CATEGORIES);
    localStorage.removeItem(LOCAL_STORAGE_KEY_SPLITS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_SAVINGS);
    localStorage.removeItem(LOCAL_STORAGE_KEY_BUDGET);
  };

  const resetToDefaults = () => {
    setExpenses(INITIAL_EXPENSES);
    setCategories(DEFAULT_CATEGORIES);
    setBudget(DEFAULT_BUDGET);
    setUserProfile(DEFAULT_USER_PROFILE);
    setSavingsConfig(DEFAULT_SAVINGS_CONFIG);
  };

  // Currency Formatter
  const formatCurrency = (amount: number): string => {
    const formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 2,
    }).format(amount);
    return `${userProfile.currencySymbol}${formatted}`;
  };

  // Computations
  const totalSpentThisMonth = useMemo(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-indexed
    return expenses
      .filter((e) => {
        const d = new Date(e.date);
        return d.getFullYear() === year && d.getMonth() === month;
      })
      .reduce((acc, curr) => acc + curr.amount, 0);
  }, [expenses]);

  // Savings & Discretionary Calculations
  const spendableBudget = useMemo(() => {
    const salary = savingsConfig.monthlySalary || 0;
    const savings = savingsConfig.monthlySavingsGoal || 0;
    return Math.max(0, salary - savings);
  }, [savingsConfig.monthlySalary, savingsConfig.monthlySavingsGoal]);

  const remainingSpendableBudget = useMemo(() => {
    return Math.max(0, spendableBudget - totalSpentThisMonth);
  }, [spendableBudget, totalSpentThisMonth]);

  const savingsIntactAmount = useMemo(() => {
    const salary = savingsConfig.monthlySalary || 0;
    const savingsGoal = savingsConfig.monthlySavingsGoal || 0;
    if (totalSpentThisMonth <= spendableBudget) {
      return savingsGoal;
    } else if (totalSpentThisMonth <= salary) {
      return Math.max(0, salary - totalSpentThisMonth);
    }
    return 0;
  }, [savingsConfig.monthlySalary, savingsConfig.monthlySavingsGoal, spendableBudget, totalSpentThisMonth]);

  const savingsBreachedAmount = useMemo(() => {
    const savingsGoal = savingsConfig.monthlySavingsGoal || 0;
    if (totalSpentThisMonth > spendableBudget) {
      return Math.min(savingsGoal, totalSpentThisMonth - spendableBudget);
    }
    return 0;
  }, [spendableBudget, totalSpentThisMonth, savingsConfig.monthlySavingsGoal]);

  const deficitAmount = useMemo(() => {
    const salary = savingsConfig.monthlySalary || 0;
    if (totalSpentThisMonth > salary) {
      return totalSpentThisMonth - salary;
    }
    return 0;
  }, [savingsConfig.monthlySalary, totalSpentThisMonth]);

  const savingsHealth = useMemo((): SavingsHealthStatus => {
    const salary = savingsConfig.monthlySalary || 0;
    if (totalSpentThisMonth > salary) {
      return 'deficit';
    }
    if (totalSpentThisMonth > spendableBudget) {
      return 'breached';
    }
    if (spendableBudget > 0 && totalSpentThisMonth / spendableBudget >= 0.95) {
      return 'borderline';
    }
    if (spendableBudget > 0 && totalSpentThisMonth / spendableBudget >= 0.75) {
      return 'caution';
    }
    return 'safe';
  }, [savingsConfig.monthlySalary, spendableBudget, totalSpentThisMonth]);

  const savingsPercentagePreserved = useMemo(() => {
    const goal = savingsConfig.monthlySavingsGoal || 0;
    if (goal <= 0) return 100;
    return Math.max(0, Math.min(100, Math.round((savingsIntactAmount / goal) * 100)));
  }, [savingsIntactAmount, savingsConfig.monthlySavingsGoal]);

  const remainingBudget = useMemo(() => {
    // If user configured spendableBudget, prioritize that
    const effectiveBudget = spendableBudget > 0 ? spendableBudget : budget.totalMonthlyBudget;
    return Math.max(0, effectiveBudget - totalSpentThisMonth);
  }, [spendableBudget, budget.totalMonthlyBudget, totalSpentThisMonth]);

  const budgetPercentage = useMemo(() => {
    const effectiveBudget = spendableBudget > 0 ? spendableBudget : budget.totalMonthlyBudget;
    if (effectiveBudget <= 0) return 0;
    return Math.min(100, Math.round((totalSpentThisMonth / effectiveBudget) * 100));
  }, [totalSpentThisMonth, spendableBudget, budget.totalMonthlyBudget]);

  const categoryBreakdown = useMemo(() => {
    const totals: Record<string, number> = {};
    expenses.forEach((exp) => {
      totals[exp.category] = (totals[exp.category] || 0) + exp.amount;
    });

    return categories.map((cat) => {
      const total = totals[cat.id] || 0;
      const percentage = totalSpentThisMonth > 0 ? Math.round((total / totalSpentThisMonth) * 100) : 0;
      const cap = budget.categoryCaps[cat.id] || cat.defaultCap || 5000;
      let status: 'safe' | 'warning' | 'over' = 'safe';
      if (total > cap) {
        status = 'over';
      } else if (cap > 0 && total / cap >= 0.85) {
        status = 'warning';
      }

      return {
        category: cat,
        total,
        percentage,
        cap,
        status,
      };
    });
  }, [categories, expenses, totalSpentThisMonth, budget.categoryCaps]);

  const safeSpendToday = useMemo(() => {
    const now = new Date();
    const totalDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const currentDay = now.getDate();
    const remainingDays = Math.max(1, totalDaysInMonth - currentDay + 1);
    const safeDaily = Math.round(remainingBudget / remainingDays);
    return safeDaily > 0 ? safeDaily : 0;
  }, [remainingBudget]);

  const addSplitBill = (bill: Omit<SplitBill, 'id' | 'createdAt'>): SplitBill => {
    const newBill: SplitBill = {
      ...bill,
      id: `split-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      createdAt: Date.now(),
    };
    setSplitBills((prev) => [newBill, ...prev]);
    return newBill;
  };

  const deleteSplitBill = (id: string) => {
    setSplitBills((prev) => prev.filter((s) => s.id !== id));
  };

  const toggleSettlementStatus = (splitId: string, settlementIndex: number) => {
    setSplitBills((prev) =>
      prev.map((split) => {
        if (split.id !== splitId) return split;
        const updatedSettlements = [...split.settlements];
        if (updatedSettlements[settlementIndex]) {
          const wasSettled = !!updatedSettlements[settlementIndex].settled;
          updatedSettlements[settlementIndex] = {
            ...updatedSettlements[settlementIndex],
            settled: !wasSettled,
            settledAt: !wasSettled ? Date.now() : undefined,
          };
        }
        return {
          ...split,
          settlements: updatedSettlements,
        };
      })
    );
  };

  const settleDebt = (
    splitId: string,
    settlementIndex: number,
    paymentMode: string = 'UPI',
    recordAsExpense: boolean = false
  ) => {
    setSplitBills((prev) =>
      prev.map((split) => {
        if (split.id !== splitId) return split;
        const updatedSettlements = [...split.settlements];
        const targetDebt = updatedSettlements[settlementIndex];
        if (targetDebt) {
          updatedSettlements[settlementIndex] = {
            ...targetDebt,
            settled: true,
            settledAt: Date.now(),
            settledPaymentMode: paymentMode,
          };

          // If user ('You') is the one paying and requested to log as expense
          if (recordAsExpense && (targetDebt.from === 'You' || targetDebt.from.toLowerCase() === 'you')) {
            const billTitle = split.title || 'Split Bill';
            const now = new Date();
            const newExpense: Expense = {
              id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
              title: `Settled with ${targetDebt.to}: ${billTitle}`,
              amount: Math.round(targetDebt.amount),
              category: split.category || 'other',
              date: now.toISOString().split('T')[0],
              time: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
              paymentMode: (['Cash', 'UPI', 'Card', 'NetBanking'].includes(paymentMode) ? paymentMode : 'UPI') as Expense['paymentMode'],
              note: `Split bill settlement paid to ${targetDebt.to} for "${billTitle}"`,
              createdAt: Date.now(),
            };
            setExpenses((ePrev) => [newExpense, ...ePrev]);
          }
        }
        return {
          ...split,
          settlements: updatedSettlements,
        };
      })
    );
  };

  const settleAllDebtsInBill = (splitId: string) => {
    setSplitBills((prev) =>
      prev.map((split) => {
        if (split.id !== splitId) return split;
        return {
          ...split,
          settlements: split.settlements.map((s) => ({
            ...s,
            settled: true,
            settledAt: Date.now(),
            settledPaymentMode: s.settledPaymentMode || 'UPI',
          })),
        };
      })
    );
  };

  const exportToCSV = (customExpenses?: Expense[]) => {
    const list = customExpenses || expenses;
    const headers = ['ID', 'Title', 'Amount', 'Currency', 'Category', 'Date', 'Time', 'Payment Mode', 'Notes'];
    const rows = list.map((e) => [
      `"${e.id}"`,
      `"${e.title.replace(/"/g, '""')}"`,
      e.amount,
      `"${userProfile.currencyCode}"`,
      `"${e.category}"`,
      `"${e.date}"`,
      `"${e.time}"`,
      `"${e.paymentMode}"`,
      `"${(e.note || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `digi_track_expenses_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToJSON = (customExpenses?: Expense[]) => {
    const list = customExpenses || expenses;
    const exportData = {
      appName: 'Digi Track - Daily Expense & Budget',
      exportedAt: new Date().toISOString(),
      user: {
        name: userProfile.name,
        email: userProfile.email,
        currency: userProfile.currencyCode,
        currencySymbol: userProfile.currencySymbol,
      },
      summary: {
        totalTransactions: list.length,
        totalSpent: list.reduce((sum, item) => sum + item.amount, 0),
        monthlyBudget: budget.totalMonthlyBudget,
      },
      expenses: list,
      categories: categories,
      splits: splitBills,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(exportData, null, 2));
    const link = document.createElement('a');
    link.setAttribute('href', dataStr);
    link.setAttribute('download', `digi_track_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportStatementText = (customExpenses?: Expense[]): string => {
    const list = customExpenses || expenses;
    const total = list.reduce((s, e) => s + e.amount, 0);
    const now = new Date();
    
    let text = `========================================\n`;
    text += `       DIGI TRACK EXPENSE STATEMENT     \n`;
    text += `========================================\n`;
    text += `Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}\n`;
    text += `User: ${userProfile.name} (${userProfile.email})\n`;
    text += `Total Expenses: ${list.length}\n`;
    text += `Total Amount Spent: ${formatCurrency(total)}\n`;
    text += `Monthly Budget Cap: ${formatCurrency(budget.totalMonthlyBudget)}\n`;
    text += `----------------------------------------\n\n`;
    
    text += `TRANSACTION BREAKDOWN:\n`;
    list.forEach((e, idx) => {
      const catObj = categories.find((c) => c.id.toLowerCase() === e.category.toLowerCase());
      const catName = catObj ? catObj.name : e.category;
      text += `${idx + 1}. [${e.date} ${e.time}] ${e.title} - ${formatCurrency(e.amount)} (${catName}, ${e.paymentMode})\n`;
      if (e.note) text += `   Note: ${e.note}\n`;
    });

    text += `\n========================================\n`;
    text += `End of Statement - Digi Track\n`;
    return text;
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        categories,
        budget,
        userProfile,
        splitBills,
        savingsConfig,
        activeTab,
        setActiveTab,
        addExpense,
        updateExpense,
        deleteExpense,
        updateBudget,
        updateCategoryCap,
        addCategory,
        deleteCategory,
        updateUserProfile,
        updateSavingsConfig,
        addSavingsGoal,
        updateSavingsGoal,
        deleteSavingsGoal,
        login,
        logout,
        signup,
        addSplitBill,
        deleteSplitBill,
        toggleSettlementStatus,
        settleDebt,
        settleAllDebtsInBill,
        exportToCSV,
        exportToJSON,
        exportStatementText,
        clearAllData,
        resetToDefaults,
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
        safeSpendToday,
        formatCurrency,
        isOnline,
        syncStatus,
        triggerSync,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
};

export const useExpense = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpense must be used within an ExpenseProvider');
  }
  return context;
};
