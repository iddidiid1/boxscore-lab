# Frontend

React + Vite + TypeScript frontend for BoxScore Lab, the personal fantasy basketball MVP.

See the root [README](../../README.md) for setup and running instructions, and
[docs/](../../docs/) for operating and design documentation.

## Structure

```txt
src/
├─ app/        # root app component, navigation, providers
├─ pages/      # page-level components (Teams, Players, Matches, Events, and detail/form pages)
├─ features/   # domain code: teams, players, events, matches (components, hooks, api, types)
├─ shared/     # generic components, hooks, api helpers, types, utils, constants
├─ styles/     # variables.css (design tokens) and global.css
├─ assets/     # static assets
└─ main.tsx    # entry point
```

## Data model

The database schema is the single source of truth: [`prisma/schema.prisma`](../../prisma/schema.prisma).
The frontend reflects that model (teams and rosters, events, matches, box-score stats, event result
tags, and player awards).

Statistics and team points are **computed by the backend at request time** from the raw records —
the frontend displays them and does not store or recompute derived aggregates. See
[docs/TEAM_POINTS_RULES.md](../../docs/TEAM_POINTS_RULES.md).

## Styling

Follow the design system in [docs/DESIGN.md](../../docs/DESIGN.md). `src/styles/variables.css` is the
canonical design-token entry point; do not hard-code colors, fonts, radii, or shadows when a token
exists. Keep Mantine theme values aligned with the CSS tokens.

## Commands

```bash
pnpm dev:frontend                                    # Vite dev server (http://localhost:5173)
pnpm --filter @fantasy-league-stats/frontend build
pnpm --filter @fantasy-league-stats/frontend typecheck
pnpm --filter @fantasy-league-stats/frontend check:styles
```

## MVP boundaries

No authentication, registration, permission checks, automatic scheduling, or tournament-bracket logic.
