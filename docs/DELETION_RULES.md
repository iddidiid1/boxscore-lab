# Deletion Rules v1

This document defines the v1 deletion behavior for MVP data. The main principle
is to protect historical ranking, match, award, and statistics data from being
changed by administrative cleanup actions.

## Guiding Principles

- Prefer soft deletion for core historical entities.
- In normal application workflows, hard delete only configuration data that is not referenced by historical data.
- The MVP Event Management API and UI only archive Events by setting `Event.archivedAt`; they do not expose Event hard delete, soft delete, unarchive, or restore operations.
- References below to cascading from a hard-deleted parent Event describe existing database referential behavior for controlled maintenance only, not an application workflow or product capability.
- Ranking calculations must remain stable after deletion or archiving.
- Event ordering must never be renumbered after deletion.
- Match, result, and award records should remain auditable because they are the
  source of truth for team points, player honors, and player statistics.

## Rules

| Model | Behavior | Reason |
| --- | --- | --- |
| `Season` | Use `onDelete: SetNull` from `Event.seasonId` to `Season.id`. | Season is future-facing metadata for MVP and should not own Event history. |
| `Division` | Use `onDelete: SetNull` from `Team.divisionId` to `Division.id`. | Teams should survive division restructuring. Application logic should still require a division when creating or editing a team. |
| `Team` | Prefer soft deletion or archiving. Avoid hard deletion once referenced by players, events, matches, or awards. | Team identity is needed for historical results, match records, rankings, player history, and award context. |
| `Player` | Prefer soft deletion through `isActive = false`. Restrict deletion while match stats or awards exist. | A player leaving a team or becoming inactive should not remove past box score data or honors. |
| `Event` | Archive by setting `archivedAt` in the MVP application. Do not expose hard delete, soft delete, unarchive, or restore through normal API/UI workflows. | `rankingOrder` and historical Event data must remain stable and auditable. |
| `EventStageTag` | Use `onDelete: SetNull` from `Match.stageTagId` to `EventStageTag.id`. | Stage labels are event configuration, but matches should not be deleted when a stage tag changes. |
| `EventResultTag` | Restrict deletion when referenced by `EventTeamResult`. | Result tags define ranking points; deleting them would break historical point calculation. |
| `EventParticipant` | Cascade when the parent Event is hard deleted. Restrict Team deletion while participant records exist. | Participation belongs to an Event, but Team history should be protected. |
| `EventTeamResult` | Cascade when the parent Event is hard deleted. Restrict Team deletion and ResultTag deletion while results exist. | Results are the source for team ranking points. |
| `EventPlayerAward` | Cascade when the parent Event is hard deleted. Restrict Player and Team deletion while awards exist. | Player honors are historical records and must preserve the awarded player and team context. |
| `Match` | Normal Match workflows never hard delete. Void by setting `voidedAt`, retain all detail rows, and allow controlled restore by clearing `voidedAt`; cascade only when the parent Event is hard deleted through controlled maintenance. | Matches are the auditable source of player stats and team score calculations; voided matches must be excluded from all derived statistics. |
| `MatchTeam` | Cascade when the parent Match is hard deleted. Restrict Team deletion while match team records exist. | Historical match participation should remain intact. |
| `MatchPlayerStat` | Cascade when the parent Match is hard deleted. Restrict Player and Team deletion while stats exist. | Player stats are historical box score data. |
| `MatchTeamOtherStat` | Cascade when the parent Match is hard deleted. Restrict Team deletion while other stats exist. | Other stats contribute to calculated team score. |

## Soft Deletion Fields

The v1 schema supports or expects these lifecycle fields:

- `Team.archivedAt`
- `Player.isActive`
- `Event.archivedAt`
- `Event.deletedAt`
- `Match.voidedAt`

`Event.deletedAt` remains a schema-level soft-deletion field used by read filters and future or controlled data handling; the implemented MVP Event Management flow does not expose an operation that sets or clears it. Normal Event workflows use `archivedAt` only. Teams and Players continue to use their model-specific archive/deactivation behavior.

Normal application workflows must not hard delete historical records. If a parent Event is hard-deleted through a controlled database maintenance operation outside the MVP API/UI, the existing foreign-key cascades listed above apply to its Event-owned records. Such maintenance must be treated as destructive and is outside normal product behavior.

## Event Ranking Order

Events use a monotonic `rankingOrder` for future ranking-decay support.

Rules:

- `rankingOrder` must increase when creating a new Event.
- `rankingOrder` must not be reused after deletion.
- Existing events must not be renumbered.
- Archived or soft-deleted events remain in the table with their original
  `rankingOrder`.
- `countsForRanking` controls whether an Event participates in ranking
  calculations.

Example:

| Event | Action | rankingOrder |
| --- | --- | --- |
| Event A | Created | 1 |
| Event B | Created | 2 |
| Event C | Created | 3 |
| Event C | Archived or deleted | 3 |
| Event D | Created | 4 |

## Team Points

Team points are calculated, not stored.

Formula:

```text
Total Points =
BASE_TEAM_POINTS
+ sum(EventResultTag.rankingPoints through EventTeamResult)
```

Only events with `countsForRanking = true` should contribute to ranking
calculations.

Future ranking-decay calculations can limit the sum to the latest X ranking
events ordered by `rankingOrder desc`.

## Player Awards

`EventPlayerAward` records event-level player honors.

Award limits are MVP business validation rules, not database constraints:

- `EVENT_MVP`: max 1 per Event
- `ALL_EVENT_FIRST_TEAM`: max 5 per Event
- `ALL_EVENT_SECOND_TEAM`: max 5 per Event

The unique database constraint prevents duplicate same award type for the same
player in the same event.
