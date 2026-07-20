# Editorial Scoreboard UI System Lab

## Purpose

This directory is the working laboratory for a broader BoxScore Lab UI
refactoring experiment.

The lab inventoried the UI required by the current MVP, reviewed it in
manageable batches, and produced the Editorial Scoreboard system approved at
Gate E2 on 2026-07-20.

The laboratory remains an historical and migration-reference area:

- active intent now lives in `docs/DESIGN.md`;
- canonical shared token values now live in
  `apps/frontend/src/styles/variables.css`;
- static previews record comparisons and approval evidence;
- the lab does not independently authorize page refactoring.

## Documents

| File | Purpose |
|---|---|
| `DESIGN.md` | Candidate design intent and visual rules |
| `TOKEN_MAPPING.md` | Gate E2 semantic-token contract and active-token delta |
| `MIGRATION_PLAN.md` | Intentional exceptions, implementation impact, batches, and verification |
| `E6_APPROVAL_PACKET.md` | Whole-system Gate E2 review index |
| `UI_INVENTORY.md` | Complete MVP UI inventory and review status |
| `DECISION_LOG.md` | Durable record of approved, revised, and rejected decisions |
| `color-system-lab.html` | Interactive whole-system color exploration |
| `foundation-system-lab.html` | B01 Foundation roles and behavior specimen |
| `surface-hierarchy-lab.html` | B02 containment and page/section hierarchy comparison |
| `card-material-lab.html` | B02-A dark-surface material comparison |
| `glass-gradient-boundary-lab.html` | B02-A.2 Glass/Gradient boundary-strength comparison |
| `containment-context-lab.html` | B02-B containment assignment across Data, Editor, and Summary contexts |
| `b02-component-comparison.html` | Final B02 Page/Section Header, Inset Panel, and Compact Fact comparison |
| `action-navigation-lab.html` | B03 action hierarchy, interaction states, links, navigation, and API health |
| `action-navigation-revision-lab.html` | B03.2 conservative navigation baseline, unified Large action family, and compact Medium/Small sizing comparison |
| `manage-results-color-lab.html` | B03.2 focused comparison of existing-role, brand-derived, and new-hue treatments for the Related Workflow action |
| `b03-closing-review.html` | Closing B03 review for current navigation geometry, Detail Back Link, Inline Text Link, and API Health states |
| `b04-field-filter-lab.html` | B04-A comparison for field anatomy, Select/Dropdown behavior, native date-time shell, and Filter Bar containment |
| `b04-data-entry-lab.html` | B04-B comparison for Checkbox, regular/dense Number Input, Rating Slider, and Textarea states |
| `b05-badge-tag-lab.html` | B05-A comparison for Semantic Status, Count Badge, Stage/Result Tags, and compact Match tag reuse |
| `b05-badge-material-lab.html` | B05-A.2 comparison of Open Marker, Edge Plate, Corner Bracket, and Cut-corner Tab treatments |
| `b05-edge-gradient-lab.html` | B05-A.3 focused comparison of Flat, Neutral Gradient, and Semantic Trace Edge Plate treatments |
| `b05-identity-data-lab.html` | B05-B comparison for Entity Mark framing/fallback, Stat Summary rhythm/order, and Read-only Rating |
| `b05-logo-contrast-lab.html` | B05-B.2 focused validation of Open Logo Artwork, Transparent/Light Matte contrast, and fallback-only framing |
| `b05-logo-stage-lab.html` | B05-B.3 cross-context comparison of Transparent, Soft Neutral Well, Directional Gradient Stage, and Integrated Contrast Bay |
| `b05-team-logo-container-lab.html` | B05-B.4 focused gray-value comparison for the flat, square Team Logo Container |
| `b02-midtone-surface-lab.html` | B02-C addendum comparing a new Midtone Contrast Surface across Identity, Editor Preview, and Data Summary |
| `b02-midtone-material-lab.html` | B02-C.2 material comparison at fixed Deep Midtone brightness: Flat, Light Glass, Ambient Gradient, and restrained combination |
| `b02-light-glass-tuning-lab.html` | B02-C.4 focused Deep Light Glass comparison at 64/52/40% opacity |
| `b01-background-system-lab.html` | B01-C application background comparison across identical surface content |
| `b06-table-pagination-lab.html` | B06-A shared table shell, density, row behavior, semantic-row compatibility, and pagination comparison |
| `b06-special-row-lab.html` | B06-B independent Other Statistics and Winner Result row material comparison |
| `b07-feedback-states-lab.html` | B07-A persistent banners, empty states, loading/skeleton, and error/retry comparison |
| `b07-confirmation-dialog-lab.html` | B07-B Confirmation Dialog shell, action layout, consequence semantics, loading, and retained-error comparison |
| `team-overview-pattern-lab.html` | Team Pattern round: Division Board and Team Identity Card composition comparison |
| `team-detail-hero-lab.html` | Team Pattern round: Team Detail identity and five-axis profile Hero composition comparison |
| `team-identity-preview-lab.html` | Team Pattern round: Create/Edit live Team Identity Preview composition comparison |
| `player-leader-card-lab.html` | Player Pattern round: rejected first-pass Statistic Leader Card composition comparison |
| `player-leader-surface-lab.html` | Player Pattern revision: current Leader Card composition with container material and Hover comparison |
| `player-leader-glow-lab.html` | Player Pattern tuning: Frosted Depth category Glow strength comparison |
| `player-detail-identity-lab.html` | Player Pattern round: Player Detail identity, roster metadata, and historical-state comparison |
| `player-number-masthead-lab.html` | Player Pattern tuning: Number Masthead oversized Anton jersey-number treatment |
| `player-performance-profile-lab.html` | Player Pattern round: read-only Points, Rebounds, and Assists leader-relative visualization comparison |
| `player-awards-history-lab.html` | Player Pattern round: cross-Event Award type, award-time Team, and optional Notes history comparison |
| `event-tier-family-lab.html` | Event Pattern round: shared Tier identity across Event list-card and detail-hero contexts |
| `event-tier-luxury-lab.html` | Event Tier revision: more refined Faceted Seal, Tournament Insignia, and Prism Monogram treatments |
| `event-summary-card-lab.html` | Event Pattern round: Event Summary Card hierarchy, champion placement, states, and parent-card response |
| `event-player-awards-lab.html` | Event Pattern round: MVP spotlight and All-Event First/Second Team presentation comparison |
| `event-awards-container-lab.html` | Event Player Awards revision: fixed information hierarchy across three richer container materials |
| `match-record-card-lab.html` | Match Pattern round: list-card scoreline, Team identity, optional Stage, and responsive hierarchy comparison |
| `match-detail-score-header-lab.html` | Match Pattern round: detail-score hero composition, outcome emphasis, record states, missing Stage, and responsive hierarchy comparison |
| `teams-overview-scenario.html` | E5 scenario validation: Sidebar, Functional Page Header, Create action, Open Division Stacks, Score Ledger Team Cards, and page states together |
| `team-detail-scenario.html` | E5 scenario validation: Detail actions, archived notice, Unified Field Team hero, Ruled Grid summary, and Roster Data Bay together |
| `team-editor-scenario.html` | E5 scenario validation: Create/Edit header actions, Editorial Outline form sections, Identity Proof, profile ratings, Player management, validation, submission, and archived states |
| `players-overview-scenario.html` | E5 scenario validation: Players header, cascading filters, four Frosted Depth Leader Cards, Ranking Data Bay, pagination, and retained/empty/loading states |
| `player-detail-scenario.html` | E5 scenario validation: Number Masthead, Honors Ledger, Segmented Performance Profile, weak Event filter region, Stat Summary, Match History, and historical/unavailable states |
| `events-overview-scenario.html` | E5 scenario validation: Events header, Tournament Insignia rails, status plates, Champion strip, team counts, responsive list composition, and loading/empty/error states |
| `event-detail-scenario.html` | E5 scenario validation: Event actions, large Tournament Insignia hero, realistic 16-Team full-width Participants roster, compact Stage/Result Tag row, Final Team Results, Black Metal Player Awards, and historical/non-happy states |
| `event-editor-scenario.html` | E5 scenario validation: Event Create/Edit header, identity fields, realistic 16-Team participant selection, Stage/Result Tag editors, ordering controls, and lifecycle/read-only states |
| `event-outcomes-scenario.html` | E5 visual-scope validation: Team Result assignment for 16 Teams, current Player Award selection behavior, filtering, limits, inactive history, and read-only/prerequisite states; workflow redesign is deferred |
| `matches-overview-scenario.html` | E5 scenario validation: Matches header, cascading filter region, Scoreline Rail cards, pagination, and loading/empty/retained-error states |
| `match-detail-scenario.html` | E5 scenario validation: Detail actions, Arena Scoreline without Winner marker, two Box Score Data Bays, Other/Total rows, void/restore, historical Event, and missing Stage states |
| `match-editor-scenario.html` | E5 scenario validation: Match Create/Edit header, Match Information, two roster-stat entry Data Bays, live Team score, Other rows, validation/submitting/prerequisite/unavailable states |
| `card-ui-preview.html` | Historical initial card-pattern exploration; not authoritative |

