import { budgetRepository } from '../repositories/budget.repository';
import { expenseRepository } from '../repositories/expense.repository';
import { categoryRepository } from '../repositories/category.repository';
import { savingsConfigRepository } from '../repositories/savings.repository';
import { BudgetModel } from '../models/budget.model';
import { AppError } from '../middlewares/error.middleware';
import { HTTP_STATUS, ERROR_CODES } from '../constants/httpStatus';

export class BudgetService {
  async getBudget(userId: string) {
    const now = new Date();
    let budget = await budgetRepository.findByUserId(userId);
    const savingsConfig = await savingsConfigRepository.findByUserId(userId);
    if (!budget) {
      const spendable = savingsConfig ? Math.max(0, savingsConfig.monthlySalary - savingsConfig.monthlySavingsGoal) : 40000;
      budget = await budgetRepository.create({ id: `bud-${userId}`, userId, totalMonthlyBudget: spendable, selectedMonth: `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`, categoryCaps: { food: 10000, shopping: 20000, travel: 5000, entertainment: 4000, housing: 20000, utilities: 5000, transport: 5000, other: 3000 }, createdAt: Date.now(), updatedAt: Date.now() });
    }
    const expenses = await expenseRepository.findByUserId(userId);
    const categories = await categoryRepository.findAvailableForUser(userId);
    const totalSpentThisMonth = expenses.reduce((s, e) => s + e.amount, 0);
    const effectiveBudget = savingsConfig ? Math.max(0, savingsConfig.monthlySalary - savingsConfig.monthlySavingsGoal) || budget.totalMonthlyBudget : budget.totalMonthlyBudget;
    const remainingBudget = Math.max(0, effectiveBudget - totalSpentThisMonth);
    const budgetPercentage = effectiveBudget > 0 ? Math.min(100, Math.round((totalSpentThisMonth / effectiveBudget) * 100)) : 0;
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const safeSpendToday = Math.max(0, Math.round(remainingBudget / Math.max(1, daysInMonth - now.getDate() + 1)));
    const catTotals: Record<string, number> = {};
    expenses.forEach((e) => { catTotals[e.category] = (catTotals[e.category] || 0) + e.amount; });
    const categoryBreakdown = categories.map((cat) => {
      const total = catTotals[cat.id] || 0;
      const cap = budget!.categoryCaps[cat.id] || cat.defaultCap || 5000;
      return { category: cat, total, percentage: totalSpentThisMonth > 0 ? Math.round((total / totalSpentThisMonth) * 100) : 0, cap, status: total > cap ? 'over' : cap > 0 && total / cap >= 0.85 ? 'warning' : 'safe' as 'safe' | 'warning' | 'over' };
    });
    return { budget, totalSpentThisMonth, remainingBudget, budgetPercentage, safeSpendToday, categoryBreakdown };
  }

  async updateBudget(userId: string, updates: Partial<Omit<BudgetModel, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>): Promise<BudgetModel> {
    const existing = await budgetRepository.findByUserId(userId);
    if (!existing) throw new AppError('Budget config not found.', HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    const updated = await budgetRepository.update(existing.id, updates);
    if (!updated) throw new AppError('Failed to update budget.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    return updated;
  }

  async updateCategoryCap(userId: string, categoryId: string, cap: number): Promise<BudgetModel> {
    const existing = await budgetRepository.findByUserId(userId);
    if (!existing) throw new AppError('Budget config not found.', HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    return (await budgetRepository.update(existing.id, { categoryCaps: { ...existing.categoryCaps, [categoryId]: Math.max(0, cap) } }))!;
  }
}

export const budgetService = new BudgetService();
