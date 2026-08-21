import { budgetRepository } from '../repositories/budget.repository';
import { expenseRepository } from '../repositories/expense.repository';
import { categoryRepository } from '../repositories/category.repository';
import { savingsConfigRepository } from '../repositories/savings.repository';
import { BudgetModel } from '../models/budget.model';
import { AppError } from '../middlewares/error.middleware';
import { HTTP_STATUS, ERROR_CODES } from '../constants/httpStatus';

export class BudgetService {
  async getBudget(userId: string) {
    let budget = await budgetRepository.findByUserId(userId);
    const savingsConfig = await savingsConfigRepository.findByUserId(userId);

    const now = new Date();
    const currentMonthLabel = `${now.toLocaleString('default', { month: 'long' })} ${now.getFullYear()}`;

    if (!budget) {
      const spendable = savingsConfig ? Math.max(0, savingsConfig.monthlySalary - savingsConfig.monthlySavingsGoal) : 40000;
      budget = await budgetRepository.create({
        id: `bud-${userId}`,
        userId,
        totalMonthlyBudget: spendable,
        selectedMonth: currentMonthLabel,
        categoryCaps: {
          food: 10000,
          shopping: 20000,
          travel: 5000,
          entertainment: 4000,
          housing: 20000,
          utilities: 5000,
          transport: 5000,
          other: 3000,
        },
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    const expenses = await expenseRepository.findByUserId(userId);
    const categories = await categoryRepository.findAvailableForUser(userId);

    const totalSpentThisMonth = expenses.reduce((acc, curr) => acc + curr.amount, 0);
    const spendableBudget = savingsConfig ? Math.max(0, savingsConfig.monthlySalary - savingsConfig.monthlySavingsGoal) : budget.totalMonthlyBudget;
    const effectiveBudget = spendableBudget > 0 ? spendableBudget : budget.totalMonthlyBudget;

    const remainingBudget = Math.max(0, effectiveBudget - totalSpentThisMonth);
    const budgetPercentage = effectiveBudget > 0 ? Math.min(100, Math.round((totalSpentThisMonth / effectiveBudget) * 100)) : 0;

    // Safe spend today calculation
    const totalDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const currentDay = now.getDate();
    const remainingDays = Math.max(1, totalDaysInMonth - currentDay + 1);
    const safeSpendToday = Math.max(0, Math.round(remainingBudget / remainingDays));

    // Category breakdown with caps and status
    const categoryTotals: Record<string, number> = {};
    expenses.forEach((exp) => {
      categoryTotals[exp.category] = (categoryTotals[exp.category] || 0) + exp.amount;
    });

    const categoryBreakdown = categories.map((cat) => {
      const total = categoryTotals[cat.id] || 0;
      const percentage = totalSpentThisMonth > 0 ? Math.round((total / totalSpentThisMonth) * 100) : 0;
      const cap = budget!.categoryCaps[cat.id] || cat.defaultCap || 5000;
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

    return {
      budget,
      totalSpentThisMonth,
      remainingBudget,
      budgetPercentage,
      safeSpendToday,
      categoryBreakdown,
    };
  }

  async updateBudget(
    userId: string,
    updates: Partial<Omit<BudgetModel, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<BudgetModel> {
    const existing = await budgetRepository.findByUserId(userId);
    if (!existing) {
      throw new AppError('Budget config not found.', HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    const updated = await budgetRepository.update(existing.id, updates);
    if (!updated) {
      throw new AppError('Failed to update budget.', HTTP_STATUS.INTERNAL_SERVER_ERROR);
    }
    return updated;
  }

  async updateCategoryCap(userId: string, categoryId: string, cap: number): Promise<BudgetModel> {
    const existing = await budgetRepository.findByUserId(userId);
    if (!existing) {
      throw new AppError('Budget config not found.', HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    const updated = await budgetRepository.update(existing.id, {
      categoryCaps: {
        ...existing.categoryCaps,
        [categoryId]: Math.max(0, cap),
      },
    });

    return updated!;
  }
}

export const budgetService = new BudgetService();
