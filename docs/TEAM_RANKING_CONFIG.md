# Team Ranking Configuration

This document defines configurable values for Team ranking and points calculations.

## Configuration Values

### Base Points

```ts
export const BASE_TEAM_POINTS = 1000;
```

**Purpose**: Starting points for all teams.

**Usage**: All team point calculations begin with this baseline, then add event-based points.

**Modification**: Should be updated only if the league's points system baseline changes. Recommend storing in `src/shared/constants/` or similar configuration layer.

### Ranking Decay Window (MVP: Not Yet Active)

```ts
export const RANKING_DECAY_WINDOW = 10; // Future use: number of latest events to count
```

**Purpose**: Controls how many of the latest completed events count toward team ranking.

**Usage**: 
- MVP ignores this value and counts all eligible events.
- Future implementation: Filter events by `rankingOrder desc` and take only the latest `RANKING_DECAY_WINDOW` events before summing points.

**Modification**: Can be updated to adjust ranking recency without schema changes.

**Note**: This configuration prepares for future ranking decay but is not yet enforced in MVP.

## Storage & Access

### Backend Storage

- Store in application constants file (e.g., `apps/backend/src/shared/constants/ranking.ts`)
- Example structure:

```ts
export const RANKING_CONFIG = {
  baseTeamPoints: 1000,
  rankingDecayWindow: 10, // future
  minCompleteEvents: 1, // future: minimum events for ranking eligibility
} as const;
```

### Configuration Update Process

1. Update the constant in backend code.
2. Rebuild and redeploy backend.
3. No database migration required—these are runtime values.

### Frontend Usage

Frontend should not replicate these constants; instead, rely on backend API responses where calculated points are returned.

---

> These configurations support both MVP (all events) and future ranking-decay enhancements (latest X events) without database schema changes.
