# Team Points Rules

## Core Principle

Team points are calculated values, not stored current values.

The database must not store:

- `currentPoints`
- `manualPoints`
- `basePoints`

These values are derived at runtime from Events and should never be persisted as independent columns.

## Base Points

All teams start from the same fixed baseline.

See `docs/TEAM_RANKING_CONFIG.md` for the current `BASE_TEAM_POINTS` value and configuration details.

This value should live in application logic (constants), not in the database.

## Event Result Points

Event-based point changes come from:

`EventTeamResult` → `EventResultTag.rankingPoints`

Each Event owns its own result tags and ranking points.

### Example

```
Event A Champion = 10 points
Event B Champion = 20 points
```

These are independent because `EventResultTag` belongs to one Event.

## Current Total Points (MVP)

For MVP, calculate team total points as:

```
totalPoints =
  BASE_TEAM_POINTS
  + sum(EventTeamResult.resultTag.rankingPoints)
```

### Eligibility Criteria

Only include Event results where:

- `Event.status = COMPLETED`
- `Event.countsForRanking = true`
- `Event.deletedAt = null`
- `Event.archivedAt` — soft-deleted events may or may not count depending on business decision; recommend excluding from ranking to avoid confusion.

## Future: Ranking Decay

Future ranking may count only the latest X ranking events, where X is defined in `docs/TEAM_RANKING_CONFIG.md` as `RANKING_DECAY_WINDOW`.

The calculation should become:

```
totalPoints =
  BASE_TEAM_POINTS
  + sum(points from latest X Events, where X = RANKING_DECAY_WINDOW)
```

### Selection Algorithm

1. Select the latest X Events (where X = `RANKING_DECAY_WINDOW`) that meet eligibility criteria.
2. Order by `Event.rankingOrder desc`.
3. Sum each team's `EventTeamResult` points from those X Events.

### Important

- **First** select the latest X eligible Events.
- **Then** sum each team's `EventTeamResult` points from those Events.
- **Do not** select the latest X `EventTeamResult` rows directly — this breaks the intent of "latest ranking events."
- X is configurable without schema changes; see `docs/TEAM_RANKING_CONFIG.md` for current value.

## Ranking Order

`Event.rankingOrder` is a historical sequence value maintained for future ranking-decay calculations.

### Rules

- Assigned by backend when creating an Event.
- Use `max(existing rankingOrder) + 1` for new Events.
- Must not be manually edited from frontend.
- Must not be reused after deletion or archival.
- Must not be renumbered or recalculated.
- Gaps are allowed.

### Example

| Event | Action | rankingOrder |
| --- | --- | --- |
| Event A | Created | 1 |
| Event B | Created | 2 |
| Event C | Created | 3 |
| Event C | Archived or deleted | 3 |
| Event D | Created | 4 |

## Backend Responsibility

- Calculate total points dynamically at request time.
- Do not persist calculated points as independent fields.
- Return calculated `totalPoints` (or `computedPoints`) in API responses.
- Ensure Events are properly marked as `COMPLETED` and `countsForRanking = true` before including in points calculations.

## Frontend Responsibility

- Display calculated points returned by backend.
- Must not maintain its own independent points formula except for temporary mock data.
- Rely on backend API responses for authoritative point values.

---

> This document ensures Team points remain auditable, consistent with historical Event data, and ready for future ranking-decay enhancements without requiring schema changes.
