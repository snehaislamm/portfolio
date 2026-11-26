---
name: The Fab Line
description: Visual identity for Sneha Islam's game portfolio, in the "Block Biome" direction. Blocky, earthy and game-like, with each Station drawn as its own landscape (biome).
status: final
updated: 2026-11-25
direction: "B · Block Biome (chosen by Sneha from .working/directions-1.html; replaces the old navy/cyan site palette)"
sources:
  - docs/content-inventory.md (§14 SVGs, §19 character assets, D1, D13–D14)
  - _bmad-output/planning-artifacts/prds/prd-portfolio-2026-11-25/prd.md
  - .working/directions-1.html (direction B)
colors:
  # Surfaces
  coal: '#1a1a17'         # page background
  inset: '#222220'        # metric tiles, diagram wells
  panel: '#2b2a25'        # cards, HUD, dialogue
  edge: '#000000'         # block outlines (3–4 px)
  # Text (all ≥4.5:1 on panel)
  text: '#f3f0e6'         # 12.6:1
  muted: '#c7c1ad'        # 8.0:1
  dim: '#a39d8a'          # 5.3:1, small labels
  # Earth & block colours
  grass: '#7fb045'        # 5.6:1 as text
  grass-dark: '#4f7a26'   # fills only
  dirt: '#b07a45'         # fills/borders only (3.9:1, fails small text)
  dirt-dark: '#6e4824'    # fills only
  stone: '#8a8a84'        # fills/borders only (4.1:1 on panel)
  stone-dark: '#5f5f5a'
  stone-light: '#b5b5ae'
  # Accents
  gold: '#f2c94c'         # primary accent: Résumé, metric numbers, achievements (9.1:1)
  gold-dark: '#b8922a'
  gold-light: '#fff3b0'
  sky: '#6fc0e8'          # 7.1:1
  lava: '#ef8d4b'         # 5.9:1
  amethyst: '#b79cf0'     # 6.2:1
  snow: '#e6eef2'         # 12.2:1
  on-accent: '#1a1a17'    # text on any accent fill (≥5:1 on all of them)
  # Semantic roles
  primary: '{colors.gold}'
  station-ai: '{colors.sky}'          # "Sky Plains"
  station-power: '{colors.lava}'      # "Mesa"
  station-compiler: '{colors.amethyst}' # "Crystal Cave"
  station-cleanroom: '{colors.snow}'  # "Snowfield Lab"
  status-done: '{colors.grass}'
  status-active: '{colors.gold}'
  status-next: '{colors.sky}'
  locked: '{colors.stone}'
typography:
  display:
    fontFamily: 'JetBrains Mono'
    fontSize: 'clamp(2.2rem, 6vw, 3.8rem)'
    fontWeight: '800'
    lineHeight: '1.05'
    letterSpacing: 0.02em
    textTransform: uppercase
    textShadow: '4px 4px 0 {colors.edge}'
  station-title:
    fontFamily: 'JetBrains Mono'
    fontSize: 'clamp(1.5rem, 4vw, 2.1rem)'
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: 0.04em
    textTransform: uppercase
    textShadow: '3px 3px 0 {colors.edge}'
  card-title:
    fontFamily: 'Space Grotesk'
    fontSize: 1.2rem
    fontWeight: '700'
    lineHeight: '1.25'
  body:
    fontFamily: 'Space Grotesk'
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.55'
  dialog:
    fontFamily: 'Space Grotesk'
    fontSize: 1.05rem
    fontWeight: '600'
    lineHeight: '1.4'
  metric:
    fontFamily: 'JetBrains Mono'
    fontSize: 1.45rem
    fontWeight: '800'
    lineHeight: '1.1'
  label:
    fontFamily: 'JetBrains Mono'
    fontSize: 0.72rem
    fontWeight: '600'
    letterSpacing: 0.06em
  button:
    fontFamily: 'JetBrains Mono'
    fontSize: 0.8rem
    fontWeight: '800'
    letterSpacing: 0.04em
    textTransform: uppercase
rounded:
  none: 0px
  DEFAULT: 0px
