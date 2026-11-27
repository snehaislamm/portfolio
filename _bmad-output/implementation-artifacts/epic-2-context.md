# Epic 2 Context: First screen & HUD

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Build the first visible layer of The Fab Line on `/next`: the Block Biome look (tokens, fonts, reusable primitives), the Glance Card that delivers the whole pitch with zero clicks, the Character Card, a motion preference backed by the game-state store, a HUD that keeps Résumé and contact one click away on every later screen, and correct link previews. A recruiter who sees only the first screen must learn who Sneha is, when she is available and her three strongest proofs, with the résumé one click away. The live `/` keeps serving the frozen legacy page until the Epic 3 cutover. The site must be shippable after every story. Epic 2 builds no sound: sound effects (D17) arrive in Story 8.6.

## Stories

- Story 2.1: Block Biome design tokens and building blocks (done)
- Story 2.2: Glance Card, the whole pitch on the first screen (done)
- Story 2.3: Character Card (done)
- Story 2.4: Motion preference and the game-state store
- Story 2.5: HUD with one-click Résumé and contact
- Story 2.6: Link previews and search

## Requirements & Constraints

- **One view, progressive depth (D15):** no Recruiter/Game mode, no `data-mode`, no `?mode=`. The pre-rendered no-JS page is the baseline and must be fully readable.
- **No copy in components:** every string, fact and metric comes from `src/content/*.json` (`profile.json`, `coursework.json`, `stations.json`, `ui.json`, …) via `astro:content`, validated by the zod schemas in `src/content/schemas.ts` (the `ui` schema is strict). Add new fields/keys to the schema first; a schema error fails the build. Asset paths may stay in components. Proof Tile labels, Character Lines and Captions carry a `source` field (e.g. `"inv §5.1"`).
- **Facts:** every number and label must exist in `docs/content-inventory.md`. Proof Tiles: **1,200+** "companies covered, AI I shipped" (§5.1) · **±2%** "SoC accuracy, EV battery" (§5.3) · **102.6 nm** "SiNₓ film I made" (§6.1). Availability "8-month co-op · Jan–Aug 2027"; home Toronto, ON; standing 3B (Fall 2026) per D16. Only the 6 completed courses appear, never planned ones. Never write capstone teammate names (say "4-person team"), and no "Engineering Ambassador" on `/next`.
- **Word budgets:** Glance Card ≤30 visible words (buttons excluded), Proof Tile/metric labels ≤6 words, Character Card values ≤35 words. A "word" is a whitespace token containing a letter; tests enforce this.
- **Static and private:** no backend, no third-party requests, no cookies. `localStorage` holds only preferences: motion now (Story 2.4), sound later (Story 8.6, `fabline:sound`).
- **Budgets:** total JS ≤100 KB gzip, first load ≤600 KB, `/next` mobile LCP <2.0 s (gated in `lighthouserc.json`; the Glance portrait is the LCP element, eager with `fetchpriority="high"`), Lighthouse a11y ≥0.9.
- **Accessibility:** WCAG 2.1 AA (text ≥4.5:1, UI ≥3:1), touch targets ≥44×44 px, visible focus everywhere, works from 360 px with no horizontal scroll, a skip link (not built yet). "Sneha Islam" on the Glance Card is the page's only `<h1>`; section titles are `<h2>`.
- **New-tab notice:** every control that opens a new tab shows an `aria-hidden` icon plus screen-reader text "(opens in a new tab)" (`ui.opensInNewTab`). The shared pattern is `src/components/ui/NewTabNotice.astro`, used via `Button`'s `newTab={ui.opensInNewTab}` prop (a string, not a boolean). The HUD's Résumé, LinkedIn and GitHub must reuse it.
- **Résumé reach:** 1 click from every screen (the Glance Card button, then the HUD), opening `/Sneha_Islam_Resume.pdf` in a new tab.
- **Resilience:** a JS error in any island never hides content; each island sits in an error boundary that renders `null`.

## Technical Decisions

