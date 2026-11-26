---
title: 'Story 1.4 · All content moves into schema-validated JSON'
type: 'feature'
created: '2026-11-26'
status: 'done'
baseline_commit: 'cb2c410f6558f66dacaf62db6d3f7ace42b2e879'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Every fact still lives only in `legacy/index.html` and `docs/content-inventory.md`. The game (Epics 2–3), the fact audit and future edits need one validated source, and AD-2 forbids hard-coded copy in components.

**Approach:**
- Extract all content into 9 Astro content collections under `src/content/`, validated by zod in `src/content.config.ts`. A schema error fails `astro build` with a clear message.
- Seed card short titles, metrics and Captions from EXPERIENCE §5. Seed Character Lines from PRD addendum B. Seed Proof Tiles from PRD FR-1. Seed achievements from FR-22 and easter eggs from FR-14.
- Every Caption, Character Line, Proof Tile and easter egg carries a `source`.
- Nothing renders the collections yet, so `/` and `/next` stay unchanged.

**Decision (Sneha, 2026-11-26, after review; recorded as inventory D16):** 3A = Spring 2026 and 3B = Fall 2026. All four course projects (MIS capacitor, econ-toolkit, recycling, tensor-solver) display "Spring 2026" with sort `2026-05`, and so does the Path's 3A entry. The capstone and the Path's 3B entry use sort `2026-09` with display "Fall 2026". The only inventory edit is that D16 row.

## Boundaries & Constraints

**Always:**
- **Collections:** `profile`, `stations`, `quests`, `coursework`, `skills`, `path`, `early-work`, `achievements`, `ui`, one `<name>.json` each.
- **Quests:** exactly 17, matching the EXPERIENCE §5 rows and slugs.
  - 4 `work`, 5 `course`, 8 `repo`
  - 14 Main, 3 `side` (econ-toolkit, tensor-solver, recycling)
  - 16 `done`, and `cleanroom/capstone` is `active`
  - fields as in the story AC: `station`, `slug`, `kind`, `status`, `side`, `title`, `shortTitle`, `org`, `dates {sort: "YYYY-MM", display}`, `bullets[]`, `metrics[0..3] {value, label, qualifier?}`, `captions[]`, `chips[]`, `links[]`, `diagram?`
- **Slugs (AD-3):** the station is one of `ai|power|compiler|cleanroom`; item slugs are kebab-case and unique per station; references use `"<station>/<item>"`.
- **Shape for the audit:** Captions, Character Lines, Proof Tiles and easter eggs are `{ text|value…, source }` objects under the keys `captions`, `characterLine`, `proofTiles` and `easterEggs`. `source` cites the inventory section (e.g. `"inv §5.1"`, `"inv §7 vaclab"`).
- **Numbers:** display strings copied verbatim, qualifiers kept ("simulated", "estimate", "fictional scenario", "with a teammate").
- **Excluded:** teammate names (D3), the Ambassador role (D10), and planned courses (D8; coursework = the 6 completed).
- **Fact audit (`tools/fact_audit.py`):** treat values under the machine keys `sort`, `slug`, `station`, `kind`, `status`, `id`, `unlock`, `href` and `url` like `source`, so they're skipped for numbers but still checked for bans. Add tests for this. `python tools/fact_audit.py` passes on the new JSON.

