# Backend

Express + TypeScript API for the Fantasy League Stats local-first MVP.

The backend currently exposes only the API health check used by the frontend. Business modules are scaffolded for future MVP work, but no product feature logic has been added in this refactor.

## Project Structure

```txt
src/
├─ app/
├─ modules/
├─ shared/
├─ config/
└─ main.ts
```

## Folder Responsibilities

### `src/main.ts`

Backend entry point. It starts the HTTP server through the app bootstrap layer.

### `src/app`

Application assembly and server setup.

Current files:

- `app.ts`: creates the Express app, registers middleware, and registers routes
- `routes.ts`: combines module routes
- `server.ts`: starts the HTTP server on the configured port

### `src/modules`

Business-domain-oriented backend modules.

Current modules:

- `health`
- `teams`
- `players`
- `events`
- `matches`
- `standings`
- `statistics`

Only `health` currently has implementation. Other modules are intentionally empty placeholders preserved with `.gitkeep`.

### `src/modules/health`

Contains the existing backend connectivity endpoint.

Endpoint:

```txt
GET /api/health
```

Response:

```json
{ "status": "ok" }
```

### `src/shared`

Shared backend infrastructure and reusable code.

Current folders:

- `db`: shared Prisma Client instance
- `middleware`: reusable Express middleware
- `errors`: shared error classes and helpers
- `utils`: generic utilities
- `validators`: shared validation helpers
- `types`: shared backend types
- `constants`: shared constants

Business-domain logic should stay inside `src/modules`, not `src/shared`.

### `src/config`

Environment and application configuration.

Current files:

- `env.ts`: loads `.env` and reads environment variables
- `index.ts`: exports the backend config object

Current config values:

- `PORT`, default `4000`
- `FRONTEND_ORIGIN`, default `http://localhost:5173`

## Prisma

The Prisma setup is intentionally preserved at the monorepo root:

```txt
prisma/
├─ schema.prisma
└─ migrations/
```

This backend package imports Prisma Client from `@prisma/client`. Do not move, recreate, or redesign the existing Prisma schema/migrations as part of backend structure refactors.

## Development

From the repository root:

```bash
pnpm dev:backend
```

Build the backend:

```bash
pnpm --filter @fantasy-league-stats/backend build
```

Typecheck the backend:

```bash
pnpm --filter @fantasy-league-stats/backend typecheck
```

Run the compiled backend:

```bash
pnpm --filter @fantasy-league-stats/backend start
```

## MVP Boundaries

This backend should not introduce:

- Authentication
- Authorization
- Registration
- Automatic tournament scheduling
- Automatic competition ranking
- Tournament rule calculation
- Product features beyond the current PR scope
