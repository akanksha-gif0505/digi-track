# 🎯 DigiTrack - START HERE!

> Your complete guide to getting started with DigiTrack

---

## ✅ Project Status

**Structure:** ✅ Clean & Organized (Separated Frontend/Backend)  
**Dependencies:** ✅ Installed (257 packages, 0 vulnerabilities)  
**Documentation:** ✅ Complete  
**Ready to Run:** ✅ Yes (after configuration)

---

## 🚀 Get Started in 3 Minutes

### Step 1: Configure Backend (2 minutes)

Open `backend/.env` in a text editor and update:

```env
JWT_SECRET="your-super-secret-32-character-minimum-string"
```

**Generate a secure secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and paste it as your `JWT_SECRET`.

**Optional:** Add Gemini API key for AI features:
```env
GEMINI_API_KEY="your-api-key-here"
```
Get API key from: https://ai.google.dev/

### Step 2: Start Both Servers (30 seconds)

**Windows:**
```
Double-click: START_BOTH.bat
```

This will open two terminal windows:
- **Backend:** http://localhost:3000
- **Frontend:** http://localhost:5173

**Manual (if needed):**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 3: Open in Browser (30 seconds)

Navigate to:
```
http://localhost:5173
```

**Done! Start using DigiTrack! 🎉**

---

## 📁 Project Structure

```
digi-track/
│
├── frontend/              ← REACT FRONTEND (Port 5173)
│   ├── components/        # React UI components
│   ├── context/           # State management
│   ├── package.json       # 131 packages
│   └── README.md          # Frontend docs
│
├── backend/               ← EXPRESS BACKEND (Port 3000)
│   ├── src/               # Backend source code
│   │   ├── controllers/   # Request handlers
│   │   ├── services/      # Business logic
│   │   ├── repositories/  # Data access
│   │   └── routes/        # API endpoints
│   ├── .data/             # Database storage
│   ├── package.json       # 126 packages
│   └── README.md          # Backend docs
│
├── docs/                  ← PROJECT DOCUMENTATION
│   ├── API_CONTRACT.md
│   ├── ARCHITECTURE.md
│   └── ... (12+ docs)
│
├── START_BOTH.bat         ← START HERE! (Runs both servers)
├── START_FRONTEND.bat     # Frontend only
├── START_BACKEND.bat      # Backend only
├── INSTALL_ALL.bat        # Install dependencies
│
└── Documentation Files
    ├── README.md                    # Main README
    ├── README_SEPARATED.md          # Quick start guide
    ├── SEPARATED_STRUCTURE_GUIDE.md # Complete guide
    ├── PROJECT_STRUCTURE_VISUAL.md  # Visual map
    ├── PROJECT_ANALYSIS.md          # Technical analysis
    ├── CLEANUP_SUMMARY.md           # What was cleaned
    └── START_HERE.md                # This file
```

---

## 📚 Documentation Guide

### Which Document to Read?

**Just want to start?**
→ This file (START_HERE.md) ✅ You're here!

**Quick overview and commands?**
→ `README.md` (5 min read)

**Step-by-step setup guide?**
→ `README_SEPARATED.md` (10 min read)

**Complete detailed guide?**
→ `SEPARATED_STRUCTURE_GUIDE.md` (30 min read)

**Visual structure map?**
→ `PROJECT_STRUCTURE_VISUAL.md` (10 min read)

**Full technical analysis?**
→ `PROJECT_ANALYSIS.md` (1 hour read)

**Frontend-specific guide?**
→ `frontend/README.md` (15 min read)

**Backend-specific guide?**
→ `backend/README.md` (15 min read)

**What was cleaned up?**
→ `CLEANUP_SUMMARY.md` (5 min read)

---

## 🎯 Features Overview

### For Users:
- 💰 **Expense Tracking** - Add, edit, delete expenses
- 📊 **Budget Management** - Set and monitor budgets
- 🏦 **Savings Vault** - Protected savings tracking
- 🧾 **Bill Splitting** - Group expenses with settlements
- 📈 **Dashboard** - Interactive charts and analytics
- 🤖 **AI Insights** - Smart spending recommendations
- 📁 **Export** - CSV and JSON export

