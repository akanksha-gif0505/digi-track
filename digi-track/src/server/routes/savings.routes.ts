import { Router } from 'express';
import { savingsController } from '../controllers/savings.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/', (req, res, next) => savingsController.getSavingsDashboard(req, res, next));
router.put('/config', (req, res, next) => savingsController.updateSavingsConfig(req, res, next));

// Sub-goals endpoints
router.post('/goals', (req, res, next) => savingsController.addSavingsGoal(req, res, next));
router.put('/goals/:id', (req, res, next) => savingsController.updateSavingsGoal(req, res, next));
router.delete('/goals/:id', (req, res, next) => savingsController.deleteSavingsGoal(req, res, next));
router.post('/goals/:id/deposit', (req, res, next) => savingsController.depositToGoal(req, res, next));

export default router;
