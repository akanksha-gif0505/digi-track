export type SavingsHealthStatus = 'safe' | 'caution' | 'borderline' | 'breached' | 'deficit';

export interface SavingsConfigModel {
  id: string;
  userId: string;
  monthlySalary: number;
  monthlySavingsGoal: number;
  emergencyFundReserve: number;
  savingsLockEnabled: boolean;
  autoDeductSavings: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface SavingsGoalModel {
  id: string;
  userId: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate?: string;
  category?: 'emergency' | 'vacation' | 'investment' | 'purchase' | 'general';
  icon?: string;
  createdAt: number;
  updatedAt: number;
}
