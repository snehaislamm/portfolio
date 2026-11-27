---
title: 'Story 2.2 · Glance Card, the whole pitch on the first screen'
type: 'feature'
created: '2026-11-26'
status: 'done'
baseline_commit: '7bac4f26574540c424b96ebce9c3971cc13bf182'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/_bmad-output/planning-artifacts/ux-designs/ux-portfolio-2026-11-25/DESIGN.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** `/next` opens on a work-in-progress line. A recruiter who sees only one screen learns nothing about Sneha.

**Approach:** Add a static, pre-rendered Glance Card as the first screen of `/next`. It shows the portrait on a plinth over a Sky Plains backdrop, the class line, the name as the page's only `<h1>`, the tagline, the availability with a → NEXT pill, 3 Proof Tiles, and the only two buttons, ▶ Start and Résumé. A tiny script handles the keyboard advance. The building-blocks showcase stays below as the next section until Story 2.3. `tools/images.py` is split out to deferred work (it targets Story 8.3).

## Boundaries & Constraints

**Always:**
- **Copy:** every string comes from `profile.json` / `ui.json` (AD-2).
- **Proof Tile labels** are the epic's verbatim labels, sourced from the inventory:
  - "companies covered, AI I shipped" (§5.1)
  - "SoC accuracy, EV battery" (§5.3)
  - "SiNₓ film I made" (§6.1)
- **Word count:** visible words, excluding button labels, ≤30. A "word" is a whitespace token containing a letter; `·`, `1,200+`, `±2%` and `2027` don't count. Each tile label is ≤6 words. Both are enforced by a test.
- **Layout order** (DESIGN L273–279, wireframes L10–43):
  - Desktop: a text column on the left, the portrait on a grass plinth on the right.
  - Text column: tag "Nano-Engineer · University of Waterloo", name, tagline, availability "8-month co-op · Jan–Aug 2027" with a `Pill status="next"`, a row of 3 tiles, then ▶ Start (grass) and Résumé (gold).
  - <600 px: everything stacks, with the portrait (~180 px) on top and the tiles in one row.
  - At 390×844 the whole card fits in the first viewport.
- **Card size:** the section is `min-height: 100svh`.
- **Proof Tiles** use `metric-tile` (DESIGN L151–157): `inset` background, 3 px `edge` border, 4 px `dirt-dark` top strip, a gold `typography.metric` number and a `muted` label. Tiles are not links.
- **Portrait:**
  - `/assets/character/sneha-portrait-512.webp` with `width`/`height` of 512, eager, `fetchpriority="high"`; a 256w `srcset` candidate is allowed.
  - The alt text is `profile.portraitAlt`.
  - It sits in a 6 px black frame on a grass-block plinth (grass → grass-dark → dirt-dark, 4 px black border).
- **Backdrop:** an inline SVG, `aria-hidden`, `shape-rendering="crispEdges"`, with sky, block clouds (snow), 2–3 stepped hill rows, a grass strip and a dirt band with pebbles. All colours are token `var()`s; there are no new hex values outside `tokens.css`.
- **New-tab pattern (shared, reused by Story 2.5):**
  - `Button` gains a `newTab` prop: `target="_blank" rel="noopener"`, an `aria-hidden` inline SVG icon (`currentColor`), and `<span class="sr-only">{ui.opensInNewTab}</span>`.
  - Add `ui.opensInNewTab` = "(opens in a new tab)" to the JSON and the strict schema, and add `.sr-only` to `base.css`.
  - Résumé on the Glance Card and the showcase use it.
- **Advance:**
  - ▶ Start is an `<a href="#track">` to the section after the card, so it works without JS.
  - A tiny inline `<script>` (no island, no IntersectionObserver): while `scrollY` is within the Glance Card, ArrowDown, Space or PageDown, and Enter only when `document.activeElement` is `body`, scroll to `#track`. The script skips any key with a modifier and any key while focus is in a text control.
  - Scrolling is native.
- **Landmarks:** `<main>` wraps the Glance Card and `#track`.

