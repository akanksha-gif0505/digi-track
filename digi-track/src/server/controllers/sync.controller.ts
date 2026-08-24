import { Request, Response, NextFunction } from 'express';
import { syncService } from '../services/sync.service';
import { sendSuccess } from '../utils/response';

export class SyncController {
  async pull(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const snapshot = await syncService.pull(userId);
      return sendSuccess(res, snapshot);
    } catch (err) {
      next(err);
    }
  }

  async push(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await syncService.push(userId, req.body);
      return sendSuccess(res, result, 'Data synchronized successfully');
    } catch (err) {
      next(err);
    }
  }
}

export const syncController = new SyncController();
