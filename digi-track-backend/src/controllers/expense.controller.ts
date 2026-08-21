import { Request, Response, NextFunction } from 'express';
import { expenseService } from '../services/expense.service';
import { sendSuccess } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';

export class ExpenseController {
  async getExpenses(req: Request, res: Response, next: NextFunction) {
    try {
      const { search, category, datePreset, startDate, endDate, page, limit } = req.query;
      return sendSuccess(res, await expenseService.getExpenses(req.user!.userId, { search: search as string, category: category as string, datePreset: datePreset as any, startDate: startDate as string, endDate: endDate as string, page: page ? +page : undefined, limit: limit ? +limit : undefined }));
    } catch (e) { next(e); }
  }
  async getExpenseById(req: Request, res: Response, next: NextFunction) {
    try { return sendSuccess(res, await expenseService.getExpenseById(req.user!.userId, req.params.id)); } catch (e) { next(e); }
  }
  async createExpense(req: Request, res: Response, next: NextFunction) {
    try { return sendSuccess(res, await expenseService.createExpense(req.user!.userId, req.body), 'Expense recorded', HTTP_STATUS.CREATED); } catch (e) { next(e); }
  }
  async updateExpense(req: Request, res: Response, next: NextFunction) {
    try { return sendSuccess(res, await expenseService.updateExpense(req.user!.userId, req.params.id, req.body), 'Expense updated'); } catch (e) { next(e); }
  }
  async deleteExpense(req: Request, res: Response, next: NextFunction) {
    try { await expenseService.deleteExpense(req.user!.userId, req.params.id); return sendSuccess(res, { id: req.params.id }, 'Expense deleted'); } catch (e) { next(e); }
  }
}

export const expenseController = new ExpenseController();
