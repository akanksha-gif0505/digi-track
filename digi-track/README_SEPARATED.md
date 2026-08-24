# 🚀 DigiTrack - Separated Frontend & Backend

> Complete separation of React frontend and Express backend into independent folders

**Status:** ✅ Fully Separated and Ready  
**Updated:** August 24, 2026

---

## 📁 New Folder Structure

```
digi-track/
│
├── frontend/              ← REACT FRONTEND (Port 5173)
│   ├── components/        # React UI components
│   ├── context/           # State management
│   ├── App.tsx           # Main app
│   ├── package.json      # Frontend dependencies (131 packages)
│   └── ...
│
├── backend/               ← EXPRESS BACKEND (Port 3000)
│   ├── src/              # Backend source code
│   │   ├── controllers/  # Request handlers
│   │   ├── services/     # Business logic
│   │   ├── repositories/ # Data access
│   │   └── ...
│   ├── package.json      # Backend dependencies (126 packages)
│   └── ...
│
├── START_BOTH.bat         ← START HERE! Runs both servers
├── START_FRONTEND.bat     # Frontend only
├── START_BACKEND.bat      # Backend only
├── INSTALL_ALL.bat        # Install all dependencies
│
└── Documentation/
    ├── SEPARATED_STRUCTURE_GUIDE.md  ← Complete guide
    ├── PROJECT_ANALYSIS.md           # Technical analysis
    ├── frontend/README.md            # Frontend docs
    └── backend/README.md             # Backend docs
```

---

## ⚡ Quick Start (1 Minute)

### Step 1: Configure Environment (30 seconds)

Edit `backend/.env`:
```env
JWT_SECRET="your-super-secret-32-char-minimum-string-here"
```

Generate secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Start Both Servers (Windows)
```
Double-click: START_BOTH.bat
```

This opens two terminals:
- **Backend:** http://localhost:3000
- **Frontend:** http://localhost:5173

### Step 3: Open in Browser
```
http://localhost:5173
```

**Done! 🎉**

---

## 🎯 What Changed

### Before (Unified):
- ❌ Frontend and backend mixed in `src/`
- ❌ Single server on port 3000
- ❌ Vite middleware inside Express
- ❌ Confusing structure

### After (Separated):
- ✅ **Frontend** in dedicated `frontend/` folder
- ✅ **Backend** in dedicated `backend/` folder
- ✅ Two independent servers (5173 + 3000)
- ✅ Clean separation of concerns
- ✅ Independent deployment ready
- ✅ Clear architecture

---

## 🚀 Running the Application

### Option 1: Both Servers (Recommended)

**Windows:**
```bat
START_BOTH.bat
```

**Manual:**
```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev
```

**Access:** http://localhost:5173

### Option 2: Backend Only

```bash
cd backend
npm run dev
```

**Access:** http://localhost:3000/api/health

### Option 3: Frontend Only

```bash
cd frontend
npm run dev
```

**Access:** http://localhost:5173  
*(Requires backend running on port 3000)*

---

## 📦 What's Installed

### Frontend (131 packages) ✅
- React 19
- Vite 6.2.3
- Tailwind CSS v4
- TypeScript
- Recharts, Motion, Lucide Icons

### Backend (126 packages) ✅
- Express 4
- TypeScript
- Google Gemini AI
- JWT authentication
- Security middleware

**Total:** 257 packages, 0 vulnerabilities

---

## 🔧 Configuration

### Backend Configuration
**File:** `backend/.env`

**Required:**
```env
JWT_SECRET="min-32-characters-secure-random-string"
PORT=3000
NODE_ENV=development
```

**Optional:**
```env
GEMINI_API_KEY="your-api-key"  # For AI features
```

### Frontend Configuration
**File:** `frontend/.env`

```env
VITE_API_URL=http://localhost:3000
```

---

## 🌐 How Communication Works

```
Browser
  ↓
Frontend (React) - Port 5173
  ↓ /api/* requests
Vite Proxy
  ↓
Backend (Express) - Port 3000
  ↓
Database (.data/)
```

**Key Point:** Vite automatically proxies `/api/*` requests to backend, so no CORS issues in development!

---

## 📚 Documentation

### Start Here:
1. **`SEPARATED_STRUCTURE_GUIDE.md`** - Complete guide (detailed)
2. **`README_SEPARATED.md`** - This file (quick reference)

### Detailed Docs:
- **`frontend/README.md`** - Frontend-specific guide
- **`backend/README.md`** - Backend-specific guide
- **`PROJECT_ANALYSIS.md`** - Full technical analysis
- **`docs/`** - API specs, architecture, etc.

---

## 🎨 Frontend Overview

**Location:** `frontend/`  
**Port:** 5173  
**Tech:** React 19 + Vite + Tailwind CSS

