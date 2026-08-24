export interface BudgetModel {
  id: string;
  userId: string;
  totalMonthlyBudget: number;
  selectedMonth: string; // e.g. "October 2023" or "2026-08"
  categoryCaps: Record<string, number>;
  createdAt: number;
  updatedAt: number;
}
