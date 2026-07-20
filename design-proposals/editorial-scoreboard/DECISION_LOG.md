# UI System Decision Log

## Purpose

This file records explicit decisions made during the Editorial Scoreboard
experiment. Conversation alone is not the durable source of truth.

An entry is added when the user approves, revises, rejects, or defers a reviewed
item. Do not create approval entries based on inferred preference.

## Decision states

- **Approved** — accepted for the candidate system.
- **Approved with adjustment** — direction accepted with a specific recorded
  change.
- **Revise** — direction remains under consideration and must return to review.
- **Rejected** — candidate treatment will not be used.
- **Deferred** — valid current-MVP decision intentionally postponed.
- **Superseded** — replaced by a later decision; retain the original entry and
  link to the replacement.

## Entry template

```md
## UI-DEC-000 — Decision title

- Date:
- Inventory IDs:
- Batch:
- State:
- Approved by:

### Context

What was being evaluated and where it is used.

### Decision

The exact accepted, revised, rejected, or deferred direction.

### Reasoning

Why the decision was made, including meaningful trade-offs.

### Token impact

Candidate token roles added, changed, removed, or explicitly avoided.

### Component and pattern impact

Which reusable components, product patterns, or scenarios are affected.

### Exceptions

Any intentional local behavior that must not be flattened into the shared rule.

### Follow-up

Required preview revision, documentation update, formalization task, or
implementation dependency.
```

## Decisions

## UI-DEC-001 — Neutral Black with Deep Green brand mint

- Date: 2026-07-17
- Inventory IDs: E0 foundation color direction
- Batch: E0 Theme Direction
- State: Approved
- Approved by: User

### Context

The color-system lab compared Soft Graphite, the current Neutral Black
foundation, Deep Green Black, and a light reference across Team, Event, Match,
Table, Form, Status, and Feature scenarios.

### Decision

Use the **Neutral Black** foundation with the **Deep Green Black brand mint** as
the approved Editorial Scoreboard candidate-system combination:

- canvas `#131313`;
- surface `#1a1a1a`;
- raised surface `#232323`;
- strong text `#ffffff`;
- muted text `#949494`;
- brand mint `#43f2c8`.

The light direction remains a comparison reference rather than the preferred
product direction.

### Reasoning

Neutral Black preserves the comfortable dark viewing experience and established
surface relationships. The slightly calmer `#43f2c8` mint retains the modern,
technical brand character while reducing the intensity of the current
`#3cffd0`.

### Token impact

When the complete candidate system passes gate E2, the active brand/action,
focus, success, and derived mint-alpha roles must be reviewed together. Do not
replace only one literal in `variables.css`.

### Component and pattern impact

Continue evaluating the combination across navigation, actions, Team identity,
Event archive, Match scoreboard, tables, forms, statuses, and feature cards.

### Exceptions

Team colors, Tier Crest accents, radar visuals, and other documented
data-visualization exceptions remain independent of the brand mint.

### Follow-up

Keep this combination as the default color-system lab preset. Gate E0 is
complete. Continue with E1 UI Inventory; formalization into the active project
design system remains blocked until the complete candidate system passes gate
E2.

## UI-DEC-002 — E1 normalized inventory and component-round boundary

- Date: 2026-07-17
- Inventory IDs: All current entries in `UI_INVENTORY.md`
- Batch: E1 Inventory
- State: Approved
- Approved by: User

### Context

The user completed manual UI enumeration by explicitly saying “没了”. The
frontend source and current Team, Player, Event, Match, and UI-readiness PRDs
were then audited for omitted current-MVP foundations, reusable components,
states, and product-specific compositions.

### Decision

Approve the normalized E1 inventory and proceed to E2 batch planning.

The present design round includes Foundation items and reusable,
business-neutral Components. Team, Player, Event, Match, application-shell, and
page-level Patterns remain recorded for coverage but are explicitly deferred
from this round.

### Reasoning

Most remaining unlisted UI is a product-specific arrangement of already
identified primitives rather than another foundation or reusable component.
Separating those Patterns prevents a generic card system from prematurely
dictating Team, Player, Event, or Match information architecture.

### Token impact

No active token is changed by this approval. Candidate token work may now be
organized into experiment batches, while `docs/DESIGN.md` and
`apps/frontend/src/styles/variables.css` remain unchanged.

### Component and pattern impact

The approved scope contains 10 Foundation entries and 59 reusable Component
entries, including three component variants. Twenty-four current-MVP Pattern
entries are retained as `Deferred`.

### Exceptions

Existing data-driven Team colors and documented Tier, radar, award, winner, and
other visualization semantics remain exceptions to be evaluated in their later
product-pattern context.

### Follow-up

Create the E2 batch plan, verify that every in-scope entry is covered exactly
once, and begin with the Foundation batch. Each batch still requires its own
explicit review decision; E1 approval does not approve any unreviewed visual
treatment.

## UI-DEC-003 — Balanced density with Precise shape roles

- Date: 2026-07-17
- Inventory IDs: `FND-003`, `FND-004`
- Batch: B01 Foundation
- State: Approved
- Approved by: User

### Context

The B01 Foundation specimen compared Compact and Balanced spacing density, plus
Precise and Soft radius hierarchies.

### Decision

Use the **Balanced** spacing scale and **Precise** shape hierarchy:

- spacing: `4 / 8 / 12 / 16 / 24 / 32 / 48px`;
- control radius: `4px`;
- compact surface radius: `8px`;
- interactive surface radius: `10px`;
- standard panel/overlay radius: `12px`.

The user briefly considered Soft shape, then explicitly changed the decision to
Precise.

### Reasoning

Balanced preserves useful editorial spacing without making the sports-console
interface feel empty. Precise maintains clearer geometry and avoids returning
to the broadly rounded container treatment the redesign is intended to reduce.

### Token impact

Candidate spacing and radius roles may now use these values. This remains
proposal-only and does not change the active `variables.css`.

### Component and pattern impact

All later component batches consume the spacing scale. Radius roles establish
defaults, while later components still decide which role matches their
semantics.

### Exceptions

Feature and data-visualization frames may request a separately reviewed radius.
Native controls or third-party popovers may retain platform constraints where
overriding them would be brittle.

### Follow-up

Continue reviewing the remaining B01 typography, border, focus, motion,
elevation, responsive, and non-color-signal rules.

## UI-DEC-004 — B01 Foundation approval with component-level motion review

- Date: 2026-07-18
- Inventory IDs: `FND-001`–`FND-010`
- Batch: B01 Foundation
- State: Approved with adjustment
- Approved by: User

### Context

The B01 specimen evaluated the approved E0 colors together with typography,
spacing, shape, borders, focus, motion, elevation, responsive behavior, and
non-color signals. Balanced density and Precise shape were approved separately
in `UI-DEC-003`.

### Decision

Approve B01 Foundation and proceed to B02.

Retain:

- the six-role typography direction;
- Balanced spacing and Precise shape;
- subtle/structural/interactive border roles;
- a keyboard-visible mint focus ring stronger than hover;
- short functional duration roles and automatic Reduced Motion support;
- restrained base elevation;
- the normalized responsive bands;
- Lucide plus non-color semantic signals.

Adjust the motion rule: Foundation does **not** permanently prohibit every
standard-state use of card lift, noticeable scale, or fluorescent pulse.
Instead, those effects are exceptional candidates that must be justified and
reviewed in the concrete component or product-pattern batch where they would
appear. They are not default shared behavior.

### Reasoning

The user confirmed the Foundation direction but remains uncertain whether a
blanket prohibition would remove potentially useful expression from selected
interactive or feature components. Moving that judgment to the consuming
component preserves a restrained default without deciding every future motion
case in the abstract.

### Token impact

Approve candidate duration roles of `100 / 160 / 220ms`, the standard easing
direction, and Reduced Motion support. Do not create a global “never translate,
scale, or pulse” token rule. Any later exception must still consume semantic
motion roles and define its Reduced Motion behavior.

### Component and pattern impact

Every later interactive component must demonstrate its standard, hover,
pressed, and Reduced Motion behavior. Card lift, scale, glow, or pulse is not
inherited automatically and cannot be introduced as generic card chrome.

### Exceptions

Feature, visualization, winner, live-status, and other semantically expressive
patterns may propose stronger motion. Approval must be local and must not spread
to ordinary containers.

### Follow-up

Begin B02 Surfaces and content hierarchy. Revisit individual motion treatments
in B03 and later product-pattern batches rather than reopening B01 globally.

## UI-DEC-005 — Reject Solid Tonal and Dark Neumorphism materials

- Date: 2026-07-18
- Inventory IDs: B02-A material candidates for `SUR-CMP-001`
- Batch: B02-A Card Material Exploration
- State: Rejected
- Approved by: User

### Context

The first B02-A comparison applied identical Match content, spacing, geometry,
and Base/Active states to Open Section, Solid Tonal, Editorial Outline, Dark
Glass, Dark Neumorphism, and Gradient Surface candidates.

### Decision

Remove **Solid Tonal** and **Dark Neumorphism** from the active material
candidates.

### Reasoning

Solid Tonal does not provide a compelling enough direction for the redesigned
container system. Dark Neumorphism loses much of its sculpted character against
the approved near-black canvas and the user's preferred Precise, weak-radius
geometry.

### Token impact

Do not create a default solid-tonal panel material family or shared
neumorphic light/dark shadow tokens for this candidate system.

### Component and pattern impact

Standard Content Panel will not use either treatment as its default identity.
This does not prohibit a later product-specific experiment from proposing a
different solid surface for a semantic reason, but it receives no shared
material status from B02.

### Exceptions

Existing tonal surfaces remain valid implementation evidence until the
candidate system is formalized and migrated. This decision does not modify the
active application.

### Follow-up

Continue with Open Section and Editorial Outline as structural references.
Revise Dark Glass and Gradient Surface with weaker boundary treatments.

## UI-DEC-006 — Revise Glass and Gradient boundaries

- Date: 2026-07-18
- Inventory IDs: B02-A material candidates for `SUR-CMP-001`
- Batch: B02-A Card Material Exploration
- State: Revise
- Approved by: User

### Context

Dark Glass and Gradient Surface remained visually interesting in the first
material comparison, but their complete outer outlines appeared too explicit.

### Decision

Retain **Dark Glass** for further exploration. Retain **Gradient Surface** only
as a candidate for rare, named feature contexts rather than a default
container. Revise both with weaker boundary treatments.

The next comparison must show:

- the first-pass outline as reference;
- a weaker full hairline;
- an edge-highlight treatment without a uniform full outline;
- Base and Active/hover states.

### Reasoning

Both materials gain character from light and color inside the surface. A strong
complete outline adds redundant card chrome and competes with the material
itself. Gradient is sufficiently expressive that broad reuse would weaken
information hierarchy.

### Token impact

Explore translucent hairline, directional edge-highlight, glass highlight,
blur, and feature-gradient roles. Do not promote them into shared tokens until
their material and usage scope are approved.

### Component and pattern impact

Dark Glass remains a possible bounded-container or overlay material. Gradient
Surface is restricted to later feature-pattern evaluation such as leaders,
awards, or featured outcomes.

### Exceptions

A stronger boundary may still be required when contrast, layering, or an
interactive focus state cannot be communicated reliably by the material.

### Follow-up

Produce B02-A.2 with Dark Glass and Gradient Surface boundary-strength
comparisons before returning to B02-B containment decisions.

## UI-DEC-007 — Edge-highlight Glass and Gradient material roles

- Date: 2026-07-18
- Inventory IDs: B02-A material candidates for `SUR-CMP-001`
- Batch: B02-A.2 Glass/Gradient Boundary Revision
- State: Approved with adjustment
- Approved by: User

### Context

B02-A.2 compared the first-pass outline, a weaker complete hairline, and an
edge-highlight treatment without a uniform full outline for Dark Glass and
Gradient Surface in Base and Active states.

### Decision

Use **Edge Highlight** as the accepted boundary direction for both:

- Dark Glass;
- Gradient Surface.

Gradient remains restricted to rare, named feature contexts rather than the
default panel material.

Retain Editorial Outline as an unresolved structural candidate even though its
eventual usage is not yet known. Return Open Section to B02-B for containment
and usage-scope evaluation rather than deciding it in the material subphase.

### Reasoning

Directional highlights allow each material's translucency or gradient to form
the surface boundary without adding a second, conspicuous outline around the
entire card. Editorial Outline remains sufficiently distinct as a structural
language to preserve for contextual testing.

### Token impact

Candidate material roles may include:

- directional glass edge highlight;
- directional gradient edge highlight;
- translucent glass surface and blur;
- feature-gradient stops.

Do not add a strong complete outline to either approved material direction.
Exact alpha values remain tunable in context.

### Component and pattern impact

Dark Glass proceeds to B02-B as a bounded-container candidate. Gradient Surface
is retained for later feature-pattern validation. Editorial Outline and Open
Section proceed to B02-B without an assigned default usage.

### Exceptions

Focus-visible and validation/error boundaries may still require a complete
outline because those states must remain unambiguous. Those semantic outlines
are separate from default material chrome.

### Follow-up

Close B02-A and evaluate Open Section, Editorial Outline, and edge-highlight
Dark Glass across Data, Editor, and Summary contexts in B02-B. Resume the page
header, section header, Inset Panel, Compact Fact, and eyebrow decisions there.

## UI-DEC-008 — Contextual containment assignment and eyebrow removal

- Date: 2026-07-18
- Inventory IDs: `SUR-CMP-001`, `PAG-LEG-001`
- Batch: B02-B Containment and Hierarchy
- State: Approved with adjustment
- Approved by: User

### Context

B02-B placed identical Foundation and header rules around three representative
content contexts—Data, Editor, and Summary—and allowed Open Section, Editorial
Outline, and edge-highlight Dark Glass to be compared independently. It also
compared the Functional Page Header with and without the decorative eyebrow.

### Decision

Assign containment by content context:

- **Editor → Editorial Outline**
- **Data → Dark Glass with Edge Highlight**
- **Summary → Dark Glass with Edge Highlight**
- **Functional Page Header → No Eyebrow**

Open Section is not rejected, but it receives no default assignment in these
three base contexts. Gradient Surface remains outside the base containment
system and proceeds only as a rare feature-pattern material.

### Reasoning

Editor content benefits from a clear structural boundary without translucent
material competing with fields and nested inset content. Data and compact
summary regions benefit from the added depth of Dark Glass while Edge Highlight
keeps their perimeter quiet. The approved display-title hierarchy supplies
sufficient page identity without decorative eyebrow copy.

### Token impact

The candidate surface system requires contextual material roles rather than one
universal panel token:

- editor structural outline;
- data glass surface and directional highlight;
- summary glass surface and directional highlight.

Do not add a page-eyebrow typography/color role to the candidate system.

### Component and pattern impact

`SUR-CMP-001` becomes a contextual containment component whose material variant
is selected by established content context. `PAG-LEG-001` is rejected and
should eventually be removed during formalization/migration. Functional Page
Title and Description remain the page-header hierarchy.

