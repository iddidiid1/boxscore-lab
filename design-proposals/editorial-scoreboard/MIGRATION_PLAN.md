# Editorial Scoreboard Migration Plan

## Boundary

This plan describes implementation impact. Gate E2 was approved on 2026-07-20,
and M0 formalizes the active design documentation and token/theme sources.
Application migration begins only after the relevant frontend PRD scope and
approvals are in place.

Business logic, API contracts, database behavior, component placement, and
existing responsive behavior remain unchanged unless a separately approved
functional PR explicitly changes them.

## Intentional exceptions

The following are deliberate exceptions to the quiet shared surface language:

| Exception | Allowed scope | Guardrail |
|---|---|---|
| Deep Light Glass | Team identity/card surfaces | 40% bright neutral glass; never a generic panel |
| Feature Gradient and category Glow | Four Statistic Leader cards | Category-specific, stronger on hover, no click behavior |
| Tournament Insignia | Event Tier identity | S/A/B/C color is paired with letter and subtitle |
| Black Metal Plaque | Event Detail Player Awards presentation | Read-only; material does not graduate to generic Card |
| Team-color trace | Team/Match identity and Player number echo | Never recolor supplied logos; always preserve text hierarchy |
| Championship Gold | Winner/result and MVP meaning | Pair with Trophy/text; do not substitute Brand Mint |
| Operational Neutral | Match-statistics Other row | Never reuse warning, danger, selected, or winner roles |
| Open Section/Open Content | Approved hierarchy or state exceptions | No invented nested container |
| Neutral Ambient | Global content canvas | No global Mint, grid, noise, or pulse |

Loaded Team logos use Open Artwork with `object-fit: contain`; the brighter
parent identity surface supplies contrast. Missing or failed artwork uses
Neutral Frame plus derived initials only.

## Deferred and rejected scope

Deferred:

- Sidebar Shell and Brand Header redesign: preserve the current satisfactory
  structure and make only token-alignment changes required by shared roles.
- Main Content Shell redesign: preserve width, placement, and behavior.
- Event Player Awards selection workflow: preserve current selection logic and
  implement only the approved surrounding visual treatment. Redesign the
  workflow in a separate functional PR.

Rejected:

- Decorative Page Eyebrow;
- nested Team Logo Container.

Early labs and unselected alternatives are not migration requirements.

## Impact summary

The largest shared changes are the Brand Mint re-value, 4/8/10/12px shape
hierarchy, non-pill actions, Dark Glass/Editorial Outline surface split,
consistent field/table density, and explicit state treatments. These touch most
frontend pages, so a single page-by-page rewrite would create avoidable drift.

The active `variables.css` currently contains old-mint alphas, universal
16/24px radii, pill roles, legacy Event chrome, and duplicated semantic aliases.
The Mantine theme mirrors the old mint and defaults Button to an `xl` pill.
Formalization must change both in the same bounded change.

## Recommended batches

### M0 — Formalize the contract — completed 2026-07-20

- update active `docs/DESIGN.md`;
- update canonical `variables.css`;
- align `apps/frontend/src/app/theme.ts`;
- mark proposal inventory as Formalized;
- do not migrate pages in this batch unless required to keep the application
  compiling.

Validation: token/theme diff review, style lint, typecheck, and a build.

### M1 — Foundation and shared primitives

- background, typography, spacing, radius, border, focus, and motion roles;
- shared Button/action variants and links;
- field, Select, Checkbox, Number Input, Slider, and Textarea states;
- Badge/Tag, API Health, Alert, Empty, Loading, Error, and Confirm primitives;
- shared panel materials.

Validation: keyboard focus, disabled/loading/pressed/selected states, Reduced
Motion, and compact/narrow viewport specimens.

### M2 — Data display

- Data Bay table shell, sortable headers, row hover, local overflow;
- Operational Neutral Other row and Championship Gold Winner row;
- integrated Pagination;
- Ruled Grid summaries, label-first facts, and fractional Star Rating;
- Filter Bar structural grouping.

Validation: all four table contexts plus data-entry and winner tables; long
names, zero/unavailable values, and 560/760/980px boundaries.

### M3 — Team and Player patterns

- Open Division Stacks and Score Ledger Team Cards;
- Unified Field Team hero and Identity Proof editor preview;
- Frosted Depth Leader cards;
- Player Number Masthead, Segmented Performance Profile, and Honors Ledger.

Validation: loaded/dark/failed logos, initials fallback, archived/historical
states, partial stars, hover-only leader behavior, and narrow stacking.

### M4 — Event patterns

- Tournament Insignia and Insignia Rail Event cards;
- Event Detail participants/tags/results hierarchy;
- Black Metal Plaque awards presentation;
- Event Create/Edit and Results/Awards visual shells.

Validation: realistic 16-Team Events, missing optional content, all lifecycle
states, award history, and preservation of current Awards selection behavior.

### M5 — Match patterns

- Scoreline Rail cards;
- Arena Scoreline detail hero;
- Match Create/Edit data-entry composition and live score.

Validation: home/away wins, defensive equal score, missing Stage, loaded and
fallback artwork, void/restore, unavailable Event, and dense table overflow.

### M6 — Scenario sweep and cleanup

- run Overview, Detail, and Create/Edit representative scenarios;
- remove superseded page-local visual duplication;
- verify no proposal-only token names or obsolete universal-card rules remain;
- complete the active redesign-readiness checklist;
- obtain final user acceptance.

## Verification contract

Every implementation batch should include:

- formatting/style checks, typecheck, tests where present, and production build;
- keyboard and focus-visible checks;
- hover, pressed, selected, disabled, loading, empty, error, and destructive
  states relevant to the batch;
- Reduced Motion and touch/no-hover behavior;
- 560px, 760px, 980px, and wide-layout checks;
- local table overflow and long-content checks;
- visual comparison against the approved E5 scenarios;
- confirmation that no business logic or API behavior changed unintentionally.

The migration is complete only when active documentation, canonical tokens,
Mantine, shared primitives, and consuming pages agree.