Additional preview files may be introduced when a batch needs focused
comparison, but the lab should remain small and navigable.

## Scope model

Every inventory item belongs to one of four levels:

1. **Foundation** — color, typography, spacing, radius, borders, focus, motion,
   and responsive rules.
2. **Component** — reusable business-neutral UI such as Button, Input, Badge,
   Table, Modal, and Empty State.
3. **Pattern** — BoxScore Lab-specific composition such as a Score Ledger Team
   Card, Insignia Rail Event Card, Match Scoreline, or Team Summary.
4. **Scenario** — representative page composition used to validate how approved
   components and patterns work together.

Pages are validation scenarios, not automatically reusable components.

## Status vocabulary

Each inventory item uses one of these statuses:

| Status | Meaning |
|---|---|
| `Unlisted` | Known gap that has not been described |
| `Inventoried` | Name, level, and usage locations are recorded |
| `Queued` | Assigned to an upcoming experiment batch |
| `Exploring` | One or more candidate treatments exist |
| `Review` | Ready for user evaluation |
| `Approved` | Explicitly accepted for the candidate system |
| `Revise` | Direction retained but changes are required |
| `Rejected` | Candidate treatment will not be used |
| `Deferred` | Valid current-MVP item intentionally postponed |
| `Formalized` | Approved decision has been written into active project design docs |
| `Implemented` | Formalized decision has been migrated into the application |

