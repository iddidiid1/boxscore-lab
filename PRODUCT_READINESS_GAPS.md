# Product Readiness Gaps

## Purpose

This document records the remaining work between the completed BoxScore Lab MVP and a reliable, personally usable local product.

The target is a single-user, local application with no current deployment plan. Authentication, cloud infrastructure, and multi-user concerns are intentionally excluded unless added later for learning purposes.

## Priority 0: Required for Reliable Personal Use

### 1. Database Backup and Restore

Current risk: application data is stored in a single SQLite database without a documented backup and recovery workflow.

Required work:

- Add a `db:backup` command.
- Add a safe `db:restore` command.
- Add a `db:validate` or equivalent integrity-check command.
- Use timestamped backup filenames.
- Back up the active database before applying migrations.
- Document the active database location and recovery steps.

Acceptance criteria:

- A backup can be created without manually locating the SQLite file.
- A fresh or damaged local database can be restored from a selected backup.
- Restore refuses unsafe or ambiguous target paths.
- The restored application can load existing teams, events, matches, and statistics.

### 2. Formal Database Initialization

Current risk: playground, development, and personal-use databases are not presented as a clear operational workflow.

Required work:

- Define separate purposes for playground/smoke-test, development, and personal-use databases.
- Add an initialization command such as `pnpm app:init`.
- Validate the required environment variables.
- Generate Prisma Client and apply existing migrations.
- Create the database without depending on playground seed data.
- Optionally provide minimal initial configuration without sample league records.

Acceptance criteria:

- A new checkout can initialize an empty usable database through one documented workflow.
- Playground data is never required by the personal-use database.
- Re-running initialization does not destroy existing data.

### 3. Critical Automated Tests

Status (2026-07-04): **Deferred.** The owner has chosen to start using the app before investing in an
automated test suite. This is an accepted trade-off for a single-user local product: regression risk
is borne by the sole operator, who will notice failures directly. The section below is retained as the
intended coverage for when tests are added later. Until then, destructive operations (notably database
restore, see item 1) must compensate with strong guard rails and a documented manual verification
procedure.

Current risk: most confidence currently comes from TypeScript checks, style checks, and manual playground testing.

Minimum backend integration coverage:

- Team and roster creation/editing rules.
- Active-player jersey number uniqueness and inactive-number reuse.
- Team and Event archive behavior.
- Event status transitions.
- ResultTag reference and winner constraints.
- Event award limits and First/Second Team conflicts.
- Match create/edit validation.
- Match void and restore behavior.
- Historical data preservation.
- Runtime player statistics and team-points calculations.

Minimum browser smoke coverage:

- Create or edit a Team and roster.
- Create an Event and configure participants/tags.
- Record and edit a Match.
- Enter Event results and awards.
- Verify the main Teams, Players, Matches, and Events detail views load.

Acceptance criteria:

- Critical business rules run in automated tests against an isolated database.
- Tests never mutate the personal-use or playground database.
- One command runs all required verification before a release checkpoint.

### 4. Production-Like Local Run Workflow

Current risk: the main documented workflow uses development servers.

Required work:

- Add a root `build` command.
- Add a documented local `start` command for built frontend/backend assets.
- Provide a convenient Windows launch workflow.
- Ensure direct SPA routes work when the built application is served.
- Report startup failures clearly when the database or environment is unavailable.

Acceptance criteria:

- BoxScore Lab can be built and started without Vite development mode.
- One documented command or script launches the local application.
- Direct URLs such as `/events/:slug` and `/matches/:id` load correctly.

## Priority 1: High-Value Product Hardening

### 5. Unsaved-Changes Protection

Required work:

- Track dirty state on Team, Match, Event, and Event Outcomes forms.
- Warn before browser navigation, Cancel, or page close when unsaved changes exist.
- Clear dirty state after a successful save.

Acceptance criteria:

- Accidental navigation cannot silently discard substantial form input.
- No warning appears when the form is unchanged or successfully saved.

### 6. Data Export

Required work:

- Provide a complete JSON export of raw application records.
- Provide CSV export for Match box scores.
- Provide CSV export for computed Team and Player statistics where useful.
- Keep exported aggregates derived from stored raw records.

Acceptance criteria:

- Personal data can be inspected outside the application.
- Export does not introduce persisted aggregate fields.
- Exported files clearly identify their schema/version or generation date.

### 7. README and Brand Documentation

Current issue: the README still uses the former Fantasy League Stats name and contains descriptions that no longer fully match current behavior.

Required work:

- Rename the product documentation to BoxScore Lab.
- Describe the actual implemented MVP scope.
- Correct points/ranking descriptions to match runtime calculations.
- Document installation, initialization, start, backup, restore, and validation commands.
- Explain the difference between playground, development, and personal-use databases.
- Add common troubleshooting steps.

Acceptance criteria:

- A future maintainer can run and recover the application using the README alone.
- Documentation does not contradict current business rules or branding.

### 8. End-to-End Acceptance Pass

Required manual acceptance flow:

1. Create a Team and roster.
2. Create an Event.
3. Configure participants, Match Stage Tags, and Result Tags.
4. Create and edit a Match.
5. Void and restore a Match.
6. Enter final Event results and player awards.
7. Complete the Event.
8. Verify Teams, Players, Matches, and Events list/detail pages.
9. Archive a Team and Event and verify historical records remain readable.
10. Back up and restore the database, then verify the same records again.

Acceptance criteria:

- The full workflow completes without direct database edits.
- Expected failures produce actionable UI errors.
- Archived and historical data remains intact.
- A short acceptance report records results and known limitations.

## Product Decision (Resolved)

### Event Award Completeness

Decision (2026-07-04): keep the current behavior in code. Award validation continues to enforce
only upper bounds:

- Event MVP: at most 1.
- All-Event First Team: at most 5.
- All-Event Second Team: at most 5.

The stricter "exact counts" proposal (exactly 1 MVP, exactly 5 First Team, and a Second Team of
either 0 or exactly 5, enforced at Event completion) is **deferred to future work**, recorded in
`docs/future/AwardCompleteness.md`. It will only be implemented if moved into an approved PRD, at
which point the Backend PRD, Frontend PRD, validation, UI feedback, and automated tests must be
updated together.

## Explicit Non-Goals

The following are not required for the current personally usable local product:

- Authentication or registration.
- Roles and permissions.
- Multi-user or multi-tenant support.
- Cloud deployment.
- Docker, Kubernetes, or infrastructure automation.
- Hosted monitoring and alerting platforms.
- Automatic scheduling or tournament brackets.
- Automatic event-format logic beyond existing ResultTags.
- A speculative general-purpose design-system library.
- Complex caching or distributed systems.

## Suggested Completion Order

1. Resolve the Event award completeness decision. (Resolved — see Product Decision above.)
2. Implement database backup, restore, and integrity validation.
3. Implement formal database initialization.
4. Add critical backend integration tests. (Deferred — see item 3.)
5. Add one end-to-end browser smoke flow. (Deferred — see item 3.)
6. Add build and local start workflows.
7. Update README and operating documentation.
8. Add unsaved-changes protection and exports.
9. Run and record the final acceptance pass.

## Product-Ready Definition

BoxScore Lab can be considered a reliable personal local product when:

- A clean checkout can be initialized and started through documented commands.
- Personal data can be backed up, validated, and restored.
- Critical business rules are protected by automated tests. (Deferred — see item 3; not required for the current personal-use milestone.)
- The main user workflow passes end-to-end acceptance without database intervention.
- Documentation matches the current product name, behavior, and operating procedures.
