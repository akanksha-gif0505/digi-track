import { expenseRepository } from '../repositories/expense.repository';
import { categoryRepository } from '../repositories/category.repository';
import { budgetRepository } from '../repositories/budget.repository';
import { savingsConfigRepository, savingsGoalRepository } from '../repositories/savings.repository';
import { splitRepository } from '../repositories/split.repository';

export class SyncService {
  async pull(userId: string) {
    const expenses = await expenseRepository.findByUserId(userId);
    const categories = await categoryRepository.findAvailableForUser(userId);
    const budget = await budgetRepository.findByUserId(userId);
    const savingsConfig = await savingsConfigRepository.findByUserId(userId);
    const savingsGoals = await savingsGoalRepository.findByUserId(userId);
    const splitBills = await splitRepository.findByUserId(userId);

    return {
      expenses,
      categories,
      budget,
      savingsConfig,
      savingsGoals,
      splitBills,
      syncedAt: Date.now(),
    };
  }

  async push(
    userId: string,
    payload: {
      expenses?: any[];
      categories?: any[];
      budget?: any;
      savingsConfig?: any;
      savingsGoals?: any[];
      splitBills?: any[];
    }
  ) {
    let syncedCount = 0;

    // Upsert expenses
    if (Array.isArray(payload.expenses)) {
      for (const exp of payload.expenses) {
        if (exp.id && exp.title && exp.amount) {
          const existing = await expenseRepository.findById(exp.id);
          if (existing) {
            if (existing.userId === userId) {
              await expenseRepository.update(exp.id, exp);
              syncedCount++;
            }
          } else {
            await expenseRepository.create({ ...exp, userId });
            syncedCount++;
          }
        }
      }
    }

    // Update budget if provided
    if (payload.budget) {
      const existing = await budgetRepository.findByUserId(userId);
      if (existing) {
        await budgetRepository.update(existing.id, payload.budget);
      }
    }

    // Update savings config if provided
    if (payload.savingsConfig) {
      const existing = await savingsConfigRepository.findByUserId(userId);
      if (existing) {
        await savingsConfigRepository.update(existing.id, payload.savingsConfig);
      }
    }

    // Upsert splits
    if (Array.isArray(payload.splitBills)) {
      for (const split of payload.splitBills) {
        if (split.id && split.title && split.totalAmount) {
          const existing = await splitRepository.findById(split.id);
          if (existing) {
            if (existing.userId === userId) {
              await splitRepository.update(split.id, split);
              syncedCount++;
            }
          } else {
            await splitRepository.create({ ...split, userId });
            syncedCount++;
          }
        }
      }
    }

    return {
      success: true,
      syncedCount,
      syncedAt: Date.now(),
    };
  }
}

export const syncService = new SyncService();
