---
title: 'Story 2.3 · Character Card'
type: 'feature'
created: '2026-11-27'
status: 'done'
baseline_commit: '216705d3be7c29728c71c13a01f2506378511bf5'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-2-context.md'
  - '{project-root}/_bmad-output/implementation-artifacts/spec-2-2-glance-card.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** After the Glance Card, a recruiter has no quick way to judge role fit: degree, home, certifications, interests and courses. The legacy About paragraphs are gone (D15).

**Approach:** Add a static Character Card as the second screen on `/next` (`<section id="character">`), the target of ▶ Start and the key advance. It shows label/value rows, the 4 interests with their legacy icons, and a native `<details>` "Training ▸ 6 courses" list with topic chips. Zero JS.

## Boundaries & Constraints

**Always:**
- **Content (AC, FR3):**
  - the 256 px portrait in a black square frame
  - **Class** Nano-Engineer
  - **School** "University of Waterloo · BASc Nanotechnology Eng. · Nanoelectronics · 3B (Fall 2026)", composed from `profile.character`; set `degree` to "BASc Nanotechnology Eng." to match the AC
  - **Home** Toronto, ON
  - **Next Quest** with a `Pill status="next"` + "8-month co-op · Jan–Aug 2027"
  - **Equipment** AZ-900 and AI-900 as badges, each an `<abbr title>` with the certification name from `profile.certifications`
  - **Interests**: the 4 titles with icons; titles only, not the `line` sentences
- **Training (FR4, D8):**
  - a native `<details>`, closed by default
  - `<summary>` reads "Training ▸ {n} courses", with n computed from `coursework` (6)
  - when open, each course shows its code, title and topic chips (`Chip`)
  - only `status: completed` courses (the schema already enforces this)
- **Copy:** labels come from new `ui.json` keys (strict schema): `charClass` "Class", `charSchool` "School", `charHome` "Home", `charNextQuest` "Next Quest", `charEquipment` "Equipment", `charInterests` "Interests", `training` "Training", `courses` "courses". The heading uses `stations.json` `character.title` ("Character Card") as an `<h2>`.
- **Word budget (UX-DR19, EXPERIENCE L80):** visible values ≤35 words, with labels and the collapsed Training content excluded. Use the same word rule as Story 2.2 (a token containing a letter), enforced by a test.
- **Icons:**
  - Port the 4 legacy SVGs (`legacy/index.html:487-522`, viewBox 0 0 48 48, stroke 1.6) into `src/components/icons/InterestIcon.astro`, keyed by `icon`.
  - Colours: atom = sky, film-stack = amethyst, node-graph = lava, line-chart = gold, via `currentColor` set from token CSS. There are no hex values outside `tokens.css`.
  - Icons are `aria-hidden`, and the title is the visible text.
- **Portrait:** `/assets/character/sneha-portrait-256.webp`, width/height 256, `loading="lazy"`, `alt=""` (decorative, since the Glance Card already describes it).
- **Section:**
  - `min-height: 100svh` and the Block Biome panel look: `panel`, 4 px `edge` border, drop shadow.
  - Desktop (≥600 px): portrait left, `<dl>` rows right, then the Interests row and Training below.
  - <600 px: everything stacks.
- **`/next` wiring:** `<GlanceCard next="character">`; the card follows the Glance Card inside `<main>`; the Story 2.1 showcase stays below it.

**Never:**
- No About paragraphs, no stats, levels or scores, no Character Line (none exists for this screen).
- No planned courses, no JS, no HUD or motion.
- Don't touch `legacy/` or `/`.
- Don't commit or push.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Training closed | First render, no JS | Summary "Training ▸ 6 courses"; no course content visible | N/A |
| Training open | Click / Enter / Space on the summary | All 6 courses with chips; no planned codes | N/A |
| Word budget | Card visible values | ≤35 words, labels and Training excluded | The test names the count and the words |
| Start / key advance | ▶ Start or ↓ on the Glance Card | Lands on `#character` | `check_dist` rule 4 fails if the id is missing |
| Fact audit | `dist/next/index.html` | Passes (2026, 900, 6 all trace) | N/A |

</frozen-after-approval>

## Code Map

- `src/components/GlanceCard.astro` -- the pattern to mirror: props-in (`profile`, `ui`), scoped CSS with tokens only, container-API test. Its `next` prop is set by the page.
- `src/pages/next.astro` -- add `<CharacterCard …/>` after `<GlanceCard next="character">`; it also loads `coursework` (`getCollection`) and `stations` (`character` entry).
- `src/content/profile.json` -- `character`, `certifications`, `interests` (L19–57); `degree` becomes "BASc Nanotechnology Eng.".
- `src/content/coursework.json` + `courseSchema` (schemas.ts ~L133) -- the 6 courses with topics.
- `src/content/stations.json` L2–6 -- `{ id: "character", title: "Character Card" }`.
- `src/content/ui.json` + `uiSchema` (strict) -- the new label keys.
- `src/components/ui/Pill.astro`, `Chip.astro` -- reuse.
- `legacy/index.html:487-522` -- the icon source (read only); CSS L111–115 (42×42).
- `src/styles/tokens.css` -- `--color-sky/amethyst/lava/gold`, `--type-label-*`, `--space-*`; `tokens.test.ts` enforces no hex, known `var()`s, no dirt/stone text.
- `tools/check_dist.py` rule 4 -- already verifies that `data-next` names an existing id.

## Tasks & Acceptance