spacing:
  px: 4px                 # the "block pixel": borders, bevels and offsets are multiples of 4 px
  '1': 4px
  '2': 8px
  '3': 12px
  '4': 16px
  '5': 24px
  '6': 32px
  '7': 48px
  '8': 80px
  border: 4px
  border-sm: 3px
  bevel: 3px
  drop: 6px
  gutter-mobile: 16px
  gutter-desktop: 28px
  content-max: 1120px
  hud-height: 60px
  touch-min: 44px
components:
  hud-bar:
    background: '{colors.panel}'
    border-bottom: '{spacing.border} solid {colors.edge}'
    height: '{spacing.hud-height}'
  button-primary:
    background: '{colors.gold}'
    foreground: '{colors.on-accent}'
    border: '{spacing.border-sm} solid {colors.edge}'
    bevel: 'inset -3px -3px 0 {colors.gold-dark}, inset 3px 3px 0 {colors.gold-light}'
    pressed-bevel: 'inset 3px 3px 0 {colors.gold-dark}'
    font: '{typography.button}'
    radius: '{rounded.none}'
    min-size: '{spacing.touch-min}'
  button-stone:
    background: '{colors.stone}'
    foreground: '{colors.on-accent}'
    border: '{spacing.border-sm} solid {colors.edge}'
    bevel: 'inset -3px -3px 0 {colors.stone-dark}, inset 3px 3px 0 {colors.stone-light}'
    font: '{typography.button}'
    min-size: '{spacing.touch-min}'
  button-grass:
    background: '{colors.grass}'
    foreground: '{colors.on-accent}'
    border: '{spacing.border-sm} solid {colors.edge}'
    bevel: 'inset -3px -3px 0 {colors.grass-dark}, inset 3px 3px 0 #a9d46c'
  level-card:
    background: '{colors.panel}'
    border: '{spacing.border} solid {colors.edge}'
    shadow: '{spacing.drop} {spacing.drop} 0 {colors.edge}'
    header: 'grass cap: {colors.grass} 70% over {colors.grass-dark} 30%, 4 px black underline'
    header-foreground: '{colors.on-accent}'
    radius: '{rounded.none}'
  metric-tile:
    background: '{colors.inset}'
    border: '{spacing.border-sm} solid {colors.edge}'
    top-strip: 'inset 0 4px 0 {colors.dirt-dark}'
    number: '{typography.metric}'
    number-color: '{colors.gold}'
    label-color: '{colors.muted}'
  dialog-box:
    background: '{colors.panel}'
    border: '{spacing.border} solid {colors.edge}'
    portrait-frame: '{spacing.border-sm} solid {colors.edge}'
    portrait-size: 64px
    font: '{typography.dialog}'
  xp-bar:
    track: '{colors.edge}'
    fill: 'segments: {colors.grass} 10 px, {colors.grass-dark} 2 px gap'
    height: 10px
  achievement-toast:
    background: '{colors.panel}'
    border: '{spacing.border} solid {colors.edge}'
    inner-ring: 'inset 0 0 0 2px {colors.gold}'
  status-pill:
    border: '2px solid {colors.edge}'
    font: '{typography.label}'
    radius: '{rounded.none}'
  minimap-node:
    size: 14px
    shape: square
    border: '2px solid {colors.edge}'
    unvisited: '#3d3b34'
    visited: '{colors.grass}'
    current: '{colors.gold}'
    locked: '{colors.stone}'
    connector: '4px {colors.edge}'
  skill-node:
    background: '{colors.inset}'
    border: '{spacing.border-sm} solid {colors.edge}'
    proven-cap: '{colors.grass}'
    unproven-opacity: 0.45
  focus-ring:
    outline: '3px solid {colors.gold}'
    offset: 3px
  sprite:
    style: 'pixel art, integer-scaled, image-rendering: pixelated'
    native: '32×48 px'
    display: '64×96 (×2) on desktop and mobile; never a fractional scale'
---

## Brand & Style
**Block Biome:** the portfolio is a small blocky world. Every Station is a **biome** built from chunky, flat-coloured blocks, and the UI is made of the same blocks: thick black outlines, bevelled buttons you want to press, grass-capped cards and a segmented XP bar. It reads as **a game** within a second, which is the point, and it stays calm enough for a recruiter to scan.

