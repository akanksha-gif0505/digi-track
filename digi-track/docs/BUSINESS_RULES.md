# Digi Track — Business Rules Specification

Key business logic and domain constraints enforced on the backend.

---

### BR-001: Spendable Discretionary Budget Calculation
- **Rule**: `MaxSpendableBudget = max(0, MonthlySalary - MonthlySavingsGoal)`.
- **Enforcement**: If a user updates either their monthly salary or their savings goal, the total spendable monthly budget is automatically synchronized to reflect the remaining spendable amount.

---

### BR-002: Savings Vault Integrity & Health State Machine
- **Rule**: When evaluating user spending against salary and savings goals:
  - If `TotalSpent > MonthlySalary`: Health is **`deficit`** (`DeficitAmount = TotalSpent - MonthlySalary`, `SavingsIntact = 0`).
  - Else if `TotalSpent > SpendableBudget`: Health is **`breached`** (`BreachedAmount = TotalSpent - SpendableBudget`, `SavingsIntact = MonthlySalary - TotalSpent`).
  - Else if `SpendableBudget > 0` and `(TotalSpent / SpendableBudget) >= 0.95`: Health is **`borderline`** (`SavingsIntact = MonthlySavingsGoal`).
  - Else if `SpendableBudget > 0` and `(TotalSpent / SpendableBudget) >= 0.75`: Health is **`caution`** (`SavingsIntact = MonthlySavingsGoal`).
  - Otherwise: Health is **`safe`** (`SavingsIntact = MonthlySavingsGoal`).

---

### BR-003: Safe Spend Today Dynamic Calculation
- **Rule**:
  - `RemainingDaysInMonth = TotalDaysInCurrentMonth - CurrentDayOfMonth + 1`
  - `SafeSpendToday = max(0, round(RemainingSpendableBudget / RemainingDaysInMonth))`
- **Enforcement**: Recalculated dynamically on every budget and savings query.

---

### BR-004: Minimal Cash Flow Debt Settlement Reduction
- **Rule**: When a group split bill is logged, participant net balances are computed as `NetBalance = PaidAmount - ShareAmount`. Debtors (negative balance) and Creditors (positive balance) are matched greedily to generate the minimum number of direct settlement debts (`from`, `to`, `amount`).
- **Enforcement**: Executed whenever a split bill is created or modified.

---

### BR-005: Settlement to Expense Conversion
- **Rule**: When a participant settles a debt owed by "You" with `recordAsExpense: true`, the system automatically logs a new expense item categorized under the bill's category with title `Settled with {to}: {billTitle}`.
- **Enforcement**: Atomic creation in `SplitService.settleDebt()`.

---

### BR-006: Tenant Data Isolation
- **Rule**: A user can never read, modify, or delete expenses, budgets, savings goals, or split bills belonging to another user.
- **Enforcement**: Every repository query strictly filters on `userId` extracted from the verified JWT payload.
