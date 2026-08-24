# DigiTrack - Frontend vs Backend Separation

This document clearly separates and explains the Frontend and Backend components of DigiTrack.

---

## 📊 Architecture Comparison

### Two Deployment Modes:

```
MODE 1: UNIFIED FULLSTACK (Recommended for Development)
┌─────────────────────────────────────────────────┐
│                                                 │
│         Single Express Server (Port 3000)       │
│                                                 │
│  ┌─────────────────┐  ┌─────────────────────┐  │
│  │   Vite Dev      │  │   Express API       │  │
│  │   Middleware    │  │   /api/v1/*         │  │
│  │                 │  │                     │  │
│  │   Frontend      │  │   Backend           │  │
│  │   React App     │  │   REST Endpoints    │  │
│  └─────────────────┘  └─────────────────────┘  │
│                                                 │
└─────────────────────────────────────────────────┘
      One server, one deployment, one process


MODE 2: SEPARATE BACKEND + FRONTEND
┌──────────────────────┐    ┌─────────────────────┐
│  Frontend Server     │    │  Backend Server     │
│  (Vite/Vercel/etc)   │◄───┤  (Express REST API) │
│  Port 5173/3001      │CORS│  Port 3000          │
│                      │    │                     │
│  React App           │    │  /api/v1/*          │
│  UI Components       │    │  Business Logic     │
└──────────────────────┘    └─────────────────────┘
    Two servers, separate deployments
```

---

## 🎨 FRONTEND ARCHITECTURE

### Location: `src/` (except `src/server/`)

### Technology Stack
- **Framework:** React 19
- **Build Tool:** Vite 6.2.3
- **Styling:** Tailwind CSS v4
- **State:** React Context API
- **Routing:** Client-side navigation (SPA)
- **Charts:** Recharts
- **Icons:** Lucide React
- **Animations:** Motion (Framer Motion)

### Directory Structure
```
src/
├── components/           ← All React UI Components
│   ├── Header.tsx
│   ├── Navigation.tsx
│   ├── DashboardScreen.tsx
│   ├── AddExpenseScreen.tsx
│   ├── BudgetScreen.tsx
│   ├── SavingsScreen.tsx
│   ├── SplitExpenseScreen.tsx
│   ├── HistoryScreen.tsx
│   ├── SettingsScreen.tsx
│   ├── AuthScreen.tsx
│   ├── OnboardingScreen.tsx
│   └── ArchitectureModal.tsx
│
├── context/              ← State Management
│   └── ExpenseContext.tsx
│
├── data/                 ← Frontend data utilities
│
├── App.tsx              ← Main React Application
├── main.tsx             ← React Entry Point
├── index.css            ← Global Styles (Tailwind)
└── types.ts             ← TypeScript Type Definitions
```

### Frontend Features

#### 1. **User Interface Components**
- Responsive design (mobile + desktop)
- Touch-friendly interactions
- Smooth animations and transitions
- Loading states and error handling
- Toast notifications

#### 2. **Screens/Pages**
| Screen | Purpose | Key Features |
|--------|---------|--------------|
| `OnboardingScreen` | Initial setup | User profile creation |
| `AuthScreen` | Login/Register | JWT authentication |
| `DashboardScreen` | Main view | Stats, charts, overview |
| `AddExpenseScreen` | Add expense | Form with validation |
| `HistoryScreen` | Expense list | Filtering, search, timeline |
| `BudgetScreen` | Budget management | Set limits, track spending |
| `SavingsScreen` | Savings vault | Protected savings tracking |
| `SplitExpenseScreen` | Bill splitting | Group expenses, settlements |
| `SettingsScreen` | User settings | Profile, preferences |

#### 3. **State Management (ExpenseContext)**
- User authentication state
- Expense CRUD operations
- Budget management
- Category management
- Savings tracking
- Split bill calculations
- Local storage sync

#### 4. **Data Flow (Frontend)**
```
User Interaction
    ↓
Component Event Handler
    ↓
Context Action (ExpenseContext)
    ↓
API Call to Backend (/api/v1/*)
    ↓
Update Local State
    ↓
Re-render Components
```

#### 5. **Styling System**
- **Tailwind CSS** for utility-first styling
- Custom color palette (blues, grays)
- Responsive breakpoints
- Dark mode ready (future)
- Component-scoped styles

#### 6. **Build Process**
- **Development:** Vite dev server with HMR
- **Production:** Optimized bundle with code splitting
- **Output:** Static files in `dist/` folder

