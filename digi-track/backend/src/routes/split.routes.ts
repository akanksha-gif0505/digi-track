import { Router } from 'express';
import { splitController } from '../controllers/split.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/', (req, res, next) => splitController.getSplits(req, res, next));
router.get('/:id', (req, res, next) => splitController.getSplitById(req, res, next));
router.post('/', (req, res, next) => splitController.createSplit(req, res, next));
router.put('/:id', (req, res, next) => splitController.updateSplit(req, res, next));
router.delete('/:id', (req, res, next) => splitController.deleteSplit(req, res, next));
router.post('/:id/settle', (req, res, next) => splitController.settleDebt(req, res, next));
router.post('/:id/settle-all', (req, res, next) => splitController.settleAll(req, res, next));

export default router;
