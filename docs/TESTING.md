# Digi Track — Testing Strategy Specification

Testing coverage, test suites, and automated verification plan.

---

## 1. Test Categories

### 1.1 Unit Tests
- **JWT & Cryptography**: Token generation, verification, password hashing, and salt comparison.
- **Financial Waterfall Engine**: Spendable budget calculation, savings preservation, breach detection, deficit computation, and safe spend today.
- **Settlement Matrix Algorithm**: Verifying minimal cash-flow debt reduction across 2, 3, and 5+ participants for equal and custom share distributions.

### 1.2 API & Integration Tests
- **Auth Flow**: Signup -> Token issuance -> Access protected endpoint -> Token rejection when invalid.
- **Expense Lifecycle**: Create expense -> Read list with filters -> Update expense -> Delete expense -> Verify category totals updated.
- **Budget & Savings Flow**: Update salary/savings goal -> Check spendable budget calculation -> Deposit to sub-goal.
- **Split Bill Flow**: Create split bill -> Verify settlement debts computed -> Settle debt -> Verify optional expense transaction logged.
- **AI Spending Analyzer**: Verify endpoint returns JSON schema compliance with both live Gemini model and heuristic fallback.

---

## 2. Test Execution Commands

```bash
# Run backend test suite
npx tsx tests/backend.test.ts

# Run TypeScript compilation check
npm run lint
```
