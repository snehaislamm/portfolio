# Handoff: The Fab Line portfolio rebuild

**Updated:** 2026-11-26, at the end of the session that built Stories 1.1–2.1.
**For:** the next Claude Code chat and Sneha.
**Start here:** read this file, then `_bmad-output/implementation-artifacts/sprint-status.yaml`.

---

## 1. What this project is

Sneha Islam's portfolio (`snehaislam.vercel.app`, repo `snehaislamm/portfolio`) is being rebuilt into **The Fab Line**: a short, scroll-driven, character-based game for **recruiters with 60 seconds**.
- **The game:** Sneha travels her work **from software back to silicon** through 4 Stations (biomes) and ends at a locked "Quantum Fab" door.
- **The first screen:** the **Glance Card**: name, role, availability, 3 Proof Tiles and a Résumé button.
- **Everything else:** scroll to see the evidence, or click **Inspect** for depth.

**Stack (binding):** Astro 7.4 + React islands + TypeScript 6.0.3, static output; Python ≥3.12 build-time tools (stdlib only); Vercel deploys `main`. No backend.

---

## 2. Where everything lives

| What | Path |
|---|---|
| **Fact source + decisions D1–D16** | `docs/content-inventory.md` |
| Brief / PRD / UX / architecture | `_bmad-output/planning-artifacts/` (UX: `ux-designs/.../DESIGN.md`, `EXPERIENCE.md`; architecture spine AD-1…AD-13) |
| **Epics & stories** (9 epics, 42 stories) | `_bmad-output/planning-artifacts/epics.md` |
| **Sprint tracking** | `_bmad-output/implementation-artifacts/sprint-status.yaml` |
| Epic contexts | `_bmad-output/implementation-artifacts/epic-1-context.md`, `epic-2-context.md` |
| Story specs (all `done`) | `spec-1-1-…`, `spec-1-2-ci-quality-gate.md`, `spec-1-3-fact-audit.md`, `spec-1-4-content-json.md`, `spec-2-1-block-biome-tokens.md` |
| Deferred work | `_bmad-output/implementation-artifacts/deferred-work.md` (Story 1.1's three items were all done in 1.2) |
| Frozen original site | `legacy/index.html` (never edit) |
| **Content** (all copy) | `src/content/*.json` (9 collections), schemas in `src/content/schemas.ts`, wired in `src/content.config.ts` |
| **Design tokens + primitives** | `src/styles/tokens.css` (the only file in `src/` with hex colours), `fonts.css`, `base.css`; `src/components/ui/Button.astro`, `Pill.astro`, `Chip.astro`; layout `src/layouts/Game.astro` |
| Quality tools | `.github/workflows/ci.yml`, `lighthouserc.json`, `tools/check_dist.py`, `tools/compare_legacy_text.py`, `tools/fact_audit.py` (+ `tools/test_*.py`) |
| **Pixel-art sprite (first version)** | `docs/sprite/`: `sneha-sprite.png` (10 frames, 32×48, 1.4 KB), `sneha-sprite-preview.png` (×8), `make_sprite.py` (redraws it: `python docs/sprite/make_sprite.py [outdir]`). Not served yet; Epic 8 moves it into `public/`. |

---

## 3. Key decisions (full list in the inventory)

- **No invented facts.** Every number must trace to the inventory or the legacy page's *visible* text; the fact audit enforces it in CI.
- **D3:** no capstone teammate names anywhere: not in files, commits, memory or chat output. Say "4-person team". The capstone is a **design proposal** (never "built"/"tested").
- **D4/D5:** 8-month co-op, Jan–Aug 2027; home Toronto. **D8:** no planned courses. **D10:** Engineering Ambassador only in the résumé PDF.
- **D13/D14:** Block Biome look; Ghibli portrait = the face; pixel sprite walks the Track.
- **D15:** no Recruiter Mode. **D16 (new):** **3A = Spring 2026, 3B = Fall 2026**; all four course projects are dated Spring 2026 (the legacy page's "2025 · 3A" is out of date).
- **Diagrams:** keep the plan: AI in Production gets all its diagrams before launch; other Stations show placeholder icons until Epics 4–6 (Story 6.2 removes the last).
- **Build order:** vertical slice; launch = **Story 3.11 cutover**. Until then `/` serves `legacy/index.html` untouched and the game grows on the hidden `noindex` page `/next`.
- **Fonts:** `/next` uses self-hosted Fontsource fonts; `/` keeps the legacy Google Fonts links until the cutover (the parity check requires them).

---

## 4. How we work

- **Sneha does all git commits, pushes and PR merges herself.** Never run `git commit`/`git push`. Leave changes in the working tree and give her the commands. She opens PRs on github.com (no `gh` CLI) and merges with **"Create a merge commit"**.
- **Branch per story** (`story-X-Y-…`), PR into `main`. **Branch protection** on `main` requires a PR and the **`ci`** check.
- Build stories with **`bmad-build`** ("build story X.Y"): spec → checkpoint approval → implementation subagent → full gate → 3 reviewers (blind, edge-case, verification-gap) → patches → present. Sneha approves subagents for builds.
- Sneha prefers **fast paths**, short plain explanations, and being asked before big or irreversible choices.

---

## 5. Environment gotchas (Windows + VS Code)

- **`uv`** isn't on PATH until VS Code fully restarts. Full path: `C:\Users\sneha\AppData\Local\Microsoft\WinGet\Packages\astral-sh.uv_Microsoft.Winget.Source_8wekyb3d8bbwe\uv.exe`. `bmad-build` needs it.
- **BMAD config clash:** the `[modules.gds]` copies of `planning_artifacts`, `implementation_artifacts`, `project_knowledge` in `_bmad/config.toml` are commented out. A BMAD reinstall restores the clash.
- **Run `npm test` (Vitest) from PowerShell.** From Git Bash it fails ("failed to find the current suite") because of the lowercase `c:` path. CI on Linux is fine.
- **Bash heredocs with quotes or `\n` can break.** Write scripts to the scratchpad and run them.
- **Lighthouse locally** needs `$env:CHROME_PATH = 'C:\Program Files\Google\Chrome\Application\chrome.exe'`.
- **Teammate names** live only in the GitHub Actions secret `BANNED_NAMES`. Locally the name check is skipped with a warning unless `FACT_AUDIT_BANNED_NAMES` is set for one command, or a gitignored `tools/banned_names.local.txt` exists.
- Node 26, npm 11, Python 3.14. Run `npm ci` after switching branches if `package-lock.json` changed.

**The full local gate** (same as CI; see README "CI quality gate"):
```powershell
npm run check; npm test; npm run build
python -m unittest discover -s tools -p "test_*.py"
python tools/compare_legacy_text.py legacy/index.html dist/index.html
python tools/check_dist.py
python tools/fact_audit.py
npx linkinator . next/index.html --server-root dist --recurse --skip '^https?://(?!127\.0\.0\.1[:/])'
npx lhci autorun
```

---

## 6. Current status (end of this session)

- **Epic 1 — done** (PRs #5–#8): Astro scaffold serving legacy `/`; CI gate on every PR; fact audit; all content in 9 schema-validated JSON collections (17 Quests: 16 done + capstone active).
- **Epic 2 — in progress.** **Story 2.1 done** (PR #9): tokens, self-hosted fonts, buttons/pills/chips/focus ring, shown in a "Building blocks" section on `/next` (Lighthouse a11y 1.0, perf 0.99).
- `sprint-status.yaml` is up to date (2.1 `done`). This handoff, the sprint-status update and `docs/sprite/` are **uncommitted**: commit them with Story 2.2.
- Story 2.1 notes for later:
  - The done pill says "Completed" (`ui.statusCompleted`); DESIGN shows "✓ DONE". Sneha may change the word in `ui.json`.
  - The showcase Résumé button opens in the same tab. Story 2.5 (HUD) decides the real Résumé button's behaviour; if it opens a new tab, add a visible notice.
  - `/next` has no `<h1>` yet; the Glance Card (2.2) should provide it.
- Optional: **Epic 1 retrospective** (`bmad-retrospective`) was skipped.

---

## 7. Next steps

1. **Sneha:** create the 2.2 branch (uncommitted files carry over):
   ```powershell
   git checkout main
   git pull
   git checkout -b story-2-2-glance-card
   ```
2. **New chat:** say "Read `_bmad-output/HANDOFF.md`, then build story 2.2".
3. **Story 2.2 — Glance Card** is the largest story in the plan (11 acceptance clauses):
   - **Content:** portrait, name, class "Nano-Engineer", tagline "from silicon to software", availability, 3 Proof Tiles (**1,200+ · ±2% · 102.6 nm**), ▶ Start and Résumé, ≤30 visible words. All copy already exists in `src/content/profile.json` and `ui.json`.
   - **Test:** it includes a **5-second test with real people**, which takes calendar time.
4. **Before launch (3.11):** Performance ≥0.9 and LCP <2 s are hard-gated on the deployed preview. Legacy `/` scores ~0.74 today, so expect tuning on the new page.

After Epic 2: Epic 3 through the **3.11 cutover** (launch). With 1.1–2.1 done, **17 stories remain to launch** and 37 of 42 overall.
