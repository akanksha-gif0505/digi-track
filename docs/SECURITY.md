# Digi Track — Security & Authentication Specification

Security architecture, token handling, cryptographic standards, and vulnerability mitigations.

---

## 1. Authentication Strategy
- **Mechanism**: JSON Web Tokens (JWT) signed with HMAC-SHA256 (`HS256`).
- **Token Expiry**: Default 7 days (configurable via `JWT_EXPIRES_IN`).
- **Authorization Header**: `Authorization: Bearer <token>`.
- **Payload Sanitization**: JWT payloads contain only non-sensitive identifiers (`userId`, `email`, `role`). Never store passwords or private secrets in JWT tokens.

---

## 2. Password Hashing & Sensitive Data
- **Algorithm**: Cryptographic SHA-256 with unique per-user salts / Bcrypt with configurable cost factor (minimum 10 rounds).
- **Redaction**: Password hashes are stripped before serialization and never returned in API responses or logs.

---

## 3. Object-Level Tenant Authorization
- Every authenticated request derives the `userId` directly from `req.user.id`.
- Clients cannot supply a spoofed `userId` to query or modify data belonging to other accounts.
- Any attempt to access a resource owned by another user returns `404 Not Found` or `403 Forbidden`.

---

## 4. Rate Limiting & Denial-of-Service Prevention
- **Sliding Window Rate Limiter**: Configurable requests per IP window (default: 120 requests / minute for standard APIs, 20 requests / minute for auth/AI endpoints).
- Exceeding the threshold returns `429 Too Many Requests`.

---

## 5. Security Headers & CORS
- **CORS Policy**: Configured to accept requests from trusted origins (`APP_URL`, `http://localhost:3000`, `http://localhost:5173`).
- **Headers**:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`
  - `X-XSS-Protection: 1; mode=block`
  - `Strict-Transport-Security` in production

---

## 6. Input Validation & Injection Prevention
- All request parameters, bodies, and queries are validated against strict type and length schemas.
- Text inputs (titles, notes) are sanitized to prevent stored XSS and injection.
