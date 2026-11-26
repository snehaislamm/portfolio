# Handoff: The Fab Line portfolio rebuild

**Written:** 2026-11-25, at the end of the first (very long) planning + Story 1.1 session.
**For:** the next Claude Code chat and Sneha.
**Start here:** read this file, then `_bmad-output/implementation-artifacts/sprint-status.yaml`.

---

## 1. What this project is

Sneha Islam's portfolio (`snehaislam.vercel.app`, repo `snehaislamm/portfolio`) is being rebuilt into **The Fab Line**: a short, scroll-driven, character-based game for **recruiters with 60 seconds**.
- **The game:** Sneha travels her work **from software back to silicon** through 4 Stations (biomes) and ends at a locked "Quantum Fab" door.
- **The first screen:** the **Glance Card**: name, role, availability, 3 proof numbers and a Résumé button.
- **Everything else:** scroll to see the evidence, or click **Inspect** for depth.

**Stack (decided, binding):**
- **Astro + React islands + TypeScript**, pre-rendered static HTML. The pinned versions are in the architecture spine.
- **Python build-time tools only:** the fact audit and the image pipeline. **No backend.**
- **Vercel** builds the site from `main`.

---

## 2. Where everything lives (all final unless noted)

| What | Path |
|---|---|
| **Fact source + all decisions D1–D15** | `docs/content-inventory.md` |
| Product brief | `_bmad-output/planning-artifacts/briefs/brief-portfolio-2026-11-25/brief.md` |
| PRD (+ addendum) | `_bmad-output/planning-artifacts/prds/prd-portfolio-2026-11-25/` |
| UX: look (Block Biome) / behaviour | `_bmad-output/planning-artifacts/ux-designs/ux-portfolio-2026-11-25/DESIGN.md`, `EXPERIENCE.md`, `wireframes/`, `mockups/key-screens.html` |
| Architecture spine (AD-1…AD-13) + explainer | `_bmad-output/planning-artifacts/architecture/architecture-portfolio-2026-11-25/` |
| **Epics & stories** (9 epics, 42 stories) | `_bmad-output/planning-artifacts/epics.md` |
| **Sprint tracking** | `_bmad-output/implementation-artifacts/sprint-status.yaml` |
| Epic 1 compiled context | `_bmad-output/implementation-artifacts/epic-1-context.md` |
| Story 1.1 spec (done) | `_bmad-output/implementation-artifacts/spec-1-1-astro-scaffold.md` |
| **Deferred work → Story 1.2** | `_bmad-output/implementation-artifacts/deferred-work.md` |
| Frozen original site | `legacy/index.html` (never edit) |
| Résumé PDF, character art | `public/Sneha_Islam_Resume.pdf`, `public/assets/character/*` |

---

## 3. Key decisions (the full list is in the content inventory)

- **No invented facts.** Every number and claim must trace to `docs/content-inventory.md`. A Python fact audit will enforce this from Story 1.3.
- **D3:** no capstone teammate names anywhere. Say "4-person team". The capstone is a **design proposal**: never "built" or "tested".
- **D4/D5:** available for an **8-month co-op, Jan–Aug 2027**. Home: **Toronto**.
- **D8:** planned courses removed.
- **D10:** Engineering Ambassador appears **only in the résumé PDF**, not on the page or in the game.
- **D12:** free, cookie-less Vercel Web Analytics, using the `<Analytics />` component in `Base.astro` only.
- **D13/D14:** **Block Biome** look (blocky, earthy, gold accent, one biome per Station). The Ghibli portrait is the face; a **pixel-art sprite** (Sneha draws it later) walks the Track.
- **D15:** **no Recruiter Mode.** One view: Glance Card → scroll → Inspect. The résumé is the PDF only. ▶ Start is kept.
- **Build order:** a **vertical slice**. Launch is the **Story 3.11 cutover**, after AI in Production is fully finished. The other three Stations launch with placeholder icons in 6 diagram spots.
- **Until the cutover:** `/` serves `legacy/index.html` untouched, and the game grows on the hidden `noindex` page `/next`.

---

## 4. How we work (Sneha's preferences)

