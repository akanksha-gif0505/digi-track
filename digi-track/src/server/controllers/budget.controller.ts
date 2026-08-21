import { Request, Response, NextFunction } from 'express';
import { budgetService } from '../services/budget.service';
import { sendSuccess } from '../utils/response';

export class BudgetController {
  async getBudget(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const budgetData = await budgetService.getBudget(userId);
      return sendSuccess(res, budgetData);
    } catch (err) {
      next(err);
    }
  }

  async updateBudget(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const updated = await budgetService.updateBudget(userId, req.body);
      return sendSuccess(res, updated, 'Budget updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async updateCategoryCap(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { categoryId } = req.params;
      const { cap } = req.body;
      const updated = await budgetService.updateCategoryCap(userId, categoryId, cap);
      return sendSuccess(res, updated, 'Category cap updated');
    } catch (err) {
      next(err);
    }
  }
}

export const budgetController = new BudgetController();
