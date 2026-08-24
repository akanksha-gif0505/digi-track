# Digi Track — Project Context

## Project Name
**Digi Track** (Daily Rupee Expense & Budget Tracker with Smart AI Insights)

## Project Purpose
Digi Track is a personal finance, budgeting, and expense management application tailored for Indian Rupees (INR) and multi-currency tracking. It empowers users to monitor day-to-day discretionary spending while safeguarding a dedicated "Protected Savings Vault" deducted directly from their monthly salary. The system includes interactive category visualizations, minimal cash-flow bill splitting among groups, and AI-driven spending analysis.

## Target Users
- Working professionals managing monthly salary, savings targets, and daily expenses.
- Roommates and friend groups splitting shared bills (dinners, trips, utilities).
- Individuals wanting actionable, AI-powered financial advisory recommendations.

## Core Modules
1. **IAM & Authentication**: User registration, login, JWT issuance, profile management, and instant demo persona switching.
2. **Expense Management**: Multi-mode expense logging (UPI, Cash, Card, NetBanking), categorized search, date range filters, and transaction history.
3. **Category System**: Default spending categories with customizable budget caps, icons, and color themes.
4. **Monthly Budgeting**: Overall spendable budget tracking, category caps, and real-time safe-to-spend-today calculations.
5. **Protected Savings Vault**: Discretionary vs. protected savings calculations (`Spendable = Salary - SavingsGoal`), vault breach health monitoring (`safe`, `caution`, `borderline`, `breached`, `deficit`), and sub-goal bucket management.
6. **Split Bill & Settlement Engine**: Equal, exact, percentage, and shares splitting with automatic minimal cash-flow settlement matrix generation and settlement tracking.
7. **Gemini AI Spending Insights**: Context-aware analysis of spending patterns, category concentration, and personalized savings tips with graceful heuristic fallbacks.
8. **Export & Reports**: CSV spreadsheet exports, JSON system backups, and formatted text statements.
9. **Offline Sync**: Bi-directional data sync between local client storage and server persistence.

## Technology Stack
- **Backend**: Node.js, Express, TypeScript (`tsx`), modular architecture (Routes → Controllers → Services → Repositories → Models).
- **AI Integration**: `@google/genai` (Gemini Flash / Gemini 3.7 / Gemini Pro candidate fallbacks + heuristic fallback engine).
- **Security**: JWT authentication, salted password hashing, CORS, rate limiting, centralized error handling, and strict input validation.
- **Frontend**: React 19, Tailwind CSS v4, Motion, Recharts, Canvas-Confetti, Vite.
- **Persistence**: ACID-compliant JSON/File database engine with repository interfaces ready for PostgreSQL/SQLite.

## Current Phase & Status
- **Current Phase**: Production Backend Architecture & Implementation.
- **Status**: API v1 routes and business services are operational. Type checking, the 15-case backend integration suite, and the production build pass as of 2026-08-21.
- **Frontend integration note**: The current React context persists application state to browser local storage and does not yet call the API. The backend exposes the contract needed for a future API-client migration.
