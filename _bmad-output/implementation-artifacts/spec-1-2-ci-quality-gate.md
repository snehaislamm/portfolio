---
title: 'Story 1.2 · Every pull request runs the quality gate'
type: 'chore'
created: '2026-11-25'
status: 'done'
baseline_commit: 'ec03a36c5610508a6263c892de8cfaf424b33572'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Nothing checks a PR automatically. A type error, broken link, a11y/size regression, a lost legacy style or script, or a removed/duplicated `<Analytics />` would build silently and reach `main`.

**Approach:** Add a GitHub Actions `ci` job on every PR to `main`: `npm ci` → `astro check` → `vitest run` → `astro build` → post-build checks (legacy text + new build-output parity/analytics check) → `linkinator` → `lhci autorun` on static `dist/`. It also includes Story 1.1's three deferred items. Sneha turns on branch protection from documented steps.

## Boundaries & Constraints

**Always:**
- Pins: `vitest` ~5.1, `@lhci/cli` ~0.16, `linkinator` ~8.1 (devDependencies, lockfile updated). Python ≥3.12 stdlib only.
- Hard failures (AD-10): Accessibility ≥0.9, script transfer ≤100 KB (102400 B), total transfer ≤600 KB (614400 B), on both `/` and `/next`. Performance score ≥0.9 is **warn** only.
- Lighthouse reports stay private: `upload.target: filesystem`, uploaded as a GitHub Actions artifact (never `temporary-public-storage`).
- Linkinator checks internal links and the résumé PDF only (skip `^https?://`), crawling both `dist` and `dist/next/index.html`.
- The CI job id/name is `ci` (the branch-protection required check).

**Never:**
- Edit `legacy/index.html`, `src/lib/legacy.ts` behaviour, or anything visible on `/` or `/next`.
- Add the fact audit (Story 1.3) or content JSON (1.4).
- Commit, push, or change GitHub settings (Sneha does git and branch protection).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Clean PR | Current tree | Every step passes; `ci` green | N/A |
| Broken internal link | `href` to a missing file in dist | linkinator step fails, names the URL | Job red |
| Legacy head/script lost | dist missing the legacy `<style>`, a font `<link>`, the inline `<script>`, or a body href/src/alt/aria-label | `check_dist.py` exits 1 naming what differs | Job red |
| Analytics wrong | dist has 0 or ≥2 `<vercel-analytics>` / `/_astro` module loaders, or any `window.va` / `_vercel/insights` | `check_dist.py` exits 1 naming page + count | Job red |
| `legacy()` bad input | missing `<body>`/`</head>`, 0 or 2 analytics snippets, leftover `window.va` | throws the named error | Vitest asserts message |

</frozen-after-approval>

## Code Map

- `src/lib/legacy.ts` -- `legacy(html = legacyHtml)` is already injectable. Errors: `missing marker "<x>"`, `expected exactly one <what> in <head>, found N`, `a hand-written Vercel analytics snippet remains after stripping`. Test it; don't change it.
- `src/layouts/Base.astro` -- `<Analytics />` at the end of body renders `<vercel-analytics …></vercel-analytics><script type="module" src="/_astro/…js">`. Today that's the only module script on `/`.
- `tools/compare_legacy_text.py` -- existing visible-text check (exits 0 today). Reuse its HTML-parsing style and UTF-8 stdout reconfigure; it runs in CI as is.
- `legacy/index.html` -- head: font `<link>`s, one `<style>`, the Vercel snippet (stripped at build); body: markup + one inline `<script>`. It may have CRLF endings: normalize EOL when comparing.
- Measured locally (Lighthouse via LHCI 0.16.1, mobile): `/` a11y **0.90** (at threshold; frozen page), perf 0.71, script ~2 KB, total ~88 KB. `/next` a11y 0.94. The React `client.*.js` is emitted but not loaded by either page. LHCI static autodiscovery finds both pages.
- `package.json` -- add scripts `test` (`vitest run`); `.gitignore` -- add `.lighthouseci/`; `README.md` -- add the CI section.

## Tasks & Acceptance

