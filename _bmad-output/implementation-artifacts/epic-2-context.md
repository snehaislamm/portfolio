# Epic 2 Context: First screen & HUD

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Build the first visible layer of The Fab Line on `/next`: the Block Biome look (tokens, fonts, reusable primitives), the Glance Card that delivers the whole pitch with zero clicks, the Character Card, a motion preference backed by the game-state store, a HUD that keeps Résumé and contact one click away on every later screen, and correct link previews. A recruiter who sees only the first screen must learn who Sneha is, when she is available and her three strongest proofs, with the résumé one click away. The live `/` keeps serving the frozen legacy page until the Epic 3 cutover. The site must be shippable after every story.

## Stories

- Story 2.1: Block Biome design tokens and building blocks
- Story 2.2: Glance Card, the whole pitch on the first screen
- Story 2.3: Character Card
- Story 2.4: Motion preference and the game-state store
- Story 2.5: HUD with one-click Résumé and contact
- Story 2.6: Link previews and search

## Requirements & Constraints

- **One view, progressive depth (D15):** there is no Recruiter/Game mode, no `data-mode` and no `?mode=`. The pre-rendered page without JS is the baseline and must be fully readable.
- **No copy in components:** every string, fact and metric comes from the `src/content/*.json` collections (`profile.json`, `coursework.json`, `ui.json`, …) through `astro:content`, validated by the zod schemas in `src/content/schemas.ts` (wired in `src/content.config.ts`). Add new fields to the schema first; a schema error fails the build. Proof Tile labels, Character Lines and Captions need a `source` field (e.g. `"inv §5.1"`).
- **Facts:** every number and label must exist in `docs/content-inventory.md`. Proof Tiles are 1,200+ · ±2% · 102.6 nm with their inventory-sourced labels. Availability is "8-month co-op · Jan–Aug 2027". Standing is 3B (Fall 2026). Per D16, 3A = Spring 2026 and 3B = Fall 2026 (the legacy "2025 · 3A" is out of date). Only completed courses appear (NE 343, NE 344, NE 332, NE 333, NE 318, MSE 261), never planned ones. Never write capstone teammate names, and no "Engineering Ambassador" on `/next`.
- **Word budgets:** Glance Card ≤30 visible words (excluding buttons), Proof Tile and metric labels ≤6 words, Character Card values ≤35 words.
- **Static and private:** no backend, no third-party requests (Google Fonts must go), no cookies; `localStorage` only for the motion preference.
- **Budgets:** total JS ≤100 KB gzip, first load ≤600 KB, mobile LCP <2.0 s (the Glance portrait is the LCP element and is never lazy-loaded), Lighthouse a11y ≥0.9.
- **Accessibility:** WCAG 2.1 AA (text ≥4.5:1, UI ≥3:1), touch targets ≥44×44 px, visible focus everywhere, works from 360 px with no horizontal scroll, and a skip link.
- **Résumé reach:** 1 click from every screen (the Glance Card button, then the HUD), opening `/Sneha_Islam_Resume.pdf` in a new tab.
- **Resilience:** a JS error in any island never hides content; each island sits in an error boundary that renders `null`.

## Technical Decisions

- **Where Epic 2 plugs into Epic 1:**
  - Build on `src/pages/next.astro` (keep its `noindex` until cutover) and `src/layouts/Base.astro`. Leave `/` (legacy) untouched.
  - The gate in `.github/workflows/ci.yml` already runs `astro check` → `vitest` → build → Python unit tests → legacy text compare → `tools/check_dist.py` → `tools/fact_audit.py` → linkinator → Lighthouse CI. New Vitest tests (contrast, state, storage) run automatically.
  - `tools/fact_audit.py` already scans `dist/next/index.html` visible text (including alt, aria-label, title, desc) plus the content JSON. Any new visible string must pass it. Add allow-list exceptions only in `tools/fact_audit_allow.txt`, one comment per entry.
