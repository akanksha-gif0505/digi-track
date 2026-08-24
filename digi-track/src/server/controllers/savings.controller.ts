import { Request, Response, NextFunction } from 'express';
import { savingsService } from '../services/savings.service';
import { sendSuccess } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';

export class SavingsController {
  async getSavingsDashboard(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const dashboard = await savingsService.getSavingsDashboard(userId);
      return sendSuccess(res, dashboard);
    } catch (err) {
      next(err);
    }
  }

  async updateSavingsConfig(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const updated = await savingsService.updateSavingsConfig(userId, req.body);
      return sendSuccess(res, updated, 'Savings & Salary settings updated');
    } catch (err) {
      next(err);
    }
  }

  async addSavingsGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const goal = await savingsService.addSavingsGoal(userId, req.body);
      return sendSuccess(res, goal, 'Savings goal created', HTTP_STATUS.CREATED);
    } catch (err) {
      next(err);
    }
  }

  async updateSavingsGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const updated = await savingsService.updateSavingsGoal(userId, req.params.id, req.body);
      return sendSuccess(res, updated, 'Savings goal updated');
    } catch (err) {
      next(err);
    }
  }

  async deleteSavingsGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      await savingsService.deleteSavingsGoal(userId, req.params.id);
      return sendSuccess(res, { id: req.params.id }, 'Savings goal deleted');
    } catch (err) {
      next(err);
    }
  }

  async depositToGoal(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { amount } = req.body;
      const updated = await savingsService.depositToGoal(userId, req.params.id, amount);
      return sendSuccess(res, updated, 'Deposit recorded successfully');
    } catch (err) {
      next(err);
    }
  }
}

export const savingsController = new SavingsController();
