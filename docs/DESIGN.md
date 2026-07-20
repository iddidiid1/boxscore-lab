---
name: Editorial Scoreboard
product: BoxScore Lab
status: active
approved: 2026-07-20
---

# Editorial Scoreboard Design System

## 1. Design intent

BoxScore Lab uses a near-black, sports-editorial console language. Numerical
data is immediate and aligned; typography and dividers establish hierarchy
before additional containers are introduced.

The system is guided by four ideas:

1. **Sports editorial hierarchy** — large display type, deliberate whitespace,
   and clear content order.
2. **Scoreboard clarity** — scores and statistical values are primary
   information rather than decorative metadata.
3. **Data-grid discipline** — one outer shell and internal rules replace nested
   cards.
4. **Restrained Brand signaling** — Mint is a precise signal, not a global glow
   or wash.

The goal is an authored, modern sports console rather than a generic dashboard
made from one repeated rounded card.

`apps/frontend/src/styles/variables.css` is the canonical implementation-token
entry point. This document owns design intent; the CSS tokens and Mantine theme
must remain aligned with it.

## 2. Foundation

### 2.1 Color and surfaces

| Semantic role | Value | Use |
|---|---:|---|
| Canvas | `#131313` | Main content background |
| Deep shell | `#0d0d0d` | Navigation and inset fallback surfaces |
| Surface | `#1a1a1a` | Default dark material |
| Raised surface | `#232323` | Overlays and stronger separation |
| Dark Glass | `rgba(26,26,26,0.82)` | Data and Summary contexts |
| Team Identity surface | `rgba(53,58,55,0.40)` | Restricted Deep Light Glass |
| Strong/default text | `#ffffff` | Titles, body, and primary values |
| Soft text | `#c8c8c8` | Supporting readable content |
| Muted text | `#949494` | Metadata, labels, placeholders |
| Brand | `#43f2c8` | Primary action and precise Brand signal |
| Brand hover | `#2ccfaa` | Solid Brand hover |
| Warning | `#d8cf70` | Warning and checking |
| Danger | `#ff6b6b` | Error, offline, and destructive action |
| Championship Gold | `#d8cf70` | Winner and MVP outcome meaning |
| Event Results Winner | `#d8cf70` | Final Team Results Champion row |

Brand Mint normally occupies one primary role in an ordinary component: primary
action, selected state, short trace, active indicator, or key number. Do not
combine Mint border, wash, title, icon, and number on the same ordinary
surface.

Brand, success/online, and outcome roles keep separate semantic token names even
when they share a value. The meaning belongs to the token, not the palette.

### 2.2 Application background

Use **Neutral + Brand Ambient** over the Canvas:

- broad neutral-white light at approximately 6% near the upper-right content
  edge;
- a second neutral-white field at approximately 3.5% near the lower-left;
- a restrained Brand Mint field at 8% near the upper-right and 3% near the
  lower-left;
- no full-canvas Mint tint, grid, noise, or pulsing light.

The Brand fields are environmental accents, not a green Canvas fill. The
ambient layers stay stable behind scrolling content and remain visible through
the transparent Main Content Shell. Fall back to the flat Canvas when layered
backgrounds or transparency are reduced.

### 2.3 Typography

- **Anton** — functional page titles, scores, leader values, and editorial
  numbering. Never use it below 24px.
- **Space Grotesk** — interface, controls, headings, and readable content.
- **JetBrains Mono** — statistics, scores, metadata, labels, statuses, and
  table data. Use tabular figures where comparison matters.

The shared hierarchy is Display, Heading, Body, Control, Metadata, and Data.
Decorative Page Eyebrows are not part of the system.

### 2.4 Spacing and density

Use the shared `4/8/12/16/24/32/48px` spacing scale. Consuming layouts own their
composition, but repeated gaps and internal rhythm should use these steps.

Approved density anchors:

- Large page action: 42px;
- regular field: 40px;
- dense Number Input: 34px;
- Medium section action: 30px;
- Small/Icon action: 28px;
- Table header: 38px; body row baseline: 46px.

### 2.5 Shape

| Role | Radius |
|---|---:|
| Control, Button, Badge, Tag | `4px` |
| Compact surface or inset | `8px` |
| Interactive card or overlay | `10px` |
| Standard panel | `12px` |