### Exceptions

Open Section may still be proposed for a concrete continuous-list, long-form, or
other context where a bounded surface proves unnecessary. Such use must be
deliberate rather than the default for Data, Editor, or Summary.

Gradient and other feature materials remain independently reviewable in later
product-pattern batches.

### Follow-up

Complete B02 review of Inset Content Panel, Compact Metadata Fact, Functional
Page Header composition, and Section Header composition before closing the
batch.

## UI-DEC-009 — Final B02 hierarchy and nested-content components

- Date: 2026-07-18
- Inventory IDs: `SUR-CMP-002`, `SUR-CMP-003`, `PAG-CMP-001`–`PAG-CMP-004`
- Batch: B02 Surfaces and Content Hierarchy
- State: Approved
- Approved by: User

### Context

The final B02 comparison presented three equal-content candidates for each
remaining component:

- Functional Page Header;
- Section Header;
- Inset Content Panel;
- Compact Metadata Fact.

The comparison evaluated hierarchy, action placement, nested chrome, and the
semantic weight of read-only metadata.

### Decision

Approve:

- **Page Header A — Divider Anchored**
- **Section Header A — Full Divider**
- **Inset Panel C — Open Well**
- **Compact Fact C — Inline Fact**

Together with `UI-DEC-008`, this closes B02.

### Reasoning

The divider-anchored Page Header establishes a clear boundary between page
purpose and page content while keeping the title, description, and page action
in one functional region. Full-divider Section Header preserves a strong local
association with the content below.

Open-well Inset Panel avoids heavy double chrome inside an Editorial Outline
editor container. Inline Compact Fact keeps read-only metadata lightweight and
prevents it from resembling a button or a second nested card.

### Token impact

The candidate system requires:

- structural page-header divider;
- subtle section-header divider;
- inset well surface without an external card outline;
- inline fact spacing, icon/signal, and metadata typography.

No separate framed Inset Panel or compact-fact container material is approved.

### Component and pattern impact

Functional Page Header combines the approved Title, Description, optional page
action, and bottom divider. Section Header combines a local title with optional
description and metadata/action plus a full divider.

Inset Content Panel becomes an Open Well inside Editor context. Compact
Metadata Fact becomes an inline read-only composition rather than a bounded
surface.

### Exceptions

Detail pages remain excluded from Functional Page Header. Section Header may
omit description, metadata, or local action when the content does not require
them. Inline Fact may still sit inside a Glass Summary container; it does not
add another material layer.

### Follow-up

Mark B02 approved and begin B03 Actions and Navigation. Revalidate these
components later in representative page scenarios.

## UI-DEC-010 — Revise the first B03 action and navigation proposal

- Date: 2026-07-18
- Inventory IDs: `ACT-CMP-000`–`ACT-CMP-009`, `NAV-CMP-001`,
  `NAV-CMP-002`
- Batch: B03 Actions and Navigation
- State: Revise
- Approved by: User

### Context

The first B03 specimen introduced a newly composed sidebar treatment, a
42/36/32px Large/Medium/Small sizing model, and a Dark Glass plus mint-cutline
treatment for the Large Related Workflow action represented by Manage Results.

The current application sidebar is already one of the strongest and most
satisfactory parts of the interface. The first B03 navigation proposal did not
demonstrate an improvement over that baseline. The Related Workflow treatment
also appeared to come from a different design language than the other Large
actions, while the Medium and Small controls occupied too much space in their
real Section Header and dense-row contexts.

### Decision

Revise B03 with three constraints:

- use the current sidebar and Navigation Item as the baseline, preserving its
  full-width square row, 2px active rail, 18px icon, and current vertical
  density unless a specific problem justifies a change;
- remove the unique Dark Glass and decorative cutline treatment from Manage
  Results, and make every Large action share one geometry/material skeleton;
- reduce Medium and Small/Icon candidates according to their actual usage,
  comparing 30/28px for Medium and 28/24px for Small/Icon.

The next comparison may adjust all Large semantic variants together. Primary,
Return/Cancel, Destructive, and Related Workflow should differ by established
hierarchy roles—fill, border, color, and icon—not by unrelated component
materials.

### Reasoning

Navigation should not be redesigned merely to make the experiment visibly
different from the product. Token alignment and missing state coverage are
sufficient reasons for change; novelty is not.

Related Workflow is a semantic hierarchy role within the action system, not a
separate surface component. Sharing a skeleton makes adjacent actions read as
one family while retaining their different meanings.

Medium and Small controls are defined by constrained contexts. Their visual
size must respect Section Header and table/row density instead of inheriting a
generic page-action target.

### Token impact

Revisit:

- Large action fill, outline, soft-surface, and semantic color roles as one
  coordinated family;
- Medium and Small/Icon control-height and horizontal-padding roles;
- pressed, focus-visible, disabled, and loading overlays at compact sizes.

Do not introduce a Related Workflow glass-surface or decorative-cutline token.
Do not introduce new navigation geometry tokens unless B03.2 demonstrates a
clear improvement over the current implementation.

### Component and pattern impact

`ACT-CMP-008` remains a valid Large Related Workflow component role but no
longer owns a unique material. `ACT-CMP-004`–`ACT-CMP-009` require new compact
size validation. `NAV-CMP-001` and `NAV-CMP-002` move to a baseline-preserving
revision rather than a visual redesign.

`NAV-CMP-003`, `NAV-CMP-004`, and `SYS-CMP-001` received no negative feedback
in this review and remain available for later B03 confirmation.

### Exceptions

Compact visible controls may rely on surrounding row or cell spacing to avoid
overlapping adjacent targets. Icon-only actions must keep accessible names.
Touch-first scenario validation may require a larger responsive target without
changing the desktop density role.

### Follow-up

Produce B03.2 with:

- current navigation versus token-aligned minimal change;
- two coordinated Large-family hierarchy directions;
- compact versus tight Medium and Small/Icon sizing in realistic contexts;
- the required interaction states and narrow-width reflow.

## UI-DEC-011 — Approve the B03 action hierarchy and compact sizing

- Date: 2026-07-18
- Inventory IDs: `ACT-CMP-000`–`ACT-CMP-009`
- Batch: B03 Actions and Navigation
- State: Approved
- Approved by: User

### Context

B03.2 replaced the unrelated Related Workflow glass material with a shared
button skeleton, compared Outline and Surface hierarchy directions, and tested
Compact versus Tight sizing in realistic Section Header and dense-row
contexts. A focused follow-up then rendered Manage Results with the approved
Neutral Black and Deep Green Black Brand Mint palette.

### Decision

Approve:

- **Outline hierarchy** for the shared action family;
- **Compact density**: Large 42px, Medium 30px, Small/Icon 28px;
- **Brand-derived Related Workflow B** for Manage Results.

Every Large action shares the Precise 4px geometry and interaction skeleton.
Semantic hierarchy comes from fill, border, foreground, and icon roles:

- Primary uses solid Brand Mint;
- Return/Cancel uses a transparent neutral outline;
- Destructive uses restrained danger text and outline;
- Related Workflow uses a strong neutral label, Brand Mint icon,
  mint-derived quiet border, transparent base, and Mint Soft hover surface.

Related Workflow receives a named semantic role but does not introduce a new
workflow hue. Its role may map to existing text and Brand Mint primitives.

### Reasoning

Outline hierarchy makes all actions read as one system while preserving a
single dominant constructive action. Compact sizing respects the actual local
header and dense-row contexts without forcing the Tight 24px option throughout
the desktop UI.

The Brand-derived Related Workflow treatment creates more identity than a
fully neutral outline, but remains subordinate to the solid Primary. Adding an
independent workflow blue would fragment the palette and could be confused
with information or navigation semantics.

### Token impact

Candidate action roles require:

- Large, Medium, and Small/Icon heights of 42px, 30px, and 28px;
- shared 4px action radius and control typography;
- primary, neutral-outline, danger-outline, and related-workflow mappings;
- related-workflow foreground, icon, border, and hover-surface aliases derived
  from existing text and Brand Mint roles;
- common hover, focus-visible, pressed, disabled, and loading behavior.

No new literal color family is approved for Related Workflow. Production
tokens remain unchanged until experiment gate E2.

### Component and pattern impact

All `ACT-CMP-000`–`ACT-CMP-009` items are approved. Result Tag order controls
use the 28px Icon Action and keep accessible names plus disabled boundary
states. Persistent selected styling is used only by actions that genuinely own
a persistent toggle or selection state; ordinary command buttons use pressed
feedback instead.

### Exceptions

Touch-first scenario validation may increase compact targets responsively.
Long translated labels may require action-group wrapping rather than reducing
type or padding. Destructive actions still use the appropriate confirmation
pattern.

### Follow-up

Complete the closing B03 review for the current-navigation baseline,
Detail Back Link, Inline Text Link, and API Health Status.

## UI-DEC-012 — Approve B03 navigation, links, and API Health

- Date: 2026-07-18
- Inventory IDs: `NAV-CMP-001`–`NAV-CMP-004`, `SYS-CMP-001`
- Batch: B03 Actions and Navigation
- State: Approved
- Approved by: User

### Context

The closing B03 review returned the sidebar to the current application geometry
and presented the remaining shared navigation and system-status components with
the approved Neutral Black and Deep Green Black Brand Mint palette.

### Decision

Approve:

- current Primary Navigation geometry with token-aligned interaction states;
- Detail Back Link with Brand Mint direction icon and neutral label;
- Inline Text Link with Brand Mint text and persistent quiet underline;
- API Health with explicit Online, Checking, and Offline text plus distinct
  dot/spinner shapes.

This closes B03 Actions and Navigation.

### Reasoning

The existing sidebar already establishes effective density, alignment, and
brand recognition. Preserving it avoids a novelty-driven regression while the
shared state system supplies missing keyboard and pressed feedback.

The two link roles remain distinguishable by placement and treatment: the
Detail Back Link communicates reading-order navigation, while Inline Text Link
remains identifiable inside prose or dense content even without hover.

API Health pairs color with text and shape, so connection state does not depend
on color alone.

### Token impact

Candidate roles require:

- navigation hover, current-route, pressed, and focus-visible mappings;
- Detail Back Link icon and neutral-label mappings;
- Inline Text Link foreground and quiet/strong underline mappings;
- online, checking, and offline status colors plus checking-spinner motion.

No new navigation geometry token is required. Production tokens remain
unchanged until experiment gate E2.

### Component and pattern impact

`NAV-CMP-001`–`NAV-CMP-004` and `SYS-CMP-001` are approved. Sidebar Shell and
Brand Header remain deferred Patterns whose current placement and composition
are preserved.

### Exceptions

Mobile navigation placement remains a later application-shell decision.
Checking animation must slow under Reduced Motion. Visited styling is not
exposed unless a future product decision finds browsing history useful.

### Follow-up

Mark B03 approved and begin B04 Forms and Filtering.

## UI-DEC-013 — Approve the B04-A hybrid field and filter direction

- Date: 2026-07-18
- Inventory IDs: `FRM-CMP-001`–`FRM-CMP-003`, `FRM-CMP-007`,
  `FRM-CMP-009`, `FLT-CMP-001`, `FLT-CMP-002`
- Batch: B04-A Field, Select, and Filter
- State: Approved
- Approved by: User

### Context

B04-A compared two coordinated field directions:

- Instrument: edge-highlight Dark Glass Filter Bar, near-black Inset Control,
  and uppercase mono labels;
- Quiet: Editorial Outline Filter Bar, panel-colored controls, and
  Sentence-case labels.

The comparison also demonstrated a shared Select overlay, field errors,
disabled/read-only values, and the retained native date-time picker.

### Decision

Approve a hybrid direction:

- **Instrument Filter Bar** — edge-highlight Dark Glass;
- **Instrument Field Surface** — near-black Inset Control;
- **Quiet Label** — Sentence-case interface label.

Approve one 40px Precise field shell shared by Select, Text, and Date/Time
fields. Select dropdowns use a raised overlay with distinct hovered, selected,
and disabled options. Selected options use Mint Soft plus a checkmark.

Field anatomy is:

1. Sentence-case label and optional required marker;
2. control;
3. helper copy or field-associated error.

The native `datetime-local` picker remains unchanged.

### Reasoning

Dark Glass gives a grouped filter region sufficient separation from its data
without adding a heavy complete outline. Near-black fields create a clear input
well inside both Filter and Editor contexts.

Sentence-case labels prevent repeated form grids from becoming visually harsh
or resembling dense telemetry headers. Technical character remains in the
surface precision, data typography, and state language rather than depending
on uppercase labels everywhere.

### Token impact

Candidate roles require:

- 40px default field height and 4px control radius;
- near-black input surface and neutral default/hover boundaries;
- Brand Mint focus/open boundary plus restrained outer ring;
- Sentence-case label, helper, required marker, and field-error roles;
- raised dropdown surface and option hover/selected/disabled roles;
- edge-highlight Dark Glass Filter Bar composition.

Production tokens remain unchanged until experiment gate E2.

### Component and pattern impact

Filtering and editing consume the same Select and field anatomy. Their behavior
differs, but their visual primitive does not. Page-local filter CSS should
eventually retain layout only after migration.

### Exceptions

Dense table-entry Number Inputs may require a shorter field variant during
B04-B. Read-only fields remain legible but must not resemble enabled inputs.
Native date/time picker visuals may vary by browser and operating system.

### Follow-up

Proceed to B04-B Checkbox, Number Input, Rating Slider, and Textarea.

## UI-DEC-014 — Approve B04-B data-entry controls

- Date: 2026-07-18
- Inventory IDs: `FRM-CMP-004`–`FRM-CMP-006`, `FRM-CMP-008`
- Batch: B04-B Data-entry Controls
- State: Approved
- Approved by: User

### Context

B04-B compared two Checkbox selected treatments, two Rating Slider thumb
treatments, and 34px versus 36px Dense Number Input heights. Regular Number
Input and Textarea inherited the B04-A field language.

### Decision

Approve:

- **Filled Checkbox** — 18px Precise control with solid Brand Mint checked
  surface and dark checkmark;
- **Solid Slider Thumb** — Brand Mint thumb and filled progress bar on a
  near-black track;
- **34px Dense Number Input** for Match statistics tables;
- **40px Regular Number Input** with vertical up/down steppers;
- Textarea with the approved near-black field surface, Sentence-case label,
  four-row minimum, and autosize growth.

This closes B04 Forms and Filtering.

### Reasoning

Filled Checkbox provides the strongest persistent boolean signal across both
form and dense-table contexts. Solid Slider Thumb gives dragging and current
position more visual certainty, while the always-visible numeric value prevents
the rating from depending on thumb position alone.

The 34px Number Input preserves technical-statistics table density without
forcing the regular form field below the approved 40px height.

### Token impact

Candidate roles require:

- 18px Checkbox size, Brand Mint checked fill, dark checked foreground, and
  shared hover/focus/pressed/disabled roles;
