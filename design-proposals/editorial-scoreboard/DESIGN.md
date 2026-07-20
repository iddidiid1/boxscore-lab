---
name: Editorial Scoreboard
status: formalized-reference
basedOn: ../verge-dark-current/DESIGN.md
product: BoxScore Lab
---

# Editorial Scoreboard — Candidate Design System

## 1. Status and authority

This document records the **approved candidate direction** that passed Gate E2
on 2026-07-20. It is retained as experiment history; `docs/DESIGN.md` is now the
active project specification.

- The active design intent remains `docs/DESIGN.md`.
- The active implementation tokens remain
  `apps/frontend/src/styles/variables.css`.
- Approved shared values have been mirrored into `docs/DESIGN.md`,
  `variables.css`, and the Mantine theme by M0.
- Proposal-only specimen names and unselected alternatives remain historical
  evidence and must not be copied into production.

The current Verge Dark system remains the baseline. Editorial Scoreboard is a
focused evolution of that system rather than an unrelated visual reset. The
candidate covers the current MVP visual system through `UI-DEC-058`; the Event
Player Awards selection workflow remains a separately documented functional
design deferral.

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
| Event collection | Insignia Rail Event Summary Card |
| Match result | Scoreline Rail list card or Arena Scoreline detail hero |
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
- Tournament Insignia material and tier accent;
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

Use **Neutral + Brand Ambient** above the approved Canvas base `#131313`. The
background retains two broad, low-contrast neutral-white light fields:
approximately `6%` near the upper-right content edge and `3.5%` near the
lower-left. Add restrained Brand Mint fields at `8%` upper-right and `3%`
lower-left. Their purpose is to give translucent surfaces environmental
variation and a controlled brand atmosphere without recoloring the Canvas.

Brand Mint remains localized to the two broad edge fields; it is not a
full-canvas green tint. Do not add a global grid, noise texture, or pulsing
decorative glow.

Keep the ambient fields stable behind the content shell when pages scroll and
layouts reflow. The Main Content Shell must remain transparent so it does not
mask the ambient fields. If layered gradients are unavailable or intentionally
reduced, fall back to the flat `#131313` Canvas.

### 4.2 Typography

The current font roles remain:

- **Anton** — display titles, scores, leader values, editorial numbering;
- **Space Grotesk** — interface text and readable content;
- **JetBrains Mono** — numerical data, metadata, labels, statuses, and table
  columns.

The experiment should use typographic contrast before adding more surface
chrome.

### 4.3 Shape

Approved candidate radius model:

| Role | Candidate |
|---|---|
| Compact surface or inset | `8px` |
| Base interactive card | `10px` |
| Standard panel or overlay | `12px` |
| Input/control | `4px` |
| Button/badge | `4px` Precise geometry |

The experiment does not assume that the existing 16px panel radius must remain
the universal card radius.

### 4.4 Depth and interaction

- No default drop shadows.
- No hover translation.
- No full-canvas mint tint or saturated global glow.
- Use tonal surface layering and 1px borders.
- Interactive cards may reveal a short 2px cutline.
- Focus-visible treatment must remain stronger than hover treatment.
- Motion uses the approved `100ms`, `160ms`, and `220ms` functional duration
  roles. Reduced Motion removes non-essential transitions and animation while
  preserving immediate state feedback.

## 5. Candidate card grammar

### 5.1 Identity Card

Used for Team and potentially Player identity.

- compact logo/mark;
- name is the strongest text;
- division/team metadata is secondary;
- record and points share a divider-separated footer;
- dynamic team color may style the mark or cutline;
- mint is reserved for the primary system value or active state.

### 5.2 Event Summary Card

Used for Events overview.

- uses the approved Insignia Rail composition;
- keeps Tier identity in a compact Tournament Insignia rail;
- uses an open Champion strip only when a Champion exists;
- makes the complete card the sole navigation target;
- coordinates local edge and ambient response without lift or scale.

