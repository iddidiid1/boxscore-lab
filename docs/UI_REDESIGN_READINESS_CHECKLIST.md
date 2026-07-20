# UI Redesign Readiness Checklist

## Goal

Make future visual redesigns, especially changes to color, typography, radius, borders, and elevation, possible without changing page layout, component placement, or business logic.

This is an incremental maintainability task, not a request to redesign the current UI. Existing pages should keep their current appearance while they are migrated.

## Completion criteria

- [x] Global colors, typography, radii, borders, and elevation are defined through semantic design tokens.
- [x] Mantine and project CSS consume the same design decisions instead of maintaining separate values.
- [x] Shared controls and surfaces own their visual styling.
- [ ] Page CSS mainly controls layout, spacing, responsive behavior, and page-specific exceptions.
- [ ] A future visual redesign can be completed primarily by changing tokens and shared component styles.
- [ ] No migration changes page behavior or business logic.

## Phase 1 - Establish one token source

- [x] Replace the current contents of `apps/frontend/src/styles/variables.css` with semantic CSS custom properties while preserving the existing appearance.
- [x] Define tokens by purpose rather than by literal color name. Prefer `--color-text-muted` over `--slate-400`.
- [x] Define the minimum useful surface tokens:
  - [x] application canvas
  - [x] sidebar/navigation surface
  - [x] default surface
  - [x] raised/interactive surface
  - [x] input/table surface
- [x] Define text tokens:
  - [x] strong text
  - [x] default text
  - [x] muted text
  - [x] disabled text
  - [x] text on accent
- [x] Define border and interaction tokens:
  - [x] default border
  - [x] subtle border
  - [x] hover border
  - [x] focus ring
- [x] Define semantic state tokens for primary, success, warning, and danger, including any required subtle backgrounds and hover states.
- [x] Define typography tokens for body, heading, and statistical/data text.
- [x] Define role-based radius tokens for controls, cards/panels, chips, and pills.
- [x] Define elevation tokens only for elevation patterns that are actually used.
- [x] Keep layout constants such as content width and page gutters separate from visual-theme tokens.
- [ ] Document any intentional one-off literal value next to its usage.

## Phase 2 - Align Mantine with the tokens

- [x] Move the inline Mantine theme configuration out of `apps/frontend/src/main.tsx` into a dedicated frontend theme module.
- [x] Make Mantine typography, primary color, and radii reflect the same token vocabulary.
- [x] Decide and document which layer owns each concern:
  - [x] Mantine theme owns library-wide component defaults.
  - [x] CSS tokens own values used by project CSS.
  - [x] Shared project components own project-specific variants.
- [ ] Verify that Mantine props such as `color`, `radius`, `c`, `bg`, and inline `styles` do not bypass semantic styling without a page-specific reason.
- [x] Avoid duplicating the full palette independently in CSS and TypeScript; use a small explicit bridge where direct sharing is impractical.

## Phase 3 - Consolidate shared visual primitives

- [x] Make the existing action-button styles the single implementation for the approved semantic action family.
- [x] Remove page-specific button styles that duplicate shared button variants.
- [x] Introduce a lightweight shared panel/card style for recurring border, background, and radius behavior.
- [x] Introduce shared form-control styling for text inputs, selects, number inputs, and textareas where Mantine defaults are insufficient.
- [x] Introduce shared table styling for recurring header, cell, divider, hover, and scroll-container behavior.
- [ ] Consolidate status badge/chip styling around semantic states rather than page-specific colors.
- [ ] Keep shared primitives small; do not introduce a component abstraction for a pattern used only once.

## Phase 4 - Migrate existing styles incrementally

