import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';

export class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    try { return sendSuccess(res, await authService.signup(req.body), 'Account created successfully', HTTP_STATUS.CREATED); } catch (e) { next(e); }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try { return sendSuccess(res, await authService.login(req.body.email, req.body.password), 'Login successful'); } catch (e) { next(e); }
  }
  async demoLogin(req: Request, res: Response, next: NextFunction) {
    try { return sendSuccess(res, await authService.demoLogin(req.body.email || 'anjali.sharma@example.com'), 'Demo profile authenticated'); } catch (e) { next(e); }
  }
  async getMe(req: Request, res: Response, next: NextFunction) {
    try { return sendSuccess(res, await authService.getProfile(req.user!.userId)); } catch (e) { next(e); }
  }
  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try { return sendSuccess(res, await authService.updateProfile(req.user!.userId, req.body), 'Profile updated'); } catch (e) { next(e); }
  }
  async completeOnboarding(req: Request, res: Response, next: NextFunction) {
    try { return sendSuccess(res, await authService.updateProfile(req.user!.userId, { onboarded: true, ...req.body }), 'Onboarding complete'); } catch (e) { next(e); }
  }
}

export const authController = new AuthController();
