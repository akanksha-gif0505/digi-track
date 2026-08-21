import { Request, Response, NextFunction } from 'express';
import { HTTP_STATUS, ERROR_CODES } from '../constants/httpStatus';
import { sendError } from '../utils/response';
import { logger } from '../config/logger';

export class AppError extends Error {
  public statusCode: number;
  public code: string;
  public errors?: any[];

  constructor(message: string, statusCode: number = HTTP_STATUS.BAD_REQUEST, code: string = ERROR_CODES.BAD_REQUEST, errors?: any[]) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const errorHandler = (err: any, req: Request, res: Response, _next: NextFunction) => {
  logger.error(`[${req.method}] ${req.originalUrl} — ${err.message || err}`, err);

  if (err instanceof AppError) {
    return sendError(res, err.message, err.statusCode, err.code, err.errors);
  }

  if (err instanceof SyntaxError && 'body' in err) {
    return sendError(res, 'Malformed JSON payload', HTTP_STATUS.BAD_REQUEST, ERROR_CODES.BAD_REQUEST);
  }

  const message = process.env.NODE_ENV === 'production'
    ? 'An unexpected server error occurred'
    : err.message || 'Internal Server Error';
  return sendError(res, message, HTTP_STATUS.INTERNAL_SERVER_ERROR, ERROR_CODES.INTERNAL_SERVER_ERROR);
};
