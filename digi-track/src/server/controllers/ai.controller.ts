import { Request, Response, NextFunction } from 'express';
import { aiService } from '../services/ai.service';
import { sendSuccess } from '../utils/response';

export class AiController {
  async analyzeSpending(req: Request, res: Response, next: NextFunction) {
    try {
      const insight = await aiService.analyzeSpending(req.body);
      return res.json(insight);
    } catch (err) {
      next(err);
    }
  }
}

export const aiController = new AiController();
