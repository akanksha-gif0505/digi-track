import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

// In production, JWT_SECRET must be explicitly set — no hardcoded fallback.
// Set it in the Render dashboard (or any other host) as an environment variable.
const jwtSecret = process.env.JWT_SECRET;
if (isProduction && !jwtSecret) {
  console.error('[FATAL] JWT_SECRET environment variable is not set. Cannot start in production without it.');
  process.exit(1);
}

export const ENV = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  // Development falls back to a local default; production requires the env var (enforced above).
  JWT_SECRET: jwtSecret || 'digitrack-dev-only-secret-do-not-use-in-production',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  APP_URL: process.env.APP_URL || 'http://localhost:3000',
  // Production default is /tmp/.data (writable on Render's ephemeral filesystem).
  // Development default is .data/ relative to the project root.
  DATA_DIR: process.env.DATA_DIR || (isProduction ? '/tmp/.data' : path.join(process.cwd(), '.data')),
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS || 'http://localhost:5173,http://localhost:3001').split(',').map(o => o.trim()),
  isProduction,
  isDevelopment: !isProduction,
};