**Execution:**
- [x] `package.json`, `package-lock.json` -- add the 3 pinned devDeps + `test` script.
- [x] `vitest.config.ts` -- use `getViteConfig` from `astro/config`, include `src/**/*.test.ts` -- so `?raw` imports resolve the Astro way.
- [x] `src/lib/legacy.test.ts` -- happy path on the real file (title set, no `window.va` in output) and each error row of the matrix on synthetic HTML -- the first real Vitest test + deferred item 3.
- [x] `tools/check_dist.py` -- stdlib; args default to `legacy/index.html dist`; parity (font links, byte-identical `<style>` text, inline body `<script>` text, multiset of body href/src/alt/aria-label) + analytics rules for `dist/index.html` and `dist/next/index.html`; exit 1 with a readable list -- deferred items 1–2.
- [x] `tools/test_check_dist.py` -- unittest: passes on a synthetic good pair; fails (with a message) on a dropped style, a dropped script, an altered href, 0 and 2 analytics loaders, and a `window.va` leftover.
- [x] `lighthouserc.json` -- `staticDistDir: ./dist`, assertions per Boundaries, filesystem upload to `.lighthouseci`.
- [x] `.github/workflows/ci.yml` -- `on: pull_request` (branches main) + `workflow_dispatch`; ubuntu-latest; setup-node `26.x` with npm cache; setup-python `3.x`; steps in Approach order, including `python -m unittest discover -s tools -p "test_*.py"`; upload `.lighthouseci` as an artifact `if: always()`.
- [x] `.gitignore`, `README.md` -- `.lighthouseci/`; CI section listing the gate, the local commands, and Sneha's one-time branch-protection steps (Settings → Branches → rule for `main`: require a PR + require status check `ci`).

**Acceptance Criteria:**
- Given `npm ci && npm run check && npm test && npm run build`, when run, then all exit 0.
- Given a fresh build, when `python tools/check_dist.py`, `python tools/compare_legacy_text.py legacy/index.html dist/index.html` and the unittest discovery run, then all exit 0.
- Given a fresh build, when `npx linkinator . next/index.html --server-root dist --recurse --skip '^https?://(?!127\.0\.0\.1[:/])'` and `npx lhci autorun` run, then both exit 0 and LHCI reports both pages.
- Given a scratch copy of dist with an injected broken internal link, when linkinator runs on it, then it exits non-zero naming the link.

## Implementation Notes

- **Linkinator command:** the planned form (`linkinator dist dist/next/index.html --skip "^https?://"`) scans 0 links. Linkinator serves the files on `http://127.0.0.1:<port>`, so that pattern skips the site itself, and passing two paths moves the server root above `dist`. CI and the README use `linkinator . next/index.html --server-root dist --recurse --skip '^https?://(?!127\.0\.0\.1[:/])'`. This keeps the Boundary's intent: only external URLs are skipped.
- **Extra `.gitignore` entry:** `__pycache__/`, because the Python tests create it.
- **Pins:** npm wrote `^0.16.1` for `@lhci/cli`; it was changed to `~0.16.1`.
- **Orchestrator verification (2026-11-25):**
  - check: 0 errors
  - Vitest: 8/8
  - build: OK
  - Python tests: 11/11
  - `compare_legacy_text`: OK (471 lines)
  - `check_dist`: OK
  - linkinator: 4 links OK; a planted `/nope.pdf` gives exit 1 with `[404] nope.pdf`
  - lhci autorun: exit 0 on both pages
  - The spec-form linkinator command was confirmed to scan 0 links.
- **Not run yet:** the GitHub-hosted `ci` run. It happens on Sneha's PR.

## Spec Change Log

## Review Triage Log

