# Digi Track — Architecture Decision Log

Meaningful architectural decisions recorded during backend development.

---

### DEC-001: Modular Monolith vs Microservices
- **Decision**: Implement a Modular Monolith inside Node.js/Express with clean domain separation (Auth, Expenses, Categories, Budget/Savings, Splits, AI, Sync).
- **Why**: Keeps latency minimal, fits the single-process deployment model on Cloud Run / container instances, and avoids distributed transaction overhead while maintaining clean internal boundaries.
- **Alternatives considered**: Microservices architecture.
- **Impact**: Code is organized into dedicated service and repository layers that can be split into microservices in the future if required.
- **Date**: 2026-08-21

---

### DEC-002: JWT Authentication with Stateless Bearer Tokens & Demo Personas
- **Decision**: Use HMAC SHA-256 JWT access tokens passed via `Authorization: Bearer <token>` headers, coupled with instant 1-click demo persona authentication endpoints.
- **Why**: Supports both standard production web/mobile clients and instant AI Studio evaluation without requiring third-party OAuth callbacks or server-side session stores.
- **Alternatives considered**: Stateful cookie sessions, third-party Auth0 integration.
- **Impact**: Zero external dependency for auth verification, high resilience.
- **Date**: 2026-08-21

---

### DEC-003: Abstract Repository Pattern with Embedded ACID-Atomic Storage
- **Decision**: Build repository abstractions backed by an atomic file/memory persistence engine with JSON serialization and automatic seed data initialization.
- **Why**: Guarantees persistence across container restarts without mandatory external PostgreSQL setup during development and testing, while providing standard repository interfaces easily switchable to TypeORM/Prisma with PostgreSQL.
- **Alternatives considered**: In-memory only array storage, external PostgreSQL mandatory requirement.
- **Impact**: Zero runtime friction, fully persistent, production-ready schema compliance.
- **Date**: 2026-08-21

---

### DEC-004: Dual Compatibility for AI Spending Analysis Endpoints
- **Decision**: Expose `POST /api/v1/insights/analyze-spending` while keeping `POST /api/analyze-spending` routed to the same controller.
- **Why**: Ensures backward compatibility with existing AI Studio frontend calls while standardizing the RESTful v1 API layout.
- **Alternatives considered**: Breaking old endpoint and forcing client changes.
- **Impact**: Seamless zero-downtime compatibility.
- **Date**: 2026-08-21

---

### DEC-005: Deterministic Waterfall & Savings Vault State Machine
- **Decision**: Calculate spendable limits, preserved savings, breach amounts, and health status (`safe` | `caution` | `borderline` | `breached` | `deficit`) deterministically in the backend domain service.
- **Why**: Ensures business calculations are single-sourced of truth and not dependent solely on client-side math.
- **Alternatives considered**: Client-side calculation only.
- **Impact**: Consistent financial metrics across all web and mobile clients.
- **Date**: 2026-08-21
