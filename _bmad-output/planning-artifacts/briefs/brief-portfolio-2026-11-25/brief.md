---
title: "Product Brief: The Fab Line — Sneha Islam's game portfolio"
status: final
created: 2026-11-25
updated: 2026-11-25
sources:
  - docs/content-inventory.md (decisions D1–D8)
  - _bmad-output/planning-artifacts/brainstorm-game-concepts.md (Concept A, reversed)
---

# Product Brief: The Fab Line

**Stack:** React + TypeScript (static, pre-rendered) · Python build-time tooling · Vercel. No backend.

## Summary
Sneha's portfolio becomes a short, scroll-driven game. **Sneha, the "Nano-Engineer", travels her own production line in reverse, *from software back to silicon*.** The line starts at the AI systems she shipped, passes through embedded and compiler work, and reaches the cleanroom where she fabricates devices. It ends at a locked door marked *Dream: quantum computer hardware*.

At every station, diagrams, stats and a single short line carry the meaning, not paragraphs. A recruiter learns **who she is, what she can do and what she has shipped in under 60 seconds**, and the résumé is always one click away.

## The problem
Student portfolios are walls of text that recruiters skim in seconds. The current site is accurate and thorough: 4 work terms, 13 projects and repos, and dozens of metrics. That depth is also the problem. Her strongest signals, a production AI system and hands-on device fabrication, compete for attention with everything else, and nothing about the page shows her personality.

## Who it serves, and their 60-second goal
| User | Goal in 60 s | Where the Fab Line answers it |
|---|---|---|
| **Tech recruiter** | Role fit, top 3 achievements, résumé, contact | Title chips + character card (0–8 s) · first three stations · HUD **Résumé** and contact icons on every screen |
| **Hiring manager** | Depth on 1–2 projects | **Inspect** on any station: diagram → metrics → link |
| **Panel engineer** | Repos, diagrams, metrics | Every station: "how it works" diagram, 3 stat tiles, repo link; Nov 2026 "8 repos" speedrun |

## Core promise
*"Play it in a minute, or skip it in a click. Either way you leave knowing what Sneha has shipped."*

## The 60-second path
| Time | Screen | What the recruiter sees |
|---|---|---|
| 0–2 s | **Title** | Sunny portrait · "from silicon to software" · 4 terms · 8 repos · Azure ×2 |
| 2–8 s | **Character card** | UWaterloo NE · Nanoelectronics · 3B · **8-month co-op, Jan–Aug 2027** · Toronto |
| 8–20 s | **AI in Production** | 50+ sources/day · 1,200+ companies · <300 ms · 85%+ |
| 20–30 s | **Power & Control** | ±2% SoC · −35% test time · 46/46 requirements traced |
| 30–38 s | **Compiler & EDA** | 2,218 blocks on 54×54 · 15.7× matmul |
| 38–48 s | **Cleanroom** | 102.6 nm SiNₓ · capstone shown as the Active Main Quest (*design proposal*) |
| 48–60 s | **Speedrun → Shipping Dock** | 8 repos, Nov 2026 · Quest Log 17 ✓ / 1 active · 🔒 Quantum Fab · **Résumé** |

## Design pillars, each with a pass/fail check
| Pillar | Shows up as | Measurable check |
|---|---|---|
| **Curious** | Inspect at every station; real-fact easter eggs; locked Quantum Fab | 100% of stations have a 3-layer Inspect · ≥3 easter eggs, each traceable to an inventory line |
| **Intelligent** | A "how it works" visual opens every station | 100% of stations lead with a diagram · no paragraph longer than 40 words in game view `[ASSUMPTION]` |
| **Fun** | ≤12-word first-person lines, micro-animations, achievement toasts, sound off | Every station has exactly one line of ≤12 words · ≤5 achievements · 0 sounds by default |
| **Hardworking** | XP bar and Quest Log fed by real work; Nov 2026 speedrun | Quest Log shows **17 completed / 1 active**, matching the inventory count exactly · 0 invented scores |

## Success criteria (v1 ships when all pass)
- **Résumé reached in ≤2 clicks** from any screen. The design target is 1, via the HUD.
- **Any project's key metric visible in ≤3 clicks:** mini-map → station → Inspect.
- **Works on a phone:** 400 px width, touch and keyboard, no horizontal scroll.
- **Lighthouse ≥90** for Performance and Accessibility (mobile profile) `[ASSUMPTION: mobile]`. Loads in under 2 s on a normal connection.
- `prefers-reduced-motion` and **Recruiter Mode** both give the full content, with nothing missing.
- **Fact audit:** every number and line on screen maps to `docs/content-inventory.md`, enforced by the Python fact-audit script in CI. The capstone is never shown as built, and teammates are not named.

## Scope
**In (v1):**
- one static page on Vercel, built with **React + TypeScript** and **pre-rendered to semantic HTML**, so the text exists before any JavaScript runs. The game is a React layer on top. The exact framework (e.g. Astro with React components, or Vite with a pre-render step) goes to the architecture step.
- **Python build-time tools (no server):** a fact-audit script that fails the build if any on-screen number or line isn't in `docs/content-inventory.md`, and the image pipeline for the character assets
- title screen, character card, 4 stations, speedrun, Shipping Dock
- HUD with Résumé PDF, Recruiter Mode, GitHub, LinkedIn and email, a mini-map, the XP bar and the Quest Log
- the 6 reused SVGs plus simple new diagrams for stations that have none
- the character assets from D1

**Out (v1):** sound design · multiplayer · accounts · 3D engine · backend · new character art or animated sprites · analytics `[ASSUMPTION]`

## Risks and mitigations
| Risk | Mitigation |
|---|---|
| **The gimmick hides the content** | The game is a layer over real HTML. The top signals appear in the first 20 s, and Recruiter Mode is one click away. |
| **Slow load** | Pre-rendered HTML first, then React (~45 KB compressed) adds the game. Images are WebP, and the scene image is lazy-loaded. First-load budget ≤600 KB `[ASSUMPTION]`, checked with Lighthouse before each deploy. |
| **Motion sickness** | Scroll-linked, short animations with no parallax-heavy movement. A motion toggle is in the HUD, and reduced motion is respected. |
| **Recruiter won't play** | Recruiter Mode gives a plain one-page view, and the Résumé PDF is on every screen. |
| **Facts drift or get inflated** | The inventory is the single source of truth. Qualifiers stay attached: "simulated", "projected", "estimate", "design proposal". |

## Open items
- How will we know it works *after launch*? Without analytics, the only signal is qualitative: recruiter replies and interview requests. Decide whether to add cookie-less analytics (e.g. Vercel Web Analytics) in v1.1.
- Vision: when the capstone is built (Sep 2027 – Apr 2028), the Active Main Quest moves to ✓, and the Quantum Fab is the natural place for a future level.