The look is inspired by the earthy, blocky colours of sandbox building games. It uses **only flat colours and simple 4 px "pixel" speckles of our own**. It does **not** copy any game's textures, block art, logos, fonts, UI layouts or characters.

**Sneha's Ghibli portrait (D1)** still appears on the Title Screen and in the dialogue box, set inside a thick black block frame like a painting hung in the world. Sneha chose B knowing it contrasts with the soft watercolour. The frame is what makes that contrast feel deliberate.

**Voice in visuals:** chunky, friendly, precise. Every number is set in mono and gold, like loot.

## Colors
- **Coal, inset and panel** (`{colors.coal}`, `{colors.inset}`, `{colors.panel}`): the dark ground everything sits on. Cards are `panel`; metric tiles and diagram wells are `inset`.
- **Black edge** (`{colors.edge}`): every block has a 3–4 px black outline. This is the single strongest stylistic rule.
- **Grass** (`{colors.grass}` / `{colors.grass-dark}`): the cap on every Level Card header, *Completed* status and the XP bar. Green = done, growing.
- **Dirt** (`{colors.dirt}` / `{colors.dirt-dark}`): ground strips, the top edge of metric tiles, and the soil under the horizon. **Fills and borders only, never text** (3.9:1).
- **Stone** (`{colors.stone}`): secondary buttons (Copy link, More), contact icons and the locked Quantum Fab. **Never text** (4.1:1).
- **Gold** (`{colors.gold}`): the **one primary accent**. It marks the Résumé button, every metric number, *Active* status, achievements and the focus ring. Gold means "valuable, look here".
- **Biome colours:** each Station's tag, sky tint and diagram strokes use its own colour:

  | Station | Biome | Colour |
  |---|---|---|
  | AI in Production | **Sky Plains** | `{colors.sky}` |
  | Power & Control | **Mesa** | `{colors.lava}` |
  | Compiler & EDA | **Crystal Cave** | `{colors.amethyst}` |
  | Cleanroom | **Snowfield Lab**: white tiles, clean | `{colors.snow}` |

- **Text ramp:** `{colors.text}` (12.6:1), `{colors.muted}` (8.0:1), `{colors.dim}` (5.3:1). Everything that is text meets WCAG AA on `panel`, `inset` and `coal`. Text on any accent fill uses `{colors.on-accent}` (≥5:1).

**Avoid:** gradients (except the sky backdrops), rounded corners, glows, colour as the only signal, and brown or stone as text.

## Typography
- **JetBrains Mono ExtraBold, uppercase,** with a hard 3–4 px black drop shadow, for the name, Station titles, buttons and labels. This is the "game" voice and stays legible, unlike pixel fonts.
- **Space Grotesk** for anything read as sentences: card titles, Captions, dialogue, body.
- **Metric numbers:** JetBrains Mono ExtraBold in `{colors.gold}`.
- **No pixel or bitmap fonts.** They fail readability at small sizes and on mobile.
- Both fonts are self-hosted and subset (NFR-4), with `font-display: swap`.

## Layout & Spacing
- **The 4 px block pixel** (`{spacing.px}`): every border, bevel, shadow offset and speckle is a multiple of 4 px. That keeps the world feeling made of blocks.
- **Content width:** `{spacing.content-max}`. Gutters are 16 px on mobile and 28 px on desktop.
- **Each Station is a biome scene**, at least one viewport tall:
  - a sky band in the biome colour
  - a **stepped block horizon** (hills built from rectangles)
  - a grass-and-dirt ground strip that the sprite walks along
  - Level Cards standing on top
- **Level Cards:** 2 columns at ≥860 px and 1 below. Feature cards (Communitech, MIS, capstone) span both columns.
- **HUD:** top bar at ≥600 px, bottom bar below that (`{spacing.hud-height}`), plus safe-area insets.

## Elevation & Depth
Depth is **hard and pixel-like:** a solid black offset shadow (`6px 6px 0` black) under cards and toasts, and 3 px **bevels** (light top-left, dark bottom-right) on buttons. A pressed button swaps to an inner shadow and moves down 2 px. There are **no blurred shadows** anywhere. Overlays (the Inspect drawer and sheets) sit on a `rgba(0,0,0,.6)` backdrop, framed with a 4 px black border.