- **Where Epic 2 plugs in:**
  - `/next` (`src/pages/next.astro`, `noindex` until cutover) uses `src/layouts/Game.astro`, which wraps `Base.astro` and imports `tokens.css`, `fonts.css` and `base.css`. Game styles load only on `/next`, never from `Base.astro`. `/` (legacy) stays byte-identical and keeps its Google Fonts links until the Story 3.11 cutover.
  - Page structure today: `<main>` → `GlanceCard` (`#glance`, `data-next="character"`) → `CharacterCard` (`section#character`) → the temporary Story 2.1 building-blocks showcase (`#track`).
  - `tools/check_dist.py` enforces `/` parity, no Google Fonts on `/next`, exactly one `<h1>`, `.sr-only` defined in the CSS, and `#glance[data-next="character"]` with `section#character` after `#glance` and before `#track`.
  - The CI gate (full list in `_bmad-output/HANDOFF.md` §5) runs `astro check` → `vitest` → build → Python tests → legacy text compare → `check_dist.py` → `fact_audit.py` → linkinator → Lighthouse CI. Run Vitest from PowerShell (Git Bash's `/c/` cwd breaks every suite).
  - `tools/fact_audit.py` scans `dist/next/index.html` visible text (including alt, aria-label, title, desc) plus the content JSON. Exceptions go only in `tools/fact_audit_allow.txt`, one comment per entry.
- **Tokens:** `src/styles/tokens.css` is the only `src/` file with hex, rgb or hsl colours. Names mirror DESIGN.md: `--color-<name>` (incl. semantic aliases like `--color-station-ai`), `--space-<key>`, `--font-*`/`--type-<style>-*`, `--focus-*`. Everything else uses `var(--…)` or `currentColor`. `tokens.test.ts` fails on unknown `var()` names, stray colour literals, and dirt/stone used as text or as an SVG `fill` (use strokes for dirt shapes). Radius is always 0.
- **Primitives** in `src/components/ui/` (`Button` renders `<a>` or `<button>`, `Pill`, `Chip`, `NewTabNotice`); `src/components/icons/InterestIcon.astro` holds the 4 interest icons. Reuse them rather than restyling. `.sr-only` lives in `base.css`.
- **Component pattern:** static Astro components take schema-typed `profile`/`ui` props from `next.astro`, use scoped token-only CSS, and are tested with Astro's container API (`getEntry` doesn't work there, so pass data in). Course ordering uses a `src/lib` helper (group, then code) shared by page and test.
- **Fonts:** Fontsource JetBrains Mono (400/600/800) and Space Grotesk (400/600/700), latin subset, `font-display: swap`; glyphs like ₓ and → fall back to system fonts. No pixel fonts.
- **Layering:** static markup in `src/components/` (Astro, zero JS); React islands in `src/islands/`; logic in `src/game/`, which imports nothing from islands, components or React.
- **Glance key advance:** a tiny inline `<script>` in `GlanceCard.astro` (no island, no observer). While the card is in view, ↓/Space/PageDown (and Enter when focus is on `body`) move focus to the `data-next` target (`tabindex="-1"`, `preventScroll`) and scroll to it; ignores modifiers and text controls; never writes the URL (only `router.ts` will, AD-6). ▶ Start is `<a href="#character">` so it works without JS.
- **Motion:** a blocking inline head script sets only `<html data-motion="on|off">` from `localStorage["fabline:motion"]`, then `prefers-reduced-motion`; markup default `off`. CSS animation runs only under `[data-motion="on"]`; JS motion reads the store.
- **State:** `src/game/state.ts` (nanostores 1.5.x + @nanostores/react 2.0.x) is the sole mutator; `setMotion` is the only way to change motion. Design it so Story 8.6 can add `sound` + `setSound` the same way. `src/game/storage.ts`: `fabline:` keys, try/catch, `localStorage` for preferences, `sessionStorage` for progress, works with storage blocked.
- **Viewport:** `src/islands/TrackController.tsx` is the only viewport observer (one IntersectionObserver, 50%). Epic 2's minimal version tracks only `glanceInView`.
- **Hydration:** HUD `client:load`; other islands `client:idle`/`client:visible`.
- **Assets:** served files live in `public/`; character art at `/assets/character/` (`sneha-portrait-512.webp`, `-256.webp` exist). Every `<img>` has width and height. `tools/images.py` (Pillow, the single documented dependency) does not exist yet: it was deferred from 2.2 to Story 8.3. Story 2.6 needs the 1200×630 OG crop (no baked-in text, ≤150 KB); its AC names `tools/images.py` as the producer, so 2.6 creates at least the OG part of it.
- **Analytics:** `<Analytics />` appears only in `Base.astro`.
- **SEO:** `<title>` "Sneha Islam — Nanotechnology Engineering · Software & AI", meta description ≤155 chars from inventory facts, canonical `https://snehaislam.vercel.app/`, OG/Twitter tags with absolute URLs and declared dimensions, a favicon.

