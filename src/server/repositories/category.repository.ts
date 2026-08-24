import { BaseRepository } from './base.repository';
import { CategoryModel } from '../models/category.model';

export class CategoryRepository extends BaseRepository<CategoryModel> {
  constructor() {
    super('categories');
  }

  async findAvailableForUser(userId: string): Promise<CategoryModel[]> {
    return this.findAll((c) => c.userId === null || c.userId === undefined || c.userId === userId);
  }
}

export const categoryRepository = new CategoryRepository();
