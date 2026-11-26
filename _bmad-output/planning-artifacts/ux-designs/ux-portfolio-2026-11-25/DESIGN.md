---
name: The Fab Line
description: Visual identity for Sneha Islam's game portfolio. It keeps the current site's dark engineering-blueprint look and extends it with game UI.
status: draft
updated: 2026-11-25
sources:
  - docs/content-inventory.md (§15 visual system, §14 SVGs, §19 character assets)
  - _bmad-output/planning-artifacts/prds/prd-portfolio-2026-11-25/prd.md
colors:
  bg: '#070b14'
  bg-2: '#0c1322'
  panel: '#0f1829'
  line: '#1c2a44'
  grid: 'rgba(79,209,197,.06)'
  text: '#e2e8f0'
  muted: '#8a9bb8'
  dim: '#7184a8'          # was #56688a; changed for WCAG AA (4.71:1 on panel)
  rule: '#56688a'         # old dim, kept for non-text lines and dividers only
  cyan: '#4fd1c5'
  cyan-d: '#2c9c93'
  violet: '#9f7aea'
  amber: '#f6ad55'
  red: '#fc8181'
  on-cyan: '#04201d'
  station-ai: '{colors.violet}'
  station-power: '{colors.amber}'
  station-compiler: '{colors.red}'
  station-cleanroom: '{colors.cyan}'
  status-done: '{colors.cyan}'
  status-active: '{colors.amber}'
  status-next: '{colors.violet}'
  locked: '{colors.dim}'
typography:
  display:
    fontFamily: 'Space Grotesk'
    fontSize: 'clamp(2.4rem, 6vw, 4.2rem)'
    fontWeight: '700'
    lineHeight: '1.02'
    letterSpacing: -0.02em
  station-title:
    fontFamily: 'Space Grotesk'
    fontSize: 'clamp(1.6rem, 4vw, 2.2rem)'
    fontWeight: '600'
    lineHeight: '1.15'
  card-title:
    fontFamily: 'Space Grotesk'
    fontSize: 1.2rem
    fontWeight: '600'
    lineHeight: '1.25'
  body:
    fontFamily: 'Space Grotesk'
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.55'
  dialog:
    fontFamily: 'Space Grotesk'
    fontSize: 1.05rem
    fontWeight: '500'
    lineHeight: '1.4'
  metric:
    fontFamily: 'JetBrains Mono'
    fontSize: 1.5rem
    fontWeight: '700'
    lineHeight: '1.1'
  label:
    fontFamily: 'JetBrains Mono'
    fontSize: 0.72rem
    fontWeight: '500'
    letterSpacing: 0.08em
  hud:
    fontFamily: 'JetBrains Mono'
    fontSize: 0.78rem
    fontWeight: '500'
    letterSpacing: 0.06em
rounded:
  sm: 3px
  md: 4px
  lg: 6px
  pill: 9999px
spacing:
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 24px
  '6': 32px
  '7': 48px
  '8': 80px
  gutter-mobile: 16px
  gutter-desktop: 28px
  content-max: 1120px
  hud-height: 56px
  touch-min: 44px
