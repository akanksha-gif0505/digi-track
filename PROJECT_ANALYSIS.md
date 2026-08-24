# DigiTrack - Complete Project Analysis

## 📊 Project Overview

**DigiTrack** is a production-grade personal finance application with a modern full-stack architecture featuring:
- Smart expense tracking with AI-powered insights
- Protected salary savings vault
- Group bill splitting with settlement optimization
- Interactive spending graphs and analytics
- Multi-format financial exports
- Gemini AI spending advisory

---

## 🏗️ Architecture Overview

### Project Structure
```
digi-track/
├── src/                          # FRONTEND (React + Vite)
│   ├── components/               # React UI components
│   ├── context/                  # React Context (State Management)
│   ├── data/                     # Frontend data utilities
│   ├── server/                   # BACKEND API (Embedded in same repo)
│   ├── App.tsx                   # Main React App
│   ├── main.tsx                  # React entry point
│   ├── index.css                 # Global styles
│   └── types.ts                  # TypeScript type definitions
│
├── digi-track-backend/           # STANDALONE BACKEND (Alternative deployment)
│   └── src/
│       ├── config/               # Database, env, logger configs
│       ├── constants/            # Default data, HTTP status codes
│       ├── controllers/          # Request handlers
│       ├── middlewares/          # Auth, security, error handling
│       ├── models/               # Data models/schemas
│       ├── repositories/         # Data access layer
│       ├── services/             # Business logic
│       ├── utils/                # JWT, password hashing, etc.
│       ├── app.ts                # Express app setup
│       └── server.ts             # Backend entry point
│
├── docs/                         # Comprehensive documentation
│   ├── API_CONTRACT.md           # API endpoint specifications
│   ├── ARCHITECTURE.md           # System architecture details
│   ├── BUSINESS_RULES.md         # Business logic documentation
│   ├── DATABASE.md               # Database schema
│   ├── SECURITY.md               # Security implementation
│   └── ... (more docs)
│
├── .data/                        # Local JSON database storage
├── assets/                       # Static assets
├── tests/                        # Test files
├── server.ts                     # Main server entry (fullstack)
├── vite.config.ts                # Vite build configuration
├── package.json                  # Frontend + Backend dependencies
└── .env                          # Environment configuration
```

---

## 🎯 Two Deployment Architectures

### Architecture 1: Unified Fullstack (Recommended for Development)
**Location:** Root directory (`digi-track/`)

**Description:** 
- Single Express server serves both API and Vite-powered React frontend
- Backend at `src/server/`
- Frontend at `src/` (components, context, etc.)
- Development: Vite dev middleware for HMR
- Production: Serves pre-built static files from `dist/`

**Entry Point:** `server.ts` (root)

**Characteristics:**
- ✅ Single deployment unit
- ✅ Simplified development workflow
- ✅ Shared TypeScript types
- ✅ Vite HMR in development
- ✅ Easier CORS management

**Run Commands:**
```bash
npm install          # Install all dependencies
npm run dev          # Start dev server (API + Vite)
npm run build        # Build for production
npm start            # Run production build
```

---

### Architecture 2: Separate Backend (Alternative Deployment)
**Location:** `digi-track-backend/`

**Description:**
- Standalone Express REST API
- Can be deployed independently
- Frontend would need separate hosting (Vercel, Netlify, etc.)
- Better for microservices architecture

**Entry Point:** `digi-track-backend/src/server.ts`

**Characteristics:**
- ✅ Independent scaling
- ✅ Separate deployments
- ✅ Clear API boundary
- ⚠️ Requires CORS configuration
- ⚠️ More complex deployment

**Run Commands:**
```bash
cd digi-track-backend
npm install                    # Install backend dependencies
npm run dev                    # Start backend dev server
npm run build                  # Build backend
npm start                      # Run production backend
```

---

## 🔧 Technology Stack

### Frontend
- **Framework:** React 19
- **Build Tool:** Vite 6.2.3
- **Styling:** Tailwind CSS v4.1.14
- **Animations:** Motion (Framer Motion fork)
- **Charts:** Recharts 3.10.1
- **Icons:** Lucide React
- **Effects:** Canvas Confetti
- **Language:** TypeScript 5.8.2

