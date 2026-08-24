import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { rateLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();

// Public auth endpoints
router.post('/signup', rateLimiter(20), (req, res, next) => authController.signup(req, res, next));
router.post('/login', rateLimiter(20), (req, res, next) => authController.login(req, res, next));
router.post('/demo-login', rateLimiter(30), (req, res, next) => authController.demoLogin(req, res, next));

// Protected auth endpoints
router.get('/me', requireAuth, (req, res, next) => authController.getMe(req, res, next));
router.put('/profile', requireAuth, (req, res, next) => authController.updateProfile(req, res, next));
router.post('/onboarding', requireAuth, (req, res, next) => authController.completeOnboarding(req, res, next));

export default router;
