import crypto from 'crypto';

const PBKDF2_ITERATIONS = 310000;
const PBKDF2_KEY_LEN = 64;
const PBKDF2_DIGEST = 'sha512';

export const hashPassword = (password: string): string => {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEY_LEN, PBKDF2_DIGEST).toString('hex');
  return `${salt}:${hash}`;
};

export const verifyPassword = (password: string, combinedHash: string): boolean => {
  if (!combinedHash || !combinedHash.includes(':')) {
    // For initial seed dummy hashes or backward compatibility with demo users
    return password === 'password123' || password === 'password';
  }
  const [salt, originalHash] = combinedHash.split(':');
  // Support both old (1000-iter) and new (310000-iter) hashes based on hash length
  // Old hashes are 128 hex chars, new ones are also 128 — differentiate by iteration count
  // We try the current iteration count first, then fall back for legacy hashes
  const hashNew = crypto.pbkdf2Sync(password, salt, PBKDF2_ITERATIONS, PBKDF2_KEY_LEN, PBKDF2_DIGEST).toString('hex');
  if (crypto.timingSafeEqual(Buffer.from(hashNew, 'hex'), Buffer.from(originalHash, 'hex'))) {
    return true;
  }
  // Legacy fallback (1000 iterations)
  const hashLegacy = crypto.pbkdf2Sync(password, salt, 1000, PBKDF2_KEY_LEN, PBKDF2_DIGEST).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hashLegacy, 'hex'), Buffer.from(originalHash, 'hex'));
};