- regular 40px and dense 34px Number Input heights;
- vertical stepper divider, hover, pressed, and boundary-disabled roles;
- near-black Slider track, Brand Mint bar and solid thumb, and visible value
  output;
- Textarea minimum-height and resize/autosize rules.

Production tokens remain unchanged until experiment gate E2.

### Component and pattern impact

All remaining B04 components are approved. Dense Number Input is a sizing
variant of the shared Number Input, not a separate statistics-only visual
system. Textarea remains part of the shared Field Anatomy.

### Exceptions

Slider validation appears only where a bounded value can genuinely fail.
Touch-first scenario validation may enlarge Checkbox, stepper, or Slider
targets responsively. Textarea autosize must not displace critical actions
outside a usable reading order.

### Follow-up

Mark B04 approved and begin B05 Status, Tags, Identity, and Compact Data.

## UI-DEC-015 — Fix B05-A geometry and revise Badge/Tag material

- Date: 2026-07-18
- Inventory IDs: `STA-CMP-001`, `TAG-CMP-001`–`TAG-CMP-004`
- Batch: B05-A Status and Tags
- State: Approved with adjustment
- Approved by: User

### Context

The first B05-A comparison paired Precise 4px or Compact 8px geometry with
complete Outline or Soft Fill treatments. It also compared informational-blue
and neutral treatments for Completed.

### Decision

Approve:

- **Precise 4px** geometry;
- **neutral Completed** semantics.

Reject both first-pass material treatments:

- complete Outline;
- complete Soft Fill.

Both treatments create generic pill-badge chrome and read as visually cheap in
the intended near-black, modern technical interface.

Retain the established semantic mapping and component separation while
exploring broader boundary languages:

- Open Marker;
- Edge Plate;
- Corner Bracket;
- Cut-corner Tab.

### Reasoning

The issue is not merely border alpha or fill opacity. Complete compact outlines
and small tinted capsules recall generic administration templates and reduce
the editorial/technical character established in B01–B04.

Partial edges, open compositions, structural brackets, or shaped neutral
plates can preserve compact grouping without turning every status and tag into
a colored pill.

### Token impact

Keep the approved 4px compact shape role and neutral Completed mapping. Do not
promote full badge-outline or badge-soft-fill roles.

Explore partial edge, marker, bracket, cut-corner, and neutral-plate roles.
Semantic colors should remain restrained signals rather than large-area fills.

### Component and pattern impact

Status, Base Tag, Event Stage Chip, Compact Match Stage Badge, and Result Tag
remain valid components. Their shared material treatment returns to exploration.
Count Badge remains in B05-A and should adapt to the selected language.

### Exceptions

Winner continues to require Trophy or another non-color signal. Long embedded
Match tags still require truncation plus an accessible full label. Event Stage
Chip remains roomier than the compact Match representation.

### Follow-up

Produce B05-A.2 across Status, Count, Stage, Result/Winner, and embedded Match
contexts using the four revised material directions.

## UI-DEC-016 — Remove Corner Bracket and merge gradient into Edge Plate

- Date: 2026-07-18
- Inventory IDs: `STA-CMP-001`–`002`, `TAG-CMP-001`–`004`
- Batch: B05-A.3 Status and Tags
- State: Revise
- Approved by: User

### Context

B05-A.2 compared Open Marker, Edge Plate, Corner Bracket, and Cut-corner Tab
across status, count, Event Stage, Result, and compact Match contexts.

### Decision

Remove **Corner Bracket** from the candidate system.

Do not continue **Cut-corner Tab** as a separate badge silhouette. Instead,
retain its directional gradient as a material reference and test that depth
inside the approved Precise 4px geometry of **Edge Plate**.

The focused B05-A.3 comparison keeps Open Marker as an uncontained reference
and compares three Edge Plate materials:

- Flat Edge;
- Neutral Gradient Edge;
- restrained Semantic Trace Gradient Edge.

### Reasoning

Corner Bracket adds conspicuous decorative structure without improving compact
status or tag comprehension. Cut corners give the component too much silhouette
for frequent use, but their directional light provides useful technical depth.
Separating material from silhouette allows Edge Plate to gain character without
turning every label into a novelty shape.

### Token impact

Do not create corner-bracket or cut-corner shape roles. Continue using the
approved 4px compact radius.

Explore a shared neutral directional-highlight role and, separately, a very
low-alpha semantic gradient trace. The semantic edge remains the primary
color signal; the gradient must not become another broad Soft Fill treatment.

### Component and pattern impact

Semantic Status, Count Badge, Base Tag, Event Stage Chip, Result Tag, and
Compact Match Stage Badge are included in the focused comparison. Component
scale and overflow differences remain unchanged.

### Exceptions

Winner retains Trophy plus gold. Completed remains neutral. Open Marker remains
only a comparison reference until a contained or open direction is approved.

### Follow-up

Produce B05-A.3 with Flat, Neutral Gradient, and Semantic Trace Edge Plate
treatments, including normal and long labels. Keep B05-A in `Revise` until the
material direction is explicitly approved.

## UI-DEC-017 — Neutral Gradient default with restricted Open Marker variant

- Date: 2026-07-18
- Inventory IDs: `STA-CMP-001`–`002`, `TAG-CMP-001`–`004`
- Batch: B05-A.3 Status and Tags
- State: Approved with adjustment
- Approved by: User

### Context

B05-A.3 retained Open Marker as an uncontained reference and compared Flat,
Neutral Gradient, and Semantic Trace materials inside the revised Edge Plate.

### Decision

Approve **Neutral Gradient Edge Plate** as the default material for the shared
Badge/Tag family.

Retain **Open Marker** as a restricted, uncontained variant rather than a second
default family. It is eligible only when:

- the parent row, card, table cell, or metadata rail already supplies clear
  containment and alignment;
- the status/tag is subordinate inline metadata rather than an independently
  grouped value;
- removing the plate reduces nested chrome without weakening label ownership.

Open Marker is not the default for Count Badge, Result Tag, Winner, standalone
tag groups, or ambiguous/floating placement. Those contexts continue to use
Neutral Gradient Edge Plate.

### Reasoning

Neutral Gradient gives frequent compact labels enough boundary, grouping, and
technical depth without returning to a full outline or semantic Soft Fill.
Open Marker remains useful inside strongly structured parents, where another
plate can create unnecessary nested chrome.

Treating Open Marker as a variant of the same component grammar preserves one
typography, spacing, signal, and semantic-color system. It avoids creating two
interchangeable badge families whose usage would drift page by page.

### Token impact

Approve candidate roles for:

- a near-black compact plate;
- a neutral directional highlight;
- a subtle top edge highlight;
- a 2px semantic leading edge;
- an open-marker 2px semantic rail variant.

Do not promote Semantic Trace fill, Flat Edge, complete Outline, Soft Fill,
Corner Bracket, or Cut-corner silhouette roles. Both approved variants use the
4px compact radius where a plate exists and the same semantic signal colors.

### Component and pattern impact

Semantic Status, Count Badge, Base Tag, Event Stage Chip, Compact Match Stage
Badge, and Result Tag are approved for B05-A. Event Stage remains roomier than
its compact Match reuse.

Later table, archive-row, and product-pattern scenario reviews may assign Open
Marker where the eligibility rules are satisfied. They may not redefine its
visual language locally.

### Exceptions

Winner retains Trophy plus gold. Completed remains neutral. Long compact Match
labels truncate with an accessible full label, while the roomier Event Stage
component may wrap.

### Follow-up

Close B05-A. Continue B05 with Identity and Compact Data components. Confirm
actual Open Marker placements during later table and product-pattern scenario
validation.

## UI-DEC-018 — Separate loaded Logo Artwork from fallback framing

- Date: 2026-07-18
- Inventory IDs: `IDN-CMP-001`
- Batch: B05-B.2 Identity
- State: Approved with adjustment
- Approved by: User

### Context

The first B05-B Identity comparison applied Neutral Frame, Color Edge, or Open
Mark treatments to both loaded Logo Artwork and missing/failed fallbacks. The
user identified two real asset constraints: arbitrary logo proportions must
never be clipped, and dark lettering in many imported basketball logos can
disappear against the near-black canvas.

### Decision

Loaded Logo Artwork always uses an **Open Artwork** layout:

- no outer border;
- no glow or shadow;
- no decorative gradient;
- no recoloring;
- no rounded clipping;
- original aspect ratio preserved with `contain`;
- visible safe area at Compact, Match, and Profile sizes.

Contrast treatment is a separate per-asset choice:

- **Transparent** for self-contained or dark-background-compatible artwork;
- **Light Matte** for artwork containing black or other dark lettering.

Light Matte is a neutral backing with safe padding, not a frame. It has no
border, shadow, glow, or effect applied to the artwork.

Neutral Frame and Color Edge remain candidates only for the missing/failed
Initials fallback.

### Reasoning

A universal decorative frame risks clipping wide or edge-touching assets and
competes with the identity already encoded by a real logo. Conversely,
transparent rendering alone cannot guarantee contrast for artwork authored for
light backgrounds.

Separating layout, contrast backing, and fallback presentation preserves source
artwork while solving the dark-lettering problem without synthetic outlines or
glows.

### Token impact

Approve candidate roles for a transparent artwork safe area and a neutral light
matte. Do not create loaded-logo border, glow, gradient, recoloring, or clipping
roles.

The exact matte value remains subject to contrast validation. Fallback surface
and team-color edge roles remain in review.

### Component and pattern impact

Entity Logo / Initials Mark becomes one shared component with distinct loaded
artwork and fallback branches. Loaded artwork receives a contrast-mode input;
fallback receives derived initials and optional data-driven Team color.

### Exceptions

Archived/historical treatment remains a separate state decision and must not be
silently implemented by the default Open Artwork mode. Whether contrast mode is
stored as Team data is an implementation/schema decision outside this component
review.

### Follow-up

Review Transparent and Light Matte against dark wordmarks, self-contained
emblems, and wide artwork. Decide fallback style and fallback content
independently. Keep B05-B open for Compact Data decisions.

## UI-DEC-019 — Move logo contrast from Artwork to Logo Stage

- Date: 2026-07-18
- Inventory IDs: `IDN-CMP-001`, `IDN-CMP-002`
- Batch: B05-B.3 Identity
- State: Approved with adjustment
- Approved by: User

### Context

B05-B.2 demonstrated that a light matte restores black lettering but creates a
visually hard light tile inside the near-black interface. The artwork-level
treatment also conflated source rendering with the surrounding Team
composition.

### Decision

Remove **Light Matte** from Logo Artwork.

Keep Logo Artwork responsible only for loading, failure, intrinsic aspect
ratio, `contain`, and complete uncropped rendering.

Create a separate reusable **Logo Stage** component responsible for:

- layout size and safe padding;
- local contrast behind loaded artwork;
- integration with the surrounding Team Card, Match Team Summary, Team Detail,
  and editor preview contexts;
- hosting the fallback mark when artwork is missing or fails.

B05-B.3 compares:

- Transparent as the failure/reference case;
- Soft Neutral Well;
- Directional Gradient Stage;
- Card-integrated Contrast Bay.

### Reasoning

Contrast is a relationship between artwork and its presentation environment,
not an intrinsic modification of the logo file. A separate stage can provide
enough neutral luminance for black lettering while controlling how that field
merges into different parent compositions.

This avoids universal white tiles, synthetic outlines, logo recoloring, and
page-local one-off fixes.

### Token impact

Remove the candidate Light Matte artwork role. Explore neutral contrast-high,
contrast-mid, and contrast-low stage roles plus a directional fade into the
surrounding surface.

No stage candidate may add a logo border, logo glow, crop, stretch, or color
filter.

### Component and pattern impact

`IDN-CMP-001` becomes the lower-level Logo Artwork / Initials Fallback
primitive. `IDN-CMP-002` Logo Stage becomes the reusable contrast and sizing
component consumed by Team-related product patterns.

The exact Team Card, Match Summary, and Team Detail layouts remain pattern
decisions; the preview uses them only to validate whether one stage treatment
can travel across contexts.

### Exceptions

Self-contained logos that already work on dark backgrounds may use a
Transparent stage. Data-driven Team color remains separate from neutral
contrast unless a later candidate explicitly proves a contrast-safe role.

Whether a Team stores an explicit stage mode remains an implementation/schema
decision outside this review.

### Follow-up

Review the four stage treatments across compact, opposing-team, profile, and
mobile layouts. After a stage direction is chosen, return to fallback content
and Compact Data decisions.

## UI-DEC-020 — Replace expressive Logo Stages with a flat light container

- Date: 2026-07-18
- Inventory IDs: `IDN-CMP-001`, `IDN-CMP-002`
- Batch: B05-B.4 Identity
- State: Revise
- Approved by: User

### Context

B05-B.3 tested Soft Neutral Well, Directional Gradient Stage, and
Card-integrated Contrast Bay in Team Card, Match Team Summary, and Team Detail
contexts. None produced an acceptable visual result.

### Decision

Reject:

- Soft Neutral Well;
- Directional Gradient Stage;
- Card-integrated Contrast Bay.

Replace the Logo Stage exploration with one deliberately plain **Team Logo
Container**:

- square geometry;
- flat light-neutral surface;
- 4px radius;
- fixed safe padding;
- no gradient;
- no border;
- no shadow or glow;
- no Team-color decoration;
- Logo Artwork rendered with `contain`, without crop, stretch, or recoloring.

B05-B.4 compares only three light-neutral values. Material and geometry are no
longer open alternatives.

### Reasoning

The component exists to make arbitrary imported Team logos legible and
geometrically predictable. Expressive integration added visual authorship where
the source logo should remain the identity.

A plain contrast container makes the functional exception explicit and keeps
its behavior identical across Team Card, Match, Team Detail, and editor preview
contexts.

### Token impact

Do not create neutral-stage gradient, contrast-bay, logo-border, logo-glow, or
team-color-stage roles.

Explore one semantic light logo-surface token. The exact neutral value remains
in review. Reuse the approved 4px radius and define size/safe-padding variants
at the component level.

### Component and pattern impact

`IDN-CMP-002` becomes Team Logo Container rather than a general expressive Logo
Stage. It hosts `IDN-CMP-001` Logo Artwork / Initials Fallback.

Product patterns choose the appropriate Compact, Match, or Profile size but do
not restyle the container material.

### Exceptions

No automatic pixel-analysis behavior is approved. Archived treatment and
fallback content remain separate decisions. A future implementation must test
real assets containing both dark and light details before finalizing the exact
surface value.

### Follow-up

Choose Soft Gray, Light Neutral, or Bright Gray. Then close Team Logo Container
geometry/material and return to fallback content plus Compact Data.

## UI-DEC-021 — Supersede Logo Container and reopen B02 for a midtone surface

- Date: 2026-07-18
- Inventory IDs: `SUR-CMP-004`, `IDN-CMP-001`, `IDN-CMP-002`
- Batch: B02-C Midtone Surface Addendum
- State: Revise
- Approved by: User

### Context

