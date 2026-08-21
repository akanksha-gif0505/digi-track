import { ENV } from './env';

export const logger = {
  info: (message: string, meta?: any) => {
    const timestamp = new Date().toISOString();
    if (meta) {
      console.log(`[${timestamp}] [INFO] ${message}`, meta);
    } else {
      console.log(`[${timestamp}] [INFO] ${message}`);
    }
  },
  warn: (message: string, meta?: any) => {
    const timestamp = new Date().toISOString();
    if (meta) {
      console.warn(`[${timestamp}] [WARN] ${message}`, meta);
    } else {
      console.warn(`[${timestamp}] [WARN] ${message}`);
    }
  },
  error: (message: string, error?: any) => {
    const timestamp = new Date().toISOString();
    if (error) {
      console.error(`[${timestamp}] [ERROR] ${message}`, error?.message || error);
    } else {
      console.error(`[${timestamp}] [ERROR] ${message}`);
    }
  },
  debug: (message: string, meta?: any) => {
    if (ENV.isDevelopment) {
      const timestamp = new Date().toISOString();
      console.debug(`[${timestamp}] [DEBUG] ${message}`, meta || '');
    }
  },
};
