export type PaymentMode = 'Cash' | 'UPI' | 'Card' | 'NetBanking';

export interface Expense {
  id: string;
  title: string;
  amount: number;
  category: string;
  date: string; // YYYY-MM-DD
  time: string; // e.g. "10:42 AM"
  paymentMode: PaymentMode;
  note?: string;
  createdAt: number;
}

export interface CategoryInfo {
  id: string;
  name: string;
  icon: string;
  bgClass: string;
  iconColorClass: string;
  badgeBgClass: string;
  badgeTextClass: string;
  colorHex: string;
  defaultCap: number;
}

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  category?: 'emergency' | 'vacation' | 'investment' | 'purchase' | 'general';
  icon?: string;
}

export interface SavingsConfig {
  monthlySalary: number;        // e.g. 60000
  monthlySavingsGoal: number;   // e.g. 20000
  emergencyFundReserve: number; // e.g. 50000
  savingsLockEnabled: boolean;  // Keeps savings strictly protected
  savingsGoals: SavingsGoal[];  // Custom sub-goals
  autoDeductSavings: boolean;   // Deducts savings from spendable budget on 1st of month
}

export interface BudgetConfig {
  totalMonthlyBudget: number;
  selectedMonth: string; // "October 2023" or YYYY-MM
  categoryCaps: Record<string, number>; // categoryId -> cap amount
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  currencySymbol: string;
  currencyCode: string;
  isPremium: boolean;
  onboarded: boolean;
  isAuthenticated: boolean;
  phone?: string;
  jobTitle?: string;
}

export interface SplitParticipant {
  id: string;
  name: string;
  avatarColor?: string;
  paidAmount: number;
  shareAmount: number;
  percentage?: number;
  exactAmount?: number;
  shares?: number;
  isCustom?: boolean;
}

export interface SettlementDebt {
  from: string; // Participant name who owes
  to: string;   // Participant name who gets paid (original payer)
  amount: number;
  settled?: boolean;
  settledAt?: number;
  settledPaymentMode?: string;
}

export interface SplitBill {
  id: string;
  title: string;
  totalAmount: number;
  category: string;
  date: string;
  splitType: 'equal' | 'exact' | 'percentage' | 'shares';
  participants: SplitParticipant[];
  settlements: SettlementDebt[];
  createdAt: number;
  notes?: string;
}

export type TabType = 'dashboard' | 'history' | 'add' | 'split' | 'savings' | 'budget' | 'settings' | 'onboarding' | 'auth';