Pill buttons, universal 16px cards, 20px chips, and 24px button radii are not
part of Editorial Scoreboard. A circle may still use `999px` where the geometry
is intrinsically circular, such as a status dot or spinner.

### 2.6 Borders, depth, and focus

- subtle hairline: `rgba(255,255,255,0.075)`;
- structural edge: `rgba(255,255,255,0.13)`;
- neutral hover edge: `rgba(255,255,255,0.19)`;
- no generic card drop shadow;
- overlay shadows are permitted only when real layering requires them;
- focus-visible uses a 2px Brand ring at 88% opacity with a 3px offset.

Focus-visible must be stronger than hover and must not be clipped by overflow.
Color is never the only semantic or selection signal.

### 2.7 Motion and Reduced Motion

Use functional durations of 100ms, 160ms, and 220ms with an `ease-out`
consolidation default. Interaction feedback must not create layout shift or
delay keyboard/touch response.

Lift, noticeable scale, glow, and pulse are not generic defaults. A named
Pattern may use a locally approved effect. Under `prefers-reduced-motion:
reduce`, remove non-essential transitions, skeleton pulse, and checking
rotation; preserve immediate visible state changes.

### 2.8 Responsive model

- Compact: `≤560px`;
- Narrow: `≤760px`;
- Intermediate: `≤980px`;
- Wide: `>980px`.

Reflow and stacking are preferred before horizontal scrolling. Horizontal
overflow is reserved for irreducible tabular data and must remain local to its
Data Bay.

## 3. Surface and hierarchy system

### 3.1 Contextual surfaces

- **Editor → Editorial Outline:** precise structural outline with restrained
  dark content field.
- **Data and Summary → edge-highlight Dark Glass:** translucent dark material
  with a restrained upper/side highlight.
- **Inset Panel → Open Well:** recessed near-black area without a second outer
  outline.
- **Compact Fact → Inline Fact:** label/value metadata without a surrounding
  miniature card.
- **Team Identity → Deep Light Glass:** 40% `rgb(53 58 55)` glass with neutral
  highlight, restricted to Team identity/card contexts.

**Open Section** is a deliberate hierarchy exception, not the default panel.
**Feature Gradient** is Pattern-only. Solid Tonal and Dark Neumorphism are not
approved base materials.

### 3.2 Page hierarchy

Overview/List and Create/Edit pages use a Functional Page Header:

- Anton functional title;
- one concise description;
- optional page action aligned right;
- full structural bottom divider;
- no decorative eyebrow;
- stacked layout below 760px.

Detail pages do not use the Functional Page Header. They begin with the Detail
Back Link, entity-specific identity, and page actions.

Section Headers use a full subtle divider and may include a description, count,
metadata, or one Medium contextual action.

### 3.3 One outer shell

Summary and data modules use one outer container. Dividers, alignment, and
spacing organize internal values. Do not create hierarchy through cards nested
inside cards.

## 4. Navigation and actions

### 4.1 Navigation

Preserve the current Sidebar structure and Brand Header. The vertical Primary
Navigation item keeps its square row, 2px current-route rail, and explicit
Hover, Focus, Pressed, and Current states.

API Health presents explicit **Online**, **Checking**, or **Offline** text with
a corresponding dot/spinner form. Checking becomes static under Reduced Motion.

The Detail Back Link is a distinct navigation component: Brand directional icon
plus neutral text. Inline Text Links use Brand text and a persistent
low-contrast underline.

### 4.2 Button family

All actions use one Precise 4px family:

- **Primary:** solid Brand; Save, Create, and page-level constructive action.
- **Cancel/Exit:** transparent neutral outline; Create/Edit pages use the
  visible label `Cancel`.
- **Destructive:** restrained Danger outline; Archive, Void, Delete, or Remove.
- **Related Workflow:** Brand-derived outline for actions such as Manage
  Results; it does not introduce a new hue.
- **Medium Context:** compact section-level action.
- **Small Edit:** dense row/item edit action.
- **Small Destructive:** dense row/item destructive action.
- **Order Icon:** 28px directional icon control.

Persistent selected styling is used only when the control owns a real selected
state. Every interactive action defines Default, Hover, Focus-visible, Pressed,
Disabled, and Loading where applicable.

## 5. Forms and filtering

- Text, Select, Number, and Textarea controls use near-black surfaces, 4px
  radius, neutral hover, and the shared focus ring.