### Backend
- **Runtime:** Node.js (>= 18.0.0)
- **Framework:** Express 4.21.2
- **Language:** TypeScript 5.8.2
- **Execution:** tsx (TypeScript executor)
- **AI Integration:** Google Gemini API (@google/genai)
- **Database:** JSON file-based (ACID-compliant, PostgreSQL-ready)
- **Authentication:** JWT Bearer tokens
- **Security:** Helmet, CORS, Rate Limiting, Salted password hashing

### DevOps & Tooling
- **Package Manager:** npm or bun
- **Build:** esbuild (backend bundling)
- **Environment:** dotenv for configuration

---

## 🎨 Frontend Architecture

### Component Structure
```
components/
├── Header.tsx                    # Top navigation bar
├── Navigation.tsx                # Bottom nav (mobile) + Desktop sidebar
├── OnboardingScreen.tsx          # Initial setup screen
├── AuthScreen.tsx                # Login/Register
├── DashboardScreen.tsx           # Main dashboard with stats
├── HistoryScreen.tsx             # Expense history/timeline
├── AddExpenseScreen.tsx          # Add new expense form
├── BudgetScreen.tsx              # Budget management
├── SavingsScreen.tsx             # Savings vault
├── SettingsScreen.tsx            # User settings
├── SplitExpenseScreen.tsx        # Bill splitting
└── ArchitectureModal.tsx         # Architecture documentation viewer
```

### State Management
- **React Context API** via `ExpenseContext`
- Manages: user profile, expenses, budgets, splits, savings
- Provides: CRUD operations, filtering, calculations
- Authentication state handling

### Key Features
- 📱 Responsive design (mobile-first with desktop support)
- 🎨 Modern UI with Tailwind CSS utilities
- ⚡ Fast HMR with Vite
- 🔒 Protected routes with auth guards
- 📊 Interactive charts with Recharts
- ✨ Smooth animations with Motion

---

## ⚙️ Backend Architecture

### Layered Architecture (Modular Monolith)

```
Routes → Controllers → Services → Repositories → Models → Database
```

#### Layer Responsibilities

**1. Routes (`src/server/routes/`)**
- Define HTTP endpoints
- Apply middleware (auth, validation, rate limiting)
- Route to controllers

**2. Controllers (`src/server/controllers/`)**
- Handle HTTP requests/responses
- Extract request data
- Call service layer
- Return standardized JSON responses

**3. Services (`src/server/services/`)**
- Core business logic
- Complex calculations
- Cross-repository operations
- AI integration

**4. Repositories (`src/server/repositories/`)**
- Data access abstraction
- CRUD operations
- Query filtering
- Tenant isolation

**5. Models (`src/server/models/`)**
- TypeScript interfaces
- Data schemas
- Type definitions

### Backend Modules

#### Authentication & Authorization
- JWT token generation/validation
- Password hashing (bcrypt-style)
- User registration/login
- Auth middleware

#### Expense Management
- Create, read, update, delete expenses
- Category management
- Filtering by date range
- Multi-currency support (future)

#### Budget & Savings
- Budget setting and tracking
- Spendable amount calculation
- Savings vault (protected salary allocation)
- Health status monitoring

#### Bill Splitting
- Group expense creation
- Participant management
- Settlement calculation (minimal debt algorithm)
- Split history tracking

#### AI Integration
- Gemini API integration
- Spending analysis
- Personalized recommendations
- Fallback heuristic engine

#### Data Export
- CSV export
- JSON export
- PDF generation (future)

### Security Features
- 🔐 JWT Bearer authentication
- 🔒 Salted password hashing
- 🛡️ Helmet security headers
- 🚦 Rate limiting (sliding window)
- 🔍 Input validation
- 🎯 CORS policy
- 🔑 Environment-based secrets

---

## 💾 Database Architecture

### Storage Engine
- **Type:** JSON file-based
- **Location:** `.data/digitrack_db.json`
- **Characteristics:**
  - ACID-compliant operations
  - Atomic writes
  - Tenant isolation (by userId)
  - Migration-ready for PostgreSQL/SQLite

### Data Models

#### User
```typescript
{
  id: string
  email: string
  password: string (hashed)
  name: string
  avatar?: string
  createdAt: string
  monthlyIncome: number
  currency: string
  monthlyBudget: number
}
```

