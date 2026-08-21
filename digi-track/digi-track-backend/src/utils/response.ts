import { Response } from 'express';
import { HTTP_STATUS } from '../constants/httpStatus';

export const sendSuccess = <T>(res: Response, data: T, message?: string, statusCode = HTTP_STATUS.OK, meta?: Record<string, any>) => {
  return res.status(statusCode).json({ success: true, data, message, meta, timestamp: new Date().toISOString() });
};

export const sendError = (res: Response, message: string, statusCode = HTTP_STATUS.BAD_REQUEST, code?: string, errors?: any[]) => {
  return res.status(statusCode).json({ success: false, message, code, errors, timestamp: new Date().toISOString() });
};
