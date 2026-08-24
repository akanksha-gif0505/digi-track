import { Request, Response, NextFunction } from 'express';

// Parse allowed origins from env. Falls back to wildcard only in development.
// In production, set ALLOWED_ORIGINS="https://yourdomain.com,https://app.yourdomain.com"
const ALLOWED_ORIGINS: string[] = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()).filter(Boolean)
  : [];

const isDev = process.env.NODE_ENV !== 'production';

export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  // CORS: use origin whitelist in production, wildcard in development
  const requestOrigin = req.headers.origin || '';
  if (ALLOWED_ORIGINS.length > 0) {
    if (ALLOWED_ORIGINS.includes(requestOrigin)) {
      res.setHeader('Access-Control-Allow-Origin', requestOrigin);
      res.setHeader('Vary', 'Origin');
    }
    // If origin is not in whitelist, no ACAO header is set — browser will block it
  } else if (isDev) {
    // Development: allow all origins for convenience
    res.setHeader('Access-Control-Allow-Origin', '*');
  }

  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-Demo-User-Id');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
};
