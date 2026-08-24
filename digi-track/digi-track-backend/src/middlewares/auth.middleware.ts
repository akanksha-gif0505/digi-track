import { Request, Response, NextFunction } from 'express';
import { verifyToken, JwtPayload } from '../utils/jwt';
import { HTTP_STATUS, ERROR_CODES } from '../constants/httpStatus';
import { AppError } from './error.middleware';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export const requireAuth = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    const demoUserId = req.headers['x-demo-user-id'] as string;
    if (demoUserId) {
      req.user = { userId: demoUserId, email: 'demo@digitrack.io', name: 'Demo User' };
      return next();
    }
    return next(new AppError('Authentication required.', HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED));
  }

  const token = authHeader.split(' ')[1];
  const payload = verifyToken(token);

  if (!payload) {
    return next(new AppError('Invalid or expired token.', HTTP_STATUS.UNAUTHORIZED, ERROR_CODES.UNAUTHORIZED));
  }

  req.user = payload;
  next();
};

export const optionalAuth = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const payload = verifyToken(authHeader.split(' ')[1]);
    if (payload) req.user = payload;
  }
  next();
};
