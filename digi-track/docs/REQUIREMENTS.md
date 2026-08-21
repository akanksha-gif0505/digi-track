# Digi Track — Backend Requirements

Structured requirements derived from the PRD, architecture specification, and frontend capabilities.

---

### REQ-001: User Authentication & IAM
- **Description**: Users must be able to sign up with name, email, password, and currency preference, and log in securely with JWT token issuance.
- **Priority**: High
- **Source**: PRD / AuthScreen
- **Backend Impact**: User Model, Password Hashing, JWT utils, Auth Controller, Auth Middleware (`/api/v1/auth/*`).
- **Status**: Completed

### REQ-002: User Profile & Preferences
- **Description**: Authenticated users can retrieve and update their profile details (name, avatar, currency symbol/code, phone, job title).
- **Priority**: Medium
- **Source**: SettingsScreen
- **Backend Impact**: Profile Service & Controller (`GET /api/v1/auth/me`, `PUT /api/v1/auth/profile`).
- **Status**: Completed

### REQ-003: Expense Logging & Management
- **Description**: Users can create, read, update, and delete expense items with title, numeric amount, category, date (YYYY-MM-DD), time, payment mode (UPI, Cash, Card, NetBanking), and optional notes.
- **Priority**: High
- **Source**: AddExpenseScreen / HistoryScreen / DashboardScreen
- **Backend Impact**: Expense Model, Repository, Service, Controller (`/api/v1/expenses/*`).
- **Status**: Completed

### REQ-004: Expense Search & Filtering
- **Description**: Support query searching by title, category, note, payment mode, and filtering by category and date ranges (today, week, month, custom start/end).
- **Priority**: High
- **Source**: HistoryScreen
- **Backend Impact**: Filtering logic in Expense Repository & Service.
- **Status**: Completed

### REQ-005: Category System & Budget Caps
- **Description**: Provide system default categories with icon/color metadata and allow users to create custom categories and set category spending caps.
- **Priority**: Medium
- **Source**: BudgetScreen / SettingsScreen
- **Backend Impact**: Category Model, Repository, Service (`/api/v1/categories/*`).
- **Status**: Completed

### REQ-006: Monthly Budget Tracking & Safe Daily Spend
- **Description**: Calculate total monthly spent against spendable budget and compute dynamic "Safe Spend Today" based on remaining days in the month.
- **Priority**: High
- **Source**: BudgetScreen / DashboardScreen
- **Backend Impact**: Budget Service with calendar calculations (`/api/v1/budget/*`).
- **Status**: Completed

### REQ-007: Protected Savings Vault Protection & Health Metrics
- **Description**: Manage monthly salary and savings goals (`Spendable = Salary - SavingsGoal`). Compute vault breach status (`safe`, `caution`, `borderline`, `breached`, `deficit`), intact savings, and breached amounts.
- **Priority**: High
- **Source**: SavingsScreen / DashboardScreen
- **Backend Impact**: Savings Service with deterministic financial health state machine (`/api/v1/savings/*`).
- **Status**: Completed

### REQ-008: Savings Sub-Goals & Deposits
- **Description**: Allow users to create dedicated goal buckets (e.g. Emergency Vault, Holiday Trip), view progress percentages, and make deposits.
- **Priority**: Medium
- **Source**: SavingsScreen
- **Backend Impact**: Savings Goal Model & CRUD endpoints (`/api/v1/savings/goals/*`).
- **Status**: Completed

### REQ-009: Multi-Method Bill Splitting & Minimal Settlement Matrix
- **Description**: Support splitting shared group bills via equal, exact, percentage, and shares methods. Automatically calculate minimal cash-flow settlement transactions between debtors and creditors.
- **Priority**: High
- **Source**: SplitExpenseScreen
- **Backend Impact**: SplitBill Model, Settlement Graph Algorithm, Service (`/api/v1/splits/*`).
- **Status**: Completed

### REQ-010: Settlement Tracking & Auto Expense Logging
- **Description**: Allow users to mark debts as settled with payment mode and optionally record the settlement payment as an expense in the payer's transaction history.
- **Priority**: Medium
- **Source**: SplitExpenseScreen
- **Backend Impact**: Settle Debt endpoint with optional Expense creation transaction (`POST /api/v1/splits/:id/settle`).
- **Status**: Completed

### REQ-011: Gemini AI Spending Analyzer & Heuristic Advisor
- **Description**: Provide contextual financial advisory observations, savings tips, and key metrics via Gemini API, with seamless heuristic fallback when API keys are absent or rate limits are reached.
- **Priority**: High
- **Source**: server.ts / DashboardScreen / SavingsScreen
- **Backend Impact**: AI Service integrating `@google/genai` and dynamic fallback (`POST /api/v1/insights/analyze-spending`).
- **Status**: Completed

### REQ-012: Export & Data Backup
- **Description**: Export user financial records to CSV spreadsheet, full JSON backup, and printable text statement formats.
- **Priority**: Medium
- **Source**: DownloadExpensesModal
- **Backend Impact**: Export Service & Endpoints (`/api/v1/export/*`).
- **Status**: Completed

### REQ-013: Offline-First Synchronization
- **Description**: Provide sync endpoints to pull recent data and push batch changes for offline client state reconciliation.
- **Priority**: Medium
- **Source**: ExpenseContext
- **Backend Impact**: Sync Service & Controller (`/api/v1/sync/*`).
- **Status**: Completed
