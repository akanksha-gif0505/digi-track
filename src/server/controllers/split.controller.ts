import { Request, Response, NextFunction } from 'express';
import { splitService } from '../services/split.service';
import { sendSuccess } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';

export class SplitController {
  async getSplits(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const splits = await splitService.getSplits(userId);
      return sendSuccess(res, splits);
    } catch (err) {
      next(err);
    }
  }

  async getSplitById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const split = await splitService.getSplitById(userId, req.params.id);
      return sendSuccess(res, split);
    } catch (err) {
      next(err);
    }
  }

  async createSplit(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const split = await splitService.createSplit(userId, req.body);
      return sendSuccess(res, split, 'Split bill created successfully', HTTP_STATUS.CREATED);
    } catch (err) {
      next(err);
    }
  }

  async updateSplit(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const updated = await splitService.updateSplit(userId, req.params.id, req.body);
      return sendSuccess(res, updated, 'Split bill updated');
    } catch (err) {
      next(err);
    }
  }

  async deleteSplit(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      await splitService.deleteSplit(userId, req.params.id);
      return sendSuccess(res, { id: req.params.id }, 'Split bill deleted');
    } catch (err) {
      next(err);
    }
  }

  async settleDebt(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { settlementIndex, paymentMode, recordAsExpense } = req.body;
      const result = await splitService.settleDebt(
        userId,
        req.params.id,
        settlementIndex,
        paymentMode,
        recordAsExpense
      );
      return sendSuccess(res, result, 'Debt settlement updated');
    } catch (err) {
      next(err);
    }
  }

  async settleAll(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const updated = await splitService.settleAllDebts(userId, req.params.id);
      return sendSuccess(res, updated, 'All debts marked as settled');
    } catch (err) {
      next(err);
    }
  }
}

export const splitController = new SplitController();
