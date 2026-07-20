# Editorial Scoreboard Token Mapping

## Status

This is the production-token contract approved at Gate E2 and applied during
M0 on 2026-07-20. The active `variables.css` and Mantine theme now mirror its
shared foundation roles. Pattern-local values continue to graduate only in
their approved migration batches.

Token names describe purpose, not the current palette. Pattern-local visual
roles remain local unless repeated production usage proves that they should
graduate.

## Foundation colors

| Proposed production token | Candidate value | Active relationship | Purpose |
|---|---:|---|---|
| `--color-canvas` | `#131313` | retain | Main content canvas |
| `--color-app-shell` | `#0d0d0d` | retain | Application shell outside content |
| `--color-navigation` | `#0d0d0d` | retain | Sidebar surface |
| `--color-surface` | `#1a1a1a` | retain | Default panel material |
| `--color-surface-raised` | `#232323` | retain | Raised and interactive contrast |
| `--color-surface-control` | `#0d0d0d` | retain | Form-control surface |
| `--color-surface-inset` | `#0d0d0d` | retain | Open Well and recessed regions |
| `--color-surface-glass` | `rgba(26, 26, 26, 0.82)` | add | Edge-highlight Dark Glass base |
| `--color-surface-identity` | `rgba(53, 58, 55, 0.40)` | add | Restricted Team Identity Deep Light Glass |
| `--color-surface-overlay` | `rgba(35, 35, 35, 0.94)` | add | Dialog/dropdown layering |
| `--color-text-strong` | `#ffffff` | retain | Titles and strongest values |
| `--color-text` | `#ffffff` | retain | Default readable copy |
| `--color-text-soft` | `#c8c8c8` | retain | Supporting copy |
| `--color-text-muted` | `#949494` | retain | Metadata and labels |
| `--color-text-disabled` | `rgba(148, 148, 148, 0.52)` | replace | Disabled text without disappearing |
| `--color-text-on-accent` | `#000000` | retain | Text on solid Brand action |
| `--color-brand` | `#43f2c8` | replace old mint | Core brand signal |
| `--color-brand-hover` | `#2ccfaa` | retain value/new role | Solid Brand action hover |
| `--color-brand-soft` | `rgba(67, 242, 200, 0.10)` | replace old mint alpha | Selected/local Brand wash |
| `--color-brand-soft-hover` | `rgba(67, 242, 200, 0.16)` | replace old mint alpha | Brand-derived hover wash |
| `--color-brand-border` | `rgba(67, 242, 200, 0.45)` | replace old mint alpha | Brand-derived structural edge |
| `--color-brand-border-subtle` | `rgba(67, 242, 200, 0.20)` | replace old mint alpha | Quiet Brand trace |

The Team Identity value is intentionally much brighter than ordinary dark
surfaces. It is restricted to the approved Team identity/card context and must
not become a generic light panel.

## Borders, focus, and interaction

| Proposed production token | Candidate value | Active relationship | Purpose |
|---|---:|---|---|
| `--color-border-subtle` | `rgba(255, 255, 255, 0.075)` | replace | Quiet surface edge and divider |
| `--color-border` | `rgba(255, 255, 255, 0.13)` | replace | Structural edge |
| `--color-border-hover` | `rgba(255, 255, 255, 0.19)` | replace | Neutral hover separation |
| `--color-border-control` | `rgba(255, 255, 255, 0.14)` | retain | Default field edge |
| `--color-border-control-hover` | `rgba(255, 255, 255, 0.19)` | replace | Neutral field hover |
| `--color-focus-ring` | `rgba(67, 242, 200, 0.88)` | replace | Shared keyboard focus |
| `--focus-ring-width` | `2px` | add | Focus-visible geometry |
| `--focus-ring-offset` | `3px` | add | Prevent clipped/ambiguous focus |
| `--color-hover-surface` | `rgba(255, 255, 255, 0.04)` | retain | Neutral hover |
| `--color-active-surface` | `rgba(67, 242, 200, 0.08)` | replace old mint alpha | Persistent selected/current state |
| `--color-table-row-hover` | `rgba(255, 255, 255, 0.03)` | retain | Full-row scan hover |

Hover, pressed, selected, and focus-visible remain distinct states. Persistent
selected styling is used only by controls that actually own selection.

## Semantic states and outcome roles