components:
  hud-bar:
    background: 'rgba(7,11,20,.86)'
    border: '1px solid {colors.line}'
    height: '{spacing.hud-height}'
    font: '{typography.hud}'
  hud-button-primary:
    background: '{colors.cyan}'
    foreground: '{colors.on-cyan}'
    radius: '{rounded.md}'
    min-size: '{spacing.touch-min}'
  hud-icon-button:
    background: '{colors.panel}'
    foreground: '{colors.muted}'
    hover-foreground: '{colors.cyan}'
    radius: '{rounded.md}'
    min-size: '{spacing.touch-min}'
  dialog-box:
    background: '{colors.panel}'
    border: '1px solid {colors.line}'
    accent-edge: '3px solid {colors.cyan}'
    radius: '{rounded.lg}'
    font: '{typography.dialog}'
    portrait-size: 72px
  level-card:
    background: '{colors.panel}'
    border: '1px solid {colors.line}'
    hover-border: '{colors.cyan-d}'
    radius: '{rounded.lg}'
  metric-tile:
    background: '{colors.bg-2}'
    number: '{typography.metric}'
    number-color: '{colors.cyan}'
    label-color: '{colors.dim}'
  xp-bar:
    track: '{colors.line}'
    fill: 'linear-gradient(90deg, {colors.cyan}, {colors.violet})'
    height: 6px
    radius: '{rounded.pill}'
  achievement-toast:
    background: '{colors.panel}'
    border: '1px solid {colors.amber}'
    icon-color: '{colors.amber}'
    radius: '{rounded.lg}'
  badge-status:
    radius: '{rounded.sm}'
    font: '{typography.label}'
  minimap-node:
    size: 14px
    visited: '{colors.cyan}'
    current-ring: '{colors.amber}'
    unvisited: '{colors.rule}'
    locked: '{colors.locked}'
  skill-node:
    background: '{colors.bg-2}'
    border: '1px solid {colors.line}'
    proven-border: '{colors.cyan-d}'
    unproven-opacity: 0.45
    radius: '{rounded.md}'
  focus-ring:
    outline: '2px solid {colors.cyan}'
    offset: 2px
---

## Brand & Style
The Fab Line is an **engineering blueprint that came alive**. Its visual DNA is the current site: dark navy paper, a cyan grid, mono labels, corner registration marks, "FIG. 01" captions, datasheet tables and a title-block footer. The game layer adds a HUD, a dialogue box, badges and an XP bar. These are drawn in the same thin-line, technical style, so the game feels like part of the drawing set, not a different product.

**The one warm exception** is Sneha's Ghibli-style portrait (D1). It appears on the Title Screen and in the dialogue box, framed like a photo pinned to a blueprint. The warmth signals *this is a person, not a spec sheet*, and the darkness around it signals *and she builds hard things*.

Voice in visuals: precise, a little playful, never cute. Think lab notebook with doodles in the margin.

## Colors
- **Navy surfaces** (`{colors.bg}`, `{colors.bg-2}`, `{colors.panel}`) carry the whole UI. Cards sit on `panel`; diagrams and metric tiles sit on `bg-2`.
- **Cyan** (`{colors.cyan}`) is the primary accent: links, the primary button (the Résumé), metric numbers, focus rings, *Completed* status and the Cleanroom Station.
- **Violet** (`{colors.violet}`) marks AI: the AI in Production Station, *Next* status and the second half of the XP gradient.
- **Amber** (`{colors.amber}`) marks hardware and *in progress*: the Power & Control Station, the *Active* Main Quest pill and achievement toasts. Amber always means "warm, live, look here".
- **Red** (`{colors.red}`) marks systems: the Compiler & EDA Station. Never use it for errors, because there are no error states in content.
- **Text ramp:** `{colors.text}` (15.9:1) for headings and values, `{colors.muted}` (6.3–7.0:1) for body, and `{colors.dim}` (4.7–5.2:1) for small labels. The old dim, now `{colors.rule}`, is **only for lines and dividers, never text**.
- Category colour = Station colour = coursework legend colour. This mapping already exists on the site; keep it consistent.

**Avoid:** new hues, gradients other than the XP bar and the H1 accent, colour as the only signal (status pills always carry a word as well).

## Typography
- **Space Grotesk** for anything read as language: the display name, Station titles, card titles, body, dialogue.
- **JetBrains Mono** for anything read as data: metric numbers, labels, the HUD, Deep Link paths, status pills and the "FIG." captions.
- Metric numbers are the loudest thing on a card after the diagram (`{typography.metric}`, cyan).
- Fonts are self-hosted and subset (NFR-4), with `font-display: swap`. Fallbacks are `system-ui, sans-serif` and `ui-monospace, monospace`.

## Layout & Spacing
- **Content width:** `{spacing.content-max}`. Gutters are `{spacing.gutter-mobile}` below 600 px and `{spacing.gutter-desktop}` above.
- **Station:** at least one viewport tall. The Station header sits top-left, the Level Cards follow in a 2-column grid at ≥860 px and a single column below.
- **Main Level Card:** diagram on top (or left at ≥860 px when it is a feature card), then a 3-up metric row, then Captions. The metric row stays 3-up down to 360 px, with smaller numbers.
- **HUD:** a top bar at ≥600 px, a bottom bar below 600 px (`{spacing.hud-height}`). Its safe-area insets are added on top.
- **Background:** the existing 80 px / 16 px blueprint grid on `{colors.bg}`.

