import { Router } from 'express';
import { exportController } from '../controllers/export.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/csv', (req, res, next) => exportController.exportCSV(req, res, next));
router.get('/json', (req, res, next) => exportController.exportJSON(req, res, next));
router.get('/statement', (req, res, next) => exportController.exportStatement(req, res, next));

export default router;
