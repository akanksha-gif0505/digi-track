import { Response } from 'express';
import { HTTP_STATUS } from '../constants/httpStatus';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  meta?: Record<string, any>;
  errors?: any[];
  code?: string;
  timestamp: string;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode: number = HTTP_STATUS.OK,
  meta?: Record<string, any>
) => {
  const payload: ApiResponse<T> = {
    success: true,
    data,
    message,
    meta,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(payload);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number = HTTP_STATUS.BAD_REQUEST,
  code?: string,
  errors?: any[]
) => {
  const payload: ApiResponse = {
    success: false,
    message,
    code,
    errors,
    timestamp: new Date().toISOString(),
  };
  return res.status(statusCode).json(payload);
};
