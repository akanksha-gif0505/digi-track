import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
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

  // Basic Middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(securityHeaders);

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'digi-track-backend',
      timestamp: new Date().toISOString(),
      env: ENV.NODE_ENV,
    });
  });

  // REST API v1 routes
  app.use('/api/v1', apiRouter);

  // Backward compatibility endpoint for existing AI Studio spending analysis
  app.post('/api/analyze-spending', (req, res, next) => {
    aiController.analyzeSpending(req, res, next);
  });

  // Vite development middleware or static production serving
  if (ENV.isDevelopment) {
    try {
      const vite = await createViteServer({
        server: { middlewareMode: true },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (err) {
      logger.warn('Could not initialize Vite dev middleware:', err);
    }
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  // Centralized Error Handler (must be after routes)
  app.use(errorHandler);

  return app;
}
