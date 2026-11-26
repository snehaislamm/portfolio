# Epic 1 Context: Foundation: new engine, old site still live

<!-- Compiled from planning artifacts. Edit freely. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Replace the engine under the portfolio without changing what visitors see. The repo moves onto Astro + React + TypeScript with a CI quality gate and a Python fact audit, and every fact ends up in schema-validated JSON. Meanwhile `/` keeps serving today's single static `index.html`, frozen as `legacy/index.html`, until the Epic 3 cutover, so the live site never breaks. This is not a pixel-identical port of the legacy page into components. That would be rework, because the game UI (Epics 2–3) replaces it. Every story must leave the site shippable.

## Stories

- Story 1.1: Astro scaffold that still serves today's site
- Story 1.2: Every pull request runs the quality gate
- Story 1.3: The fact audit blocks invented facts
- Story 1.4: All content moves into schema-validated JSON

## Requirements & Constraints

- **Legacy page unchanged.** Copy the current root `index.html` byte-for-byte to `legacy/index.html`. The built `/` must have the same visible text as the legacy page (check this with a small comparison script). Figure tabs, repo filters and copy buttons must still work.
- **Game page is hidden until cutover.** The new page is built at `/next` with `<meta name="robots" content="noindex">` until Story 3.11.
- **Static only.** The site deploys to Vercel from `main` as static files. No server functions, database, runtime API calls, secrets or environment variables.
- **Privacy.**
  - The only analytics is cookie-less Vercel Web Analytics on the free plan.
  - No other trackers or third-party scripts.
  - Storage is limited to the motion preference (`localStorage`) and session progress (`sessionStorage`).
- **Budgets enforced from day one.**
  - Hard failures: Accessibility ≥0.9, total JS ≤100 KB gzip, first-load transfer ≤600 KB.
  - Warning only in CI: the Lighthouse Performance score, because shared runners are noisy.
  - Hard-gated later against the deployed preview, at cutover (3.11) and at release (9.3): Performance ≥0.9 and LCP <2.0 s.
- **Every claim is real.**
  - Every numeric token, Caption and Character Line must trace to `docs/content-inventory.md` or `legacy/index.html`.
  - Every Caption, Character Line, Proof Tile label and easter egg in the JSON needs a `source` field (e.g. `"inv §5.1"`). The audit fails if one is missing.
- **Banned content** (fails the audit):
  - teammate names. Use "4-person team" / "Group 11" instead. Names are not in the inventory, so the banned-name list needs input from Sneha.
  - "built", "tested" or "working device" in the capstone entry
  - planned course codes: PHYS 468, SYDE 572, ECE 457 (B/C), MTE 544, STAT 341
  - "Engineering Ambassador" anywhere on the game page. It exists only in the résumé PDF. The legacy page is exempt until cutover.
- **Content facts to encode.**
  - There are exactly 17 Quests: 4 work terms, 5 course projects and 8 repos. 16 are done and 1 is active (the capstone, `status: active`).
  - Ambassador is not a Quest, and there are no planned courses.
  - Availability is "8-month co-op · Jan–Aug 2027". Home is Toronto, ON.
  - The design is one view with no modes (D15): no Recruiter Mode and no on-page résumé sheet. The Résumé is the PDF only.
- **Git workflow.** Sneha does all commits, pushes and PRs. Each story ends by listing her commit/push/PR commands, never with an agent commit.
- **Definition of Done for every story.**
  - `npm run build` passes locally.
  - CI passes.
  - The Vercel Preview has been checked.

## Technical Decisions

- **Stack** (pin these):
  - Astro 7.4.x (minimal template, repo root)
  - @astrojs/react 7.1.x
  - React / React DOM 19.3.x
  - TypeScript **6.0.3**, not 7, because of the `@astrojs/check` 0.9.x peer dependency
  - npm 11, with `package.json` `"engines": {"node": "26.x"}`
  - Vitest 5.1.x, @lhci/cli 0.16.x, linkinator 8.1.x, @vercel/analytics 2.0.x
  - Python ≥3.12, **stdlib only**
  - Vercel Framework Preset = **Astro**. This is a one-time dashboard step for Sneha, so document it.
- **Serving the legacy page from Astro.** `src/pages/index.astro` contains the legacy markup.
  - Its `<style>` uses `is:global`, and every inline `<script>` uses `is:inline`, so Astro neither scopes nor bundles them.
  - `Sneha_Islam_Resume.pdf` and `assets/character/*` move to `public/` and keep the same URLs (`/Sneha_Islam_Resume.pdf`, `/assets/character/...`).
  - Everything served as-is lives in `public/`.