B05-B.4 interpreted the requested brighter container as a square Team-logo-only
component. The user clarified that the intended exploration belongs at the B02
surface layer: a new basic container materially brighter than the approved
near-black surfaces, but substantially darker than the B05-B.4 Soft Gray logo
tile.

### Decision

Supersede the B05-B.4 Team Logo Container direction. Do not proceed with a
nested light square around Team logos.

Reopen B02 only through a bounded addendum for **Midtone Contrast Surface**.
This is a complete content container on which Logo Artwork and interface
content coexist directly.

B02-C compares:

- current edge-highlight Dark Glass as reference;
- Deep Midtone;
- Balanced Midtone;
- Light Midtone.

The comparison must determine both the surface value and its usage scope:

- shared contextual surface;
- or restricted Identity/Media surface.

### Reasoning

The contrast problem may be solved by introducing a new surface tier rather
than nesting an unrelated light component inside an otherwise dark Team card.
Because this changes the container hierarchy and foreground relationships, it
must be evaluated alongside existing B02 contexts rather than hidden inside the
Logo Artwork primitive.

### Token impact

Do not add the B05-B.4 light logo-surface token. Explore one semantic midtone
surface role plus matching strong, normal, muted, divider, and edge-highlight
roles.

The role must not silently replace the approved Editor Outline or Data/Summary
Dark Glass assignments without cross-context approval.

### Component and pattern impact

Add `SUR-CMP-004` Midtone Contrast Surface. Reject `IDN-CMP-002` Team Logo
Container as a mis-scoped component direction.

`IDN-CMP-001` Logo Artwork remains undecorated and may be placed directly on
the new surface when its contrast is sufficient.

### Exceptions

The B02 addendum does not reopen Editorial Outline, Dark Glass, Open Well,
Compact Fact, Page Header, or Section Header decisions. It evaluates only the
new surface tier and its contextual assignment.

### Follow-up

Review the three midtone values across Identity, Editor Preview, and Data
Summary. Decide whether the surface is general-purpose or limited to
Identity/Media content before returning to B05.

## UI-DEC-022 — Fix Deep Midtone brightness and revise its material

- Date: 2026-07-18
- Inventory IDs: `SUR-CMP-004`
- Batch: B02-C.2 Midtone Material
- State: Revise
- Approved by: User

### Context

B02-C compared Deep, Balanced, and Light Midtone values. The user confirmed
that Deep Midtone is already approximately bright enough to solve the dark-logo
visibility problem, but its flat material does not yet look acceptable.

### Decision

Use **Deep Midtone** as the working brightness baseline. Do not continue raising
the entire surface toward Balanced or Light Midtone in this revision.

Revise material at the same base value by comparing:

- Flat reference;
- Light Glass;
- Ambient Gradient Light;
- restrained Glass plus Ambient combination.

Ambient light uses primarily neutral light near artwork and only a weak mint
directional contribution away from essential black logo detail.

### Reasoning

The remaining problem is material character rather than basic luminance.
Holding brightness stable isolates whether directional highlights,
translucency, or a restrained gradient can add depth without recreating a hard
light tile or making the container an obvious glow effect.

### Token impact

Keep the Deep Midtone surface value provisional. Explore midtone glass alpha,
directional neutral highlight, low-alpha ambient neutral light, optional weak
mint ambient light, and edge-highlight roles.

Do not promote a broad mint fill, logo glow, or higher global surface value.

### Component and pattern impact

`SUR-CMP-004` remains in review. B02-C.2 tests Identity as the primary case and
Data Summary plus Compact Identity as scope checks.

### Exceptions

Backdrop blur is meaningful only where underlying content or ambient light can
actually contribute. A production implementation must not retain blur solely
as an invisible performance cost.

### Follow-up

Choose Flat, Light Glass, Ambient Gradient, or the restrained combination.
Then decide whether `SUR-CMP-004` is restricted to Identity/Media or assigned to
another established context.

## UI-DEC-023 — Focus B02-C on brighter, more transparent Light Glass

- Date: 2026-07-18
- Inventory IDs: `SUR-CMP-004`
- Batch: B02-C.3 Light Glass Tuning
- State: Revise
- Approved by: User

### Context

B02-C.2 compared Flat, Light Glass, Ambient Gradient, and a restrained combined
material at fixed Deep Midtone brightness. The user selected Light Glass for
further exploration and requested testing a somewhat brighter glass color with
greater transparency.

### Decision

Pause Flat, Ambient Gradient, and Glass plus Ambient as active alternatives.
Tune **Light Glass** through two independent variables:

- brightness: Deep, Lifted, Bright;
- opacity: Dense `88%`, Balanced `76%`, Airy `64%`.

Keep the same restrained directional highlight, edge highlight, blur, and
underlying low-intensity environment across the matrix.

### Reasoning

A brighter glass color can improve dark artwork visibility, while lower opacity
may prevent that brightness from reading as a heavy gray block. Separating the
two variables avoids mistaking translucency for luminance.

### Token impact

Explore a Light Glass base color, glass opacity, backdrop blur, and directional
highlight as separate candidate roles. Do not encode one opaque composite color
before the combination is approved.

### Component and pattern impact

`SUR-CMP-004` remains in review across Identity, Data Summary, and Compact
Identity. The same selected combination must remain usable at compact and
responsive sizes.

### Exceptions

Backdrop blur requires a meaningful underlying environment and a non-blur
fallback. Reduced Transparency preferences, browser support, and performance
must be considered during implementation planning.

### Follow-up

Choose one brightness and one opacity. Then decide usage scope and close the
B02-C addendum.

## UI-DEC-024 — Fix Deep Light Glass and lower opacity below 64%

- Date: 2026-07-18
- Inventory IDs: `SUR-CMP-004`
- Batch: B02-C.4 Light Glass Opacity
- State: Revise
- Approved by: User

### Context

B02-C.3 independently compared Deep, Lifted, and Bright Light Glass colors with
`88%`, `76%`, and `64%` opacity.

### Decision

Fix **Deep** as the selected Light Glass brightness. Remove Lifted and Bright
from active comparison.

Continue lowering opacity through:

- `64%` reference;
- `52%`;
- `40%`.

Keep highlight, blur, foreground, divider, and underlying environment constant.

### Reasoning

Deep already provides sufficient base contrast. Lower opacity may make the new
surface feel lighter and less block-like without increasing its nominal color
value.

### Token impact

Keep one provisional Deep Light Glass color. Tune only its surface alpha in this
round. Do not derive additional brightness variants.

### Component and pattern impact

`SUR-CMP-004` remains in review across Identity, Data Summary, Compact Identity,
and responsive layouts.

### Exceptions

At lower opacity, effective contrast depends more strongly on the underlying
surface. The eventual component must document its permitted parent surfaces and
provide a non-blur fallback.

### Follow-up

Choose `64%`, `52%`, or `40%`. Then decide usage scope and close B02-C.

## UI-DEC-025 — Select 40% Deep Light Glass and add Background System review

- Date: 2026-07-18
- Inventory IDs: `SUR-CMP-004`, `FND-011`
- Batch: B02-C.4 / B01-C Background Addendum
- State: Approved with adjustment
- Approved by: User

### Context

B02-C.4 compared Deep Light Glass at `64%`, `52%`, and `40%` opacity. The user
accepted `40%` and then identified that the global application background had
not received a dedicated design review.

E0 approved Canvas color `#131313`, but later specimens used unapproved flat,
neutral-radial, and mint-ambient backgrounds as temporary visualization
environments.

### Decision

Approve **Deep Light Glass at `40%` opacity** as the material setting for
`SUR-CMP-004`, subject to final validation against the approved Background
System and a usage-scope decision.

Add a bounded Foundation review for the **Application Background System**.
Keep `#131313` as the approved Canvas base while comparing possible treatments
above it.

The background review must decide:

- flat versus ambient-light treatment;
- neutral versus Brand Mint contribution;
- global versus localized light placement;
- whether grid/noise texture exists;
- responsive behavior;
- Reduced Transparency and non-blur fallbacks.

### Reasoning

At `40%` opacity, the effective color and legibility of Light Glass depend
substantially on the pixels behind it. Finalizing the surface without defining
the environment would encode an accidental preview background as a hidden
dependency.

### Token impact

Approve the provisional Deep Light Glass color and `40%` alpha combination.
Do not yet formalize its effective rendered color.

Add candidate background roles only if the review approves them; preserve
`#131313` as the underlying Canvas token.

### Component and pattern impact

`SUR-CMP-004` remains `Review` for background compatibility and usage scope.
All existing approved surfaces must be included in the background comparison,
not only the new glass.

### Exceptions

Temporary ambient lighting used in earlier preview files is not an approved
Background System. Decorative texture must not impair text, focus rings, data
visualizations, or long-session comfort.

### Follow-up

Run B01-C Background System Addendum using representative application content
and both approved Dark Glass and provisional 40% Deep Light Glass. Then return
to B02-C for final usage-scope approval.

Review artifact: `b01-background-system-lab.html`, comparing Flat Neutral
Black, Neutral Ambient, Mint Ambient, and Technical Field with identical page
content.

## UI-DEC-026 — Approve Neutral Ambient and the 40% Team Identity Surface

- Date: 2026-07-18
- Inventory IDs: `FND-011`, `SUR-CMP-004`
- Batch: B01-C Background System / B02-C Surface Addendum
- State: Approved
- Approved by: User

### Context

B01-C compared Flat Neutral Black, Neutral Ambient, Mint Ambient, and Technical
Field behind identical Sidebar, Dark Glass, Editorial Outline, and 40% Deep
Light Glass content. The outstanding B02-C question was whether the selected
glass material should remain a broad contextual surface or become the special
Team card treatment that motivated the contrast work.

### Decision

Approve **B — Neutral Ambient** as the application background above Canvas
`#131313`.

Approve **Deep Light Glass at `40%` opacity** as the special **Team Identity
Surface** used by Team cards and directly related Team identity/media contexts.

### Reasoning

Neutral Ambient gives translucent surfaces visible depth without putting Brand
Mint or a persistent technical texture behind every page. The 40% Team surface
is bright enough to support dark logo artwork while remaining integrated with
the near-black system.

Restricting that surface to Team identity prevents a locally useful contrast
solution from weakening the established Data/Summary Dark Glass and Editor
Outline hierarchy.

### Token impact

Keep Canvas `#131313`. Add two broad neutral-white ambient fields at
approximately `6%` and `3.5%` opacity. Do not add global Brand Mint, grid, or
noise background roles.

Retain the provisional Deep Light Glass color with `40%` surface alpha. Its
production semantic token name and non-blur fallback will be finalized during
formalization.

### Component and pattern impact

`FND-011` and `SUR-CMP-004` are approved. Rename the latter from the exploratory
Midtone Contrast Surface to **Team Identity Surface** and restrict it to Team
card/identity use. Existing Editor Outline and Data/Summary Dark Glass
assignments remain unchanged.

### Exceptions

Localized Brand Mint ambience may be proposed later for a bounded feature or
visualization, but is not part of the global background. Broader use of the
Team Identity Surface requires explicit review.

### Follow-up

Resume B05 identity work using the approved Team Identity Surface as its
environment. Keep the active `docs/DESIGN.md` and `variables.css` unchanged
until candidate-system gate E2.

## UI-DEC-027 — Approve Neutral Frame with Initials Only

- Date: 2026-07-18
- Inventory IDs: `IDN-CMP-001`
- Batch: B05-B Identity
- State: Approved with adjustment
- Approved by: User

### Context

The loaded Logo Artwork branch and its Team Identity Surface environment were
already resolved. The missing/failed artwork branch still required an
independent frame and content decision.

### Decision

Use **Neutral Frame + Initials Only** for missing or failed Team artwork.

The fallback derives short initials from the entity name and places them inside
the quiet complete Neutral Frame. Retain the frame's restrained short
Team-color lower edge, but do not use the stronger Color Edge treatment. Do not
add a generic crest or shield.

### Reasoning

Initials remain readable at Compact, Match, and Profile sizes and communicate
real entity information. A generic crest adds no identity and competes for
space. The neutral boundary makes the fallback deliberate without competing
with real artwork or the surrounding Team Identity Surface.

### Token impact

Retain neutral fallback surface, boundary, initials text, and the restrained
short data-driven Team-color edge roles. Do not add fallback crest or
directional-trace roles.

### Component and pattern impact

The loaded and fallback branches of `IDN-CMP-001` are now visually defined.
Archived/historical behavior remains the final open Identity state.

### Follow-up

Decide whether archived/historical presentation alters the artwork/fallback
itself or remains a status treatment owned by its parent pattern. Continue the
three Compact Data decisions for summary rhythm, value order, and read-only
rating.

## UI-DEC-028 — Close B05 Identity and Compact Data

- Date: 2026-07-18
- Inventory IDs: `IDN-CMP-001`, `DAT-CMP-001`–`DAT-CMP-003`
- Batch: B05-B Identity and Compact Data
- State: Approved
- Approved by: User

### Context

The final B05 decisions covered archived identity behavior and three compact
read-only data choices: summary organization, label/value order, and Team
rating presentation.

### Decision

Approve the following:

- archived/historical status is owned by the parent pattern; it does not fade,
  desaturate, recolor, or otherwise alter Logo Artwork or Initials fallback;
- Stat Summary Panel uses **Ruled Grid** inside the approved edge-highlight
  Dark Glass Summary surface;
- Stat Value Cell uses **Label-first** order;
- Read-only Star Rating uses **five fractional stars** plus the exact
  `x / 10` value.

### Reasoning

Preserving identity artwork keeps archived Teams recognizable and avoids
conflating entity status with image availability. Ruled Grid provides
comparison structure without introducing nested card chrome. Label-first keeps
the statistic understandable before its value, while fractional stars retain
the familiar visual rating language without sacrificing numerical precision.

### Token impact

Use existing Summary surface, divider, data-label, strong-number, Brand, muted,
and unavailable roles. Add a partial-star fill mechanism if the implementation
cannot express it with the existing rating primitive; do not create a second
rating color system.

### Component and pattern impact

Approve `IDN-CMP-001` and `DAT-CMP-001`–`DAT-CMP-003`. B05 Status, Tags,
Identity, and Compact Data is complete and approved. `IDN-CMP-002` remains a
rejected historical proposal rather than an implementation target.

### Exceptions

Parent patterns may reduce the prominence of archived metadata or actions, but
must retain an explicit non-color archived status and must not make the entity
mark look missing or disabled.

### Follow-up

Proceed to the next component batch. Keep active `docs/DESIGN.md` and
`variables.css` unchanged until candidate-system gate E2.

## UI-DEC-029 — Approve Dark Glass Data Bay with Compact rows

- Date: 2026-07-18
- Inventory IDs: `TBL-CMP-001`–`TBL-CMP-004`, `PGN-CMP-001`–`PGN-CMP-003`
- Batch: B06-A Shared Table and Pagination
- State: Approved
- Approved by: User

### Context

B06-A compared Open Ledger, Dark Glass Data Bay, and Editorial Outline around
the same Player ranking table, with `46px` Balanced and `38px` Compact row
density. It also demonstrated sorting, full-row hover, local horizontal
overflow, and the existing pagination content model.

