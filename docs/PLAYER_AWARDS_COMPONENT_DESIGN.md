# Player Awards Component Design

## Status

This document is the source of truth for the Player Awards presentation on the Event Detail page.

It defines the component's information hierarchy, desktop layout, and visual treatment. It does not change award business rules, persistence, or editing workflows.

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

- Render the MVP in one full-width horizontal spotlight card.
- Show the `EVENT MVP` label, player name, player position, and team name.
- Use the display typeface for the player name and render it in uppercase.
- Use the Jelly Mint action color for the card's primary accent line and border treatment.
- Reserve gold for the Trophy icon and compact `MVP` markers only.
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

- Follow the canonical tokens in `apps/frontend/src/styles/variables.css`.
- Use `--font-family-display` for the MVP name and section-defining display text.
- Use the body typeface for player names in roster cells.
- Use the data typeface for small labels such as `EVENT MVP`, `FIRST TEAM`, `SECOND TEAM`, and the inline `MVP` marker.
- Render player positions as compact data labels using the existing `PlayerPosition` enum values.
- Reuse shared surface, border, text, warning, and action tokens. Do not hard-code theme colors in the component.
- Jelly Mint is the component's primary structural accent. Gold is limited to the Trophy icon and `MVP` markers.
- Keep all five roster cells equal in width and aligned to the same grid.
- Preserve the sports-console visual language without turning the component into a decorative illustration.

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

- Mobile or narrow-screen layout behavior.
- Award notes presentation.
- Award editing or selection controls.
- Manual position ordering, basketball-court placement, or formation visualization. Positions are display labels and backend ordering keys, not award-specific stored data.
- Changes to `PlayerAwardType`, award cardinality validation, or database models.
- New ranking, ordering, or eligibility rules.

## Implementation Acceptance Criteria

- The MVP, First Team, and optional Second Team are visually distinct at a glance.
- The MVP is the strongest visual element in the component.
- First and Second Team selections use five equal-width cells per row.
- A missing Second Team does not render an empty section.
- An MVP selected in a team row remains in that row and receives an `MVP` marker.
- Every rendered award shows the API-provided player position without deriving or persisting award-specific position data.
- Jelly Mint provides the primary component accent; gold appears only on the Trophy icon and compact `MVP` markers.
- The component uses semantic design tokens and introduces no page-local theme.
- Existing award data and event-detail interaction behavior remain unchanged.
