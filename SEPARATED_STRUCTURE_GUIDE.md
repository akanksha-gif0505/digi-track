# 🏗️ DigiTrack - Separated Frontend & Backend Guide

**Project Structure:** Completely separated frontend and backend folders  
**Status:** ✅ Ready to Run  
**Date:** August 24, 2026

---

## 📁 New Project Structure

```
digi-track/
├── frontend/                 ← REACT FRONTEND (Port 5173)
│   ├── components/           # All React UI components
│   ├── context/              # State management (ExpenseContext)
│   ├── data/                 # Frontend data utilities
│   ├── App.tsx               # Main React app
│   ├── main.tsx              # React entry point
│   ├── index.html            # HTML template
│   ├── index.css             # Global styles
│   ├── types.ts              # TypeScript types
│   ├── vite.config.ts        # Vite configuration
│   ├── tsconfig.json         # TypeScript config
│   ├── package.json          # Frontend dependencies
│   ├── .env                  # Frontend environment
│   ├── .gitignore            # Git ignore rules
│   ├── README.md             # Frontend documentation
│   └── node_modules/         # Frontend packages
│
├── backend/                  ← EXPRESS API BACKEND (Port 3000)
│   ├── src/
│   │   ├── config/           # Database, env, logger
│   │   ├── constants/        # Default data, HTTP codes
│   │   ├── controllers/      # Request handlers
│   │   ├── middlewares/      # Auth, security, errors
│   │   ├── models/           # Data schemas
│   │   ├── repositories/     # Data access layer
│   │   ├── services/         # Business logic
│   │   ├── routes/           # API routes
│   │   ├── utils/            # JWT, password, helpers
│   │   ├── app.ts            # Express app setup
│   │   └── server.ts         # Backend entry point
│   ├── .data/                # Database storage
│   ├── package.json          # Backend dependencies
│   ├── tsconfig.json         # TypeScript config
│   ├── .env                  # Backend environment
│   ├── .env.example          # Environment template
│   ├── .gitignore            # Git ignore rules
│   ├── README.md             # Backend documentation
│   └── node_modules/         # Backend packages
│
├── docs/                     # Project documentation
├── START_BOTH.bat            ← START BOTH SERVERS (Recommended)
├── START_FRONTEND.bat        ← Start frontend only
├── START_BACKEND.bat         ← Start backend only
├── INSTALL_ALL.bat           ← Install all dependencies
└── [Other documentation files]
```

---

## 🚀 Quick Start (3 Steps)

### Step 1: Install Dependencies (If not done)

**Windows:**
```
Double-click: INSTALL_ALL.bat
```

**Manual:**
```bash
# Backend
cd backend
npm install

# Frontend
cd frontend
npm install
```

### Step 2: Configure Backend Environment

Edit `backend/.env`:
```env
# REQUIRED: Change this!
JWT_SECRET="your-super-secret-jwt-key-min-32-chars"

# OPTIONAL: For AI features
GEMINI_API_KEY="your-gemini-api-key"

# These are already set correctly:
PORT=3000
NODE_ENV=development
```

**Generate JWT Secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 3: Start Both Servers

**Windows (Recommended):**
```
Double-click: START_BOTH.bat
```

This will open two terminal windows:
- Backend on http://localhost:3000
- Frontend on http://localhost:5173

**Manual:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend  
cd frontend
npm run dev
```

**Then open:** http://localhost:5173

---

## 🎯 How It Works

### Communication Flow

```
Browser (Port 5173)
    ↓
Frontend (React + Vite)
    ↓
API Proxy (Vite Dev Server)
    ↓
Backend API (Express - Port 3000)
    ↓
