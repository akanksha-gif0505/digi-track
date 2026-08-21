# Digi Track — Architecture Specification

Technical representation of the Digi Track system architecture, module separation, data flows, and layer responsibilities.

---

## 1. System Architecture Diagram

```text
┌────────────────────────────────────────────────────────────────────────┐
│                          USERS / CLIENTS LAYER                         │
│  - React / Vite SPA Client (Web & Mobile Viewports)                    │
│  - Offline-First Local Storage Cache & Sync Engine                     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / HTTPS (REST API)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        EDGE & SECURITY MIDDLEWARE                      │
│  - Helmet Security Headers & CORS Policy                               │
│  - In-Memory Sliding Window Rate Limiter                               │
│  - Centralized Error Handling & JSON Standardizer                      │
│  - JWT Bearer Authentication & User Tenant Isolation Middleware        │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                       MODULAR APPLICATION TIER                         │
│                                                                        │
│   ┌────────────────┐   ┌────────────────┐   ┌────────────────┐         │
│   │  Auth & IAM    │   │ Expenses       │   │ Categories     │         │
│   │  Controller    │   │ Controller     │   │ Controller     │         │
│   └───────┬────────┘   └───────┬────────┘   └───────┬────────┘         │
│           ▼                    ▼                    ▼                  │
│   ┌────────────────┐   ┌────────────────┐   ┌────────────────┐         │
│   │  Budget &      │   │ Split Bills &  │   │ Gemini AI      │         │
│   │  Savings Vault │   │ Settlements    │   │ Insights       │         │
│   │  Controller    │   │ Controller     │   │ Controller     │         │
│   └───────┬────────┘   └───────┬────────┘   └───────┬────────┘         │
│           │                    │                    │                  │
│           ▼                    ▼                    ▼                  │
│   ┌──────────────────────────────────────────────────────────┐         │
│   │                     DOMAIN SERVICES                      │         │
│   │  (AuthService, ExpenseService, SavingsService, etc.)     │         │
│   └────────────────────────────┬─────────────────────────────┘         │
└────────────────────────────────┼───────────────────────────────────────┘
                                 │
                                 ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        REPOSITORY & PERSISTENCE                        │
│   ┌──────────────────────────────────────────────────────────┐         │
│   │             Generic / Domain Repositories                │         │
│   │  (UserRepository, ExpenseRepository, SplitRepository)   │         │
│   └────────────────────────────┬─────────────────────────────┘         │
│                                │                                       │
│   ┌────────────────────────────┴─────────────────────────────┐         │
│   │   Atomic File / JSON Database Engine (PostgreSQL Ready)  │         │
│   │   - Tenant isolation by userId                           │         │
│   │   - Seed data bootstrapping for demo profiles            │         │
│   └──────────────────────────────────────────────────────────┘         │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Layer Responsibilities

### 2.1 Routes (`src/server/routes/`)
- Define HTTP verbs and URL paths (`/api/v1/*`).
- Bind route-specific middleware (auth guard, rate limiters, validation schemas).
- Forward request context directly to corresponding controller methods. No business logic.

### 2.2 Controllers (`src/server/controllers/`)
- Extract request parameters, query strings, and body payloads.
- Invoke appropriate domain services with authenticated user context (`req.user.id`).
- Return standardized JSON responses (`success: true, data, message`) with semantic HTTP status codes.

### 2.3 Domain Services (`src/server/services/`)
- Implement core business logic and computational rules (e.g., waterfall calculations, savings health state machine, minimal debt graph reduction, AI prompt crafting).
- Orchestrate cross-repository operations (e.g. creating an expense upon bill settlement).

### 2.4 Repositories (`src/server/repositories/`)
- Abstract storage and retrieval mechanisms.
- Perform CRUD, filtering, indexing, and tenant isolation queries (`where userId = ?`).
- Provide clean swap point for PostgreSQL, SQLite, or cloud datastores.

### 2.5 Models & Schemas (`src/server/models/`)
- Define TypeScript interfaces and runtime schema structures for entities.

---

## 3. Data Flow Example: Expense Logging & Vault Recalculation

```text
1. Client POST /api/v1/expenses
      ↓
2. AuthMiddleware (Verifies JWT Bearer token -> sets req.user)
      ↓
3. ValidateMiddleware (Validates title, amount > 0, category, date)
      ↓
4. ExpenseController.create(req, res, next)
      ↓
5. ExpenseService.createExpense(userId, data)
      ↓
6. ExpenseRepository.create({ ...data, userId, id, createdAt })
      ↓
7. Recalculates updated Monthly Spent & Vault Health
      ↓
8. Return { success: true, data: newExpense, vaultStatus } (201 Created)
```