### Decision

Approve **B — Dark Glass Data Bay** with **38px Compact** rows.

Also approve the demonstrated shared behavior:

- quiet tonal header and horizontal dividers without vertical gridlines;
- restrained neutral full-row scan hover;
- stable ascending/descending sort indicator;
- local horizontal overflow inside the Data Bay;
- pagination as the Bay's final strip with `Showing x–y of z`, compact approved
  Buttons, current-page selection, and disabled boundaries.

### Reasoning

The Data Bay establishes one coherent data region without turning every row
into a card. Compact rows better match frequent sports-statistics scanning,
while the tonal header and horizontal dividers preserve column and row
structure without excessive grid chrome.

### Token impact

Use the approved Dark Glass edge, surface, raised/header, divider, neutral
hover, text, and focus roles. Add a shared `38px` table-row density role and
local scrollbar treatment. Pagination reuses existing Button roles rather than
creating a separate control palette.

### Component and pattern impact

Approve the Unified Data Table, Sortable Column Header, Responsive Table
Viewport, base Table Row, Pagination composition, Pagination Summary, and
Pagination Navigation Button.

Loading and empty content will be supplied by B07 within the approved shell.
Other Statistics Entry Row and Winner Result Row remain in B06-B review.

### Exceptions

Dense Match statistics inputs may contain approved 34px form controls inside
the 38px row while preserving focus-ring visibility. A table may omit
pagination or sorting when its real scenario does not support those behaviors.

### Follow-up

Run B06-B as a focused comparison for the unrelated Other Statistics and Winner
Result row semantics, then close B06.

## UI-DEC-030 — Approve Operational Neutral Other and Championship Gold Winner

- Date: 2026-07-18
- Inventory IDs: `TBL-CMP-005`, `TBL-CMP-006`
- Batch: B06-B Semantic Row Variants
- State: Approved
- Approved by: User

### Context

B06-B independently compared three treatments for the editable Other
Statistics row and three treatments for the read-only Winner Result row inside
the approved Dark Glass Data Bay and `38px` Compact table baseline.

### Decision

Approve:

- **A — Operational Neutral** for Other Statistics Entry Row;
- **B — Championship Gold** for Winner Result Row.

Other uses a restrained neutral alternate fill with a neutral structural
leading rail. Winner uses a restrained directional Gold tint and leading trace,
always paired with Trophy and explicit outcome text.

### Reasoning

Operational Neutral separates team-only inputs from player-attributed rows
without falsely communicating warning, error, selection, or disabled state.

Championship Gold gives an actual outcome its own semantic identity and avoids
overloading Brand Mint across brand, action, active, and winner meanings.
Trophy and result text ensure the winner never depends on color alone.

### Token impact

Add dedicated operational-row surface, rail, and hover roles using neutral
values. Add dedicated winner surface, trace, icon, and hover roles using the
Championship Gold family. Do not alias either family to the other or to Brand
Mint.

### Component and pattern impact

Approve `TBL-CMP-005` and `TBL-CMP-006`. Both retain the shared Data Bay
geometry, columns, density, and responsive viewport. B06 Tables and Pagination
is complete and approved.

### Exceptions

Validation errors inside an Other row remain field-level errors and do not
replace the operational row treatment. Winner hover must strengthen or preserve
the Gold identity rather than reverting to the ordinary neutral row hover.

### Follow-up

Begin B07 Feedback and Confirmation. Keep active `docs/DESIGN.md` and
`variables.css` unchanged until candidate-system gate E2.

## UI-DEC-031 — Approve Edge Signal and Open Content feedback

- Date: 2026-07-18
- Inventory IDs: `FDB-CMP-001`–`FDB-CMP-005`
- Batch: B07-A Feedback States
- State: Approved
- Approved by: User

### Context

B07-A compared Edge Signal, Tonal Band, and Semantic Outline across persistent
feedback tones, plus Open Content and Dashed Field for filtered and compact
empty states. It also demonstrated shape-preserving Skeleton, bounded Spinner,
and recoverable section Error/Retry inside approved component shells.

### Decision

Approve **A — Edge Signal** for persistent feedback and **A — Open Content**
for Empty States.

Also approve:

- Skeleton for shape-preserving initial loading;
- labeled Spinner for bounded indeterminate work without useful target shape;
- static Skeleton fallback under Reduced Motion;
- Error/Retry retained in the failed module's position;
- retained successful content during non-blocking refresh failure.

### Reasoning

Edge Signal communicates semantic severity without filling large interface
areas with warning or error color. Open Content avoids creating another
container inside an existing Data Bay or section. Separating Skeleton and
Spinner by information continuity produces predictable loading behavior rather
than competing visual options.

### Token impact

Add semantic feedback rail, weak trace, compatible surface, icon, and hover or
action-composition roles for information, warning, danger, and established
success. Reuse approved surface, text, Button, link, and focus roles. Skeleton
requires animated and static reduced-motion states.

### Component and pattern impact

Approve `FDB-CMP-001`–`FDB-CMP-005`. Empty, loading, and error content may
appear inside the approved Data Bay and other module shells without changing
their outer geometry.

### Exceptions

Success is not a mandatory banner after every save. Toasts remain outside the
established MVP inventory. A non-blocking refresh must not disable unrelated
controls or replace usable retained content with Skeleton.

### Follow-up

Run B07-B for Confirmation Dialog geometry, action order, destructive and
restorative semantics, loading, and retained confirmation errors.

## UI-DEC-032 — Approve Raised Dark Glass and Trailing Pair confirmation

- Date: 2026-07-18
- Inventory IDs: `OVR-CMP-001`
- Batch: B07-B Confirmation Dialog
- State: Approved with adjustment
- Approved by: User

### Context

B07-B compared Raised Dark Glass, Editorial Outline, and Raised Tonal shells,
plus Trailing Pair and Split Actions across Archive, Restore, and Discard
scenarios. The user approved A + A but found the Restore symbol's original
accent-colored line too difficult to distinguish against the near-black
background.

### Decision

Approve **A — Raised Dark Glass** with **A — Trailing Pair**.

For Restore, replace the low-contrast accent glyph with a restore/return arrow
in Strong foreground over a restrained Brand Mint field with a visible Mint
boundary. Restore continues to use the normal important-action button rather
than Danger.

Archive, Void, and Discard retain the Danger confirmation role.

### Reasoning

The modal is a real overlay and therefore justifies stronger depth than base
panels. Trailing actions preserve the relationship between Cancel and the named
consequence. Separating the Restore icon's foreground from its semantic field
keeps the symbol readable without falsely turning restoration into a dangerous
action.

### Token impact

Use approved overlay, raised Dark Glass, strong edge, shadow, radius, text,
Danger, normal important-action, and focus roles. Add a Restore icon field that
combines restrained Brand Mint surface/border roles with Strong foreground;
do not use a low-opacity Brand glyph as the only signal.

### Component and pattern impact

Approve `OVR-CMP-001` and close B07. Confirming disables both actions, retained
errors remain inside the dialog, narrow layouts stack full-width actions, and
focus is trapped/restored according to modal behavior.

### Exceptions

Restorative actions are important but not dangerous. A confirmation error does
not close the dialog or erase the consequence copy.

### Follow-up

The Foundation/Component design batches B01–B07 are complete. Prepare the next
round boundary before beginning product-specific Pattern and Scenario work.

## UI-DEC-033 — Approve Score Ledger with Open Stacks

- Date: 2026-07-18
- Inventory IDs: `TEM-PAT-001`, `TEM-PAT-002`
- Batch: Team Pattern — Overview
- State: Approved
- Approved by: User

### Context

The first Team Pattern comparison preserved the established Teams overview
content—Logo, name, total points, overall rating, Division grouping, and
complete-card detail navigation—while comparing three card compositions and
two Division Board structures.

### Decision

Approve:

- **Score Ledger** for Team Identity Card;
- **Open Stacks** for Division Team Board.

### Reasoning

Score Ledger gives total points a stable numeric column and retains the complete
five-star rating as a separate comparison row without adding a nested Logo
container.

Open Stacks keeps Division as information hierarchy rather than another card
shell. Each Division remains an uncontained labeled section and owns its
responsive Team grid.

### Token impact

Reuse the approved `40%` Team Identity Surface, Logo/Fallback, star-rating,
numeric typography, divider, Team-color cutline, hover, pressed, and focus
roles. No new Division container surface is introduced.

### Component and pattern impact

Approve `TEM-PAT-001` and `TEM-PAT-002`. Preserve long-name truncation,
initials fallback, complete-card navigation, and responsive one-column
collapse.

### Exceptions

Teams overview contains active Teams only. Archived Team presentation belongs
to Team Detail and historical contexts rather than this Board.

### Follow-up

Continue the Team Pattern round with Team Detail Identity Summary and Team
Profile Radar.

## UI-DEC-034 — Approve Unified Field for Team Detail Hero

- Date: 2026-07-18
- Inventory IDs: `TEM-PAT-003`, `TEM-CMP-001`, `TEM-CMP-002`
- Batch: Team Pattern — Detail Hero
- State: Approved
- Approved by: User

### Context

The Team Detail comparison preserved the existing Logo, Team name, Division,
total points, fractional rating, description, five profile ratings, archived
notice, Detail Back Link, and Manage Team action while comparing Balanced
Split, Unified Field, and Editorial Stack compositions.

### Decision

Approve **B — Unified Field**.

Use one shared Team Identity Surface for the Detail Hero. Identity content owns
the leading region and the five-axis Team Profile owns the trailing region,
separated by one structural divider rather than a second card shell.

### Reasoning

Unified Field removes the accidental impression that identity and profile are
two unrelated peer cards. The divider keeps the Radar visually independent
without adding another surface, while the shared field gives the entity Hero a
single readable boundary and a stable desktop-to-mobile relationship.

### Token impact

Reuse the approved `40%` Team Identity Surface, edge highlight, Logo/Fallback,
numeric typography, fractional star rating, Brand Mint visualization,
structural divider, and responsive spacing roles. No new generic surface token
is introduced.

### Component and pattern impact

Approve `TEM-PAT-003`, `TEM-CMP-001`, and `TEM-CMP-002`.

- keep all five Radar values visibly labeled and accessibly described;
- retain the Radar region when profile ratings are unavailable and show its
  explicit no-profile message;
- stack identity before profile on narrow screens;
- keep the archived notice outside the Identity field and hide Manage Team for
  archived Teams;
- preserve Detail Back Link and existing business behavior.

### Exceptions

The Radar remains a dedicated visualization, not a generic Stat Summary Panel.
The shared Identity field is specific to the Team Detail Hero and does not make
the Team Identity Surface a default page container.

### Follow-up

Continue the Team Pattern round with the Team Create/Edit Identity Preview.

## UI-DEC-035 — Approve Identity Proof for Team Editor Preview

- Date: 2026-07-18
- Inventory IDs: `TEM-PAT-004`
- Batch: Team Pattern — Create/Edit Preview
- State: Approved
- Approved by: User

### Context

The Team Create/Edit comparison preserved the live Logo/Initials, Team name,
Division, overall rating, and primary-color feedback while comparing Specimen
Labels, Identity Proof, and Verification Ledger across complete, empty-draft,
and broken-logo states.

### Decision

Approve **B — Identity Proof**.

Use one live identity composition inside the approved Open Well rather than
repeating each edited field as an independently labeled preview row.

### Reasoning

Identity Proof lets the editor evaluate whether Logo, name, Division, rating,
and Team color work together as an identity. It remains clearly a draft preview
without duplicating the final Team Card or turning the preview into a second
form inspector.

### Token impact

Reuse the approved Open Well, Logo Artwork / Neutral Frame + Initials fallback,
fractional star rating, data-driven Team-color cutline, strong/default/muted
text, and responsive spacing roles. No new generic preview surface is added.

### Component and pattern impact

Approve `TEM-PAT-004`.

- update the identity proof live as draft values change;
- use `New Team`, `No division selected`, zero rating, and initials fallback for
  an empty draft;
- replace missing or broken Logo artwork with the approved fallback without
  changing the preview geometry;
- stack Logo before identity content on narrow screens;
- keep submission and validation behavior outside the preview.

### Exceptions

The Identity Proof is an editor preview, not a detail Hero and not a clickable
Team Card. It does not inherit hover, pressed, navigation, points, or Radar
behavior from those patterns.

### Follow-up

The Team-specific Pattern round is complete. Continue with the Player Overview
Statistic Leader Card Set.

## UI-DEC-036 — Preserve Current Leader Card Composition and Revise Its Surface

- Date: 2026-07-18
- Inventory IDs: `PLY-PAT-001`, `PLY-CMP-001`
- Batch: Player Pattern — Overview Leader Cards
- State: Revise
- Approved by: User

### Context

The first Leader Card comparison proposed Scoreplate, Split Ledger, and Signal
Field compositions. The user found all three weaker than the current product
composition and identified the actual deficiencies as the current container
material and missing Hover treatment.

### Decision

Reject all three first-round content compositions.

Preserve the current internal hierarchy exactly:

1. Crown plus statistic label;
2. large category-colored value;
3. Player name;
4. Team name.

Revise only the container material and non-clickable Hover response.

### Reasoning

The current structure already presents the leader and its statistic with an
effective sports-console hierarchy. Changing that hierarchy solved no product
problem and weakened the cards. The remaining work is a narrower material and
state decision.

### Token impact

Retain the four dedicated statistic-category accent roles and existing
typography hierarchy. Explore only pattern-level surface, edge highlight,
category wash, Hover overlay, and transition roles; do not introduce new
content-layout tokens.

### Component and pattern impact

Keep `PLY-PAT-001` and `PLY-CMP-001` in `Revise`. Preserve the four/two/one
column responsive set, explicit no-eligible fallback, equal card geometry,
default cursor, and absence of click, focus, pressed, selected, and navigation
behavior.

### Follow-up

Compare revised container materials around the unchanged current composition,
including default and Hover states.

### Revision feedback

The user preferred **B — Frosted Depth** but requested a stronger category Glow.
Keep Frosted Depth's surface brightness, edge treatment, current content
composition, and Hover behavior fixed while comparing stronger ambient and
Crown Glow levels.

## UI-DEC-037 — Approve Frosted Depth with Strong Glow for Leader Cards

- Date: 2026-07-18
- Inventory IDs: `PLY-PAT-001`, `PLY-CMP-001`
- Batch: Player Pattern — Overview Leader Cards
- State: Approved
- Approved by: User

### Context

After preserving the current Leader Card composition, the revised surface
comparison identified Frosted Depth as the preferred shell. A focused tuning
round then compared Balanced+, Strong, and Vivid category Glow levels in
default and Hover states.

### Decision

Approve:

- **Frosted Depth** as the Statistic Leader Card material;
- **B — Strong** as its category Glow level.

Retain the current Crown + statistic label, large category-colored value,
Player name, and Team name composition.

### Reasoning