### 5.3 Match Scoreline

Used for Match list results and the Match Detail hero.

- score occupies the visual center and Team names sit on opposing sides;
- Scoreline Rail list cards use Trophy plus `Winner`;
- Arena Scoreline detail heroes preserve symmetry and use score hierarchy
  without a separate Winner marker;
- event, stage, date, and status form a compact metadata rail;
- each composition remains horizontal until its approved narrow reflow.

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

BoxScore Lab compositions such as Score Ledger Team Cards, Insignia Rail Event
Cards, Match Scorelines, Team Summary, Statistic Leader Cards, and Tournament
Insignia.

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
- Cancel/Exit is a transparent neutral outline. Create/Edit page headers use
  the visible label `Cancel`; do not substitute `Return to …` for that form
  action. Detail-page return navigation remains the separate Detail Back Link;
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

Use Deep Light Glass at `40%` opacity over the approved Neutral + Brand Ambient
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
- keep the quiet header at `38px` and use `46px` body rows;
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
- **Winner Result Row — Semantic Bridge:** use a restrained directional
  Prestige Lime-Gold `#d8cf70` outcome tint and leading trace. Always pair it
  with a Trophy icon and explicit result text such as `Champion`; preserve the
  treatment on hover. It must not reuse Brand Mint, warning, Rating, or the
  Other-row neutral semantic role. Its dedicated token shares the new global
  Championship Gold value `#d8cf70`, which also replaces the former Gold for
  MVP and other existing outcome contexts.

For both variants, the directional gradient is owned by the complete table row;
cells remain transparent in Default and Hover so the field does not restart in
each column. These variants share the Data Bay `46px` body-row geometry,
columns, and responsive viewport, but never share their semantic color tokens.

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

## 7. Approved product patterns

### 7.1 Team Overview

The Division Team Board uses **Open Stacks**. Each Division is an uncontained
vertical section with a compact data-label heading and horizontal rule. Do not
wrap the complete Division in another panel. The Team Card grid belongs inside
that section and reflows independently; Division membership must remain clear
when cards collapse to one column.

Team Identity Card uses the **Score Ledger** composition on the approved `40%`
Team Identity Surface:

- place Logo Artwork or Neutral Frame + Initials fallback beside the Team name;
- align total points in a stable numeric column;
- place five fractional stars plus the exact `x / 10` value on a full-width
  secondary ledger row;
- truncate unusually long Team names without changing card height;
- retain the restrained Team-color cutline as a data-driven exception;
- preserve the complete-card detail link, pointer cursor, focus-visible,
  pressed, and restrained hover states;
- do not create a nested Logo bay or add independent controls inside the card.

The Teams overview API returns active Teams only, so archived presentation does
not appear in this Board. Archived identity remains available in Team Detail
and historical Match/Event contexts.

### 7.2 Team Detail Hero

Team Detail uses the **Unified Field** composition. Place Identity Summary and
the five-axis Team Profile inside one shared `40%` Team Identity Surface, with
one structural divider between them:

- Identity leads with Logo Artwork or Neutral Frame + Initials fallback, Team
  name, Division, description, total points, and fractional star rating;
- Team Profile remains a distinct Radar visualization in the trailing region;
- keep DEF, OFF, CON, COH, and DEP values visibly labeled and accessibly
  described;
- if profile ratings are unavailable, retain the Profile region and show an
  explicit no-profile message;
- stack Identity before Profile on narrow screens;
- keep Detail Back Link, Manage Team, and the archived notice outside the
  Unified Field;
- hide Manage Team for archived Teams while retaining historical content.

Do not place the Radar in a second card, turn the Radar into a generic Stat
Summary Panel, or promote the Team Identity Surface to a default Detail-page
container.

### 7.3 Team Create/Edit Identity Preview

Use **Identity Proof** inside the approved Open Well:

- compose live Logo Artwork or Neutral Frame + Initials fallback beside the
  current Team name and Division;
