# UI Redesign Readiness Checklist

## Goal

Make future visual redesigns, especially changes to color, typography, radius, borders, and elevation, possible without changing page layout, component placement, or business logic.

This is an incremental maintainability task, not a request to redesign the current UI. Existing pages should keep their current appearance while they are migrated.

## Completion criteria

- [ ] Global colors, typography, radii, borders, and elevation are defined through semantic design tokens.
- [x] Mantine and project CSS consume the same design decisions instead of maintaining separate values.
- [ ] Shared controls and surfaces own their visual styling.
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

- [ ] Make the existing action-button styles the single implementation for primary, secondary, quiet, and danger actions.
- [ ] Remove page-specific button styles that duplicate shared button variants.
- [x] Introduce a lightweight shared panel/card style for recurring border, background, and radius behavior.
- [x] Introduce shared form-control styling for text inputs, selects, number inputs, and textareas where Mantine defaults are insufficient.
- [ ] Introduce shared table styling for recurring header, cell, divider, hover, and scroll-container behavior.
- [ ] Consolidate status badge/chip styling around semantic states rather than page-specific colors.
- [ ] Keep shared primitives small; do not introduce a component abstraction for a pattern used only once.

## Phase 4 - Migrate existing styles incrementally

- [x] Replace literal colors, font stacks, radii, and repeated shadows in `styles/global.css` with tokens.
- [ ] Migrate `ManageTeamPage.css` first because it contains extensive control and button duplication.
- [ ] Migrate `PlayersPage.css` and its statistic accent handling.
- [ ] Migrate `MatchDetailPage.css`.
- [ ] Migrate `MatchesPage.css`.
- [ ] Migrate `TeamDetailPage.css`.
- [ ] Migrate `PlayerDetailPage.css`.
- [ ] Migrate event page and event component styles.
- [ ] Migrate `CreateMatchPage.css`.
- [ ] Migrate `TeamsPage.css`.
- [ ] Migrate shared component styles.
- [ ] During each migration, preserve layout, responsive breakpoints, DOM structure, and behavior unless separately requested.
- [ ] Remove obsolete selectors after each page is migrated.

## Phase 5 - Prevent regression

- [ ] Add a lint or CI check that flags new literal hex/rgb/hsl colors in frontend source outside approved token/theme files.
- [ ] Add a check for new direct `font-family` and `border-radius` declarations outside approved token or shared-style files.
- [ ] Maintain a short allowlist for genuinely dynamic values, data visualization colors, and third-party integration requirements.
- [ ] Require new shared visual patterns to reuse an existing primitive or explain why a new variant is needed.
- [ ] Confirm new component libraries are not introduced solely to solve theming or styling consistency.

## Verification for each migration batch

- [x] Run frontend type checking.
- [ ] Run frontend tests.
- [x] Build the frontend.
- [ ] Visually compare affected pages at desktop and mobile widths.
- [ ] Check default, hover, focus-visible, active, disabled, loading, validation, and destructive states where applicable.
- [ ] Check table overflow and dense statistical displays.
- [ ] Check text contrast and visible keyboard focus.
- [ ] Confirm no unrelated files or behaviors changed.

## Out of scope

- Changing page layout or component placement.
- Changing navigation or user flows.
- Rewriting business components solely for stylistic purity.
- Adding dark/light mode unless explicitly requested.
- Building a comprehensive design-system package or documentation site for the MVP.
- Replacing Mantine or adding another component library without a separate decision.
