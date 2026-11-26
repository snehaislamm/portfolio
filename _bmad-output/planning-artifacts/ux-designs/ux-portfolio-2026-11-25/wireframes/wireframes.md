# Wireframes: The Fab Line

These are ASCII wireframes at low fidelity. The spines (`../DESIGN.md`, `../EXPERIENCE.md`) win on conflict.

> **Visual direction: B · Block Biome** (DESIGN.md). Colour notes in these wireframes, such as "(violet)", "corner marks" or "navy", are from the earlier navy/cyan draft. Read them as the Block Biome equivalents: each Station uses its biome colour, frames are thick black block outlines, and the Ghibli portrait sits in a black square frame. Layout and behaviour are unchanged.
Legend: `[ Button ]` · `( icon )` · `▓▓▓` diagram · `●` current · `○` unvisited · `◉` visited · `🔒` locked.

---

## W1. Title Screen (desktop)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ (◕) SNEHA ISLAM   ○──○──○──○──○──○─🔒        [ Résumé ] (✉)(in)(gh) [More ▾] │ ← HUD
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   NANO-ENGINEER · UNIVERSITY OF WATERLOO        ┌┐──────────────────────┌┐   │
│                                                 │                        │   │
│   Sneha Islam                                   │   Ghibli portrait      │   │
│   from silicon to software.                     │   (sneha-scene.webp)   │   │
│                                                 │   framed, corner marks │   │
│   [ 4 terms ] [ 8 repos ] [ Azure ×2 ]          │                        │   │
│                                                 └┘──────────────────────└┘   │
│   [ ▶ Start ]   [ Recruiter Mode ]                                            │
│                                                                              │
│                       scroll ↓  ·  Space                                      │
└──────────────────────────────────────────────────────────────────────────────┘
```
13 visible words, excluding buttons and HUD.

## W1-m. Title Screen (mobile, 390 px)
```
┌──────────────────────────┐
│  ┌┐────────────────┌┐    │
│  │ Ghibli portrait │     │
│  │ (crop, 4:3)     │     │
│  └┘────────────────└┘    │
│  NANO-ENGINEER · UW      │
│  Sneha Islam             │
│  from silicon to         │
│  software.               │
│  [4 terms][8 repos]      │
│  [Azure ×2]              │
│  [ ▶ Start ]             │
│  [ Recruiter Mode ]      │
├──────────────────────────┤
│[Résumé] (✉) (in) (gh) ⋯ │ ← bottom HUD, safe-area aware
└──────────────────────────┘
```

## W2. Character Card
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ HUD …                                                     ▔▔▔▔▔▔ XP 0/17     │
├──────────────────────────────────────────────────────────────────────────────┤
│  CHARACTER                                                                   │
│  ┌──────────┐  CLASS       Nano-Engineer                                     │
│  │ portrait │  HOME BASE   University of Waterloo · BASc Nanotechnology Eng. │
│  │  256px   │  OPTION      Nanoelectronics · 3B (Fall 2026)                  │
│  └──────────┘  HOME        Toronto, ON                                       │
│                NEXT QUEST  ➜ 8-month co-op · Jan–Aug 2027        (violet)    │
│                EQUIPMENT   [AZ-900] [AI-900]                     (badges)    │
│                                                                              │
│  INTERESTS  (⚛ Quantum hardware) (▤ Nanoelectronics) (◎ Applied AI) (📈 Fintech)│
│  TRAINING ▸ 6 courses                                       (expands: FR-4)  │
└──────────────────────────────────────────────────────────────────────────────┘
```
Mobile: the portrait goes on top and the rows become stacked label/value pairs.

## W3. World map = Mini-map (HUD) and Map sheet (mobile)
```
Desktop HUD Mini-map (inline):
  ◉ Title ─ ◉ Char ─ ● AI ─ ○ Power ─ ○ Compiler ─ ○ Cleanroom ─ ○ Dock ─ 🔒
  "Stations visited 1/4"   (labels shown on hover/focus; nodes are buttons)

Mobile: More ⋯ → Map
┌──────────────────────────┐
│ MAP                   ✕  │
│ ◉ Character              │
│ ● AI in Production  ←you │
│ ○ Power & Control        │
│ ○ Compiler & EDA         │
│ ○ Cleanroom              │
│ ○ Shipping Dock          │
│ 🔒 Quantum Fab           │
│ Stations visited 1/4     │
└──────────────────────────┘
```

