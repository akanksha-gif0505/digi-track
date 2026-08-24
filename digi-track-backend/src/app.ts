import express from 'express';
import { db } from './config/database';
import { ENV } from './config/env';
import { logger } from './config/logger';
import { securityHeaders } from './middlewares/security.middleware';
import { errorHandler } from './middlewares/error.middleware';
import { aiController } from './controllers/ai.controller';
import apiRouter from './routes';

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

  // REST API v1
  app.use('/api/v1', apiRouter);

  // Legacy backward-compat AI endpoint
  app.post('/api/analyze-spending', (req, res, next) => {
    aiController.analyzeSpending(req, res, next);
  });

  // Centralized error handler
  app.use(errorHandler);

  return app;
}
