import { createApp } from './app';
import { ENV } from './config/env';
import { logger } from './config/logger';

async function startServer() {
  try {
    const app = await createApp();
    const PORT = ENV.PORT;

    app.listen(PORT, '0.0.0.0', () => {
      logger.info(`Digi Track API server running on http://0.0.0.0:${PORT}`);
      logger.info(`Environment: ${ENV.NODE_ENV}`);
      logger.info(`API v1 Base: http://0.0.0.0:${PORT}/api/v1`);
      logger.info(`Health check: http://0.0.0.0:${PORT}/api/health`);
    });
  } catch (err) {
    logger.error('Failed to start Digi Track server:', err);
    process.exit(1);
  }
}

startServer();
