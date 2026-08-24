import { Request, Response, NextFunction } from 'express';
import { exportService } from '../services/export.service';
import { sendSuccess } from '../utils/response';

export class ExportController {
  async exportCSV(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const csv = await exportService.exportCSV(userId);
      const filename = `digi_track_expenses_${new Date().toISOString().split('T')[0]}.csv`;
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(csv);
    } catch (err) {
      next(err);
    }
  }

  async exportJSON(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const json = await exportService.exportJSON(userId);
      return sendSuccess(res, json);
    } catch (err) {
      next(err);
    }
  }

  async exportStatement(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const text = await exportService.exportStatementText(userId);
      const filename = `digi_track_statement_${new Date().toISOString().split('T')[0]}.txt`;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.send(text);
    } catch (err) {
      next(err);
    }
  }
}

export const exportController = new ExportController();