- [x] Replace literal colors, font stacks, radii, and repeated shadows in `styles/global.css` with tokens.
- [ ] Batch 1 - Team Editor (`/teams/new` and `/teams/:slug/manage`).
  - [x] Replace `ManageTeamPage.css` visual literals with semantic tokens.
  - [x] Reuse shared panel, form-control, table, error-text, and action-button styles.
  - [x] Migrate Create/Save/Cancel/Add/Edit/Remove actions and loading skeletons across both routes.
  - [x] Run frontend type checking and build.
  - [x] Confirm both routes' default visual state through user review.
  - [ ] Complete desktop/mobile and interactive-state browser verification when browser tooling is available.
- [ ] Batch 2 - Player Statistics (`PlayersPage` and `PlayerDetailPage`).
  - [x] Replace page-level visual literals with semantic and statistical tokens.
  - [x] Reuse shared panel, form-control, and table styles across list and detail routes.
  - [x] Preserve dynamic team colors and promote repeated statistic/ranking accents to explicit tokens.
  - [x] Run frontend type checking, build, and residual literal scan.
  - [x] Confirm the list/detail routes' default visual state through user review.
  - [ ] Complete desktop/mobile and interactive-state browser verification when browser tooling is available.
- [ ] Batch 3 - Match History and Entry (`MatchesPage`, `CreateMatchPage`, `EditMatchPage`, and `MatchDetailPage`).
  - [x] Replace page-level visual literals with semantic tokens across all four routes.
  - [x] Reuse shared action-button, panel, form-control, and table styles where the existing structure supports them.
  - [x] Preserve dynamic team colors, score hierarchy, dense table overflow, and void/restore semantics.
  - [x] Run frontend type checking, build, residual literal scan, and diff checks.
  - [x] Confirm the routes' default visual state through user review.
  - [ ] Complete desktop/mobile and interactive-state browser verification when browser tooling is available.
- [ ] Batch 4 - Team Browsing (`TeamsPage` and `TeamDetailPage`).
  - [x] Replace page-level visual literals with semantic and radar visualization tokens.
  - [x] Reuse shared action-button, panel, and table styles across list and detail routes.
  - [x] Preserve dynamic team colors, team-card interactions, radar data, and roster overflow behavior.
  - [x] Run frontend type checking, build, residual literal scan, and diff checks.
  - [x] Confirm the routes' default visual state through user review.
  - [ ] Complete desktop/mobile and interactive-state browser verification when browser tooling is available.
- [ ] Batch 5 - Event Workflow (event list, form, detail, outcomes, and direct components).
  - [x] Migrate shared event panels, controls, tables, actions, and ordinary text styles to semantic tokens.
  - [x] Tokenize `EventsPage.css` Event summary/winner gradients (legacy pre-mint literals) — see PRD §7.2.
  - [x] Tokenize `EventTierBadge.css` and register the Tier Crest as a documented data-visualization exception in `docs/DESIGN.md` (A tier recolored to uv violet) — see PRD §7.4; file stays allowlisted as it composes alpha via `rgba(var(--tier-accent), α)`.
  - [x] Run frontend type checking, build, and diff checks.
  - [x] Confirm the routes' default visual state through user review.
  - [x] Complete desktop/mobile and interactive-state browser verification.
- [x] Batch 6 - Shared Cleanup and Regression Guard.
- [x] During each migration, preserve layout, responsive breakpoints, DOM structure, and behavior unless separately requested.
- [ ] Remove obsolete selectors after each page is migrated.

### Editorial Scoreboard M2 - Data Display

- [x] Consolidate the four read-only table scenarios around one Data Bay,
  compact-row, sortable-header, hover, and local-overflow contract.
- [x] Integrate Pagination into the owning Player Rankings and Match History
  modules while preserving the Match list's existing ownership.
- [x] Apply distinct Operational Neutral Other and Championship Gold Winner
  row semantics without adding new business states.
- [x] Consolidate Team and Player summaries into one responsive Ruled Grid.
- [x] Replace rounded character stars with a five-slot fractional rating and
  exact ten-point value; keep unavailable distinct from zero.