#### Expense
```typescript
{
  id: string
  userId: string
  title: string
  amount: number
  category: string
  date: string
  notes?: string
  paymentMode: string
  createdAt: string
}
```

#### Budget
```typescript
{
  id: string
  userId: string
  categoryId: string
  limit: number
  period: 'monthly' | 'weekly'
  createdAt: string
}
```

#### Savings
```typescript
{
  id: string
  userId: string
  amount: number
  isProtected: boolean
  createdAt: string
}
```

#### Split
```typescript
{
  id: string
  userId: string
  title: string
  totalAmount: number
  participants: Participant[]
  settlements: Settlement[]
  createdAt: string
}
```

---

## 🚀 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user (protected)

### Expenses
- `GET /api/v1/expenses` - List all expenses (protected)
- `POST /api/v1/expenses` - Create expense (protected)
- `GET /api/v1/expenses/:id` - Get expense by ID (protected)
- `PUT /api/v1/expenses/:id` - Update expense (protected)
- `DELETE /api/v1/expenses/:id` - Delete expense (protected)

### Categories
- `GET /api/v1/categories` - List categories (protected)
- `POST /api/v1/categories` - Create category (protected)

### Budget
- `GET /api/v1/budgets` - List budgets (protected)
- `POST /api/v1/budgets` - Create/update budget (protected)

### Savings
- `GET /api/v1/savings` - Get savings info (protected)
- `POST /api/v1/savings` - Update savings (protected)

### Splits
- `GET /api/v1/splits` - List splits (protected)
- `POST /api/v1/splits` - Create split (protected)
- `POST /api/v1/splits/:id/settle` - Settle split (protected)

### AI
- `POST /api/analyze-spending` - Get AI spending analysis (protected)

### Health
- `GET /api/health` - Health check endpoint

---

## 🔑 Environment Configuration

### Required Environment Variables

```bash
# API Keys
GEMINI_API_KEY="your-gemini-api-key"      # Required for AI features

# Server Configuration
PORT=3000                                  # Server port
NODE_ENV="development"                     # development | production | test
APP_URL="http://localhost:3000"            # Application URL

# Authentication
JWT_SECRET="your-256-bit-secret"           # JWT signing key (min 32 chars)
JWT_EXPIRES_IN="7d"                        # Token expiration

# Database
DATA_DIR=".data"                           # Database storage directory

# CORS (Backend only)
ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3001"
```

---

## 📦 Dependencies Summary

### Production Dependencies
- `express` - Web framework
- `react` & `react-dom` - UI library
- `@google/genai` - Gemini AI integration
- `lucide-react` - Icon library
- `recharts` - Chart library
- `motion` - Animation library
- `canvas-confetti` - Celebration effects
- `dotenv` - Environment variables

### Development Dependencies
- `typescript` - Type system
- `tsx` - TypeScript executor
- `vite` - Build tool
- `tailwindcss` - CSS framework
- `esbuild` - JavaScript bundler
- `@types/*` - TypeScript type definitions

---

## 🎯 Key Business Logic

### Spendable Budget Calculation
```
Spendable = Monthly Income - Protected Savings - Sum(Category Budgets)
```

### Savings Vault Health States
- **Healthy:** >= 90% of target
- **At Risk:** 50-89% of target
- **Critical:** < 50% of target

### Bill Split Settlement Algorithm
- Minimal debt graph reduction
- Optimized transaction count
- Fair settlement calculation

---

## 🔄 Data Flow Example

### Creating an Expense
```
1. User fills form → AddExpenseScreen
2. Submit triggers API call → POST /api/v1/expenses
3. Request hits AuthMiddleware → Validates JWT
4. ExpenseController.create() → Extracts data
5. ExpenseService.createExpense() → Business logic
6. ExpenseRepository.create() → Saves to DB
7. Response sent back → 201 Created
8. Context updates → UI refreshes
```

---

## 🧪 Testing Strategy

### Backend Tests
- Unit tests for services
- Integration tests for repositories
- API endpoint tests
- Authentication flow tests

### Frontend Tests
- Component unit tests (future)
- Integration tests (future)
- E2E tests (future)

**Current Test Command:**
```bash
npm run test  # Runs backend tests
```

---

## 📱 Responsive Design

### Breakpoints
- Mobile: < 768px (Bottom navigation)
- Desktop: >= 768px (Sidebar navigation)

