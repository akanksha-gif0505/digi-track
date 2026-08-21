import { Router } from 'express';
import { budgetController } from '../controllers/budget.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/', (req, res, next) => budgetController.getBudget(req, res, next));
router.put('/', (req, res, next) => budgetController.updateBudget(req, res, next));
router.put('/caps/:categoryId', (req, res, next) => budgetController.updateCategoryCap(req, res, next));

export default router;
