# 📊 DigiTrack - Project Structure Visualization

**Complete Separation:** Frontend and Backend are now in separate folders

---

## 🏗️ Folder Structure Overview

```
digi-track/                          ← ROOT PROJECT FOLDER
│
├── 📁 frontend/                     ← REACT FRONTEND APPLICATION
│   ├── 📁 components/               # 15+ React UI Components
│   │   ├── DashboardScreen.tsx     # Main dashboard view
│   │   ├── AddExpenseScreen.tsx    # Add expense form
│   │   ├── BudgetScreen.tsx        # Budget management
│   │   ├── SavingsScreen.tsx       # Savings vault
│   │   ├── SplitExpenseScreen.tsx  # Bill splitting
│   │   ├── HistoryScreen.tsx       # Expense history
│   │   ├── SettingsScreen.tsx      # User settings
│   │   ├── AuthScreen.tsx          # Login/Register
│   │   ├── OnboardingScreen.tsx    # Initial setup
│   │   ├── Header.tsx              # Top navigation
│   │   ├── Navigation.tsx          # Nav bars
│   │   └── ... (more components)
│   │
│   ├── 📁 context/                  # State Management
│   │   └── ExpenseContext.tsx      # Global app state
│   │
│   ├── 📁 data/                     # Frontend utilities
│   │
│   ├── 📁 node_modules/             # 131 packages installed
│   │
│   ├── 📄 App.tsx                   # Main React application
│   ├── 📄 main.tsx                  # React entry point
│   ├── 📄 index.html                # HTML template
│   ├── 📄 index.css                 # Global Tailwind styles
│   ├── 📄 types.ts                  # TypeScript definitions
│   ├── 📄 vite.config.ts            # Vite + Proxy config
│   ├── 📄 tsconfig.json             # TypeScript config
│   ├── 📄 package.json              # Dependencies (131 pkgs)
│   ├── 📄 .env                      # Frontend environment
│   ├── 📄 .gitignore                # Git ignore rules
│   └── 📄 README.md                 # Frontend documentation
│
├── 📁 backend/                      ← EXPRESS REST API BACKEND
│   ├── 📁 src/                      # Backend source code
│   │   │
│   │   ├── 📁 config/               # Configuration modules
│   │   │   ├── database.ts         # DB connection & init
│   │   │   ├── env.ts              # Environment variables
│   │   │   └── logger.ts           # Logging utility
│   │   │
│   │   ├── 📁 constants/            # Constants & defaults
│   │   │   ├── defaultData.ts      # Seed data
│   │   │   └── httpStatus.ts       # HTTP status codes
│   │   │
│   │   ├── 📁 controllers/          # HTTP Request Handlers
│   │   │   ├── auth.controller.ts  # Login, register, me
│   │   │   ├── expense.controller.ts # Expense CRUD
│   │   │   ├── budget.controller.ts # Budget management
│   │   │   ├── category.controller.ts # Categories
│   │   │   ├── savings.controller.ts # Savings vault
│   │   │   ├── split.controller.ts # Bill splitting
│   │   │   ├── export.controller.ts # Data export
│   │   │   ├── sync.controller.ts  # Data sync
│   │   │   └── ai.controller.ts    # AI insights
│   │   │
│   │   ├── 📁 middlewares/          # Express Middleware
│   │   │   ├── auth.middleware.ts  # JWT verification
│   │   │   ├── error.middleware.ts # Error handling
│   │   │   ├── security.middleware.ts # CORS, Helmet
│   │   │   └── rateLimiter.middleware.ts # Rate limiting
│   │   │
│   │   ├── 📁 models/               # Data Models/Schemas
│   │   │   ├── user.model.ts
│   │   │   ├── expense.model.ts
│   │   │   ├── budget.model.ts
│   │   │   ├── category.model.ts
│   │   │   ├── savings.model.ts
│   │   │   └── split.model.ts
│   │   │
│   │   ├── 📁 repositories/         # Data Access Layer
│   │   │   ├── base.repository.ts  # Generic CRUD base
│   │   │   ├── user.repository.ts
│   │   │   ├── expense.repository.ts
│   │   │   ├── budget.repository.ts
│   │   │   ├── category.repository.ts
│   │   │   ├── savings.repository.ts
│   │   │   └── split.repository.ts
│   │   │
│   │   ├── 📁 services/             # Business Logic Layer
│   │   │   ├── auth.service.ts     # Authentication logic
│   │   │   ├── expense.service.ts  # Expense logic
│   │   │   ├── budget.service.ts   # Budget calculations
│   │   │   ├── category.service.ts # Category management
│   │   │   ├── savings.service.ts  # Savings logic
│   │   │   ├── split.service.ts    # Split calculations
│   │   │   ├── ai.service.ts       # AI integration
│   │   │   ├── export.service.ts   # Data export
│   │   │   └── sync.service.ts     # Data synchronization
│   │   │
│   │   ├── 📁 routes/               # API Route Definitions
│   │   │   ├── index.ts            # Main router
│   │   │   ├── auth.routes.ts
│   │   │   ├── expense.routes.ts
│   │   │   ├── budget.routes.ts
│   │   │   ├── category.routes.ts
│   │   │   ├── savings.routes.ts
│   │   │   ├── split.routes.ts
│   │   │   ├── export.routes.ts
│   │   │   ├── sync.routes.ts
│   │   │   └── ai.routes.ts
│   │   │
│   │   ├── 📁 utils/                # Utility Functions
│   │   │   ├── jwt.ts              # JWT token helpers
│   │   │   ├── password.ts         # Password hashing
│   │   │   ├── response.ts         # Response formatting
│   │   │   └── settlement.ts       # Split settlement logic
│   │   │
│   │   ├── 📄 app.ts                # Express app configuration
│   │   └── 📄 server.ts             # Server entry point
│   │
│   ├── 📁 .data/                    # Database Storage
│   │   └── digitrack_db.json       # JSON database file
│   │
│   ├── 📁 node_modules/             # 126 packages installed
│   │
│   ├── 📄 package.json              # Dependencies (126 pkgs)
│   ├── 📄 tsconfig.json             # TypeScript config
│   ├── 📄 .env                      # Backend environment
│   ├── 📄 .env.example              # Environment template
│   ├── 📄 .gitignore                # Git ignore rules
│   └── 📄 README.md                 # Backend documentation
│
├── 📁 docs/                         ← PROJECT DOCUMENTATION
│   ├── API_CONTRACT.md             # Complete API specs
│   ├── ARCHITECTURE.md             # System architecture
│   ├── BUSINESS_RULES.md           # Business logic
│   ├── DATABASE.md                 # Database schema
│   ├── SECURITY.md                 # Security implementation
│   ├── ERROR_HANDLING.md           # Error patterns
│   ├── DEPLOYMENT.md               # Deployment guide
│   ├── CHANGELOG.md                # Version history
│   ├── REQUIREMENTS.md             # Requirements specs
│   ├── CONTEXT.md                  # Project context
│   ├── DECISIONS.md                # Architecture decisions
│   └── MEMORY.md                   # Project memory
│
├── 📁 assets/                       ← Static Assets
│   └── .aistudio/                  # AI Studio assets
│
├── 📁 .data/                        ← Root Database (legacy)
│   └── digitrack_db.json
│
├── 📁 src/                          ← Original Source (legacy)
│   └── [kept for reference]
│
├── 📁 digi-track-backend/           ← Old Backend (legacy)
│   └── [kept for reference]
│
├── 📁 tests/                        ← Test Files
│   └── backend.test.ts
│
│
├── 🚀 START_BOTH.bat                ← START BOTH SERVERS (MAIN)
├── 🚀 START_FRONTEND.bat            ← Start frontend only
├── 🚀 START_BACKEND.bat             ← Start backend only
├── 📦 INSTALL_ALL.bat               ← Install all dependencies
│
├── 📘 README_SEPARATED.md           ← Quick Start Guide (MAIN)
├── 📘 SEPARATED_STRUCTURE_GUIDE.md  ← Complete Detailed Guide
├── 📘 PROJECT_ANALYSIS.md           ← Full Technical Analysis
├── 📘 FRONTEND_VS_BACKEND.md        ← Architecture Comparison
├── 📘 PROJECT_SUMMARY.md            ← Project Summary
├── 📘 SETUP_GUIDE.md                ← Setup Instructions
├── 📘 QUICK_START.md                ← Quick Reference
├── 📘 PROJECT_STRUCTURE_VISUAL.md   ← This File
│
├── 📄 package.json                  ← Root package (legacy)
├── 📄 tsconfig.json                 ← Root TypeScript config
├── 📄 vite.config.ts                ← Root Vite config
├── 📄 .env                          ← Root environment
├── 📄 .env.example                  ← Environment template
├── 📄 .gitignore                    ← Git ignore
├── 📄 index.html                    ← Root HTML
├── 📄 server.ts                     ← Root server (legacy)
├── 📄 metadata.json                 ← Project metadata
└── 📄 README.md                     ← Main project README
```