Strong Glow gives each statistic category a clearly recognizable atmosphere
without reaching the neon-like dominance of Vivid. Frosted Depth improves the
container quality while retaining the content hierarchy that already works in
the current product.

### Token impact

Add four purpose-specific Leader category accents and derived Strong ambient
Glow / Crown halo roles. Reuse the approved edge-highlight glass, text,
typography, radius, and `160ms` transition roles. The Hover overlay increases
local category light without changing geometry.

### Component and pattern impact

Approve `PLY-PAT-001` and `PLY-CMP-001`.

- keep equal card geometry and four/two/one-column responsive flow;
- keep explicit category labels and dedicated category colors;
- preserve `0.0` plus `No eligible players` when no leader exists;
- strengthen category ambient light and Crown halo on Hover;
- keep the default cursor and omit click, focus, pressed, selected, and
  navigation behavior;
- do not lift or scale the cards.

### Exceptions

The stronger Glow is restricted to these four feature cards. It does not
promote category Glow, Crown halo, or saturated ambient fields to generic panel
or card defaults.

### Follow-up

Continue the Player Pattern round with Player Detail Identity.

## UI-DEC-038 — Approve Number Masthead with Outline Echo

- Date: 2026-07-18
- Inventory IDs: `PLY-PAT-002`
- Batch: Player Pattern — Detail Identity
- State: Approved
- Approved by: User

### Context

The Player Detail Identity comparison preserved Player name, jersey number,
Position, current Team, Detail Back Link, and independently combinable
inactive-Player / archived-Team states while comparing Accent Rail, Roster
Ledger, and Number Masthead. The user preferred Number Masthead but requested a
larger, heavier special number treatment without a redundant Jersey label.

A focused Anton Display comparison then evaluated Monument Solid, Team Core,
and Outline Echo.

### Decision

Approve:

- **Number Masthead** as the Player Detail Identity composition;
- **C — Outline Echo** as the jersey-number treatment.

Render an oversized Anton Display `#number` with a restrained Team-color offset
shadow and outline echo. Do not place a Jersey label above it.

### Reasoning

The number becomes a genuine Player identity mark rather than another labeled
metadata value. Outline Echo adds the requested sports-poster character and
visual impact while the open Masthead keeps the Player name, Team, and Position
readable and structurally separate.

### Token impact

Reuse Anton Display, strong foreground, data-driven Team color, structural
divider, Detail Back Link, and status roles. Add pattern-local Outline Echo and
offset-shadow treatments; do not promote them to generic typography or card
tokens.

### Component and pattern impact

Approve `PLY-PAT-002`.

- place the oversized `#number` before the Player name in reading order;
- omit the Jersey label;
- show Team and Position as explicit facts;
- retain independently combinable Inactive Player and Archived Team status
  markers;
- preserve the Back to Players link;
- stack the number before identity facts on narrow screens;
- keep Awards, Performance Bars, Stat Summary, Event filter, and Match History
  outside this Identity pattern.

### Exceptions

Outline Echo is restricted to the Player Detail jersey-number identity mark.
It is not a generic heading effect, a Team identity treatment, or a reusable
data-value default.

### Follow-up

Continue the Player Pattern round with Player Performance Profile.

## UI-DEC-039 — Approve Segmented Meter for Player Performance Profile

- Date: 2026-07-18
- Inventory IDs: `PLY-PAT-003`
- Batch: Player Pattern — Performance Profile
- State: Approved
- Approved by: User

### Context

The Player Performance Profile comparison preserved the backend-provided
Points, Rebounds, and Assists `0–100` values while comparing Luminous Rail,
Segmented Meter, and Benchmark Line. Every candidate included mixed and all-zero
states plus visible and accessible values.

### Decision

Approve **B — Segmented Meter**.

Use ten visible intervals with a partially filled final interval when required.
Display the numeric value without a percent symbol, for example `84`, `67`, and
`92`.

### Reasoning

Segmented Meter provides the strongest sports-console reading and keeps the
three dimensions immediately comparable. Omitting `%` avoids presenting the
derived leader-relative score as an ordinary percentage statistic even though
its backend calculation is proportional.

### Token impact

Reuse the approved inset track, Brand Mint visualization, Glow, divider,
numeric typography, and `220ms` visualization-transition roles. Add
pattern-local segment gap, filled, partial, and empty interval roles.

### Component and pattern impact

Approve `PLY-PAT-003`.

- retain Points, Rebounds, and Assists in the backend-provided order;
- render each value on a `0–100` ten-segment scale;
- show the exact integer without `%`;
- describe the value as “relative to the current scope leader” in helper and
  accessible text;
- render all intervals empty for zero;
- preserve the actual statistics elsewhere in Stat Summary for context;
- keep the visualization read-only and distinct from Rating Slider.

### Exceptions

These numbers are leader-relative profile values, not percentage-stat fields.
The no-percent-symbol rule does not change FG%, 3PT%, or other real percentage
display conventions.

### Follow-up

Continue the Player Pattern round with Player Awards History.

## UI-DEC-040 — Approve Honors Ledger for Player Awards History

- Date: 2026-07-18
- Inventory IDs: `PLY-PAT-004`
- Batch: Player Pattern — Awards History
- State: Approved
- Approved by: User

### Context

The Player Awards History comparison preserved award type, Event, award-time
Team, optional Notes, multiple-event history, and the explicit no-awards state
while comparing Honors Ledger, Award Index, and Event Stamps.

### Decision

Approve **A — Honors Ledger**.

Use quiet ruled rows. Lead each record with its award type and a non-color
award icon, then show Event and award-time Team as supporting facts. Notes are
optional and their row is omitted entirely when no note exists.

### Reasoning

Honors Ledger is the clearest Player-centric record of honors across Events.
It stays dense and historical without turning each award into another card or
borrowing the more ceremonial MVP and All-Event Team compositions used on
Event Detail.

### Token impact

Reuse the approved section divider, quiet table/ledger rules, Strong and Muted
text roles, data typography, and achievement icon/color roles. Add no new
generic surface or badge token.

### Component and pattern impact

Approve `PLY-PAT-004`.

- preserve Award type, Event, and award-time Team for every record;
- use Trophy for MVP, Star for First Team, and Medal for Second Team so award
  meaning does not depend on color;
- retain current plain Event and Team text behavior rather than introducing
  navigation;
- omit the Notes row when Notes are absent;
- use `No awards in this scope.` for the compact empty state;
- keep the ledger read-only and do not add row hover, pressed, selected, or
  navigation affordances;
- do not reuse Event Detail MVP Award Card or All-Event Team roster cells.

### Exceptions

The ledger is a Player Detail cross-Event history. Event Detail remains free to
present one Event's MVP and All-Event Teams with a more ceremonial hierarchy.

### Follow-up

The Player-specific Pattern round is complete. Continue the Event Pattern round
with Event Tier Badge Family.

## UI-DEC-041 — Approve Tournament Insignia for Event Tier Badge Family

- Date: 2026-07-18
- Inventory IDs: `EVT-CMP-001`
- Batch: Event Pattern — Tier Badge Family
- State: Approved
- Approved by: User

### Context

The first Event Tier comparison established the possible relationship between
the list-card and detail-hero treatments but was judged insufficiently refined.
The revision retained the product's near-black glass, precise edge highlights,
weak radii, and restrained motion while comparing Faceted Seal, Tournament
Insignia, and Prism Monogram.

Every candidate preserved Tier letter and subtitle, the current S/A/B/C accent
mapping, both list and detail contexts, and parent-card-only Hover behavior in
the list.

### Decision

Approve **B — Tournament Insignia**.

Use one recognizable open insignia structure in both contexts: fine structural
rails, a central faceted medallion, the Tier letter, and its subtitle. The list
version is compact; the detail version receives more scale and breathing room
without changing identity.

### Reasoning

Tournament Insignia adds ceremony and refinement through internal structure
rather than stronger card borders, excessive glow, or unrelated ornament. It
is more distinctive than the restrained first pass while remaining compatible
with the approved Editorial Scoreboard language.

### Token impact

Reuse the approved Dark Glass, precise edge-highlight, inset, divider, Glow,
Strong/Muted text, and Data typography roles. Preserve the existing semantic
Tier accent mapping:

- S — Championship Gold;
- A — ultraviolet;
- B — Brand Mint;
- C — neutral gray.

Add pattern-local roles for the open rails, faceted medallion edge, restrained
ambient Tier trace, and list/detail scale. These are not generic Badge tokens.

### Component and pattern impact

Approve `EVT-CMP-001`.

- keep Tier letter and subtitle as the non-color identity signal;
- use the same insignia anatomy in Event Summary Card and Event Detail hero;
- allow context-specific dimensions and spacing without creating two unrelated
  components;
- keep the Tier component itself non-interactive;
- in Event Summary Card, strengthen only the local trace and ambient light when
  the clickable parent card is hovered or keyboard-focused;
- do not add independent cursor, hover, pressed, selected, or focus behavior;
- do not animate or glow the Detail insignia independently;
- remove the current oversized filled-crest assumption.

### Exceptions

The ceremonial internal construction is restricted to Event Tier identity. It
must not become the default treatment for status badges, Result/Stage Tags, or
entity logos.

### Follow-up

Continue the Event Pattern round with Event Summary Card.

## UI-DEC-042 — Approve Insignia Rail for Event Summary Card

- Date: 2026-07-19
- Inventory IDs: `EVT-PAT-002`
- Batch: Event Pattern — Summary Card
- State: Approved
- Approved by: User

### Context

The Event Summary Card comparison preserved Event name, description summary,
Tier, status, participating Team count, optional Champion, and whole-card
navigation while comparing Insignia Rail, Editorial Bracket, and Outcome Deck.
Preparing, Ongoing, and Completed states were tested alongside parent-card
Default, Hover, and Focus-visible behavior.

### Decision

Approve **A — Insignia Rail**.

Retain the current left-Tier/right-content reading model but replace the
oversized filled crest with the approved Tournament Insignia. Use an open
Champion strip and a quiet metadata footer inside the content field.

### Reasoning

Insignia Rail preserves the strongest part of the current composition while
improving density, material quality, and state behavior. Tier remains
immediately recognizable, the Event title stays dominant, and Champion can
appear or disappear without leaving an empty nested card.

### Token impact

Reuse the approved Interactive Card shell, Tournament Insignia, Semantic Status
Edge Plate, Championship Gold, divider, Dark Glass, Focus, and motion roles.
Add only pattern-local grid dimensions and Champion-strip spacing.

### Component and pattern impact

Approve `EVT-PAT-002`.

- place the compact Tournament Insignia in a dedicated left rail;
- keep name, description, and Semantic Status in the primary content heading;
- render Champion as an open ruled strip with Trophy plus Championship Gold;
- omit the entire Champion strip for Preparing and Ongoing Events;
- preserve `participatingTeamCount` in the quiet footer;
- preserve whole-card navigation and a stable accessible destination label;
- coordinate Hover and Focus-visible across the card and Tier Insignia;
- do not add independent interactions to the Tier, Champion, status, or footer;
- stack the Tier rail above content only at the narrowest breakpoint.

### Exceptions

The dedicated Tier rail is specific to Event Summary Card and does not change
generic Interactive Card anatomy.

### Follow-up

Continue the Event Pattern round with Event Player Awards Presentation.

## UI-DEC-043 — Reject first Event Player Awards composition set

- Date: 2026-07-19
- Inventory IDs: `EVT-PAT-001`, `EVT-CMP-002`, `EVT-CMP-003`
- Batch: Event Pattern — Player Awards Presentation
- State: Revise
- Approved by: User

### Context

The first comparison applied the established MVP-first hierarchy to Spotlight
Ledger, Crownline, and Honors Board. All three preserved the required award
data and states but remained visually unsatisfactory.

### Decision

Reject all three first-pass presentation candidates.

Preserve the business and information structure, but stop varying the roster
composition. Explore materially different outer-container treatments around one
stable MVP/First Team/Second Team hierarchy.

### Retained requirements

- MVP remains the strongest award and precedes both roster groups;
- First Team and optional Second Team remain explicit groups;
- desktop keeps five equal cells in backend order;
- every award preserves Player name, API-provided Position, and award-time Team;
- an MVP repeated in a roster keeps the inline Gold Trophy/MVP marker;
- inactive historical Players remain explicit;
- Second Team omission and the open no-awards state remain valid;
- Brand Mint remains structural while Gold is restricted to MVP signals.

### Rejected directions

- Spotlight Ledger;
- Crownline;
- Honors Board.

Their names and compositions must not be treated as approved candidate-system
language.

### Follow-up

Compare Trophy Case, Black Metal Plaque, and Aurora Showcase container materials
around one stable awards layout.

## UI-DEC-044 — Approve Black Metal Plaque for Event Player Awards

- Date: 2026-07-19
- Inventory IDs: `EVT-PAT-001`, `EVT-CMP-002`, `EVT-CMP-003`
- Batch: Event Pattern — Player Awards Presentation
- State: Approved
- Approved by: User

### Context

After rejecting the first composition set, the revision held the MVP,
First Team, and Second Team hierarchy constant and compared Trophy Case, Black
Metal Plaque, and Aurora Showcase as single outer-container materials.

### Decision

Approve **B — Black Metal Plaque**.

Use one cut-corner, brushed near-black plaque for the complete Player Awards
section. Integrate the MVP and both roster groups through engraved rules and
material hierarchy rather than nested cards.

Exact ambient-light strength remains tunable during Event Detail scenario
validation; the Black Metal material decision does not require a globally fixed
Rich lighting value.

### Reasoning

Black Metal Plaque gives the Event honors a dedicated, ceremonial identity
without introducing a bright glass field or a broad multicolor gradient. Its
harder geometry fits the sports-console language, and one continuous material
keeps ten roster cells from reading as a collection of cheap mini-cards.

### Token impact

Reuse near-black Surface, precise Edge Highlight, Strong/Muted text, Brand
Mint, Championship Gold, neutral divider, and Data typography roles. Add
Event-awards-local roles for:

- brushed metal grain;
- restrained cut-corner frame;
- engraved internal rule;
- plaque corner registration marks;
- MVP Gold/Mint directional trace.

These roles do not create a general-purpose metal Card material.

### Component and pattern impact

Approve `EVT-PAT-001`, `EVT-CMP-002`, and `EVT-CMP-003`.

- use one Black Metal Plaque as the section's only container;
- keep the Section title inside the plaque header;
- place the full-width horizontal MVP field first;
- make Trophy plus Gold the MVP's non-color/semantic signal while Brand Mint
  remains structural;
- do not place the MVP inside a nested Card;
- render First Team and optional Second Team as engraved five-cell ruled grids;
- retain API order and visible Player name, Position, and award-time Team;
- retain an inline Gold `MVP` marker when the MVP is repeated in a roster;
- reduce Second Team emphasis through neutral rules and supporting text;
- omit the complete Second Team group when absent;
- preserve an explicit Inactive historical marker;
- use open content inside the same plaque for the no-awards state;
- keep the complete presentation read-only with no Hover, Focus, Pressed,
  Selected, or navigation behavior on cells.