- show the current fractional star rating with its exact value;
- let the data-driven Team primary color appear as a restrained cutline and
  compact color reference;
- use `New Team`, `No division selected`, zero rating, and initials fallback for
  an empty draft;
- preserve the same geometry when Logo artwork is missing or broken;
- stack Logo before identity content on narrow screens.

The preview is non-interactive and does not duplicate the final Team Card or
Team Detail Hero. Do not add points, Radar, navigation, hover/pressed behavior,
or field-by-field preview rows.

### 7.4 Player Overview Statistic Leader Cards

Preserve the current four-card content hierarchy:

1. Crown plus statistic label;
2. large category-colored value;
3. Player name;
4. Team name.

Use **Frosted Depth with Strong Glow**:

- apply one shared glass skeleton to Points, Rebounds, Assists, and Rating;
- give each category a dedicated purpose-specific accent from the approved
  **Mint Orbit** palette: Points `#43f2c8`, Rebounds `#78dda0`, Assists
  `#62cee5`, and Rating `#b7dc78`;
- keep the four accents inside a narrow Brand-adjacent green/cyan spectrum so
  they read as one product language rather than four unrelated semantic colors;
- use that accent for the value, Crown, localized ambient field, and Crown
  halo;
- keep explicit category text so color is never the only distinction;
- on Hover, strengthen the localized ambient light without lift, scale, or
  cursor change;
- preserve equal card geometry and four/two/one-column responsive flow;
- when no eligible Player exists, retain the card and display `0.0` plus
  `No eligible players`.

These cards are non-interactive. Do not add click, navigation, pressed,
selected, or action-focus behavior. Strong Glow is a restricted feature-card
exception rather than a generic surface treatment.

### 7.5 Player Detail Identity

Use an open **Number Masthead with Outline Echo**:

- place an oversized Anton Display `#number` before the Player identity;
- use Strong foreground for the main number plus a restrained data-driven
  Team-color offset shadow and outline echo;
- do not add a Jersey label—the number is the identity mark;
- place Player name, current Team, and Position in the adjacent identity
  region;
- show Inactive Player and Archived Team as independent, explicit status
  markers that may appear together;
- retain the Detail Back Link outside the Masthead;
- stack the number before the identity facts on narrow screens.

The Masthead remains open and non-interactive. Awards, Performance Bars, Stat
Summary, Event filter, and Match History are separate patterns or components.
Outline Echo is a Player Detail exception and must not become a generic heading
or numeric-data effect.

### 7.6 Player Performance Profile

Use a **Segmented Meter** for the backend-provided Points, Rebounds, and Assists
leader-relative values:

- keep the three dimensions in backend order;
- use ten equal intervals on a `0–100` scale;
- fill complete intervals and partially fill the next interval when required;
- show the exact integer value without a percent symbol;
- retain helper and accessible text explaining that the number is relative to
  the current statistics-scope Leader;
- render all intervals empty when the value is zero;
- preserve the actual Player statistics in Stat Summary for context;
- keep meter transitions functional and disable them under Reduced Motion.

The Segmented Meter is read-only. It is not the editable Rating Slider and its
numbers are not ordinary percentage-stat fields. Omitting `%` here does not
change FG%, 3PT%, or other genuine percentage formatting.

### 7.7 Player Awards History

Use an **Honors Ledger** for the Player-centric cross-Event award history:

- arrange awards as quiet ruled rows rather than cards or badge clusters;
- lead with Award type and a non-color icon: Trophy for MVP, Star for First
  Team, and Medal for Second Team;
- follow with Event and award-time Team as supporting facts;
- preserve the current plain-text Event and Team behavior;
- show Notes only when present and omit the Notes row entirely otherwise;
- use `No awards in this scope.` as the compact empty state;
- keep every row read-only with no hover, pressed, selected, or navigation
  treatment.

