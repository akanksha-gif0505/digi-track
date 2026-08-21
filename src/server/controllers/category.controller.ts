import { Request, Response, NextFunction } from 'express';
import { categoryService } from '../services/category.service';
import { sendSuccess } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';

export class CategoryController {
  async getCategories(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const categories = await categoryService.getCategories(userId);
      return sendSuccess(res, categories);
    } catch (err) {
      next(err);
    }
  }

  async createCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const category = await categoryService.createCategory(userId, req.body);
      return sendSuccess(res, category, 'Category created successfully', HTTP_STATUS.CREATED);
    } catch (err) {
      next(err);
    }
  }

  async deleteCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      await categoryService.deleteCategory(userId, req.params.id);
      return sendSuccess(res, { id: req.params.id }, 'Category deleted successfully');
    } catch (err) {
      next(err);
    }
  }
}

export const categoryController = new CategoryController();
