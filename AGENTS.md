# Project Instructions

## Project Goal
This is a personal fantasy basketball box score and league statistics web app.
The MVP focuses on manual data entry, team/player/event/match management, and computed statistics.

## Development Principles
- Keep MVP features simple and avoid over-engineering.
- Prefer readable, maintainable code over clever abstractions.
- Do not implement future features unless explicitly requested.
- When uncertain, ask before making large design or schema decisions.

## Data Principles
- Store raw entities and match records in the database.
- Do not store averages or aggregate stats unless explicitly requested.
- Compute averages, totals, standings, and leaderboards from saved records.
- Different events may use different competition formats, so final event outcomes should be expressed through event-specific ResultTags rather than hard-coded global placement logic.
- ResultTag order represents outcome category order for display; avoid adding specific per-team rank logic unless explicitly requested.

## UI Principles
- Keep the admin UI clean, lightweight, and sports-console inspired.
- Use existing layout and visual patterns unless the task explicitly asks for redesign.
- Do not randomly introduce new component libraries.
- Treat `apps/frontend/src/styles/variables.css` as the canonical CSS design-token entry point.
- Use semantic tokens named by purpose (for example, text, surface, border, action, and status roles), not palette names tied to the current visual design.
- New or modified frontend code should not hard-code colors, font families, border radii, or repeated shadows when an appropriate token exists. Add or revise a semantic token when a genuinely shared role is missing.
- Keep Mantine theme values and CSS tokens aligned. Do not create an independent second theme inside page or feature code.
- Reuse shared styles or components for recurring buttons, form controls, cards/panels, tables, and status indicators. Do not recreate their complete visual treatment in page CSS.
- Page and feature CSS should primarily own layout, spacing, responsive behavior, and genuinely local presentation. Shared visual identity belongs in tokens, the Mantine theme, or shared components.
- Prefer incremental extraction based on repeated real usage; do not build speculative design-system abstractions for the MVP.
- Preserve component placement, interaction logic, and responsive behavior during visual-token migrations unless the task explicitly includes those changes.
- Follow `docs/UI_REDESIGN_READINESS_CHECKLIST.md` when migrating existing frontend styles or preparing a broad visual redesign.

## Workflow
- Before major schema or architecture changes, propose a short plan first.
- For each task, summarize changed files and important decisions.
- Avoid changing unrelated files.