- **Sneha does all git commits and pushes herself.** Never run `git commit` or `git push`. Leave changes in the working tree and give her the exact commands. She opens PRs on the GitHub website (the `gh` CLI isn't installed).
- **Work on a branch per story,** with a PR into `main`. Vercel previews every PR.
- Build stories with the **`bmad-build`** skill: say "build story X.Y". It plans a spec (checkpoint for approval), implements with a subagent, runs 3 reviewers, and presents. Sneha allowed subagents for builds.
- She prefers **fast paths** and short, plain explanations, and likes to be asked before big or irreversible choices.

---

## 5. Environment gotchas (Windows + VS Code)

- **`uv`** was installed via winget at `C:\Users\sneha\AppData\Local\Microsoft\WinGet\Packages\astral-sh.uv_Microsoft.Winget.Source_8wekyb3d8bbwe\uv.exe`. After a VS Code restart it should be on PATH as `uv`. If not, call it by that full path. BMAD skills (`bmad-build`, the config resolvers) need it.
- **BMAD config clash (fixed locally):** the `[modules.gds]` copies of `planning_artifacts`, `implementation_artifacts` and `project_knowledge` in `_bmad/config.toml` are **commented out**. They duplicated `[modules.bmm]` and made `bmad-build` halt with "ambiguous config value". A BMAD reinstall will restore the clash; comment them out again, or reinstall without Game Dev Studio.
- `_bmad/` and `.claude/` are **gitignored** (local agent tooling, not part of the site).
- In the Bash tool, **heredocs containing quotes can break.** Write scripts to a file in the scratchpad and run them instead.
- Node 26, npm 11 and Python 3.14 are installed. Run `npm ci` after cloning or switching branches.

---

## 6. Current status (end of this session)

- Planning: content inventory ✓, brief ✓, PRD ✓, UX ✓, architecture ✓, epics ✓, readiness gate **PASS** ✓.
- **Story 1.1 (Astro scaffold that still serves today's site) is implemented, reviewed and verified.**
  - The spec is `done`, and `sprint-status.yaml` shows `review`. That becomes `done` once the PR is merged.
  - **It is NOT committed yet.** Everything sits in the working tree on branch `story-1-1-astro-scaffold`. The page and asset moves are already staged.
  - The same commit also carries the readiness fixes (AD-10, AD-11, the explainer release plan), the sprint files, and this handoff.

---

## 7. Next steps (in order)

1. **Sneha commits and pushes Story 1.1:**
   ```powershell
   git add -A
   git commit -m "Story 1.1: Astro scaffold serving the legacy page"
   git push -u origin story-1-1-astro-scaffold
   ```
2. **Open the PR** on GitHub (`story-1-1-astro-scaffold` → `main`). On the **Vercel Preview**, check:
   - the page looks exactly like today's
   - **"Copy as text" and the email "Copy" button work** (an automated browser couldn't test the clipboard)
   - the **PDF ↗** link opens
   - if the Preview fails to build: Vercel → Settings → Build & Deployment → **Framework Preset = Astro**, then redeploy
3. **Merge.** Then mark Story 1.1 `done` in `sprint-status.yaml`: set `1-1-astro-scaffold-that-still-serves-today-s-site: done` (or run `bmad-sprint-planning` and ask for "sprint status").
4. **Start Story 1.2** in the new chat: `git checkout main; git pull; git checkout -b story-1-2-ci-gate`, then say **"build story 1.2"**.
   - **Include the 3 items in `deferred-work.md`:**
     - a build-output parity test (head styles, inline script and attributes match legacy)
     - a post-build analytics assertion (exactly one `<Analytics />` loader, no `window.va`)
     - unit tests for `legacy()`'s error paths
   - **AD-10:** Accessibility, JS ≤100 KB gzip and transfer ≤600 KB are **hard** CI failures. The Performance **score** is **warn-only** in CI.
5. **Open question for Story 1.3 (fact audit):** the audit must ban teammate names (D3), but the names are deliberately **not** in the repo. Suggested approach: store **hashes** of the names in the ban list (or have Sneha supply them locally), so no plaintext names are committed. Ask Sneha before implementing.

After Epic 1: Epic 2 (Block Biome tokens, Glance Card with a 5-second test, Character Card, motion setting, HUD, link previews), then Epic 3 through the **3.11 cutover** (launch).

---

## 8. How to start the next chat

Open a new Claude Code chat in this folder and say:

> Read `_bmad-output/HANDOFF.md`, then help me finish Story 1.1's PR checks and build story 1.2.
