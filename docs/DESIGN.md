---
name: Pro-Density Analytics
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394d'
  surface-container-lowest: '#060e20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3d'
  surface-container-highest: '#2d3449'
  on-surface: '#dae2fd'
  on-surface-variant: '#c2c6d6'
  inverse-surface: '#dae2fd'
  inverse-on-surface: '#283044'
  outline: '#8c909f'
  outline-variant: '#424754'
  surface-tint: '#adc6ff'
  primary: '#adc6ff'
  on-primary: '#002e6a'
  primary-container: '#4d8eff'
  on-primary-container: '#00285d'
  inverse-primary: '#005ac2'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#ca8100'
  on-tertiary-container: '#3e2400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#d8e2ff'
  primary-fixed-dim: '#adc6ff'
  on-primary-fixed: '#001a42'
  on-primary-fixed-variant: '#004395'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#0b1326'
  on-background: '#dae2fd'
  surface-variant: '#2d3449'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 30px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-base:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
  data-label:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1'
    letterSpacing: 0.05em
  data-point:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1'
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 4px
  gutter: 16px
  margin-desktop: 32px
  margin-mobile: 16px
  max-width: 1440px
---

## Brand & Style

This design system is engineered for the high-stakes world of fantasy sports analytics. The brand personality is **Elite, Analytical, and Tactical**. It avoids the flashy tropes of gaming interfaces in favor of the disciplined, information-rich aesthetic found in professional F1 telemetry and advanced football scouting software.

The target audience consists of serious enthusiasts and professionals who value speed of insight and data depth over visual fluff. The emotional response is one of **calculated confidence**—the UI feels like a high-performance tool rather than a toy. 

The design style is **Corporate Modern with a Tactical edge**. It utilizes a dark, low-fatigue environment that allows bright data points to emerge with clarity. It prioritizes structure, utilizing thin borders and modular units to organize complex datasets into digestible streams of intelligence.

## Colors

The palette is anchored in a high-contrast dark environment. 
- **Base Surfaces:** Use `#0F172A` for the canvas and `#1E293B` for elevated cards and modules to create depth without relying on heavy shadows.
- **Data Accents:** Electric Blue (`#3B82F6`) is reserved for primary actions and active states. Emerald Green (`#10B981`) signifies positive deltas, "on-track" performance, or confirmed selections. 
- **Functional Warnings:** A muted Amber (`#F59E0B`) should be used sparingly for "at-risk" player statuses or pending changes.
- **Borders:** Every modular element is defined by a thin, low-opacity border (`#334155`) to maintain structure in a dense layout.

## Typography

This design system employs a tri-font strategy to separate intent and improve scanability:
1. **Hanken Grotesk** is used for headlines and primary navigation, providing a contemporary, sharp professional look.
2. **Inter** serves as the workhorse for body copy and general UI text, chosen for its exceptional legibility at small sizes.
3. **JetBrains Mono** is critical for all statistical data points, coordinates, and labels. The monospaced nature ensures that columns of numbers align perfectly, allowing users to compare vertical lists of stats with zero visual drift.

Text should rarely be pure white; use `#F8FAFC` for primary content and `#94A3B8` for secondary labels to reduce eye strain in the dark environment.

## Layout & Spacing

The layout philosophy follows a **Modular Grid System** designed for high information density. 
- **Grid:** A 12-column grid on desktop with a fixed 16px gutter. Modules should be sized in 3, 4, or 6-column spans.
- **Rhythm:** An 8px linear scale (with 4px increments for tight data tables) governs all padding and margins. 
- **Density:** Padding within cards should be restrained (12px-16px) to maximize the "above the fold" data visibility. 
- **Responsive Behavior:** On mobile, the grid collapses to a single column, but "Data Strips" (horizontal scrolling tables) are utilized to keep statistical tables intact without forcing excessive vertical scrolling.

## Elevation & Depth

Depth is achieved through **Tonal Layering** rather than traditional drop shadows.
- **Level 0 (Canvas):** `#0F172A` (Bottom-most layer).
- **Level 1 (Card/Surface):** `#1E293B` with a 1px border of `#334155`.
- **Level 2 (Popovers/Modals):** `#2D3748` with a very soft, 15% opacity black shadow (0px 10px 25px) to lift it above the modules.

Avoid gradients on backgrounds. A very subtle linear gradient (from `#1E293B` to `#242F42`) may be applied to buttons or active headers to give them a "machined" metallic feel, but flat surfaces are generally preferred for clarity.

## Shapes

The shape language is **Precision-Focused**. 
- Standard components (Buttons, Inputs, Cards) use a **4px corner radius**. This provides a subtle "modern" touch while maintaining the sharp, professional aesthetic of a technical instrument.
- Data markers and status pips use **0px (Sharp)** corners to reinforce the "grid-like" telemetry vibe.
- Icons should use a consistent 1.5px stroke weight and sharp terminals to match the font geometry.

## Components

- **Buttons:** Primary buttons use a solid `#3B82F6` fill with white text. Secondary buttons use a ghost style (border only) with the `#334155` border color.
- **Data Cards:** These are the core atoms. They must include a `Card Header` with a monospaced label and a `Card Body` that often contains a condensed table or a sparkline chart.
- **Sparklines:** Use the Primary Blue or Secondary Green with a 1.5px stroke and a very subtle area-fill (10% opacity) beneath the line.
- **Inputs:** Dark backgrounds (`#0F172A`) with a subtle `#334155` border. On focus, the border shifts to the primary blue. Use JetBrains Mono for the input text.
- **Status Chips:** Small, rectangular indicators with 2px rounding. Use background tints of the accent colors (e.g., 20% Emerald Green background with 100% Emerald Green text) for "Active" or "Healthy" statuses.
- **Telemetry Tabs:** Horizontal navigation with a bottom-bar indicator. The active tab should be highlighted in the primary accent, while inactive tabs remain secondary gray.