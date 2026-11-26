---
title: 'Story 2.1 · Block Biome design tokens and building blocks'
type: 'feature'
created: '2026-11-26'
status: 'done'
baseline_commit: 'f083408d95f3f94a4befbe13ac73c6eb7648b317'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-portfolio-2026-11-25/DESIGN.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The new page has no visual system. Without one source of tokens and a few shared primitives, every Epic 2–3 component would hard-code colours, fonts and sizes, and the game would look assembled instead of designed.

**Approach:**
- Create `src/styles/tokens.css` from the DESIGN.md frontmatter (colour, spacing, typography, focus).
- Self-host the two fonts via Fontsource.
- Add the first primitives as Astro components: bevelled buttons, status pills, tech chips and the focus ring.
- Show them on `/next` in a small "building blocks" section.
- Add Vitest tests for contrast and the hex-colour rule.
- `/` (legacy) is unchanged.

## Boundaries & Constraints

**Always:**
- **Token names = DESIGN.md names.** Colours are `--color-<name>`, including the semantic roles (e.g. `--color-station-ai: var(--color-sky)`), plus `--space-<key>`, `--font-*` / `--type-<style>-*` and `--focus-*`. Two stray hex values become named tokens: `--color-grass-light: #a9d46c` and `--color-minimap-unvisited: #3d3b34`.
- **AD-8:** `src/styles/tokens.css` is the **only** file under `src/` with hex colour literals.
- **Fonts:** `@fontsource/jetbrains-mono` (400/600/800) and `@fontsource/space-grotesk` (400/600/700) ~5.3. Import the latin subset only, with `font-display: swap`. Glyphs outside latin (τ, ₓ, →) fall back to system fonts.
- **Google Fonts:** `/next` makes no Google Fonts request. `/` keeps its legacy Google Fonts links until the Story 3.11 cutover, because legacy is frozen and `check_dist.py` requires them.
- **Scope of styles:** tokens, fonts and primitive styles load **only** on `/next`. Import them from the page or a new layout, never from `Base.astro`. The Story 1.2 parity check must stay green; it fails if `/` gains a `<link>` or `<style>`.
- **Primitives (UX-DR3/8/21):**
  - **Buttons** (`gold` / `stone` / `grass`): 3 px black border, 3 px bevel per DESIGN `components`, a pressed state (`:active` → pressed bevel), min 44×44 px, 0 radius.
  - **Status pills:** square, 2 px edge border, label typography, always a word (done/active/next/locked).
  - **Tech chips.**
  - **Global `:focus-visible`:** 3 px solid gold outline, 3 px offset.
- **AD-2:** every string the showcase renders comes from `ui.json` or the content collections. Add any missing chrome strings to `ui.json` and its strict schema.

**Never:**
- Touch `legacy/index.html`, `Base.astro`'s head output for `/`, or the content facts.
- Use `dirt` or `stone` as a text colour.
- Add game features beyond the primitives (Glance Card is 2.2).
- Commit or push.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Contrast | Every text token (`text`, `muted`, `dim`, `grass`, `gold`, `sky`, `lava`, `amethyst`, `snow`) vs `panel`, `inset`, `coal`; `on-accent` vs `gold`, `stone`, `grass`, `sky` | All ≥4.5:1 | Test names the failing pair and its ratio |
| Banned text colour | Any `color:` (or a text-token alias) resolving to `--color-dirt*` / `--color-stone` in `src/` | Test fails, naming the file | N/A |
| Stray hex | A hex literal in any `src/` file except `tokens.css` | Test fails, naming the file and line | `#ai/…`-style hashes are not hex colours |
| `/` unchanged | Fresh build | `check_dist.py` + `compare_legacy_text.py` pass | N/A |
| `/next` | Fresh build | Self-hosted fonts and tokens; showcase visible; no `fonts.googleapis.com` | N/A |

</frozen-after-approval>

## Code Map

- **DESIGN.md** frontmatter, lines 11–196:
  - `colors` (L11–47)
  - `typography` (L48–95)
  - `spacing` (L99–117)
  - `components` (L118–196; button-primary/stone/grass L123–143, status-pill L172, focus-ring L190)
  - The prose sections (L199+) explain usage.
- `src/layouts/Base.astro`: shared by `/` and `/next`; leave its output for `/` byte-identical.
- `src/pages/next.astro`: the current placeholder (noindex). Extend it, or move it onto a new `src/layouts/Game.astro` that wraps Base and imports the styles.
- `src/content/schemas.ts` (`ui` strict object, 33 keys) and `src/content/ui.json`: the existing chrome strings ("Résumé", "▶ Start", "Inspect ▸", status words…). Reuse them; add keys there if needed.
- `tools/check_dist.py`: `/` parity (fails on gained head `<link>`/`<style>`). `tools/fact_audit.py`: audits `/next` visible text (the showcase must use real content strings).
- `vitest.config.ts`: includes `src/**/*.test.ts`. Put tests in `src/styles/tokens.test.ts`.

## Tasks & Acceptance

