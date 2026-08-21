import crypto from 'crypto';
import { ENV } from '../config/env';

export interface JwtPayload {
  userId: string;
  email: string;
  name?: string;
  iat?: number;
  exp?: number;
}

function b64urlEncode(input: string | Buffer): string {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function b64urlDecode(input: string): string {
  let b = input.replace(/-/g, '+').replace(/_/g, '/');
  while (b.length % 4) b += '=';
  return Buffer.from(b, 'base64').toString('utf-8');
}

export const generateToken = (payload: Omit<JwtPayload, 'iat' | 'exp'>, expiresInSeconds = 7 * 24 * 60 * 60): string => {
  const now = Math.floor(Date.now() / 1000);
  const full: JwtPayload = { ...payload, iat: now, exp: now + expiresInSeconds };
  const header = b64urlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const body = b64urlEncode(JSON.stringify(full));
  const sig = b64urlEncode(crypto.createHmac('sha256', ENV.JWT_SECRET).update(`${header}.${body}`).digest());
  return `${header}.${body}.${sig}`;
};

export const verifyToken = (token: string): JwtPayload | null => {
  try {
    const [header, body, sig] = token.split('.');
    if (!header || !body || !sig) return null;
    const expected = b64urlEncode(crypto.createHmac('sha256', ENV.JWT_SECRET).update(`${header}.${body}`).digest());
    if (sig !== expected) return null;
    const payload: JwtPayload = JSON.parse(b64urlDecode(body));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
};
