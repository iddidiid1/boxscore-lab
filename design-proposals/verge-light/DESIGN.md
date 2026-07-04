---
version: alpha
name: verge-light
description: Light-mode adaptation of the Verge 2024 redesign for a sports data app. White and light-gray backgrounds, near-black text, Jelly Mint (#3cffd0) as the sole accent. Three-button system — mint-fill CTA, black-fill secondary, black-pill-with-mint-text badge. Same typographic skeleton as verge-dark (Anton display, Space Grotesk UI, JetBrains Mono data) and same large border-radius vocabulary (24px buttons, 16px cards).

relationship-to-verge-dark: Same Verge design language, different polarity. verge-dark inverts the canvas to near-black — verge-light stays on white/gray as the Verge website does. Mint remains the accent in both variants; its role shifts from "glowing signal on dark" to "pop of color on white."
---

## Overview

White canvas with Jelly Mint as punctuation. The design reads as editorial-clean rather than atmospheric-dark. Black text on white provides maximum readability; mint appears only on the most important interactive elements. Black pill badges flip the mint to text color instead of fill, creating a high-contrast stamp against white backgrounds.

## Colors

| Token | Value | Use |
|-------|-------|-----|
| `--canvas` | `#ffffff` | Page background |
| `--surface` | `#f5f5f5` | Card / panel background |
| `--surface-raised` | `#ededed` | Hover state, slightly elevated |
| `--surface-dark` | `#0a0a0a` | Black button fill, black pill fill |
| `--mint` | `#3cffd0` | Mint button fill; mint text on dark pill |
| `--mint-dim` | `#2ccfaa` | Mint button hover |
| `--mint-soft` | `rgba(60,255,208,0.12)` | Active nav background tint |
| `--text` | `#0a0a0a` | Primary text |
| `--text-muted` | `#555555` | Secondary text |
| `--text-dim` | `#999999` | Placeholder, faint labels |
| `--text-on-mint` | `#000000` | Text on mint button |
| `--text-on-dark` | `#ffffff` | Text on black button |
| `--border` | `rgba(0,0,0,0.10)` | Default 1px border |
| `--border-strong` | `rgba(0,0,0,0.18)` | Emphasis border |
| `--border-mint` | `rgba(60,255,208,0.60)` | Mint-outline hover |
| `--success` | `#3cffd0` | Unified with mint |
| `--warning` | `#f59e0b` | |
| `--danger` | `#ef4444` | |

## Typography

Same font stack as verge-dark:
- **Display / headers**: Anton (bold condensed editorial)
- **UI / body**: Space Grotesk 400–700
- **Data / mono**: JetBrains Mono

## Shape

Same radius vocabulary as verge-dark:
- Input: 4px (tight, functional)
- Badge / pill: 20px
- Card: 16px
- Button: 24px (pill)

## Button System

Three variants cover all actions:

| Variant | Fill | Text | Use |
|---------|------|------|-----|
| `btn-mint` | `#3cffd0` | `#000000` | Primary CTA (Create, Save) |
| `btn-black` | `#0a0a0a` | `#ffffff` | Secondary action (Manage, Edit) |
| `btn-ghost` | transparent | `#0a0a0a` | Tertiary / cancel |
| `btn-danger` | transparent | `#ef4444` | Destructive (Void, Delete) |

## Badge / Pill System

| Variant | Fill | Text | Use |
|---------|------|------|-----|
| Black pill + mint text | `#0a0a0a` | `#3cffd0` | Status: Active, Completed, Season |
| Mint fill + black text | `#3cffd0` | `#000000` | Highlight / featured tag |
| Neutral light | `#ededed` | `#555555` | Inactive, Archived |
| Danger | `rgba(239,68,68,0.10)` | `#ef4444` | Voided, Error |
| Warning | `rgba(245,158,11,0.10)` | `#f59e0b` | In Progress |