`Approved` records the candidate review decision. The inventory-level
formalization marker records whether those approved decisions have graduated;
`Formalized` is still not equivalent to page-level `Implemented`.

## Working workflow

**Current phase:** Implemented / final M6 acceptance pending. Gate E2 was approved on
2026-07-20 after Foundation/Component batches B01–B07,
Team/Player/Event/Match product patterns, and representative E5 Overview/List,
Detail, and Create/Edit scenarios completed through `UI-DEC-058`. All 97
inventory items have an explicit review disposition: 91 Approved and now
Formalized, four Deferred, and two Rejected. The Player Awards selection
workflow is explicitly deferred to a separate functional PR.
The bounded M0–M6 application migration is now implemented and its final
scenario sweep is complete; only user acceptance of the M6 test report remains.
Gate E1 was approved on
2026-07-17. Gate E0 was approved on 2026-07-17 using the Neutral Black
foundation with Deep Green Black brand mint (`#43f2c8`).

### Current-round scope

The completed experiment covers:

- Foundation rules and candidate semantic tokens;
- reusable, business-neutral Components;
- shared interaction, accessibility, and responsive behavior;
- current-MVP Team, Player, Event, and Match Patterns;
- representative Overview/List, Detail, and Create/Edit Scenarios.

It does not redesign backend behavior, API contracts, persistence, the broader
Sidebar/mobile-navigation structure, or the Event Player Awards selection
workflow. `card-ui-preview.html` and unselected lab alternatives remain
historical evidence only; the decision log and candidate specification define
the approved direction.

### Phase E0 — Theme direction

Before detailed component inventory and styling, use representative product
content to determine the system-level color direction:

- canvas, navigation, surface, raised, and inset relationships;
- strong, normal, soft, muted, and disabled text;
- brand mint intensity and permitted roles;
- border and focus visibility;
- semantic success, warning, danger, and neutral states;
- compatibility with team colors and documented visualization exceptions.

The experiment must evaluate colors in Team, Event, Match, Table, Form, Status,
and Feature contexts rather than approving an isolated palette.

`color-system-lab.html` is the working specimen for this phase. Its light preset
is a comparison reference, not a commitment to implement light mode.

**Experiment gate E0 — user approval required:** approve the overall theme
direction and candidate color roles before detailed component styling begins.
Exact token values may continue to be tuned during later scenario validation.

### Phase E1 — Inventory

1. The user lists all UI components or UI-requiring functions currently known.
2. The list may be organized by page, feature, or component; it does not need
   to be normalized first.
3. The repository is inspected for current usage, states, and omitted UI.
4. Duplicate entries are merged.
5. Every item is classified as Foundation, Component, Pattern, or Scenario.
6. Results are recorded in `UI_INVENTORY.md`.

