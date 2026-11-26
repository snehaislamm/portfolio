---
title: 'Story 1.1 · Astro scaffold that still serves today''s site'
type: 'chore'
created: '2026-11-25'
status: 'done'
baseline_commit: '0f49d732e6bb026ee08372d1ae57438f1d6f42d2'
route: 'dispatch'
review_loop_iteration: 0
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
  - '{project-root}/_bmad-output/planning-artifacts/architecture/architecture-portfolio-2026-11-25/ARCHITECTURE-SPINE.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** The portfolio is a single hand-written `index.html` with no build step. Every later story (CI gate, fact audit, content JSON, the game) needs the Astro + React + TypeScript project to exist first, without the live site changing.

**Approach:** Scaffold Astro at the repo root and freeze today's page as `legacy/index.html`. `/` renders that legacy file's own `<head>` styles and `<body>` verbatim inside a `Base.astro` layout, which adds the official Vercel `<Analytics />` in place of the hand-written snippet. A hidden `noindex` `/next` page is created for the game to grow on. Visitors see no difference.

## Boundaries & Constraints

**Always:**
- Pinned stack: `astro` ~7.4, `@astrojs/react` ~7.1, `react` + `react-dom` ~19.3, `typescript` 6.0.3 (not 7), `@astrojs/check` ~0.9, `@vercel/analytics` ~2.0; `"engines": {"node": "26.x"}`; npm with a committed `package-lock.json`.
- Static output only (no adapter, no server).
- `legacy/index.html` is a byte-for-byte copy of today's `index.html` and is never edited.
- `<Analytics />` appears only in `src/layouts/Base.astro` (AD-13).
- The PDF and character art keep their public URLs: `/Sneha_Islam_Resume.pdf`, `/assets/character/*`.

