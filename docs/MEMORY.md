# PROJECT MEMORY

## Current State
- **Backend Status**: Production-ready, modular Express + TypeScript (`tsx`) backend.
- **Current Module**: Complete Backend Integration & Verification.
- **Current Phase**: Final verification & memory system establishment.

## Completed
- Persistent AI context system in `/docs/` (14 documents + `MEMORY.md`).
- Modular architecture in `src/server/` (`config`, `constants`, `models`, `repositories`, `services`, `controllers`, `middlewares`, `utils`, `routes`, `app.ts`).
- IAM & Authentication (`/api/v1/auth/*`) with JWT and salted password hashing.
- Expense Management (`/api/v1/expenses/*`) with query filters, date presets, and category breakdown.
- Category Management (`/api/v1/categories/*`) with default system protection.
- Budget & Protected Savings Vault (`/api/v1/budget/*`, `/api/v1/savings/*`) with deterministic waterfall health state machine and sub-goals.
- Split Bills & Minimal Settlements (`/api/v1/splits/*`) with greedy debt graph reduction and auto-expense logging on settlement.
- Google Gemini AI Spending Analyzer (`/api/v1/insights/*` & `/api/analyze-spending`) with candidate fallback and dynamic heuristic engine.
- Data Export (`/api/v1/export/*`) for CSV, JSON backup, and text statements.
- Offline Synchronization (`/api/v1/sync/*`) for client push/pull.
- Automated Integration Test Suite (`tests/backend.test.ts`) with 15/15 tests passing.

## In Progress
- Final verification of all checklist items, frontend API communication layer, and documentation alignment.

## Important Decisions
- **DEC-001**: Modular Monolith over microservices for low latency and single-container deployment.
- **DEC-002**: Stateless HMAC SHA-256 JWT auth with instant 1-click demo persona fallback.
- **DEC-003**: Abstract repository pattern backed by persistent ACID file/JSON storage, ready for PostgreSQL.
- **DEC-004**: Backward compatibility for `/api/analyze-spending` alongside `/api/v1/insights/analyze-spending`.
- **DEC-005**: Deterministic server-side calculation for waterfall budget and savings vault health metrics.

## Important Constraints
- Currency default is INR (₹), with multi-currency support (USD $, EUR €, etc.).
- Tenant isolation strictly verified via authenticated JWT token context (`req.user.id`).
- High-availability AI advisor: Must never crash if `GEMINI_API_KEY` is missing or throttled; must provide realistic data-driven heuristic fallback.

## Known Issues
- None.

## Next Actions
- Verify frontend client sync integration with backend endpoints.
- Execute full test suite and build verification.

## Important Files
- `server.ts`: Bootstrap entry point.
- `src/server/app.ts`: Express application, middleware, routes, and Vite SPA handler.
- `src/server/config/database.ts`: Persistence engine and seed dataset.
- `src/server/services/`: Core business logic engines.
- `tests/backend.test.ts`: Automated backend test suite.
