---
name: Verge Dark — Sports Editorial
colors:
  canvas: '#131313'
  surface: '#1a1a1a'
  surface-raised: '#232323'
  surface-high: '#2d2d2d'
  nav-bg: '#0d0d0d'
  text: '#ffffff'
  text-soft: '#c8c8c8'
  text-muted: '#949494'
  text-dim: '#555555'
  text-on-mint: '#000000'
  mint: '#3cffd0'
  mint-dim: '#2ccfaa'
  mint-soft: 'rgba(60,255,208,0.10)'
  uv: '#5200ff'
  uv-soft: 'rgba(82,0,255,0.12)'
  border: 'rgba(255,255,255,0.10)'
  border-strong: 'rgba(255,255,255,0.18)'
  border-mint: 'rgba(60,255,208,0.45)'
  success: '#3cffd0'
  warning: '#ffb95f'
  danger: '#ff6b6b'

typography:
  display:
    fontFamily: Anton
    fontSize: 48px
    fontWeight: '400'
    lineHeight: '0.95'
    letterSpacing: 1.5px
  display-stat:
    fontFamily: Anton
    fontSize: 52px
    fontWeight: '400'
    lineHeight: '1.0'
    letterSpacing: 1px
  heading-lg:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  body:
    fontFamily: Space Grotesk
    fontSize: 15px
    fontWeight: '400'
    lineHeight: '1.5'
  body-strong:
    fontFamily: Space Grotesk
    fontSize: 15px
    fontWeight: '600'
    lineHeight: '1.5'
  label:
    fontFamily: JetBrains Mono
    fontSize: 10px
    fontWeight: '600'
    lineHeight: '1.4'
    letterSpacing: 2px
    textTransform: uppercase
  data:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: '1'
  data-lg:
    fontFamily: JetBrains Mono
    fontSize: 22px
    fontWeight: '700'
    lineHeight: '1'
  data-display:
    fontFamily: JetBrains Mono
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1'

rounded:
  input: 4px
  badge: 20px
  card: 16px
  button: 24px
  circle: 9999px

spacing:
  unit: 8px
  card-padding: 14px 16px
  card-padding-lg: 24px 28px
  section-gap: 48px
  content-padding: 32px
---

## Brand & Style

**Verge Dark — Sports Editorial.** Near-black canvas with acid-mint as the sole hazard accent. The mood is editorial-dark: serious enough for data, loud enough to feel like a sports broadcast. Anton headlines at large scale create the editorial anchor; Space Grotesk handles all UI text; JetBrains Mono locks down every number.

The design avoids gradients, drop shadows, and decorative backgrounds. Depth comes entirely from 1px borders and tonal surface differences. Color is used sparingly — mint appears only on the most important interactive element per screen.

## Colors

### Surfaces

| Token | Value | Use |
|-------|-------|-----|
| `canvas` | `#131313` | Page background — every view |
| `nav-bg` | `#0d0d0d` | Sidebar / top nav — slightly deeper than canvas |
| `surface` | `#1a1a1a` | Cards, panels, table backgrounds |
| `surface-raised` | `#232323` | Table header, hover state |
| `surface-high` | `#2d2d2d` | Secondary button fill, active surface |

### Text

| Token | Value | Use |
|-------|-------|-----|
| `text` | `#ffffff` | Primary content |
| `text-soft` | `#c8c8c8` | Emphasized secondary content |
| `text-muted` | `#949494` | Metadata, inactive items, placeholders |
| `text-dim` | `#555555` | Faint labels, timestamps, disabled |
| `text-on-mint` | `#000000` | Text on any mint-fill surface |

### Accents

| Token | Value | Use |
|-------|-------|-----|
| `mint` | `#3cffd0` | Primary CTA fill, active nav indicator, leading stat highlight |
| `mint-dim` | `#2ccfaa` | Mint hover state |
| `mint-soft` | `rgba(60,255,208,0.10)` | Active nav background tint, mint chip background |
| `uv` | `#5200ff` | Annotation and design-review use only; reserve for future badge/accent if needed |
| `uv-soft` | `rgba(82,0,255,0.12)` | UV chip background |

### Borders

| Token | Value | Use |
|-------|-------|-----|
| `border` | `rgba(255,255,255,0.10)` | Default card and row divider |
| `border-strong` | `rgba(255,255,255,0.18)` | Emphasized card border, input border |
| `border-mint` | `rgba(60,255,208,0.45)` | Card hover, input focus |

### Semantic

| Token | Value | Use |
|-------|-------|-----|
| `success` | `#3cffd0` | Unified with mint — positive delta, completed |
| `warning` | `#ffb95f` | At-risk status, in-progress |
| `danger` | `#ff6b6b` | Voided, error, destructive action |

## Typography

### Font Stack