**Execution:**
- [x] `src/content/schemas.ts`, `ui.json`, `profile.json` -- the label keys; degree text.
- [x] `src/components/icons/InterestIcon.astro` -- the 4 ported SVGs, `currentColor`, `aria-hidden`.
- [x] `src/components/CharacterCard.astro` -- markup + scoped CSS per the Boundaries.
- [x] `src/pages/next.astro` -- wire the card, `next="character"`.
- [x] `src/components/CharacterCard.test.ts` -- container render:
  - one `<h2>` "Character Card"
  - every AC value present
  - 2 `<abbr>` badges with titles
  - 4 interests, each with an aria-hidden svg
  - `<details>` closed, with the summary "Training ▸ 6 courses"
  - all 6 codes inside the details and no others
  - values ≤35 words
  - the img is 256, lazy, `alt=""`

**Acceptance Criteria:**
- Given `npm run check; npm test; npm run build` and the full gate (HANDOFF §5), when run, then all pass (a11y ≥0.9, budgets, `/next` LCP <2 s).
- Given `/next` at 390 px and 1280 px, when scrolled to the card, then nothing overflows horizontally and the Training summary is a ≥44 px tall, keyboard-focusable control with the gold ring.

## Implementation Notes

- The panel look sits on an inner `.char__panel` (max-width = content max); the `<section id="character">` itself carries `min-height: 100svh` and centres it.
- Interests are a second `<dl>` row (label "Interests") under the portrait + rows block; Training is below that. Desktop rows are a 9rem label column + value column.
- Interests are one column under 600 px: two columns split "Nanoelectronics" mid-word at 360–390 px.
- Courses come from `getCollection('coursework')`, whose order is not file order: `next.astro` sorts by group (devices, physics, materials, systems), then by code, so NE 318 precedes NE 333.
- The summary hides the native disclosure marker (it carries its own ▸). `crossListed` (CHEM 356) is not shown.
- The portrait is 192 px wide under 600 px, 256 px from 600 px (attributes stay 256×256).
- Gate (local): check/vitest (193)/build, Python tests, legacy compare, check_dist, fact_audit, linkinator, lhci all pass. `/next`: perf 1.0, a11y 1.0, LCP 1.89 s. `/` still warns perf 0.89 (pre-existing, warning only).
- Puppeteer check at 360/390/1280: no horizontal overflow (closed and open), summary 44 px tall, gold 3 px ring on focus, Enter/Space toggle it, ↓ on the Glance Card focuses `#character` at top 0, and ▶ Start's href is `#character`.

## Spec Change Log

## Review Triage Log

| Layer | Finding | Verdict → route | Evidence |
|---|---|---|---|
| all three | The course sort lives in `next.astro`, is untested, duplicates the group enum, and the test pins an order the page never renders (it shows NE 318 before NE 333) | medium → patch | Real: the test passes file order; the page sorts by group, then code; `GROUPS` repeats `courseSchema` group options (an unknown group would sort first). Fix: a `src/lib` helper using the schema enum, used by the page and the test. |
| verification-gap | Nothing pins that `/next` advances to `#character` (it could revert to `#track` with CI green) | medium → patch | Pre-verified: `check_next_page` accepts any existing id. Fix: assert `data-next="character"`, a `section#character` after `#glance`, before `#track`. |
| blind-hunter | Training looks the same open or closed (▸ is fixed text, marker hidden) | low → patch | Real: no `[open]` state style. A direct fix: wrap ▸ in an `aria-hidden` span and rotate it under `[open]`. |
| blind-hunter | The 256 px portrait has no 2× source (soft on HiDPI) | low → patch | Real: only the 256w file is served at 256 CSS px. A one-line `srcset`/`sizes` with the existing 512w file. |
| blind-hunter | Re-sorting overrides the author's file order (NE 333 before NE 318) | low → reject | The AC lists the set of courses; a deterministic group-then-code order is fine. Keeping file order needs a new `order` field. |
| all three | An equipment code without a certification renders an `<abbr>` with no title | low → reject | Unreachable today: two codes, both matched in `certifications`. The fix adds a schema refine (guard complexity). |
| blind-hunter | `<abbr title>` names are invisible on touch, keyboard and some screen readers | low → reject | The frozen intent chose `<abbr title>`; the visible code is the AC value; the fix would edit the spec. |
| blind-hunter / edge-case-hunter | "1 courses" singular; "0 courses" empty disclosure | false | Unreachable: the schema and content hold 6 completed courses. |
| blind-hunter | The degree was shortened in content for layout | false → reject | The frozen intent sets `degree` to the AC's "Eng." text; the card is the only consumer. |
| blind-hunter | Hand-written Props / icon union drift from the schemas | false | `next.astro` passes schema-typed data; a rename or new icon fails `astro check` there. |
| blind-hunter | Test helpers copied from `GlanceCard.test.ts` | low → reject | Maintenance only; extracting a shared util is a refactor beyond this story. |
| blind-hunter | A missing `stations` `character` entry crashes on `!` | false | A loud build failure is correct behaviour. |
| blind-hunter / edge-case-hunter | The `.char:focus` comment implies markup `tabindex` | false | The comment says the Glance Card's key advance focuses it, which is accurate (the script adds `tabindex="-1"`). |
| blind-hunter | The summary has no `:focus-visible` style | false | The global `:focus-visible` ring applies; verified at 44 px with the gold ring. |

## Verification

**Commands (PowerShell):**
- `npm run check; npm test; npm run build` -- expected: exit 0
- the full gate from `_bmad-output/HANDOFF.md` §5 -- expected: all pass

**Manual checks:**
- `npm run preview` → `/next`: ▶ Start lands on the card; Training opens and closes with mouse and keyboard.
