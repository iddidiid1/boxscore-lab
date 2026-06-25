---
name: fantasy-playground-db
description: Create, use, verify, and clean an isolated SQLite playground database for the fantasy-league-stats project. Use when Codex needs to run manual smoke tests, API checks, Prisma migrations, seed data, or local dev servers without touching the normal development database.
---

# Fantasy Playground DB

## Purpose

Use an isolated SQLite database as a disposable playground for `fantasy-league-stats` testing. Never edit `.env` for this workflow; set `DATABASE_URL` only in the current shell/session so the normal dev database remains untouched.

## Preconditions

- Work from the repository root: `D:\Study\Self Study\Personal Project\fantasy-league-stats`.
- Use PowerShell commands on Windows.
- Prefer a unique database file per test run, for example `file:./playground-smoke.db`.
- Before starting a dev server, check whether another backend is already using port `4000`; stop it or use a separate terminal/session that is known to have the playground `DATABASE_URL`.

## Create A Playground DB

Run these commands in the same shell session that will start the backend:

```powershell
$env:DATABASE_URL="file:./playground-smoke.db"
corepack pnpm prisma migrate deploy --schema prisma/schema.prisma
corepack pnpm db:seed
```

Notes:
- `file:./playground-smoke.db` resolves relative to the Prisma schema location, so the database file is expected at `prisma/playground-smoke.db`.
- Use `migrate deploy` for playground setup because it applies existing migrations without creating new migration files.
- Use `db:seed` only when seed data is appropriate for the smoke test.

## Run The App Against The Playground

Start the app from the same shell session after setting `DATABASE_URL`:

```powershell
corepack pnpm dev
```

Verify the backend is using the playground before testing:

```powershell
Get-Item prisma\playground-smoke.db
```

After creating or editing data through the app, the playground DB file timestamp should update.

## Recommended Smoke Test Flow

Use this workflow for Team Roster Management:

1. Open `/teams` and confirm the page loads from the API.
2. Create a team from `/teams/new` with a division, profile rating, and at least one player.
3. Confirm the app redirects to `/teams/:slug` and displays team details.
4. Edit the team from `/teams/:slug/manage`; update metadata, add a player, and remove an existing player.
5. Try validation cases such as missing division, invalid color or URL, and duplicate active jersey numbers.
6. Archive the team and confirm it disappears from `/teams` while the detail page remains readable.

Report what passed, what failed, fixes made, and remaining risks.

## Clean Up

Stop the dev server first, then remove only the playground files:

```powershell
Remove-Item prisma\playground-smoke.db -ErrorAction SilentlyContinue
Remove-Item prisma\playground-smoke.db-journal -ErrorAction SilentlyContinue
Remove-Item prisma\playground-smoke.db-shm -ErrorAction SilentlyContinue
Remove-Item prisma\playground-smoke.db-wal -ErrorAction SilentlyContinue
```

If a different playground filename was used, substitute that exact filename. Never delete the normal dev database unless the user explicitly asks.

## Safety Rules

- Do not write the playground `DATABASE_URL` into `.env`.
- Do not run destructive cleanup with wildcards.
- Do not use `prisma migrate dev` for playground smoke tests unless the user explicitly wants to create a new migration.
- Keep playground data disposable; do not rely on it as source-of-truth project data.