- **Anton** — display / page titles / stat leader numbers. Google Fonts, open source. Used only at large sizes (≥ 24px). Never for UI labels or body text.
- **Space Grotesk** — all UI text: navigation, buttons, card content, form fields, page descriptions. Weights 400 / 500 / 600 / 700.
- **JetBrains Mono** — all numerical data, metadata labels, section dividers, timestamps, badge text. Always uppercase when used as a label.

```
font-family body:    'Space Grotesk', 'Hanken Grotesk', sans-serif
font-family display: 'Anton', Impact, 'Arial Narrow', sans-serif
font-family mono:    'JetBrains Mono', 'Space Mono', monospace
```

### Type Scale

| Role | Font | Size | Weight | Notes |
|------|------|------|--------|-------|
| Page title | Anton | 48px | 400 | letter-spacing 1.5px, line-height 0.95 |
| Stat display (leader card) | Anton | 52px | 400 | letter-spacing 1px |
| Match detail team name | Anton | 24px | 400 | letter-spacing 1px |
| UI body / card content | Space Grotesk | 15px | 400–700 | line-height 1.5 |
| Section label / eyebrow | JetBrains Mono | 10px | 600 | UPPERCASE, 2px tracking |
| Badge / chip text | JetBrains Mono | 9px | 600 | UPPERCASE, 1.3–1.8px tracking |
| Numeric data (table) | JetBrains Mono | 13px | 500 | tabular figures |
| Score (match list) | JetBrains Mono | 22px | 700 | |
| Score (match detail) | JetBrains Mono | 40px | 700 | |
| Small button | Space Grotesk | 13px | 600 | |
| Form input | Space Grotesk | 15px | 400 | |

**Rule:** never use Anton below 24px. Never use Space Grotesk for numerical columns. Never use lowercase JetBrains Mono for section labels or badges.

## Layout & Spacing

- **Base unit**: 8px.
- **Card internal padding**: `14px 16px` (standard), `24px 28px` (detail / form panels).
- **Section gap**: 48px between major page sections.
- **Content area padding**: 32px.
- **Sidebar width**: 220px.
- **Grid**: auto-fill column grid for team/player cards; `minmax(230px, 1fr)`. Match lists and tables are full-width single column.

## Elevation & Depth

No drop shadows. Depth comes from tonal surface layering and 1px borders only.

| Level | Treatment | Use |
|-------|-----------|-----|
| 0 | `#131313`, no border | Canvas, background sections |
| 1 | `#1a1a1a` + `1px border-strong` | Cards, panels, table body |
| 2 | `#232323` | Table header, hover state |
| 3 | `1px border-mint` | Card hover, focused input |
| Active | `border-left: 2px mint` + `mint-soft` bg | Sidebar nav active item |

## Shapes

| Token | Value | Use |
|-------|-------|-----|
| `r-input` | 4px | Text inputs, selects — tight, functional |
| `r-team-logo` | 10px | Team logos inside team cards |
| `r-badge` | 20px | Status pills, category badges |
| `r-card` | 16px | All cards and panels |
| `r-button` | 24px | All buttons — full pill |
| `r-circle` | 50% | Icon circle buttons, avatars |

The radius jump from 4px (inputs) → 16px (cards) → 24px (buttons) → 20px (badges) is intentional. Inputs stay tight; interactive containers are rounded; buttons are fully pill-shaped.

## Components

### Buttons

**Primary — Mint Pill**
- Background: `#3cffd0` (mint)
- Text: `#000000`, Space Grotesk 15px / 600
- Border radius: 24px
- Padding: `10px 22px`
- Hover: `#2ccfaa` (mint-dim)

**Secondary — Dark Surface Pill**
- Background: `#2d2d2d` (surface-high)
- Text: `#ffffff`, Space Grotesk 15px / 600
- Border radius: 24px
- Padding: `10px 22px`
- Hover: `#383838`

**Ghost — Outlined**
- Background: transparent
- Text: `#949494` (text-muted)
- Border: `1px solid border-strong`
- Border radius: 24px
- Hover: text → `#ffffff`, border slightly stronger

**Mint Outline**
- Background: transparent
- Text: `#3cffd0`
- Border: `1px solid border-mint`
- Hover: fills to mint, text → black

**Danger**
- Background: transparent
- Text: `#ff6b6b`
- Border: `1px solid rgba(255,107,107,0.4)`
- Hover: `rgba(255,107,107,0.08)` background tint

**Small variants**: reduce padding to `6px 16px`, font-size to 13px.

### Badges / Status Chips

All badges use JetBrains Mono 9px / 600 / UPPERCASE / 1.3px tracking, border-radius 20px (pill).