**Experiment gate E1 — user approval required:** the normalized inventory and
scope must be explicitly accepted before the first full design batch begins.

The inventory is limited to the current MVP and already-established product
flows. Future features are not added speculatively.

### Phase E2 — Batch planning

Items are grouped by dependency and visual impact. Recommended order:

1. remaining foundation roles and interaction states;
2. buttons, controls, badges, and status indicators;
3. panel/card shells and list/table primitives;
4. feedback, empty, loading, error, and destructive states;
5. **later round:** Team and Player patterns;
6. **later round:** Event patterns;
7. **later round:** Match and box-score patterns;
8. **later round:** representative page scenarios.

Each batch must state:

- included inventory IDs;
- real product usage examples;
- states to demonstrate;
- responsive cases;
- candidate token impact;
- known exceptions;
- explicit out-of-scope items.

### Phase E3 — Explore

For each batch:

1. Build static specimens using realistic BoxScore Lab content.
2. Show relevant default, hover, focus, selected, disabled, loading, empty,
   error, and destructive states.
3. Show desktop and mobile behavior where the component changes structurally.
4. Compare alternatives only when there is a meaningful design decision.
5. Keep experimental tokens local to this proposal.
6. Record unresolved questions in the inventory or decision log.

The experiment may change candidate `DESIGN.md` values freely because it is not
the active project specification.

### Phase E4 — Review and decide

The user evaluates each batch and chooses one of:

- approve;
- approve with a recorded adjustment;
- revise and review again;
- reject;
- defer.

An item cannot be marked `Approved` from inference or silence. The decision and
its reasoning are recorded in `DECISION_LOG.md`, then reflected in the candidate
`DESIGN.md` and inventory.

### Phase E5 — Scenario validation

Approved components and patterns are combined into representative pages:

- Teams overview and Team Detail;
- Create/Edit Team;
- Players overview and Player Detail;
- Events overview, Event Detail, and outcomes;
- Matches overview, Match Detail, and Create/Edit Match.

Scenario validation looks for:

- excessive repeated card chrome;
- hierarchy conflicts between adjacent components;
- density and alignment problems;
- inconsistent action language;
- responsive breakage;
- missing product states;
- overuse of mint or visualization effects.

Approval of an isolated component can be revisited if the scenario exposes a
system-level problem.

### Phase E6 — Candidate system approval

When all required inventory items are either `Approved`, `Rejected`, or
explicitly `Deferred`, prepare:

- final candidate `DESIGN.md`;
- final token mapping;
- component/pattern coverage summary;
- list of intentional exceptions;
- migration impact and recommended batches.

**Experiment gate E2 — user approval required:** the complete candidate design
system must be explicitly approved before anything is written into the active
project design specification.

## Formalization workflow

After experiment gate E2:

1. Update `docs/DESIGN.md` with the approved design intent.
2. Mirror approved semantic values into
   `apps/frontend/src/styles/variables.css`.
3. Keep the Mantine theme aligned with those values.
4. Do not leave proposal-only token names in production code.
5. Mark inventory items `Formalized`.

Because this is a broad frontend redesign, application migration must then
follow `docs/WORKFLOW.md`:

1. record implementation scope in the relevant frontend PRD;
2. obtain the required PRD approvals;
3. migrate shared primitives before page-local patterns;
4. implement in bounded batches;
5. validate style checks, typecheck, build, responsive behavior, and manual
   smoke scenarios;
6. obtain final user acceptance.

Formalization and implementation may be split into separate changes, but
`docs/DESIGN.md` and `variables.css` must not knowingly disagree.

## Change-control rules

- No backend, API, database, or persistence work belongs in this lab.
- Do not redesign business behavior while reviewing visual treatment.
- Do not create speculative abstractions for future features.
- Preserve data-driven team colors and documented visualization exceptions
  unless a review item explicitly reconsiders them.
- Use semantic token names, not palette names, when a candidate role is intended
  to graduate into the application.
- Keep the current baseline available for comparison.
- A preview is evidence for a decision, not the decision itself.

## Completion definition

The experiment is complete only when:

- the current-MVP inventory has been reviewed;
- required items have explicit dispositions;
- representative scenarios have been validated;
- candidate token roles are mapped;
- exceptions are documented;
- the user has approved the complete candidate system;
- a formalization and migration plan has been prepared.
