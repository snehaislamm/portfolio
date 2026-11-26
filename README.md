# Sneha Islam — Portfolio

Personal portfolio: Nanotechnology Engineering (Nano-Electronics) at the University of Waterloo, with work in software, applied AI, embedded systems and device fabrication.

Built with [Astro](https://astro.build) + React + TypeScript as a fully static site. Until the cutover, `/` serves the frozen original page (`legacy/index.html`, never edited) and the new game page grows at the hidden `/next`.

## Development

Requires Node 26.x and npm 11. The scripts in `tools/` need Python ≥3.12 (standard library only).

```sh
npm ci            # install exact locked dependencies
npm run dev       # local dev server
npm run build     # static build into dist/
npm run preview   # serve dist/ locally
npm run check     # astro check (types + diagnostics)
python tools/compare_legacy_text.py legacy/index.html dist/index.html   # built / must match the legacy text
python tools/fact_audit.py   # after a build: no invented numbers, names, course codes or claims
```

Files served as-is (the résumé PDF, character art) live in `public/`.

## CI quality gate

Every pull request to `main` runs the `ci` job (`.github/workflows/ci.yml`). It fails on any of:

1. `npm ci` → `astro check` → `vitest run` → `astro build`
2. Python checks on the build: tool unit tests, legacy visible text (`compare_legacy_text.py`), and legacy head/script/link parity plus exactly one `<Analytics />` on `/` and `/next` (`check_dist.py`)
3. Fact audit (`fact_audit.py`) on the visible text of `/` and `/next` plus every `src/content/*.json`:
   - every number must appear in `docs/content-inventory.md` or the visible text of `legacy/index.html` (UI-chrome exceptions go in `tools/fact_audit_allow.txt`, one `<string>  # <reason>` per line)
   - banned: teammate names and planned course codes everywhere, "Engineering Ambassador" on `/next` and in content JSON, "built" / "tested" / "working device" in the capstone entry
   - every Caption, Character Line, Proof Tile and easter egg in content JSON needs a non-empty `source`
4. `linkinator`: internal links and the résumé PDF on `/` and `/next` (external URLs skipped)
5. `lhci autorun` on the static `dist/` for `/` and `/next` (budgets in `lighthouserc.json`):
   - **fail:** Accessibility < 0.9, script transfer > 100 KB, total transfer > 600 KB
   - **warn only:** Performance < 0.9 (shared runners are noisy)

Lighthouse reports stay private. They are written to `.lighthouseci/` and uploaded as the `lighthouse-reports` workflow artifact, never to public storage.

Run the same gate locally after `npm ci`:

```sh
npm run check
npm test
npm run build
python -m unittest discover -s tools -p "test_*.py"
python tools/compare_legacy_text.py legacy/index.html dist/index.html
python tools/check_dist.py
python tools/fact_audit.py
npx linkinator . next/index.html --server-root dist --recurse --skip '^https?://(?!127\.0\.0\.1[:/])'
npx lhci autorun   # needs Chrome; set CHROME_PATH if it isn't found
```

### Fact audit names (one-time, manual, before pushing the fact-audit PR)

The teammate-name list is never committed. In CI it comes from a repository secret; without it the `Fact audit` step fails on purpose.

1. On GitHub: **Settings → Secrets and variables → Actions → New repository secret**
2. Name: `BANNED_NAMES`
3. Secret: one name per line (or comma-separated), both full names and first names
4. Add secret

Locally, put the same list in `tools/banned_names.local.txt` (gitignored), or set `FACT_AUDIT_BANNED_NAMES`. Without either, the audit warns "name check skipped" and runs the other checks. The output never prints a name; matches show as `[teammate name #N]`.

### Branch protection (one-time, manual)

On GitHub: **Settings → Branches → Add branch protection rule** (or **Add classic branch protection rule**) for `main`:

1. Branch name pattern: `main`
2. Tick **Require a pull request before merging**
3. Tick **Require status checks to pass before merging** and add the check **`ci`** (it appears in the search once the workflow has run on a PR)
4. Save

## Deploy

Vercel builds from `main` using `vercel.json` (Astro framework, `npm run build`, output `dist/`). If a Preview doesn't build, set Project → Settings → Build & Deployment → Framework Preset = **Astro** (one-time).

- GitHub: [github.com/snehaislamm](https://github.com/snehaislamm)
- LinkedIn: [linkedin.com/in/SnehaIslam](https://www.linkedin.com/in/SnehaIslam)
