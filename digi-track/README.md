# Digi Track — Smart Rupee Expense & Budget Manager

> Production-grade personal finance application with protected salary savings vault, group bill split calculator, interactive spending graphs, multi-format financial exports, and Gemini AI spending advisory.

---

## Tech Stack
- **Backend Architecture**: Node.js, Express, TypeScript (`tsx`), Modular Monolith (Routes → Controllers → Services → Repositories → Models).
- **AI Integration**: Google Gemini API (`@google/genai`) with dynamic heuristic fallback engine.
- **Frontend**: React 19, Tailwind CSS v4, Motion, Recharts, Canvas-Confetti, Vite.
- **Security**: JWT Bearer authentication, salted cryptographic password hashing, rate limiting, and centralized error handling.
- **Persistence**: ACID-compliant JSON/File database engine with repository interfaces ready for PostgreSQL/SQLite.

---

## Quick Start

### 1. Prerequisites
- Node.js >= 18.0.0
- npm or bun

### 2. Environment Setup
Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```
Configure your `GEMINI_API_KEY` in `.env` if you wish to enable live AI advisory generation.

### 3. Run Locally (Development)
```bash
# Install dependencies
npm install

# Start development server (API + Vite SPA live reloading)
npm run dev
```
Open `http://localhost:3000` in your browser.

### 4. Run Automated Backend Tests
```bash
npm run test
```

### 5. Production Build & Start
```bash
# Build Vite SPA & bundle server
npm run build

# Start production server
npm start
```

---

## API Documentation & Architecture Specifications

Detailed documentation is available in the `/docs` directory:
- [CONTEXT.md](file:///docs/CONTEXT.md) — High-level project memory and system constraints.
- [REQUIREMENTS.md](file:///docs/REQUIREMENTS.md) — Structured backend requirements (`REQ-001` to `REQ-013`).
- [ARCHITECTURE.md](file:///docs/ARCHITECTURE.md) — Multi-tier architecture and data flows.
- [API_CONTRACT.md](file:///docs/API_CONTRACT.md) — Complete specification of all `/api/v1/*` endpoints.
- [DATABASE.md](file:///docs/DATABASE.md) — Relational schema definitions and field types.
- [BUSINESS_RULES.md](file:///docs/BUSINESS_RULES.md) — Spendable budget calculations, vault integrity state machine, minimal debt graph reduction.
- [DECISIONS.md](file:///docs/DECISIONS.md) — Architecture Decision Records (ADRs).
- [SECURITY.md](file:///docs/SECURITY.md) — JWT handling, password hashing, and rate limiting.
- [ERROR_HANDLING.md](file:///docs/ERROR_HANDLING.md) — Centralized error schemas and HTTP codes.
- [VALIDATION.md](file:///docs/VALIDATION.md) — Input validation schemas.
- [TESTING.md](file:///docs/TESTING.md) — Test strategy and suite definitions.
- [DEPLOYMENT.md](file:///docs/DEPLOYMENT.md) — Container and Cloud Run deployment instructions.
- [CHANGELOG.md](file:///docs/CHANGELOG.md) — Version history and changelog.
- [TODO.md](file:///docs/TODO.md) — Task tracking.
