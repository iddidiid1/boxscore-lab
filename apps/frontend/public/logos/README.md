# Team Logo Assets (user-provided)

This folder holds team logo images served as static assets (e.g. `/logos/celtics.png`).

**These files are gitignored and intentionally NOT committed.** NBA / other real
team logos are trademarked and are not redistributed through this public repository.
Provide your own copies locally.

## How to add logos

1. Drop a **PNG** (transparent background preferred) into this folder using a short
   **kebab-case** name, e.g. `celtics.png`, `lakers.png`, `trail-blazers.png`.
2. In Team create/edit, set the logo value to the site-relative path, e.g.
   `/logos/celtics.png`.
3. Run `pnpm build` so the production build (`dist/`) includes the new asset.

Any aspect ratio is fine — logos render with `object-fit: contain` inside a square
box, so wide/tall logos are shown complete (not cropped). See
`docs/TEAM_LOGO_ASSETS.md` for the full storage, validation, and display rules.

Only `.gitkeep` and this `README.md` are tracked; every `*.png` here is ignored.
