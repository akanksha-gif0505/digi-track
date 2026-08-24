import { Router } from 'express';
import authRoutes from './auth.routes';
import expenseRoutes from './expense.routes';
import categoryRoutes from './category.routes';
import budgetRoutes from './budget.routes';
import savingsRoutes from './savings.routes';
import splitRoutes from './split.routes';
import aiRoutes from './ai.routes';
import exportRoutes from './export.routes';
import syncRoutes from './sync.routes';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/expenses', expenseRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/budget', budgetRoutes);
apiRouter.use('/savings', savingsRoutes);
apiRouter.use('/splits', splitRoutes);
apiRouter.use('/insights', aiRoutes);
apiRouter.use('/export', exportRoutes);
apiRouter.use('/sync', syncRoutes);

export default apiRouter;
