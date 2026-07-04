# Database Operations

BoxScore Lab stores all data in a single SQLite database managed by Prisma. This document
describes where that database lives and how to back it up, validate it, and restore it.

## Active Database Location

- The database provider is SQLite (`prisma/schema.prisma`), and its path comes from the
  `DATABASE_URL` environment variable (read from the repo-root `.env`).
- SQLite `file:` paths are resolved **relative to the `prisma/` directory**. For example,
  `DATABASE_URL="file:./dev.db"` means the file `prisma/dev.db`.
- The database that the app and all `db:*` tooling act on is whatever `DATABASE_URL` currently
  points to — the "active" database.

## Database Roles

BoxScore Lab uses one SQLite file at a time, but three different files serve distinct purposes.
Each is selected by pointing `DATABASE_URL` at it; all `db:*` tooling acts on the active one.

| Role            | File (in `prisma/`)     | Purpose                                            | Backed up |
|-----------------|-------------------------|----------------------------------------------------|-----------|
| Personal use    | `boxscore.db`           | Your real data. This is the default for actual use.| yes       |
| Development     | `dev.db`                | Throwaway schema / migration development.           | no        |
| Playground/smoke| `playground-*.db`       | Disposable smoke-test and manual-check flows.       | no        |

For normal use, keep `DATABASE_URL="file:./boxscore.db"` (this is the value in `.env.example`).
The personal-use database is never required to contain playground data, and vice versa.

## Initialization

    pnpm app:init                 # validate env, generate client, apply migrations, seed divisions
    pnpm app:init --no-seed       # same, but do not seed the default divisions

Use this on a fresh checkout, or any time you want to (re)create the active database. It:

1. Validates required environment variables (`.env` present; `DATABASE_URL` a SQLite `file:` URL
   inside the repo; `PORT` numeric if set). All problems are reported together.
2. Generates the Prisma Client. If the app is running and the client is already present, this step
   is skipped with a warning instead of failing.
3. Applies existing migrations with `prisma migrate deploy` (creates the database if missing).
4. Seeds the four default divisions (idempotent upsert). No sample teams, events, or matches are
   created.

`app:init` is idempotent and non-destructive: re-running it on an existing database only applies
pending migrations and re-upserts divisions, keeping all existing records.

> A new checkout can go from zero to a usable empty database with: `cp .env.example .env` then
> `pnpm install` then `pnpm app:init`.

## Backup

    pnpm db:backup

- Writes a consistent single-file snapshot to `backups/boxscore-<timestamp>.db` using SQLite
  `VACUUM INTO`. This is safe to run while the app is running.
- If the active database does not exist yet, the command reports that and exits successfully
  (nothing to back up).
- `backups/` is git-ignored.

### Automatic backups

- The backend also runs an **automatic backup on startup** (`auto-<timestamp>.db`). This is
  fire-and-forget: a failure only logs a warning and never blocks the server.
- Automatic backups are pruned to the most recent `DB_BACKUP_KEEP` files (default **10**).
  Only `auto-*` files are pruned — manual, pre-restore, and pre-migration backups are kept.
- A backup is also taken automatically before migrations (`pnpm db:migrate` runs `db:backup` first).

### Backup file prefixes

| Prefix          | Source                                          | Auto-pruned |
|-----------------|-------------------------------------------------|-------------|
| `boxscore-`     | manual `pnpm db:backup` / pre-migration backup  | no          |
| `auto-`         | backend startup backup                          | yes (keep newest `DB_BACKUP_KEEP`) |
| `pre-restore-`  | snapshot taken automatically before a restore   | no          |

> Backups live on the same disk as the database. To protect against disk loss, occasionally copy
> the `backups/` folder to another drive or cloud storage. This is a manual habit, not automated.

## Validate

    pnpm db:validate                 # validate the active database
    pnpm db:validate <file>          # validate a specific file, e.g. a backup

Runs `PRAGMA integrity_check` and `PRAGMA foreign_key_check`. Exits non-zero if any problem is found.

## Restore

    pnpm db:restore <backup-file>            # dry run: prints the plan, changes nothing
    pnpm db:restore <backup-file> --yes      # performs the restore

Restores the selected backup over the active database. **Stop the running app before restoring.**

Safety behavior:

- The backup is integrity-checked **before** the live database is touched; an invalid backup is
  refused.
- The restore is refused if `DATABASE_URL` is not a SQLite `file:` URL, or if the resolved target
  is outside the repository.
- Without `--yes`, the command only prints what it would do.
- With `--yes`, a raw pre-restore snapshot of the current database is written to
  `backups/pre-restore-<timestamp>.db` first, then the target is overwritten and any stale
  `-wal` / `-shm` / `-journal` sidecar files are removed.

### Recovery steps

1. Stop the app (`pnpm dev` / the built server).
2. Pick a backup: list `backups/` and choose one; optionally verify it with `pnpm db:validate <file>`.
3. Dry run: `pnpm db:restore backups/<chosen>.db`.
4. If the plan is correct: `pnpm db:restore backups/<chosen>.db --yes`.
5. Validate the result: `pnpm db:validate`.
6. Start the app and confirm teams, events, matches, and statistics load.
7. If the restore was wrong, restore again from the `pre-restore-*.db` snapshot created in step 4.
