# Digi Track — Deployment & Environment Specification

Production deployment configuration, environment variables, and build/run commands.

---

## 1. Environment Variables

| Variable | Required | Default | Description |
|---|---|---|---|
| `PORT` | No | `3000` | Server listening port |
| `NODE_ENV` | No | `development` | `'development' \| 'production' \| 'test'` |
| `JWT_SECRET` | No | auto-generated safe key | Secret key for signing JWT tokens |
| `JWT_EXPIRES_IN` | No | `7d` | JWT token lifetime |
| `GEMINI_API_KEY` | No | `""` | Google Gemini API key for AI spending advisor |
| `APP_URL` | No | `http://localhost:3000` | Public URL of the hosted application |
| `DATABASE_DIR` | No | `.data` | Directory for JSON/SQLite persistent storage |

---

## 2. Build and Start Commands

```bash
# Development (Vite SPA + Express API live reloading)
npm run dev

# Production Build
npm run build

# Production Server Start
npm start

# Type Checking
npm run lint
```

---

## 3. Health Checks & Monitoring
- **Health Check Endpoint**: `GET /api/health` -> `200 OK` (`{ "status": "ok", "timestamp": "..." }`)
- **Structured Logging**: Timestamps, HTTP method, path, response status, and duration recorded for all requests.
