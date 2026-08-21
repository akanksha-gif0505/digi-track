import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service';
import { sendSuccess } from '../utils/response';
import { HTTP_STATUS } from '../constants/httpStatus';

export class AuthController {
  async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await authService.signup(req.body);
      return sendSuccess(res, result, 'Account created successfully', HTTP_STATUS.CREATED);
    } catch (err) {
      next(err);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);
      return sendSuccess(res, result, 'Login successful');
    } catch (err) {
      next(err);
    }
  }

  async demoLogin(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await authService.demoLogin(email || 'anjali.sharma@example.com');
      return sendSuccess(res, result, 'Demo profile authenticated');
    } catch (err) {
      next(err);
    }
  }

  async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const profile = await authService.getProfile(userId);
      return sendSuccess(res, profile);
    } catch (err) {
      next(err);
    }
  }

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const updated = await authService.updateProfile(userId, req.body);
      return sendSuccess(res, updated, 'Profile updated successfully');
    } catch (err) {
      next(err);
    }
  }

  async completeOnboarding(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const updated = await authService.updateProfile(userId, {
        onboarded: true,
        ...req.body,
      });
      return sendSuccess(res, updated, 'Onboarding complete');
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();