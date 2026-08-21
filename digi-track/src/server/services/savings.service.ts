import { savingsConfigRepository, savingsGoalRepository } from '../repositories/savings.repository';
import { budgetRepository } from '../repositories/budget.repository';
import { expenseRepository } from '../repositories/expense.repository';
import { SavingsConfigModel, SavingsGoalModel, SavingsHealthStatus } from '../models/savings.model';
import { AppError } from '../middlewares/error.middleware';
import { HTTP_STATUS, ERROR_CODES } from '../constants/httpStatus';

export class SavingsService {
  async getSavingsDashboard(userId: string) {
    let config = await savingsConfigRepository.findByUserId(userId);
    if (!config) {
      config = await savingsConfigRepository.create({
        id: `sav-${userId}`,
        userId,
        monthlySalary: 60000,
        monthlySavingsGoal: 20000,
        emergencyFundReserve: 50000,
        savingsLockEnabled: true,
        autoDeductSavings: true,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
    }

    const goals = await savingsGoalRepository.findByUserId(userId);
    const expenses = await expenseRepository.findByUserId(userId);

    const totalSpentThisMonth = expenses.reduce((acc, curr) => acc + curr.amount, 0);

    const salary = config.monthlySalary || 0;
    const savingsGoal = config.monthlySavingsGoal || 0;
    const spendableBudget = Math.max(0, salary - savingsGoal);
    const remainingSpendableBudget = Math.max(0, spendableBudget - totalSpentThisMonth);

    // Savings intact and breach calculations
    let savingsIntactAmount = 0;
    let savingsBreachedAmount = 0;
    let deficitAmount = 0;
    let savingsHealth: SavingsHealthStatus = 'safe';

    if (totalSpentThisMonth > salary) {
      savingsHealth = 'deficit';
      deficitAmount = totalSpentThisMonth - salary;
      savingsIntactAmount = 0;
      savingsBreachedAmount = savingsGoal;
    } else if (totalSpentThisMonth > spendableBudget) {
      savingsHealth = 'breached';
      savingsBreachedAmount = Math.min(savingsGoal, totalSpentThisMonth - spendableBudget);
      savingsIntactAmount = Math.max(0, salary - totalSpentThisMonth);
    } else {
      savingsIntactAmount = savingsGoal;
      savingsBreachedAmount = 0;
      if (spendableBudget > 0 && totalSpentThisMonth / spendableBudget >= 0.95) {
        savingsHealth = 'borderline';
      } else if (spendableBudget > 0 && totalSpentThisMonth / spendableBudget >= 0.75) {
        savingsHealth = 'caution';
      } else {
        savingsHealth = 'safe';
      }
    }

    const savingsPercentagePreserved = savingsGoal > 0 ? Math.max(0, Math.min(100, Math.round((savingsIntactAmount / savingsGoal) * 100))) : 100;

    // Safe spend today calculation
    const now = new Date();
    const totalDaysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const currentDay = now.getDate();
    const remainingDays = Math.max(1, totalDaysInMonth - currentDay + 1);
    const safeSpendToday = Math.max(0, Math.round(remainingSpendableBudget / remainingDays));

    return {
      config,
      monthlySalary: salary,
      monthlySavingsGoal: savingsGoal,
      spendableBudget,
      totalSpentThisMonth,
      remainingSpendableBudget,
      savingsIntactAmount,
      savingsBreachedAmount,
      deficitAmount,
      savingsHealth,
      savingsPercentagePreserved,
      safeSpendToday,
      savingsGoals: goals,
    };
  }

  async updateSavingsConfig(
    userId: string,
    updates: Partial<Omit<SavingsConfigModel, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<SavingsConfigModel> {
    const existing = await savingsConfigRepository.findByUserId(userId);
    if (!existing) {
      throw new AppError('Savings config not found.', HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    const updated = await savingsConfigRepository.update(existing.id, updates);

    // If salary or savings goal changed, update spendable budget
    if (updates.monthlySalary !== undefined || updates.monthlySavingsGoal !== undefined) {
      const salary = updated!.monthlySalary || 0;
      const goal = updated!.monthlySavingsGoal || 0;
      const newSpendable = Math.max(0, salary - goal);

      const budget = await budgetRepository.findByUserId(userId);
      if (budget) {
        await budgetRepository.update(budget.id, { totalMonthlyBudget: newSpendable });
      }
    }

    return updated!;
  }

  async addSavingsGoal(
    userId: string,
    data: {
      name: string;
      targetAmount: number;
      currentAmount?: number;
      targetDate?: string;
      category?: 'emergency' | 'vacation' | 'investment' | 'purchase' | 'general';
      icon?: string;
    }
  ): Promise<SavingsGoalModel> {
    if (!data.name || !data.name.trim()) {
      throw new AppError('Goal name is required.', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }
    if (typeof data.targetAmount !== 'number' || data.targetAmount <= 0) {
      throw new AppError('Target amount must be greater than 0.', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const now = Date.now();
    const id = `goal-${now}-${Math.random().toString(36).substr(2, 4)}`;

    const newGoal: SavingsGoalModel = {
      id,
      userId,
      name: data.name.trim(),
      targetAmount: data.targetAmount,
      currentAmount: data.currentAmount || 0,
      targetDate: data.targetDate || undefined,
      category: data.category || 'general',
      icon: data.icon || 'savings',
      createdAt: now,
      updatedAt: now,
    };

    return savingsGoalRepository.create(newGoal);
  }

  async updateSavingsGoal(
    userId: string,
    id: string,
    updates: Partial<Omit<SavingsGoalModel, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>
  ): Promise<SavingsGoalModel> {
    const existing = await savingsGoalRepository.findById(id);
    if (!existing || existing.userId !== userId) {
      throw new AppError('Savings goal not found.', HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    const updated = await savingsGoalRepository.update(id, updates);
    return updated!;
  }

  async deleteSavingsGoal(userId: string, id: string): Promise<boolean> {
    const existing = await savingsGoalRepository.findById(id);
    if (!existing || existing.userId !== userId) {
      throw new AppError('Savings goal not found.', HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }
    return savingsGoalRepository.delete(id);
  }

  async depositToGoal(userId: string, id: string, amount: number): Promise<SavingsGoalModel> {
    if (typeof amount !== 'number' || amount <= 0) {
      throw new AppError('Deposit amount must be greater than 0.', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    }

    const goal = await savingsGoalRepository.findById(id);
    if (!goal || goal.userId !== userId) {
      throw new AppError('Savings goal not found.', HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    }

    const updated = await savingsGoalRepository.update(id, {
      currentAmount: goal.currentAmount + amount,
    });

    return updated!;
  }
}

export const savingsService = new SavingsService();
