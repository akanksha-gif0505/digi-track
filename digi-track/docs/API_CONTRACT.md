# Digi Track — API Contract Specification

All REST APIs are served under `/api/v1/` with a unified JSON response envelope format.

---

## 1. Unified Response Envelopes

### Success Envelope
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional human-readable message",
  "meta": {
    "timestamp": "2026-08-21T06:14:00.000Z",
    "total": 10,
    "page": 1
  }
}
```

### Error Envelope
```json
{
  "success": false,
  "message": "Validation failed",
  "code": "VALIDATION_ERROR",
  "errors": [
    { "field": "amount", "message": "Amount must be a positive number" }
  ],
  "timestamp": "2026-08-21T06:14:00.000Z"
}
```

---

## 2. API Endpoints

### 2.1 Authentication & Profile (`/api/v1/auth`)

#### `POST /api/v1/auth/signup`
- **Auth**: Public
- **Request**:
  ```json
  {
    "name": "Anjali Sharma",
    "email": "anjali@example.com",
    "password": "password123",
    "currencySymbol": "₹",
    "currencyCode": "INR"
  }
  ```
- **Response (201)**:
  ```json
  {
    "success": true,
    "data": {
      "token": "jwt-token-string",
      "user": { "id": "u-1", "name": "Anjali Sharma", "email": "anjali@example.com", "currencySymbol": "₹", "currencyCode": "INR" }
    }
  }
  ```

#### `POST /api/v1/auth/login`
- **Auth**: Public
- **Request**:
  ```json
  {
    "email": "anjali@example.com",
    "password": "password123"
  }
  ```
- **Response (200)**: Token & User profile.

#### `POST /api/v1/auth/demo-login`
- **Auth**: Public
- **Request**:
  ```json
  {
    "email": "anjali.sharma@example.com"
  }
  ```
- **Response (200)**: Instant JWT token & persona user data.

#### `GET /api/v1/auth/me`
- **Auth**: Required (Bearer JWT)
- **Response (200)**: Current user profile.

#### `PUT /api/v1/auth/profile`
- **Auth**: Required
- **Request**:
  ```json
  {
    "name": "Anjali Sharma",
    "phone": "+919876543210",
    "jobTitle": "Lead Engineer",
    "currencySymbol": "₹",
    "currencyCode": "INR"
  }
  ```
- **Response (200)**: Updated user profile.

---

### 2.2 Expenses (`/api/v1/expenses`)

#### `GET /api/v1/expenses`
- **Auth**: Required
- **Query Params**:
  - `search`: string (matches title, notes, category)
  - `category`: string (category ID)
  - `datePreset`: `'all' | 'today' | 'week' | 'month' | 'custom'`
  - `startDate`: string (`YYYY-MM-DD`)
  - `endDate`: string (`YYYY-MM-DD`)
  - `page`: number (default: 1)
  - `limit`: number (default: 50)
- **Response (200)**:
  ```json
  {
    "success": true,
    "data": {
      "expenses": [ ... ],
      "summary": {
        "totalCount": 12,
        "totalAmount": 48430,
        "categoryBreakdown": [ ... ]
      }
    }
  }
  ```

#### `POST /api/v1/expenses`
- **Auth**: Required
- **Request**:
  ```json
  {
    "title": "Grocery Shopping",
    "amount": 1450,
    "category": "shopping",
    "date": "2026-08-21",
    "time": "06:30 PM",
    "paymentMode": "Card",
    "note": "Weekly essentials"
  }
  ```
- **Response (201)**: Created expense object.

#### `PUT /api/v1/expenses/:id`
- **Auth**: Required
- **Request**: Partial expense fields.
- **Response (200)**: Updated expense object.

#### `DELETE /api/v1/expenses/:id`
- **Auth**: Required
- **Response (200)**: `{ "success": true, "message": "Expense deleted" }`

---

### 2.3 Categories (`/api/v1/categories`)

#### `GET /api/v1/categories`
- **Auth**: Required
- **Response (200)**: List of default + user custom categories.

#### `POST /api/v1/categories`
- **Auth**: Required
- **Request**: `{ "name": "Gym", "icon": "fitness_center", "colorHex": "#005c55", "defaultCap": 3000 }`
- **Response (201)**: Created category.

#### `DELETE /api/v1/categories/:id`
- **Auth**: Required
- **Response (200)**: Deletion confirmation.

---

### 2.4 Budget & Savings Vault (`/api/v1/budget` & `/api/v1/savings`)

#### `GET /api/v1/budget`
- **Auth**: Required
- **Response (200)**: Total monthly budget, category caps, spent vs budget percentage, safe spend today.

#### `PUT /api/v1/budget`
- **Auth**: Required
- **Request**: `{ "totalMonthlyBudget": 45000, "categoryCaps": { "food": 10000, "shopping": 15000 } }`
- **Response (200)**: Updated budget configuration.

#### `GET /api/v1/savings`
- **Auth**: Required
- **Response (200)**:
  ```json
  {
    "success": true,
    "data": {
      "monthlySalary": 60000,
      "monthlySavingsGoal": 20000,
      "spendableBudget": 40000,
      "totalSpentThisMonth": 25000,
      "remainingSpendableBudget": 15000,
      "savingsIntactAmount": 20000,
      "savingsBreachedAmount": 0,
      "deficitAmount": 0,
      "savingsHealth": "safe",
      "savingsPercentagePreserved": 100,
      "safeSpendToday": 1500,
      "savingsGoals": [ ... ]
    }
  }
  ```

#### `PUT /api/v1/savings/config`
- **Auth**: Required
- **Request**: `{ "monthlySalary": 65000, "monthlySavingsGoal": 25000, "savingsLockEnabled": true }`
- **Response (200)**: Updated configuration & recalculated metrics.

#### `POST /api/v1/savings/goals`
- **Auth**: Required
- **Request**: `{ "name": "Goa Trip", "targetAmount": 30000, "currentAmount": 10000, "targetDate": "2026-11-15", "icon": "beach_access" }`
- **Response (201)**: Created sub-goal.

#### `POST /api/v1/savings/goals/:id/deposit`
- **Auth**: Required
- **Request**: `{ "amount": 5000 }`
- **Response (200)**: Updated sub-goal with new balance.

---

### 2.5 Bill Splits & Settlements (`/api/v1/splits`)

#### `GET /api/v1/splits`
- **Auth**: Required
- **Response (200)**: List of user split bills with computed settlements.

#### `POST /api/v1/splits`
- **Auth**: Required
- **Request**:
  ```json
  {
    "title": "Team Dinner",
    "totalAmount": 4800,
    "category": "food",
    "date": "2026-08-20",
    "splitType": "equal",
    "participants": [
      { "id": "you", "name": "You", "paidAmount": 4800, "shareAmount": 1200 },
      { "id": "p1", "name": "Rahul", "paidAmount": 0, "shareAmount": 1200 },
      { "id": "p2", "name": "Priya", "paidAmount": 0, "shareAmount": 1200 },
      { "id": "p3", "name": "Vikram", "paidAmount": 0, "shareAmount": 1200 }
    ],
    "notes": "Pizza and mocktails"
  }
  ```
- **Response (201)**: Created split bill with computed settlements matrix.

#### `POST /api/v1/splits/:id/settle`
- **Auth**: Required
- **Request**:
  ```json
  {
    "settlementIndex": 0,
    "paymentMode": "UPI",
    "recordAsExpense": true
  }
  ```
- **Response (200)**: Updated split bill and optionally created expense transaction.

#### `POST /api/v1/splits/:id/settle-all`
- **Auth**: Required
- **Response (200)**: Split bill with all settlements marked settled.

---

### 2.6 AI Insights (`/api/v1/insights` & `/api/analyze-spending`)

#### `POST /api/v1/insights/analyze-spending` (and `POST /api/analyze-spending`)
- **Auth**: Public or Authenticated
- **Request**:
  ```json
  {
    "expenses": [ ... ],
    "categoryBreakdown": [ ... ],
    "totalSpent": 25000,
    "monthlyBudget": 40000,
    "currencySymbol": "₹",
    "currencyCode": "INR"
  }
  ```
- **Response (200)**:
  ```json
  {
    "patternObservation": "Your largest expenditure is in Shopping (52% of total).",
    "actionableTip": "Batch grocery purchases to save approx ₹1,200/mo.",
    "estimatedMonthlySavings": "₹1,200/mo",
    "categoryFocus": "Shopping",
    "keyMetric": "52% spent on Shopping",
    "isAiGenerated": true
  }
  ```

---

### 2.7 Data Export (`/api/v1/export`)

#### `GET /api/v1/export/csv`
- **Response (200)**: `text/csv` attachment.

#### `GET /api/v1/export/json`
- **Response (200)**: Full JSON backup snapshot.

#### `GET /api/v1/export/statement`
- **Response (200)**: `text/plain` formatted financial statement.

---

### 2.8 Offline Sync (`/api/v1/sync`)

#### `POST /api/v1/sync/push`
- **Request**: Batch records of expenses, categories, budget, splits.
- **Response (200)**: Reconciliation status.

#### `GET /api/v1/sync/pull`
- **Response (200)**: Server-side state snapshot for authenticated user.