### Exceptions

Black Metal Plaque is a restricted Event Player Awards feature material. It
must not become the default container for Event panels, tables, Team/Player
cards, or generic achievement/status content.

### Follow-up

The inventoried Event-specific Patterns are complete. Continue with Match Record
Card in the Match Pattern round.

## UI-DEC-045 — Approve Scoreline Rail for Match Record Card

- Date: 2026-07-20
- Inventory IDs: `MAT-PAT-001`
- Batch: Match Pattern — Record Card
- State: Approved
- Approved by: User

### Context

The Match Record Card comparison preserved the actual `MatchListItem` contract:
Event, optional Stage Tag, `playedAt`, HOME/AWAY Team identity, API-provided
scores, and whole-card navigation. It compared Scoreline Rail, Team Ledger, and
Center Court across HOME win, AWAY win, equal-score data, optional Stage, narrow
reflow, Hover, and Focus-visible.

Repository and PRD review also confirmed that Match list results contain only
valid past Match records. Voided Match history and archived/deleted Event
history are excluded from the list, and `MatchListItem` contains no ResultTag.

### Decision

Approve **A — Scoreline Rail**.

Preserve the current symmetrical HOME/score/AWAY composition while adding the
approved Team identity treatment, explicit Winner signal, clearer metadata
rail, and coordinated whole-card interaction.

### Reasoning

Scoreline Rail retains the strongest part of the current Match card: direct
left-to-right score comparison. It improves identity and outcome recognition
without making every list item as tall as a detail scoreboard or weakening the
two-Team comparison into unrelated rows.

### Token impact

Reuse the Interactive Card shell, Logo Artwork / Initials Fallback, Team-color
exception, Compact Match Stage Badge, Championship Gold/Trophy, score/data
typography, divider, Focus, and restrained ambient-light roles. Add only
pattern-local scoreline grid and narrow-stack dimensions.

### Component and pattern impact

Approve `MAT-PAT-001`.

- place Event, optional Compact Stage Badge, and formatted `playedAt` in the
  metadata rail;
- omit Stage entirely when absent rather than rendering a placeholder;
- place HOME identity left, the score comparison centrally, and AWAY identity
  right;
- use approved loaded Logo Artwork or Neutral Frame + Initials fallback;
- retain data-driven Team-color traces without recoloring artwork;
- mark only the higher-scoring Team with Trophy plus `Winner`;
- strengthen the winning Team name and score without relying on color alone;
- show no Winner marker when equal-score data is returned;
- make the whole card the sole navigation target;
- coordinate Hover and Focus-visible across the card with restrained local Team
  light, without lift or scale;
- keep Team identity, score, metadata, and Winner markers non-interactive;
- on narrow screens, stack HOME then AWAY while preserving roles and place the
  score comparison in a separate ruled row;
- do not invent scheduled/incomplete, voided, archived-Event, ResultTag, or
  Match-status content for the list card.

### Exceptions

The symmetrical scoreline is Match-specific and does not redefine generic
Interactive Card content alignment. Equal-score rendering is a resilient API
state, not a new business rule permitting tied basketball games.

### Follow-up

Continue the Match Pattern round with Match Detail Score Header.

## UI-DEC-046 — Approve Arena Scoreline for Match Detail Score Header

- Date: 2026-07-20
- Inventory IDs: `MAT-PAT-002`
- Batch: Match Pattern — Detail Score Header
- State: Approved
- Approved by: User

### Context

The Match Detail comparison tested Arena Scoreline, Score Bridge, and Broadcast
Ledger using the actual Detail contract: Event, optional Stage, `playedAt`,
HOME/AWAY Team identity, final scores, voided records, historical/unavailable
Events, logo fallback, defensive equal-score data, and narrow reflow.

Detail-page Back/Edit/Void/Restore actions and full persistent notices are
outside `MatchScoreHeader`, so the pattern review did not move them into the
hero.

### Decision

Approve **A — Arena Scoreline**, with the explicit Winner signal removed.

Use a symmetrical HOME/score/AWAY open field beneath the metadata rail. Express
the result through the numeric comparison plus full-strength winning score and
Team name against a de-emphasized losing pair.

### Reasoning

Arena Scoreline preserves the direct comparison and visual balance already
appropriate to Match Detail while giving it more ceremony than the list card.
An additional Trophy/`Winner` marker duplicated the information in the score
and visibly broke the two-sided symmetry. The larger numeric score remains a
non-color outcome signal, so the explicit label is unnecessary.

### Token impact

Reuse the Dark Glass detail surface, Logo Artwork / Initials Fallback,
Team-color exception, score/data typography, divider, muted-text, Compact Stage,
and existing status-feedback roles. No new Winner token is introduced.

### Component and pattern impact

Approve `MAT-PAT-002`.

- retain Event, Stage, and time in the metadata rail;
- render missing Stage as `—` in Detail;
- place HOME identity left, score centrally, and AWAY identity right;
- use loaded Logo Artwork or Neutral Frame + Initials fallback;
- keep the winning score and Team name at full strength;
- de-emphasize the losing score and Team name;
- keep both sides level for equal-score data;
- omit Trophy and `Winner`;
- keep the hero read-only;
- allow only compact Voided/Historical state echoes in the hero;
- keep full notices and all page actions outside the hero;
- stack HOME, AWAY, then score at narrow widths without losing role labels.

### Exceptions

The Match Record Card retains its previously approved Trophy plus `Winner`
signal because list scanning and whole-card interaction create a different
context. The Detail hero intentionally uses the score itself and does not revise
that list-card decision.

### Follow-up

The inventoried product-specific Pattern round is complete. Begin representative
page Scenario validation with Teams Overview.

## UI-DEC-047 — Validate Teams Overview page composition

- Date: 2026-07-20
- Inventory IDs: `PAG-PAT-001`, `NAV-PAT-001`, `LAY-PAT-001`
- Batch: E5 Scenario Validation — Teams Overview
- State: Approved
- Approved by: User

### Context

The first E5 scenario combined the current minimally revised Sidebar, no-eyebrow
Functional Page Header, Create Team action, approved Open Division Stacks,
Score Ledger Team Identity Cards, and Normal/Loading/Empty/Error page states.
It also preserved the current two-column Division board and narrow one-column
collapse.

### Decision

Approve the Teams Overview composition as a representative Overview/List-page
scenario.

### Validation result

- page title, description, and Create action establish a clear first level;
- Division remains open information hierarchy rather than a repeated container;
- Team Identity Cards remain the only repeated card surface;
- page-level loading, empty, and error states replace the board without creating
  nested chrome;
- the existing desktop Sidebar does not compete with the page header;
- narrow content reflow is viable, while the current hidden-mobile-Sidebar
  behavior remains a separate application-shell question.

This validates the Teams instance but does not yet approve every Overview/List
page or close `PAG-PAT-001`.

### Follow-up

Continue E5 with Team Detail.

## UI-DEC-048 — Validate Team Detail page composition

- Date: 2026-07-20
- Inventory IDs: `PAG-PAT-002`, `TEM-PAT-003`, `DAT-CMP-001`,
  `TBL-CMP-001`
- Batch: E5 Scenario Validation — Team Detail
- State: Approved
- Approved by: User

### Context

The Team Detail scenario combined Detail Back Link and Manage Team action,
archived Edge Signal, the approved Unified Field Team Hero, Ruled Grid Team
Summary, Roster Data Bay, and Active/Archived/No-profile/Empty-roster states.
It also tested the identity-first narrow reflow and local table overflow.

### Decision

Approve the Team Detail composition as a representative Detail-page scenario.

### Validation result

- navigation/actions remain outside entity identity and do not compete with it;
- the archived notice remains page-owned and does not alter Logo/Fallback;
- one Unified Field keeps identity and Radar related without nested cards;
- Team Summary forms a quieter second-level data region;
- Roster Data Bay remains the densest lower module and owns local overflow;
- no-profile and empty-roster states preserve module positions;
- the identity, Radar, Summary, and Roster reflow without changing meaning.

This validates the Team instance but does not yet approve every Detail page or
close `PAG-PAT-002`.

### Follow-up

Continue E5 with Team Create/Edit.

## UI-DEC-049 — Validate Team Create/Edit page composition

- Date: 2026-07-20
- Inventory IDs: `PAG-PAT-003`, `TEM-PAT-004`, `FRM-CMP-001`–`FRM-CMP-006`,
  `TBL-CMP-001`
- Batch: E5 Scenario Validation — Team Create/Edit
- State: Approved
- Approved by: User

### Context

The Team editor scenario combined Create and Edit modes with one no-eyebrow
Functional Page Header, Save/Create and Cancel actions, Editorial Outline form
sections, the approved Open Well Identity Proof, five Profile Rating Sliders,
Player Management table/actions, and the Edit-only Archive section. It tested
Default, Validation, Submitting, Archived/read-only, and narrow states.

### Decision

Approve the Team Create/Edit composition as the first representative editor-page
scenario.

### Validation result

- Create and Edit share one page hierarchy while changing only mode-specific
  copy and the Archive section;
- page actions remain in the header rather than being repeated per section;
- Editorial Outline separates work areas without making every field a card;
- Identity Proof stays a non-interactive draft preview inside the Basic Info
  section;
- Profile Rating rows preserve labels, controls, and exact values;
- Player Management remains a bounded workflow with compact row actions;
- validation remains associated with fields/roster and submission keeps the
  layout stable;
- archived Edit mode becomes read-only and does not invent a Create equivalent;
- narrow layouts stack actions, form/proof, sliders, and dense data safely.

This validates the Team editor instance but does not yet approve every
Create/Edit page or close `PAG-PAT-003`.

### Follow-up

Continue E5 with Players Overview.

## UI-DEC-050 — Validate Players Overview page composition

- Date: 2026-07-20
- Inventory IDs: `PAG-PAT-001`, `FLT-CMP-001`, `PLY-PAT-001`,
  `TBL-CMP-001`, `PGN-CMP-001`
- Batch: E5 Scenario Validation — Players Overview
- State: Approved
- Approved by: User

### Context

The Players Overview scenario combined the no-eyebrow Functional Page Header,
Event → Team → Position filtering, four approved Frosted Depth Leader Cards,
Ranking Data Bay, sorting, local table overflow, integrated pagination, and
Normal/Loading/Empty/retained-data Refresh Error states.

During review, the Filter Bar boundary was reconsidered. The existing
UI-DEC-013 decision remains: filtering needs one visible shared region, but it
must read as a weak edge-highlight Dark Glass grouping rather than a formal Card
equal to Leader or Data surfaces.

### Decision

Approve the Players Overview composition.

### Validation result

- the Filter Bar communicates one cascading control scope without per-field
  mini-cards;
- the filter boundary remains weaker than Leader Cards and Ranking Data Bay;
- the four Strong Glow Leader Cards remain the page's feature emphasis without
  replacing the authoritative ranking table;
- Leader Cards remain fixed and show `0.0` plus `No eligible players` for empty
  candidate sets;
- Ranking Data Bay owns sorting, compact rows, local overflow, and pagination;
- Loading/Empty/Refresh Error states preserve the newest valid query and content
  hierarchy;
- the four/two/one Leader grid and stacked Filter controls remain usable at
  narrow widths.

This is the second accepted Overview/List instance; `PAG-PAT-001` remains open
until Event and Match Overview scenarios are checked.

### Follow-up

Continue E5 with Player Detail.

## UI-DEC-051 — Validate Player Detail page composition

- Date: 2026-07-20
- Inventory IDs: `PAG-PAT-002`, `PLY-PAT-002`, `PLY-PAT-003`,
  `PLY-PAT-004`, `DAT-CMP-001`, `TBL-CMP-001`, `PGN-CMP-001`,
  `FLT-CMP-001`
- Batch: E5 Scenario Validation — Player Detail
- State: Approved
- Approved by: User

### Context

The Player Detail scenario combined the approved Number Masthead and Outline
Echo, independent inactive-player and archived-Team markers, a quiet Honors
Ledger, Segmented Performance Profile, weak Event filter region, six-cell
Ruled Grid Stat Summary, Match History Data Bay, and pagination. It also
compared Active, Inactive, Archived Team, unavailable-scope, and empty-history
states.

### Decision

Tentatively approve the Player Detail composition as the representative Player
instance of the Detail Page Pattern. It may be revisited if later Event or
Match scenarios reveal a system-wide density problem.

### Validation result

- Number Masthead leads Player identity without introducing an Overview-style
  page title;
- Awards remain a quiet ruled ledger inside the identity field rather than
  becoming another equal-weight Card;
- Performance Profile is a peer to identity and preserves leader-relative
  semantics with exact values and no percent symbol;
- the Event filter remains a weak visible region rather than a formal Card;
- Stat Summary and Match History descend clearly from the two-part identity
  Hero;
- unavailable scope retains identity, awards, and filtering while displaying
  zero or unavailable statistics and an empty history;
- inactive Player and archived Team remain independent states;
- narrow layouts preserve identity, profile, filter, summary, and history
  reading order.

`PAG-PAT-002` remains open until Event and Match Detail scenarios are checked.

### Follow-up

Continue E5 with Events Overview.

## UI-DEC-052 — Validate Events Overview page composition

- Date: 2026-07-20
- Inventory IDs: `PAG-PAT-001`, `EVT-PAT-002`, `EVT-CMP-001`,
  `STA-CMP-001`, `FDB-CMP-002`, `FDB-CMP-004`, `FDB-CMP-005`
- Batch: E5 Scenario Validation — Events Overview
- State: Approved
- Approved by: User

### Context

The Events Overview scenario combined the no-eyebrow Functional Page Header
and Create action with two-column Insignia Rail Event Cards. Its normal state
displayed Preparing, Ongoing, and Completed Events together, including the
Completed-only Champion strip, participating-Team count, destination cue, and
parent-card interaction. Loading, first-use Empty, Error/Retry, and narrow
layouts were also represented.

### Decision

Approve the Events Overview composition.

### Validation result

- the shared Tournament Insignia anatomy remains recognizable at compact list
  scale without becoming a filled crest;
- Event name, description, and Status remain the primary information field;
- Champion appears only for Completed Events as an open Trophy/Gold ruled
  strip;
- Team count and destination remain quiet footer metadata;
- whole-card Hover and Focus-visible strengthen only the local Tier response
  without lift or scale;
- Loading preserves approximate card geometry, while Empty and Error remain
  open page content rather than substitute Cards;
- the two-column grid becomes one column before the Tier rail stacks above the
  content at the narrowest width.

This is the third accepted Overview/List instance; `PAG-PAT-001` remains open
until Match Overview is checked.

### Follow-up

Continue E5 with Event Detail.

## UI-DEC-053 — Validate Event Detail page composition

- Date: 2026-07-20
- Inventory IDs: `PAG-PAT-002`, `EVT-CMP-001`, `SUR-CMP-003`,
  `TAG-CMP-002`, `TAG-CMP-003`, `TBL-CMP-001`, `TBL-CMP-006`,
  `EVT-PAT-001`
