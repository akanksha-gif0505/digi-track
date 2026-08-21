import { expenseRepository } from '../repositories/expense.repository';
import { categoryRepository } from '../repositories/category.repository';
import { budgetRepository } from '../repositories/budget.repository';
import { savingsConfigRepository, savingsGoalRepository } from '../repositories/savings.repository';
import { splitRepository } from '../repositories/split.repository';

export class SyncService {
  async pull(userId: string) {
    const [expenses, categories, budget, savingsConfig, savingsGoals, splitBills] = await Promise.all([
      expenseRepository.findByUserId(userId), categoryRepository.findAvailableForUser(userId),
      budgetRepository.findByUserId(userId), savingsConfigRepository.findByUserId(userId),
      savingsGoalRepository.findByUserId(userId), splitRepository.findByUserId(userId),
    ]);
    return { expenses, categories, budget, savingsConfig, savingsGoals, splitBills, syncedAt: Date.now() };
  }

  async push(userId: string, payload: { expenses?: any[]; budget?: any; savingsConfig?: any; splitBills?: any[] }) {
    let syncedCount = 0;
    for (const exp of payload.expenses || []) {
      if (!exp.id || !exp.title || !exp.amount) continue;
      const existing = await expenseRepository.findById(exp.id);
      if (existing?.userId === userId) { await expenseRepository.update(exp.id, exp); syncedCount++; }
      else if (!existing) { await expenseRepository.create({ ...exp, userId }); syncedCount++; }
    }
    if (payload.budget) { const b = await budgetRepository.findByUserId(userId); if (b) await budgetRepository.update(b.id, payload.budget); }
    if (payload.savingsConfig) { const s = await savingsConfigRepository.findByUserId(userId); if (s) await savingsConfigRepository.update(s.id, payload.savingsConfig); }
    for (const split of payload.splitBills || []) {
      if (!split.id || !split.title) continue;
      const existing = await splitRepository.findById(split.id);
      if (existing?.userId === userId) { await splitRepository.update(split.id, split); syncedCount++; }
      else if (!existing) { await splitRepository.create({ ...split, userId }); syncedCount++; }
    }
    return { success: true, syncedCount, syncedAt: Date.now() };
  }
}

export const syncService = new SyncService();
