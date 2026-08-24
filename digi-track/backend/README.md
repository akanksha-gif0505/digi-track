# DigiTrack Backend

Express-based REST API backend for DigiTrack expense and budget management application.

## 🚀 Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm or yarn

### Installation
```bash
npm install
```

### Configuration
Create `.env` file (use `.env.example` as template):
```bash
cp .env.example .env
```

Edit `.env` and set required values:
```env
PORT=3000
JWT_SECRET="your-super-secret-key-min-32-chars"
GEMINI_API_KEY="your-gemini-api-key"  # Optional
```

### Development
```bash
npm run dev
```
Backend will run on: http://localhost:3000

### Build for Production
```bash
npm run build
```

### Run Production
```bash
npm start
```

## 🏗️ Tech Stack

- **Node.js 18+** - Runtime
- **Express 4** - Web framework
- **TypeScript** - Type safety
- **tsx** - TypeScript execution
- **Google Gemini AI** - AI spending insights
- **JWT** - Authentication
- **JSON File DB** - Storage (PostgreSQL-ready)

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/              # Configuration
│   │   ├── database.ts      # Database connection
│   │   ├── env.ts           # Environment variables
│   │   └── logger.ts        # Logging utility
│   ├── constants/           # Constants & defaults
│   │   ├── defaultData.ts   # Seed data
│   │   └── httpStatus.ts    # HTTP status codes
│   ├── controllers/         # Request handlers
│   │   ├── auth.controller.ts
│   │   ├── expense.controller.ts
│   │   ├── budget.controller.ts
│   │   ├── category.controller.ts
│   │   ├── savings.controller.ts
│   │   ├── split.controller.ts
│   │   └── ai.controller.ts
│   ├── middlewares/         # Express middleware
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   ├── security.middleware.ts
│   │   └── rateLimiter.middleware.ts
│   ├── models/              # Data models
│   │   ├── user.model.ts
│   │   ├── expense.model.ts
│   │   ├── budget.model.ts
│   │   ├── category.model.ts
│   │   ├── savings.model.ts
│   │   └── split.model.ts
│   ├── repositories/        # Data access layer
│   │   ├── base.repository.ts
│   │   ├── user.repository.ts
│   │   ├── expense.repository.ts
│   │   └── ... (more)
│   ├── services/            # Business logic
│   │   ├── auth.service.ts
│   │   ├── expense.service.ts
│   │   ├── budget.service.ts
│   │   ├── savings.service.ts
│   │   ├── split.service.ts
│   │   ├── ai.service.ts
│   │   └── ... (more)
│   ├── routes/              # API routes
│   │   └── index.ts
│   ├── utils/               # Utilities
│   │   ├── jwt.ts
│   │   ├── password.ts
│   │   ├── response.ts
│   │   └── settlement.ts
│   ├── app.ts               # Express app setup
│   └── server.ts            # Server entry point
└── .data/                   # Database storage
```

## 🔑 Architecture

### Layered Architecture
```
Routes → Controllers → Services → Repositories → Models → Database
```

**Routes:** Define HTTP endpoints and middleware  
**Controllers:** Handle requests/responses  
**Services:** Business logic  
**Repositories:** Data access  
**Models:** Data schemas  

### Layer Responsibilities

#### Routes (`src/routes/`)
- Define HTTP verbs and paths (`/api/v1/*`)
- Apply middleware (auth, validation, rate limiting)
- Forward to controllers

#### Controllers (`src/controllers/`)
- Extract request data
- Call service layer
- Return standardized JSON responses

#### Services (`src/services/`)
- Core business logic
- Complex calculations
- Cross-repository operations

#### Repositories (`src/repositories/`)
- CRUD operations
- Query filtering
- Tenant isolation

#### Models (`src/models/`)
- TypeScript interfaces
- Data schemas

## 🔌 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user (protected)

### Expenses
- `GET /api/v1/expenses` - List expenses (protected)
- `POST /api/v1/expenses` - Create expense (protected)
- `GET /api/v1/expenses/:id` - Get expense (protected)
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
- `POST /api/analyze-spending` - Get AI analysis (protected)

### Health
- `GET /api/health` - Health check endpoint

## 🔐 Security Features

- ✅ JWT Bearer authentication
- ✅ Password hashing (bcrypt-style)
- ✅ Rate limiting (sliding window)
- ✅ Security headers (Helmet)
- ✅ CORS policy
- ✅ Input validation
- ✅ Error sanitization
- ✅ Tenant data isolation

## 🗄️ Database

### Current: JSON File-Based
- Location: `.data/digitrack_db.json`
- ACID-compliant operations
- Atomic writes
- Tenant isolation by userId

### Migration Ready
Easy to migrate to:
- PostgreSQL
- SQLite
- MongoDB
- MySQL

Repository pattern provides clean abstraction layer.

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | Yes | 3000 |
| `NODE_ENV` | Environment | Yes | development |
| `JWT_SECRET` | JWT signing key | Yes | - |
| `JWT_EXPIRES_IN` | Token lifetime | No | 7d |
| `GEMINI_API_KEY` | AI API key | No* | - |
| `DATA_DIR` | DB directory | No | .data |
| `ALLOWED_ORIGINS` | CORS origins | No | localhost:5173 |

*Required for AI features

### Generate JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## 📦 Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Run production server
npm run test     # Run tests
npm run lint     # TypeScript type checking
```

## 🧪 Testing

Run backend tests:
```bash
npm run test
```

Tests cover:
- Authentication flow
- CRUD operations
- Business logic
- API endpoints

## 🚀 Deployment

### Option 1: Node.js Platform
Deploy to Railway, Render, Heroku:

1. Build the app:
   ```bash
   npm run build
   ```

2. Set environment variables

3. Start with:
   ```bash
   npm start
   ```

### Option 2: Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

### Option 3: Serverless
Deploy to AWS Lambda, Vercel Functions, etc.

## 🔄 CORS Configuration

Update `ALLOWED_ORIGINS` in `.env`:
```env
ALLOWED_ORIGINS="http://localhost:5173,https://yourdomain.com"
```

## 🤖 AI Integration

### Gemini AI
- Spending pattern analysis
- Personalized recommendations
- Smart insights

### Fallback Engine
If Gemini API is unavailable, uses heuristic fallback:
- Rule-based analysis
- Basic recommendations
- Pattern detection

## 📊 Business Logic

### Budget Calculation
```
Spendable = Monthly Income - Protected Savings - Sum(Category Budgets)
```

### Savings Health
- **Healthy:** >= 90% of target
- **At Risk:** 50-89% of target
- **Critical:** < 50% of target

### Bill Split Settlement
- Minimal debt graph reduction
- Optimized transaction count

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Change PORT in .env
PORT=3001
```

### Database Issues
```bash
# Check .data folder exists
mkdir .data

# Restart server
npm run dev
```

### JWT Errors
- Ensure `JWT_SECRET` is set
- Must be 32+ characters
- Restart after changing .env

### AI Not Working
- Check `GEMINI_API_KEY`
- Verify API key at https://ai.google.dev/
- App works without AI (uses fallback)

## 📚 Learn More

- [Express Documentation](https://expressjs.com/)
- [TypeScript](https://www.typescriptlang.org/)
- [Node.js](https://nodejs.org/)
- [JWT](https://jwt.io/)

## 🤝 Contributing

1. Create feature branch
2. Make changes
3. Add tests
4. Create pull request

## 📄 License

Part of the DigiTrack project.
