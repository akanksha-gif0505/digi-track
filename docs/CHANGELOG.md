# Digi Track — Backend Changelog

---

### [2026-08-21]

#### Added
- Complete persistent AI context documentation system under `/docs` (14 files).
- Modular Node.js/Express backend architecture (`src/server/`).
- Security middleware suite: JWT token validation, salted password hashing, rate limiting, and centralized error handling.
- REST API v1 endpoints for IAM/Auth (`/api/v1/auth/*`), Expenses (`/api/v1/expenses/*`), Categories (`/api/v1/categories/*`), Budget & Savings Vault (`/api/v1/budget/*`, `/api/v1/savings/*`), Split Bills & Settlements (`/api/v1/splits/*`), Gemini AI Insights (`/api/v1/insights/*`), Data Export (`/api/v1/export/*`), and Offline Sync (`/api/v1/sync/*`).
- Automated backend test suite (`tests/backend.test.ts`).
- Dual compatibility for legacy AI spending analysis endpoint (`/api/analyze-spending`).

#### Changed
- Scoped the root TypeScript project to the active application source so the incomplete archived `digi-track-backend/` copy is not compiled with the production backend.
- Widened HTTP status-code constants for centralized response helpers, preserving semantic status codes across controllers and middleware.

#### Verified
- `npm run lint`, `npm test` (15 passing integration checks), and `npm run build`.
