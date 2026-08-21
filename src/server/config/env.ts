import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  JWT_SECRET: process.env.JWT_SECRET || 'digitrack-secure-jwt-super-secret-token-key-2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  DATA_DIR: process.env.DATA_DIR || path.join(process.cwd(), '.data'),
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV !== 'production',
};