## UX & Interaction Patterns

- **Primitives:** bevelled block buttons gold (primary; Résumé is the only gold HUD button), stone, grass; 3 px black border, 3 px bevel, pressed state (inner shadow + 2 px down), mono uppercase ExtraBold. Square status pills always carry a word (done / active / → NEXT / locked). Focus ring 3 px gold, 3 px offset.
- **Contrast rule:** text only in text/muted/dim/accents; dirt and stone never as text; on-accent text on accent fills. Text over the sky backdrop sits on a `panel` block.
- **Glance Card (built):** portrait in a 6 px black frame on a grass-block plinth over a Sky Plains `crispEdges` SVG backdrop; class line, name, tagline, availability with → NEXT pill, 3 Proof Tiles (not links), ▶ Start (grass) and Résumé (gold) as the only buttons. `min-height: 100svh`; fits the first viewport at 390×844 with tiles in one row. Before merge Sneha runs a 5-second test with 2 people.
- **Character Card (built):** `<h2>` "Character Card", 256 px portrait (decorative `alt=""`, lazy), `<dl>` rows Class / School / Home / Next Quest / Equipment (AZ-900, AI-900 as `<abbr title>` badges), Interests with icons, native closed `<details>` "Training ▸ 6 courses" with topic chips. No About paragraphs, no invented stats.
- **HUD:** ≥600 px a sticky top bar (panel, 4 px black bottom border, 60 px) with square avatar + "SNEHA ISLAM", then Résumé, stone Email/LinkedIn/GitHub icons, "⋯ More" (Motion on/off now; Sound on/off in 8.6; Skill Tree and Quest Log later). <600 px a safe-area-aware bottom bar with Résumé + 3 icons + More. Hidden while the Glance Card is in view; never covers readable or interactive content. Email copies the address (also shown in a tooltip) and announces "Copied" in one polite live region, with a selectable field + "Press Ctrl/⌘+C" fallback if the clipboard is denied.
- **Focus order:** skip link → Glance Card buttons → HUD (Résumé → Email → LinkedIn → GitHub → More) → content. No single-letter shortcuts.
- **Landmarks:** `header` for the HUD, `main` for the Track (already wraps Glance + Character + `#track`).
- **Voice:** plain labels ("Résumé", "▶ Start"), qualifier beside the number, no hype or emoji.

## Cross-Story Dependencies

- 2.1–2.3 (done) supply tokens, fonts, `Game.astro`, primitives, `NewTabNotice`, the `<h1>`, and the Glance + Character Cards that 2.4–2.6 build on.
- 2.4 (`data-motion` script, store, storage) comes before 2.5's Motion toggle; 8.6 later adds `sound` to the same store and a Sound item to the More menu.
- 2.5 reuses `NewTabNotice` on Résumé, LinkedIn and GitHub, and creates the first `TrackController.tsx`, which Story 3.5 extends.
- The `#track` showcase is temporary; Epic 3 replaces it with the real Track.
- Dock contact links (no-JS backup for the HUD) arrive in Story 3.10; Mini-map and progress in the HUD arrive in Epic 7.
- 2.6's OG image depends on an image-derivative step (`tools/images.py`, otherwise owned by Story 8.3). Base.astro tags from 2.6 carry over to `/` at the Epic 3 cutover.
