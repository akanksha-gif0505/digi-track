# 🚀 DigiTrack - Smart Expense & Budget Manager

> Production-grade personal finance application with separated frontend and backend architecture

**Status:** ✅ Ready to Run  
**Architecture:** React Frontend + Express Backend (Separated)

---

## 📁 Project Structure

```
digi-track/
├── frontend/              ← React Frontend (Port 5173)
├── backend/               ← Express API Backend (Port 3000)
├── docs/                  ← Project Documentation
├── tests/                 ← Test Files
├── START_BOTH.bat         ← START HERE! (Runs both servers)
├── START_FRONTEND.bat     ← Frontend only
├── START_BACKEND.bat      ← Backend only
├── INSTALL_ALL.bat        ← Install dependencies
└── README_SEPARATED.md    ← Quick Start Guide
```

---

## ⚡ Quick Start (3 Steps)

### Step 1: Configure Environment (Required)

Edit `backend/.env` and set JWT secret:
```env
JWT_SECRET="your-super-secret-32-character-minimum-string"
```

**Generate secure secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 2: Start Both Servers

**Windows (Easy):**
```bat
Double-click: START_BOTH.bat
```

**Manual:**
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Step 3: Open Browser

Navigate to: **http://localhost:5173**

**Done! 🎉**

---

## 🎯 What You Get

### Frontend Features
- 📱 Responsive design (mobile + desktop)
- 📊 Interactive charts and analytics
- ✨ Smooth animations
- 🎨 Modern Tailwind CSS styling
- 🔐 Secure authentication
- 💾 Offline-ready with local storage

### Backend Features
- 🔐 JWT authentication
- 🤖 AI spending insights (Google Gemini)
- 💰 Budget tracking and calculations
- 🏦 Protected savings vault
- 🧾 Bill splitting with smart settlements
- 📁 Data export (CSV/JSON)
- 🛡️ Security headers and rate limiting

---

## 🏗️ Tech Stack

### Frontend (`frontend/`)
- **React 19** - UI framework
- **Vite** - Build tool with HMR
- **Tailwind CSS v4** - Styling
- **TypeScript** - Type safety
- **Recharts** - Charts
- **Motion** - Animations
- **131 packages installed** ✅

### Backend (`backend/`)
- **Node.js 18+** - Runtime
- **Express 4** - Web framework
- **TypeScript** - Type safety
- **JWT** - Authentication
- **Google Gemini AI** - AI insights
- **126 packages installed** ✅

**Total: 257 packages, 0 vulnerabilities** ✅

---

## 📚 Documentation

### Quick References
- **README_SEPARATED.md** ← Start here! (5 min read)
- **SEPARATED_STRUCTURE_GUIDE.md** ← Complete guide (detailed)
- **PROJECT_STRUCTURE_VISUAL.md** ← Visual structure map