Do not reuse the Event Detail MVP Award Card or All-Event Team roster cells.
Those components describe the hierarchy inside one Event; the Honors Ledger
records one Player's history across Events.

### 7.8 Event Tier Badge Family

Use a **Tournament Insignia** for Tier identity across Event list and detail
contexts:

- compose fine open rails, a central faceted medallion, the Tier letter, and
  the Tier subtitle as one recognizable insignia;
- keep the same anatomy in Event Summary Card and Event Detail hero;
- use a compact list scale and a larger detail scale without changing visual
  identity;
- preserve the Semantic Bridge hierarchy: S Prestige Lime-Gold `#d8cf70`, A
  Orbit Cyan `#62cee5`, B Brand Mint `#43f2c8`, and C Muted Jade `#7e9e95`;
- pair color with the visible Tier letter and subtitle;
- keep the insignia itself non-interactive;
- in a clickable Event Summary Card, strengthen only the local trace and
  ambient light as part of the parent card's Hover and Focus-visible response;
- give the Detail insignia no independent Hover, Focus, Pressed, or Glow
  behavior;
- remove the current oversized filled-crest treatment.

Tournament Insignia may reuse Dark Glass, precise edge-highlight, inset,
divider, Glow, text, and Data typography roles, but its rails, medallion, and
context scales remain Event-specific. Do not apply this ceremonial construction
to ordinary Badges, Tags, or identity artwork.

### 7.9 Event Summary Card

Use **Insignia Rail** for Event overview cards:

- preserve the current left-Tier/right-content reading model;
- replace the oversized filled crest with a compact Tournament Insignia in a
  dedicated left rail;
- lead the content field with Event name, description summary, and Semantic
  Status Edge Plate;
- present Champion as an open ruled strip with Trophy and Championship Gold,
  not as a nested card;
- omit the Champion strip entirely for Preparing and Ongoing Events;
- keep participating Team count and the destination cue in a quiet footer;
- make the entire card the sole navigation target;
- coordinate Hover and Focus-visible across the card and Tournament Insignia
  without lift or scale;
- keep Tier, Status, Champion, and footer metadata non-interactive;
- move the Tier rail above the content only at the narrowest breakpoint.

Insignia Rail reuses the shared Interactive Card and Event Tier systems. Its
column dimensions, Champion-strip rhythm, and responsive reflow remain
Event-specific.

### 7.10 Event Player Awards

Use one **Black Metal Plaque** for the complete Event Detail Player Awards
presentation:

- use a cut-corner, solid near-black outer material with restrained edge
  highlights and registration marks;
- keep Player Awards and Event context in the plaque header;
- place the full-width horizontal MVP field first;
- use Trophy plus Championship Gold as the MVP signal while Brand Mint remains
  a structural trace;
- integrate the MVP field into the plaque rather than nesting another Card;
- follow with explicit All-Event First Team and optional All-Event Second Team
  groups;
- render each roster as a five-cell engraved ruled grid on desktop;
- preserve backend order and API-provided Player name, Position, and award-time
  Team;
- retain an inline Gold `MVP` marker when the MVP is also a roster member;
- lower Second Team emphasis with neutral rules and supporting text;
- omit the entire Second Team group when absent;
- mark inactive historical Players explicitly;
- use open content inside the plaque for the no-awards state;
- keep the component read-only and give roster cells no interaction states;
- reflow the five-cell rows to two columns and then one column without changing
  award grouping.

The cut-corner frame, registration marks, and directional award trace are
Event-awards-local roles. Do not add repeating stripes or a visible brushed
grain. Do not graduate Black Metal Plaque into a generic Card or panel
material. Exact ambient-light strength may be tuned during Event Detail
scenario validation.

### 7.11 Match Record Card

Use **Scoreline Rail** for Match list cards:

- keep Event, optional Compact Match Stage Badge, and formatted Match time in a
  quiet metadata rail;
- omit the Stage Badge entirely when no Stage exists;
- arrange HOME identity, central score comparison, and AWAY identity in a
  symmetrical horizontal scoreline;
