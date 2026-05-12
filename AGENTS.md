# AGENTS.md

## Project Overview

Pet forum (宠物论坛) — full-stack monorepo. Two independent packages with no shared code.

- `backend/` — NestJS 10 + Prisma + PostgreSQL + Redis
- `frontend/` — React 19 + Vite 8 + Redux Toolkit + Tailwind CSS + Ant Design 6

## Dev Server Startup Order

1. Start infrastructure: `docker-compose up -d postgres redis`
2. Backend: `cd backend && npx prisma generate && npm run start:dev` (port 3000)
3. Frontend: `cd frontend && npm run dev` (port 3001)

Backend will fail to start if Postgres or Redis is unreachable.

## Critical Commands

### Backend
```bash
cd backend
npm run start:dev          # dev server with watch
npx prisma migrate dev     # run migrations (requires running Postgres)
npx prisma generate        # regenerate client after schema changes — MUST run after any schema.prisma edit
npm run prisma:seed        # seed data
npm run test               # unit tests (Jest, pattern: *.spec.ts)
npm run test:e2e           # e2e tests (requires running DB)
npm run lint               # ESLint
npm run format             # Prettier
```

### Frontend
```bash
cd frontend
npm run dev                # Vite dev server on :3001
npm run build              # tsc -b && vite build → outputs to build/ (not dist/)
npm run lint               # ESLint
```

Frontend has **no test runner configured** — `npm test` will fail.

## Architecture Quirks

- **API prefix**: Backend uses global prefix `api/v1` (set in `main.ts`). Full endpoint example: `http://localhost:3000/api/v1/auth/login`.
- **Vite proxy**: Frontend proxies `/api` → `http://localhost:3000` **and strips the `/api` prefix** (`vite.config.ts:19`). So a frontend request to `/api/api/v1/auth/login` hits the backend as `/api/v1/auth/login`. When calling from frontend code, use the full path `/api/v1/...` — the proxy only strips the first `/api`.
- **RabbitMQ**: Defined in `docker-compose.yml` but **not wired into backend code**. Don't assume message queues are functional.
- **Path aliases**: Both packages use `@/*` but resolve to different roots:
  - Backend: `@/*` → `src/*` (tsconfig.json)
  - Frontend: `@/*` → `src/*` (vite.config.ts)
- **Backend TypeScript is non-strict**: `strictNullChecks: false`, `noImplicitAny: false`. Don't add strict types that break existing code.
- **Prisma BigInt**: `File.fileSize` is `BigInt` — requires JSON serialization handling.

## Backend Module Structure

All business logic lives in `backend/src/modules/`. Each module follows NestJS convention: `*.module.ts`, `*.controller.ts`, `*.service.ts`, `dto/`. Eight modules: `auth`, `user`, `pet`, `post`, `comment`, `file`, `search`, `notification`.

Shared cross-cutting code in `backend/src/common/`: decorators (`@Public`, `@User`, `@Roles`), guards (`JwtAuthGuard`, `RolesGuard`), interceptors, filters, pipes.

Prisma service is in `backend/src/database/` (not a module in `src/modules/`).

## Frontend Structure

- `src/store/` — Redux Toolkit store + RTK Query API service + authSlice
- `src/features/` — page-level components (home, postList, postDetail, postCreate, search, profile)
- `src/router/` — route config + `ProtectedRoute`
- `src/hooks/` — custom hooks (`useAuth`)
- `src/utils/` — storage, debounce, throttle, validator

## Docker

Default credentials (from `.env.example`):
- Postgres: `petforum:petforum123@localhost:5432/petforum`
- Redis: `localhost:6379` (no password)
- RabbitMQ management: `http://localhost:15672` (guest/guest)
- Swagger UI: `http://localhost:3000/api/docs`

## Before Committing

1. `cd backend && npm run lint`
2. `cd frontend && npm run lint`
3. `cd backend && npm run build` (type-checks via `tsc`)
4. `cd frontend && npm run build` (type-checks via `tsc -b`)
