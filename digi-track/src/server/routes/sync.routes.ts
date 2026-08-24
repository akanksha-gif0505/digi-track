import { Router } from 'express';
import { syncController } from '../controllers/sync.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/pull', (req, res, next) => syncController.pull(req, res, next));
router.post('/push', (req, res, next) => syncController.push(req, res, next));

export default router;