**Never:**
- Invent or round a number.
- Edit `legacy/index.html`, the inventory, or the rendered pages.
- Build components that consume the content (that's Epic 2/3).
- Write a teammate name anywhere.
- Commit or push.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Valid content | All 9 JSON files | `astro build` OK; fact audit OK | N/A |
| Schema error | e.g. a quest with `status: "finished"` or a missing `slug` | Build fails, naming the collection, entry and field | Exit non-zero |
| Bad slug | `"Plug_Co"` or a duplicate slug in one station | Vitest fails, naming it | N/A |
| Wrong counts | ≠17 quests, ≠1 active, or an Ambassador/planned-course entry | Vitest fails | N/A |
| Machine field | `dates.sort: "2025-09"`, a link `href` with digits | Audit skips numbers there | Bans still apply |

</frozen-after-approval>

## Code Map

- `_bmad-output/planning-artifacts/ux-designs/ux-portfolio-2026-11-25/EXPERIENCE.md`:
  - **§5:** the 17 cards' short titles, metrics and Caption drafts (≤25 words with the title)
  - **§4:** word budgets
  - **§2:** screen slugs
- **PRD** (`prds/prd-portfolio-2026-11-25/`):
  - `prd.md` FR-1 (L106): the Glance Card, "Nano-Engineer", "from silicon to software", and the Proof Tiles 1,200+ / ±2% / 102.6 nm
  - FR-14 (L213): easter eggs
  - FR-22 (L277): the 5 achievements and their unlock targets
  - `addendum.md` B: Character Lines for 4 Stations + Speedrun + Quantum
- `docs/content-inventory.md`: the fact source.
  - §1–3: hero, about, metrics
  - §5.1–5.4: the 4 work terms (skip §5.5)
  - §6: course projects
  - §7: the 8 repos, plus "Earlier & collaborative" → `early-work`
  - §8: coursework (6 completed)
  - §9: skills, plus D11 résumé-only skills
  - §10: path
  - §12: contact
  - §18 / further decisions: D4/D5 availability and Toronto
- `tools/fact_audit.py`: the `json_units` walker. `numbers=key != "source"` is the one place to extend with the machine keys. Its tests are in `tools/test_fact_audit.py`.
- **Astro 7.4 content layer:** `defineCollection({ loader: file(...), schema })` in `src/content.config.ts`, with zod from `astro/zod`. The `file()` loader needs an array of entries with `id`, or an object keyed by id. Pick shapes that fit, and give single-object files (profile, ui) one keyed entry.

## Tasks & Acceptance

**Execution:**
- [x] `src/content.config.ts`: 9 collections with strict zod schemas (enums for `station`/`kind`/`status`; a regex for slug and `YYYY-MM`; `metrics` max 3; required `source` on the claim objects).
- [x] `src/content/*.json` (9 files): the extracted content per Boundaries. `ui.json` holds the chrome strings named in the UX docs ("Résumé", "▶ Start", "Inspect ▸", "Copy link", "Repo ↗", "Details", …).
- [x] `src/content/content.test.ts`: Vitest. Slugs are kebab-case and unique per station; 17 quests (4/5/8, 16 done + capstone active, 3 side); no "Ambassador", planned codes or `PHYS|SYDE 572|ECE 457|MTE 544|STAT 341`; every achievement `unlock` resolves to a quest or screen slug.
- [x] `tools/fact_audit.py`, `tools/test_fact_audit.py`: add the machine-key exemption and tests.
- [x] `vitest.config.ts`: include `src/**/*.test.ts` (already covered; confirm).

**Acceptance Criteria:**
- Given `npm run build`, when run, then it succeeds and the content sync reports all 9 collections.
- Given a temporary schema break (e.g. `status: "finished"`), when building, then it fails with a message naming the field, and passes again after reverting.
- Given the full Story 1.2/1.3 gate, when run, then everything passes, including `python tools/fact_audit.py` on the JSON.

## Implementation Notes

- **Schemas** live in `src/content/schemas.ts` (tested with `safeParse` in `schema.test.ts`); `content.config.ts` only wires them to the files. `ui` is a strict object of named keys.
- **Shapes:** `profile` and `ui` are one keyed entry each (`"profile"`, `"ui"`); the other 7 are arrays with an `id`. Quest ids are `"<station>/<slug>"` (schema-refined to match). `stations.json` holds the 4 Stations (`type: "station"`, each with its Character Line and an ordered `quests` list) and the 4 screens (`type: "screen"`: character, speedrun, dock, quantum; Speedrun and Quantum carry their Character Lines).
- **Order:** the collection store does not keep file order (entries come back sorted by id), so Track order is the exported `STATIONS`/`SCREENS` constants in `schemas.ts` plus each Station's `quests` list; the Quest Log sorts by `dates.sort`.
- **Dates (D16):** 3A = Spring 2026, 3B = Fall 2026. MIS, econ-toolkit, recycling and tensor-solver use `{sort: "2026-05", display: "Spring 2026"}`, as does the Path 3A item; the capstone and the Path 3B item sort `2026-09`.
- **Bullets** are the legacy page's full bullets (L2), verbatim. Communitech adds the résumé-only "5 of 6 silent sources" bullet (inv §11), which backs its third metric. Avanade's bullet drops the trailing "— yunus-AI ↗" link text; the link is in `links`.
- **Metric labels** follow the legacy stat-tile labels (EXPERIENCE §5 where shorter), trimmed to ≤6 words; capstone metrics carry `qualifier: "estimate"`, muse `"simulated"`, coa-forge `"fictional scenario"`, Communitech's 5/6 `"with a teammate"`.
- **Easter eggs** sit on their quests (`easterEggs`): Communitech (Mon 7 AM ET), modcell (10 ms E-stop), capstone (~$611 kit).
- **Diagrams:** `diagram {title, alt, reuse?}` per Main card, alt text written only from that card's facts; `reuse` names the legacy SVG (SVG-2…6).
- **Not extracted (no field in the AC):** work-term places (e.g. "Toronto, ON"), repo languages/categories/footer tags, the capstone stepper text, about paragraphs, the résumé sheet (D15: PDF only).
- **Vitest on Windows:** run `npm test` from PowerShell (`C:\...`). From Git Bash the cwd is `c:/...` (lowercase drive) and Vitest 5 loads itself twice ("failed to find the current suite"); this is pre-existing and also affects `legacy.test.ts`.

## Spec Change Log

## Review Triage Log

| Layer | Finding | Verdict → route | Evidence |
|---|---|---|---|
| blind-hunter | Course-project sort months/years are inferred (2025-05); capstone sort 2026-11 vs path 3B 2026-09 | medium → patch (decided) | Real; Sneha answered: 3A = Spring 2026 and 3B = Fall 2026 (inventory D16). Data fix only. |
| blind-hunter / edge-case-hunter | `status` is number-exempt, but `profile.availability.status` is visible text with numbers | medium → patch | Real hole: invented numbers in the availability line would skip the audit. Fix: rename the field (e.g. `line`) so the exemption only hits quest status. |
| blind-hunter / edge-case-hunter | Reference keys `quest`/`quests`/`reuse` and `email` aren't number-exempt | low → patch | Passes today only because digits like `32` and `3` happen to be in the corpus. Direct fix: add them to `NUMBER_EXEMPT_KEYS`. |
| verification-gap / blind-hunter / edge-case-hunter | `profile.proofTiles[].quest` is never resolved | medium → patch | Pre-verified: a typo like `ai/comunitech` passes build, tests and audit. |
| verification-gap | No test proves the zod schemas reject bad entries | medium → patch | Pre-verified: loosening an enum, `.refine` or `strictObject` keeps CI green. Fix: export the schemas from a plain module and add `safeParse` tests. |
| blind-hunter / edge-case-hunter | Uniqueness test skips `skills`, `early-work`, `interests`; the file loader drops entries missing an id and only warns on duplicates | medium → patch | Real (verified in `file.js`). Fix: cover every collection's ids and add count assertions (path 9, skills 6, early-work 3). |
| edge-case-hunter / blind-hunter | `ui` is `z.record`, so a missing or misspelled key doesn't fail the build | low → patch | Real; a direct fix is a `strictObject` listing the keys. |
| edge-case-hunter | An extra top-level key in `profile.json`/`ui.json` creates a second entry | low → patch | Test-only direct fix: assert the single key. |
| blind-hunter | Equal `sort` values have no tie-breaker | low → reject | Consumers (Epic 7) can tie-break by id deterministically. |
| blind-hunter | `open-source-sprint` typed `academic` | false | Inventory §10 marks it "Academic (cyan)". |
| blind-hunter | `diagram.reuse` ids / equipment vs certifications unchecked | low → reject | Diagram components arrive in Epic 3, which validates them (Story 6.2 test). |
| blind-hunter | Test re-declares constants; test ban regex differs from the audit's | low → reject | The test regex is a stricter superset; the schema-module patch moves the shared constants anyway. |
| blind-hunter | `url` exempt key unused; the test pins the exact exempt set | low → reject | Harmless. |
| blind-hunter | Facts repeated across files with different wording | low → reject | The surfaces need different wordings (EXPERIENCE §4 budgets). |
| blind-hunter | "Main Quest" in the capstone shortTitle | false | It is the EXPERIENCE §5 short title verbatim. |
| blind-hunter | NE 344 / tic-tac-toe text looks like filler | false | Verbatim from inventory §8/§7 (which itself notes the thin content). |
| blind-hunter | Links to collaborators' GitHub accounts | reject | Avanade/early-work collaborators, not the capstone teammates (D3); the links are on the live page today. |
| edge-case-hunter | Site-path regex allows spaces | low → reject | The only path is the résumé; unlikely. |

## Verification

**Commands:**
- `npm run check; npm test; npm run build` -- expected: exit 0
- `$env:FACT_AUDIT_BANNED_NAMES="Zzdummy Name"; python tools/fact_audit.py` -- expected: OK, 9 content files
- `python -m unittest discover -s tools -p "test_*.py"` -- expected: OK
