import { categoryRepository } from '../repositories/category.repository';
import { budgetRepository } from '../repositories/budget.repository';
import { CategoryModel } from '../models/category.model';
import { AppError } from '../middlewares/error.middleware';
import { HTTP_STATUS, ERROR_CODES } from '../constants/httpStatus';

export class CategoryService {
  async getCategories(userId: string): Promise<CategoryModel[]> {
    return categoryRepository.findAvailableForUser(userId);
  }

  async createCategory(userId: string, data: { name: string; icon?: string; bgClass?: string; iconColorClass?: string; colorHex?: string; defaultCap?: number }): Promise<CategoryModel> {
    if (!data.name?.trim()) throw new AppError('Category name is required.', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.VALIDATION_ERROR);
    const id = data.name.toLowerCase().trim().replace(/\s+/g, '-');
    const now = Date.now();
    const newCat: CategoryModel = {
      id, userId, name: data.name.trim(), icon: data.icon || 'category',
      bgClass: data.bgClass || 'bg-[#eff4ff]', iconColorClass: data.iconColorClass || 'text-[#005c55]',
      badgeBgClass: 'bg-[#e5eeff]', badgeTextClass: 'text-[#005c55]',
      colorHex: data.colorHex || '#005c55', defaultCap: data.defaultCap || 5000,
      isDefault: false, createdAt: now, updatedAt: now,
    };
    const saved = await categoryRepository.create(newCat);
    if (data.defaultCap) {
      const budget = await budgetRepository.findByUserId(userId);
      if (budget) await budgetRepository.update(budget.id, { categoryCaps: { ...budget.categoryCaps, [id]: data.defaultCap } });
    }
    return saved;
  }

  async deleteCategory(userId: string, id: string): Promise<boolean> {
    const cat = await categoryRepository.findById(id);
    if (!cat) throw new AppError('Category not found.', HTTP_STATUS.NOT_FOUND, ERROR_CODES.NOT_FOUND);
    if (cat.isDefault || !cat.userId || cat.userId !== userId) throw new AppError('Cannot delete system default category.', HTTP_STATUS.FORBIDDEN, ERROR_CODES.FORBIDDEN);
    return categoryRepository.delete(id);
  }
}

export const categoryService = new CategoryService();
