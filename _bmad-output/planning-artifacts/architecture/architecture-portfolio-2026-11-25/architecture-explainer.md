# Architecture Explainer: why this stack, and how it ships

This is the human companion to [`ARCHITECTURE-SPINE.md`](ARCHITECTURE-SPINE.md). The spine holds the rules (AD-1…AD-13); this file holds the reasons, the folder tree, and the deploy and migration steps. If the two disagree, the spine wins.

## 1. The recommended stack: **Astro + React islands + TypeScript**, with Python build tools, on Vercel

| Decision | Recommendation | Why | Trade-off accepted |
|---|---|---|---|
| **Framework** | **Astro 7.4** with **React 19** islands | Astro ships **zero JavaScript by default**. The whole page (every fact, card and résumé line) is plain HTML at build time, so recruiters on slow phones, screen readers and link previews all get the full content (PRD FR-27, NFR-9). React is loaded **only** for the interactive game parts. You keep React + TypeScript, as decided in D9. | One more concept to learn ("islands"). Two syntaxes: `.astro` for static parts and `.tsx` for React parts. |
| *Rejected:* Vite + React SPA + custom prerender | — | It would ship all of React for content that never changes, and needs a hand-written prerender step to satisfy "content in real HTML". More code, a bigger bundle, worse LCP. | — |
| *Rejected:* plain HTML/JS or Svelte (step-06 options) | — | Simplest, but it contradicts your D9 choice of React/TypeScript, which is also the stack your résumé headline sells. | — |
| *Rejected:* canvas or a game engine | — | Canvas text isn't crawlable or accessible, and engines blow the JS budget. The UX (DOM cards, SVG diagrams, CSS motion) doesn't need one. | — |
| **Rendering** | DOM + inline SVG + CSS animation | Accessible, crawlable, sharp at any zoom, and animatable with CSS that respects reduced motion (AD-7). | Fancy particle effects are off the table, which suits the blocky style anyway. |
| **Content model** | JSON files in `src/content/`, validated by **zod schemas** (Astro content collections) | **One source of truth** (FR-31). Game Mode, Recruiter Mode and the Python fact audit all read the same files. Schemas catch a missing metric or a typo'd slug at build time, before deploy. | JSON is a little verbose to edit by hand; schemas give clear error messages in return. |
| **Routing** | One page; hash deep links `#ai/communitech` | The PRD's format (FR-28). It works **without JS** too, because each card's HTML `id` *is* `ai/communitech`. | No separate URL per project page, which isn't needed for a 60-second visit. |
| **State** | One **nanostores** store (`src/game/state.ts`), tiny (<1 KB) | Islands are separate React roots; a shared store is Astro's recommended way to let the HUD, Quest Log and toasts agree on "what's been visited". | Progress lasts for the session only (PRD FR-7). Preferences (mode, motion) are remembered in `localStorage`. |
| **Mode switching** | `data-mode` / `data-motion` attributes on `<html>`, set before paint | One markup tree for both modes means they can't drift apart (AD-4), and there's no flash of the wrong mode. | Game-only elements need care in CSS. |
| **Styling** | Plain CSS with custom properties from DESIGN.md (`tokens.css`) | Zero runtime cost. Tokens enforce the AA-checked Block Biome palette (AD-8). | No Tailwind; you write CSS, which also keeps the JS budget clean. |
| **Assets** | SVG for icons and diagrams; WebP for the portrait; **PNG sprite sheet** for the pixel sprite | Matches the final UX. Pixel art needs PNG with `image-rendering: pixelated`. | — |
| **Python** | **Build-time only:** `fact_audit.py` (stdlib), `images.py` | As you chose: it guards "no invented facts" automatically, with no server. | Python must be installed in CI, which takes one line in the workflow. |
| **Analytics** | `@vercel/analytics` Astro component | Free, cookie-less, one line (D12). | — |
| **Testing** | Vitest (game logic) · Python audit · linkinator (broken links) · Lighthouse CI (perf/a11y ≥90, JS ≤100 KB gz, page ≤600 KB) | Covers every success metric in the PRD automatically on each pull request. | No browser end-to-end tests until the game exists (deferred). |
| **Deploy** | Vercel, Astro preset, Node 26 | Vercel auto-detects Astro, and Node 26 is its default build runtime (checked in Vercel's docs today). | — |

**Versions** were checked against the npm registry on 2026-11-25. TypeScript is pinned to **6.0.3**, not 7, because `@astrojs/check` doesn't support TS 7 yet.

## 2. Performance budget

| Budget | Limit | Enforced by |
|---|---|---|
| JavaScript (all islands, gzip) | ≤100 KB (PRD; stricter than step-06's 150 KB) | `lighthouserc.json` budget |
| First-load transfer | ≤600 KB (scene image is lazy) | Lighthouse budget |
| LCP (mobile) | <2.0 s | Lighthouse assertion |
| Layout shift | CLS ≈ 0: every image has width/height; fonts use `swap` with metric-matched fallbacks | Lighthouse assertion |
| Performance / Accessibility scores | ≥90 each | Lighthouse CI |

React 19 plus React DOM is the biggest single item, at roughly half the JS budget. If it doesn't fit, the fallback is Preact (deferred in the spine).

## 3. Folder tree

```text
portfolio/
├─ .github/workflows/ci.yml      ← the gate: check → test → build → audit → links → lighthouse
├─ legacy/index.html             ← frozen copy of today's site (audit reference)
├─ docs/content-inventory.md     ← fact source
├─ public/                       ← served as-is
│  ├─ Sneha_Islam_Resume.pdf
│  └─ assets/character/          ← portraits, avatar, sprite sheet
├─ src/
│  ├─ content.config.ts          ← schemas
│  ├─ content/                   ← profile.json, stations.json, quests.json, skills.json,
│  │                               path.json, achievements.json, resume.json, early-work.json, ui.json
│  ├─ styles/tokens.css          ← Block Biome tokens
│  ├─ layouts/Base.astro         ← <head>, mode script, analytics
│  ├─ pages/index.astro          ← the single page
│  ├─ components/                ← static sections + Level Card (+ diagrams/)
│  ├─ game/                      ← state.ts, router.ts, achievements.ts, storage.ts (+ *.test.ts)
│  └─ islands/                   ← Hud, TrackController, InspectDrawer, SkillTree, QuestLog, Toasts, Sprite
├─ tools/                        ← fact_audit.py, fact_audit_allow.txt, images.py, test_fact_audit.py
├─ lighthouserc.json
├─ astro.config.mjs · package.json · tsconfig.json
└─ .gitignore                    ← .claude/ _bmad/ node_modules/ dist/ .astro/
```

## 4. How a change ships

1. On your machine: `git checkout -b <feature>`, then `npm run dev` to preview at `localhost:4321` as you build.
2. Before pushing, optionally run `npm run check` (types + tests + build + audit) for a local copy of the gate.
3. `git push -u origin <feature>`, then open a PR on GitHub.
4. Two things happen automatically: **GitHub Actions** runs the gate, and **Vercel** posts a **Preview** link.
5. When the check is ✅ and the preview looks right, merge. Vercel deploys `main` to **snehaislam.vercel.app**.
6. **One-time setup:**
   - GitHub → Settings → Branches → add a rule for `main`: *Require status checks to pass* (select `ci`) and *Require a pull request before merging*.
   - Vercel → Project → Settings → Build & Deployment: Framework Preset **Astro**. It's usually auto-detected once `package.json` exists.

## 5. Migration milestones (the live site never breaks)

| Milestone | What ships | The site looks like |
|---|---|---|
| **M1 · Same site, new engine** | Astro project at the repo root; today's `index.html` ported into Astro components + content JSON (Recruiter Mode only); `legacy/index.html` saved; CI gate + fact audit + analytics component; branch protection on | **Identical to today** |
| **M2 · Block Biome look** | `tokens.css` from DESIGN.md; Recruiter Mode restyled; Title Screen; character assets via `images.py`; OG image | New colours and blocks, no game yet |
| **M3 · Game skeleton** | `data-mode` switching, HUD, Mini-map, TrackController, router + deep links, XP, Quest Log | Playable track, cards static |
| **M4 · Stations** | Level Cards with diagrams (one Station per PR: AI → Power → Compiler → Cleanroom), Inspect drawer, Skill Tree | Full content as a game |
| **M5 · Delight** | Achievements + toasts, sprite (when your art arrives), motion polish, Speedrun, Dock, Quantum Fab | The finished Fab Line |

Each milestone becomes an epic in the next step (epics & stories).