- **Tokens:** `src/styles/tokens.css` is the only file in `src/` with hex colours. It mirrors the DESIGN.md frontmatter names as custom properties (`--grass`, `--gold`, `--panel`, `--station-ai` …), covering colours, semantic aliases, spacing (4 px block pixel, border 4/3, bevel 3, drop 6, gutters 16/28, content-max 1120, hud-height 60, touch-min 44) and typography roles. Everything else uses `var(--token)` or `currentColor`. Radius is always 0.
- **Fonts:** JetBrains Mono (400/600/800) for titles, buttons and labels (uppercase ExtraBold, hard black shadow) and Space Grotesk (400/600/700) for sentences. Both are self-hosted, subset and use `font-display: swap`. No pixel fonts.
- **Layering:** static markup lives in `src/components/` (Astro, zero JS); React islands live in `src/islands/`; logic lives in `src/game/`, which imports nothing from islands, components or React.
- **Motion:** a blocking inline head script in `Base.astro` sets only `<html data-motion="on|off">` from `localStorage["fabline:motion"]`, then `prefers-reduced-motion`. The markup default is `off`. CSS animation runs only under `[data-motion="on"]`; JS motion reads the store.
- **State:** `src/game/state.ts` (nanostores 1.5.x + @nanostores/react 2.0.x) is the sole mutator; `setMotion` is the only way to change motion. `src/game/storage.ts` uses `fabline:` keys, try/catch, `localStorage` for preferences and `sessionStorage` for progress, and must work with storage blocked.
- **Viewport:** `src/islands/TrackController.tsx` is the only viewport observer (one IntersectionObserver, 50%). Epic 2 creates a minimal version that tracks only `glanceInView`; Epic 3 extends it.
- **Hydration:** the HUD is `client:load`; other islands are `client:idle`/`client:visible`.
- **Assets:** everything served as-is lives in `public/`; character art stays at `/assets/character/` with today's sizes. `tools/images.py` (Pillow, the single documented dependency) is the only producer of derivatives, including the 1200×630 OG crop (no baked-in text, ≤150 KB). Every `<img>` has width and height.
- **Analytics:** `<Analytics />` appears only in `Base.astro`.
- **SEO:** `<title>` "Sneha Islam — Nanotechnology Engineering · Software & AI", a meta description ≤155 characters built from inventory facts, canonical `https://snehaislam.vercel.app/`, OG/Twitter tags with absolute URLs and declared dimensions, and a favicon.

## UX & Interaction Patterns

- **Primitives:** bevelled block buttons in gold (primary; Résumé is the only gold HUD button), stone and grass, with a 3 px black border, 3 px inset bevel (light top-left, dark bottom-right), a pressed state (inner shadow + 2 px down) and mono uppercase ExtraBold. Square status pills always carry a word (✓ DONE grass / ● ACTIVE gold / → NEXT sky / 🔒 stone). Tech chips. Focus ring: 3 px gold, 3 px offset.
- **Contrast rule:** text only in text/muted/dim/accents; dirt and stone are never text colours; on-accent text goes on any accent fill.
- **Metric/Proof tile:** inset background, 4 px dirt-dark top strip, gold mono ExtraBold number, muted label with the qualifier inside.
- **Glance Card:** portrait in a 6 px black frame on a grass-block plinth over a Sky Plains `crispEdges` backdrop; the name in display type with a 4 px black shadow; the tagline; availability with a sky "→ NEXT" pill; 3 Proof Tiles; ▶ Start (grass) and Résumé (gold) as the only buttons. No HUD on this screen. Start, Space, Enter, ↓ or scrolling advance to the next section. At 390 px everything fits in the first viewport, with the tiles in one row.
- **Character Card:** 256 px portrait in a black square frame, class/degree/home/next quest/equipment badges/4 interests, and a native `<details>` "Training ▸ 6 courses" with topic chips. No About paragraphs, no invented stats.
- **HUD:** at ≥600 px a sticky top bar (panel, 4 px black bottom border, 60 px) with the square avatar + name, then Résumé, stone Email/LinkedIn/GitHub icons and "⋯ More" (Motion on/off now; Skill Tree and Quest Log later). Below 600 px it is a safe-area-aware bottom bar with Résumé + 3 icons + More. It never covers readable or interactive content. Email copies the address and announces "Copied" in one polite live region, with a selectable field + "Press Ctrl/⌘+C" fallback if the clipboard is denied.
- **Focus order:** skip link → Glance Card buttons → HUD (Résumé → Email → LinkedIn → GitHub → More) → content. No single-letter shortcuts.
- **Landmarks:** `header` for the HUD and `main` for the Track.
- **Voice:** plain labels ("Résumé", "▶ Start"), the qualifier beside the number, no hype or emoji.

## Cross-Story Dependencies

- 2.1 (tokens, fonts, primitives) comes before 2.2, 2.3 and 2.5.
- 2.4 (the `data-motion` script, store and storage) comes before 2.5's Motion toggle. 2.5 also creates the first `TrackController.tsx`, which Story 3.5 extends.
- 2.2 adds `tools/images.py`; 2.6 extends it for the OG image.
- The Dock contact links that back up the HUD without JS arrive in Story 3.10; the Mini-map and progress in the HUD arrive in Epic 7.
- Base.astro tags from 2.6 carry over to `/` at the Epic 3 cutover.