**Execution:**
- [x] `package.json` / lockfile: add the two `@fontsource/*` deps, pinned `~5.3.0`.
- [x] `src/styles/tokens.css`: all tokens per Boundaries.
- [x] `src/styles/fonts.css`: the six latin weights.
- [x] `src/styles/base.css`: body font/colour on `coal` and the global focus ring.
- [x] `src/components/ui/Button.astro`, `Pill.astro`, `Chip.astro` (+ scoped or shared CSS using only `var(--…)`): the primitives. Buttons render `<button>` or `<a>`.
- [x] `src/pages/next.astro` (and an optional `src/layouts/Game.astro`): load the styles; show the work-in-progress line plus a "building blocks" section (3 buttons, 4 pills, a quest's chips), with strings from content.
- [x] `src/styles/tokens.test.ts`: parse `tokens.css` (resolve `var()` aliases). Test the contrast matrix, the dirt/stone text rule and the stray-hex scan over `src/**`.

**Acceptance Criteria:**
- Given `npm run check; npm test; npm run build`, when run, then all pass.
- Given the full gate (`check_dist`, `compare_legacy_text`, `fact_audit`, linkinator, `lhci`), when run, then all pass, and `/next` stays within the a11y, JS and transfer budgets.
- Given `dist/next/index.html` and its CSS, when searched, then there is no `fonts.googleapis.com` and `.woff2` files are served from `/_astro/`.

## Implementation Notes

- Styles load via a new `src/layouts/Game.astro` (wraps Base, imports tokens/fonts/base CSS); `Base.astro` is untouched.
- `ui.json` + `uiSchema` gained `statusLocked`, `workInProgress`, `buildingBlocks`. Pills reuse `statusCompleted` ("Completed") for done; the ✓ ● → glyphs and the block padlock are CSS-only, `aria-hidden`.
- Stone/grass pressed bevel mirrors gold's (`inset 3px 3px 0 <dark>` + 2 px down); DESIGN only specifies gold's.
- Fontsource `latin-*.css` also emit `.woff` fallbacks to `/_astro/` (only fetched if woff2 is unsupported).
- Run Vitest from PowerShell (or an uppercase `C:` cwd): from Git Bash (`/c/...` → `c:`) every suite fails with "Cannot read properties of undefined (reading 'config')".

## Spec Change Log

## Review Triage Log

| Layer | Finding | Verdict → route | Evidence |
|---|---|---|---|
| all three | The dirt/stone text-colour scan can be bypassed: component-local custom properties (`--pill-bg`, `--btn-bg`), multi-line `color:` declarations, `--color-stone-dark`/`-light`, quoted TSX values, and `fill` on SVG text | medium → patch | Pre-verified (VG): `color: var(--pill-bg)` on the locked pill passes. `banned()` matches `color-stone` exactly. The matcher is per line. |
| verification-gap | Nothing checks that `/next` loads self-hosted fonts and tokens or avoids Google Fonts | medium → patch | Pre-verified: dropping the `fonts.css` import or adding a Google `<link>` keeps CI green. Fix: a `/next` check in `check_dist.py` + tests. |
| blind-hunter | Nothing checks that every `var(--color/space/type/font/focus/rounded-*)` used in `src/` exists in `tokens.css` | medium → patch | Real: a typo silently drops the style. A simple test fixes it. |
| blind-hunter / edge-case-hunter | The hex scan reads binaries; there's no extension filter | low → patch | Real once images land in `src/`; a direct filter fixes it. |
| blind-hunter | `rgb()/rgba()/hsl()` literals bypass the tokens-only rule | low → patch | AD-8 says tokens only. A direct regex beside the hex scan fixes it. |
| blind-hunter | `on-accent` contrast isn't tested on `lava`/`amethyst`/`snow` (the station accent fills) | low → patch | A direct addition to the matrix. |
| blind-hunter / edge-case-hunter | `<Game title="The Fab Line">` is a hard-coded string (AD-2) | low → patch | Real; the spec says every string comes from content. Add `ui.gameTitle`. |
| edge-case-hunter | Pill with an unknown status has a transparent background | low → patch | A direct fallback: `var(--pill-bg, var(--color-locked))`. |
| blind-hunter | The résumé button opens a new tab with no notice | low → patch | An a11y nit; drop `target="_blank"` (same tab for the PDF). The HUD (2.5) owns the real Résumé button. |
| verification-gap | Button `<a>`/`<button>` branch untested | low → reject | The showcase is hidden; Story 2.5 (HUD Résumé) tests the real link. |
| blind-hunter / edge-case-hunter | Button has no hover/disabled/reduced-motion styles; `href=""`; type order | low → reject | No caller uses `disabled`/empty `href` yet; the motion switch arrives in 2.4 (AD-7). |
| blind-hunter / edge-case-hunter | `getEntry(...)!` gives an opaque crash; empty chips list | low → reject | A loud build failure; the schema data has chips. |
| blind-hunter | Chip/Pill hard-code `2px` and line-heights | low → reject | DESIGN status-pill specifies a literal `2px`; no token exists. |
| blind-hunter | `--space-px: 4px` naming | false | DESIGN defines `px: 4px` (the "block pixel"). |
| blind-hunter | JetBrains Mono 400 is unused | false | The story AC requires 400/600/800. |
| blind-hunter | No `<h1>` on `/next`; chip list label; `ui.json` key order | low → reject | The Glance Card (2.2) brings the `h1`; cosmetic. |

## Verification

**Commands:**
- `npm run check; npm test; npm run build` -- expected: exit 0
- the Story 1.2/1.3 gate commands (README "CI quality gate") -- expected: all pass
- `Select-String -Path dist/next/index.html,dist/_astro/*.css -Pattern googleapis` -- expected: no matches

**Manual checks:**
- `npm run preview` → `/next`: tab through the buttons (gold focus ring visible) and press-and-hold a button (pressed bevel).
