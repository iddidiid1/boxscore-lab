# Player Awards Component Design

## Status

**Status:** Active content and ordering contract; visual specification
superseded.

This document remains authoritative for Player Awards information order, API
ordering, MVP duplication, optional Second Team behavior, and displayed data.
`docs/DESIGN.md` is the visual source of truth and defines the Event Detail
presentation as the responsive **Black Metal Plaque** Pattern. Where historical
visual language below conflicts with `docs/DESIGN.md`, the active Design System
wins. This document does not change award business rules, persistence, or
editing workflows.

## Scope

The component presents these event awards:

- Exactly one Event MVP.
- Exactly five All-Event First Team selections.
- An optional All-Event Second Team containing exactly five selections.

The component appears on `/events/:slug` and replaces the current generic badge-and-text award list.

## Information Hierarchy

Awards must appear in this order:

1. Event MVP.
2. All-Event First Team.
3. All-Event Second Team, when present.

The MVP is the component's primary visual focus. The First Team is the primary roster group. The Second Team uses the same structure with lower visual emphasis.

## Layout

### Event MVP

- Render the MVP as the first full-width horizontal field integrated into the
  single Black Metal Plaque; do not nest a separate Card.
- Show the `EVENT MVP` label, player name, player position, and team name.
- Use the display typeface for the player name and render it in uppercase.
- Use Championship Gold for the Trophy/outcome signal and Brand Mint only as a
  restrained structural trace.
- Do not use a full mint or gold background.

### All-Event First Team

- Render a section heading followed by one row of five equal-width player cells.
- Each cell shows the player name, player position, and team name.
- Player names are the primary text within the row.
- Team names use smaller, lower-emphasis text.
- Use the current primary accent sparingly on the section border or divider.

### All-Event Second Team

- Render one row of five equal-width player cells using the same structure as the First Team.
- Reduce emphasis with neutral gray borders and muted supporting text.
- When no Second Team awards exist, omit the entire section. Absence is valid and must not be shown as an error or empty state.

## MVP Duplication

An MVP may also be selected for the First or Second Team.

- Keep the player in the relevant team row so the roster remains complete.
- Add a compact gold `MVP` marker to that player's cell.
- Do not remove or replace the standalone MVP spotlight card.

## Roster Ordering

- First Team and Second Team cells use the Event Detail API order.
- The backend orders players within each award team by the project position sequence: `PG`, `SG`, `G`, `SF`, `PF`, `F`, `C`.
- Players with the same position are ordered by team name, jersey number, player name, and player ID for deterministic output.
- The frontend must not re-sort the award rows independently.

## Visual Rules

All visual rules come from `docs/DESIGN.md §8.3` and its named Black Metal
Plaque exception. In particular:

- use one cut-corner, solid near-black outer Plaque;
- integrate the MVP field and both roster groups without nested Cards;
- use Championship Gold for MVP meaning and restrained Brand Mint for
  structure;
- render First Team and optional Second Team as engraved five-cell ruled grids
  at desktop width;
- reflow the roster grids responsively without changing award grouping;
- use canonical tokens and keep registration marks and directional traces local
  to this Pattern; do not add repeating stripes or visible brushed grain.

The data requirements remain: show API-provided Position, keep equal roster-cell
roles, preserve API order, omit absent Second Team, and retain the inline `MVP`
marker when duplicated.

## Desktop Wireframe

```text
PLAYER AWARDS

+-------------------------------------------------------------+
| EVENT MVP                                                   |
| JAMES WALKER  PG                                            |
| Thunder Hawks                                               |
+-------------------------------------------------------------+

ALL-EVENT FIRST TEAM
+-----------+-----------+-----------+-----------+-----------+
| Player PG | Player SG | Player SF | Player PF | Player C  |
| Team      | Team      | Team      | Team      | Team      |
+-----------+-----------+-----------+-----------+-----------+

ALL-EVENT SECOND TEAM
+-----------+-----------+-----------+-----------+-----------+
| Player PG | Player SG | Player SF | Player PF | Player C  |
| Team      | Team      | Team      | Team      | Team      |
+-----------+-----------+-----------+-----------+-----------+
```

## Non-Goals

- Award notes presentation.
- Award editing or selection controls.
- Manual position ordering, basketball-court placement, or formation visualization. Positions are display labels and backend ordering keys, not award-specific stored data.
- Changes to `PlayerAwardType`, award cardinality validation, or database models.
- New ranking, ordering, or eligibility rules.

## Implementation Acceptance Criteria

- The MVP, First Team, and optional Second Team are visually distinct at a glance.
- The MVP is the strongest visual element in the component.
- First and Second Team selections use five equal-role cells per desktop row
  and the responsive reflow defined by `docs/DESIGN.md`.
- A missing Second Team does not render an empty section.
- An MVP selected in a team row remains in that row and receives an `MVP` marker.
- Every rendered award shows the API-provided player position without deriving or persisting award-specific position data.
- Championship Gold communicates MVP meaning; Brand Mint remains a restrained
  structural trace.
- The component uses semantic design tokens and introduces no page-local theme.
- Existing award data and event-detail interaction behavior remain unchanged.