- [x] Verify desktop plus 560/680/760/980px behavior, keyboard focus,
  pagination boundaries, sort state, local table overflow, and no whole-page
  horizontal overflow.
- [x] Run frontend style literal checking, type checking, production build,
  diff checking, and browser console-error inspection.

### Editorial Scoreboard M3 - Team and Player Patterns

- [x] Consolidate Team artwork across Overview, Detail, and Editor preview with
  Open Artwork plus Neutral Frame initials fallback.
- [x] Migrate Teams Overview to Open Division Stacks and Score Ledger Team
  Cards without changing navigation or active-Team scope.
- [x] Migrate Team Detail to one Unified Field and Team Editor preview to
  Identity Proof while preserving archive, form, and roster behavior.
- [x] Migrate the four Statistic Leader Cards to Frosted Depth with
  category-specific Strong Glow and hover-only interaction.
- [x] Migrate Player Detail to Number Masthead, Segmented Performance Profile,
  and Honors Ledger without changing request or award-history behavior.
- [x] Verify loaded/failed artwork recovery, initials fallback, zero/partial
  meter states, award-time Team, 560/760/900/980px stacking, and no whole-page
  overflow.
- [x] Run frontend style literal checking, type checking, production build,
  diff checking, and browser console-error inspection.

### Editorial Scoreboard M4 - Event Patterns

- [x] Replace the filled Tier Crest with one compact/detail Tournament
  Insignia anatomy and parent-card-only interaction response.
- [x] Migrate Events Overview to Insignia Rail cards with Semantic Status,
  open Champion strip, quiet Team-count footer, and shape-preserving loading.
- [x] Migrate Event Detail to a 16-Team full-width ruled Participants roster,
  compact peer Tag sections, the existing Data Bay Results table, and one
  read-only Black Metal Player Awards Plaque; keep Champion lookup in the
  Final Team Results Winner row instead of duplicating it in the hero.
- [x] Migrate Event Create/Edit to no-eyebrow Page Header, Editorial Outline
  work areas, four/two/one-column checkbox roster, Data Entry ResultTag table,
  and disabled order boundaries.
- [x] Migrate Event Results & Awards framing, Team Results table, award counts,
  and shared controls without changing the existing Awards selection workflow.
- [x] Remove the unused participant-chip selector and legacy filled-crest,
  nested Champion, footer-status, and nested award-card selectors.
- [x] Verify 16-Team loaded scenarios, five/two/one-column awards reflow,
  560/760/980/1440px behavior, local table overflow, no whole-page overflow,
  keyboard semantics, and browser console output.
- [x] Run frontend style literal checking, type checking, production build,
  diff checking, and browser console-error inspection.

## Phase 5 - Prevent regression

- [x] Add a lint or CI check that flags new literal hex/rgb/hsl colors in frontend source outside approved token/theme files.
- [x] Add a check for new direct `font-family` and `border-radius` declarations outside approved token or shared-style files.
- [x] Maintain a short allowlist for genuinely dynamic values, data visualization colors, and third-party integration requirements.
- [ ] Require new shared visual patterns to reuse an existing primitive or explain why a new variant is needed.
- [x] Confirm new component libraries are not introduced solely to solve theming or styling consistency.

## Verification for each migration batch

- [x] Run frontend type checking.
- [ ] Run frontend tests.
- [x] Build the frontend.
- [x] Visually compare affected pages at desktop and mobile widths.
- [ ] Check default, hover, focus-visible, active, disabled, loading, validation, and destructive states where applicable.
- [x] Check table overflow and dense statistical displays.
- [x] Check text contrast and visible keyboard focus.
- [ ] Confirm no unrelated files or behaviors changed.

## Out of scope

- Changing page layout or component placement.
- Changing navigation or user flows.
- Rewriting business components solely for stylistic purity.
- Adding dark/light mode unless explicitly requested.
- Building a comprehensive design-system package or documentation site for the MVP.
- Replacing Mantine or adding another component library without a separate decision.