Database (.data/digitrack_db.json)
```

### During Development

1. **Frontend** runs on port **5173** (Vite dev server)
2. **Backend** runs on port **3000** (Express API)
3. Vite proxies `/api/*` requests to backend (no CORS issues)
4. Frontend makes API calls like: `fetch('/api/v1/expenses')`
5. Vite forwards to: `http://localhost:3000/api/v1/expenses`

### API Integration

Frontend is configured to proxy API requests:

**vite.config.ts:**
```typescript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:3000',
      changeOrigin: true,
    },
  },
}
```

This means:
- Frontend: `fetch('/api/v1/expenses')` 
- Actually calls: `http://localhost:3000/api/v1/expenses`
- No CORS configuration needed in development!

---

## 📦 Dependencies Installed

### Frontend Dependencies (131 packages)
✅ React 19 - UI framework  
✅ Vite - Build tool with HMR  
✅ Tailwind CSS v4 - Styling  
✅ TypeScript - Type safety  
✅ Recharts - Charts  
✅ Motion - Animations  
✅ Lucide React - Icons  
✅ Canvas Confetti - Effects  

### Backend Dependencies (126 packages)
✅ Express 4 - Web framework  
✅ TypeScript - Type safety  
✅ tsx - TypeScript execution  
✅ @google/genai - AI integration  
✅ dotenv - Environment config  

**Total:** 257 packages, 0 vulnerabilities ✅

---

## 🎨 Frontend Details

### Location: `frontend/`

### Technology Stack
- **React 19** with TypeScript
- **Vite 6.2.3** for fast development
- **Tailwind CSS v4** for styling
- **React Context** for state management

### Key Features
- 📱 Responsive design (mobile + desktop)
- 🎨 Modern UI with Tailwind utilities
- 📊 Interactive charts with Recharts
- ✨ Smooth animations with Motion
- 🔐 JWT authentication handling
- 💾 Local storage for token persistence

### Main Components
```
components/
├── DashboardScreen.tsx       # Main dashboard
├── AddExpenseScreen.tsx      # Add/edit expenses
├── BudgetScreen.tsx          # Budget management
├── SavingsScreen.tsx         # Savings vault
├── SplitExpenseScreen.tsx    # Bill splitting
├── HistoryScreen.tsx         # Expense history
├── SettingsScreen.tsx        # User settings
├── AuthScreen.tsx            # Login/Register
└── ... (more components)
```

### State Management
- **ExpenseContext** (`context/ExpenseContext.tsx`)
- Manages: users, expenses, budgets, savings, splits
- Provides: CRUD operations, authentication state

### Available Scripts
```bash
cd frontend
npm run dev      # Start dev server (port 5173)
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # TypeScript checking
```

---

## ⚙️ Backend Details

### Location: `backend/`

### Technology Stack
- **Node.js 18+** runtime
- **Express 4** web framework
- **TypeScript** with tsx execution
- **JWT** authentication
- **Google Gemini AI** integration
- **JSON File Database** (PostgreSQL-ready)

### Architecture Layers
```
Routes → Controllers → Services → Repositories → Database
```

### Key Features
- 🔐 JWT Bearer authentication
- 🔒 Password hashing with salt
- 🛡️ Security headers (Helmet)
- 🚦 Rate limiting
- 🤖 AI spending insights
- 💾 ACID-compliant storage
- 📊 Bill split optimization
- 📁 Data export (CSV/JSON)

### API Endpoints
- `/api/v1/auth/*` - Authentication
- `/api/v1/expenses/*` - Expense management
- `/api/v1/budgets/*` - Budget tracking
- `/api/v1/savings/*` - Savings vault
- `/api/v1/splits/*` - Bill splitting
- `/api/v1/categories/*` - Categories
- `/api/analyze-spending` - AI insights
- `/api/health` - Health check

### Available Scripts
```bash
cd backend
npm run dev      # Start dev server (port 3000)
npm run build    # Build for production
npm start        # Run production server
npm run test     # Run tests
npm run lint     # TypeScript checking
```

---

## 🔧 Configuration Files

### Backend Environment (`backend/.env`)
```env
# Required
PORT=3000
NODE_ENV=development
JWT_SECRET="change-this-to-secure-random-32-char-string"
DATA_DIR=.data

# Optional (for AI features)
GEMINI_API_KEY="your-api-key"

# CORS origins (frontend URL)
ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3001"
```

### Frontend Environment (`frontend/.env`)
```env
# Backend API URL (for production)
VITE_API_URL=http://localhost:3000

# App metadata
VITE_APP_NAME=DigiTrack
VITE_APP_DESCRIPTION=Smart Expense & Budget Manager
```

---

## 🚀 Running the Application

### Option 1: Both Servers Together (Recommended)

**Windows:**
```
Double-click: START_BOTH.bat
```

**Manual:**
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2
cd frontend && npm run dev
```

**Access at:** http://localhost:5173

### Option 2: Backend Only

**Windows:**
```
Double-click: START_BACKEND.bat
```

**Manual:**
```bash
cd backend
npm run dev
```

**Access at:** http://localhost:3000/api/health

### Option 3: Frontend Only

**Windows:**
```
Double-click: START_FRONTEND.bat
```

**Manual:**
```bash
cd frontend
npm run dev
```

**Access at:** http://localhost:5173  
**Note:** Backend must be running!

---

## 🧪 Testing

### Backend Tests
```bash
cd backend
npm run test
```

### Type Checking

**Backend:**
```bash
cd backend
npm run lint
```

**Frontend:**
```bash
cd frontend
npm run lint
```

### Health Check
```bash
# Backend health
curl http://localhost:3000/api/health

# Or open in browser:
http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "digi-track-backend",
  "timestamp": "...",
  "env": "development"
}
```

---

## 🌐 Production Deployment

### Option 1: Separate Deployments (Recommended)

**Backend:**
- Deploy to: Railway, Render, Heroku, AWS
- Build: `cd backend && npm run build`
- Start: `npm start`
- Set environment variables on platform

**Frontend:**
- Deploy to: Vercel, Netlify, Cloudflare Pages
- Build: `cd frontend && npm run build`
- Deploy `frontend/dist/` folder
- Set `VITE_API_URL` to backend URL

**Example:**
```env
# Frontend production .env
VITE_API_URL=https://your-backend.railway.app
```

### Option 2: Same Server

Deploy both on same server:
1. Build both projects
2. Serve frontend static files from backend
3. Configure Express to serve frontend

---

## 🔐 Security Considerations

### In Development
- ✅ Vite proxy handles CORS automatically
- ✅ Both servers run on localhost
- ✅ JWT tokens stored in memory + localStorage

### In Production
- ⚠️ Update `JWT_SECRET` to secure random string
- ⚠️ Use HTTPS for both frontend and backend
- ⚠️ Configure `ALLOWED_ORIGINS` in backend
- ⚠️ Set secure `VITE_API_URL` in frontend
- ⚠️ Enable rate limiting (already configured)
- ⚠️ Review security headers (already configured)

---

## 📊 Key Differences from Original

### Before (Unified):
```
One server on port 3000
Frontend + Backend together
Vite middleware in Express
```

### After (Separated):
```
Two servers:
- Frontend on port 5173 (Vite)
- Backend on port 3000 (Express)

Vite proxy forwards /api/* to backend
Clean separation of concerns
```

### Benefits of Separation:
✅ Independent development  
✅ Separate deployments  
✅ Better scalability  
✅ Clearer architecture  
✅ Easier team collaboration  
✅ Frontend can be on CDN  
✅ Backend can scale independently  

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check port 3000 is free
netstat -ano | findstr :3000

# If occupied, kill process or change port in backend/.env
PORT=3001
```

### Frontend won't start
```bash
# Check port 5173 is free
netstat -ano | findstr :5173

# If occupied, change in frontend/vite.config.ts
server: { port: 5174 }
```

### API calls failing (404/CORS errors)
1. Ensure backend is running on port 3000
2. Check Vite proxy config in `frontend/vite.config.ts`
3. Verify `ALLOWED_ORIGINS` in `backend/.env`

### Frontend can't reach backend
```bash
# 1. Check backend is running
curl http://localhost:3000/api/health

# 2. Check Vite proxy
# Open frontend/vite.config.ts
# Verify proxy target: 'http://localhost:3000'

# 3. Test direct API call
curl http://localhost:3000/api/v1/expenses
```

### Database issues
```bash
# Check backend/.data folder exists
cd backend
mkdir .data  # if not exists

# Restart backend
npm run dev
```

### JWT errors
```bash
# Ensure JWT_SECRET is set in backend/.env
# Must be 32+ characters
# Generate new one:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Dependencies issues
```bash
# Backend
cd backend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install

# Frontend
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

---

## 📚 Documentation

### Frontend Documentation
- **`frontend/README.md`** - Frontend-specific guide
- Component documentation in comments
- TypeScript types in `types.ts`

### Backend Documentation
- **`backend/README.md`** - Backend-specific guide
- API endpoints documented
- Code comments explain business logic

### Project Documentation
- **`SEPARATED_STRUCTURE_GUIDE.md`** (this file)
- **`PROJECT_ANALYSIS.md`** - Complete technical analysis
- **`FRONTEND_VS_BACKEND.md`** - Architecture comparison
- **`docs/`** - Detailed specifications

---

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Backend dependencies installed (126 packages)
- [ ] Frontend dependencies installed (131 packages)
- [ ] `backend/.env` configured with JWT_SECRET
- [ ] Backend starts on port 3000
- [ ] Frontend starts on port 5173
- [ ] Health check responds: http://localhost:3000/api/health
- [ ] Frontend loads: http://localhost:5173
- [ ] Can create user account
- [ ] Can login
- [ ] Can add expenses
- [ ] Dashboard displays correctly
- [ ] All features work

---

## 🎓 Learning Resources

### Frontend (React)
- **Start here:** `frontend/App.tsx` - Main app structure
- **State:** `frontend/context/ExpenseContext.tsx`
- **Components:** `frontend/components/`
- **Styles:** `frontend/index.css`

### Backend (Express)
- **Start here:** `backend/src/server.ts` - Entry point
- **API Routes:** `backend/src/routes/`
- **Business Logic:** `backend/src/services/`
- **Data Access:** `backend/src/repositories/`

### Full-Stack Flow
1. User interacts with Frontend (React component)
2. Component calls API via fetch/axios
3. Request goes to Vite proxy
4. Proxy forwards to Backend Express
5. Backend processes and returns data
6. Frontend updates UI with response

---

## 📞 Getting Help

### Common Commands

**Start Everything:**
```bash
# Windows
START_BOTH.bat

# Manual
cd backend && npm run dev  # Terminal 1
cd frontend && npm run dev # Terminal 2
```

**Check Status:**
```bash
# Backend health
curl http://localhost:3000/api/health

# Check running processes
netstat -ano | findstr :3000
netstat -ano | findstr :5173
```

**View Logs:**
- Backend: Check terminal where `npm run dev` is running
- Frontend: Check terminal + browser console (F12)

---

## 🎯 Next Steps

1. **Configure Backend**
   - Update `JWT_SECRET` in `backend/.env`
   - Optional: Add `GEMINI_API_KEY` for AI features

2. **Start Development**
   - Run `START_BOTH.bat`
   - Open http://localhost:5173

3. **Explore the Code**
   - Frontend: `frontend/components/`
   - Backend: `backend/src/`

4. **Build Features**
   - Add new React components
   - Create new API endpoints
   - Enhance business logic

5. **Deploy**
   - Build both projects
   - Deploy backend to Railway/Render
   - Deploy frontend to Vercel/Netlify

---

## 📊 Quick Reference

| What | Where | Port | Command |
|------|-------|------|---------|
| Frontend | `frontend/` | 5173 | `cd frontend && npm run dev` |
| Backend | `backend/` | 3000 | `cd backend && npm run dev` |
| Database | `backend/.data/` | - | Auto-created |
| API Docs | `backend/README.md` | - | Read file |
| Frontend UI | http://localhost:5173 | 5173 | Open browser |
| API Health | http://localhost:3000/api/health | 3000 | curl or browser |

---

**🎉 Your project is now fully separated and ready to develop!**

**To start:** Double-click `START_BOTH.bat` and open http://localhost:5173

For questions, refer to:
- `frontend/README.md` - Frontend guide
- `backend/README.md` - Backend guide
- `PROJECT_ANALYSIS.md` - Complete analysis

Happy coding! 🚀