### For Developers:
- ⚡ **Fast Development** - Vite HMR for instant updates
- 🎨 **Modern Stack** - React 19 + Express + TypeScript
- 🔐 **Secure** - JWT auth + password hashing
- 📱 **Responsive** - Mobile and desktop optimized
- 🏗️ **Clean Architecture** - Layered backend structure
- 📚 **Well Documented** - 10+ documentation files
- 🧪 **Testable** - Backend tests included

---

## 🔧 Common Commands

### Start Development
```bash
# Both servers (recommended)
START_BOTH.bat

# Or manually:
cd backend && npm run dev    # Terminal 1
cd frontend && npm run dev   # Terminal 2
```

### Build for Production
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
npm run preview
```

### Testing
```bash
# Backend tests
cd backend
npm run test

# Type checking
cd backend && npm run lint
cd frontend && npm run lint
```

### Health Check
```bash
# Check backend status
curl http://localhost:3000/api/health

# Or open in browser:
http://localhost:3000/api/health
```

---

## 🔐 Environment Configuration

### Backend (.env)

**Location:** `backend/.env`

**Required Settings:**
```env
# REQUIRED - Change this!
JWT_SECRET="your-secure-32-char-minimum-string"

# These are set correctly:
PORT=3000
NODE_ENV=development
DATA_DIR=.data
ALLOWED_ORIGINS="http://localhost:5173,http://localhost:3001"
```

**Optional Settings:**
```env
# For AI features (optional)
GEMINI_API_KEY="your-gemini-api-key"
```

### Frontend (.env)

**Location:** `frontend/.env`

**Settings (already configured):**
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=DigiTrack
VITE_APP_DESCRIPTION=Smart Expense & Budget Manager
```

---

## 🌐 How It Works

### Architecture Overview

```
┌─────────────────────────────────────────┐
│         Browser (Port 5173)             │
│                                         │
│  User interacts with React UI           │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│    Frontend - React + Vite              │
│                                         │
│  • UI Components                        │
│  • State Management                     │
│  • API Calls: fetch('/api/v1/...')     │
└──────────────┬──────────────────────────┘
               │ Vite Proxy
               ▼
┌─────────────────────────────────────────┐
│    Backend - Express API (Port 3000)    │
│                                         │
│  • Routes → Controllers                 │
│  • Services → Repositories              │
│  • JWT Authentication                   │
│  • Business Logic                       │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│    Database - JSON File                 │
│                                         │
│  backend/.data/digitrack_db.json        │
└─────────────────────────────────────────┘
```

**Key Point:** Vite automatically proxies `/api/*` requests to backend - no CORS issues during development!

---

## 🧪 Verify Everything Works

### 1. Check Backend Health
```bash
curl http://localhost:3000/api/health
```

**Expected:**
```json
{
  "status": "ok",
  "service": "digi-track-backend",
  "timestamp": "2026-08-24T..."
}
```

### 2. Check Frontend
Open: http://localhost:5173

**Expected:**
- See the DigiTrack onboarding/login screen
- No console errors (press F12)

### 3. Test Full Flow
1. Create an account
2. Add an expense
3. View dashboard
4. Check budget screen
5. Try bill splitting

---

## 🐛 Troubleshooting

### Problem: Port Already in Use

**Solution:**
```bash
# Check what's using the port
netstat -ano | findstr :3000
netstat -ano | findstr :5173

# Change port if needed
# In backend/.env: PORT=3001
```

### Problem: Backend Won't Start

**Solution:**
1. Check `JWT_SECRET` is set in `backend/.env`
2. Ensure it's 32+ characters
3. Check `backend/.data` folder exists
4. Restart: `cd backend && npm run dev`

### Problem: Frontend Can't Reach Backend

**Solution:**
1. Verify backend is running: http://localhost:3000/api/health
2. Check Vite proxy in `frontend/vite.config.ts`
3. Ensure `ALLOWED_ORIGINS` includes `http://localhost:5173`

### Problem: Dependencies Missing

**Solution:**
```bash
# Reinstall backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Reinstall frontend
cd frontend
rm -rf node_modules package-lock.json
npm install

# Or use the batch file
INSTALL_ALL.bat
```

