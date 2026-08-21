import express from 'express';
import { db } from './config/database';
import { ENV } from './config/env';
import { logger } from './config/logger';
import { securityHeaders } from './middlewares/security.middleware';
import { errorHandler } from './middlewares/error.middleware';

// NOTE: digi-track-backend is a standalone API-only server.
// The canonical full-stack backend (with Vite integration) lives in src/server/.
// This package is used when you want to run the API independently without the
// React frontend, e.g. for a separate deployment or testing.

export async function createApp() {
  // Initialize Database
  db.init();

  const app = express();

  // Body parsing
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Security & CORS headers
  app.use(securityHeaders);

  // Health check
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'digi-track-backend',
      timestamp: new Date().toISOString(),
      env: ENV.NODE_ENV,
    });
  });

  // Centralized error handler
  app.use(errorHandler);

  return app;
}
