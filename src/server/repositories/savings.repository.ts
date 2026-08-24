import { BaseRepository } from './base.repository';
import { SavingsConfigModel, SavingsGoalModel } from '../models/savings.model';
import { db } from '../config/database';

export class SavingsConfigRepository extends BaseRepository<SavingsConfigModel> {
  constructor() {
    super('savings');
  }

  async findByUserId(userId: string): Promise<SavingsConfigModel | null> {
    const list = await this.findAll((s) => s.userId === userId);
    return list[0] || null;
  }
}

export class SavingsGoalRepository extends BaseRepository<SavingsGoalModel> {
  constructor() {
    super('savingsGoals');
  }

  async findByUserId(userId: string): Promise<SavingsGoalModel[]> {
    const list = await this.findAll((g) => g.userId === userId);
    return list.sort((a, b) => b.createdAt - a.createdAt);
  }
}

export const savingsConfigRepository = new SavingsConfigRepository();
export const savingsGoalRepository = new SavingsGoalRepository();
