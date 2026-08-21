# Digi Track — Input Validation Specification

Validation rules enforced on all client inputs before reaching controller execution.

---

## 1. Validation Rules by Entity

### 1.1 User Signup & Profile
- `name`: String, 2 - 80 characters, trimmed.
- `email`: Valid RFC 5322 email address format, lowercased, max 120 characters.
- `password`: Min 6 characters, max 100 characters.
- `currencySymbol`: 1 - 4 characters (e.g., `'₹'`, `'$'`, `'€'`).
- `currencyCode`: 3-letter ISO code (e.g., `'INR'`, `'USD'`, `'EUR'`).

### 1.2 Expense Creation & Update
- `title`: String, required, 1 - 120 characters.
- `amount`: Number, required, `amount > 0`, max 100,000,000.
- `category`: String, required, valid category ID.
- `date`: String, format `YYYY-MM-DD`, valid calendar date.
- `time`: String, optional, max 20 characters.
- `paymentMode`: Enum, one of `['Cash', 'UPI', 'Card', 'NetBanking']`.
- `note`: String, optional, max 500 characters.

### 1.3 Budget & Savings Configuration
- `monthlySalary`: Number, required, `>= 0`.
- `monthlySavingsGoal`: Number, required, `>= 0` and `<= monthlySalary`.
- `emergencyFundReserve`: Number, optional, `>= 0`.
- `savingsLockEnabled`: Boolean.

### 1.4 Split Bills
- `title`: String, required, 1 - 120 characters.
- `totalAmount`: Number, required, `totalAmount > 0`.
- `category`: String, required.
- `date`: String, format `YYYY-MM-DD`.
- `splitType`: Enum, one of `['equal', 'exact', 'percentage', 'shares']`.
- `participants`: Array of `SplitParticipant`, minimum 2 participants.
- Sum of `shareAmount` must approximate `totalAmount` within rounding precision.