### Problem: JWT Errors

**Solution:**
- Ensure `JWT_SECRET` is set in `backend/.env`
- Must be minimum 32 characters
- No spaces or special characters
- Restart backend after changing

---

## 📊 Tech Stack

### Frontend
- **React 19** - UI library
- **Vite 6.2.3** - Build tool
- **Tailwind CSS v4** - Styling
- **TypeScript 5.8** - Type safety
- **Recharts** - Charts
- **Motion** - Animations
- **Lucide React** - Icons

### Backend
- **Node.js 18+** - Runtime
- **Express 4** - Web framework
- **TypeScript 5.8** - Type safety
- **tsx** - TS execution
- **Google Gemini AI** - AI insights
- **JWT** - Authentication

---

## 🎓 Learning Path

### For Beginners:
1. Read this file (START_HERE.md) ✅
2. Read `README.md`
3. Start the servers with `START_BOTH.bat`
4. Explore the UI at http://localhost:5173
5. Read `README_SEPARATED.md` for more details

### For Frontend Developers:
1. Read `frontend/README.md`
2. Explore `frontend/components/`
3. Check `frontend/context/ExpenseContext.tsx`
4. Understand state management
5. Start building features!

### For Backend Developers:
1. Read `backend/README.md`
2. Explore `backend/src/` structure
3. Understand Routes → Controllers → Services → Repositories
4. Check `docs/API_CONTRACT.md` for API specs
5. Start building endpoints!

### For Full-Stack:
1. Read `SEPARATED_STRUCTURE_GUIDE.md`
2. Read `PROJECT_ANALYSIS.md`
3. Understand how frontend communicates with backend
4. Check `docs/ARCHITECTURE.md`
5. Build end-to-end features!

---

## ✅ Pre-Flight Checklist

Before starting development, ensure:

- [ ] Node.js >= 18.0.0 installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] Backend dependencies installed (`backend/node_modules` exists)
- [ ] Frontend dependencies installed (`frontend/node_modules` exists)
- [ ] `JWT_SECRET` set in `backend/.env` (32+ chars)
- [ ] Backend starts successfully on port 3000
- [ ] Frontend starts successfully on port 5173
- [ ] Health check responds: http://localhost:3000/api/health
- [ ] Frontend UI loads: http://localhost:5173
- [ ] Can create account and login
- [ ] Dashboard displays correctly

---

## 🚀 Deployment

When ready to deploy:

### Frontend (Static Hosting)
1. Build: `cd frontend && npm run build`
2. Deploy `frontend/dist/` to:
   - Vercel
   - Netlify
   - Cloudflare Pages
3. Set environment variable: `VITE_API_URL=https://your-api.com`

### Backend (Server Hosting)
1. Build: `cd backend && npm run build`
2. Deploy to:
   - Railway
   - Render
   - Heroku
   - AWS
3. Set environment variables (JWT_SECRET, etc.)
4. Start: `npm start`

**See:** `docs/DEPLOYMENT.md` for detailed deployment instructions

---

## 📞 Need Help?

### Quick References
- **README.md** - Project overview
- **README_SEPARATED.md** - Quick start
- **Troubleshooting** - See above section

### Detailed Guides
- **SEPARATED_STRUCTURE_GUIDE.md** - Complete guide
- **frontend/README.md** - Frontend details
- **backend/README.md** - Backend details

### Technical Docs
- **docs/API_CONTRACT.md** - API endpoints
- **docs/ARCHITECTURE.md** - System design
- **docs/DATABASE.md** - Database schema

---

## 🎉 You're Ready!

**Your DigiTrack project is:**
- ✅ Clean and organized
- ✅ Dependencies installed (0 vulnerabilities)
- ✅ Well documented
- ✅ Ready to run
- ✅ Ready to deploy

**Next steps:**
1. Update `JWT_SECRET` in `backend/.env`
2. Run `START_BOTH.bat`
3. Open http://localhost:5173
4. Start coding! 🚀

**Happy coding!** 💻✨

---

**Questions?** Check the documentation files above or explore the `docs/` folder for detailed specifications.