### Features:
- 📱 Responsive design (mobile + desktop)
- 📊 Interactive charts and graphs
- ✨ Smooth animations
- 🎨 Modern Tailwind styling
- 🔐 JWT authentication

### Structure:
```
frontend/
├── components/           # All React components
├── context/              # State management
├── App.tsx              # Main app
├── main.tsx             # Entry point
└── vite.config.ts       # Vite + proxy config
```

---

## ⚙️ Backend Overview

**Location:** `backend/`  
**Port:** 3000  
**Tech:** Express + TypeScript + JWT

### Features:
- 🔐 JWT authentication
- 🤖 AI spending insights
- 💾 JSON database (PostgreSQL-ready)
- 🛡️ Security middleware
- 🚦 Rate limiting

### Structure:
```
backend/src/
├── controllers/         # HTTP handlers
├── services/            # Business logic
├── repositories/        # Data access
├── routes/              # API endpoints
└── middlewares/         # Auth, security
```

---

## 🧪 Testing & Verification

### Health Check
```bash
curl http://localhost:3000/api/health
```

Expected:
```json
{
  "status": "ok",
  "service": "digi-track-backend",
  "timestamp": "2026-08-24T..."
}
```

### Full Checklist
- [ ] Backend starts on port 3000
- [ ] Frontend starts on port 5173
- [ ] Health endpoint responds
- [ ] Frontend UI loads
- [ ] Can create account
- [ ] Can login
- [ ] Can add expenses
- [ ] Dashboard works

---

## 🚀 Deployment

### Separate Deployment (Recommended)

**Backend:**
- Platform: Railway, Render, Heroku
- Command: `npm run build && npm start`
- Set environment variables

**Frontend:**
- Platform: Vercel, Netlify, Cloudflare Pages
- Command: `npm run build`
- Deploy `dist/` folder
- Set `VITE_API_URL` to backend URL

### Example Production Setup:
```env
# Frontend .env.production
VITE_API_URL=https://your-api.railway.app

# Backend .env (on Railway)
JWT_SECRET="production-secret-key"
ALLOWED_ORIGINS="https://your-app.vercel.app"
```

---

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# Change port if needed (backend/.env)
PORT=3001
```

### Frontend can't reach backend
1. Ensure backend is running: http://localhost:3000/api/health
2. Check Vite proxy config: `frontend/vite.config.ts`
3. Verify CORS settings in `backend/.env`

### JWT errors
- Ensure `JWT_SECRET` is set in `backend/.env`
- Must be 32+ characters
- Restart backend after changes

### Dependencies issues
```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Quick Reference

| Component | Location | Port | Start Command |
|-----------|----------|------|---------------|
| Frontend | `frontend/` | 5173 | `npm run dev` |
| Backend | `backend/` | 3000 | `npm run dev` |
| Both | Root | Both | `START_BOTH.bat` |
| Frontend URL | - | - | http://localhost:5173 |
| Backend API | - | - | http://localhost:3000/api/v1 |
| Health Check | - | - | http://localhost:3000/api/health |

---

## 🎯 Benefits of Separation

✅ **Independent Development** - Work on frontend/backend separately  
✅ **Separate Deployments** - Deploy to different platforms  
✅ **Better Scalability** - Scale each tier independently  
✅ **Clearer Architecture** - Easy to understand structure  
✅ **Team Collaboration** - Frontend/backend teams work independently  
✅ **Technology Flexibility** - Change frontend without affecting backend  
✅ **Production Ready** - Industry-standard architecture  

---

## 📞 Need Help?

### Quick Commands
```bash
# Start both servers
START_BOTH.bat

# Check backend status
curl http://localhost:3000/api/health

# Check running processes
netstat -ano | findstr :3000
netstat -ano | findstr :5173
```

### Documentation
- **Quick guide:** This file
- **Detailed guide:** `SEPARATED_STRUCTURE_GUIDE.md`
- **Frontend:** `frontend/README.md`
- **Backend:** `backend/README.md`
- **Full analysis:** `PROJECT_ANALYSIS.md`

---

## ✅ What's Ready

- [x] Frontend fully separated into `frontend/` folder
- [x] Backend fully separated into `backend/` folder
- [x] All dependencies installed (257 packages)
- [x] Configuration files created
- [x] Startup scripts created (.bat files)
- [x] Documentation written
- [x] Vite proxy configured for API calls
- [x] CORS configured in backend
- [x] TypeScript configs for both
- [x] .gitignore files for both
- [x] README for both projects
- [x] 0 vulnerabilities
- [ ] JWT_SECRET needs to be updated by user

---

## 🎉 You're Ready!

**To start developing:**

1. Update `JWT_SECRET` in `backend/.env`
2. Double-click `START_BOTH.bat`
3. Open http://localhost:5173
4. Start coding!

**For detailed information:**
- Read `SEPARATED_STRUCTURE_GUIDE.md`

**Happy coding! 🚀**