- Default field height is 40px.
- Checkbox is an 18px Filled control with a solid Brand checked state.
- Number Input retains visible up/down steppers; data-entry tables may use the
  34px dense variant.
- Rating Slider uses a 34px control area and solid thumb.
- Native Date/Time input behavior remains native.
- Validation uses an associated message and semantic signal, never color alone.

Filter Bars use a weak but visible edge-highlight Dark Glass grouping with 16px
internal spacing. Same-level filter fields are not individually carded. Editor
Selects and Filter Selects share the same primitive.

## 6. Tags, identity, and compact data

### 6.1 Badge and Tag language

The default compact treatment is a **Neutral Gradient Edge Plate**:

- 4px geometry;
- near-black plate with a neutral directional highlight;
- restrained top highlight and 2px semantic leading edge;
- label and/or icon provides a non-color signal.

The plate keeps a rectangular 4px silhouette. Cut-corner, complete outline, and
soft semantic-fill variants are not part of the shared Badge/Tag language.
Semantic color stays concentrated in the leading edge, icon, or dot; ordinary
label text remains neutral.

An **Open Marker** may be used as a contained-inline exception. Event Stage Chip
is larger and independently placed; Match Stage and Result Tags converge on one
compact Badge anatomy.

### 6.2 Team artwork

Loaded logos use **Open Artwork**:

- `object-fit: contain`;
- no crop;
- no independent border, frame, or glow;
- preserve source color and aspect ratio.

Contrast for dark artwork comes from the Team Identity surface. Missing or
failed artwork uses a Neutral Frame with derived initials only. Archived state
belongs to the parent Pattern and does not alter the artwork.

### 6.3 Compact statistics

Stat Summary uses edge-highlight Dark Glass with a **Ruled Grid**. Values are
label-first; internal dividers replace nested mini-panels. Team Summary may use
five cells and Player Summary six, with responsive reflow.

Read-only Team Rating uses five partially fillable stars mapped to ten points
and displays the exact `x / 10` value. Unavailable is distinct from zero.

## 7. Tables, pagination, and feedback

### 7.1 Unified Data Bay

All major tables share:

- edge-highlight Dark Glass outer shell;
- quiet tonal header;
- 38px quiet headers and 46px body rows;
- horizontal dividers and no vertical grid;
- restrained neutral full-row Hover;
- stable sort-indicator slots;
- local horizontal overflow;
- pointer/focus/pressed treatment only where a real row action exists.

The Match statistics **Other** row uses Operational Neutral: a quiet alternate
fill and neutral leading rail. It never reuses warning, error, selected, or
winner meaning.

The Final Team Results winner row uses the Semantic Bridge Prestige Lime-Gold
`#d8cf70` with a Trophy and outcome text. It remains a dedicated outcome role:
its semantic token does not reuse Brand, Rating, warning, or the Other-row role,
even though the approved global Championship Gold, Warning, and Rating tokens
now share the same `#d8cf70` palette value. Championship Gold remains active
for MVP and other existing outcome contexts.

Both semantic-row gradients belong to the complete table row. Their cells stay
transparent in Default and Hover states so the directional field crosses every
column once instead of restarting inside each cell.

Pagination forms the Data Bay final strip. Preserve `Showing x–y of z`; Current
page is a persistent selection and Previous/Next disable at boundaries.

### 7.2 Feedback

- **Alert/Banner:** Edge Signal, semantic icon, concise title/body, optional
  approved action.
- **Empty:** Open Content within the owning module, not a nested dashed card.
- **Loading:** labeled bounded Spinner where shape preservation is unnecessary.
- **Skeleton:** mirrors target geometry; becomes static under Reduced Motion.
- **Error/Retry:** retains module position and previously successful content
  during refresh failure.

Confirmation Dialog uses Raised Dark Glass and a trailing action pair. Archive,
Void, Delete, and Discard use Danger. Restore is a normal important action with
a high-contrast return icon, not a destructive action. Confirming disables both
actions and errors remain inside the dialog.

## 8. Product patterns

### 8.1 Team

- **Teams Overview:** Open Division Stacks containing Score Ledger Team Cards.
- **Team Detail:** Unified Field identity hero with five-axis profile, Ruled
  Grid Team Summary, and Roster Data Bay.