### Detailed Docs
- **frontend/README.md** - Frontend-specific guide
- **backend/README.md** - Backend-specific guide
- **PROJECT_ANALYSIS.md** - Full technical analysis
- **FRONTEND_VS_BACKEND.md** - Architecture comparison
- **docs/** - API specs, architecture, business rules, etc.

---

## 🔧 Available Commands

### Start Servers
```bash
# Both servers (recommended)
START_BOTH.bat

# Frontend only (port 5173)
cd frontend && npm run dev

# Backend only (port 3000)
cd backend && npm run dev
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
cd frontend && npm run lint
cd backend && npm run lint
```

---

## 🔐 Configuration

### Backend Environment (`backend/.env`)

**Required:**
```env
JWT_SECRET="your-256-bit-secret-key"
PORT=3000
NODE_ENV=development
DATA_DIR=.data
```

**Optional (for AI features):**
```env
GEMINI_API_KEY="your-gemini-api-key"
```

Get Gemini API key: https://ai.google.dev/

### Frontend Environment (`frontend/.env`)
```env
VITE_API_URL=http://localhost:3000
```

---

## 🌐 How It Works

### Development Flow
```
Browser (Port 5173)
    ↓
Frontend (React + Vite)
    ↓ API calls via Vite Proxy
Backend (Express - Port 3000)
    ↓
Database (.data/digitrack_db.json)
```

**Key Point:** Vite automatically proxies `/api/*` requests to backend - no CORS issues!

---

## 🚀 Deployment

### Option 1: Separate Hosting (Recommended)

**Frontend:**
- Deploy to: Vercel, Netlify, Cloudflare Pages
- Build: `cd frontend && npm run build`
- Deploy `frontend/dist/` folder

**Backend:**
- Deploy to: Railway, Render, Heroku, AWS
- Build: `cd backend && npm run build`
- Start: `npm start`

### Option 2: Same Server
Deploy both on one server by serving frontend static files from backend.

---

## 🧪 Testing & Verification

### Health Check
```bash
curl http://localhost:3000/api/health
```

Expected response:
```json
{
  "status": "ok",
  "service": "digi-track-backend",
  "timestamp": "..."
}
```

### Verification Checklist
- [ ] Backend starts on port 3000
- [ ] Frontend starts on port 5173
- [ ] Health endpoint responds
- [ ] Frontend UI loads
- [ ] Can create account
- [ ] Can login
- [ ] Can add expenses
- [ ] Dashboard displays correctly

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Check ports
netstat -ano | findstr :3000
netstat -ano | findstr :5173

# Change port in backend/.env
PORT=3001
```

### Backend Won't Start
1. Check `JWT_SECRET` is set in `backend/.env`
2. Ensure `backend/.data` folder exists
3. Verify dependencies installed: `cd backend && npm install`

### Frontend Can't Reach Backend
1. Ensure backend is running: http://localhost:3000/api/health
2. Check Vite proxy in `frontend/vite.config.ts`
3. Verify CORS in `backend/.env` ALLOWED_ORIGINS

### Dependencies Issues
```bash
# Reinstall backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Reinstall frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 📊 Key Features

### 💰 Expense Management
- Add, edit, delete expenses
- Category-based organization
- Date range filtering
- Payment mode tracking

### 📊 Budget Tracking
- Set monthly/weekly budgets per category
- Visual progress indicators
- Spending alerts
- Spendable amount calculation

### 🏦 Savings Vault
- Protected salary savings
- Automatic health tracking
- Savings goal management
- Vault integrity protection

### 🧾 Bill Splitting
- Group expense creation
- Multiple participants
- Smart settlement calculation
- Minimal debt optimization

### 🤖 AI Insights
- Spending pattern analysis
- Personalized recommendations
- Smart categorization
- Fallback heuristic engine

### 📁 Data Export
- CSV format
- JSON format
- Filtered exports
- Date range selection

---

## 🎓 For Developers

### Frontend Development
```bash
cd frontend
npm run dev    # Start dev server
npm run build  # Build for production
npm run lint   # Type check
```

**Main files:**
- `frontend/App.tsx` - Main application
- `frontend/context/ExpenseContext.tsx` - State management
- `frontend/components/` - All React components

### Backend Development
```bash
cd backend
npm run dev    # Start dev server
npm run build  # Build for production
npm run test   # Run tests
npm run lint   # Type check
```

**Architecture:**
```
Routes → Controllers → Services → Repositories → Database
```

**Main folders:**
- `backend/src/controllers/` - Request handlers
- `backend/src/services/` - Business logic
- `backend/src/repositories/` - Data access
- `backend/src/routes/` - API endpoints

---

## 📦 Dependencies Status

✅ **Frontend:** 131 packages installed  
✅ **Backend:** 126 packages installed  
✅ **Total:** 257 packages  
✅ **Vulnerabilities:** 0

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Make changes
4. Test thoroughly
5. Commit: `git commit -m "Add feature"`
6. Push: `git push origin feature-name`
7. Create Pull Request

---

## 📞 Support

### Documentation
- **README_SEPARATED.md** - Quick start
- **SEPARATED_STRUCTURE_GUIDE.md** - Complete guide
- **frontend/README.md** - Frontend docs
- **backend/README.md** - Backend docs

### Common Issues
- Port conflicts: Change PORT in `.env` files
- JWT errors: Set JWT_SECRET in `backend/.env`
- API errors: Ensure backend is running
- Build errors: Reinstall dependencies

---

## ✅ Project Status

| Component | Status |
|-----------|--------|
| Frontend | ✅ Ready (131 packages) |
| Backend | ✅ Ready (126 packages) |
| Separation | ✅ Complete |
| Dependencies | ✅ Installed (0 vulnerabilities) |
| Documentation | ✅ Complete |
| Configuration | ⚠️ Needs JWT_SECRET |

---

## 🎯 Getting Started

1. **Read the guide:** Open `README_SEPARATED.md`
2. **Configure:** Set `JWT_SECRET` in `backend/.env`
3. **Start servers:** Double-click `START_BOTH.bat`
4. **Open browser:** http://localhost:5173
5. **Start coding!** 🚀

---

## 📄 License

Part of the DigiTrack project.

---

**Need help?** Read `README_SEPARATED.md` for quick start guide or `SEPARATED_STRUCTURE_GUIDE.md` for detailed instructions.

**Ready to start?** Double-click `START_BOTH.bat` 🎉