**Never:**
- No HUD, Character Card, `data-motion` script or motion animation (that's Stories 2.3–2.5).
- Don't touch `legacy/index.html` or `Base.astro`'s output for `/`.
- No `tools/images.py`, no new npm dependencies.
- Don't commit or push.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| No JS | JS disabled | The full card renders; Start jumps via the anchor; Résumé opens the PDF | N/A |
| Keys | ↓ / Space / PageDown at the top | Moves to `#track` | Not intercepted below the card, in inputs, or with modifiers |
| Enter | Focus on Start / Résumé | Native activation, no double handling | N/A |
| Word count | Card text | ≤30 words, labels ≤6 | The test names the count and the words |
| Fact audit | `dist/next/index.html` | Passes | N/A |

</frozen-after-approval>

## Code Map

- `src/pages/next.astro` -- add `<GlanceCard/>` first inside a `<main>`; the showcase becomes `<div id="track">` (drop its own `<main>`).
- `src/components/ui/Button.astro` -- add `newTab`; `<a>` branch only. Reuse for Start (grass, `href="#track"`) and Résumé (gold).
- `src/components/ui/Pill.astro` -- the `next` status already renders "→" via CSS with `ui.statusNext`.
- `src/content/profile.json` + `schemas.ts` (`proofTiles` L52) -- update the 3 labels; keep `value`/`quest`/`source`.
- `src/content/ui.json` + `uiSchema` (L179, strict) -- add `opensInNewTab`.
- `src/styles/tokens.css` -- has every needed token: `--type-display-*` (name, shadow included), `--color-inset/edge/dirt-dark/gold/muted/sky/snow/grass*`, `--space-*`. Add a token only if one is truly missing (hex lives only here).
- `src/styles/base.css` -- add `.sr-only`.
- `src/styles/tokens.test.ts` -- already fails on stray hex, unknown `var()` and dirt/stone text, so the new CSS must pass it.
- `tools/fact_audit.py` -- scans `/next` visible text + alt; the labels have no new numbers.
- `lighthouserc.json` -- `/` scores ~0.74 performance, so gate LCP only on `/next`.

## Tasks & Acceptance

**Execution:**
- [x] `src/content/schemas.ts`, `ui.json`, `profile.json` -- `opensInNewTab`; verbatim tile labels.
- [x] `src/styles/base.css` -- `.sr-only`.
- [x] `src/components/ui/Button.astro` -- `newTab` prop + icon + sr-only text.
- [x] `src/components/GlanceCard.astro` -- markup, scoped CSS, backdrop SVG, advance script.
- [x] `src/pages/next.astro` -- `<main>` = GlanceCard + `#track`; the showcase Résumé uses `newTab`.
- [x] `src/components/GlanceCard.test.ts` -- render with Astro's container API (or parse the built HTML): one `<h1>` = "Sneha Islam", exactly 2 buttons/links (Start → `#track`, Résumé → PDF with `target="_blank"` + sr-only text), 3 tiles verbatim, word count ≤30, labels ≤6, `img` width/height + not lazy.
- [x] `lighthouserc.json` -- `assertMatrix`: `/next` gets `largest-contentful-paint` ≤2000 ms (error); the other assertions stay unchanged for both URLs.

**Acceptance Criteria:**
- Given `npm run check; npm test; npm run build`, when run, then all pass.
- Given the full gate (README "CI quality gate"), when run, then all pass: the a11y score ≥0.9, the JS and total budgets, and the `/next` LCP is <2.0 s.
- Given Tab from the top of `/next`, when pressed, then focus goes Start → Résumé with the gold ring, and both are ≥44×44 px.
- Given 390×844 and 1280×800, when `/next` loads, then the full card is in the first viewport, with the tiles in one row on the phone.

## Implementation Notes

- The shared new-tab pattern is `src/components/ui/NewTabNotice.astro`. `Button`'s `newTab` takes the notice text (`newTab={ui.opensInNewTab}`), not a boolean, because `getEntry` doesn't work in Astro's container API under Vitest. Story 2.5 reuses it.
- 600–899 px stacks with a 240 px portrait (a builder's call; the spec only defined <600 and desktop). The text column sits on a `panel` block for AA contrast over the sky.
- The backdrop's dirt band and pebbles are SVG strokes: `tokens.test.ts` bans dirt in any `fill`, and that rule was left as is.
- The key advance moves focus to `#track` (`tabindex="-1"`, `preventScroll`) and never writes the URL (AD-6). `#track` has no focus ring because it's not a control.
- `check_dist.py` rule 4: `#glance[data-next]` names an existing id, exactly one `<h1>`, and the CSS defines `.sr-only`.
- Lighthouse: a `.*` entry carries the shared budgets; `/next` adds LCP ≤2000 ms (local: 1.82 s, perf 1.0, a11y 1.0).

## Spec Change Log

## Review Triage Log

| Layer | Finding | Verdict → route | Evidence |
|---|---|---|---|
| blind-hunter / edge-case-hunter | Key advance scrolls but leaves focus at the top; the next Tab jumps back to Start | medium → patch | Real: `#track` is not focusable and the script never moves focus. Fix: `tabindex="-1"` + `focus({preventScroll:true})`. The hash update part is rejected (AD-6: `router.ts` is the sole URL writer). |
| blind-hunter / edge-case-hunter | `assertMatrix` has no catch-all, so a future URL gets no assertions; the 4 budgets are duplicated per URL | medium → patch | Real: LHCI applies only matching entries. Fix: one `.*` entry with the shared budgets + a `/next` entry with LCP only (LHCI applies every matching entry). |
| verification-gap | Nothing checks that the built `/next` has the `#track` target, or exactly one `<h1>` page-wide | medium → patch | Pre-verified: renaming `id="track"` keeps CI green. Fix: a `check_dist.py` rule + a test. |
| verification-gap | Nothing checks that the shipped CSS defines `.sr-only` | low → patch | Pre-verified: deleting the rule shows "(opens in a new tab)" visibly with CI green. A direct `check_next_styles` rule. |
| blind-hunter | The sr-only text is glued to the label ("Résumé(opens in a new tab)"); `.sr-only` lacks `clip-path` | low → patch | Real: no whitespace between the slot, svg and span; inline spans add none to the accessible name. Direct fixes. |
| blind-hunter / verification-gap | Portrait `sizes` says 340px at 600–899 px, but the CSS renders 240px | low → patch | Real: wrong candidate width (extra bytes only). A one-line correction. |
| blind-hunter | The LCP gate is `error` with `numberOfRuns: 1`, so it may flake | maybe-false → defer (medium, unverified) | Measured 1.82 s; simulated throttling is near-deterministic for static output. Settled by watching CI LCP variance over several PRs. |
| blind-hunter | ↓/Space jump even when a link has focus or mid-card; untested SELECT/BUTTON/SUMMARY/Spacebar/defaultPrevented branches | false / low → reject | The jump while the card is in view is the frozen intent. The untested guards are low and rarely met. |
| blind-hunter | Résumé should say "(PDF)" | false → reject | The frozen intent and the epic name the button "Résumé". |
| blind-hunter | The tile labels read worse than before | false → reject | The epic's verbatim labels are the frozen intent; the fix would edit the spec. |
| blind-hunter | The tiles don't link to their quests | false → reject | The spec decided tiles are not links. |
| blind-hunter | Hand-written GlanceCard Props drift from the schema | false | `next.astro` passes the schema-typed `profile`/`ui`; a rename or optional field fails `astro check` there. |
| blind-hunter | The tests hard-code tile labels and values | false → reject | Verbatim copy is the AC; the literals guard against unapproved edits. |
| blind-hunter | The portrait path is hard-coded, not in content | low → reject | AD-2 covers copy, not asset paths; a new field adds surface. |
| blind-hunter / edge-case-hunter | Tile values overflow below ~360 px | low → reject | The supported minimum is 360 px (verified, no overflow); 320 px is out of scope. |
| edge-case-hunter | An empty or unknown `next` prop gives a dead Start link | false | The only caller passes `"track"` (default `track`); the page-level check (patch above) covers the real risk. |
| edge-case-hunter | `newTab` overwrites a caller's `rel`/`target` | low → reject | No caller passes either; the fix adds merge logic. |
| edge-case-hunter | `newTab=""` silently drops the notice | false | `ui.opensInNewTab` is a required schema `text`; no caller passes an empty string. |
| edge-case-hunter | The hard-coded `#glance` id breaks with two cards | false | One card per page by design. |
| edge-case-hunter | The showcase still has a second Résumé and a `<button>` ▶ Start | low → reject | The temporary Story 2.1 showcase; Story 2.3 replaces it. |

## Verification

**Commands (PowerShell):**
- `npm run check; npm test; npm run build` -- expected: exit 0
- the full gate from `_bmad-output/HANDOFF.md` §5 -- expected: all pass

**Manual checks:**
- `npm run preview` → `/next` at 390 px and 1280 px: the card fits; ↓/Space move to the showcase; JS off still works.
- **Before merge, Sneha:** run the 5-second test with 2 people ("Who is she? When is she available? Name one thing she built.") and fix anything they get wrong.
