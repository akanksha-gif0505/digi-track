# Digi Track — Backend Development Task Tracker

---

### Module 1: Context & Documentation System
- [x] Create `docs/CONTEXT.md`
- [x] Create `docs/REQUIREMENTS.md`
- [x] Create `docs/ARCHITECTURE.md`
- [x] Create `docs/API_CONTRACT.md`
- [x] Create `docs/DATABASE.md`
- [x] Create `docs/DECISIONS.md`
- [x] Create `docs/BUSINESS_RULES.md`
- [x] Create `docs/SECURITY.md`
- [x] Create `docs/ERROR_HANDLING.md`
- [x] Create `docs/VALIDATION.md`
- [x] Create `docs/TESTING.md`
- [x] Create `docs/DEPLOYMENT.md`
- [x] Create `docs/CHANGELOG.md`
- [x] Create `docs/TODO.md`

---

### Module 2: Configuration & Infrastructure
- [x] Environment configuration (`src/server/config/env.ts`)
- [x] Structured logger (`src/server/config/logger.ts`)
- [x] Database persistence engine & seed data (`src/server/config/database.ts`)
- [x] HTTP status & application constants (`src/server/constants/`)
- [x] Standard response helper (`src/server/utils/response.ts`)
- [x] Centralized error middleware (`src/server/middlewares/error.middleware.ts`)
- [x] Security headers, CORS & rate limiting middleware

---

### Module 3: Authentication & User Management Domain
- [x] User model & schema (`src/server/models/user.model.ts`)
- [x] Password hashing & JWT utilities (`src/server/utils/password.ts`, `jwt.ts`)
- [x] User repository (`src/server/repositories/user.repository.ts`)
- [x] Auth service (`src/server/services/auth.service.ts`)
- [x] Auth controller & validators (`src/server/controllers/auth.controller.ts`)
- [x] Auth routes (`/api/v1/auth/*`)
- [x] Auth middleware (`src/server/middlewares/auth.middleware.ts`)

---

### Module 4: Expense & Category Domain
- [x] Expense & Category models (`src/server/models/expense.model.ts`, `category.model.ts`)
- [x] Expense & Category repositories (`src/server/repositories/`)
- [x] Expense & Category services (`src/server/services/`)
- [x] Expense & Category controllers & validators (`src/server/controllers/`, `validators/`)
- [x] Expense & Category routes (`/api/v1/expenses/*`, `/api/v1/categories/*`)

---

### Module 5: Budget & Savings Vault Domain
- [x] Budget & Savings models (`src/server/models/budget.model.ts`, `savings.model.ts`)
- [x] Budget & Savings repositories (`src/server/repositories/`)
- [x] Waterfall & Vault health domain calculation service (`src/server/services/savings.service.ts`, `budget.service.ts`)
- [x] Sub-goals & Deposit handlers
- [x] Budget & Savings routes (`/api/v1/budget/*`, `/api/v1/savings/*`)

---

### Module 6: Bill Splits & Settlements Domain
- [x] Split bill models & participant types (`src/server/models/split.model.ts`)
- [x] Minimal cash-flow debt reduction algorithm (`src/server/utils/settlement.ts`)
- [x] Split repository & service (`src/server/repositories/split.repository.ts`, `src/server/services/split.service.ts`)
- [x] Settlement tracking with auto expense logging
- [x] Split routes (`/api/v1/splits/*`)

---

### Module 7: Gemini AI Insights & Data Export Domain
- [x] Gemini AI spending analyzer with candidate fallback (`src/server/services/ai.service.ts`)
- [x] Dynamic heuristic fallback financial advisor
- [x] CSV, JSON, and text statement exporter (`src/server/services/export.service.ts`)
- [x] AI & Export routes (`/api/v1/insights/*`, `/api/v1/export/*`, `/api/analyze-spending`)

---

### Module 8: Offline Synchronization & Integration
- [x] Push & pull offline sync engine (`src/server/services/sync.service.ts`)
- [x] Main Express application router (`src/server/routes/index.ts`, `src/server/app.ts`)
- [x] Server bootstrap integration (`server.ts`)

---

### Module 9: Testing & Verification
- [x] Backend automated test suite (`tests/backend.test.ts`)
- [x] Test execution & validation
- [x] Developer README update (`README.md`)
- [ ] Migrate the React local-storage context to the documented API client contract.
