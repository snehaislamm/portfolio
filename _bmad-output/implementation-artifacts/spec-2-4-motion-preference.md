---
title: 'Story 2.4 · Motion preference and the game-state store'
type: 'feature'
created: '2026-11-27'
status: 'done'
baseline_commit: '9ee88ffa39f5dccb39a2d4a65a93034bd3bd6672'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The game has no single source of truth for "may things move?". Every later animation (biomes, sprite, toasts, count-ups) and the HUD Motion toggle (Story 2.5) need one switch that respects `prefers-reduced-motion`, survives reloads, and is set before first paint so nothing flashes.

**Approach:**
- A blocking inline head script on `/next` sets `<html data-motion="on|off">` before first paint.
- A framework-free nanostores store `src/game/state.ts` holds `motion`, changed only by `setMotion`.
- A storage adapter `src/game/storage.ts` handles `fabline:` keys and try/catch.
- A Vitest rule makes every future CSS animation or transition live under `[data-motion="on"]` (AD-7).
- No UI toggle yet (that's Story 2.5).

## Boundaries & Constraints

**Always:**
- **Resolution order:**
  1. `localStorage["fabline:motion"]` if it is exactly `"on"` or `"off"`
  2. otherwise `matchMedia('(prefers-reduced-motion: reduce)')`: `reduce` → `off`, else `on`
  3. any error → `off`
- The head script and `state.ts` must resolve identically; tests run both against the same cases.
- **Markup default is `data-motion="off"`**, so no-JS visitors get a still page. There is no `data-mode` and no `?mode=` (D15).
- **`/` stays byte-identical.**
  - `Base.astro` gains an optional prop (e.g. `htmlAttrs`) that `/` never passes. `Game.astro` passes `data-motion="off"` and injects the inline script into `<head>` before any stylesheet.
  - `check_dist.py` stays green, and a new `/next` rule asserts the attribute and the head script. `/` must have neither.
- **`state.ts` (AD-5):**
  - `export const $motion = atom<'on' | 'off'>(…)` initialised from the resolution above (SSR/no `window` → `'off'`).
  - `export function setMotion(v)` is the only writer. It sets the atom, persists via `storage.ts`, and mirrors `document.documentElement.dataset.motion`.
  - `src/game/` imports nothing from components, islands or React.
- **`storage.ts`:**
  - `readPref(key)` / `writePref(key, value)` add the `fabline:` prefix, use `localStorage`, and wrap every access in try/catch (blocked or throwing storage → read `null`, write is a silent no-op).
  - No `sessionStorage` yet (progress arrives in Epic 7).
- **Dependency:** add `nanostores` pinned `~1.5.5` (architecture: 1.5.x). Not `@nanostores/react` (Story 2.5).
- **AD-7 guard:** a Vitest scan of `src/**/*.{astro,css}` `<style>`/CSS. Every rule that declares `animation`, `animation-*`, `transition` or `transition-*`, and every `@keyframes` use, must have a selector containing `data-motion="on"` (scoped `:global(...)` forms are allowed). The test names the file and selector. Today's code passes as is (it has no animations).

**Never:**
- No Motion toggle UI, no HUD, no island, no `@nanostores/react`, no sound (D17 / Story 8.6).
- Don't touch `legacy/`; no change to `/` output.
- Don't commit or push.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| OS reduce, nothing stored | `matchMedia` reduce = true | `off` (head script + store) | N/A |
| OS no preference, nothing stored | reduce = false | `on` | N/A |
| Stored wins | stored `"on"` + OS reduce | `on` | N/A |
| Junk stored | stored `"maybe"` | falls back to the OS rule | N/A |
| Blocked storage | `getItem`/`setItem` throw | read → OS rule; `setMotion` updates atom + DOM, no throw | try/catch |
| No `matchMedia` / no window | SSR or old browser | `off` | N/A |
| Persistence | `setMotion('off')` then re-init | `off`, `fabline:motion` = `"off"`, `<html data-motion="off">` | N/A |
| No JS | built HTML | `<html … data-motion="off">` on `/next`; `/` unchanged | N/A |

</frozen-after-approval>

## Code Map

- `src/layouts/Base.astro` -- shared by `/` (legacy) and `/next`. Add an optional `htmlAttrs` prop spread onto `<html>`; the `/` output must not change.
- `src/layouts/Game.astro` -- wraps Base for `/next`; pass `data-motion="off"`; put the `is:inline` motion script first in the head slot.
- `src/pages/next.astro` -- no change expected.
- `src/components/GlanceCard.astro` / `.test.ts` -- the pattern for testing an inline script with fake `document`/`window` via `new Function`; reuse it for the head script.
- `tools/check_dist.py` (+ `test_check_dist.py`) -- `check_next_page` (rule 4): add the `data-motion="off"` + head-script presence check for `/next` and absence for `index.html`. The legacy parity rules compare body inline scripts and head links/styles, so keep `/` untouched.
- `package.json` / lockfile -- `nanostores ~1.5.5`.
- `vitest.config.ts` -- includes `src/**/*.test.ts`; new tests in `src/game/`.

## Tasks & Acceptance

**Execution:**
- [x] `package.json` + lockfile -- add `nanostores ~1.5.5`.
- [x] `src/game/storage.ts` -- prefixed, try/catch prefs adapter.
- [x] `src/game/state.ts` -- `$motion`, `resolveMotion()`, `setMotion()`.
- [x] `src/layouts/Base.astro`, `src/layouts/Game.astro` -- `htmlAttrs` prop; `data-motion="off"` + inline head script on `/next` only.
- [x] `src/game/state.test.ts`, `src/game/storage.test.ts` -- every matrix row, and parity between the head script and `resolveMotion` over the same cases.
- [x] `src/styles/motion.test.ts` (or similar) -- the AD-7 guard scan.
- [x] `tools/check_dist.py` + `tools/test_check_dist.py` -- the `/next` motion rule (pass + fail cases), `/` absence.

**Acceptance Criteria:**
- Given `npm run check; npm test; npm run build` and the full gate (HANDOFF §5), when run, then all pass and `/` parity holds.
- Given `/next` loaded with OS reduce-motion on, then off, when inspected before any interaction, then `<html data-motion>` is `off`, then `on`, set before first paint (the script precedes the CSS in `<head>`).

## Implementation Notes

- `/` stays byte-identical: `Base.astro` takes `htmlAttrs` (typed `{ 'data-motion'?: 'on' | 'off' }`), and only `Game.astro` passes it. The motion script is the first thing in `/next`'s head slot.
- `state.test.ts` pulls the real head script out of the rendered `Game.astro` and runs 13 cases through it and through `resolveMotion()`. The script-before-CSS order is enforced on the real `dist` by `check_dist.py` rule 5 (one classic inline script, before every stylesheet; absent on `/`).
- The AD-7 guard (`src/styles/motion.test.ts`) scans CSS only (`.css` + `.astro <style>`). It ignores matches inside `:not(...)` and covers prefixed `animation`/`transition` and `scroll-behavior: smooth`. JS motion must read `$motion`.
- Islands must read `$motion` only after mount: it is always `'off'` on the server.
- Lighthouse: `/next` perf 0.98, a11y 1.0, LCP 1.81 s. The perf warning is legacy `/` (0.68), which predates this story.

## Spec Change Log

## Review Triage Log

| Layer | Finding | Verdict → route | Evidence |
|---|---|---|---|
| all three | The AD-7 guard accepts `:not([data-motion="on"]) .a { transition… }` (motion that runs only when motion is off) | medium → patch | Real: `guarded()` only regex-matches `data-motion="on"` anywhere in the selector; no `:not` self-check. Fix: ignore matches inside `:not(...)` + a self-check. |
| blind-hunter / edge-case-hunter | `check_dist` rule 5 accepts an inline `type="module"` (deferred) or non-JS `type` script, and checks only the first of several motion scripts | medium → patch | Real: `motion_scripts()` rejects only `src`. A module script runs after first paint. Fix: allow only classic scripts (no/empty/`text/javascript` type), require exactly one, plus tests. |
| blind-hunter / edge-case-hunter | The `state.test.ts` script-before-CSS test passes vacuously (the container render emits no stylesheet; `if (at !== -1)` skips); the script is located as "first `<script>`" | low → patch | Real: no assertion when no stylesheet is present; `check_dist` rule 5 already enforces the real order. Fix: drop the vacuous order assertion (or assert a stylesheet exists), and select the script whose body contains `fabline:motion`. |
| blind-hunter / edge-case-hunter | The guard misses `-moz-`/`-o-`/`-ms-` prefixed properties and `scroll-behavior: smooth` | low → patch | Real: the property regex covers only unprefixed or `-webkit-`; smooth scroll is motion per UX §9 (Mini-map jump). A direct regex extension + self-checks. |
| blind-hunter | `htmlAttrs: Record<string,string>` lets a caller override `lang` | low → patch | Real (spread after `lang`). A direct fix: narrow the type to `{ 'data-motion'?: 'on' \| 'off' }`. |
| blind-hunter / edge-case-hunter | Islands that read `$motion` during SSR would hydrate differently (server `off`, client resolved); the guard's scope (CSS only) is undocumented | low → patch | Real future hazard for Story 2.5+. A direct fix: comments in `state.ts` (read `$motion` after mount) and in the `motion.test.ts` header (CSS only; JS motion must check `$motion`, AD-7). |
| blind-hunter / edge-case-hunter | An OS reduce-motion change mid-session isn't followed | low → reject | Rare (changing the OS setting with a tab open, nothing stored); the fix adds a listener. The Story 2.5 toggle gives an immediate control. |
| blind-hunter / edge-case-hunter | No cross-tab `storage` sync | low → reject | Rare; adds a listener for little user value. |
| edge-case-hunter | The atom is seeded independently of the head script's DOM value | low → reject | Diverges only if storage changes between head parse and module load; practically unreachable. |
| blind-hunter | The storage key is spelled in 3 places; `MOTION_KEY` means different things in TS and Python | false | The verification-gap review confirmed the parity tests fail on any key mismatch; the naming is cosmetic. |
| blind-hunter | `check_dist` unit tests use a stand-in script | low → reject | Rule 5 runs on the real `dist` in CI, so the real script is checked. |
| blind-hunter | The diff has no guarded motion and no toggle | false | By design: the toggle is Story 2.5, the first motion Epic 3/8 (spec "Never"). |
| edge-case-hunter | The guard's CSS tokenizer mishandles `/*` in strings, escaped quotes, `url(data:…;…)` | low → reject | No such CSS exists in `src/`; hardening the test parser adds complexity. |
| blind-hunter / edge-case-hunter | The guard skips inline `style=`, `.tsx`, `<animate>`, `Element.animate()` | low → reject | No such code exists yet; JS motion is governed by `$motion` (AD-7); documented in the header via the patch above. |
| blind-hunter / edge-case-hunter | The guard skips `view-transition-*` | low → reject | No view transitions are planned or used. |

## Verification

**Commands (PowerShell):**
- `npm run check; npm test; npm run build` -- expected: exit 0
- the full gate from `_bmad-output/HANDOFF.md` §5 -- expected: all pass

**Manual checks:**
- Chrome DevTools → Rendering → emulate `prefers-reduced-motion: reduce` → reload `/next` → `<html data-motion="off">`; set `localStorage['fabline:motion']='on'` → reload → `on`.
