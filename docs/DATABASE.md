# Digi Track — Database & Entity Models

Schema models, entity relationships, fields, constraints, and query access patterns.

---

## 1. Entity Relational Diagram

```text
┌─────────────────────────┐
│          User           │
├─────────────────────────┤
│ id (PK, string)         │
│ email (unique)          │
│ passwordHash            │
│ name                    │
│ avatarUrl               │
│ currencySymbol          │
│ currencyCode            │
│ isPremium               │
│ onboarded               │
│ phone                   │
│ jobTitle                │
│ createdAt / updatedAt   │
└────────────┬────────────┘
             │ 1:N
             ├───────────────────────────┬───────────────────────────┐
             │                           │                           │
             ▼                           ▼                           ▼
┌─────────────────────────┐ ┌─────────────────────────┐ ┌─────────────────────────┐
│         Expense         │ │        Category         │ │      SavingsConfig      │
├─────────────────────────┤ ├─────────────────────────┤ ├─────────────────────────┤
│ id (PK, string)         │ │ id (PK, string)         │ │ id (PK, string)         │
│ userId (FK, indexed)    │ │ userId (FK, nullable)   │ │ userId (FK, unique)     │
│ title                   │ │ name                    │ │ monthlySalary           │
│ amount (float)          │ │ icon                    │ │ monthlySavingsGoal      │
│ category (indexed)      │ │ colorHex                │ │ emergencyFundReserve    │
│ date (YYYY-MM-DD, idx)  │ │ defaultCap              │ │ savingsLockEnabled      │
│ time                    │ │ isDefault (boolean)     │ │ autoDeductSavings       │
│ paymentMode             │ │ createdAt / updatedAt   │ │ createdAt / updatedAt   │
│ note                    │ └─────────────────────────┘ └────────────┬────────────┘
│ createdAt / updatedAt   │                                          │ 1:N
└─────────────────────────┘                                          ▼
             │                                          ┌─────────────────────────┐
             │                                          │       SavingsGoal       │
             ▼                                          ├─────────────────────────┤
┌─────────────────────────┐                             │ id (PK, string)         │
│      BudgetConfig       │                             │ userId (FK, indexed)    │
├─────────────────────────┤                             │ name                    │
│ id (PK, string)         │                             │ targetAmount (float)    │
│ userId (FK, unique)     │                             │ currentAmount (float)   │
│ totalMonthlyBudget      │                             │ targetDate (nullable)   │
│ selectedMonth (YYYY-MM) │                             │ category                │
│ categoryCaps (JSON)     │                             │ icon                    │
│ createdAt / updatedAt   │                             │ createdAt / updatedAt   │
└─────────────────────────┘                             └─────────────────────────┘
             │
             ▼
┌─────────────────────────┐
│        SplitBill        │
├─────────────────────────┤
│ id (PK, string)         │
│ userId (FK, indexed)    │
│ title                   │
│ totalAmount (float)     │
│ category                │
│ date (YYYY-MM-DD)       │
│ splitType (enum)        │
│ participants (JSON)     │
│ settlements (JSON)      │
│ notes                   │
│ createdAt / updatedAt   │
└─────────────────────────┘
```

---

## 2. Entity Field Specifications

### 2.1 User
| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | String | Yes | Unique ID (e.g. `user-12345`) |
| `email` | String | Yes | Normalized lowercase, Unique index |
| `passwordHash` | String | Yes | Salted hash (Bcrypt) |
| `name` | String | Yes | Display name |
| `avatarUrl` | String | No | Image URL |
| `currencySymbol`| String | Yes | Default: `'₹'` |
| `currencyCode` | String | Yes | Default: `'INR'` |
| `isPremium` | Boolean| Yes | Default: `false` |
| `phone` | String | No | Contact phone number |
| `jobTitle` | String | No | Professional title |
| `createdAt` | Integer| Yes | Epoch timestamp (ms) |
| `updatedAt` | Integer| Yes | Epoch timestamp (ms) |

### 2.2 Expense
| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | String | Yes | Primary Key (e.g. `exp-1724...`) |
| `userId` | String | Yes | Tenant isolation foreign key |
| `title` | String | Yes | Description / merchant name |
| `amount` | Number | Yes | Value > 0 |
| `category` | String | Yes | Category ID reference |
| `date` | String | Yes | Format: `YYYY-MM-DD` |
| `time` | String | Yes | Format: `hh:mm A` |
| `paymentMode` | Enum | Yes | `'Cash' \| 'UPI' \| 'Card' \| 'NetBanking'` |
| `note` | String | No | Optional user remarks |
| `createdAt` | Integer| Yes | Epoch timestamp (ms) |
| `updatedAt` | Integer| Yes | Epoch timestamp (ms) |

### 2.3 SplitBill
| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | String | Yes | Primary Key (e.g. `split-1724...`) |
| `userId` | String | Yes | Tenant isolation foreign key |
| `title` | String | Yes | Bill description |
| `totalAmount` | Number | Yes | Value > 0 |
| `category` | String | Yes | Category ID |
| `date` | String | Yes | Format: `YYYY-MM-DD` |
| `splitType` | Enum | Yes | `'equal' \| 'exact' \| 'percentage' \| 'shares'` |
| `participants` | JSON | Yes | Array of `SplitParticipant` |
| `settlements` | JSON | Yes | Array of `SettlementDebt` |
| `notes` | String | No | Remarks |
| `createdAt` | Integer| Yes | Epoch timestamp (ms) |

---

## 3. Indexing & Access Patterns

1. **Expenses by User & Date**: Fast retrieval of current month transactions and history date range filtering:
   - Index: `(userId, date DESC, createdAt DESC)`
2. **Category Filter**: `(userId, category)`
3. **User Authentication**: `(email)` unique index.
4. **Split Bills by User**: `(userId, createdAt DESC)`.