## W4. Station (zone): AI in Production, desktop
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ HUD …                                                    ▔▔▔▔▔▔▔ XP 2/17     │
├──────────────────────────────────────────────────────────────────────────────┤
│▌STATION 01 · AI IN PRODUCTION                        (violet wash on arrival) │
│▌┌────┐                                                                       │
│▌│ ◕  │ "I shipped an AI system watching 1,200+ companies."     ← dialogue box  │
│▌└────┘                                                                       │
│                                                                              │
│  ┌── FEATURE: ai/communitech ──────────────────────── ✓ COMPLETED ─────────┐ │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │ Agentic newsletter, shipped                │ │
│  │ ▓ SVG-3 pipeline (flow)  ▓  │ [ 50+ ]  [ 1,200+ ]  [ 5/6 ]               │ │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │ sources   companies   silent sources fixed │ │
│  │                             │ Scrapes, dedups, summarizes with Gemini…   │ │
│  │                             │ (React)(TS)(FastAPI)(Azure)                │ │
│  │                             │ [ Inspect ▸ ]            [ Copy link ]     │ │
│  └─────────────────────────────────────────────────────────────────────────┘ │
│  ┌ ai/plug-co ──────── ✓ ┐  ┌ ai/avanade ──────── ✓ ┐                       │
│  │ ▓▓ diagram ▓▓         │  │ ▓▓ diagram ▓▓         │                       │
│  │ [<300ms][85%+][12 wk] │  │ [3][+25%][10+]        │                       │
│  │ caption ≤25w          │  │ caption ≤25w          │                       │
│  │ [Inspect ▸]           │  │ [Inspect ▸][yunus ↗]  │                       │
│  └───────────────────────┘  └───────────────────────┘                       │
│  ┌ ai/muse ─────── ✓ ┐ ┌ ai/facesolve ──── ✓ ┐ ┌ ai/coa-forge ──── ✓ ┐      │
│  │ … [Repo ↗]        │ │ … [Repo ↗]          │ │ … [Repo ↗]          │      │
│  └───────────────────┘ └─────────────────────┘ └─────────────────────┘      │
│  ▸ Side quest: Econ toolkit (collapsed)                                      │
│                                                     🧍‍♀️ ← sprite on Track    │
└──────────────────────────────────────────────────────────────────────────────┘
```
Station header: 9 words (≤20).

## W5. Level Card, collapsed (L0) and inspected (L1–L3)
```
L0 (collapsed)                         Inspect drawer (desktop: right side, 420 px)
┌ power/zonecore ───── ✓ COMPLETED ┐   ┌─────────────────────────────────── ✕ ┐
│ Quad-motor EV controls           │   │ zonecore · power/zonecore            │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │   │ L1 METRICS                            │
│ ▓ ECUs ⇄ E2E CAN ⇄ SIL bench ▓  │   │  46/46  ASIL-tagged reqs traced       │
│ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │   │  32     SIL scenarios · 9 fault-inj.  │
│ [46/46] [32 SIL] [~3.1k C99]     │   │  ~3.1k  lines C99, no heap            │
│ reqs    scenarios lines          │   │ [ Show more ▾ ]                       │
│ BMS with EKF SOC, traction       │   │ L2 DETAILS                            │
│ control, torque vectoring…       │   │  • full source bullets (inv §7)       │
│ (C99)(CAN/DBC)(SIL)              │   │  • diagram in words (alt desc)        │
│ [Inspect ▸] [Repo ↗] [Copy link] │   │  🥚 easter egg (if any)               │
└──────────────────────────────────┘   │ [ Show more ▾ ]                       │
                                       │ L3 LINKS  [ Repo on GitHub ↗ ]        │
                                       │           [ Copy link #power/zonecore]│
                                       └───────────────────────────────────────┘
Mobile: the drawer becomes a bottom sheet (85% height), with the same order.
```

## W6. Main Quest card (capstone)
```
┌┐ cleanroom/capstone ───────────────────────────────── ● ACTIVE · MAIN QUEST ┌┐
│ Doxorubicin patch                                                            │
│ ▓▓▓▓▓▓ SVG-6 cartridge + pod ▓▓▓▓▓▓    [≈8.2 mAh] [≈$55 vs $160] [≈$1,400]   │
│                                         24 h·est.  per patient·est budget·est│
│ Design proposal ✓ ──── Build Sep 2027 ──── Test to Apr 2028                  │
│ ●━━━━━━━━━━━━━━━━━━━━━━○──────────────────────○                (stepper)    │
│ My part: electronics & readout. 4-person team.                               │
│ [ Inspect ▸ ]                                              [ Copy link ]     │
└┘─────────────────────────────────────────────────────────────────────────────└┘
```

## W7. Skill Tree sheet
```
┌────────────────────────────────────────────────────────────────── ✕ ┐
│ SKILL TREE · proof, not scores                                       │
│ LANGUAGES        [Python ·9] [TypeScript ·2] [C99 ·2] [C++17 ·2] [Go ·1]
│                  [JavaScript ·1] [Swift ·1] [Java] [MATLAB ·1] …     │
│ SOFTWARE & WEB   [FastAPI ·2] [React ·2] [Tailwind ·1] [Figma ·1] …  │
│ AI / ML          [Gemini API ·1] [Pinecone ·1] [PyTorch·ONNX ·1] …   │
│ CLOUD & DEVOPS   [Azure ·2] [AWS ·1] [Docker ·3] [GCP] [Linux] …     │
│ HARDWARE & EMB.  [CAN bus/DBC ·2] [SIL testing ·1] [FPGA P&R ·1] …   │
│ FAB & CHAR.      [PECVD ·1] [Ellipsometry ·2] …                      │
│ ─────────────────────────────────────────────────────────────────── │
│ CAN bus / DBC → [ Battery WC ] [ zonecore ]        ← selected node   │
└──────────────────────────────────────────────────────────────────────┘
```
`·n` is the number of proving cards. These counts are illustrative; the build computes them from the content file. Nodes without a count are dimmed plain text, not buttons.

## W8. Quest Log (sheet; also inline at the Shipping Dock)
```
┌──────────────────────────────────────────────────────── ✕ ┐
│ QUEST LOG          XP ▔▔▔▔▔▔▔▔▔▔░░░░ 11/17 viewed           │
│ [ Completed 16 ] [ Active 1 ] [ Next 1 ]                    │
│ ─────────────────────────────────────────────────────────── │
│ ✓ NOV 2026   Open-source sprint: 8 repos            → ×8    │
│ ✓ FEB–MAY 2026  Communitech · Software Dev Co-op    →       │
│ ✓ SEP 2025–JAN 2026  The Plug Co · AI Dev Intern    →       │
│ ✓ JAN–APR 2025  Battery WC · Research Assistant     →       │
│ ✓ 2025  MIS capacitor (NE 343)                      →       │
│ ✓ MAY–AUG 2024  Avanade · Software Developer        →       │
│ …                                                           │
│ Active: ● Capstone, doxorubicin patch (design proposal)     │
│ Next:   ➜ 8-month co-op · Jan–Aug 2027                      │
└─────────────────────────────────────────────────────────────┘
```

## W9. Speedrun Banner, Shipping Dock and Quantum Fab
```
┌──────────────────────────────────────────────────────────────────────────────┐
│  ⚡ SPEEDRUN · NOV 2026 — 8 repos shipped                                     │
│  [vaclab][fabricfit][zonecore][modcell][tilec][muse][facesolve][coa-forge]   │
├──────────────────────────────────────────────────────────────────────────────┤
│  SHIPPING DOCK                                                               │
│  ● Available · 8-month co-op · Jan–Aug 2027                                  │
│  Open to software, applied AI, embedded systems, nanoelectronics roles.     │
│        [   ⬇  Résumé (PDF)   ]  ← largest button on the page                 │
│  (✉ s32islam@uwaterloo.ca  [Copy])  (in LinkedIn ↗)  (gh GitHub ↗)           │
│  QUEST LOG (inline W8)                                                        │
├──────────────────────────────────────────────────────────────────────────────┤
│                    ⬡🔒   QUANTUM FAB                                         │
│              Dream: quantum computer hardware                                │
│        (select → "Not unlocked yet. That's the long-term goal.")             │
└──────────────────────────────────────────────────────────────────────────────┘
```

## W10. Recruiter Mode (desktop; reuses the current site layout)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ S.ISLAM   About · Experience · Projects · Code · Courses · Skills · Path ·   │
│           Résumé · Contact                         [ ▶ Play the game ]       │
├──────────────────────────────────────────────────────────────────────────────┤
│ Current index.html sections §01–§09, in order, static, no animation,         │
│ every Level Card at full L2 depth, early & collaborative work included,      │
│ full HTML résumé sheet (with Leadership), Résumé PDF link in the top nav.    │
└──────────────────────────────────────────────────────────────────────────────┘
```

## W11. Mobile Station and card (390 px)
```
┌──────────────────────────┐
│▌STATION 01 · AI          │
│▌(◕) "I shipped an AI     │
│▌ system watching 1,200+  │
│▌ companies."             │
│ ┌ ai/communitech ── ✓ ┐  │
│ │ ▓▓ SVG-3 (scaled) ▓▓ │  │
│ │[50+][1,200+][5/6]   │  │
│ │ caption…            │  │
│ │[Inspect ▸][🔗]      │  │
│ └─────────────────────┘  │
│ ┌ ai/plug-co ───── ✓ ┐   │
│ │ …                   │  │
│ 🧍‍♀️ (48 px sprite)      │
├──────────────────────────┤
│[Résumé] (✉) (in) (gh) ⋯ │
└──────────────────────────┘
```
