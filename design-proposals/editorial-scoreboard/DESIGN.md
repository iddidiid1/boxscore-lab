---
name: Editorial Scoreboard
status: experimental
basedOn: ../verge-dark-current/DESIGN.md
product: BoxScore Lab
---

# Editorial Scoreboard — Candidate Design System

## 1. Status and authority

This document records a **candidate UI direction** for BoxScore Lab. It is an
experiment, not the active project specification.

- The active design intent remains `docs/DESIGN.md`.
- The active implementation tokens remain
  `apps/frontend/src/styles/variables.css`.
- Values in this directory must not be copied into the application until the
  experiment has been reviewed and explicitly approved.
- When this candidate graduates, the approved intent is written to
  `docs/DESIGN.md` first, then mirrored into `variables.css` and the Mantine
  theme.

The current Verge Dark system remains the baseline. Editorial Scoreboard is a
focused evolution of that system rather than an unrelated visual reset.

## 2. Design thesis

**Cards without the boxiness.**

Editorial Scoreboard combines:

1. **Sports editorial hierarchy** — large display type, deliberate whitespace,
   clear section rhythm, and strong content ordering.
2. **Scoreboard clarity** — numerical data is immediate, aligned, and treated
   as the primary information rather than decorative metadata.
3. **Swiss data-grid discipline** — panels use hairline dividers and consistent
   alignment instead of nested containers.
4. **Restrained brand signaling** — acid mint is a precise signal, not a
   general-purpose glow or wash.

The intended result is a near-black sports console that feels authored and
data-driven, not like a generic admin dashboard with the same rounded card
repeated everywhere.

## 3. Principles

### 3.1 Quieter shells

- Default surfaces sit only one tonal step above the canvas.
- Borders are subtle white-alpha hairlines.
- Base cards use a tighter 8–12px radius range.
- Cards do not lift, translate, or gain drop shadows on hover.
- Hover feedback comes from a small surface change, a restrained border change,
  or a short accent cutline.

### 3.2 Mint is a signal

A normal card should assign mint to **one primary role**:

- key number;
- active/status dot;
- short cutline;
- selected control;
- primary action.

Do not combine a mint border, mint background wash, mint title, mint icon, and
mint number on the same ordinary card. Feature and visualization exceptions
must be documented separately.

### 3.3 Structure follows information type

The project does not use one universal card composition. The visual grammar
changes with the information:

| Information type | Preferred pattern |
|---|---|
| Team or player identity | Compact identity card |
| Event archive or historical list | Archive row |
| Match result or fixture | Horizontal scoreboard card |
| Aggregated statistics | Single data panel with internal dividers |
| Ranking or tabular comparison | Data grid or table row |
| Editorial highlight | Feature card |
| Tier, radar, or team identity color | Visualization frame |

### 3.4 One outer shell

Summary panels use one outer container. Individual statistics are separated by
dividers, alignment, and spacing—not nested cards with their own backgrounds,
borders, and radii.

### 3.5 Exceptions remain purposeful

The following effects are not flattened into the base card system:

- stat leader-card tint or gradient;
- Event Tier Crest gradient and tier accent;
- radar-chart layers;
- team colors supplied by data;
- event or match winner emphasis when it communicates a real outcome.

Each exception must remain narrow, named, and tied to a data or editorial
purpose.

## 4. Visual direction

### 4.1 Color

The existing near-black canvas and acid-mint brand color remain the foundation.
The experiment changes card contrast and accent usage more than the brand
palette itself.

**E0 candidate-system decision:** approved on 2026-07-17. These values govern
subsequent Editorial Scoreboard experiments, but remain separate from the active
application design system until the complete candidate system passes gate E2.

Approved candidate values:

| Candidate role | Value | Intent |
|---|---|---|
| Canvas | `#131313` | Neutral Black base |
| Card surface | `#1a1a1a` | Neutral Black surface |
| Card surface hover / raised | `#232323` | Neutral Black raised surface |
| Strong text | `#ffffff` | Current high-contrast primary text |
| Muted text | `#949494` | Current neutral metadata text |
| Card border | `rgba(255,255,255,0.075)` | Default hairline |
| Strong card border | `rgba(255,255,255,0.13)` | Feature or structural edge |
| Accent card border | Derived from brand mint | Restrained interactive feedback |
| Brand mint | `#43f2c8` | Deep Green Black mint paired with Neutral Black |