---

## ⚙️ BACKEND ARCHITECTURE

### Locations:
1. **Embedded Backend:** `src/server/` (fullstack mode)
2. **Standalone Backend:** `digi-track-backend/src/` (separate deployment)

### Technology Stack
- **Runtime:** Node.js 18+
- **Framework:** Express 4
- **Language:** TypeScript
- **Execution:** tsx (TypeScript executor)
- **AI:** Google Gemini API
- **Auth:** JWT Bearer tokens
- **Database:** JSON file-based (PostgreSQL-ready)

### Directory Structure
```
src/server/  (or digi-track-backend/src/)
│
├── config/                    ← Configuration
│   ├── database.ts            (DB connection & init)
│   ├── env.ts                 (Environment variables)
│   └── logger.ts              (Logging utility)
│
├── constants/                 ← Constants & Defaults
│   ├── defaultData.ts         (Seed data)
│   └── httpStatus.ts          (HTTP status codes)
│
├── controllers/               ← Request Handlers
│   ├── auth.controller.ts     (Login, register, me)
│   ├── expense.controller.ts  (Expense CRUD)
│   ├── budget.controller.ts   (Budget management)
│   ├── category.controller.ts (Categories)
│   ├── savings.controller.ts  (Savings vault)
│   ├── split.controller.ts    (Bill splitting)
│   └── ai.controller.ts       (AI insights)
│
├── middlewares/               ← HTTP Middleware
│   ├── auth.middleware.ts     (JWT verification)
│   ├── error.middleware.ts    (Error handling)
│   ├── security.middleware.ts (CORS, headers)
│   └── rateLimiter.middleware.ts (Rate limiting)
│
├── models/                    ← Data Models
│   ├── user.model.ts
│   ├── expense.model.ts
│   ├── budget.model.ts
│   ├── category.model.ts
│   ├── savings.model.ts
│   └── split.model.ts
│
├── repositories/              ← Data Access Layer
│   ├── base.repository.ts     (Generic CRUD)
│   ├── user.repository.ts
│   ├── expense.repository.ts
│   ├── budget.repository.ts
│   ├── category.repository.ts
│   ├── savings.repository.ts
│   └── split.repository.ts
│
├── services/                  ← Business Logic
│   ├── auth.service.ts        (User auth logic)
│   ├── expense.service.ts     (Expense logic)
│   ├── budget.service.ts      (Budget calculations)
│   ├── category.service.ts    (Category management)
│   ├── savings.service.ts     (Savings logic)
│   ├── split.service.ts       (Split calculations)
│   ├── ai.service.ts          (AI integration)
│   ├── export.service.ts      (Data export)
│   └── sync.service.ts        (Data sync)
│
├── routes/                    ← API Routes
│   └── index.ts               (Route definitions)
│
├── utils/                     ← Utilities
│   ├── jwt.ts                 (JWT helpers)
│   ├── password.ts            (Password hashing)
│   ├── response.ts            (Response formatting)
│   └── settlement.ts          (Split settlement logic)
│
├── app.ts                     ← Express App Setup
└── server.ts                  ← Server Entry Point
```

### Backend Architecture Layers

```
┌─────────────────────────────────────────┐
│         HTTP REQUEST                    │
│         (POST /api/v1/expenses)         │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│       MIDDLEWARE CHAIN                  │
│  ┌─────────────────────────────────┐   │
│  │ 1. Security Headers (CORS)      │   │
│  │ 2. Rate Limiter                 │   │
│  │ 3. Auth Middleware (JWT)        │   │
│  │ 4. Request Validation           │   │
│  └─────────────────────────────────┘   │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│       CONTROLLER LAYER                  │
│  ┌─────────────────────────────────┐   │
│  │ ExpenseController.create()      │   │
│  │ - Extract request data          │   │
│  │ - Get userId from req.user      │   │
│  │ - Call service layer            │   │
│  └─────────────────────────────────┘   │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│       SERVICE LAYER                     │
│  ┌─────────────────────────────────┐   │
│  │ ExpenseService.createExpense()  │   │
│  │ - Validate business rules       │   │
│  │ - Calculate impacts             │   │
│  │ - Call repository               │   │
│  └─────────────────────────────────┘   │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│       REPOSITORY LAYER                  │
│  ┌─────────────────────────────────┐   │
│  │ ExpenseRepository.create()      │   │
│  │ - Generate ID                   │   │
│  │ - Add timestamps                │   │
│  │ - Save to database              │   │
│  └─────────────────────────────────┘   │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│       DATABASE LAYER                    │
│  ┌─────────────────────────────────┐   │
│  │ JSON File Database              │   │
│  │ .data/digitrack_db.json         │   │
│  │ - Atomic writes                 │   │
│  │ - Tenant isolation              │   │
│  └─────────────────────────────────┘   │
└────────────────┬────────────────────────┘
                 ↓
┌─────────────────────────────────────────┐
│       HTTP RESPONSE                     │
│       { success: true, data: {...} }    │
└─────────────────────────────────────────┘
```

