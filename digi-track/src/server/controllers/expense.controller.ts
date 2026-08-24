import { Request, Response, NextFunction } from 'express';
import { expenseService } from '../services/expense.service';
import { sendSuccess } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';

export class ExpenseController {
  async getExpenses(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { search, category, datePreset, startDate, endDate, page, limit } = req.query;

      const result = await expenseService.getExpenses(userId, {
        search: search as string,
        category: category as string,
        datePreset: datePreset as any,
        startDate: startDate as string,
        endDate: endDate as string,
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      });

      return sendSuccess(res, result);
    } catch (err) {
      next(err);
    }
  }

  async getExpenseById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const expense = await expenseService.getExpenseById(userId, req.params.id);
      return sendSuccess(res, expense);
    } catch (err) {
      next(err);
    }
  }

  async createExpense(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const expense = await expenseService.createExpense(userId, req.body);
      return sendSuccess(res, expense, 'Expense recorded successfully', HTTP_STATUS.CREATED);
    } catch (err) {
      next(err);
    }
  }

  async updateExpense(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const updated = await expenseService.updateExpense(userId, req.params.id, req.body);
      return sendSuccess(res, updated, 'Expense updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async deleteExpense(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      await expenseService.deleteExpense(userId, req.params.id);
      return sendSuccess(res, { id: req.params.id }, 'Expense deleted successfully');
    } catch (err) {
      next(err);
    }
  }
}

export const expenseController = new ExpenseController();