These are approved **candidate-system values**, not approved application tokens.

#### Approved Application Background System

Use **Neutral Ambient** above the approved Canvas base `#131313`. The background
adds two broad, low-contrast neutral-white light fields: approximately `6%` near
the upper-right content edge and `3.5%` near the lower-left. Their purpose is to
give translucent surfaces environmental variation without turning the canvas
gray or competing with page content.

Brand Mint is not part of the global background. Do not add a global grid,
noise texture, or decorative glow. Mint ambience may only be reconsidered as a
bounded local pattern in a later review.

Keep the ambient fields stable behind the content shell when pages scroll and
layouts reflow. If layered gradients are unavailable or intentionally reduced,
fall back to the flat `#131313` Canvas.

### 4.2 Typography

The current font roles remain:

- **Anton** — display titles, scores, leader values, editorial numbering;
- **Space Grotesk** — interface text and readable content;
- **JetBrains Mono** — numerical data, metadata, labels, statuses, and table
  columns.

The experiment should use typographic contrast before adding more surface
chrome.

### 4.3 Shape

Initial candidate radius model:

| Role | Candidate |
|---|---|
| Compact/archive treatment | `8px` |
| Base interactive card | `10px` |
| Large feature/visualization frame | `12–16px`, decided per pattern |
| Input/control | Keep current `4px` pending control review |
| Button/badge | `4px` Precise geometry |

The experiment does not assume that the existing 16px panel radius must remain
the universal card radius.

### 4.4 Depth and interaction

- No default drop shadows.
- No hover translation.
- No global mint glow.
- Use tonal surface layering and 1px borders.
- Interactive cards may reveal a short 2px cutline.
- Focus-visible treatment must remain stronger than hover treatment.
- Motion should be short and functional; exact duration tokens are not yet
  decided.

## 5. Candidate card grammar

### 5.1 Identity Card

Used for Team and potentially Player identity.

- compact logo/mark;
- name is the strongest text;
- division/team metadata is secondary;
- record and points share a divider-separated footer;
- dynamic team color may style the mark or cutline;
- mint is reserved for the primary system value or active state.

### 5.2 Archive Row

Used for Events and other historical collections.

- visually belongs to a continuous list;
- no independent rounded box required for every row;
- uses horizontal dividers and aligned metadata columns;
- status is compact and subordinate;
- hover may reveal a subtle directional mint wash or arrow;
- no decorative left rail by default.

### 5.3 Scoreboard Card

Used for Match list and result summaries.

- score occupies the visual center;
- team names sit on opposing sides;
- winner emphasis is semantic;
- event, stage, date, and status form a compact metadata rail;
- the card remains horizontal until the mobile breakpoint requires stacking.

### 5.4 Data Panel

Used for Team Summary, match aggregates, and similar statistic groups.

- one outer shell;
- optional identity/header region;
- statistics form a divider-separated grid;
- numerical columns use JetBrains Mono and tabular figures;
- mint marks one leading metric, not every positive value.

### 5.5 Feature Card

Used sparingly for leaders, MVP, or other editorial highlights.

- may use a documented tint or gradient;
- may use a larger display number;
- stronger composition is allowed because the card is intentionally rare;
- must not become the default treatment for ordinary list content.

### 5.6 Visualization Frame

Used for tier crests, radar charts, or data-driven team visuals.

- visualization color is allowed to carry meaning;
- shared outer chrome should remain quieter than the visualization;
- exceptions must map to named semantic or data tokens;
- decorative effects without data meaning are not permitted.

## 6. Component-system boundaries

This proposal distinguishes three levels:

### Foundation tokens

Global roles such as canvas, text, border, action, spacing, radius, focus, and
motion.

### Reusable components

Business-neutral controls and shells such as Button, Input, Badge, Tabs, Modal,
Table, Empty State, and base Panel.

### Product UI patterns

BoxScore Lab compositions such as Team Identity Card, Event Archive Row, Match
Scoreboard, Team Summary Panel, Stat Leader Card, and Tier Crest.

Product patterns may consume component tokens, but their information order and
layout are not tokens.

### 6.1 Approved action hierarchy

B03 approves a single Precise button family:

- Large actions are 42px high;
- Medium Section Header actions are 30px high;
- Small and Icon actions are 28px high on dense desktop layouts;
- all use the approved 4px control radius and shared typography/state grammar.

The family uses Outline hierarchy:

- Primary is the only solid Brand Mint action in its immediate group;
- Return/Cancel is a transparent neutral outline;
- Destructive is a restrained danger outline with a soft danger interaction
  surface;
- Related Workflow is a transparent, brand-derived outline with strong neutral
  text, Brand Mint icon and quiet mint-derived border, gaining Mint Soft only
  during interaction.

Related Workflow is a semantic role, not a new color family. Its component
roles map to existing strong-text and Brand Mint primitives. Ordinary command
buttons use momentary pressed feedback; persistent selected styling is reserved
for controls whose behavior genuinely owns a selected state.

Touch-first scenario validation may enlarge Medium, Small, or Icon targets
responsively without changing the approved dense-desktop hierarchy.

### 6.2 Approved navigation, links, and API Health

Primary Navigation preserves the current application geometry:

- full-width square-ended rows;
- 13px vertical and 22px horizontal padding;
- 18px icons;
- 2px Brand Mint current-route rail;
- quiet default text, raised-contrast hover, shared focus ring, momentary
  pressed feedback, and Brand Mint current-route treatment.

Detail Back Link uses a Brand Mint directional icon with a neutral text label.
Inline Text Link uses Brand Mint text with a persistent quiet underline that
strengthens on hover. Both use the shared keyboard focus treatment.

API Health remains a compact sidebar-footer composition. Online, Checking, and
Offline always include explicit text and a distinct dot or spinner form.
Checking motion slows under Reduced Motion.

### 6.3 Approved field, Select, and Filter Bar direction

The default field shell is 40px high with a 4px radius, near-black Inset
Control surface, neutral default boundary, stronger neutral hover boundary,
and Brand Mint focus/open boundary with a restrained outer ring.

Field anatomy is:

1. Sentence-case interface label and optional required marker;
2. control;
3. helper copy or field-associated error.

Select dropdowns are raised overlays. Hovered, selected, and disabled options
remain distinct; selected options use Mint Soft plus a checkmark.

Filter Bars use edge-highlight Dark Glass with 16px internal spacing. They
group same-level filters without turning each filter into a miniature card.
Filter and editor contexts consume the same field and Select primitives.

Date/Time uses the shared shell while retaining native `datetime-local`
behavior. Read-only fields remain legible but do not resemble enabled inputs.

### 6.4 Approved data-entry controls

Checkbox is an 18px Precise control. Checked uses a solid Brand Mint surface
with a dark checkmark; pressed remains momentary and disabled preserves the
stored boolean state.

Number Input uses the 40px regular field shell with vertical up/down steppers.
Match statistics tables may use the approved 34px Dense variant without
creating a separate statistics-only component.

Rating Slider uses a near-black track, Brand Mint filled bar, and solid Brand
Mint thumb. Its current numeric value remains visible independently of thumb
position.

Textarea inherits the approved field anatomy and near-black surface. It starts
at four rows, supports autosize growth, and shares focus, error, disabled,
read-only, and text-selection behavior with Single-line Text Field.

### 6.5 Approved status and tag direction

The shared Badge/Tag family uses **Neutral Gradient Edge Plate** by default:

- 4px Precise geometry;
- near-black compact plate;
- neutral directional gradient and restrained top highlight;
- 2px leading semantic edge;
- neutral primary text, with semantic color concentrated in the edge, icon, or
  dot rather than a broad tinted fill.

Completed is neutral rather than informational blue. Winner uses gold plus a
Trophy signal. Count completion uses Brand Mint plus a checkmark and is not
treated as an error.

**Open Marker** is an uncontained variant of the same family, not a separate
badge system. It may replace the plate only when a parent row, card, table cell,
or metadata rail already provides clear containment and the label is
subordinate inline metadata. It is not the default for counts, results,
winners, standalone tag groups, or floating placement.

Event Stage Tag is the roomier component and may wrap with supporting copy.
Compact Match Stage Badge uses the same visual grammar at dense scale and
truncates long labels with an accessible full label.

### 6.6 Approved loaded Logo Artwork direction

Loaded entity logos use an Open Artwork safe area rather than the fallback mark
frame:

- preserve the original aspect ratio with `contain`;
- never crop, stretch, recolor, or apply rounded clipping;
- do not add an outer border, glow, shadow, or decorative gradient;
- support Compact, Match, and Profile layout sizes without changing the source
  artwork.

Artwork contrast is independent of framing. Use Transparent for self-contained
or dark-background-compatible artwork. When black or dark lettering would
disappear against the near-black canvas, contrast belongs to the separate Logo
Stage component rather than a light backing attached to the artwork itself.

Missing or failed artwork uses **Neutral Frame + Initials Only**:

- derive short initials directly from the entity name;
- use the quiet complete Neutral Frame boundary;
- retain only its restrained short Team-color lower edge;
- do not add a generic crest, shield, image icon, glow, or directional trace;
- preserve legibility at Compact, Match, and Profile sizes.

Archived/historical state does not recolor, desaturate, fade, or otherwise alter
loaded Logo Artwork or the Initials fallback. The parent card, row, or detail
pattern owns the archived Status Badge and any subordinate text treatment so
identity remains recognizable.

### 6.7 Approved Compact Data

Stat Summary Panels use the approved edge-highlight Dark Glass Summary surface
with a **Ruled Grid**:

- organize repeated values with internal dividers rather than nested cells;
- preserve equal-width comparison where space permits;
- reflow Team's five values and Player's six values into readable rows;
- remove or reposition dividers at responsive row boundaries;
- do not add hover, pressed, selected, or focus styling to read-only cells.

Each Stat Value Cell uses **Label-first** order. The restrained data label
precedes its emphasized numeric value. Zero is a valid value; unavailable uses
an em dash with muted styling.

Read-only Team rating uses **five fractional stars**:

- map the 10-point rating across five stars, so one full star equals two rating
  points;
- support partial fill instead of rounding to whole stars;
- show the exact `x / 10` value alongside the stars and expose an equivalent
  accessible description;
- distinguish unavailable from a valid zero rating.

### 6.8 Approved Team Identity Surface

Team cards and related Team identity/media contexts use a complete content
surface that is materially brighter than the approved near-black Dark Glass
while remaining substantially darker than a light logo tile.

Logo Artwork and interface content sit directly on this surface; there is no
nested Team Logo Container. The candidate must define coordinated strong,
normal, muted, divider, and edge-highlight roles rather than changing only one
background literal.

Use Deep Light Glass at `40%` opacity over the approved Neutral Ambient
background. This is a restricted Team Identity Surface rather than a new
general-purpose panel:

- use it for the special Team card and directly related Team identity/media
  contexts;
- do not replace Data/Summary Dark Glass, Compact Fact, or Editor Outline;
- do not nest a separate light Team Logo Container inside it;
- require a non-blur fallback that preserves the effective contrast and
  hierarchy.

Any broader reuse requires another explicit component-level decision.

### 6.9 Approved shared table and pagination baseline

All established ranking, roster, match-history, and box-score scenarios share
one **Dark Glass Data Bay**:

- use one bounded edge-highlight Dark Glass region around the table;
- use `38px` Compact body rows;
- use a quiet tonal header, horizontal row dividers, and no vertical gridlines;
- align numeric columns to the end with tabular figures;
- apply a restrained neutral fill across the complete row on hover;
- do not imply clickability through hover alone; non-interactive rows retain the
  default cursor;
- add pointer, focus-visible, and pressed treatment only when the row has a real
  existing action.

Sortable headers reserve a stable direction-indicator slot. Active sort is a
persistent state with a visible ascending or descending arrow; changing
direction must not shift the header label or column width.

Columns remain semantically tabular at narrow widths. When they cannot fit,
horizontal overflow stays local to a viewport inside the Data Bay rather than
compressing content illegibly, clipping columns, or causing page-level
overflow.

Pagination is the final strip of the same Data Bay:

- preserve `Showing x–y of z`;
- reuse the approved compact Button family;
- mark the current page as persistent selection;
- disable Previous and Next at their respective boundaries;
- allow the summary and navigation group to stack without reducing control
  target size.

Loading and empty content will use the B07 feedback components inside this
approved shell.

Two table-row variants have deliberately unrelated semantics:

