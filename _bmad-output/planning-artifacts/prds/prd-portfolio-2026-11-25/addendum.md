# Addendum: PRD "The Fab Line"

This addendum holds detail for the downstream UX, architecture and stories steps that does not belong in the PRD itself. Facts follow the same rule as the PRD: every one comes from `docs/content-inventory.md`.

## A. Tech stack (decision D9; for the architecture step)
- **UI:** React + TypeScript, **pre-rendered to static HTML** so that FR-27 and NFR-9 hold. Two options for the architect to decide between:
  - **Astro + React components:** zero JS by default, with the game layer added as React components only where it's needed. Best fit for NFR-2 and NFR-3.
  - **Vite + React + a pre-render step** (e.g. a `renderToString` build script): a single React app, which keeps it closer to the stack on the résumé.
- **Content:** one typed content file (`content.json` or a `.ts` module), per FR-31.
- **Python build-time tools (no server):**
  - `fact_audit.py`: extracts numbers and Character Lines from the built HTML and the content file, checks them against the inventory and the banned-term list (FR-30), and exits non-zero on failure. It runs in GitHub Actions before the Vercel deploy.
  - `images.py`: the D1 image pipeline (crops, WebP export, avatar ring, OG image crop).
- **Hosting:** Vercel, static output, deployed from `main`.
- **Analytics (D12):** Vercel Web Analytics. In a React/Astro build, use the official `@vercel/analytics` package, or keep the same-origin `/_vercel/insights/script.js` snippet. Enable it in the Vercel dashboard and stay on the free Hobby plan.

## B. Draft Character Lines (FR-11; for the UX copy pass)
Every line is ≤12 words, in the first person, and restates a sourced fact.

| Screen | Draft line | Source |
|---|---|---|
| AI in Production | "I shipped an AI system watching 1,200+ companies." | inv §5.1 |
| Power & Control | "My fault injection cut BMS testing time by 35%." | inv §5.3 |
| Compiler & EDA | "I routed 2,218 blocks on a 54×54 FPGA." | inv §7 fabricfit |
| Cleanroom | "I deposited 102.6 nm of SiNₓ, then measured it two ways." | inv §6.1 |
| Speedrun Banner | "Eight repos, one November." | inv §10 |
| Quantum Fab | "Not unlocked yet. That's the long-term goal." | inv §3 ¶4 |

## C. Diagram needs (FR-10)
| Level Card | Diagram |
|---|---|
| Communitech | Reuse SVG-3 / SVG-4 |
| MIS capacitor | Reuse SVG-2 / SVG-5 |
| Capstone | Reuse SVG-6 |
| The Plug Co, Avanade, Battery WC, and all 8 repos | **New SVG needed**, built only from the card's own facts (e.g. a CAN link BPCM↔EVCU for Battery WC; a routing grid for fabricfit; a DSL → IR → LLVM IR pipeline for tilec) |
| Side Quests | Icon only |

## D. Station → Achievement and easter-egg map
| Station | Achievement | Easter egg |
|---|---|---|
| AI in Production | Shipped to production | Newsletter sent Mondays, 7 AM ET |
| Power & Control | 46/46 traced | E-stop to safe state in 10 ms (modcell) |
| Compiler & EDA | — | — |
| Cleanroom | Cleanroom graduate | Skipped the ~$611 eval kit (~40% of budget) |
| Character Card | Azure certified ×2 | — |
| Speedrun Banner | 8 repos, one sprint | — |
