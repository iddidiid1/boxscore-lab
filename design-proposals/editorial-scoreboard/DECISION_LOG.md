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
