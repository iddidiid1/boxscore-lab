# Team Logo Assets

This document is the canonical reference for how team logos are stored, referenced,
validated, and displayed. It covers the move from remote-URL-only logos to
committed local logo assets (primarily real NBA team logos in PNG).

**Status**: Agreed design for the `feat/team-logo-local` work (2026-07-06). Parts
still pending implementation are marked _(planned)_.

## Storage Model

- Logos are referenced by the existing `Team.logoUrl String?` field. **No schema
  change** — the field name is kept even though the value may now be a local path.
- The value is either:
  1. A **site-relative path** to a committed asset, e.g. `/logos/celtics.png` (preferred), or
  2. A legacy absolute **HTTP/HTTPS URL**, e.g. `https://example.com/logo.png` (still accepted for backward compatibility).
- An empty value (`null` or empty string) means "no logo" and triggers the fallback (see [Display Rules](#display-rules)).

Points and other computed values are unaffected — this is purely a display asset.

## Asset Location & Naming

- Local logo files live in `apps/frontend/public/logos/` and are served as static
  assets by Vite (dev) and from the built `dist/` (production) — no upload endpoint
  or backend file storage is involved.
- They are **user-provided and gitignored — NOT committed to the repository.** Real
  NBA / trademarked logos are not redistributed through this public repo. Only
  `.gitkeep` and `README.md` in that folder are tracked; every `*.png` is ignored.
  Provide your own copies locally (see `apps/frontend/public/logos/README.md`).
- Format: **PNG** (transparent background expected).
- File names use **kebab-case**, short and stable, e.g. `celtics.png`, `lakers.png`.
  Avoid long auto-generated names — the path is entered/selected by hand.

**Tradeoff**: Because assets are gitignored and bundled at build time, a fresh
clone or deploy must place the PNGs manually, and adding or replacing a logo
requires a frontend rebuild (`pnpm build`). Acceptable for a personal, single-user
app that must not ship trademarked assets.

## Accepted Values & Backend Validation

`Team.logoUrl` is validated in `apps/backend/src/modules/teams/teams.service.ts`.

- Max length: **2,048 characters**.
- Must match **either** an absolute HTTP/HTTPS URL **or** a site-relative path
  beginning with `/`:

  ```
  ^(https?:\/\/\S+|\/[^\s?#]+)$
  ```

- `null` or empty string clears the field.

This **supersedes** the "must be a valid HTTP/HTTPS URL" rule in
`docs/prd/TeamRosterManagementBackendPRD.md` (validation table). That PRD line
should be updated to reference this document.

## Display Rules

NBA logos are frequently **not 1:1** (they may be wide, tall, or contain internal
padding). To avoid cropping or distortion:

- Logo `<img>` elements use **`object-fit: contain`** (not `cover`) inside a fixed
  **square** box, with **no extra padding** on the box, so any aspect ratio renders
  complete and as large as the box allows. The logo's longer edge fills the box and
  the other axis is centered automatically:
  - Wide logo (width > height): width fills the box, centered vertically.
  - Tall logo (height > width): height fills the box, centered horizontally.
  - `contain` does this per image — no width/height branching or JS measurement is
    needed, and a very wide logo (e.g. Spurs) is legitimately short in a square box.
- This applies wherever a team logo is shown: team cards, team detail, the team
  editor preview, and the **match detail team summary** (`MatchTeamSummary`). The
  match **list** (`MatchRecordCard`) intentionally shows only a color bar + team
  name and displays **no logo**.
- Sizing tokens (e.g. `42×42px`, `border-radius: 10px` inside team cards) are
  defined in `docs/DESIGN.md` and are unchanged by this document.

### Fallback

When `logoUrl` is empty (or the image fails to load), teams render an initials
fallback tinted with `primaryColor` (kept at accessible contrast). See the team
components and `docs/prd/TeamRosterManagementFrontendPRD.md`.

## Adding a New Logo

1. Drop the PNG into `apps/frontend/public/logos/` with a kebab-case name.
2. In Team create/edit, set the logo value to the site-relative path, e.g.
   `/logos/celtics.png`.
3. Rebuild the frontend (`pnpm build`) so production serves the new asset.

## Related Documents

- `docs/DESIGN.md` — logo sizing tokens and component specs.
- `docs/prd/TeamRosterManagementBackendPRD.md` — team mutation API and validation (logo validation line superseded here).
- `docs/prd/TeamRosterManagementFrontendPRD.md` — logo display, preview, and fallback behavior.
- `docs/SCHEMA_DESIGN.md` — `Team.logoUrl` field description.