- **Team Create/Edit:** Identity Proof preview inside the Editor workflow.

Team Patterns consume the restricted Team Identity surface, Open Artwork or
Neutral Frame initials, exact fractional rating, and data-driven Team colors.

### 8.2 Player

- **Statistic Leader Cards:** four Frosted Depth cards with distinct category
  color and stronger category Glow on Hover. Their approved **Mint Orbit**
  palette keeps every category adjacent to Brand Mint: Points `#43f2c8`,
  Rebounds `#78dda0`, Assists `#62cee5`, and Rating `#b7dc78`. They are not
  clickable and have no Pressed state.
- **Number Masthead:** oversized bold Anton jersey number without a `Jersey`
  label, with restrained Team-color Outline Echo.
- **Segmented Performance Profile:** ten intervals with partial final fill for
  Points, Rebounds, and Assists leader-relative values; show the exact integer
  without `%`.
- **Honors Ledger:** read-only ruled award history led by award type and
  Trophy/Star/Medal, followed by Event and award-time Team.

### 8.3 Event

- **Tournament Insignia:** shared Tier identity at compact list and larger
  detail scales. Its **Semantic Bridge** hierarchy uses S Prestige Lime-Gold
  `#d8cf70`, A Orbit Cyan `#62cee5`, B Brand Mint `#43f2c8`, and C Muted Jade
  `#7e9e95`; color is paired with letter and subtitle.
- **Insignia Rail:** Event Summary Card with Tier rail, name/description/status,
  optional open Champion strip, and quiet footer.
- **Event Detail:** realistic full-width Participants roster; Stage and Result
  Tags follow as compact peer sections rather than an equal parallel column.
- **Black Metal Plaque:** complete read-only Player Awards presentation with MVP
  first and engraved First/optional Second Team grids.

The Player Awards selection workflow keeps its current behavior. Matrix,
staged-selection, and candidate-pool redesigns require a separate functional
design PR.

### 8.4 Match

- **Scoreline Rail:** Match list card with Event/optional Stage/time rail,
  symmetrical Team identities, central score, and Trophy plus `Winner`.
- **Arena Scoreline:** read-only Match Detail hero with symmetrical Team/score
  hierarchy and no separate Winner marker. Missing Stage renders an em dash.
- **Match Editor:** two dense statistics-entry Data Bays, live Team score, and
  Operational Neutral Other rows.

The Match list does not invent scheduled, incomplete, voided, archived-Event,
ResultTag, or synthetic Match-status content.

## 9. Named exceptions

The following effects are allowed only in their named scope:

| Exception | Scope |
|---|---|
| Deep Light Glass | Team identity/card surfaces |
| Category Gradient and Glow | Four Statistic Leader cards |
| Tournament Insignia material | Event Tier identity |
| Black Metal Plaque | Event Detail Player Awards |
| Team-color trace | Team/Match identity and Player Number Masthead |
| Championship Gold | Winner, Champion, and MVP meaning |
| Operational Neutral | Match-statistics Other row |
| Neutral + Brand Ambient | Global content Canvas |
| Open Section/Open Content | Approved hierarchy and feedback exceptions |

Pattern-local effects do not graduate into global tokens without repeated real
usage and explicit review.

## 10. Anti-patterns

- one universal Card for every information type;
- cards nested inside cards to manufacture hierarchy;
- full Brand outlines on every interactive surface;
- Brand used simultaneously as border, wash, icon, title, and number;
- generic card lift, scale, pulse, glow, or drop shadow;
- replacing tables or ruled rows with cards for novelty;
- cropping or recoloring supplied Team logos;
- using color as the only status, winner, or selection signal;
- page-local color, font, radius, or repeated-shadow literals when a shared
  semantic role exists;
- redesigning business behavior during visual migration.

## 11. Implementation governance

- Shared visual identity belongs in this document, canonical CSS tokens,
  Mantine theme, or shared components.
- Page CSS primarily owns layout, spacing, responsive behavior, and genuinely
  local Pattern composition.
- Preserve component placement, interaction logic, data order, and responsive
  behavior during token migration unless an approved PRD changes them.
- Use the bounded M0–M6 migration sequence documented by the approved Editorial
  Scoreboard experiment.
- Follow `docs/UI_REDESIGN_READINESS_CHECKLIST.md` and `docs/WORKFLOW.md`.
