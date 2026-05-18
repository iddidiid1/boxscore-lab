# Frontend

React + Vite + TypeScript frontend for the Fantasy League Stats local-first MVP.

This app is currently a lightweight shell with placeholder pages, simple navigation, and a backend health check. Product features will be added incrementally inside the feature-oriented structure under `src`.

## Project Structure

```txt
src/
├─ app/
├─ pages/
├─ features/
├─ shared/
├─ assets/
├─ styles/
└─ main.tsx
```

## Folder Responsibilities

### `src/app`

Application-level setup.

Current responsibilities:

- Root app component
- Page registry / simple route-like navigation
- Global provider wrapper

Expected files:

```txt
app/
├─ App.tsx
├─ router.tsx
└─ providers.tsx
```

### `src/pages`

Page-level components. Pages compose shared UI and feature code, but should avoid owning domain logic directly.

Current pages:

- `TeamsPage`
- `PlayersPage`
- `MatchesPage`
- `EventsPage`

### `src/features`

Business-domain-specific frontend code. Each feature can grow its own components, hooks, API calls, and types.

Current feature folders:

```txt
features/
├─ teams/
├─ players/
├─ events/
├─ matches/
├─ standings/
└─ statistics/
```

Preferred feature shape:

```txt
some-feature/
├─ components/
├─ hooks/
├─ api/
├─ types.ts
└─ index.ts
```

### `src/shared`

Reusable non-business-specific code.

Current shared areas:

- `components/`: generic UI components
- `hooks/`: generic reusable hooks
- `api/`: shared API helpers
- `types/`: shared TypeScript types
- `utils/`: shared utility functions
- `constants/`: shared constants

### `src/assets`

Static frontend assets such as logos, images, icons, and local media.

### `src/styles`

Global styles.

Current files:

- `variables.css`
- `global.css`

## Basic Data Structure

The frontend should reflect the backend MVP data model. Stats are derived from matches and match player stats. Competition results are manually entered and should not be treated as calculated tournament logic.

### Team

Represents a team in the fantasy league.

Core fields:

- `id`
- `name`
- `description`
- `createdAt`
- `updatedAt`

Related data:

- Has many `Player`
- Appears in many `Match` records as either Team A or Team B
- Has many `MatchPlayerStats`
- Has many `CompetitionResult`

### Player

Represents a player assigned to a team.

Core fields:

- `id`
- `teamId`
- `firstName`
- `lastName`
- `position`
- `attribute`
- `description`
- `createdAt`
- `updatedAt`

Related data:

- Belongs to one `Team`
- Has many `MatchPlayerStats`

### Season

Represents a league season.

Core fields:

- `id`
- `name`
- `createdAt`
- `updatedAt`

Related data:

- Has many `Competition`

### Competition

Represents a competition within a season.

Core fields:

- `id`
- `seasonId`
- `name`
- `formatDescription`
- `createdAt`
- `updatedAt`

Related data:

- Belongs to one `Season`
- Has many `Match`
- Has many manually entered `CompetitionResult`

### Match

Represents a manually created match and its result.

Core fields:

- `id`
- `competitionId`
- `teamAId`
- `teamBId`
- `scoreA`
- `scoreB`
- `matchDate`
- `stage`
- `createdAt`
- `updatedAt`

Related data:

- Belongs to one `Competition`
- References Team A and Team B
- Has many `MatchPlayerStats`

### MatchPlayerStats

Represents one player's recorded stats for one match.

Core fields:

- `id`
- `matchId`
- `playerId`
- `teamId`
- `points`
- `rebounds`
- `assists`
- `createdAt`
- `updatedAt`

Important rule:

- Player and team statistics should be derived from `Match` and `MatchPlayerStats`.

### CompetitionResult

Represents manually entered competition standings/results.

Core fields:

- `id`
- `competitionId`
- `teamId`
- `rank`
- `points`
- `createdAt`
- `updatedAt`

Important rule:

- The frontend should display and edit these values as manual data.
- Do not infer tournament rules, auto-rank teams, or calculate advancement from these records in the MVP.

## Current Frontend API Usage

The frontend currently calls:

```txt
GET /api/health
```

Expected response:

```json
{ "status": "ok" }
```

This is used only to display whether the backend API is connected.

## Future Opponents / Participants Expansion

Reserved for future design notes.

Possible topics:

- Opponent display models
- Team-vs-team comparison data
- Player matchup views
- Historical head-to-head records
- Cross-season participant summaries

Notes:

```txt
TODO: Add opponent/participant frontend model decisions here.
```

## Future Frontend Tools

Reserved for future frontend tooling decisions.

Possible topics:

- Router library
- Server-state/data-fetching library
- Form library
- Table/grid library
- Charting library
- Component library
- Testing tools
- State management

Notes:

```txt
TODO: Add chosen frontend tools and usage conventions here.
```

## Development

From the repository root:

```bash
pnpm dev:frontend
```

Build the frontend:

```bash
pnpm --filter @fantasy-league-stats/frontend build
```

Typecheck the frontend:

```bash
pnpm --filter @fantasy-league-stats/frontend typecheck
```

## MVP Boundaries

The frontend should not introduce:

- Authentication
- Registration
- Permission checks
- Automatic tournament scheduling
- Automatic competition ranking
- Tournament rule calculation
- Product features beyond the current PR scope
