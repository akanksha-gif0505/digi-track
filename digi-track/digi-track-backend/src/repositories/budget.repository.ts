import { BaseRepository } from './base.repository';
import { BudgetModel } from '../models/budget.model';

export class BudgetRepository extends BaseRepository<BudgetModel> {
  constructor() { super('budgets'); }

  async findByUserId(userId: string): Promise<BudgetModel | null> {
    const list = await this.findAll((b) => b.userId === userId);
    return list[0] || null;
  }
}

export const budgetRepository = new BudgetRepository();