- **Other Statistics Entry Row — Operational Neutral:** use a restrained
  neutral alternate fill and neutral structural leading rail. Its hover
  treatment increases the same neutral separation while preserving the
  standard Number Input focus state. It must not resemble warning, error,
  disabled, selected, or Winner treatment.
- **Winner Result Row — Championship Gold:** use a restrained directional Gold
  outcome tint and leading trace. Always pair it with a Trophy icon and explicit
  result text such as `Champion`; preserve the treatment on hover. It must not
  reuse Brand Mint or the Other-row neutral role.

These variants share the Data Bay geometry, `38px` rhythm, columns, and
responsive viewport, but never share their semantic color tokens.

### 6.10 Approved feedback states

Persistent information, warning, error, and success feedback uses **Edge
Signal**:

- keep semantic color to a narrow leading rail, icon, and weak directional
  trace over a Dark Glass-compatible surface;
- pair every tone with an icon and explicit title/body copy;
- warning/read-only and error remain different roles;
- use success only for an established persistent-success need;
- optional actions reuse the approved Button or Inline Text Link families;
- stack the action beneath the copy when horizontal space is insufficient.

Empty States use **Open Content** within the module or panel whose missing
content they explain. Do not add a dashed or boxed nested field. Use a concise
icon, title, and supporting copy; add an action only when the user can resolve
the empty state. Filtered-empty may offer Clear filters, while a compact
historical section may remain actionless.

Loading components have separate responsibilities:

- use Skeleton when preserving the target component's approximate geometry
  materially improves continuity;
- use a labeled Spinner for bounded indeterminate work where shape preservation
  is unnecessary;
- set `aria-busy` on the affected region and retain still-operable content and
  filters during non-blocking refresh;
- under Reduced Motion, Skeleton becomes a static visible placeholder rather
  than pulsing.

Error / Retry retains the failed module's placement. Use the Error Edge Signal,
concise recovery copy, an associated Retry action, and an optional return link
when navigation is the useful alternative. A refresh failure preserves
previously successful content instead of replacing it with a blank initial
error.

### 6.11 Approved Confirmation Dialog

Use **Raised Dark Glass** for Confirmation Dialog because it represents a real
overlay layer above the application surface. Use the standard overlay shadow,
strong upper edge, `10px` dialog radius, and a width that fits narrow viewports
without clipping consequence copy.

Use **Trailing Pair** for actions:

- keep Cancel immediately before the named confirmation action;
- stack full-width actions on narrow screens;
- during confirmation, disable both actions and name the in-progress action;
- retain confirmation errors inside the open dialog without losing consequence
  context;
- trap focus while open and return it to the invoking control after close.

Archive, Void, and Discard use the Danger confirmation role. Restore is
consequential but not destructive, so it uses the normal important-action role.
Its leading symbol is a return/restore arrow rendered in Strong foreground over
a restrained Brand Mint field with a visible Mint boundary. Do not render a
thin low-contrast Mint glyph directly on the near-black surface.

## 7. Responsive and accessibility requirements

Every reviewed component or pattern must include:

- keyboard-visible focus;
- sufficient text and control contrast;
- a non-color-only signal for status or selection;
- desktop and mobile behavior;
- truncation and long-content handling;
- empty, loading, error, disabled, and destructive states where applicable;
- reduced-motion-safe behavior if animation is introduced.

Hover-only affordances are insufficient because the application must remain
usable on touch devices and with keyboard navigation.

## 8. Anti-patterns

- One universal 16px card for every information type.
- Cards nested inside cards to create hierarchy.
- Full mint outlines on every interactive surface.
- Mint used simultaneously as border, background, icon, title, and number.
- Drop shadows used as the default elevation mechanism.
- Replacing tables or archive rows with cards only for visual novelty.
- Flattening intentional leader, tier, radar, or team-color effects into the
  global card style.
- Introducing page-local literals when a confirmed shared semantic role exists.

## 9. Open decisions

The following are intentionally unresolved until reviewed in the UI System Lab:

- final surface and border values;
- final radius scale;
- selected versus hover treatment;
- focus-ring composition;
- motion duration and easing;
- table density and row height;
- mobile card transformations;
- which product patterns graduate to shared components;
- whether existing Event summary chrome should be retained or re-valued.

Decisions are tracked in `DECISION_LOG.md`; coverage and review status are
tracked in `UI_INVENTORY.md`.
