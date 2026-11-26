# Epic 1 Context: Foundation: new engine, old site still live

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Move the portfolio onto Astro + React + TypeScript, add a CI quality gate and a Python fact audit, and put all content into schema-validated JSON. The live site must keep serving the untouched legacy page until the Epic 3 cutover, so production never breaks. A pixel-identical port is not a goal, because it would be rework. Epic 1 builds the base that every later epic relies on: one content source, a gate that blocks invented facts and perf/a11y regressions, and a `/next` page where the game gets built. The site must be shippable after every story.

## Stories

- Story 1.1: Astro scaffold that still serves today's site
- Story 1.2: Every pull request runs the quality gate
- Story 1.3: The fact audit blocks invented facts
- Story 1.4: All content moves into schema-validated JSON

## Requirements & Constraints

- **Static only:** Vercel deploys `main` as static files. No server functions, database, runtime API calls, secrets or env vars.
- **Legacy stays live:** `/` serves the old page unchanged, and its visible text must match the frozen `legacy/index.html`. Figure tabs, repo filters and copy buttons keep working. The résumé stays at `/Sneha_Islam_Resume.pdf` and character art at `/assets/character/*` (same URLs).
- **New page:** built at `/next` with `noindex` until the cutover.
- **Analytics:** no cookies or third-party trackers. The only analytics allowed is cookie-less Vercel Web Analytics.
- **Budgets (hard CI failures):** Accessibility ≥0.9, total JS ≤100 KB gzip, first-load transfer ≤600 KB. The Performance score is a CI warning only, because shared runners are noisy. It becomes a hard gate against the deployed preview at release.
- **Fact integrity:** every numeric token, Character Line and Caption must exist in `docs/content-inventory.md` or `legacy/index.html`. Every Caption, Character Line, Proof Tile label and easter egg in the content JSON needs a `source` field (e.g. `"inv §5.1"`). The audit fails if one is missing.
- **Banned content:**
  - teammate names
  - "built", "tested" or "working device" in the capstone entry
  - planned course codes (PHYS 468, SYDE 572, ECE 457, MTE 544, STAT 341)
  - "Engineering Ambassador" anywhere on the game page (the legacy page is exempt until the cutover)
- **Content shape:**
  - exactly 17 Quests: 4 work terms, 5 course projects and 8 repos; 16 done and 1 active (the capstone)
  - no Ambassador entry, no planned courses
  - numbers kept as display strings exactly as in the source, qualifiers included ("simulated", "estimate", "fictional scenario")
- **Definition of Done:** `npm run build` passes locally, CI passes, and the Vercel Preview has been checked. Each story ends with Sneha's commit, push and PR commands. **No agent commits.**

## Technical Decisions

- **Stack:**

  | Tool | Version |
  |---|---|
  | Astro | 7.4.x |
  | @astrojs/react | 7.1.x |
  | React / React DOM | 19.3.x |
  | TypeScript | 6.0.3 (not 7, because of the `@astrojs/check` peer) |
  | @astrojs/check | 0.9.x |
  | Node | 26.x (`engines.node`) |
  | npm | 11 |
  | Vitest | 5.1.x |
  | @lhci/cli | 0.16.x |
  | linkinator | 8.1.x |
  | @vercel/analytics | 2.0.x |
  | Python | ≥3.12, stdlib only |

  On Vercel, set the Framework Preset to Astro. This is a one-time manual step for Sneha.
- **Islands architecture:** Astro pre-renders all content as static HTML, and React islands only enhance it. No content may appear only after JS runs.
- **Legacy serving:** `src/pages/index.astro` wraps the legacy markup. `<style is:global>` and inline `<script is:inline>` stop Astro from scoping or bundling them.
- **Analytics:** `<Analytics />` from `@vercel/analytics/astro` appears only in `src/layouts/Base.astro`. It replaces the hand-written snippet.
- **`.gitignore`:** add `node_modules/`, `dist/` and `.astro/`. Keep `.claude/` and `_bmad/`.
- **CI (`.github/workflows/ci.yml`, every PR):** `npm ci` → `astro check` → `vitest run` → `astro build` → `python tools/fact_audit.py` → `linkinator dist` (internal links + résumé PDF) → `lhci autorun` on static `dist/` (both `/` and `/next`). Budgets live in `lighthouserc.json`. Branch protection on `main` requires the `ci` check and a PR. Sneha sets this up once from documented steps.
- **Fact audit (`tools/fact_audit.py`):**
  - **Scans:** every `src/content/*.json` that exists, plus the visible text of `dist/index.html` and `dist/next/index.html`.
  - **Visible text means:** text nodes, `alt`, `aria-label`, `<title>`, `<desc>`. Not `<script>`, `<style>` or other attributes.
  - **On failure:** exits non-zero and prints each offending string with its file and context.
  - **Allow-list:** `tools/fact_audit_allow.txt` holds UI-chrome strings, one `#` comment per entry.
  - **Tests:** `tools/test_fact_audit.py` (`python -m unittest`).
- **Content collections:**
  - **Location:** `src/content/*.json`, validated by zod schemas in `src/content.config.ts`. The build fails with a clear message on any schema error.
  - **Collections:** profile, stations, quests, coursework, skills, path, early-work, achievements, ui.
  - **No hard-coded copy:** UI chrome strings live only in `ui.json`, and components get content only through collections.
- **Quest fields:** `station`, `slug`, `kind`, `status` (`done|active|next`), `side`, `title`, `shortTitle`, `org`, `dates {sort: "YYYY-MM", display}`, `bullets[]`, `metrics[0..3] {value, label, qualifier?}`, `captions[]`, `chips[]`, `links[]`, `diagram?`.
- **Slugs:**
  - **Stations:** `ai|power|compiler|cleanroom`.
  - **Screens:** `character|speedrun|dock|quantum`.
  - **Items:** kebab-case and unique per Station.
  - **One identifier everywhere:** the DOM id, the URL hash and every cross-reference use `<station>/<item>` (e.g. `ai/communitech`, `cleanroom/capstone`).
- **Conventions:**
  - **File names:** Astro `PascalCase.astro`, islands `PascalCase.tsx`, game modules `camelCase.ts`, content `kebab-case.json`.
  - **Formatting:** never re-format numbers in code.
  - **Tests:** Vitest tests live in `src/game/*.test.ts`, Python tests in `tools/test_*.py`.

## Cross-Story Dependencies

- 1.1 comes first. It freezes `legacy/index.html`, which is the audit's reference, and produces the build the gate runs against.
- 1.2 creates `ci.yml` and a first real Vitest test. 1.3 then adds the fact-audit step after `astro build` and makes it required.
- 1.3 must pass when no content JSON exists yet. 1.4 then adds the JSON, which must pass the audit and the `source`-field rule. Its slug test (unique, kebab-case) runs under the Vitest step from 1.2.
- 1.4 seeds short titles and Captions from the UX spec's per-card info-design table. Later epics (the 17 Level Cards, achievements, Quest Log, deep links) rely on its schemas and slugs.
- The cutover that replaces the legacy `/` with the game page happens in Epic 3 (Story 3.11), not here.