### Backend Responsibilities

#### 1. **Authentication & Authorization**
- User registration with password hashing
- Login with JWT token generation
- Token validation on protected routes
- User profile management

#### 2. **Data Management**
- CRUD operations for all entities
- Data validation and sanitization
- Tenant isolation (per-user data)
- Atomic database operations

#### 3. **Business Logic**
- Budget calculation (spendable amount)
- Savings health status determination
- Bill split settlement optimization
- Category spending aggregation

#### 4. **AI Integration**
- Gemini API communication
- Spending pattern analysis
- Personalized recommendations
- Fallback heuristic engine

#### 5. **Security**
- JWT token management
- Password hashing (bcrypt-style)
- Rate limiting (prevent abuse)
- CORS policy enforcement
- Security headers (Helmet)

#### 6. **Data Export**
- CSV generation
- JSON export
- Filtered data extraction

---

## 🔄 Frontend ↔ Backend Communication

### API Contract

#### Authentication Flow
```
Frontend                          Backend
  |                                  |
  |  POST /api/v1/auth/register      |
  |  { email, password, name }       |
  |--------------------------------->|
  |                                  | - Hash password
  |                                  | - Create user
  |                                  | - Generate JWT
  |  { success: true, token, user }  |
  |<---------------------------------|
  |                                  |
  | Store token in state/localStorage|
  |                                  |
  |  GET /api/v1/expenses            |
  |  Headers: { Authorization: ... } |
  |--------------------------------->|
  |                                  | - Verify JWT
  |                                  | - Get user expenses
  |  { success: true, data: [...] }  |
  |<---------------------------------|
```

#### Data Flow Example: Adding an Expense
```
1. User fills form in AddExpenseScreen
2. Submit button clicked
3. ExpenseContext.addExpense() called
4. API call: POST /api/v1/expenses
   Headers: { Authorization: Bearer <token> }
   Body: { title, amount, category, date, ... }
5. Backend validates JWT → extracts userId
6. ExpenseController.create() called
7. ExpenseService.createExpense() processes
8. ExpenseRepository.create() saves to DB
9. Response: { success: true, data: newExpense }
10. Frontend updates local state
11. UI re-renders with new expense
```

### API Endpoints Used by Frontend

| Frontend Feature | API Endpoint | Method |
|------------------|--------------|--------|
| Register | `/api/v1/auth/register` | POST |
| Login | `/api/v1/auth/login` | POST |
| Get Profile | `/api/v1/auth/me` | GET |
| List Expenses | `/api/v1/expenses` | GET |
| Add Expense | `/api/v1/expenses` | POST |
| Update Expense | `/api/v1/expenses/:id` | PUT |
| Delete Expense | `/api/v1/expenses/:id` | DELETE |
| Get Categories | `/api/v1/categories` | GET |
| Add Category | `/api/v1/categories` | POST |
| Get Budgets | `/api/v1/budgets` | GET |
| Update Budget | `/api/v1/budgets` | POST |
| Get Savings | `/api/v1/savings` | GET |
| Update Savings | `/api/v1/savings` | POST |
| List Splits | `/api/v1/splits` | GET |
| Create Split | `/api/v1/splits` | POST |
| Settle Split | `/api/v1/splits/:id/settle` | POST |
| AI Analysis | `/api/analyze-spending` | POST |

---

## 📦 Dependency Separation

### Frontend Dependencies (package.json)
```json
{
  "dependencies": {
    "react": "UI framework",
    "react-dom": "React rendering",
    "recharts": "Charts",
    "lucide-react": "Icons",
    "motion": "Animations",
    "canvas-confetti": "Effects"
  },
  "devDependencies": {
    "vite": "Build tool",
    "tailwindcss": "Styling",
    "typescript": "Type system"
  }
}
```