**Never:**
- Hand-port or re-type legacy markup (that's rework the epics dropped).
- Restyle or change any visible text, link or behaviour.
- Add game UI, content JSON, CI or tests (Stories 1.2–1.4).
- Commit or push (Sneha does git).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Visit `/` | Built site | Legacy page, identical visible text; figure tabs, repo filters, copy buttons and résumé copy work | N/A |
| Visit `/next` | Built site | Placeholder page with `<meta name="robots" content="noindex">`, Base layout, analytics | N/A |
| Analytics | Built `/` | Exactly one Vercel analytics loader (from `<Analytics />`); the legacy hand-written snippet is stripped | Build fails if both or neither are present |
| Legacy file changes shape | `legacy/index.html` missing `<head>`/`<body>` markers | — | Build throws a clear error naming the missing marker |

</frozen-after-approval>

## Code Map

- `index.html` -- today's live page (1,190 lines). Head: Google Fonts `<link>`s (L7–9), one `<style>` (L10–306), hand-written Vercel snippet (`window.va` stub L307–309 + `/_vercel/insights/script.js` L310). Body: markup + one inline `<script>` (L1138–1181). Becomes `legacy/index.html`; the root copy is removed.
- `Sneha_Islam_Resume.pdf`, `assets/character/*.webp` -- move to `public/` (same URLs).
- `_bmad-output/planning-artifacts/ux-designs/ux-portfolio-2026-11-25/mockups/{directions-1,key-screens}.html` -- reference `../../../../../assets/character/…`; repoint to `../../../../../public/assets/character/…`.
- `.gitignore` -- currently `.claude/` and `_bmad/` (first line has a UTF-8 BOM); add `node_modules/`, `dist/`, `.astro/`.
- `README.md` -- says "no build step"; update to the dev commands plus the Vercel note.

## Tasks & Acceptance

**Execution:**
- [x] `legacy/index.html` -- `git mv index.html legacy/index.html` (byte-identical) -- frozen reference for `/` and future audits
- [x] `public/Sneha_Islam_Resume.pdf`, `public/assets/character/*` -- `git mv` -- keep URLs stable
- [x] `package.json`, `package-lock.json`, `astro.config.mjs`, `tsconfig.json` -- pinned deps; scripts `dev`, `build`, `preview`, `check` (`astro check`); React integration enabled; tsconfig extends `astro/tsconfigs/strict` -- foundation
- [x] `vercel.json` -- `{"framework": "astro", "buildCommand": "npm run build", "outputDirectory": "dist"}` -- so Vercel switches from static to Astro without a manual dashboard change
- [x] `src/lib/legacy.ts` -- read `legacy/index.html` at build time; return `headInner` (fonts links + `<style>`, with the two Vercel snippet tags removed) and `bodyInner`; throw on missing markers -- one source, no re-typing
- [x] `src/layouts/Base.astro` -- `<html lang="en">`, charset/viewport, `title` prop, optional `head` slot, `<Analytics />`, body `<slot />`
- [x] `src/pages/index.astro` -- Base + legacy `<title>`; inject `headInner` into the head slot and `bodyInner` into the body with `set:html` (unprocessed, equivalent to `is:inline`/`is:global`)
- [x] `src/pages/next.astro` -- Base + `noindex` + one line "The Fab Line: work in progress."
- [x] `tools/compare_legacy_text.py` -- Python stdlib: extract visible text (skip `script`/`style`) from two HTML files; exit 1 with a diff if they differ
- [x] mockups, `.gitignore`, `README.md` -- per Code Map

**Acceptance Criteria:**
- Given `npm ci && npm run build`, when it runs, then it succeeds and produces `dist/index.html` and `dist/next/index.html`.
- Given `python tools/compare_legacy_text.py legacy/index.html dist/index.html`, when run, then it exits 0.
- Given `npm run preview`, when `/` is opened at 1280 px and 390 px, then figure tabs, repo filters, both copy buttons and the PDF link work exactly as on the live site.
- Given `dist/index.html`, when searched, then it contains no `window.va` stub and exactly one analytics script from `<Analytics />`.
- Given `npm run check`, when run, then 0 errors.

## Implementation Notes

- `src/lib/legacy.ts` imports `legacy/index.html?raw` (Vite raw import = build-time read). It also strips the legacy charset/viewport/`<title>` tags because `Base.astro` owns those; the title text is passed as the `title` prop. Each stripped tag must match exactly once or the build throws.
- `<Analytics />` sits at the end of `<body>` in `Base.astro`: its `<vercel-analytics>` custom element would end `<head>` early if placed there.
- `astro.config.mjs` sets `vite.build.assetsInlineLimit: 0` so the Analytics script ships as one external `/_astro/*.js` file and built HTML contains no inlined `window.va` code.
- Added `@types/react` / `@types/react-dom` ~19.3 as devDependencies for the React integration's TS types.

- Orchestrator verification (2026-11-25): build ✓ (2 pages), `astro check` 0 errors, visible text identical (471 lines), 0 `window.va`/insights refs in `dist/index.html`, 1 module script from `<Analytics />`, `/next` noindex ✓, legacy byte-identical ignoring EOL. Matrix error rows exercised with a scratch probe (not committed; tests belong to Story 1.2+): missing `<body>`/`</head>` throw named errors; absent stub (0) and duplicate loader (2) throw "expected exactly one".

## Spec Change Log

## Review Triage Log

| Layer | Finding | Verdict → route | Evidence |
|---|---|---|---|
| blind-hunter | compare_legacy_text.py ignores head/script/attributes | low → defer | Real: tool reads text nodes only. Grouped with VG-1/EC-6/EC-9; filed to Story 1.2 build-output test. |
| blind-hunter | parity check not in CI; Python prerequisite undocumented | low → patch (README) / reject (CI) | Python ≥3.12 now documented in README. CI is excluded by the frozen intent (Stories 1.2–1.4). |
| blind-hunter | nothing enforces legacy/index.html never edited | reject (out of scope) | Enforcement is CI/audit work the intent assigns to Stories 1.2–1.3. |
| blind-hunter | <html>/<body> attributes and pre-<head> content lost | false | legacy/index.html has `<html lang="en">` (= Base), bare `<head>`/`<body>`, only a doctype before `<head>`, and only `</html>` after `</body>`. The file is frozen, so nothing is lost. |
| blind-hunter | title decodes only 5 entities | false | The frozen title uses literal — and · plus `&amp;`, which is decoded. Built tab title is correct. |
| blind-hunter | strip regexes coupled to exact formatting | false | Loud build failure on an unexpected shape is the specified behaviour (matrix row 4), and the legacy file is frozen. |
| blind-hunter | .gitignore BOM breaks `.claude/` rule | false | `git check-ignore -v .claude/x` matches .gitignore:1, so the rule works. |
| blind-hunter | diff omits architecture/story files | false | Those are pre-existing planning edits and BMAD artifacts, not this story's code. |
| blind-hunter | no engines.npm/.nvmrc/engine-strict; TS exact pin | low → reject | Vercel honours engines.node. TS 6.0.3 exact is the spec's deliberate pin. Unlikely to bite; adding engine-strict adds behaviour. |
| blind-hunter | /next noindex is meta-only; analytics counts /next | low → reject | The meta tag is honoured by search engines; preview traffic is negligible. A header would add config for little gain. |
| blind-hunter | README Vercel fallback contradicts vercel.json | false | The README frames it as a fallback only if the Preview fails, which is consistent with vercel.json. |
| blind-hunter | assetsInlineLimit comment inaccurate/global effect | low → patch | Comment corrected; behaviour unchanged. |
| blind-hunter | mockups point at public/ source folder | false | Intended: mockups are opened from the repo, not served. |
| verification-gap | VG-1 compare tool can't see head styles, scripts, link targets | medium → defer | Pre-verified gap; tests are excluded by intent. Deferred to Story 1.2. |
| verification-gap | VG-2 analytics invariant checked by hand only | medium → defer | Pre-verified; grouped with EC-8. Deferred to Story 1.2 post-build assertion. |
| verification-gap | VG-3 legacy() error paths only probed, not committed | medium → defer | Pre-verified; orchestrator probe confirmed behaviour today. Unit tests deferred to Story 1.2. |
| verification-gap | empty assets/ directory left over | low → patch | Real and harmless; removed. |
| edge-case-hunter | EC-1 title entities beyond five | false | Same as the blind-hunter title finding: the frozen title decodes correctly. |
| edge-case-hunter | EC-2 attributes/trailing markup dropped | false | Same as the blind-hunter attributes finding: verified against the frozen file. |
| edge-case-hunter | EC-3 `</body>`/`</head>` inside a script truncates | false | The frozen file has exactly one `</body>` and one `</head>`. |
| edge-case-hunter | EC-4 UnicodeEncodeError on Windows redirected stderr | low → patch | Real on cp1252 redirection; fixed with UTF-8 reconfigure. |
| edge-case-hunter | EC-5 self-closing script/style miscounted | false | 0 self-closing script/style tags in either file. |
| edge-case-hunter | EC-6 pre whitespace / alt / aria-label not compared | low → defer | 0 `<pre>` in the file. Attribute text grouped with VG-1 into the Story 1.2 deferral. |
| edge-case-hunter | EC-7 content-inventory line refs point at moved index.html | medium → patch | Real: downstream Story 1.4 extraction would look for a missing root index.html. Inventory note added. |
| edge-case-hunter | EC-8 nothing asserts exactly one Analytics loader in dist | low → defer | Grouped with VG-2. |
| edge-case-hunter | EC-9 exit 0 taken as proof of no change | low → defer | Grouped with VG-1. |

## Design Notes

**Why `set:html` from the legacy file instead of pasting markup into `.astro`:** a pasted page would need `is:inline`/`is:global` on every tag. It would also break on any `{` in the markup (Astro treats braces as expressions) and would duplicate 1,190 lines. Reading `legacy/index.html` keeps one frozen source, guarantees identical output, and the epic's intent (an unprocessed legacy page) holds.

```astro
---
import Base from '../layouts/Base.astro';
import { legacy } from '../lib/legacy';
const { title, headInner, bodyInner } = legacy();
---
<Base title={title}><Fragment slot="head" set:html={headInner} /><Fragment set:html={bodyInner} /></Base>
```

## Verification

**Commands:**
- `npm ci && npm run build` -- expected: exit 0, `dist/index.html` + `dist/next/index.html`
- `npm run check` -- expected: 0 errors
- `python tools/compare_legacy_text.py legacy/index.html dist/index.html` -- expected: exit 0

**Manual checks:**
- `npm run preview` → `/`: tabs, filters, copy buttons and the PDF link work; `/next`: noindex placeholder.
- One-time (Sneha): if the Vercel Preview doesn't build, set Project → Settings → Build & Deployment → Framework Preset = Astro.