## Elevation & Depth
Flat, like a drawing. Depth comes from **borders and tone**, not shadows: `panel` on `bg`, `bg-2` insets inside panels. The two exceptions:
- The **Inspect drawer** and the **Skill Tree / Quest Log sheets** sit above the page with a backdrop (`rgba(7,11,20,.7)`) and one soft shadow (`0 20px 60px rgba(0,0,0,.45)`, the same as the current résumé sheet).
- The **achievement toast** uses the same shadow.

## Shapes
Small, technical radii (`{rounded.sm}` 3 px for pills and chips, `{rounded.md}` 4 px for buttons, `{rounded.lg}` 6 px for cards). Only the XP bar and Mini-map nodes are fully round. **Corner registration marks** (the current `.corner` brackets) frame three things: the Title portrait, the active Station's diagram and the Main Quest card.

## Components
- **HUD bar:** left: the avatar (`sneha-avatar-256.webp` at 32 px) and "Sneha Islam" in mono. Centre: the Mini-map. Right: **Résumé** (primary cyan button, the only filled button in the HUD), then the Email, LinkedIn and GitHub icon buttons, then a "More" button (Recruiter Mode, Motion, Skill Tree, Quest Log). XP shows as a 6 px bar along the HUD's bottom edge. On mobile the bottom bar shows Résumé and 3 contact icons, with everything else under "More".
- **Dialogue box:** a 72 px portrait crop (`sneha-portrait-256.webp`), a cyan left edge, and one Character Line in `{typography.dialog}`. It appears once per Station, under the Station title. No typewriter effect.
- **Level Card:** a mono header row (`ai/communitech` path on the left, status pill on the right), title, diagram on `bg-2` with an optional FIG caption, a 3-up metric row, Captions, tech chips, then a footer with **Inspect ▸**, **Repo ↗** (if any) and **Copy link**.
- **Metric tile:** the number (`{typography.metric}`, cyan) over a label (`{typography.label}`, dim, ≤6 words). Qualifiers ("simulated", "estimate") go in the label, never in a footnote.
- **Status pill:** Completed (cyan, ✓), Active (amber, ●), Next (violet, →), Locked (dim, 🔒 icon as SVG). Always has a word.
- **XP bar:** a cyan-to-violet gradient on a `line`-coloured track, labelled "Quests 9/17" in mono.
- **Achievement toast:** amber border, a 24 px badge icon, title in `{typography.card-title}` and one line in `{typography.label}`. It appears bottom-right on desktop and above the bottom HUD on mobile.
- **Mini-map node:** 14 px circles joined by a 1 px `rule` line. Visited nodes are filled cyan, the current one has an amber ring, unvisited ones are hollow, and the Quantum Fab node shows a padlock glyph.
- **Skill node:** a mono chip. Proven skills have a cyan-d border and a count ("3 cards"). Unproven ones sit at 45% opacity with no count.
- **Locked door (Quantum Fab):** the hexagon logo (SVG-1) enlarged, drawn in `dim` with a padlock, and one line beneath.
- **Sprite** (see the brief in EXPERIENCE.md): 64 px tall, SVG, rides the Track line at the left edge of the viewport on ≥860 px and at the bottom-left on mobile.

## Do's and Don'ts
| Do | Don't |
|---|---|
| Lead every card with the diagram | Put a paragraph above a diagram |
| Use mono for every number | Set metrics in the sans font |
| Keep qualifiers next to the number ("+14.1% · simulated") | Hide qualifiers in tooltips |
| Use the existing SVG style: thin strokes, mono labels, navy fills | Introduce photographic, 3D or glossy styles |
| Frame the warm portrait inside navy | Use the warm illustration as a full-bleed page background beyond the Title |
| Give every status a word and a colour | Use colour alone |
| Keep the Résumé button the only filled button in the HUD | Make other HUD buttons compete with it |