### Backend Dependencies
```json
{
  "dependencies": {
    "express": "Web framework",
    "@google/genai": "AI integration",
    "dotenv": "Environment config"
  },
  "devDependencies": {
    "tsx": "TypeScript execution",
    "esbuild": "Backend bundling"
  }
}
```

### Shared Dependencies
- `typescript` - Type system
- `dotenv` - Environment variables
- `@types/node` - Node.js types
- `@types/express` - Express types

---

## 🚀 Running Frontend & Backend

### Option 1: Unified (Fullstack Mode)
```bash
# One command starts both
npm run dev

# Access at: http://localhost:3000
# Frontend served by Vite middleware
# Backend API at /api/v1/*
```

### Option 2: Separate Servers
```bash
# Terminal 1 - Backend
cd digi-track-backend
npm run dev
# Runs on: http://localhost:3000

# Terminal 2 - Frontend
npx vite
# Runs on: http://localhost:5173
# Must configure API_BASE_URL to point to backend
```

---

## 🔐 Authentication Flow

### Frontend (AuthScreen.tsx)
```typescript
// Login function
const login = async (email, password) => {
  const response = await fetch('/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  const data = await response.json();
  
  if (data.success) {
    // Store token and user
    localStorage.setItem('token', data.data.token);
    setUserProfile({ ...data.data.user, isAuthenticated: true });
    return true;
  }
  return false;
};
```

### Backend (auth.controller.ts)
```typescript
// Login handler
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    
    // Validate credentials
    const result = await authService.login(email, password);
    
    if (!result.success) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    
    // Generate JWT
    const token = generateToken(result.user.id);
    
    res.json({
      success: true,
      data: { token, user: result.user }
    });
  } catch (error) {
    next(error);
  }
}
```

---

## 📊 Data Storage

### Frontend Storage
- **React Context:** In-memory state
- **localStorage:** Token persistence, offline cache
- **Session Storage:** Temporary data

### Backend Storage
- **JSON File:** `.data/digitrack_db.json`
- **Structure:**
  ```json
  {
    "users": [...],
    "expenses": [...],
    "budgets": [...],
    "categories": [...],
    "savings": [...],
    "splits": [...]
  }
  ```
- **Migration Ready:** Easy to switch to PostgreSQL/SQLite

---

## 🎯 Key Differences Summary

| Aspect | Frontend | Backend |
|--------|----------|---------|
| **Location** | `src/` (except `server/`) | `src/server/` or `digi-track-backend/` |
| **Purpose** | User Interface | Business Logic & API |
| **Language** | TypeScript + JSX | TypeScript |
| **Runtime** | Browser | Node.js |
| **Build** | Vite | esbuild |
| **State** | React Context | Database |
| **Styling** | Tailwind CSS | N/A |
| **Port** | 3000 (unified) or 5173 | 3000 |
| **Entry** | `main.tsx` | `server.ts` |
| **Output** | `dist/` folder | `dist/server.cjs` |

---

## 🔍 How to Identify Frontend vs Backend Code

### Frontend Code Indicators
- ✅ Imports React: `import React from 'react'`
- ✅ JSX/TSX syntax: `<div>`, `<Component />`
- ✅ Uses hooks: `useState`, `useEffect`, `useContext`
- ✅ Tailwind classes: `className="..."`
- ✅ Located in `src/components/`, `src/context/`
- ✅ File extensions: `.tsx`, `.jsx`

### Backend Code Indicators
- ✅ Imports Express: `import express from 'express'`
- ✅ HTTP methods: `app.get()`, `app.post()`
- ✅ Middleware: `app.use()`
- ✅ Request/Response: `req`, `res`, `next`
- ✅ Located in `src/server/` or `digi-track-backend/src/`
- ✅ File extensions: `.ts` (no JSX)

---

## 📚 Learning Path

### To Understand Frontend:
1. Start with `src/App.tsx` - Main app structure
2. Check `src/context/ExpenseContext.tsx` - State management
3. Explore `src/components/` - Individual screens
4. Review `src/index.css` - Styling

### To Understand Backend:
1. Start with `src/server/app.ts` - Express setup
2. Check `src/server/routes/` - API endpoints
3. Review `src/server/controllers/` - Request handlers
4. Explore `src/server/services/` - Business logic
5. Check `src/server/repositories/` - Data access

---

**Need More Details?**
- Full Setup: `SETUP_GUIDE.md`
- Architecture: `docs/ARCHITECTURE.md`
- API Docs: `docs/API_CONTRACT.md`
- Complete Analysis: `PROJECT_ANALYSIS.md`
