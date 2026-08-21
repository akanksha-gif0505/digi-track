import { BaseRepository } from './base.repository';
import { SplitBillModel } from '../models/split.model';

export class SplitRepository extends BaseRepository<SplitBillModel> {
  constructor() {
    super('splits');
  }

  async findByUserId(userId: string): Promise<SplitBillModel[]> {
    const list = await this.findAll((s) => s.userId === userId);
    return list.sort((a, b) => b.createdAt - a.createdAt);
  }
}

export const splitRepository = new SplitRepository();