| Variant | Background | Text | Border | Use |
|---------|-----------|------|--------|-----|
| Active / mint | `mint-soft` | `mint` | `1px rgba(mint, 0.28)` | Active, Completed |
| Warning | `rgba(255,185,95,0.10)` | `#ffb95f` | `1px rgba(warning, 0.28)` | In Progress |
| Danger | `rgba(255,107,107,0.10)` | `danger` | `1px rgba(danger, 0.28)` | Voided, Error |
| Neutral | `rgba(255,255,255,0.05)` | `text-muted` | `1px border` | Archived, Stage |
| UV / accent | `uv-soft` | `#a07aff` | `1px rgba(uv, 0.30)` | Championship, Special |
| Solid mint | `mint` | `#000` | none | Featured / primary |

### Cards

- Background: `surface` (`#1a1a1a`)
- Border: `1px solid border-strong`
- Border radius: `r-card` (16px)
- Padding: `14px 16px`
- Hover: border → `border-mint`, background → `surface-raised`
- Transition: `border-color 150ms, background 150ms`

Team logo inside cards: `42×42px`, `border-radius: 10px`.

### Tables

- Wrapper: `surface` background, `1px border-strong`, `r-card` (16px) radius, `overflow: hidden`
- Header row: `surface-raised` background, JetBrains Mono 9px / 600 / UPPERCASE / 1.8px tracking, `text-muted`
- Body row: Space Grotesk 15px / `text-muted`; numeric columns JetBrains Mono 13px / right-aligned
- Row divider: `rgba(255,255,255,0.04)`
- Row hover: `rgba(255,255,255,0.025)` tint, text → `text-soft`
- Rank pip: 22px × 22px circle, mono 10px / 700; gold / silver / bronze tints for top 3

### Inputs & Forms

- Background: `#0d0d0d` (nav-bg)
- Border: `1px solid border-strong`
- Border radius: `r-input` (4px)
- Text: `#ffffff`, Space Grotesk 15px / 400
- Placeholder: `text-dim`
- Focus: border → `border-mint`
- Height: 40px

Form panel background: `surface`, border `border-strong`, radius `r-card` (16px), padding 24px.
Form section label (field-label): JetBrains Mono 9px / 600 / UPPERCASE / 1.5px tracking, `text-muted`.

### Navigation (Sidebar)

- Sidebar background: `nav-bg` (`#0d0d0d`), width 220px, `1px border-strong` right edge
- Wordmark: Anton 26px, letter-spacing 1.5px
- Nav section label: JetBrains Mono 9px / 600 / UPPERCASE / 2px tracking, `text-dim`
- Nav item: Space Grotesk 15px / 500, `text-muted`; padding `10px 20px`; `border-left: 2px solid transparent`
- Nav item hover: text → `text`, `rgba(255,255,255,0.03)` background
- Nav item active: text → `mint`, `border-left-color: mint`, background → `mint-soft`

### Stat Leader Cards

- Four-column grid, `r-card` (16px), `surface` background, `border-strong` border
- Stat label: JetBrains Mono 9px / 600 / UPPERCASE / 1.8px tracking
- Stat value: Anton 52px / 400 / letter-spacing 1px — the visual centrepiece
- Player name: Space Grotesk 15px / 700
- Team name: JetBrains Mono 9px / UPPERCASE / 1.2px tracking, `text-muted`
- Per-card gradient tint (subtle, pointer-events none): different hue per stat category

### Match Score Display

**List view (match card):**
- Team name: Space Grotesk 15px / 600; winner → `text`, loser → `text-muted`
- Score: JetBrains Mono 22px / 700; winner → `text`, loser → `text-muted`
- Event / stage meta: JetBrains Mono 10px / 600 / UPPERCASE, `text-muted`
- Color bar: 3px × 26px, `border-radius: 2px`, team color

**Detail view:**
- Team name: Anton 24px
- Score: JetBrains Mono 40px / 700

## Do's and Don'ts

### Do
- Use `#131313` as the canvas for every view — no light mode
- Reserve mint for the single most important interactive element per screen
- Use Anton only at ≥ 24px; never for labels or body copy
- Use JetBrains Mono for all numerical columns, labels, and metadata — always UPPERCASE for labels
- Apply 1.5–2px letter-spacing to every UPPERCASE mono label
- Use 1px borders (`border-strong` or `border-mint`) as the only depth mechanism
- Keep card padding tight: `14px 16px` for standard cards, not 24px+
- Apply `border-left: 2px mint` for active sidebar items — not background alone

### Don't
- Don't add `box-shadow` for card elevation; use 1px borders only
- Don't use Anton below 24px
- Don't use Space Grotesk for numerical data columns; use JetBrains Mono
- Don't use gradients on backgrounds or card fills
- Don't let mint appear as a background wash — only as button fill, active indicator, or 1px border
- Don't use `text-dim` (`#555555`) for any readable body content — only for decorative / disabled states
- Don't add border radius below 4px (inputs) or above 24px (buttons) outside the defined scale
