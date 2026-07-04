# Award Completeness

## Status

Future / Not in MVP

## Context

The MVP records event-level player awards through `EventPlayerAward`:

- `EVENT_MVP`
- `ALL_EVENT_FIRST_TEAM`
- `ALL_EVENT_SECOND_TEAM`

Current MVP validation (`validateAwardLimits` in `apps/backend/src/modules/events/events.service.ts`)
only enforces **upper bounds** on award counts, plus a cross-team conflict check:

- Event MVP: at most 1 player.
- All-Event First Team: at most 5 players.
- All-Event Second Team: at most 5 players.
- A player cannot appear on both First Team and Second Team for the same Event
  (`AWARD_TEAM_CONFLICT`).

There is **no lower bound and no completion-time completeness check**. An Event can transition to
`COMPLETED` with zero, partial, or asymmetric awards (for example: 1 MVP and 3 First Team players,
or a Second Team with only 2 players).

This note captures the deferred product decision from `PRODUCT_READINESS_GAPS.md` ("Event Award
Completeness"). It is distinct from `AwardSelectionRules.md`, which covers future position-composition
rules (guard/forward/center lineup templates); this note is only about *how many* awards are required.

## Not In MVP

- No enforced minimum award counts.
- No completion-time validation that awards form a complete set.
- No distinction between "award entry in progress" and "final award set".

## Possible Future Rules

If exact award completeness becomes a requirement, the intended rules are:

- Exactly 1 Event MVP.
- Exactly 5 All-Event First Team players.
- All-Event Second Team: either 0 players or exactly 5 players (no partial Second Team).

Likely enforcement point:

- Enforce completeness **at Event completion** (status transition to `COMPLETED`), not during
  incremental outcome edits, so awards can still be saved progressively while an Event is `ONGOING`.
- Keep the existing at-most limits as the check during incremental edits.

## Potential Impact

- Backend: extend award validation with a completion-time completeness check (a new error code such
  as `AWARD_SET_INCOMPLETE`, separate from `AWARD_LIMIT_EXCEEDED`). No schema change required — the
  rule is a hard-coded global count constraint.
- `docs/prd/EventManagementBackendPRD.md`: document the exact-count rule, the trigger point, and the
  new error code.
- `docs/prd/EventManagementFrontendPRD.md`: describe UI feedback when an Event cannot be completed
  because its award set is incomplete.
- Frontend: block or warn on the Complete action and surface which award group is incomplete.
- Tests: add cases for exact counts, the 0-or-5 Second Team rule, and completion being rejected when
  the award set is incomplete.

## Open Questions

- Is a Second Team required at all, or always optional (0 or 5)?
- Should completeness block completion (hard error) or only warn?
- Should the check apply retroactively to already-`COMPLETED` events when they are reopened and
  re-completed?
- Does completeness interact with position-composition rules from `AwardSelectionRules.md`, or should
  the two be enforced independently?

## Current Design Constraints

- Current Event Management MVP only enforces award count upper bounds and the First/Second conflict.
- Points are never stored — award completeness must not introduce any persisted award aggregate.
- Do not add configurable rule tables unless a future PRD explicitly approves it.
- Do not implement these rules until moved into an approved PRD (see `docs/future/README.md`).
