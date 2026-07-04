# Running BoxScore Lab

There are two ways to run the app: a development mode (Vite + auto-reload) and a
production-like local mode (a single Node process serving both API and frontend).

## Development mode

    pnpm dev

- Backend on http://localhost:4000, frontend on http://localhost:5173 (Vite).
- Auto-reloads on code changes. Use this while editing the app.

## Production-like local mode

Use this to run the real, built app without Vite.

    pnpm build      # build the frontend and backend once
    pnpm start      # serve the built app from a single Node process

- The backend serves the API **and** the built frontend on one port
  (http://localhost:4000 by default).
- Direct SPA routes such as `/events/:slug` and `/matches/:id` load correctly:
  unknown non-API paths fall back to the SPA's `index.html`.
- `pnpm start` refuses to run if build output is missing and tells you to run `pnpm build`.
- If the database is missing or not initialized, startup fails with a clear message pointing
  you to `pnpm app:init` (see `docs/DATABASE_OPERATIONS.md`).

> The built frontend calls the API at `http://localhost:4000/api`, so the production server must
> run on port **4000**. Changing `PORT` for the built app is not currently supported (the frontend
> API base is fixed). Development mode is unaffected.

### Windows launcher

Double-click **`start-boxscore.cmd`** in the project root. It runs `pnpm start` and, on error,
keeps the window open so you can read the message. First-time setup still requires
`pnpm install`, `pnpm app:init`, and `pnpm build` once.

## First-time setup (fresh checkout)

    pnpm install
    cp .env.example .env      # or copy it manually on Windows
    pnpm app:init             # create + initialize the personal database
    pnpm build
    pnpm start                # or double-click start-boxscore.cmd
