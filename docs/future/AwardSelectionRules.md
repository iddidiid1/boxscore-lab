# Award Selection Rules

## Status

Future / Not in MVP

## Context

The MVP supports recording event-level player awards through `EventPlayerAward`:

- `EVENT_MVP`
- `ALL_EVENT_FIRST_TEAM`
- `ALL_EVENT_SECOND_TEAM`

Current MVP validation only limits award counts:

- Event MVP: max 1 player
- All-event First Team: max 5 players
- All-event Second Team: max 5 players

The MVP does not enforce lineup composition rules such as "at most two guards" or "must include one center".

## Not In MVP

- No position-composition validation for award teams.
- No backend-enforced award lineup templates.
- No database model for award rule configuration.
- No per-event custom award selection rules.
- No automatic award suggestions based on match statistics.

## Possible Future Rules

Future award selection may add lightweight frontend-only guidance first:

- All-event teams may require exactly 5 players.
- All-event teams may allow at most 2 guards.
- All-event teams may allow at most 2 forwards.
- All-event teams may require at least 1 center.
- A player may not appear in both First Team and Second Team for the same Event.
- MVP may be allowed to also appear in an All-event team, or this may be disallowed depending on league preference.

Position grouping could be:

| Group | PlayerPosition values |
|-------|------------------------|
| Guard | `PG`, `SG`, `G` |
| Forward | `SF`, `PF`, `F` |
| Center | `C` |

## Potential Impact

- Frontend outcomes page may show warnings or disable save when selected awards violate the rules.
- Backend may remain permissive initially if rules are only presentation guidance.
- If rules become authoritative, backend validation should be added before relying on them for data integrity.
- No schema change is required for hard-coded global rules.
- Schema changes may be needed if rules become configurable per Event or per league.

## Open Questions

- Should position-composition rules be warnings or hard blockers?
- Should MVP be allowed to also appear in First Team?
- Should First Team and Second Team have identical composition rules?
- Should rules use exact lineup slots, or only max/min counts by position group?
- Should inactive players remain eligible for historical award edits?

## Current Design Constraints

- Current Event Management MVP only enforces award count limits.
- Award candidates come from the Event's participating teams.
- `EventPlayerAward.teamId` stores the award-time team context.
- Do not store derived award rankings or computed award scores.
- Do not add configurable rule tables unless a future PRD explicitly approves it.