| Proposed production token | Candidate value | Active relationship | Purpose |
|---|---:|---|---|
| `--color-status-online` | `#43f2c8` | map to Brand | API online/success where appropriate |
| `--color-status-checking` | `#ffb95f` | add semantic alias | Pending/checking |
| `--color-status-offline` | `#ff6b6b` | add semantic alias | Offline/error |
| `--color-warning` | `#ffb95f` | retain | Warning |
| `--color-danger` | `#ff6b6b` | retain | Destructive/error |
| `--color-danger-strong` | `#ef4444` | retain | Strong danger |
| `--color-danger-border` | `rgba(255, 107, 107, 0.45)` | retain | Danger edge |
| `--color-danger-surface` | `rgba(255, 107, 107, 0.10)` | retain | Danger trace |
| `--color-outcome-winner` | `#ffb95f` | add alias | Championship Gold signal |
| `--color-outcome-winner-border` | `rgba(255, 185, 95, 0.45)` | rename | Winner structural trace |
| `--color-outcome-winner-surface` | `rgba(255, 185, 95, 0.08)` | rename | Winner row/strip tint |
| `--color-row-operational-surface` | `rgba(255, 255, 255, 0.045)` | add | Match-entry Other row |
| `--color-row-operational-border` | `rgba(255, 255, 255, 0.19)` | add | Other-row leading rail |

Brand Mint, success/online, and Championship Gold may share nearby visual
energy but retain separate semantic names. The Other row never uses warning,
danger, selected, or winner roles.

## Typography, shape, spacing, and motion

| Proposed production token | Candidate value | Active relationship |
|---|---:|---|
| `--font-family-display` | `"Anton", Impact, "Arial Narrow", sans-serif` | retain |
| `--font-family-body` | `"Space Grotesk", "Hanken Grotesk", ui-sans-serif, system-ui, sans-serif` | retain |
| `--font-family-heading` | same as Body | retain |
| `--font-family-data` | `"JetBrains Mono", ui-monospace, SFMono-Regular, Consolas, monospace` | retain |
| `--space-1` / `2` / `3` / `4` / `6` / `8` / `12` | `4/8/12/16/24/32/48px` | add |
| `--radius-control` | `4px` | retain |
| `--radius-compact` | `8px` | add |
| `--radius-interactive` | `10px` | replace 16px card role |
| `--radius-panel` | `12px` | replace |
| `--radius-overlay` | `10px` | add |
| `--duration-fast` | `100ms` | add |
| `--duration-standard` | `160ms` | add |
| `--duration-slow` | `220ms` | add |
| `--easing-functional` | `ease-out` | add consolidation default |
| `--control-height-large` | `42px` | add |
| `--control-height-default` | `40px` | add |
| `--control-height-dense` | `34px` | add |
| `--control-height-medium` | `30px` | add |
| `--control-height-small` | `28px` | add |
| `--table-row-height-compact` | `38px` | add |

The spacing scale supplies repeatable rhythm; page and component layout remain
owned by their consuming CSS. `--radius-pill`, 20px chips, and 24px button
radii are not part of the candidate language.

## Responsive and background roles

| Proposed production token | Candidate value | Active relationship |
|---|---:|---|
| `--breakpoint-compact` | `560px` | document/build-time role |
| `--breakpoint-narrow` | `760px` | document/build-time role |
| `--breakpoint-intermediate` | `980px` | document/build-time role |
| `--background-ambient-upper` | neutral white at approximately `6%` | add |
| `--background-ambient-lower` | neutral white at approximately `3.5%` | add |

CSS custom properties cannot be used directly in every media-query condition,
so breakpoint values may be mirrored through the build layer or documented
constants. Neutral Ambient falls back to the flat Canvas under reduced
transparency or when layered backgrounds are unavailable.

## Pattern-local roles

These roles are allowed but should remain beside the owning shared component or
feature until repeated usage justifies promotion:

- Statistic Leader category tint and stronger hover-only category Glow;
- Team-color traces and Player Number Masthead Outline Echo;
- Tournament Insignia S/A/B/C accents and ceremonial material;
- Black Metal Plaque grain, cut corner, registration marks, and award trace;
- Segmented Meter interval geometry;
- Event Insignia Rail and Champion strip geometry;
- Scoreline Rail and Arena Scoreline layout traces;
- Read-only Star partial-fill mask;
- radar/chart guides and data-driven visualization colors.

Tier semantics remain S Championship Gold, A ultraviolet, B Brand Mint, and C
neutral. Pattern-local roles must still consume foundation text, focus, and
Reduced Motion rules.

## Mantine alignment

The formalized Mantine theme:

- use Brand `#43f2c8` at the selected primary shade;
- map `xs/sm/md/lg` radii to the approved `4/8/10/12px` hierarchy;
- stop defaulting Button to pill radius;
- preserve Space Grotesk and JetBrains Mono assignments;
- expose component defaults only where they match the shared CSS primitive.

The CSS token file remains canonical. The Mantine theme is a typed mirror, not
an independent palette.
