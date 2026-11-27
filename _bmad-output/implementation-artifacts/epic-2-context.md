# Epic 2 Context: First screen & HUD

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Build the first visible layer of The Fab Line on `/next`: the Block Biome look (tokens, fonts, reusable primitives), the Glance Card that delivers the whole pitch with zero clicks, the Character Card, a motion preference backed by the game-state store, a HUD that keeps Résumé and contact one click away on every later screen, and correct link previews. A recruiter who sees only the first screen must learn who Sneha is, when she is available and her three strongest proofs, with the résumé one click away. The live `/` keeps serving the frozen legacy page until the Epic 3 cutover. The site must be shippable after every story.

## Stories

- Story 2.1: Block Biome design tokens and building blocks (done)
- Story 2.2: Glance Card, the whole pitch on the first screen
- Story 2.3: Character Card
- Story 2.4: Motion preference and the game-state store
- Story 2.5: HUD with one-click Résumé and contact
- Story 2.6: Link previews and search

## Requirements & Constraints

- **One view, progressive depth (D15):** no Recruiter/Game mode, no `data-mode`, no `?mode=`. The pre-rendered no-JS page is the baseline and must be fully readable.
- **No copy in components:** every string, fact and metric comes from `src/content/*.json` (`profile.json`, `coursework.json`, `ui.json`, …) via `astro:content`, validated by the zod schemas in `src/content/schemas.ts` (the `ui` schema is strict). Add new fields/keys to the schema first; a schema error fails the build. Proof Tile labels, Character Lines and Captions carry a `source` field (e.g. `"inv §5.1"`).
- **Facts:** every number and label must exist in `docs/content-inventory.md`. Proof Tiles: **1,200+** "companies covered, AI I shipped" (§5.1) · **±2%** "SoC accuracy, EV battery" (§5.3) · **102.6 nm** "SiNₓ film I made" (§6.1). Availability "8-month co-op · Jan–Aug 2027"; home Toronto, ON; standing 3B (Fall 2026). Per D16, 3A = Spring 2026 and 3B = Fall 2026 (the legacy "2025 · 3A" is out of date). Only the 6 completed courses appear (NE 343, NE 344, NE 332, NE 333, NE 318, MSE 261), never planned ones. Never write capstone teammate names (say "4-person team"), and no "Engineering Ambassador" on `/next`.
- **Word budgets:** Glance Card ≤30 visible words (buttons excluded), Proof Tile/metric labels ≤6 words, Character Card values ≤35 words.
- **Static and private:** no backend, no third-party requests, no cookies; `localStorage` only for the motion preference.
- **Budgets:** total JS ≤100 KB gzip, first load ≤600 KB, mobile LCP <2.0 s (the Glance portrait is the LCP element, never lazy-loaded), Lighthouse a11y ≥0.9.
- **Accessibility:** WCAG 2.1 AA (text ≥4.5:1, UI ≥3:1), touch targets ≥44×44 px, visible focus everywhere, works from 360 px with no horizontal scroll, a skip link. "Sneha Islam" on the Glance Card is the page's one and only `<h1>` (`/next` has none yet).
- **New-tab notice:** every control that opens a new tab (Glance Résumé; HUD Résumé, LinkedIn, GitHub) shows a small `aria-hidden` new-tab icon plus screen-reader text "(opens in a new tab)". Use one shared pattern.
- **Résumé reach:** 1 click from every screen (the Glance Card button, then the HUD), opening `/Sneha_Islam_Resume.pdf` in a new tab.
- **Resilience:** a JS error in any island never hides content; each island sits in an error boundary that renders `null`.

## Technical Decisions

