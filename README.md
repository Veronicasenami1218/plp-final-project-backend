# MentWel Backend (Node.js + TypeScript)

Secure, versioned REST API for the MentWel Digital Mental Health Platform with a strict Anonymity Layer, and real-time capabilities.

## Features
- **REST API** with `/api/v1` versioning
- **Security**: JWT auth, RBAC, CORS, Helmet, rate limiting (Redis or in-memory fallback)
- **Anonymity Layer**: PII separation and masking for therapist-facing contexts
- **MongoDB** (Mongoose), **Redis** (optional), **Socket.io** for real-time
- **Swagger/OpenAPI** docs
- **Testing** with Jest + Supertest

## Getting Started
1. Install dependencies
   ```bash
   npm install
   ```
2. Configure environment
   - Copy `.env.example` to `.env` and update values.
   - Use a strong `JWT_SECRET`.
3. Run in development
   ```bash
   npm run dev
   ```
4. Build and run
   ```bash
   npm run build
   npm start
   ```
5. Test with coverage
   ```bash
   npm run test
   ```

## Environment Variables
See `.env.example`. Important keys:
- `NODE_ENV`, `PORT`
- `LOG_LEVEL`, `LOG_FORMAT`, `CREDENTIALS`
- `CLIENT_URL`, `SERVER_URL`
- `MONGODB_URI`
- `REDIS_URL` (optional)
- `JWT_SECRET`, `JWT_ACCESS_EXPIRATION`, `JWT_REFRESH_EXPIRATION`

## API & Docs
- Health check: `GET /health`
- API base: `/api/v1`
- Swagger UI (non-production): `GET /api-docs`
- Swagger JSON: `GET /api-docs.json`

## Project Structure
```
backend/
  src/
    config/         # env, database, swagger
    controllers/    # controllers (thin)
    middleware/     # auth, error, validation
    models/         # mongoose schemas
    routes/         # feature routes mounted at /api/v1
    socket/         # socket.io init
    utils/          # logger, ApiError
    server.ts       # app bootstrap
  tests/            # jest tests
  README.md
  .env.example
  .gitignore
```

## Scripts
- `npm run dev` – Start dev server (ts-node-dev)
- `npm run build` – Compile TypeScript to `dist/`
- `npm start` – Run compiled server
- `npm run test` – Jest with coverage
- `npm run lint` / `npm run format` – Lint and format

## Security & Compliance
- **JWT** with proper expirations and refresh flow.
- **RBAC** for Users/Therapists/Admins.
- **Helmet, CORS, Rate limiting** enabled; Redis store used when available.
- **Centralized error handling**; no internal details exposed.
- **Anonymity Layer**: service-layer masking for therapist views; PII separated from session data.
- **No secrets in VCS**: `.env` is ignored; maintain `.env.example` only.

## Contributing
- Ensure tests pass (target ≥80% coverage).
- Follow the code organization (Controller → Service → Repository).
- Keep controllers thin; put business logic in services.

## Troubleshooting
- Redis not available: app falls back to in-memory rate limiter.
- MongoDB TTL index: token expiry is enforced via TTL on `expiresAt`.
- Swagger not loading in production: Docs are disabled when `NODE_ENV=production`.

---
MentWel © 2025 – All rights reserved.