- use approved loaded Logo Artwork or Neutral Frame + Initials fallback;
- retain restrained data-driven Team-color traces without recoloring logos;
- identify only the higher-scoring Team with Trophy plus `Winner`;
- strengthen the winning Team name and score while keeping the text/non-color
  Winner signal;
- render equal-score API data without a Winner marker;
- make the complete card the only navigation target;
- coordinate Hover and Focus-visible across the card using restrained local
  Team light, without lift or scale;
- keep every internal identity, score, Badge, and Winner signal
  non-interactive;
- on narrow screens, stack HOME then AWAY and place the score in its own ruled
  row while preserving HOME/AWAY labels.

The Match list API exposes valid past records only. Do not add scheduled,
incomplete, voided, archived-Event, ResultTag, or synthetic Match-status
content to Scoreline Rail. Equal-score rendering is defensive presentation, not
a change to Match business rules.

### 7.12 Match Detail Score Header

Use **Arena Scoreline** for the read-only Match Detail hero:

- keep Event, Stage, and formatted Match time in a quiet metadata rail;
- render `—` when the optional Stage is absent, preserving the current Detail
  requirement rather than applying the list-card omission rule;
- arrange HOME identity, central final-score comparison, and AWAY identity in
  one open, symmetrical field;
- use approved loaded Logo Artwork or Neutral Frame + Initials fallback;
- retain restrained data-driven Team-color traces without recoloring logos;
- communicate the outcome through the numeric score and hierarchy only:
  preserve full-strength winning score and Team name while de-emphasizing the
  losing pair;
- do not add Trophy or `Winner`, because it breaks symmetry and repeats
  information already encoded by the score;
- render defensive equal-score data with both Teams at the same visual level;
- keep the complete hero read-only, without Hover, Focus, or Pressed behavior;
- stack HOME, AWAY, then the ruled score row on narrow screens while preserving
  explicit HOME/AWAY labels.

For voided and historical/unavailable Event records, the header may echo the
state with a compact marker and local trace. Full reason, recovery guidance,
Back/Edit/Void/Restore actions, and persistent notices remain owned by the
Detail page outside Arena Scoreline.

## 8. Responsive and accessibility requirements

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

## 9. Anti-patterns

- One universal 16px card for every information type.
- Cards nested inside cards to create hierarchy.
- Full mint outlines on every interactive surface.
- Mint used simultaneously as border, background, icon, title, and number.
- Drop shadows used as the default elevation mechanism.
- Replacing tables or archive rows with cards only for visual novelty.
- Flattening intentional leader, tier, radar, or team-color effects into the
  global card style.
- Introducing page-local literals when a confirmed shared semantic role exists.

## 10. Candidate-system disposition

The candidate passed Gate E2 with no unresolved required visual-system
decisions. All 97 inventory items have an explicit review disposition: 91
Approved and now Formalized, two Rejected, and four Deferred.

The Deferred items preserve current behavior or structure:

- Sidebar Shell;
- Sidebar Brand Header;
- Main Content Shell;
- Event Player Awards Selection Workflow.

The first three are intentionally conservative because the current application
shell is already satisfactory and its broader mobile-navigation behavior was
not part of this visual experiment. The Awards workflow requires functional
interaction design and belongs in a separate PR; this candidate approves only
the visual treatment surrounding the existing behavior.

The rejected Decorative Page Eyebrow and nested Team Logo Container must not be
implemented. Historical alternatives in lab files are evidence, not candidate
system options.

`TOKEN_MAPPING.md` defines the proposed production-token contract.
`MIGRATION_PLAN.md` records intentional exceptions, implementation impact, and
recommended migration batches. `E6_APPROVAL_PACKET.md` is the Gate E2 review
index. Decisions remain traceable in `DECISION_LOG.md`, and coverage remains
traceable in `UI_INVENTORY.md`.