- **Where Epic 2 plugs in:**
  - `/next` (`src/pages/next.astro`, `noindex` until cutover) uses `src/layouts/Game.astro`, which wraps `Base.astro` and imports `tokens.css`, `fonts.css` and `base.css`. Game styles load only on `/next`, never from `Base.astro`; `/` (legacy) stays byte-identical and keeps its Google Fonts links until the Story 3.11 cutover (`tools/check_dist.py` enforces parity and that `/next` has no Google Fonts).
  - The CI gate runs `astro check` → `vitest` → build → Python tests → legacy text compare → `check_dist.py` → `fact_audit.py` → linkinator → Lighthouse CI. New Vitest tests run automatically. Run Vitest from PowerShell (Git Bash's `/c/` cwd breaks every suite).
  - `tools/fact_audit.py` scans `dist/next/index.html` visible text (including alt, aria-label, title, desc) plus the content JSON. Exceptions go only in `tools/fact_audit_allow.txt`, one comment per entry.
- **Tokens:** `src/styles/tokens.css` is the only `src/` file with hex (or rgb/hsl) colours. Names mirror DESIGN.md: `--color-<name>` (incl. semantic aliases like `--color-station-ai`), `--space-<key>`, `--font-*`/`--type-<style>-*`, `--focus-*`. Everything else uses `var(--…)` or `currentColor`; tests fail on unknown `var()` names, stray colour literals and dirt/stone used as text. Radius is always 0.
- **Primitives exist** in `src/components/ui/` (`Button`, `Pill`, `Chip`); reuse them rather than restyling.
- **Fonts:** Fontsource JetBrains Mono (400/600/800) and Space Grotesk (400/600/700), latin subset, `font-display: swap`; glyphs like ₓ and → fall back to system fonts. No pixel fonts.
- **Layering:** static markup in `src/components/` (Astro, zero JS); React islands in `src/islands/`; logic in `src/game/`, which imports nothing from islands, components or React.
- **Motion:** a blocking inline head script sets only `<html data-motion="on|off">` from `localStorage["fabline:motion"]`, then `prefers-reduced-motion`; markup default `off`. CSS animation runs only under `[data-motion="on"]`; JS motion reads the store.
- **State:** `src/game/state.ts` (nanostores 1.5.x + @nanostores/react 2.0.x) is the sole mutator; `setMotion` is the only way to change motion. `src/game/storage.ts`: `fabline:` keys, try/catch, `localStorage` for preferences, `sessionStorage` for progress, works with storage blocked.
- **Viewport:** `src/islands/TrackController.tsx` is the only viewport observer (one IntersectionObserver, 50%). Epic 2's minimal version tracks only `glanceInView`.
- **Hydration:** HUD `client:load`; other islands `client:idle`/`client:visible`.
- **Assets:** served files live in `public/`; character art at `/assets/character/` with today's sizes. `tools/images.py` (Pillow, the single documented dependency) is the only producer of derivatives, including the 1200×630 OG crop (no baked-in text, ≤150 KB). Every `<img>` has width and height.
- **Analytics:** `<Analytics />` appears only in `Base.astro`.
- **SEO:** `<title>` "Sneha Islam — Nanotechnology Engineering · Software & AI", meta description ≤155 chars from inventory facts, canonical `https://snehaislam.vercel.app/`, OG/Twitter tags with absolute URLs and declared dimensions, a favicon.

## UX & Interaction Patterns

- **Primitives:** bevelled block buttons gold (primary; Résumé is the only gold HUD button), stone, grass; 3 px black border, 3 px bevel, pressed state (inner shadow + 2 px down), mono uppercase ExtraBold. Square status pills always carry a word (✓ DONE grass / ● ACTIVE gold / → NEXT sky / 🔒 stone). Focus ring 3 px gold, 3 px offset.
- **Contrast rule:** text only in text/muted/dim/accents; dirt and stone never as text; on-accent text on accent fills.
- **Metric/Proof tile:** inset background, 4 px dirt-dark top strip, gold mono ExtraBold number, muted label with the qualifier inside.
- **Glance Card:** portrait (`sneha-portrait-512.webp`, alt "Illustration of Sneha Islam: long wavy brown hair, round glasses, smiling.") in a 6 px black frame on a grass-block plinth over a Sky Plains `crispEdges` backdrop; class line, name (display type, 4 px black shadow), tagline "from silicon to software."; availability with a sky "→ NEXT" pill; 3 Proof Tiles; ▶ Start (grass) and Résumé (gold) as the only buttons. No HUD here. Start, Space, Enter, ↓ or scrolling advance to the next section. At 390 px everything fits in the first viewport, tiles in one row. Before merge Sneha runs a 5-second test with 2 people.
- **Character Card:** 256 px portrait in a black square frame; class, degree line, home, next quest (→ NEXT pill), AZ-900/AI-900 badges, 4 interests with existing icons; native `<details>` "Training ▸ 6 courses" with topic chips. No About paragraphs, no invented stats.
- **HUD:** ≥600 px a sticky top bar (panel, 4 px black bottom border, 60 px) with square avatar + "SNEHA ISLAM", then Résumé, stone Email/LinkedIn/GitHub icons, "⋯ More" (Motion on/off now; Skill Tree and Quest Log later). <600 px a safe-area-aware bottom bar with Résumé + 3 icons + More. Hidden while the Glance Card is in view; never covers readable or interactive content. Email copies the address (also shown in a tooltip) and announces "Copied" in one polite live region, with a selectable field + "Press Ctrl/⌘+C" fallback if the clipboard is denied.
- **Focus order:** skip link → Glance Card buttons → HUD (Résumé → Email → LinkedIn → GitHub → More) → content. No single-letter shortcuts.
- **Landmarks:** `header` for the HUD, `main` for the Track.
- **Voice:** plain labels ("Résumé", "▶ Start"), qualifier beside the number, no hype or emoji.

## Cross-Story Dependencies

- 2.1 (done) supplies tokens, fonts, `Game.astro` and primitives for 2.2, 2.3 and 2.5.
- 2.2 introduces the shared new-tab notice and the `<h1>`; 2.5 reuses the same notice on Résumé, LinkedIn and GitHub.
- 2.4 (`data-motion` script, store, storage) comes before 2.5's Motion toggle. 2.5 creates the first `TrackController.tsx`, which Story 3.5 extends.
- 2.2 adds `tools/images.py`; 2.6 extends it for the OG image.
- Dock contact links (no-JS backup for the HUD) arrive in Story 3.10; Mini-map and progress in the HUD arrive in Epic 7.
- Base.astro tags from 2.6 carry over to `/` at the Epic 3 cutover.