## Shapes
**Square everything:** `{rounded.none}`. Circles appear only in Sneha's portrait image itself. Status pills, Mini-map nodes, skill nodes and avatar frames are all squares or rectangles. The Quantum Fab door is a **block arch** made of stone blocks, with a padlock.

## Components
- **HUD bar:**
  - Left: a square-framed avatar plus the name in mono uppercase.
  - Centre: the Mini-map, as square nodes on a 4 px black connector.
  - Right: **Résumé** (the gold bevelled button, the only gold button in the HUD), then Email, LinkedIn and GitHub as stone bevelled icon buttons, then "⋯ More" (stone).
  - The XP bar is a 10 px segmented bar under the HUD.
  - On mobile, the bottom bar keeps Résumé and the 3 contact icons, and everything else goes under More.
- **Dialogue box:** a panel with a 4 px black border and a 4 px dark underside. It holds a 64 px portrait in a black square frame and one Character Line in `{typography.dialog}`.
- **Level Card:**
  - **Grass-cap header strip** in coal text: the path `ai/communitech` on the left, the status on the right.
  - **Body:** title, diagram in an `inset` well (strokes in the biome colour, 2–3 px), the 3 metric tiles, Captions, tech chips.
  - **Footer:** **Inspect ▸** (grass button), **Repo ↗** and **Copy link** (stone buttons).
  - **Frame:** 4 px black border with a 6 px black drop.
- **Metric tile:** `inset` background with a dirt-dark top strip (like soil under grass), a gold number and a muted label of ≤6 words. Qualifiers go in the label.
- **Status pill:** a square pill with a 2 px black edge. Completed = grass with "✓ DONE", Active = gold with "● ACTIVE", Next = sky with "→ NEXT", Locked = stone with a padlock.
- **Achievement toast:** a panel with a 4 px black border, a gold inner ring and a 24 px pixel badge icon. It slides in **in 4 px steps** (`steps()` easing).
- **Mini-map node:** 14 px squares. Visited = grass, current = gold, unvisited = dark, locked = stone with a padlock.
- **Skill node:** an inset chip. Proven skills get a grass cap and a count; unproven ones sit at 45% opacity.
- **Biome backdrop (per Station):**
  - SVG with `shape-rendering: crispEdges`: a sky band, 2–3 rows of stepped block hills, a grass strip (10 px light + 10 px dark), a dirt band with a few 20 px lighter "pebble" squares.
  - Each biome changes only the sky colour and one prop silhouette: clouds for Sky Plains, mesa steps for Mesa, crystals for Crystal Cave, white tiles and a fume hood for Snowfield Lab.
- **Title Screen:**
  - The framed Ghibli portrait standing on a grass-block plinth.
  - The name in display type with a black drop shadow, the tagline in Space Grotesk.
  - Three chips as stone blocks.
  - an availability line with a sky "→ NEXT" pill ("8-month co-op · Jan–Aug 2027").
  - **3 Proof Tiles** in metric-tile style (gold number + ≤6-word label): 1,200+ · ±2% · 102.6 nm.
  - **▶ Start** (grass) and **Résumé** (gold). There is no Recruiter Mode button (D15).
- **Locked door (Quantum Fab):** a stone-block arch with a dark doorway and a gold padlock, labelled "Dream: quantum computer hardware".
- **Sprite:** pixel art; see EXPERIENCE.md §12.

## Do's and Don'ts
| Do | Don't |
|---|---|
| Outline every block in 3–4 px black | Use hairline borders or rounded corners |
| Use flat colours plus our own 4 px speckles | Copy any game's textures, block art, logos or UI |
| Make gold the only accent for value (Résumé, numbers, achievements) | Use gold for decoration |
| Keep brown and stone to fills and borders | Set any text in brown or stone |
| Use bevels and hard offset shadows for depth | Use blurred shadows or glows |
| Use mono uppercase with a black drop shadow for titles | Use pixel or bitmap fonts |
| Integer-scale the pixel sprite with `image-rendering: pixelated` | Scale pixel art by fractional factors (blurry) |
| Frame the watercolour portrait in a thick black block frame | Put the portrait in a soft round frame |
