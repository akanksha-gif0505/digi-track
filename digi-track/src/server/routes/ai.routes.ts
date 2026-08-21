import { Router } from 'express';
import { aiController } from '../controllers/ai.controller';
import { optionalAuth } from '../middlewares/auth.middleware';
import { rateLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();

router.post('/analyze-spending', rateLimiter(20), optionalAuth, (req, res, next) => aiController.analyzeSpending(req, res, next));

export default router;
