---
status: draft
stepsCompleted: [1, 2, 3]
inputDocuments:
  - _bmad-output/planning-artifacts/prds/prd-portfolio-2026-11-25/prd.md
  - _bmad-output/planning-artifacts/prds/prd-portfolio-2026-11-25/addendum.md
  - _bmad-output/planning-artifacts/ux-designs/ux-portfolio-2026-11-25/DESIGN.md
  - _bmad-output/planning-artifacts/ux-designs/ux-portfolio-2026-11-25/EXPERIENCE.md
  - _bmad-output/planning-artifacts/ux-designs/ux-portfolio-2026-11-25/wireframes/wireframes.md
  - _bmad-output/planning-artifacts/ux-designs/ux-portfolio-2026-11-25/mockups/key-screens.html
  - _bmad-output/planning-artifacts/architecture/architecture-portfolio-2026-11-25/ARCHITECTURE-SPINE.md
  - _bmad-output/planning-artifacts/architecture/architecture-portfolio-2026-11-25/architecture-explainer.md
  - _bmad-output/planning-artifacts/briefs/brief-portfolio-2026-11-25/brief.md
  - docs/content-inventory.md
---

# The Fab Line (portfolio): Epic Breakdown

## Overview

This document breaks the PRD, the UX design contract and the architecture spine for **The Fab Line** into implementable epics and stories. Each story is sized at **≤1 evening for one person with Claude Code**, and the site stays **shippable after every epic**: the plain page on the new stack comes first, then the game layers on top.

## Requirements Inventory

### Functional Requirements

FR1: The Glance Card (Title Screen) shows "Sneha Islam", "Nano-Engineer · University of Waterloo", "from silicon to software.", the portrait (D1), the availability "8-month co-op · Jan–Aug 2027", and 3 Proof Tiles (1,200+ companies covered by the AI system she shipped · ±2% SoC accuracy · 102.6 nm SiNₓ film), plus a Résumé button. ≤30 visible words, all pre-rendered text (D15).
FR2: The Glance Card offers **▶ Start** (and Space/Enter/↓/scroll) to advance to the Character Card. Start and Résumé are its only buttons, both keyboard reachable with visible focus and ≥44×44 px (D15).
FR3: The Character Card shows the portrait, UWaterloo · BASc Nanotechnology Eng. · Nanoelectronics · 3B (Fall 2026), Equipment AZ-900 · AI-900, Home Toronto, ON, Next Quest "8-month co-op · Jan–Aug 2027", and the 4 interests with icons. It shows no invented stats.
FR4: The Character Card has a collapsible "Training" list of the 6 completed courses (NE 343, NE 344, NE 332, NE 333, NE 318, MSE 261) with topic chips, and no planned courses.
FR5: Scroll or swipe advances along the Track. Each Station is ≥1 viewport, its arrival animation plays once, backwards scrolling works, and there is no scroll-jacking.
FR6: Keyboard travel: ↓/PageDown/Space next; ↑/PageUp previous; Tab order follows the Track; focus is trapped only inside an open overlay (Esc closes it).
FR7: The Mini-map highlights the current Station and shows "Stations visited n/4". A Station counts as visited at 50% in view. Progress lasts for the session only.
FR8: Clicking a Mini-map node scrolls to that Station and updates the hash. The Quantum Fab node is locked.
FR9: The Level Card face (L0) shows, in order: title → diagram → up to 3 verbatim metrics (never padded, qualifiers attached) → Captions → text tech labels → links (repo, yunus-AI for Avanade, otherwise Details).
FR10: Every Main Level Card leads with a "how it works" SVG: reused SVG-2/3/4/5/6, or a new one drawn only from that card's facts. Side Quests may use an icon.
FR11: Each Station has exactly one first-person Character Line (≤12 words) that passes the Fact Audit.
FR12: The capstone is the Active Main Quest: amber/gold Active styling, the stepper "Design proposal ✓ (Nov 24, 2026) → Build Sep 2027 → Test to Apr 2028", role "electronics & readout", stats labelled as estimates, "4-person team", no teammate names, and never "built", "tested" or "working device".
FR13: Inspect reveals L1 metrics → L2 full source bullets → L3 links, one action per layer. Content is already in the DOM, Esc returns focus, and `aria-expanded` is announced.
FR14: At least 3 real-fact easter eggs are inside Inspect (Mon 7 AM ET, 10 ms E-stop, the skipped ~$611 kit), each citing an inventory line.
FR15: The Skill Tree (from the HUD) shows the 6 §06 groups plus the résumé-only skills in matching groups (D11). Nodes link to the Level Cards that prove them; unproven nodes are dimmed and unlinked; there are no scores or levels.
FR16: The Quest Log shows 17 Quests: 16 Completed, 1 Active (the capstone), plus 1 Next (8-month co-op, Jan–Aug 2027), newest first, with source dates. There is no Ambassador entry.
FR17: The Quest Log opens from the HUD in one click and appears inline at the Shipping Dock. Each Quest links to its Level Card.
FR18: The XP Bar shows "Quests viewed n/17" (a card counts at 50% of L0 in view). It never implies a skill rating.
FR19: The Speedrun Banner shows "8 repos shipped · Nov 2026" with 8 repo badges linking to GitHub.
FR20: The Shipping Dock shows the Quest Log, a large Résumé (PDF) button, the contact pitch, email (with copy), LinkedIn, GitHub, and "Available · 8-month co-op · Jan–Aug 2027".
FR21: The Quantum Fab is a locked door labelled "Dream: quantum computer hardware". Selecting it shows "Not unlocked yet. That's the long-term goal." There is no fake content behind it.
FR22: Five Achievements unlock on view: Shipped to production (Communitech), 8 repos one sprint (Speedrun), Azure certified ×2 (Character Card), 46/46 traced (zonecore), Cleanroom graduate (MIS). One toast at a time, auto-hidden after about 3 s, polite `aria-live`, non-blocking; static under reduced motion.
FR23: The HUD on every screen after the Glance Card holds Résumé (opens the PDF in a new tab, 1 click), Email/LinkedIn/GitHub (1 click each), Motion, the Mini-map and progress. At 400 px it becomes a bottom bar (Résumé + 3 contact icons, the rest under "More"). It never covers metrics.
FR24: A motion toggle behaves like `prefers-reduced-motion`. It defaults to the OS setting and persists in `localStorage` (try/catch).
FR25: Progressive depth, one view, no modes (D15): pitch on the Glance Card (0 clicks), evidence by scrolling (each card at L0 only), depth via Inspect (1 click), Résumé 1 click from everywhere. Inspect layers are native `<details>` enhanced into the drawer/sheet.
FR26: *(Removed by D15: there is no mode switching.)*
FR27: With JS disabled, the static baseline shows every screen and every Level Card; Inspect layers open as native `<details>`; all links work.
FR28: Deep links `#<station>` and `#<station>/<item>` scroll to the target and open L1 for a card (also without JS, via native anchors). An unknown hash goes to the Glance Card.
FR29: Each Level Card has "Copy link", with text confirmation, and shows the URL if clipboard access fails.
FR30: The Fact Audit build gate fails CI if any number, Character Line or Caption is missing from the inventory, or banned content appears (teammate names, built/tested/working device near the capstone, planned course codes). It reports the string and file, and is implemented in Python.
FR31: All copy and metrics live in one structured content source rendered by both modes and checked by the Fact Audit.

### NonFunctional Requirements

NFR1: Static, no backend: deploys to Vercel from `main` as static files, with no server functions, database or runtime API calls.
NFR2: Fast first load: LCP <2.0 s and Lighthouse Performance ≥90 (mobile); first-load transfer ≤600 KB, excluding the lazy scene image.
NFR3: Small JS: ≤100 KB gzip in total; no 3D, physics or game engine.
NFR4: Optimised media: inline SVG diagrams, WebP character art, lazy images below the fold, self-hosted subset fonts, no third-party requests.
NFR5: Mobile and touch: works from 360 px with no horizontal scroll; touch targets ≥44×44 px; swipe and tap cover every action.
NFR6: Keyboard: every feature is keyboard operable, focus is always visible, and a skip link is provided.
NFR7: Reduced motion: `prefers-reduced-motion` or the toggle removes non-essential animation with no content lost.
NFR8: Accessibility: WCAG 2.1 AA (text ≥4.5:1, UI ≥3:1), Lighthouse Accessibility ≥90, diagrams with `role="img"` + a label.
NFR9: Real text, SEO and previews: all content is in the pre-rendered DOM; `<title>` "Sneha Islam — Nanotechnology Engineering · Software & AI"; meta description; OG/Twitter tags; OG image cropped from the D1 art with no text.
NFR10: Privacy and analytics: no cookies or third-party trackers; only cookie-less Vercel Web Analytics on the free plan (in v1, D12); `localStorage` only for mode and motion.
NFR11: Browsers: the last 2 versions of Chrome, Edge, Firefox and Safari, plus iOS Safari 16+.
NFR12: Resilience: a JS error in the game layer never hides content.

### Additional Requirements

From the architecture spine (AD-1…AD-13) and the explainer:

- **Starter (Epic 1 Story 1):** scaffold **Astro 7.4.x** at the repo root (minimal template) with **@astrojs/react 7.1.x**, React/React DOM 19.3.x, **TypeScript 6.0.3** (not 7, because of the `@astrojs/check` peer), `@astrojs/check` 0.9.x, `package.json` `engines.node: "26.x"`, and npm 11.
- **Legacy reference:** freeze today's `index.html` as `legacy/index.html` before porting (fact-audit reference).
- **Content source:** `src/content/*.json` collections (profile, stations, quests, skills, path, achievements, resume, early-work, ui), with zod schemas in `src/content.config.ts`. The build fails on schema errors, and no copy is hard-coded in components (AD-2).
- **Slugs:** stations `ai|power|compiler|cleanroom`, screens `character|speedrun|dock|quantum`, items kebab-case. The DOM `id` = `<station>/<item>` = the hash (AD-3).
- **Base layout:** a blocking inline head script sets only `<html data-motion>` before paint (`localStorage` → `prefers-reduced-motion`; markup default `off`). There is no `data-mode` and no `?mode=` (AD-4 as amended by D15).
- **State:** `src/game/state.ts` (nanostores 1.5.x + @nanostores/react 2.0.x) is the sole mutator. A storage adapter uses `fabline:` keys, try/catch, `sessionStorage` for progress and `localStorage` for preferences (AD-5).
- **Viewport:** only `islands/TrackController.tsx` observes the viewport (one IntersectionObserver, 50%) (AD-5).
- **Router:** `src/game/router.ts` is the sole URL writer. `replaceState` handles scroll changes, `pushState` opens Inspect, and Back closes it (AD-6).
- **Motion:** CSS motion only under `[data-motion="on"]`; JS motion checks the store (AD-7).
- **Tokens:** `src/styles/tokens.css` is the only file with hex colours, named as in DESIGN.md (AD-8).
- **Hydration:** HUD `client:load`; the other islands `client:idle`/`client:visible`; Lighthouse CI budgets JS ≤100 KB gz and total ≤600 KB (AD-9).
- **CI:** `.github/workflows/ci.yml` on every PR runs `astro check` → `vitest run` → `astro build` → `python tools/fact_audit.py` → `linkinator dist` → `lhci autorun` (perf and a11y ≥0.9). Branch protection on `main` makes the check required and PR-only (AD-10).
- **Fact audit contract** (AD-11):
  - Python ≥3.12, stdlib only.
  - Scans content JSON plus the visible text of `dist/index.html` (text nodes, alt, aria-label, title, desc) against `docs/content-inventory.md` and `legacy/index.html`.
  - Banned list: teammate names; built/tested/working device in the capstone entry; planned course codes; "Engineering Ambassador" outside the résumé entry.
  - Allow-list in `tools/fact_audit_allow.txt`, with a comment per entry.
  - Tests in `tools/test_fact_audit.py`.
- **Assets** (AD-12):
  - Everything served as-is lives in `public/`.
  - The résumé stays at `/Sneha_Islam_Resume.pdf`; character art lives at `/assets/character/`.
  - `tools/images.py` is the only producer of derivatives (WebP crops, the sprite sheet, the OG image).
  - Every `<img>` has width and height.
