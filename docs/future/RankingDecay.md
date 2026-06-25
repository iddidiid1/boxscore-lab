# Ranking Decay

## Status

Future / Not in MVP

## Context

The MVP calculates team points as:

```text
totalPoints = BASE_TEAM_POINTS + sum(eligible rankingPoints)
```

Ranking decay may be introduced later if recent events should matter more than older events.

## Not In MVP

- No decay window.
- No weighted scoring by recency.
- No configurable ranking formula.
- No persisted team points, averages, or derived ranking fields.

## Possible Future Rules

- Use only the latest N eligible completed events.
- Select events by `Event.rankingOrder DESC`.
- Apply the same eligibility filters as MVP points:
  - `Event.status = COMPLETED`
  - `Event.countsForRanking = true`
  - `Event.deletedAt = null`
  - `Event.archivedAt = null`
- Sum `EventTeamResult.resultTag.rankingPoints` from eligible results in the selected event window.

## Potential Impact

- Backend ranking calculation service may need a configurable window.
- API response shape should not need to change if only `totalPoints` is affected.
- Frontend may need explanatory copy if rankings become time-window based.
- Tests must cover ordering by `Event.rankingOrder`, not creation time or result row order.

## Open Questions

- Should older events be excluded completely or weighted down?
- Should the decay window be global, per division, or per league?
- Should the window size be a constant or admin-configurable?
- Should archived teams keep historical points frozen or continue using the same calculation?

## Current Design Constraints

- Do not store computed team points in the database.
- Keep `Event.rankingOrder` monotonic and never reuse or renumber it.
- Do not sort by `EventTeamResult` row order when selecting recent events.