### Mobile-First Approach
- Touch-friendly UI elements
- Swipe gestures support
- Optimized for small screens
- Progressive enhancement

---

## 🔐 Security Measures

### Implemented
- ✅ JWT authentication with expiration
- ✅ Password hashing (cryptographic salt)
- ✅ Rate limiting (prevents brute force)
- ✅ Security headers (Helmet)
- ✅ CORS policy
- ✅ Input validation
- ✅ SQL injection prevention (parameterized queries)
- ✅ XSS protection
- ✅ Tenant data isolation

### Best Practices
- Environment-based secrets
- HTTPS in production (recommended)
- Token rotation support
- Error message sanitization

---

## 🚀 Deployment Options

### Option 1: Unified Deployment (Recommended)
- Deploy as single Node.js application
- Platforms: Railway, Render, Heroku, DigitalOcean
- Steps: Build → Deploy → Set env vars

### Option 2: Separate Deployments
- Backend: Railway, Render, AWS Lambda
- Frontend: Vercel, Netlify, Cloudflare Pages
- Requires CORS configuration

### Option 3: Containerized (Docker)
- Dockerfile provided in docs/DEPLOYMENT.md
- Deploy to: Google Cloud Run, AWS ECS, Kubernetes

---

## 📈 Performance Considerations

### Frontend
- Code splitting with Vite
- Lazy loading components (future)
- Optimized bundle size
- CSS purging with Tailwind

### Backend
- In-memory database caching
- Efficient JSON parsing
- Connection pooling ready
- Horizontal scaling ready

---

## 🔮 Future Enhancements

### Planned Features
- [ ] Multi-currency support
- [ ] Recurring expenses
- [ ] Receipt image upload
- [ ] PDF export
- [ ] Email notifications
- [ ] Two-factor authentication
- [ ] WebSocket real-time updates
- [ ] Mobile app (React Native)
- [ ] PostgreSQL migration
- [ ] Advanced analytics dashboard

---

## 📚 Documentation Files

Comprehensive docs in `/docs` directory:
- `API_CONTRACT.md` - Complete API specification
- `ARCHITECTURE.md` - System architecture
- `BUSINESS_RULES.md` - Business logic details
- `DATABASE.md` - Database schema
- `SECURITY.md` - Security implementation
- `ERROR_HANDLING.md` - Error handling patterns
- `DEPLOYMENT.md` - Deployment guide
- `TESTING.md` - Testing strategy

---

## 🎓 Learning Resources

### Understanding the Codebase
1. Start with `README.md` - Quick start guide
2. Read `docs/ARCHITECTURE.md` - System overview
3. Explore `src/App.tsx` - Frontend entry
4. Review `src/server/app.ts` - Backend entry
5. Check `docs/API_CONTRACT.md` - API details

### Key Files to Study
- `src/context/ExpenseContext.tsx` - State management
- `src/server/services/*.ts` - Business logic
- `src/server/repositories/base.repository.ts` - Data access
- `src/server/middlewares/auth.middleware.ts` - Authentication

---

## 🤝 Contributing Guidelines

### Code Style
- TypeScript strict mode
- ESLint + Prettier (future)
- Functional React components
- Async/await for promises
- Descriptive variable names

### Git Workflow
- Feature branches
- Descriptive commit messages
- Pull request reviews
- Semantic versioning

---

## 📞 Support & Resources

### Getting Help
- Check `docs/` directory for detailed docs
- Review error logs in console
- Ensure all environment variables are set
- Verify Node.js version >= 18

### Common Issues
- **Port already in use:** Change PORT in .env
- **Database not found:** Check DATA_DIR path
- **JWT errors:** Verify JWT_SECRET is set
- **AI not working:** Check GEMINI_API_KEY

---

## ✅ Project Status

**Current State:** ✅ Development Ready
**Production Ready:** ⚠️ Requires production .env configuration
**Test Coverage:** 🟡 Backend tests implemented
**Documentation:** ✅ Comprehensive

---

## 📊 Project Metrics

- **Total Files:** ~100+
- **Lines of Code:** ~10,000+ (estimated)
- **Frontend Components:** ~15+
- **Backend Endpoints:** ~20+
- **Data Models:** 6 core models
- **Documentation Pages:** 12+

---

*Generated: 2026-08-24*
*Version: 1.0.0*