| Layer | Finding | Verdict → route | Evidence |
|---|---|---|---|
| blind-hunter | `is_analytics_loader` counts any `/_astro` module script, so the first island fails "found 2" and loses its `src` from parity | medium → patch | Real: any `type="module" src="/_astro/…"` matches. Epic 2 islands will add module scripts. Fix: count only the module script that directly follows a `<vercel-analytics>`. |
| edge-case-hunter | Same loader-identification rule (inlined/extra `/_astro` modules) | medium → patch (grouped) | Same root cause as the row above. |
| blind-hunter | LHCI relies on autodiscovery; nothing proves both pages are audited | low → patch | Real: no `url` list. `collect.js` rewrites the port on explicit URLs with `staticDistDir`, so listing both is a direct fix. |
| edge-case-hunter | >5 pages exceeds `maxAutodiscoverUrls`; budgets claim depends on discovery | low → patch (grouped) | Same root cause as the row above. |
| blind-hunter | Single Lighthouse run against a11y exactly at 0.9 is flaky | low → reject | The a11y score is deterministic for a fixed page and Lighthouse version (pinned via the lockfile). More runs don't change it. The frozen intent accepts the threshold risk as a cutover decision. |
| blind-hunter / verification-gap | No test for 0 `<vercel-analytics>` tags | medium → patch | Pre-verified by mutation: changing `tags != 1` to `tags > 1` still passes all 11 tests. |
| blind-hunter | No tests for lost src/alt/aria-label, a 2nd font link, or the `main()` exit-1/happy path | low → reject | The same generic `Counter` code path as the tested `href` case. Unlikely to diverge; extra tests add little. |
| blind-hunter | `legacy.test.ts` never tests a lone duplicated loader | low → reject | Same `removeOnce` function as the tested stub case; matrix "2 snippets" row is covered. |
| blind-hunter | Frozen Boundary's linkinator wording differs from the built command | low → reject (edits spec) | The fix is a spec edit. The intent (internal links only) is met, and the gap is logged in Implementation Notes. Surfaced to Sneha at presentation. |
| blind-hunter | sprint-status 1-2 `in-progress` vs spec `in-review`; 1-1 `done` unrecorded | false | Sprint sync happens at presentation. 1-1 `done` reflects PR #5, merged (`8f029bf` on `origin/main`). |
| blind-hunter | Diff omits `package-lock.json` / `epic-1-context.md`; can't verify `~` pins | false | Excluded deliberately (generated/planning files). The lockfile root devDependencies show `~0.16.1`, `~8.1.0`, `~5.1.2`. |
| blind-hunter | Gate commands duplicated across ci.yml, README and spec | low → reject | Real, but the fix adds npm scripts (new surface) for little everyday harm. |
| blind-hunter | No `push: main` trigger | low → reject | Branch protection forces PRs, and the spec chose `pull_request` + dispatch. Adding a trigger adds surface. |
| blind-hunter | `python-version: 3.x` doesn't encode ≥3.12; Node vs Vercel; action SHAs | false / low → reject | `3.x` resolves to the latest Python 3 (≥3.12). Vercel honours `engines.node` 26.x, the same as CI. SHA pinning is hardening beyond scope. |
| blind-hunter | Python tool tests run after build | low → reject | Ordering only; the tests take <1 s. |
| blind-hunter / edge-case-hunter | Head parity is one-way: gained or duplicated `<style>`/`<link>` on `/` pass | medium → patch | Real: `built_styles` is a set and extra built links are never reported. A future global CSS in `Base.astro` would restyle the frozen `/` silently. Fix: compare both ways with Counters. |
| blind-hunter | `main()` reconfigures stdout/stderr inside tests | low → reject | Harmless: UTF-8 reconfigure of the runner's streams. |
| edge-case-hunter | `check()` without `index.html` skips parity silently | false | `main()` always passes both `PAGES`. Unreachable. |
| edge-case-hunter | `python -OO` makes `__doc__` None | low → reject | Nobody runs this tool with `-OO`. |
| edge-case-hunter | Non-UTF-8 file raises a traceback | low → reject | A loud failure on bad input is acceptable behaviour. |
| edge-case-hunter | `test_main_reports_missing_dist` passes for the wrong reason if cwd lacks `legacy/` | low → patch | Real when tests run from another cwd. The fix is a direct correction (an absolute legacy path). |

## Design Notes

Post-build checks are Python, not Vitest, because `vitest run` comes *before* `astro build` in the gate. It also matches the existing `compare_legacy_text.py` and the Python-tools rule. The `/` a11y score sits exactly on 0.9 and the page is frozen. If a future Lighthouse bump drops it below, that becomes a cutover decision, not a reason to edit legacy.

## Verification

**Commands:**
- `npm ci; npm run check; npm test; npm run build` -- expected: exit 0
- `python tools/check_dist.py; python tools/compare_legacy_text.py legacy/index.html dist/index.html; python -m unittest discover -s tools -p "test_*.py"` -- expected: exit 0
- `npx linkinator . next/index.html --server-root dist --recurse --skip '^https?://(?!127\.0\.0\.1[:/])'` and `npx lhci autorun` (set `CHROME_PATH` locally) -- expected: exit 0, both pages listed

**Manual checks:**
- After the PR is pushed: the `ci` check shows green on GitHub. Sneha then applies branch protection per the README.