---

## 🎯 Key Folders

### 🎨 Frontend Folder (`frontend/`)
**Purpose:** React-based user interface  
**Port:** 5173  
**Technology:** React 19 + Vite + Tailwind CSS  
**Files:** ~13,653 files (including node_modules)  
**Dependencies:** 131 packages  

**Main Entry:** `frontend/main.tsx` → `frontend/App.tsx`

### ⚙️ Backend Folder (`backend/`)
**Purpose:** Express REST API server  
**Port:** 3000  
**Technology:** Express + TypeScript + JWT  
**Files:** ~1,705 files (including node_modules)  
**Dependencies:** 126 packages  

**Main Entry:** `backend/src/server.ts` → `backend/src/app.ts`

---

## 🔄 Request Flow Visualization

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER BROWSER                            │
│                    http://localhost:5173                        │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    FRONTEND (Port 5173)                         │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Vite Dev Server                                        │   │
│  │  - Serves React App                                     │   │
│  │  - Hot Module Replacement (HMR)                         │   │
│  │  - Proxy /api/* to backend                              │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  React Application                                       │   │
│  │  - Components render UI                                  │   │
│  │  - ExpenseContext manages state                          │   │
│  │  - Makes API calls: fetch('/api/v1/...')                │   │
│  └─────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────┘
                                │ Proxy /api/* requests
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    BACKEND (Port 3000)                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Express Server                                          │   │
│  │  - Listens on /api/v1/*                                  │   │
│  │  - Security middleware (CORS, Helmet, Rate Limit)       │   │
│  │  - Authentication middleware (JWT)                       │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  Layered Architecture                                    │   │
│  │                                                           │   │
│  │  Routes → Controllers → Services → Repositories          │   │
│  │                                                           │   │
│  │  Example: POST /api/v1/expenses                          │   │
│  │  1. Route defines endpoint                               │   │
│  │  2. Auth middleware verifies JWT                         │   │
│  │  3. Controller extracts request data                     │   │
│  │  4. Service applies business logic                       │   │
│  │  5. Repository saves to database                         │   │
│  │  6. Response sent back to frontend                       │   │
│  └─────────────────────────────────────────────────────────┘   │
└───────────────────────────────┬─────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                  DATABASE (JSON File)                           │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  backend/.data/digitrack_db.json                         │   │
│  │                                                           │   │
│  │  {                                                        │   │
│  │    "users": [...],                                        │   │
│  │    "expenses": [...],                                     │   │
│  │    "budgets": [...],                                      │   │
│  │    "savings": [...],                                      │   │
│  │    "categories": [...],                                   │   │
│  │    "splits": [...]                                        │   │
│  │  }                                                        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Statistics

### Frontend
- **Location:** `frontend/`
- **Files:** 13,653 (including dependencies)
- **Source Files:** ~50 TypeScript/React files
- **Components:** 15+ React components
- **Dependencies:** 131 npm packages
- **Port:** 5173
- **Build Tool:** Vite
- **Status:** ✅ Ready

### Backend
- **Location:** `backend/`
- **Files:** 1,705 (including dependencies)
- **Source Files:** ~60 TypeScript files
- **API Endpoints:** 20+ REST endpoints
- **Dependencies:** 126 npm packages
- **Port:** 3000
- **Runtime:** Node.js + tsx
- **Status:** ✅ Ready

### Overall
- **Total Dependencies:** 257 packages
- **Vulnerabilities:** 0
- **Documentation Files:** 12+
- **Startup Scripts:** 4 .bat files
- **Total Lines of Code:** ~10,000+

---

## 🚀 How to Use This Structure

### Development Workflow

**1. Start Both Servers:**
```bat
START_BOTH.bat
```

**2. Development:**
- Frontend devs work in `frontend/` folder
- Backend devs work in `backend/` folder
- Both can work independently

**3. Testing:**
```bash
# Backend tests
cd backend
npm run test

# Frontend (manual testing)
# Open http://localhost:5173
```

**4. Building:**
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
```

---

## 📦 Deployment Structure

### Production Deployment Options

**Option 1: Separate Hosting**
```
Frontend → Vercel/Netlify (CDN)
Backend  → Railway/Render (Server)
Database → Managed service
```

**Option 2: Same Server**
```
Single Server
├── Serve Frontend static files
└── Backend API endpoints
```

**Option 3: Containers**
```
Docker Compose
├── Frontend Container
├── Backend Container
└── Database Container
```

---

## 🎯 File Count by Category

| Category | Location | Files |
|----------|----------|-------|
| Frontend Source | `frontend/` (excluding node_modules) | ~50 |
| Backend Source | `backend/src/` | ~60 |
| Frontend Dependencies | `frontend/node_modules/` | ~13,600 |
| Backend Dependencies | `backend/node_modules/` | ~1,600 |
| Documentation | `docs/` + root | ~20 |
| Tests | `tests/` | 1 |
| Configuration | Various | ~10 |

---

## ✅ What's Included

### Frontend
- ✅ Complete React application
- ✅ All UI components
- ✅ State management (Context)
- ✅ Vite configuration with proxy
- ✅ Tailwind CSS setup
- ✅ TypeScript configuration
- ✅ Environment configuration
- ✅ Dependencies installed (131 packages)
- ✅ README documentation

### Backend
- ✅ Complete Express API
- ✅ Layered architecture (Routes → Controllers → Services → Repositories)
- ✅ JWT authentication
- ✅ Security middleware
- ✅ AI integration (Gemini)
- ✅ JSON database
- ✅ TypeScript configuration
- ✅ Environment configuration
- ✅ Dependencies installed (126 packages)
- ✅ README documentation

### Infrastructure
- ✅ Startup scripts (Windows .bat files)
- ✅ Installation scripts
- ✅ Environment templates
- ✅ Git ignore files
- ✅ TypeScript configs
- ✅ Comprehensive documentation

---

## 🎓 Understanding the Architecture

### Three-Tier Architecture

**Tier 1: Presentation (Frontend)**
- React components
- UI/UX
- Client-side logic
- State management

**Tier 2: Application (Backend)**
- Business logic
- API endpoints
- Authentication
- Data validation

**Tier 3: Data (Database)**
- Data persistence
- CRUD operations
- Data integrity

### Communication Flow

```
User Action → React Component → API Call → Vite Proxy
    ↓
Backend Route → Middleware → Controller → Service
    ↓
Repository → Database → Return Data
    ↓
Response → Frontend → Update State → Re-render UI
```

---

## 🔍 Key Differences from Before

| Aspect | Before | After |
|--------|--------|-------|
| Structure | Mixed in `src/` | Separated folders |
| Servers | 1 server (port 3000) | 2 servers (3000 + 5173) |
| Frontend | In Express server | Independent Vite server |
| Development | Single process | Two processes |
| Deployment | Coupled | Independent |
| Team Work | Confusing | Clear separation |
| Scalability | Limited | Flexible |

---

## 🎉 You're All Set!

**Your project structure is now:**
- ✅ Completely separated
- ✅ Well-organized
- ✅ Production-ready
- ✅ Easy to understand
- ✅ Scalable
- ✅ Industry-standard

**To start:** Double-click `START_BOTH.bat`  
**To learn:** Read `SEPARATED_STRUCTURE_GUIDE.md`

**Happy coding! 🚀**
