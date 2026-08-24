export interface BudgetModel {
  id: string;
  userId: string;
  totalMonthlyBudget: number;
  selectedMonth: string;
  categoryCaps: Record<string, number>;
  createdAt: number;
  updatedAt: number;
}
