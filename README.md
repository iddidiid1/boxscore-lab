# Fantasy League Stats

A personal, offline-first web app for recording fantasy league matches, match results, player stats, and manually entered competition results.

This MVP is intentionally simple. It does not include authentication, registration, permissions, automatic tournament scheduling, automatic ranking, or tournament rule calculation.

## Tech Stack

- Monorepo: pnpm workspaces
- Frontend: React, Vite, TypeScript
- Backend: Node.js, Express, TypeScript
- Database: SQLite
- ORM: Prisma

## Project Structure

```text
apps/
  frontend/
  backend/
prisma/
package.json
pnpm-workspace.yaml
```

## Install

```bash
pnpm install
```

Create a local environment file:

```bash
cp .env.example .env
```

On Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

## Run The App

Start the frontend and backend together:

```bash
pnpm dev
```

Or run each side separately:

```bash
pnpm dev:frontend
pnpm dev:backend
```

Default local URLs:

- Frontend: `http://localhost:5173`
- Backend health check: `http://localhost:4000/api/health`

## Prisma

Generate Prisma Client:

```bash
pnpm db:generate
```

Create and apply the initial SQLite migration:

```bash
pnpm db:migrate
```

Open Prisma Studio:

```bash
pnpm db:studio
```

The SQLite database is configured with `DATABASE_URL="file:./dev.db"`. With the current Prisma schema location, this creates `prisma/dev.db`.

## MVP Scope

This app records manually created seasons, competitions, teams, players, matches, match player stats, and manually entered competition results.

Stats should be derived from match and player stat records. Competition rankings and points are manually managed and are not calculated by the app.