- Batch: E5 Scenario Validation — Event Detail
- State: Approved
- Approved by: User

### Context

The Event Detail scenario combined Detail Back and entity/workflow actions,
archived-state signaling, a large Tournament Insignia hero, Event identity and
Champion facts, Participants, Stage and Result Tags, Final Team Results, and
the Black Metal Player Awards Plaque. Completed, Ongoing, Archived, Loading,
and Not-found states were checked.

The first composition placed Participants beside a vertical stack of Stage and
Result Tag panels. Review exposed a cardinality mismatch: real Events commonly
contain 16 Teams while each Tag group is comparatively small, so equal columns
would create unstable height and large dead space.

### Decision

Approve Event Detail with a full-width Participants ruled roster followed by
two compact peer Tag sections. Do not place high-cardinality Participants and
low-cardinality Tags in equal-height parallel columns.

### Validation result

- the larger Tournament Insignia preserves the same anatomy as the list
  version without adding independent interaction;
- Event name, status, description, participant count, and optional Champion
  form one coherent Detail identity field;
- 16 representative Teams fit a full-width four-column ruled roster, reducing
  to two and one columns on narrower layouts;
- Stage and Result Tags follow Participants as compact peer sections rather
  than controlling its height;
- Final Results retains the shared Data Bay and Championship Gold Winner row;
- Black Metal Plaque remains a single restricted feature material with MVP,
  First Team, optional Second Team, inactive history, and open empty state;
- Ongoing removes final Champion/results/awards content without collapsing the
  rest of the Event identity;
- Archived, Loading, and Not-found states preserve the established Detail Page
  hierarchy.

`PAG-PAT-002` remains open until Match Detail is checked.

### Follow-up

Continue E5 with Event Create/Edit.

## UI-DEC-054 — Validate Event Create/Edit page composition

- Date: 2026-07-20
- Inventory IDs: `PAG-PAT-003`, `ACT-CMP-001`, `ACT-CMP-002`,
  `ACT-CMP-003`, `ACT-CMP-004`, `ACT-CMP-006`, `ACT-CMP-007`,
  `FRM-CMP-001`, `FRM-CMP-004`, `TAG-CMP-002`, `TAG-CMP-003`
- Batch: E5 Scenario Validation — Event Create/Edit
- State: Approved
- Approved by: User

### Context

The Event Create/Edit scenario combined the Functional Page Header, Event
identity fields, realistic 16-Team participation selection, Match Stage Tag
rows, Result Tag data-entry table and ordering controls, and Event lifecycle
actions. Create, Preparing Edit, Ongoing Edit, Completed, and Archived states
were compared.

Review also caught an incorrect `Return to Event` label in the scenario. The
active Event form, Team editor, and approved action hierarchy already share one
Cancel token; the problem was preview copy rather than a token fork.

### Decision

Approve the Event Create/Edit composition. Keep `ACT-CMP-002` as the shared
Large Cancel/Exit action and require the visible `Cancel` label in Create/Edit
page headers. Detail-page return navigation remains `NAV-CMP-003` and must not
be substituted here.

### Validation result

- Create and Edit reuse one no-eyebrow Functional Page Header and Editorial
  Outline work-area hierarchy;
- Create uses empty identity/tag/participant defaults while Edit preserves
  configured content;
- 16 Team options use a ruled four/two/one-column checkbox grid rather than
  participant chips or separate Cards;
- an existing unavailable participant may be retained or removed, while an
  archived/unselected Team remains unavailable for addition;
- Stage Tags use compact labeled rows with a Medium Add action and Small
  destructive removal;
- Result Tags use the shared Data Entry table, Filled Checkbox, Number Input,
  paired Up/Down controls with disabled boundaries, and Small destructive
  removal;
- Preparing, Ongoing, and Completed expose only their valid next lifecycle
  action;
- Completed and Archived correctly disable configuration; Archived removes
  lifecycle and Save actions;
- the Header secondary action is `Cancel`, not `Return to Event`.

`PAG-PAT-003` remains open until Event Outcomes and Match Create/Edit are
checked.

### Follow-up

Continue E5 with Event Results & Awards.

## UI-DEC-055 — Validate Event Results & Awards visual scope and defer Awards workflow redesign

- Date: 2026-07-20
- Inventory IDs: `PAG-PAT-003`, `TBL-CMP-001`, `FRM-CMP-003`,
  `FRM-CMP-007`, `FRM-CMP-009`, `STA-CMP-002`, `EVT-PAT-003`
- Batch: E5 Scenario Validation — Event Results & Awards
- State: Approved with explicit workflow deferral
- Approved by: User

### Context

The Event Outcomes scenario combined the no-eyebrow Functional Page Header,
Save and Cancel actions, a 16-Team Result assignment table, Result Tag
prerequisite handling, Player Award selection, Team filtering, selection
limits, inactive historical awards, and Completed/Archived read-only states.

A candidate Award Assignment Matrix exposed the larger issue: the current
Player Awards selection is not merely visually weak. Improving it changes
candidate browsing, award assignment, limits and mutual-exclusion feedback,
inactive-history handling, keyboard behavior, validation, and frontend state.
That is a workflow redesign rather than a visual-token migration.

### Decision

Approve the Event Results & Awards page only within the current visual-refactor
scope:

- approve its page framing, Team Results editor, shared controls, feedback,
  read-only states, and responsive behavior;
- preserve the existing Player Awards selection behavior in the current PR;
- do not approve or implement the candidate matrix as part of this round;
- defer Player Awards selection workflow redesign to a separate functional PR.

### Validation result

- Results & Awards uses the same Functional Page Header, Primary Save, and
  visible `Cancel` action as other editors;
- all 16 participating Teams remain represented in the compact Result
  data-entry table;
- Result Tag and participant prerequisites degrade independently without
  blocking still-valid Awards work;
- Completed and Archived Events remove Save and disable outcome controls while
  retaining historical content and a clear Edit Event route;
- Team filtering, award counts, inactive retained awards, and current
  checkbox primitives may receive the approved visual treatment without
  changing their behavior;
- no matrix, staged flow, candidate-pool model, or other award-selection
  interaction is part of this approval.

The Event scenario set is complete. `PAG-PAT-003` remains open until Match
Create/Edit is checked.

### Follow-up

Continue E5 with Matches Overview. Open a separate future PR for
`EVT-PAT-003` Event Player Awards Selection Workflow.

## UI-DEC-056 — Validate Matches Overview and close the Overview/List Pattern

- Date: 2026-07-20
- Inventory IDs: `PAG-PAT-001`, `FLT-CMP-001`, `FLT-CMP-002`,
  `MAT-PAT-001`, `TAG-CMP-004`, `PGN-CMP-001`, `FDB-CMP-002`,
  `FDB-CMP-004`, `FDB-CMP-005`
- Batch: E5 Scenario Validation — Matches Overview
- State: Approved
- Approved by: User

### Context

The Matches Overview scenario combined the no-eyebrow Functional Page Header,
Create Match action, cascading Team/Event/Stage filters, Scoreline Rail Match
Cards, pagination, and Normal/Loading/filtered-Empty/retained-data Refresh
Error states. HOME win, AWAY win, defensive equal score, and omitted optional
Stage were represented.

The actual list contract was preserved: voided Matches and Matches belonging
to archived/deleted Events are excluded, and no scheduled/incomplete Match
state was invented.

### Decision

Approve Matches Overview and close `PAG-PAT-001` Overview/List Page as an
approved representative page pattern.

### Validation result

- Match filters use the same weak visible Filter region as Players Overview;
- Stage remains disabled until Event selection supplies valid options;
- Scoreline Rail preserves Event/optional Stage/time metadata, symmetrical Team
  identity, central score, Trophy plus Winner on list cards, and whole-card
  navigation;
- the Detail-only removal of Winner text does not leak into list cards;
- missing Stage is omitted rather than rendered as a placeholder;
- defensive equal-score data gives both Teams equal hierarchy and no Winner;
- Loading preserves card geometry, filtered Empty offers Clear filters, and
  refresh failure retains the last successful list;
- pagination remains a quiet final strip beneath the card grid;
- narrow layouts reduce to one card column and stack Team identities before the
  score without lift or scale.

With Teams, Players, Events, and Matches accepted, Overview/List Page is
approved while retaining feature-specific content bodies.

### Follow-up

Continue E5 with Match Detail.

## UI-DEC-057 — Validate Match Detail and close the Detail Page Pattern

- Date: 2026-07-20
- Inventory IDs: `PAG-PAT-002`, `NAV-CMP-003`, `ACT-CMP-001`,
  `ACT-CMP-003`, `MAT-PAT-002`, `TBL-CMP-001`, `TBL-CMP-004`,
  `TBL-CMP-005`, `FDB-CMP-001`, `OVR-CMP-001`
- Batch: E5 Scenario Validation — Match Detail
- State: Approved
- Approved by: User

### Context

The Match Detail scenario combined Detail Back and Edit/Void/Restore actions,
Voided/Historical/retained Action Error feedback, the approved Arena Scoreline,
two Team Box Score Data Bays, Operational Neutral Other rows, Team Total rows,
and Normal/Voided/Historical Event/Missing Stage/Action Error states.

### Decision

Approve Match Detail and close `PAG-PAT-002` Detail Page as an approved
representative page pattern.

### Validation result

- Arena Scoreline preserves its open symmetrical HOME/score/AWAY composition;
- outcome remains encoded only by numeric score and winning/losing hierarchy,
  with no Trophy or `Winner` marker;
- optional missing Stage renders `—` in Detail as required;
- Voided removes Edit/Void, exposes Restore, and retains the complete read-only
  record;
- Historical Event removes all Match mutations while preserving the record and
  reason;
- action failure remains above retained content and does not destroy the
  current record;
- each Team owns one Box Score Data Bay with local horizontal overflow;
- row scan Hover, Operational Neutral Other, strong Team Total, percentage
  unavailable values, and dense numeric alignment remain readable;
- narrow layout stacks HOME, AWAY, then the ruled score row and preserves the
  page action hierarchy.

With Team, Player, Event, and Match Detail accepted, Detail Page is approved
without introducing the Overview/Edit Functional Page Header.

### Follow-up

Continue E5 with Match Create/Edit.

## UI-DEC-058 — Validate Match Create/Edit and close E5 Scenario Validation

- Date: 2026-07-20
- Inventory IDs: `PAG-PAT-003`, `PAG-CMP-001`, `ACT-CMP-001`,
  `ACT-CMP-002`, `FRM-CMP-001`, `FRM-CMP-003`, `FRM-CMP-004`,
  `FRM-CMP-005`, `TBL-CMP-001`, `TBL-CMP-005`, `FDB-CMP-001`
- Batch: E5 Scenario Validation — Match Create/Edit
- State: Approved
- Approved by: User

### Context

The Match Create/Edit scenario combined the no-eyebrow Functional Page Header,
Create/Save and Cancel actions, Match Information fields, two Team roster-stat
entry Data Bays, Played controls, immediate Team scores, Operational Neutral
Other rows, and Create/Edit/Validation/Submitting/No Events/Unavailable states.

### Decision

Approve Match Create/Edit, close `PAG-PAT-003`, and complete Phase E5 Scenario
Validation.

### Validation result

- Create and Edit share one page hierarchy while Edit locks Event and Team
  identity without locking Stage, date/time, or statistics;
- the native local-time date/time field remains unchanged;
- both Team entry sections use the same dense Data Bay and local horizontal
  overflow;
- Played controls expose statistics only for participating Players and preserve
  inactive historical roster data where supplied;
- immediate Team Score remains in each Team header without becoming a separate
  Card;
- Other retains its Operational Neutral row and only applicable required
  fields;
- Validation retains entered data, Submitting disables mutable controls, and
  Cancel remains the shared secondary form action;
- No Events degrades before roster entry and routes back to Event setup;
- voided Match or unavailable Event exits the editor into one concise
  unavailable state with a return-to-detail action;
- narrow layouts stack the Functional Page Header and information fields while
  keeping irreducible statistic columns inside local overflow.

With Team, Event, Event Outcomes visual scope, and Match editor scenarios
accepted, Create/Edit Page is approved. All required E5 representative
scenarios now have explicit approval.

### Follow-up

Enter Phase E6. Prepare the complete candidate `DESIGN.md`, final semantic
token mapping, coverage/exception summary, and migration impact plan for
Experiment Gate E2 approval. Keep `EVT-PAT-003` Player Awards Selection
Workflow deferred to a separate functional PR.

## UI-DEC-059 — Approve Gate E2 and formalize Editorial Scoreboard

- Date: 2026-07-20
- Inventory IDs: all current-MVP inventory items
- Batch: E6 Candidate System Approval / M0 Formalization
- State: Approved
- Approved by: User

### Context

E6 consolidated the approved Foundation, Component, Team, Player, Event, Match,
and page-scenario decisions into a final candidate specification, semantic
token mapping, coverage and exception summary, and bounded migration plan.

The final inventory contained 97 items: 91 Approved, four Deferred, and two
Rejected. `EVT-PAT-003` remained outside the visual-refactor scope because its
selection experience requires functional interaction design.

### Decision

Approve Editorial Scoreboard at Experiment Gate E2 and authorize M0
formalization:

- make `docs/DESIGN.md` the active Editorial Scoreboard specification;
- mirror the approved shared semantic values into canonical `variables.css`;
- align the Mantine theme and project design-system quick reference;
- preserve the inventory's Approved/Rejected/Deferred review history while
  marking all Approved entries as Formalized at the inventory level.

### Boundary

Gate E2 and M0 do not authorize page-by-page implementation, business-logic
changes, API changes, or the Player Awards selection workflow redesign.
Application migration follows the approved M1–M6 batches and the project's
frontend PRD approval workflow.

## UI-DEC-060 — Keep Event Detail Champion in Final Team Results

- Date: 2026-07-20
- Inventory IDs: `PAG-PAT-002`, `TBL-CMP-006`
- Batch: M4 Event Patterns implementation clarification
- State: Approved
- Approved by: User

### Context

M4 implementation confirmed that the Event list response owns an optional
`champion` summary while the existing Event detail response does not duplicate
that field. Event Detail already presents the winning Team in Final Team
Results through the Championship Gold Winner row with Trophy and explicit
result text.

The earlier E5 scenario preview included an optional Champion fact in the
Detail identity field. Adding it to the real page would require an API contract
change or a new frontend derivation rule, neither of which belongs to the
approved M4 visual migration.

### Decision

Do not display Champion in the Event Detail hero.

- Event Summary Card continues to use the list response's optional Champion
  strip.
- Event Detail users inspect Champion in Final Team Results.
- The Winner row remains the sole Event Detail Champion presentation.
- Frontend must not derive a hero Champion from ResultTag, points, or array
  order.
- No Backend, Schema, or API change is required.

This decision supersedes only the optional Detail Champion fact described in
UI-DEC-053. All other Event Detail composition decisions remain approved.
