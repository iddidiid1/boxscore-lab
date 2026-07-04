# BoxScore Lab

A personal fantasy basketball web app for recording box scores and computing league statistics.

It is a single-user, local application with manual data entry only. It intentionally does **not**
include authentication, registration, permissions, multi-user support, cloud deployment, automatic
scheduling, or tournament-bracket logic.

## What it does

- Record teams and rosters, events, matches, box-score stats, event results, and player awards.
- Compute statistics and standings **at runtime** from the raw records you enter — nothing derived
  is stored.
  - Team points: `1000` (base) plus the ranking points of each eligible event result tag. An event
    result counts only when the event is `COMPLETED`, `countsForRanking = true`, and not archived or
    deleted.
  - Player and team averages are computed from the recorded match stats.

Because everything is computed, correcting a match or result immediately and consistently updates
the standings and averages.

## Tech stack

- Monorepo: pnpm workspaces
- Frontend: React + Vite + TypeScript (`apps/frontend/`)
- Backend: Node.js + Express + TypeScript (`apps/backend/`)
- Database: SQLite via Prisma (`prisma/schema.prisma`)

## Project structure

```text
apps/
  frontend/
  backend/
prisma/          # schema, migrations, database files
scripts/         # init, backup, restore, validate, start
docs/            # operating and design documentation
```

## First-time setup

```bash
pnpm install
cp .env.example .env          # Windows PowerShell: Copy-Item .env.example .env
pnpm app:init                 # create + initialize the personal database
```

`pnpm app:init` validates your environment, generates the Prisma Client, applies migrations, and
seeds the default divisions (no sample teams/events). It is safe to re-run. See
[docs/DATABASE_OPERATIONS.md](docs/DATABASE_OPERATIONS.md).

## Running the app

Development (Vite + auto-reload):

```bash
pnpm dev                      # frontend http://localhost:5173, backend http://localhost:4000
```

Production-like local run (single Node process serves API + built frontend):

```bash
pnpm build
pnpm start                    # http://localhost:4000
```

On Windows you can also double-click **`start-boxscore.cmd`**. Direct SPA routes such as
`/events/:slug` and `/matches/:id` load correctly in this mode. See
[docs/RUNNING.md](docs/RUNNING.md).

> The built frontend calls the API at `http://localhost:4000/api`, so the production server must run
> on port 4000.

## Database operations

The active database is whatever `DATABASE_URL` points to. Three roles are used:

| Role             | File (in `prisma/`) | Purpose                                   |
|------------------|---------------------|-------------------------------------------|
| Personal use     | `boxscore.db`       | Your real data (default; backed up)       |
| Development      | `dev.db`            | Throwaway schema/migration work           |
| Playground/smoke | `playground-*.db`   | Disposable smoke/manual-test flows        |

```bash
pnpm db:backup                # snapshot the active database into backups/
pnpm db:validate              # integrity-check the active database
pnpm db:restore <file>        # dry run; add --yes to restore over the active database
pnpm db:studio                # open Prisma Studio
pnpm db:migrate               # backup, then apply/develop migrations
```

The backend also takes an automatic backup on startup (keeping the most recent 10 by default). Full backup,
restore, and recovery steps are in [docs/DATABASE_OPERATIONS.md](docs/DATABASE_OPERATIONS.md).

## Troubleshooting

- **`pnpm start` says build output is missing** — run `pnpm build` first.
- **Startup says the database is not initialized** — run `pnpm app:init`.
- **`pnpm app:init` warns that Prisma generate did not complete** — the app is likely still running,
  which locks the Prisma engine. Stop it and re-run, or run `pnpm db:generate` after stopping.
- **The production app can't reach the API** — confirm it is running on port 4000.
- **Recover from a bad edit** — restore a backup: `pnpm db:restore backups/<file>.db --yes`.

## Documentation

| Topic | File |
|-------|------|
| Running (dev vs production) | [docs/RUNNING.md](docs/RUNNING.md) |
| Backup / restore / initialize | [docs/DATABASE_OPERATIONS.md](docs/DATABASE_OPERATIONS.md) |
| Points and ranking rules | [docs/TEAM_POINTS_RULES.md](docs/TEAM_POINTS_RULES.md) |
| Deletion and archival | [docs/DELETION_RULES.md](docs/DELETION_RULES.md) |
| Design system | [docs/DESIGN.md](docs/DESIGN.md) |
| Development principles | [AGENTS.md](AGENTS.md) |