- **Analytics:** `<Analytics />` from `@vercel/analytics/astro` appears only in `Base.astro`. It replaces the current hand-written snippet (AD-13).
- **Errors:** each island is wrapped in an error boundary that renders `null` (NFR-12).
- **Tests:** Vitest 5.1.x for `src/game/*.test.ts` (state, router, achievements).
- **Vercel:** set Framework Preset to **Astro**; Node 26.x (the Vercel default).
- **`.gitignore`:** add `node_modules/`, `dist/` and `.astro/` (keeping `.claude/` and `_bmad/`).
- **Git workflow** (Sneha's preference): she does all commits and pushes; stories end with the commit and push commands, not with an agent commit.

### UX Design Requirements

UX-DR1: Implement **all Block Biome tokens** from DESIGN.md frontmatter in `tokens.css`:
- surfaces coal/inset/panel/edge
- text/muted/dim
- grass(-dark), dirt(-dark), stone(-dark/-light)
- gold(-dark/-light), sky, lava, amethyst, snow, on-accent
- semantic aliases (primary, station-*, status-*, locked)
- spacing (4 px block pixel, border 4/3, bevel 3, drop 6, gutters 16/28, content-max 1120, hud-height 60, touch-min 44)
- typography roles (display, station-title, card-title, body, dialog, metric, label, button)

UX-DR2: **Contrast rule:** text only in text/muted/dim/accents (each ≥4.5:1 on panel/inset/coal); dirt and stone never as text; on-accent text on any accent fill.
UX-DR3: **Bevelled block buttons:** primary (gold), stone, grass. 3 px black border, 3 px inset bevel (light top-left / dark bottom-right), pressed state = inner shadow + 2 px down, ≥44 px, mono uppercase ExtraBold.
UX-DR4: **HUD bar:**
- desktop top bar: square-framed avatar + name, square-node Mini-map on a 4 px black connector, gold Résumé (the only gold HUD button), stone Email/LinkedIn/GitHub icon buttons, "⋯ More"
- 10 px segmented XP bar beneath
- <600 px: bottom bar with Résumé + 3 icons + More, safe-area aware

UX-DR5: **Level Card:**
- grass-cap header strip (path left, status pill right, coal text) with a 4 px black underline
- body: title, an inset diagram well with biome-colour strokes, 3 metric tiles, Captions, tech chips
- footer: Inspect ▸ (grass), Repo ↗ / Copy link (stone)
- frame: 4 px black border + 6 px black drop shadow; feature cards span 2 columns at ≥860 px

UX-DR6: **Metric tile:** inset background, dirt-dark 4 px top strip, gold mono ExtraBold number, muted label ≤6 words, qualifier inside the label.
UX-DR7: **Dialogue box:** panel, 4 px black border with a 4 px dark underside, a 64 px portrait in a black square frame, one Character Line in the dialog type. No typewriter effect and no dismiss.
UX-DR8: **Status pill:** square, 2 px black edge. ✓ DONE (grass) / ● ACTIVE (gold) / → NEXT (sky) / 🔒 (stone). Always has a word.
UX-DR9: **XP bar:** 10 px, black track, grass segments of 10 px with 2 px gaps, label "QUESTS n/17".
UX-DR10: **Achievement toast:** panel, 4 px black border, 2 px gold inner ring, 24 px pixel badge, title + one line ≤8 words. It moves in 4 px steps (`steps()`), sits bottom-right on desktop and above the bottom HUD on mobile, and never covers Résumé.
UX-DR11: **Mini-map node:** 14 px squares with a 2 px edge: visited grass, current gold, unvisited dark, locked stone + padlock. Labelled buttons with `aria-current="step"`. On mobile it lives in More → Map as a list.
UX-DR12: **Skill node:** inset chip, 3 px edge. Proven skills get a grass cap and a count; unproven ones sit at 45% opacity and aren't buttons.
UX-DR13: **Biome backdrops**, as SVG `crispEdges`: sky band + 2–3 stepped block-hill rows + grass strip (10 light + 10 dark) + dirt band with 20 px pebbles. Per Station:

| Station | Biome | Colour | Prop |
|---|---|---|---|
| AI | Sky Plains | sky | clouds |
| Power | Mesa | lava | mesa steps |
| Compiler | Crystal Cave | amethyst | crystals |
| Cleanroom | Snowfield Lab | snow | white tiles + fume hood |

UX-DR14: **Glance Card (Title Screen):** the Ghibli portrait in a 6 px black frame on a grass-block plinth; the name in display type with a 4 px black shadow; the tagline; the availability with a sky "→ NEXT" pill; **3 Proof Tiles** in metric-tile style (1,200+ · ±2% · 102.6 nm, each with a ≤6-word label); ▶ Start (grass) + Résumé (gold); ≤30 visible words; no HUD on this screen.
UX-DR15: **Locked door (Quantum Fab):** a stone-block arch with a dark doorway and a gold padlock. Selecting it shows the line in the dialogue box plus a 300 ms nudge (none under reduced motion).
UX-DR16: **Sprite:** a pixel-art PNG sheet, 32×48 native, ×2 integer scale, `image-rendering: pixelated`, `aria-hidden`. States: idle/walk (4-frame cycle advanced by scroll)/thinking (while Inspect is open)/celebrate (700 ms on an achievement). Until Sneha's art arrives, the **fallback** is the round `sneha-avatar-256.webp` marker at 40 px with a CSS tilt or glow.
UX-DR17: **Inspect drawer / sheet:**
- desktop: a 400 px right drawer on a black 60% scrim, header strip in the biome colour, sections L1/L2/L3 with "Show more ▾"; L2 includes "Diagram in words"
- mobile: a bottom sheet at about 76–85% height that leaves the bottom HUD visible, with drag-down or ✕ to close
- one overlay at a time; focus trap + Esc + focus restore

UX-DR18: **Typography:** JetBrains Mono ExtraBold uppercase with a hard black shadow for titles, buttons and labels; Space Grotesk for sentences. Both self-hosted and subset with `font-display: swap`. **No pixel fonts.**
UX-DR19: **Word budgets:** title ≤15 (button and HUD labels excluded), station header ≤20, Level Card L0 (short title + Captions) ≤25, metric label ≤6, Character Line ≤12, toast ≤8, Speedrun ≤10, Shipping Dock ≤30, Character Card values ≤35.
UX-DR20: **Motion table** (UX §9):

| What | Timing |
|---|---|
| Hover | 150 ms |
| Drawer | 250 ms |
| Toast | 200 ms in / 3 s / 200 ms out |
| Station arrival | 600 ms, once (biome pops in 4 px steps, title drops, diagram draws) |
| Diagram draw | ≤800 ms once |
| Dash flow | only in view |
| Count-up | 600 ms |
| Sprite walk | advanced by scroll |
| Celebrate | 700 ms |
| Door nudge | 300 ms |

Nothing loops for more than 5 s without the toggle. There is no parallax beyond 1 layer, no shake and no flashing. Each has a reduced-motion fallback.

UX-DR21: **Keyboard map and focus order:**
- arrows / PageUp / PageDown / Space / Shift+Space / Home / End / Tab / Enter / Esc, with **no single-letter shortcuts**
- focus order: skip link → HUD (Résumé → Email → LinkedIn → GitHub → More → Mini-map) → content in Track order (Inspect → Repo → Copy link within a card)
- focus ring: 3 px gold, 3 px offset

UX-DR22: **Diagram alt pattern:** `<svg role="img" aria-labelledby>` with `<title>` (short) and `<desc>` (the flow in words), and the same sentence visible in Inspect L2. Decorative SVG (backdrops, sprite) is `aria-hidden`.
UX-DR23: **Landmarks:** `header` (HUD), `nav` "Track" (Mini-map), `main`, each Station a `section` with `aria-labelledby`. One polite live region for toasts and "Copied".
UX-DR24: **Responsive:**
- ≥1000 px: top HUD with inline Mini-map, 2-column cards, feature cards spanning both
- 600–999 px: top HUD, Mini-map collapses to "Station n/4 ▾", 1 column
- <600 px: bottom HUD, sheets, 48 px sprite
- zoom works at 200% and at 400% reflow (320 px)

UX-DR25: **State patterns:**
- no-JS / JS failure → the static baseline stays usable (Glance Card Résumé button, all cards, `<details>` Inspect, Dock links)
- a deep link on load skips the Title (no smooth scroll)
- an unknown hash → Title
- clipboard denied → a selectable field + "Press Ctrl/⌘+C"
- after all 17/17 Quests are viewed → a one-time toast "Every quest seen. Résumé's in the HUD."
- the iOS address-bar resize must not re-trigger arrival animations

UX-DR26: **Voice and tone:** plain labels on escape hatches ("Résumé", "▶ Start", "Inspect ▸"); qualifier beside the number; no hype or emoji in copy; Character Lines first person, confident, warm, nerdy, concise.
UX-DR27: **Info design per card** (EXPERIENCE §5 table): 14 Main cards have a diagram (3 reuse SVGs, 11 new), 3 verbatim metrics and a caption draft; 3 Side Quests are icon-only. The short titles and caption drafts in that table are the starting copy.
UX-DR28: *(Removed by D15: no Recruiter Mode.)* **Folded content:** Résumé = PDF only (on-page sheet removed); "Earlier work" (yunus-AI, Selenium scraper, tic-tac-toe) as a collapsed row at the Shipping Dock; the Path timeline inside the Quest Log.

### FR Coverage Map

FR1, FR2: Epic 2 - Glance Card + ▶ Start (Story 2.2)
FR3, FR4: Epic 2 - Character Card (Story 2.3)
FR5: Epic 3 (Track, Sky Plains) + Epics 4–6 (biomes) + Epic 7 (arrival)
FR6: Epic 7 - Keyboard travel
FR7, FR8: Epic 3 (TrackController, visited) + Epic 7 (Mini-map)
FR9, FR10: Epic 3 (card face, AI diagrams) + Epics 4–6 (remaining diagrams)
FR11: Epic 3 - Character Lines
FR12: Epic 3 - Capstone as Active Main Quest
FR13: Epic 3 - Inspect
FR14: Epic 8 - Easter eggs
FR15–FR18: Epic 7 - Skill Tree, Quest Log, XP
FR19–FR21: Epic 3 - Speedrun, Shipping Dock, Quantum Fab
FR22: Epic 8 - Achievements
FR23, FR24: Epic 2 (HUD, Motion) + Epic 7 (Mini-map in HUD)
FR25, FR27: Epic 3 (one view, `<details>` Inspect, no-JS at cutover)
FR26: Removed by D15
FR28: Epic 3 - Deep links
FR29: Epic 3 - Copy link
FR30, FR31: Epic 1 - Fact audit, single content source
NFR1, NFR10, NFR12: Epic 1 onward
NFR2–NFR9, NFR11: CI from Epic 1; release gate at the Epic 3 cutover; full verification in Epic 9

## Epic List

### Epic 1: Foundation: new engine, old site still live
The repo runs on Astro + React + TypeScript with the CI gate and the Python fact audit, and **all content lives in schema-validated JSON**. The live site keeps serving the **untouched legacy page** until the cutover in Epic 3, so it never breaks. There is no pixel-identical port (party decision: it would be rework).
**Stories:** 4

### Epic 2: First screen & HUD
On `/next`, the Block Biome look, the **Glance Card** (the whole pitch with zero clicks), the Character Card, the motion setting, the HUD with 1-click Résumé and contact, and correct link previews. The live site is unchanged until Epic 3's cutover.
**Stories:** 6

### Epic 3: AI in Production vertical slice → launch
The whole Track exists on `/next` with all 17 Level Cards (real numbers, Captions, Inspect, links). **AI in Production is finished end to end**: Sky Plains biome, all 6 diagrams, deep links. The other 3 Stations launch with placeholder icons in 6 diagram spots and a plain backdrop (Sneha's choice (a)). The epic ends with the **cutover**: `/` serves The Fab Line.
**Stories:** 11

### Epic 4: Power & Control slice
The Mesa biome and the 3 Power & Control diagrams replace the placeholders.
**Stories:** 2

### Epic 5: Compiler & EDA slice
The Crystal Cave biome and the 2 Compiler & EDA diagrams replace the placeholders.
**Stories:** 2

### Epic 6: Cleanroom slice
The Snowfield Lab biome and the vaclab diagram replace the last placeholders. Every Main card now shows how it works.
**Stories:** 2

### Epic 7: Navigation, Skill Tree & Quest Log
The Mini-map, keyboard travel, the Skill Tree (skills as proof), the Quest Log (with the Path folded in) and the XP bar.
**Stories:** 6

### Epic 8: Delight
Achievements, Sneha's sprite, the world coming alive, and real-fact easter eggs. Every effect respects the motion switch.
**Stories:** 5

### Epic 9: Polish for every recruiter
Phone, accessibility, release performance and the browser matrix are verified and fixed. Link previews already shipped in Story 2.6.
**Stories:** 4

**Launch = end of Epic 3** (Epics 1–3, about 21 evenings). Sprint 1 = Epics 1–2. After launch, every epic is a small release.

**Shared Definition of Done for every story:**
- `npm run build` succeeds locally.
- CI passes.
- The Vercel Preview has been checked.
- The story ends with Sneha's commit, push and PR commands. **No agent commits.**

## Epic 1: Foundation: new engine, old site still live

The repo runs on Astro + React + TypeScript with the CI gate and the Python fact audit, and **all content lives in schema-validated JSON**. The live site keeps serving the **untouched legacy page** until the cutover in Epic 3, so it never breaks. There is no pixel-identical port (party decision: it would be rework). *Shippable after every story.*

### Story 1.1: Astro scaffold that still serves today's site

As a recruiter,
I want the portfolio to load exactly as it does today,
So that nothing breaks while the engine underneath is replaced.

**Acceptance Criteria:**

**Given** the repo on a new branch
**When** the story is done
**Then** today's `index.html` is frozen, byte-for-byte, as `legacy/index.html`
**And** Astro 7.4.x is scaffolded at the repo root with `@astrojs/react` 7.1.x, React/React DOM 19.3.x, TypeScript 6.0.3, `@astrojs/check`, and `package.json` `"engines": {"node": "26.x"}`
**And** `src/pages/index.astro` serves the legacy page **unchanged**: its `<style>` uses `is:global` and every inline `<script>` uses `is:inline`, so Astro neither scopes nor bundles them (figure tabs, repo filters and copy buttons keep working). `Sneha_Islam_Resume.pdf` and `assets/character/*` move to `public/` at the same URLs
**And** the new game page is developed at `src/pages/next.astro` with `<meta name="robots" content="noindex">` until the cutover (Story 3.11)
**And** the hand-written Vercel analytics snippet is replaced by `<Analytics />` from `@vercel/analytics/astro` in `Base.astro` only (AD-13)
**And** `.gitignore` adds `node_modules/`, `dist/` and `.astro/` (keeping `.claude/` and `_bmad/`)

**Given** the built `dist/index.html` and `legacy/index.html`
**When** a small script compares their visible text
**Then** it is identical, and the figure tabs, repo filters and copy buttons still work
**And** the Vercel project's Framework Preset is **Astro** (documented as a one-time step for Sneha), and the PR preview looks identical to the live site

### Story 1.2: Every pull request runs the quality gate

As Sneha (the builder),
I want each PR checked automatically for type errors, broken links and performance and accessibility regressions,
So that I can't accidentally ship a broken or slow portfolio.

**Acceptance Criteria:**

**Given** a PR to `main`
**When** GitHub Actions runs `.github/workflows/ci.yml`
**Then** the gate runs `npm ci` → `astro check` → `vitest run` → `astro build` → `linkinator dist` (internal links + the résumé PDF) → `lhci autorun` against static `dist/` (both `/` and `/next`)
**And** `lighthouserc.json` makes these **hard failures**: Accessibility ≥0.9, total script ≤100 KB gzip, total transfer ≤600 KB. The Performance **score** is a **warning only** in CI, because shared runners are noisy; it becomes a hard gate against the deployed preview at release (Story 9.3)
**And** a first Vitest test exists (e.g. a sanity test of a tiny util), so the test step is real, not skipped

**Given** a deliberate failure (e.g. a broken internal link)
**When** CI runs
**Then** the job fails with a readable message

**Given** the workflow passes on this PR
**When** Sneha follows the documented one-time steps
**Then** branch protection on `main` requires the `ci` check and a PR before merging (AD-10)

### Story 1.3: The fact audit blocks invented facts

As a recruiter,
I want every number and claim on the site to be real,
So that I can trust what I read.

**Acceptance Criteria:**

**Given** `tools/fact_audit.py` (Python ≥3.12, standard library only)
**When** it runs after the build
**Then** it checks `src/content/*.json` and the visible text of the built `/next` page. It extracts every numeric token from the **visible text** (text nodes, `alt`, `aria-label`, `<title>`, `<desc>`; not `<script>`, `<style>` or other attributes) and checks each one appears in `docs/content-inventory.md` or `legacy/index.html`
**And** it fails on the banned list: teammate names; "built", "tested" or "working device" in the capstone entry; planned course codes (PHYS 468, SYDE 572, ECE 457, MTE 544, STAT 341); "Engineering Ambassador" anywhere on the new page (it stays only in the PDF, D10)
**And** on failure it exits non-zero and prints each offending string with its file and context
**And** `tools/fact_audit_allow.txt` holds approved non-fact strings, each with a `#` comment

**Given** `tools/test_fact_audit.py`
**When** it runs (`python -m unittest`)
**Then** it proves an invented number fails, a banned name fails, a real inventory number passes, and allow-listed strings pass

**Given** CI from Story 1.2
**When** this story merges
**Then** `python tools/fact_audit.py` is a required step in `ci.yml` after `astro build`, and it passes on the current site
**And** every Caption, Character Line, Proof Tile label and easter egg in the content JSON must carry a `source` field (e.g. `"inv §5.1"`). The audit fails if one is missing, so every claim traces to the inventory, not just its numbers (party decision)

### Story 1.4: All content moves into schema-validated JSON

As Sneha (the builder),
I want every fact on the site in one validated place,
So that the new page, the audit and future edits all read the same source.

**Acceptance Criteria:**

**Given** zod schemas in `src/content.config.ts`
**When** the content is extracted from `legacy/index.html` and `docs/content-inventory.md` into collections:
- `profile.json` (Glance Card, Character Card, interests, contact, availability, Proof Tiles)
- `stations.json` (4 Stations + Character Lines)
- `quests.json` (4 work terms, 5 course projects, 8 repos: `station`, `slug`, `kind`, `status`, `side`, `title`, `shortTitle`, `org`, `dates {sort, display}`, `bullets[]`, `metrics[0..3] {value, label, qualifier?}`, `captions[]`, `chips[]`, `links[]`, `diagram?`)
- `coursework.json`, `skills.json`, `path.json`, `early-work.json`, `achievements.json`, `ui.json`

**Then** `astro build` validates them all and fails with a clear message on any schema error (AD-2, FR31)
**And** slugs follow AD-3 (`ai/communitech`, `power/battery-wc`, `cleanroom/capstone`, …), and a Vitest test asserts they are unique and kebab-case
**And** numbers are stored as display strings exactly as in the inventory, qualifiers included ("simulated", "estimate", "fictional scenario")
**And** there are no teammate names, planned courses or Ambassador entries, the capstone is `status: active`, and there are exactly 17 Quests (16 done, 1 active) (D3, D8, D10)
**And** the fact audit passes on the JSON
**And** Short titles and Captions are seeded from the UX spec's EXPERIENCE §5 table, each with a `source` field (UX-DR27)

## Epic 2: First screen & HUD

On `/next`, the Block Biome look, the **Glance Card** (the whole pitch with zero clicks), the Character Card, the motion setting, the HUD with 1-click Résumé and contact, and correct link previews. The live site is unchanged until Epic 3's cutover. *Shippable after every story.*

### Story 2.1: Block Biome design tokens and building blocks

As a recruiter,
I want a consistent, readable, game-like look,
So that the portfolio feels designed rather than assembled.

**Acceptance Criteria:**

**Given** DESIGN.md frontmatter
**When** `src/styles/tokens.css` is created
**Then** it defines every colour, spacing and typography token by its DESIGN.md name (UX-DR1), and it is the **only** file in `src/` containing hex colour values (AD-8)
**And** JetBrains Mono (400/600/800) and Space Grotesk (400/600/700) are self-hosted and subset, with `font-display: swap`, and Google Fonts requests are removed (NFR-4, UX-DR18)
**And** reusable primitives exist: bevelled `gold` / `stone` / `grass` buttons with a 3 px black border, 3 px bevel, pressed state and ≥44 px size (UX-DR3); square status pills with a word (UX-DR8); tech chips; and a 3 px gold focus ring with 3 px offset (UX-DR21)

**Given** a Vitest contrast test
**When** it computes WCAG ratios for every text token against `panel`, `inset` and `coal`
**Then** all are ≥4.5:1, and the test fails if `dirt` or `stone` is ever used as a text colour token (UX-DR2)

**Given** the CI gate
**When** the PR runs
**Then** CI passes, and `/` still serves the legacy page

### Story 2.2: Glance Card, the whole pitch on the first screen

As a recruiter who may only look at one screen,
I want who Sneha is, when she's available and her three strongest proofs at a glance,
So that I can decide in seconds, with the résumé one click away.

**Acceptance Criteria:**

**Given** the page loads
**When** the first screen paints
**Then** it shows the Ghibli portrait (`sneha-portrait-512.webp`, with width/height set) in a 6 px black frame on a grass-block plinth over a Sky Plains `crispEdges` backdrop (UX-DR13, UX-DR14)
**And** it shows, pre-rendered from `profile.json`:
- "Nano-Engineer · University of Waterloo", "Sneha Islam", "from silicon to software."
- the availability "8-month co-op · Jan–Aug 2027" with a sky "→ NEXT" pill
- **3 Proof Tiles** in metric-tile style, verbatim facts:
  - **1,200+** "companies covered, AI I shipped" (inv §5.1)
  - **±2%** "SoC accuracy, EV battery" (inv §5.3)
  - **102.6 nm** "SiNₓ film I made" (inv §6.1)

**And** there are exactly two buttons: **▶ Start** (grass) and **Résumé** (gold, opens the PDF in a new tab: 1 click) (FR1, FR2)
**And** visible words, excluding button labels, are ≤30, and Proof Tile labels are ≤6 words each (UX-DR19)
**And** the portrait's alt text is "Illustration of Sneha Islam: long wavy brown hair, round glasses, smiling."
**And** the fact audit passes on all Glance Card text

**Given** the Glance Card
**When** the visitor presses **▶ Start**, Space, Enter or ↓, or scrolls
**Then** the page moves to the next section, and both buttons are ≥44×44 px, reachable by Tab, with the gold focus ring

**Given** a 390 px phone
**When** the Glance Card renders
**Then** the portrait, name, availability, 3 Proof Tiles (in one row) and both buttons fit in the first viewport without scrolling (W1-m)

**Given** `tools/images.py`
**When** run with the source illustration's path
**Then** it regenerates every `public/assets/character/` derivative with the same sizes as today (AD-12), using Pillow, and documents that single dependency

**Given** Lighthouse on mobile
**When** the PR runs
**Then** LCP is <2.0 s (the portrait is the LCP element and is not lazy-loaded)
**And** before merge, Sneha runs a **5-second test** with 2 people: show the Glance Card for 5 s, then ask "Who is she? When is she available? Name one thing she built." Anything they get wrong is fixed in this story (party decision)

### Story 2.3: Character Card

As a recruiter,
I want degree, home and certifications at a glance,
So that I can judge role fit without reading paragraphs.

**Acceptance Criteria:**

**Given** `profile.json` and `coursework.json`
**When** the Character Card renders as the second screen on `/next` (D15: one view, no About paragraphs)
**Then** it shows the 256 px portrait in a black square frame, with:
- Class: Nano-Engineer
- University of Waterloo · BASc Nanotechnology Eng. · Nanoelectronics · 3B (Fall 2026)
- Home: Toronto, ON
- Next Quest: 8-month co-op · Jan–Aug 2027 (sky "→ NEXT" pill)
- Equipment: AZ-900 and AI-900 badges
- the 4 interests with their existing icons (FR3)

**And** a collapsed "Training ▸ 6 courses" control (native `<details>`) expands NE 343, NE 344, NE 332, NE 333, NE 318 and MSE 261 with their topic chips, and contains no planned courses (FR4, D8)
**And** no number, level or score appears that is not in the inventory (fact audit passes), and the visible values total ≤35 words (UX-DR19)

### Story 2.4: Motion preference and the game-state store

As a recruiter sensitive to motion,
I want animation to respect my settings and a switch to turn it off,
So that the game never makes me uncomfortable.

**Acceptance Criteria:**

**Given** `Base.astro`
**When** the page loads
**Then** a blocking inline head script sets `<html data-motion="on|off">` before first paint, from `localStorage["fabline:motion"]` → `prefers-reduced-motion`. The markup default is `off`, so no-JS visitors get a still page. There is no `data-mode` and no `?mode=` (AD-4 amended, D15)
**And** all existing CSS animations (the old `.flow`/`.pulse`, reveal-on-scroll) run only under `[data-motion="on"]` (AD-7)

**Given** `src/game/state.ts` (nanostores) and `src/game/storage.ts`
**When** created
**Then** the store holds `motion` with the action `setMotion`, which is the only way to change it (AD-5)
**And** storage access is wrapped in try/catch, uses the `fabline:` key prefix, and works with storage blocked
**And** Vitest covers the default from `prefers-reduced-motion`, persistence, and blocked storage

### Story 2.5: HUD with one-click Résumé and contact

As a recruiter who has scrolled past the first screen,
I want the Résumé and contact links always one click away,
So that I never have to scroll back or hunt for them.

**Acceptance Criteria:**

**Given** any screen after the Glance Card at ≥600 px
**When** it is on screen
**Then** a sticky top HUD island (`client:load`, inside an error boundary that renders `null`) shows:
- left: the square-framed avatar + "SNEHA ISLAM"
- right: **Résumé** (the only gold button), then Email, LinkedIn and GitHub stone icon buttons, then **⋯ More**, holding **Motion on/off** (UX-DR4)

**And** the HUD is hidden while the Glance Card is in view, since that screen has its own Résumé button. This needs viewport observation, so this story creates the **first, minimal `islands/TrackController.tsx`** (the only viewport observer, AD-5), which only tracks `glanceInView`; Story 3.7 extends it (party decision)
**And** Résumé opens `/Sneha_Islam_Resume.pdf` in a new tab in **1 click**; LinkedIn and GitHub open in a new tab; Email copies the address and announces "Copied" in a polite live region, with a selectable-text fallback if the clipboard is denied (FR23, UX-DR25)
**And** Motion calls `setMotion` and behaves like `prefers-reduced-motion` (FR24)

**Given** a viewport below 600 px
**When** the HUD renders
**Then** it is a bottom bar with Résumé + 3 contact icons + More, safe-area aware, and never covers content you can read or interact with (FR23, UX-DR24)

**Given** keyboard use
**When** the visitor tabs from the top of the page
**Then** focus goes skip link → Glance Card buttons → HUD (Résumé → Email → LinkedIn → GitHub → More) → content, with the gold focus ring visible on every item (UX-DR21, NFR-6)

**Given** JavaScript disabled, or the HUD island throws an error
**When** the page renders
**Then** the Glance Card's Résumé button is still present and usable; the Dock's contact links arrive in Story 3.10 (NFR-12)

**Given** the CI gate
**When** the PR runs
**Then** total JS stays ≤100 KB gzip, and the **personality check** "Résumé reachable in ≤2 clicks from every screen" holds at **1 click** (the Glance Card button, then the HUD)

### Story 2.6: Link previews and search

As a recruiter who receives the portfolio link in a message,
I want a clear preview with Sneha's name and face,
So that I click it.

**Acceptance Criteria:**

**Given** `Base.astro`
**When** the page is built
**Then** it has:
- `<title>` "Sneha Islam — Nanotechnology Engineering · Software & AI"
- a meta description of ≤155 characters built from inventory facts
- a canonical URL `https://snehaislam.vercel.app/` (applied to `/next` now; the tags carry over at cutover)
- Open Graph and Twitter card tags
- a favicon

(NFR-9)
**And** the OG image is a 1200×630 crop of the D1 illustration produced by `tools/images.py`, with **no text baked in** (≤150 KB)
**And** the tags validate (correct absolute URLs, image dimensions declared), checked by reading the built HTML and by fetching the OG image URL from the Preview
**And** the fact audit passes on the meta description

## Epic 3: AI in Production vertical slice → launch

The whole Track exists on `/next` with all 17 Level Cards (real numbers, Captions, Inspect, links). **AI in Production is finished end to end**: Sky Plains biome, all 6 diagrams, deep links. The other 3 Stations launch with placeholder icons in 6 diagram spots and a plain backdrop (Sneha's choice (a)). The epic ends with the **cutover**: `/` serves The Fab Line. *Shippable after every story.*

### Story 3.1: Content regrouped into the four Stations

As a recruiter,
I want the work organised as a journey from software to silicon,
So that I see the strongest, most relevant work first.

**Acceptance Criteria:**

**Given** `stations.json` (slugs `ai`, `power`, `compiler`, `cleanroom`, in that order) and the `station` field of each Quest
**When** `/next` renders after the Character Card
**Then** it shows **4 Station sections**, `id="ai"` … `id="cleanroom"`, each holding its Quests per the PRD §4 map (Side Quests collapsed in a native `<details>`), with each card keeping its `id="<station>/<item>"` (AD-3)
**And** each Station has a header: a mono tag ("STATION 01 · SKY PLAINS", …) and a title ("AI in Production", "Power & Control", "Compiler & EDA", "Cleanroom"), in the biome colour (DESIGN Colors)
**And** each Station has a **dialogue box** (UX-DR7) with exactly one first-person Character Line of ≤12 words from `stations.json`, starting from the addendum §B drafts (FR11):
- "I shipped an AI system watching 1,200+ companies."
- "My fault injection cut BMS testing time by 35%."
- "I routed 2,218 blocks on a 54×54 FPGA."
- "I deposited 102.6 nm of SiNₓ, then measured it two ways."

**And** each Station header (tag + title + line) is ≤20 words (UX-DR19), the fact audit passes on every Character Line, and each Station is a `section` with `aria-labelledby` (UX-DR23)
**And** every Quest appears exactly once, and none is lost (a Vitest test checks that all 17 Quest slugs render once)

### Story 3.2: Level Card face (L0) with depth behind native disclosures

As a recruiter scrolling fast,
I want each card to show only a picture, three numbers and one or two short lines,
So that I absorb the work without reading paragraphs.

**Acceptance Criteria:**

**Given** `quests.json` extended with `shortTitle`, `captions[1..2]` and `diagram {component, title, alt}`, seeded from EXPERIENCE §5 (UX-DR27)
**When** a Level Card renders
**Then** L0 follows the fixed order: grass-cap header (path `ai/communitech` + status pill) → short title → diagram well → up to **3 metric tiles** → Captions → tech chips → footer (FR9, UX-DR5)
**And** metrics are verbatim display strings from the inventory, never padded to 3, with the qualifier inside the label ("+14.1% saves · simulated", "≈8.2 mAh · estimate")
**And** the short title + Captions total **≤25 words** per card, enforced by a Vitest test over `quests.json` (UX-DR19)
**And** the 3 cards with existing diagrams use them (Communitech → newsletter pipeline, MIS → cross-section, capstone → cartridge + pod); the 3 Side Quests use an icon (FR10)
**And** until a Main card's diagram exists, its diagram well shows the **Station's placeholder icon** at the same size, so card shapes stay consistent (Sneha's choice (a))

**Given** the card's depth
**When** it renders without JavaScript
**Then** L1 (each metric with its full label), L2 (the full original bullets + the diagram's "in words" sentence) and L3 (Repo ↗ / yunus-AI ↗ / Copy-link URL) sit in **native `<details>`** that open in place (FR25, FR27, AD-4)
**And** the fact audit passes on every Caption, short title and metric

### Story 3.3: Sky Plains biome for AI in Production

As a recruiter,
I want the first Station to look like a real place,
So that the game feels designed from the first scroll.

**Acceptance Criteria:**

**Given** the AI in Production Station
**When** it renders
**Then** it has a decorative `crispEdges` SVG **Sky Plains** backdrop (sky colour, block clouds, 2–3 stepped hill rows, a grass strip of 10 px light + 10 px dark, a dirt band with 20 px pebbles), using token colours only and `aria-hidden="true"` (UX-DR13)
**And** the Station is at least one viewport tall (FR5), text over the backdrop passes AA, and the backdrop is ≤10 KB inline
**And** the other 3 Stations use a plain coal background until their slices (Epics 4–6)

### Story 3.4: The capstone as the Active Main Quest

As a hiring manager,
I want the capstone shown honestly as a design in progress,
So that I trust everything else on the page.

**Acceptance Criteria:**

**Given** the `cleanroom/capstone` Quest (`status: active`)
**When** its card renders
**Then** it spans 2 columns at ≥860 px, has corner registration marks and a gold **● ACTIVE · MAIN QUEST** pill (UX-DR8)
**And** it shows the stepper **"Design proposal ✓ (Nov 24, 2026) → Build Sep 2027 → Test to Apr 2028"**, with only the first step filled (FR12)
**And** it shows "My part: electronics & readout. 4-person team." with **no teammate names** (D3)
**And** its 3 metrics read "≈8.2 mAh · estimate", "≈$55 vs $160 per patient · estimate" and "≈$1,400 of $1,500 · estimate"

**Given** the fact audit
**When** it scans the capstone entry and its rendered card
**Then** it fails if "built", "tested" or "working device" appear, or any teammate name (FR30), and a unit test proves this rule

### Story 3.5: Inspect drawer and sheet

As a hiring manager who wants depth on one project,
I want a focused panel with the details,
So that I can dig in without losing my place.

**Acceptance Criteria:**

**Given** JS is running and the **InspectDrawer** island has loaded (`client:idle`, error boundary)
**When** the visitor activates **Inspect ▸** on a card
**Then**:
- at ≥600 px, a 400 px right drawer opens over a 60% black scrim, with a header strip in the biome colour
- below 600 px, a bottom sheet opens at about 76–85% height, leaving the bottom HUD visible (UX-DR17)
- it shows L1 metrics, with "Show more ▾" revealing L2, then L3
- the content is the card's own `<details>` content, enhanced in place, never re-fetched or duplicated (AD-1)

**And** focus moves into the panel and is trapped. Esc, the scrim, ✕ or (on mobile) dragging down closes it and returns focus to that card's Inspect button. `aria-expanded` reflects the state (FR13)
**And** opening pushes a history entry via the router, so the browser's Back closes the panel (AD-6). Only one overlay is open at a time (`state.openOverlay`)
**And** under reduced motion it opens instantly; otherwise it slides within 250 ms (UX-DR20)

**Given** the island fails to load
**When** the visitor activates the disclosure
**Then** the native `<details>` still opens in place (NFR-12)

### Story 3.6: Copy link on every card

As a hiring manager,
I want to copy a link straight to a project,
So that I can paste it into the panel's notes.

**Acceptance Criteria:**

**Given** any Level Card or its Inspect L3
**When** the visitor activates **Copy link**
**Then** `https://<site>/#<station>/<item>` is copied, and "Copied" is announced in the polite live region (FR29, UX-DR23)
**And** if clipboard access is denied, the URL appears in a selected read-only field with "Press Ctrl/⌘+C" (UX-DR25)
**And** opening the copied link in a fresh tab lands on that card with L1 open (FR28)

### Story 3.7: Deep links and knowing where you are

As a hiring manager sharing a project with my panel,
I want a link that opens exactly that card, and the page to know which Station I'm in,
So that colleagues land in the right place.

**Acceptance Criteria:**

**Given** `src/game/router.ts`, the only writer of `history` and `location.hash` (AD-6)
**When** the page loads with `#<station>` or `#<station>/<item>`
**Then** it scrolls to the target instantly (no smooth scroll) and skips the Glance Card (FR28, UX-DR25)
**And** an unknown hash lands on the Glance Card with no error
**And** without JS, the same hashes still scroll natively (AD-3)

**Given** `islands/TrackController.tsx` from Story 2.5, extended (still the only viewport observer: one `IntersectionObserver`, 50% threshold, AD-5)
**When** the visitor scrolls
**Then** `state.currentStation` updates, `markVisited(station)` records a Station once it is 50% in view, and the router updates the hash with `replaceState` (no new history entries while scrolling)
**And** progress is stored in `sessionStorage` under `fabline:progress` (PRD FR-7)

**Given** Vitest
**When** the router and state tests run
**Then** they cover a valid deep link, an unknown hash, `replaceState`-only on scroll, the visited set being idempotent, and blocked storage

### Story 3.8: New diagrams for AI in Production, part 1 (The Plug Co, Avanade, muse)

As a panel engineer,
I want to see how each system works at a glance,
So that I can judge the engineering, not just the claims.

**Acceptance Criteria:**

**Given** `src/components/diagrams/` and the EXPERIENCE §5 concepts
**When** these 3 diagrams are added:
- **The Plug Co:** query → vector search (Pinecone/FAISS) → media, with "<300 ms"
- **Avanade:** user → chatbot → Alpha Vantage + OpenAI
- **muse:** feed → IPS correction → A/B split, labelled "simulated"

**Then** each is inline SVG with `role="img"` and `aria-labelledby` pointing at a `<title>` and `<desc>` taken from the card's `diagram.title` and `diagram.alt`. The same "in words" sentence is visible in Inspect L2 (UX-DR22)
**And** each uses **only words and numbers already in that card's content** (FR10), strokes in the Station colour (`var(--sky)`), and no hex literals (AD-8)
**And** each diagram is ≤6 KB, readable at 360 px, and the fact audit passes
**And** **personality check "Intelligent":** each shows the mechanism (how data flows), not a decorative picture

### Story 3.9: New diagrams for AI in Production, part 2 (facesolve, coa-forge)

As a panel engineer,
I want the ML and lab tools explained visually,
So that I can see the pipeline behind each metric.

**Acceptance Criteria:**

**Given** the same diagram rules as Story 3.8
**When** these 2 diagrams are added:
- **facesolve:** noisy landmarks → clean (Kabsch, outlier rejection) → MLP → UsdSkel
- **coa-forge:** plans → random-forest surrogate filter → Monte Carlo war-game → 3 Pareto options, labelled "fictional scenario"

**Then** all rules from Story 3.8 hold (accessibility, words from the card only, Station colour `var(--sky)`, ≤6 KB each, fact audit passes)
**And** after this story, **all 6 AI in Production cards lead with a real diagram** (the slice is visually complete)

### Story 3.10: Speedrun Banner, Shipping Dock and the locked Quantum Fab

As a recruiter reaching the end,
I want a clear finish with the résumé, contact and availability in one place,
So that my next step is obvious.

**Acceptance Criteria:**

**Given** the last Station
**When** the visitor scrolls on
**Then** a **Speedrun Banner** (`id="speedrun"`) shows "8 repos shipped · Nov 2026" with 8 stone badges (vaclab, fabricfit, zonecore, modcell, tilec, muse, facesolve, coa-forge), each linking to its GitHub repo, in ≤10 words (FR19)

**Given** the **Shipping Dock** (`id="dock"`) at the end of the Track
**When** it renders
**Then** it shows:
- "● Available · 8-month co-op · Jan–Aug 2027"
- the contact pitch
- the largest button on the page, **Résumé (PDF)**
- Email (with copy), LinkedIn and GitHub
- a collapsed **"Earlier work"** `<details>` row with yunus-AI, Selenium_Python_BestBuy and tic-tac-toe and their links (FR20, D15)

**And** visible words total ≤30, excluding the Earlier-work contents (UX-DR19), and every link resolves (linkinator)

**Given** the **Quantum Fab** (`id="quantum"`) at the very end
**When** it renders
**Then** it shows a stone-block arch with a dark doorway and a gold padlock, labelled "Dream: quantum computer hardware", with no content behind it (FR21, UX-DR15)
**And** selecting the door (a native `<details>`, so it also works without JS) reveals "Not unlocked yet. That's the long-term goal." *(Curious: a rewarding click)*
**And** the fact audit passes on all three screens

### Story 3.11: Cutover: The Fab Line goes live

As a recruiter,
I want the new portfolio at the usual address,
So that the link Sneha sends opens the game.

**Acceptance Criteria:**

**Given** Stories 1.1 to 3.10 are merged
**When** the cutover PR swaps `src/pages/next.astro` into `src/pages/index.astro`
**Then** `/` serves The Fab Line, `noindex` is removed, and `legacy/index.html` stays only as an audit reference, imported by no page
**And** the HUD's and Glance Card's Résumé, the Dock contact links and all repo links resolve (linkinator)
**And** Lighthouse mobile on the **deployed Preview** (median of 3) meets Performance ≥90, Accessibility ≥90, LCP <2.0 s, JS ≤100 KB gzip, first-load transfer ≤600 KB. If React makes JS fail, the Preact decision is made here (architecture Deferred)
**And** SM-1 (Résumé ≤2 clicks, actually 1), SM-2 (any metric ≤3 clicks), SM-3 (phone at 390 px) and SM-5 (0 audit violations) are ticked in the PR description
**And** the capstone is nowhere shown as built, and no teammate names or Ambassador appear on the page (D3, D10)
**And** with JavaScript disabled, every screen and card is readable and the Inspect `<details>` open (FR27)
**And** Sneha merges, and `snehaislam.vercel.app` serves the game

## Epic 4: Power & Control slice

The Mesa biome and the 3 Power & Control diagrams replace the placeholders. *Shippable after every story.*

### Story 4.1: Mesa biome

As a recruiter,
I want each stop to look like its own place,
So that the journey keeps feeling like a game.

**Acceptance Criteria:**

**Given** the Power & Control Station
**When** it renders
**Then** it has a `crispEdges` **Mesa** backdrop (lava-toned sky, stepped mesa blocks, grass and dirt strips) with the same rules as Story 3.3 (UX-DR13), ≤10 KB, AA contrast preserved

### Story 4.2: New diagrams for Power & Control (Battery WC, zonecore, modcell)

As an embedded engineer on the panel,
I want the controls work drawn as signal and safety flows,
So that I can quickly gauge depth.

**Acceptance Criteria:**

**Given** the diagram rules of Story 3.8, with strokes in `var(--lava)`
**When** these 3 diagrams are added:
- **Battery WC:** BPCM ⇄ CAN (120+ DBC signals) ⇄ EVCU, with fault flags for overvoltage, HVIL and isolation resistance
- **zonecore:** ECUs on E2E-protected CAN ⇄ Python SIL bench (32 scenarios, 9 fault-injection)
- **modcell:** conveyor → clamp → vision → fasten, with the 10 ms scan

**Then** all rules from Story 3.8 hold, and the fact audit passes

## Epic 5: Compiler & EDA slice

The Crystal Cave biome and the 2 Compiler & EDA diagrams replace the placeholders. *Shippable after every story.*

### Story 5.1: Crystal Cave biome

As a recruiter,
I want each stop to look like its own place,
So that the journey keeps feeling like a game.

**Acceptance Criteria:**

**Given** the Compiler & EDA Station
**When** it renders
**Then** it has a `crispEdges` **Crystal Cave** backdrop (amethyst-toned cave, block crystals) with the same rules as Story 3.3 (UX-DR13), ≤10 KB, AA contrast preserved

### Story 5.2: New diagrams for Compiler & EDA (fabricfit, tilec)

As a systems engineer on the panel,
I want the compiler and EDA work visualised,
So that I can see the algorithmic depth.

**Acceptance Criteria:**

**Given** the diagram rules of Story 3.8, with strokes in `var(--amethyst)`
**When** these 2 diagrams are added:
- **fabricfit:** an island-style grid with congestion shading and a routed net, labelled "2,218 blocks · 54×54"
- **tilec:** DSL → tile IR (CSE/DCE, fusion) → cache-blocked LLVM IR

**Then** all rules from Story 3.8 hold, and the fact audit passes


## Epic 6: Cleanroom slice

The Snowfield Lab biome and the vaclab diagram replace the last placeholders. Every Main card now shows how it works. *Shippable after every story.*

### Story 6.1: Snowfield Lab biome

As a recruiter,
I want each stop to look like its own place,
So that the journey keeps feeling like a game.

**Acceptance Criteria:**

**Given** the Cleanroom Station
**When** it renders
**Then** it has a `crispEdges` **Snowfield Lab** backdrop (snow-toned sky, white lab tiles, a block fume hood) with the same rules as Story 3.3 (UX-DR13), ≤10 KB, AA contrast preserved

### Story 6.2: vaclab diagram, and no placeholders left

As a panel engineer,
I want the lab toolkit explained visually,
So that every project on the page shows how it works.

**Acceptance Criteria:**

**Given** the diagram rules of Story 3.8, with strokes in `var(--snow)`
**When** the **vaclab** diagram is added (pump-down curve + leak-rate fit, using only vaclab's own numbers)
**Then** all those rules hold, and the fact audit passes
**And** **every one of the 14 Main Level Cards leads with a diagram** (3 reused + 11 new), no placeholder icon remains, and a Vitest test asserts that every non-side Quest has a `diagram.component` that exists (FR10)
**And** the **personality check "Intelligent"** passes: every project shows how it works visually

## Epic 7: Navigation, Skill Tree & Quest Log

The Mini-map, keyboard travel, the Skill Tree (skills as proof), the Quest Log (with the Path folded in) and the XP bar. *Shippable after every story.*

### Story 7.1: Mini-map and progress in the HUD

As a recruiter,
I want to see where I am and jump anywhere,
So that I can skip straight to what interests me.

**Acceptance Criteria:**

**Given** the HUD at ≥1000 px
**When** the visitor is on the Track
**Then** an inline **Mini-map** shows 14 px square nodes joined by a 4 px black connector, for Character · AI · Power · Compiler · Cleanroom · Dock · Quantum: visited = grass, current = gold, unvisited = dark, Quantum = stone + padlock (UX-DR11)
**And** it shows "Stations visited n/4" (FR7)
**And** nodes are labelled buttons inside `nav aria-label="Track"`, the current one has `aria-current="step"`, and one click scrolls there and updates the hash through the router (FR8)

**Given** 600–999 px
**When** the HUD renders
**Then** the Mini-map collapses to a "Station n/4 ▾" button that opens the node list (UX-DR24)

**Given** a viewport below 600 px
**When** the visitor opens **More**
**Then** a **Map** entry lists the Stations with visited, current and locked states, and selecting one jumps there (W3)

**Given** the **personality check** "Curious"
**When** reviewing this epic
**Then** the Mini-map jump and the locked door are each verified as rewarding, working clicks

### Story 7.2: Keyboard travel and Station arrival

As a keyboard user,
I want to move along the Track with standard keys,
So that I can explore without a mouse.

**Acceptance Criteria:**

**Given** focus is not inside a text field or an open overlay
**When** the visitor presses ↓, PageDown or Space
**Then** the page moves to the next screen (Glance → Character → AI → Power → Compiler → Cleanroom → Speedrun → Dock → Quantum)
**And** ↑, PageUp and Shift+Space move to the previous screen; Home goes to the Glance Card and End to the Quantum Fab (FR6, UX-DR21)
**And** there are no single-letter shortcuts, and native scrolling is never hijacked or snapped (FR5)

**Given** `data-motion="on"`
**When** a Station first becomes current
**Then** its title rises 16 px and fades in within ≤600 ms, **once** per Station per session (FR5, UX-DR20)
**And** under `data-motion="off"` nothing animates, and the content is identical (NFR-7)
**And** on iOS Safari, the address bar resizing does not re-trigger an arrival (UX-DR25)

**Given** the CI gate
**When** Epic 3's last PR runs
**Then** JS ≤100 KB gzip, Performance and Accessibility ≥90, the fact audit passes, and the **personality check** "Fun" has at least the dialogue lines and Station arrivals in place, with more in Epic 6

### Story 7.3: Skill Tree, skills as proof (static)

As a hiring manager,
I want to see where each skill was actually used,
So that the skills list is evidence, not keywords.

**Acceptance Criteria:**

**Given** `skills.json` with the 6 §06 groups plus the résumé-only skills placed per D11 (JavaScript → Languages; HTML/CSS, Tailwind, Vite, Node.js, GraphQL, Figma → Software & Web; GCP, Linux → Cloud & DevOps), and an alias list per skill (e.g. "C99 (embedded)" ↔ "Embedded C"; "CAN bus / DBC" ↔ "CAN / DBC")
**When** the site builds
**Then** each Skill Node's **proof list** is computed at build time from Quests whose chips or bullets name the skill or an alias, with no hand-maintained mapping (AD-2)
**And** the Skill Tree renders as a static, collapsed `<details>` section at the Shipping Dock: proven nodes get a grass cap, a count ("·3") and links to `#<station>/<item>`; unproven nodes are dimmed at 45% plain text, not links (FR15, UX-DR12)
**And** there is no separate Skills section; the 2 certification badges stay on the Character Card
**And** **no levels, bars, percentages or scores** appear (Vitest asserts that the rendered Skill Tree contains no `%` and no numeric rating), and the fact audit passes
**And** a Vitest test asserts that every proof link targets an existing Quest slug

### Story 7.4: Skill Tree sheet from the HUD

As a recruiter matching a job description,
I want to open the skills from anywhere and jump to the proof,
So that I can check a requirement in two clicks.

**Acceptance Criteria:**

**Given** the HUD's **⋯ More** menu
**When** the visitor selects **Skill Tree**
**Then** the static Skill Tree is shown as a sheet (desktop: a centred 4 px-bordered panel; mobile: a bottom sheet leaving the HUD visible) with the 6 groups (W7)
**And** selecting a proven node lists its Level Cards, and selecting a card closes the sheet and scrolls there with L1 open (via the router)
**And** focus trap, Esc and focus restore apply, only one overlay is open at a time (`state.openOverlay`), and Back closes the sheet (AD-6)
**And** without JS, the same content stays readable in the Dock's `<details>` section (NFR-12)

### Story 7.5: Quest Log with the Path folded in (static)

As a recruiter,
I want one timeline of everything Sneha has done and what's next,
So that I see the arc of her experience at a glance.

**Acceptance Criteria:**

**Given** `quests.json` and `path.json`
**When** the Quest Log renders inline at the Shipping Dock
**Then** it shows three groups, newest first, with source dates:
- **✓ Completed · 16:** the 4 work terms, 4 course projects and 8 repos
- **● Active · 1:** the capstone (design proposal)
- **→ Next · 1:** 8-month co-op · Jan–Aug 2027

(FR16)
**And** the Path milestones (Nov 2026 open-source sprint, Fall 2026 3B, 2025 3A, Sep 2023 started BASc) appear in the timeline as milestone rows, not counted as Quests (D15)
**And** there is no separate Path section
**And** there is **no Engineering Ambassador entry** (D10)
**And** each Quest row links to its Level Card (FR17)
**And** the counts are computed from `quests.json` statuses, and a Vitest test asserts exactly 16 / 1 / 1 and 17 Quests total
**And** **personality check "Hardworking":** the Quest Log is visibly full of shipped work, and the fact audit passes

### Story 7.6: Quest Log sheet and XP bar

As a recruiter,
I want to see how much I've explored and open the log from anywhere,
So that I know what I haven't seen yet.

**Acceptance Criteria:**

**Given** the HUD's **⋯ More** menu
**When** the visitor selects **Quest Log**
**Then** it opens as a sheet with tabs **Completed 16 · Active 1 · Next 1**, with the same behaviour rules as Story 7.4 (FR17, W8)

**Given** `TrackController`, the only viewport observer (AD-5)
**When** a Quest's L0 is 50% in view
**Then** `markViewed("<station>/<item>")` records it once in `sessionStorage` (`fabline:progress`)
**And** a 10 px segmented **XP bar** under the HUD shows "QUESTS n/17" (grass segments on a black track, UX-DR9) (FR18)
**And** the label never implies a skill rating, and under reduced motion the bar updates without animating
**And** Vitest covers that `markViewed` is idempotent, that the count is capped at 17, and that blocked storage still works

**Given** the CI gate
**When** Epic 5's last PR runs
**Then** JS ≤100 KB gzip, Performance and Accessibility ≥90, the fact audit passes, and the **personality check "Hardworking"** (Quest Log + XP visibly full of shipped work) is verified

## Epic 8: Delight

Achievements, Sneha's sprite, the world coming alive, and real-fact easter eggs. Every effect respects the motion switch. *Shippable after every story.*

### Story 8.1: Achievements and toasts

As a recruiter,
I want small rewards for exploring,
So that the visit feels fun and memorable.

**Acceptance Criteria:**

**Given** `achievements.json` and `src/game/achievements.ts`, with rules as data (`trigger: "<station>/<item>" | screen slug`, AD-5)
**When** the visitor views each trigger (via `TrackController`, at 50% in view)
**Then** these unlock, **once per session** (FR22):

| Achievement | Line | Trigger |
|---|---|---|
| **Shipped to production** | "Communitech, on Azure" | `ai/communitech` |
| **8 repos, one sprint** | "Nov 2026" | `speedrun` |
| **Azure certified ×2** | "AZ-900 · AI-900" | `character` |
| **46/46 traced** | "zonecore safety requirements" | `power/zonecore` |
| **Cleanroom graduate** | "MIS capacitor, fab to C–V" | `cleanroom/mis-capacitor` |

**And** each toast follows UX-DR10: panel, 4 px black border, gold inner ring, pixel badge, ≤8 words. It sits bottom-right on desktop and above the bottom HUD on mobile, **never covering Résumé**. One shows at a time from a queue, auto-hides after about 3 s (paused on hover or focus), is announced in the polite live region, and never takes focus or blocks input
**And** the toast moves in 4 px steps within 200 ms in and out under `data-motion="on"`, and appears without motion when off
**And** when all 17 Quests have been viewed, a one-time toast says "Every quest seen. Résumé's in the HUD." (UX-DR25)
**And** every toast text passes the fact audit, and Vitest covers once-only unlocks, queue order and the 17/17 trigger

### Story 8.2: Sneha on the Track (sprite engine with fallback marker)

As a recruiter,
I want to see Sneha travel with me,
So that the portfolio feels like her adventure.

**Acceptance Criteria:**

**Given** the **Sprite** island (`client:idle`, `aria-hidden="true"`, error boundary)
**When** the visitor is past the Glance Card
**Then** a marker rides the Track: bottom-left on mobile (48 px, above the HUD) and at the left edge on ≥860 px (UX-DR16)
**And** until Sneha's pixel art exists, the marker is the **fallback**: `sneha-avatar-256.webp` at 40 px in a black square frame (UX-DR16)
**And** its states follow `state`:
- **walk** (a gentle 4 px bob, advanced by scroll distance, stopping when scrolling stops)
- **idle**
- **thinking** (a thought-bubble chip while `openOverlay` is an Inspect panel)
- **celebrate** (a 700 ms hop + sparkle squares when an achievement unlocks)

**And** the engine accepts an optional PNG sprite sheet config (`public/assets/character/sprite.png` + `sprite.json` frame map: idle, walk×4, thinking, celebrate×2) and, when present, renders frames at **integer ×2 scale** with `image-rendering: pixelated`
**And** under `data-motion="off"` the marker shows a static idle frame only (NFR-7)
**And** total JS stays ≤100 KB gzip

### Story 8.3: Sneha's pixel art goes in *(starts when Sneha delivers the sprite sheet)*

As a recruiter,
I want the character to look like Sneha,
So that the game feels personal.

**Acceptance Criteria:**

**Given** Sneha's sprite sheet, made to the EXPERIENCE §12 brief: 32×48 native, ≤16 colours, 1 px black outline, recognisably her (wavy dark-brown hair, round glasses, lab coat), original, not resembling any existing character
**When** `tools/images.py` processes it into `public/assets/character/sprite.png` (≤20 KB) and `sprite.json`
**Then** the Sprite island uses it automatically, with no code change beyond the config (Story 8.2)
**And** every state reads clearly at 64×96, and the fallback marker is no longer shown
**And** Sneha signs off on the look in the Vercel Preview before merge

### Story 8.4: Biomes build themselves, numbers count up, diagrams draw on

As a recruiter,
I want each Station to come alive as I arrive,
So that scrolling feels like entering a new area.

**Acceptance Criteria:**

**Given** `data-motion="on"`
**When** a Station first becomes current
**Then** its backdrop's hill blocks pop up in 4 px steps, its title drops in, and its feature diagram strokes draw on: **600 ms in total, once per Station per session** (replacing the simpler Story 7.2 arrival) (UX-DR20)
**And** each card's metric numbers count up from 0 within 600 ms the first time they are in view. Display strings that aren't plain numbers ("<300 ms", "18.8→1.26") appear without counting
**And** the existing diagram dash-flow runs **only while the diagram is in view**, and nothing loops longer than 5 s without being stoppable by the Motion toggle (WCAG 2.2.2)
**And** there is no parallax beyond 1 layer, no shake, and no flashing faster than 3 per second

**Given** `data-motion="off"`
**When** the same Stations appear
**Then** everything shows in its final state immediately, with identical content (NFR-7)

**Given** Lighthouse
**When** the PR runs
**Then** CLS stays ≈0 (animations use `transform` and `opacity` only), and Performance stays ≥90

### Story 8.5: Easter eggs and the locked-door nudge

As a curious visitor,
I want hidden details that reward digging deeper,
So that exploring feels worthwhile.

**Acceptance Criteria:**

**Given** Inspect L2
**When** the visitor opens these cards' details
**Then** 3 real-fact easter eggs appear as a small "🥚" row, each citing its inventory source in the content file (FR14):
- **Communitech:** "The newsletter goes out Mondays, 7 AM ET." (inv §5.1)
- **modcell:** "E-stop to safe state in one 10 ms scan." (inv §7)
- **capstone:** "Skipped the ~$611 eval kit (~40% of the budget)." (inv §6.2)

**And** none of them is required to understand the card, and each passes the fact audit

**Given** the Quantum Fab door
**When** the visitor selects it
**Then** besides revealing "Not unlocked yet. That's the long-term goal.", the door plays a 300 ms nudge under `data-motion="on"` (none when off) and the sprite turns toward it (UX-DR15)

**Given** the **personality checklist** at the end of Epic 6
**When** reviewed in the Vercel Preview
**Then**:
- **Curious:** ≥3 rewarding things to click (Inspect, Skill Tree proof, the locked door, the easter eggs)
- **Fun:** ≥3 delightful moments (achievement toast + celebrate, biome build-up + walking sprite, count-ups, door nudge)
- **Intelligent:** a diagram on every main card
- **Hardworking:** Quest Log + XP full of shipped work

**And** each of these is recorded as verified in the PR description

## Epic 9: Polish for every recruiter

Phone, accessibility, release performance and the browser matrix are verified and fixed. Link previews already shipped in Story 2.6. *Shippable after every story.*

### Story 9.1: Phone and touch pass

As a recruiter on my phone between meetings,
I want everything to fit and respond to touch,
So that I never pinch, zoom or hunt.

**Acceptance Criteria:**

**Given** real devices or emulation at 360, 390 and 414 px (portrait) and 740 px (landscape), on iOS Safari and Android Chrome
**When** the whole Track is walked, from the Glance Card to the Quantum Fab
**Then**:
- there is no horizontal scroll
- the Glance Card fits the first viewport
- every control is ≥44×44 px
- the bottom HUD respects safe-area insets and never covers metrics or buttons
- the Inspect bottom sheet can be dragged down and closed with ✕

(NFR-5, UX-DR24)
**And** the page works at 200% zoom and at 400% reflow (320 CSS px) with no lost content (UX-DR24)
**And** the iOS address-bar resize triggers no repeated arrivals or layout jumps (UX-DR25)
**And** every issue found is fixed in this story, or logged as its own follow-up with a reason

### Story 9.2: Accessibility audit and fixes

As a recruiter who uses a keyboard or a screen reader,
I want to reach and understand everything,
So that the portfolio works for me too.

**Acceptance Criteria:**

**Given** the deployed Preview
**When** it is audited with axe DevTools, the keyboard map (UX-DR21) and a screen reader (NVDA + Chrome on Windows, VoiceOver on iOS)
**Then**:
- the focus order is: skip link → Glance Card buttons → HUD → content in Track order, with the gold focus ring always visible
- every overlay traps focus and restores it on close
- there are no single-letter shortcuts

(NFR-6, UX-DR21)
**And** the landmarks (`header`, `nav "Track"`, `main`, a labelled `section` per Station) and the single polite live region work as specified (UX-DR23)
**And** every diagram announces its title + "in words" description, and the decorative backdrops and sprite are skipped (UX-DR22)
**And** axe reports 0 serious or critical issues, Lighthouse Accessibility ≥90, and every text pair is ≥4.5:1 (NFR-8)
**And** with `prefers-reduced-motion` and with the Motion toggle off, nothing animates, and content and function are identical (NFR-7)

### Story 9.3: Performance at release

As a recruiter on a slow connection,
I want the page to appear almost instantly,
So that I don't leave before it loads.

**Acceptance Criteria:**

**Given** the **deployed** Vercel Preview (not just local `dist/`)
**When** Lighthouse mobile runs 3 times
**Then** the median meets: LCP <2.0 s, CLS ≈0 (<0.05), Performance ≥90, total JS ≤100 KB gzip, first-load transfer ≤600 KB excluding the lazy scene image (NFR-2, NFR-3, SM-4)
**And** fonts are subset to the characters used, images below the fold are lazy, and the portrait is the only eager image (NFR-4)
**And** if React makes the JS budget fail, the recorded decision is either to trim islands or to adopt the deferred Preact option (architecture Deferred), and the result is re-measured
**And** Performance ≥90 becomes a hard gate here, against the deployed Preview (it was a CI warning since Story 1.2)

### Story 9.4: Browser matrix and release checklist

As Sneha,
I want a final check across browsers and against every success metric,
So that I can share the link with confidence.

**Acceptance Criteria:**

**Given** the latest 2 versions of Chrome, Edge, Firefox and Safari, plus iOS Safari 16+ (NFR-11)
**When** the Track is walked in each
**Then** every screen, Inspect, the sheets, toasts and deep links work, and any browser-specific fix is applied

**Given** the PRD success metrics
**When** they are verified on the Preview
**Then** each is recorded as ✓ in the release PR description:
- **SM-1:** Résumé reachable in ≤2 clicks from every screen (target 1)
- **SM-2:** any card's key metric reachable in ≤3 clicks from the Glance Card
- **SM-3:** passes on a phone
- **SM-4:** Lighthouse ≥90 / ≥90
- **SM-5:** 0 fact-audit violations

**And** a copy review against EXPERIENCE "Voice and tone" passes (UX-DR26): plain labels, qualifiers next to numbers, no hype
**And** the capstone shows nowhere as built, no teammate names appear, and the Ambassador appears only in the PDF (D3, D10)
**And** Sneha merges the release PR, and `snehaislam.vercel.app` serves The Fab Line