- **Analytics.** The legacy page has a hand-written `<script defer src="/_vercel/insights/script.js">`. Replace it with `<Analytics />` from `@vercel/analytics/astro`, placed **only** in `src/layouts/Base.astro`.
- **`.gitignore`.** Add `node_modules/`, `dist/` and `.astro/`. Keep the `.claude/` and `_bmad/` entries.
- **CI** (`.github/workflows/ci.yml`, runs on every PR to `main`):
  1. `npm ci`
  2. `astro check`
  3. `vitest run`
  4. `astro build`
  5. `python tools/fact_audit.py` (added in 1.3)
  6. `linkinator dist` (internal links plus the PDF)
  7. `lhci autorun` against static `dist/`, for both `/` and `/next`
  - `lighthouserc.json` holds the budgets and assertions.
  - There must be at least one real Vitest test, so the test step is never empty.
  - Failures must be readable.
  - Branch protection on `main` requires the `ci` check and a PR. Document this as a one-time step for Sneha.
- **Fact audit** (`tools/fact_audit.py`):
  - **Inputs:** every `src/content/*.json` that exists (none existing is a pass), plus the visible text of `dist/index.html` and `dist/next/index.html`.
  - **Visible text means:** text nodes, `alt`, `aria-label`, `<title>` and `<desc>`. It excludes `<script>`, `<style>` and other attributes.
  - **Failure output:** exit non-zero and print each offending string with its file and context.
  - **Allow-list:** `tools/fact_audit_allow.txt` holds approved non-fact strings such as UI chrome, each with a `#` comment.
  - **Tests:** `tools/test_fact_audit.py` (`python -m unittest`) must prove that an invented number fails, a banned name fails, a real inventory number passes, and an allow-listed string passes.
- **Content model** (`src/content/*.json`, zod schemas in `src/content.config.ts`):
  - The build fails with a clear message on any schema error.
  - Components never hard-code copy. UI chrome strings live only in `ui.json`.
  - Collections:
    - `profile`: Glance Card, Character Card, interests, contact, availability and Proof Tiles
    - `stations`: the 4 Stations and their Character Lines
    - `quests`
    - `coursework`, `skills`, `path`, `early-work`, `achievements`, `ui`
  - A Quest has these fields:
    - `station`, `slug`, `kind`, `status` (`done|active|next`), `side`
    - `title`, `shortTitle`, `org`
    - `dates {sort: "YYYY-MM", display}`
    - `bullets[]`, `metrics[0..3] {value, label, qualifier?}`, `captions[]`, `chips[]`, `links[]`, `diagram? {title, alt}`
- **Numbers** are stored as display strings exactly as they appear in the source (`"1,200+"`, `"<300 ms"`, `"≈8.2 mAh"`). Qualifiers ("simulated", "estimate", "projected", "fictional scenario") are kept. Code never re-formats numbers.
- **Slugs:**
  - Station slugs are exactly `ai|power|compiler|cleanroom`.
  - Screen slugs are `character|speedrun|dock|quantum`.
  - Item slugs are kebab-case and unique per Station.
  - The ID is `<station>/<item>` (e.g. `ai/communitech`, `power/battery-wc`, `cleanroom/capstone`). It is both the DOM `id` and the URL hash.
  - A Vitest test asserts slugs are unique and kebab-case.
- **File naming:** Astro components `PascalCase.astro`, islands `PascalCase.tsx`, game modules `camelCase.ts`, content `kebab-case.json`, tests `src/game/*.test.ts` and `tools/test_*.py`.
- **Seeding copy.** Short titles and Captions are seeded from the per-card table in the UX experience spec (EXPERIENCE.md §5). Each one carries a `source` field.

## Cross-Story Dependencies

- **1.1 → all.** It creates `legacy/index.html` (the audit reference), the Astro build that CI and the audit run on, and `Base.astro` (analytics).
- **1.2 → 1.3.** Story 1.3 adds the fact-audit step to the existing `ci.yml`, after `astro build`, and it must pass on the current site.
- **1.3 → 1.4.** The audit must already handle the JSON content and enforce `source` fields before Story 1.4 adds the JSON. Story 1.4 must pass the audit.
- **1.4 → later epics.** Epics 2–3 build every component from these collections.
- **Cutover.** Story 3.11 removes `noindex` and makes `/` serve The Fab Line. Until then `/` stays the legacy page, and Lighthouse and the audit cover both `/` and `/next`.
