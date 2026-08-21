# Digi Track — Error Handling Specification

Standardized error response formats, HTTP status codes, and centralized error middleware.

---

## 1. Error Schema

All API error responses follow the standard JSON structure:

```json
{
  "success": false,
  "message": "Human-readable error explanation",
  "code": "ERROR_CODE_CONSTANT",
  "errors": [
    {
      "field": "amount",
      "message": "Amount must be a positive number greater than 0"
    }
  ],
  "timestamp": "2026-08-21T06:18:00.000Z"
}
```

---

## 2. Standard Error Codes & HTTP Mappings

| HTTP Status | Error Code | Description |
|---|---|---|
| `400 Bad Request` | `VALIDATION_ERROR` | Schema validation failed on input body or query parameters. |
| `400 Bad Request` | `BAD_REQUEST` | Malformed request or illegal domain operation. |
| `401 Unauthorized` | `UNAUTHORIZED` | Missing, expired, or invalid JWT authentication token. |
| `401 Unauthorized` | `INVALID_CREDENTIALS` | Incorrect email or password during login. |
| `403 Forbidden` | `FORBIDDEN` | Authenticated user lacks permission for the requested entity. |
| `404 Not Found` | `NOT_FOUND` | The requested resource (expense, category, split) does not exist. |
| `409 Conflict` | `CONFLICT` | Resource already exists (e.g., email duplicate). |
| `429 Too Many Requests` | `RATE_LIMIT_EXCEEDED` | Exceeded API rate limits. |
| `500 Internal Server Error` | `INTERNAL_SERVER_ERROR` | Unhandled server exception. Implementation details masked in production. |

---

## 3. Centralized Error Middleware (`error.middleware.ts`)
- Catches all synchronous and asynchronous errors forwarded via `next(err)`.
- Distinguishes between custom `AppError` instances and unexpected runtime exceptions.
- Logs structured error traces to server logs without exposing stack traces to the client in production mode.
