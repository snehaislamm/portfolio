# Brainstorm: Character-Based Game Portfolio

**Step:** 02 · Analyst brainstorm
**Date:** 2026-11-25
**Inputs:** `00-shared-context.md`, `docs/content-inventory.md` (§0–§19, including Sneha's decisions D1–D3)
**Audience for the game:** recruiters with 60 seconds. **Audience for this doc:** Sneha and the downstream agents (PM, UX, architect, dev).

> **Superseded detail (2026-11-25):** the Engineering Ambassador role was removed from the portfolio (inventory D10). The quest count is now 17 Quests: **16 completed + 1 active**. Mentions of the Ambassador or of "17/18" in the rejected Concepts B and C are historical.

> **Fact rule:** every number, line and achievement below comes from `docs/content-inventory.md`. Character lines are ≤12 words and only restate facts on the site.
> **Hard constraints carried into every concept:**
> - "Skip to Résumé" on every screen, opening `/Sneha_Islam_Resume.pdf`
> - Recruiter Mode one click away
> - real HTML text throughout
> - mobile and keyboard support, with `prefers-reduced-motion` respected
> - under 2 s load, static site on Vercel
> - the capstone is never shown as built
> - no teammate names

---

## 0. What the seed ideas get right, and where I'd push back

| Seed idea | Keep | Challenge |
|---|---|---|
| World map of zones | Zones that group content by discipline map well onto "from silicon to software". | **Walking costs time.** At even 3–4 s per zone transition, a recruiter sees 2–3 zones in 60 s and may never reach the AI work, which is her strongest signal (inventory §16, rank 1). |
| AI Observatory with 6 items | — | **Overloaded:** 3 jobs and 3 repos in one place, while the *Compiler Forge* holds only `tilec`. Unbalanced zones make the map feel empty in some places and crowded in others. |
| Character sheet, skill tree, Quest Log, Inventory | All four are strong, cheap and recruiter-readable. | The skill tree must not invent levels (inventory §9: no proficiency data). Each node should **prove** a skill by linking to where it was used, not score it. |
| Capstone as the Active Main Quest | Strong and honest: "Design proposal ✓ → Build 2027 → Test 2028". | Keep it visually distinct from completed quests (amber, as the site already uses for WIP). |
| Achievements | "Shipped to production", "8 repos in one sprint", "Azure certified ×2" are all real. | Cap them at a handful. Too many pop-ups slow a 60-second visit. |

---

## Concept A: "The Fab Line" (scroll-driven journey)

### 1. World metaphor and 60-second path
Sneha's own tagline, **"from silicon to software"**, becomes a literal production line. She travels one continuous track, past stations that turn raw silicon into shipped software. **Scrolling is walking**, so there is nothing to learn. Each station is one screen with one diagram, one ≤12-word line and three stat tiles.

```
[Sunny title: Sneha]  →  CLEANROOM  →  POWER & CONTROL  →  COMPILER & EDA  →  AI IN PRODUCTION  →  SHIPPING DOCK
  character card          MIS cap          Battery WC           fabricfit           Communitech           résumé · contact
                          vaclab           zonecore             tilec               The Plug Co           Quest Log summary
                          capstone (WIP)   modcell                                  Avanade · muse
                                                                                    facesolve · coa-forge
                                                                         ↘ 🔒 QUANTUM FAB (locked: dream, quantum computer hardware)
```

The title screen uses the warm illustration (`sneha-scene.webp`). Stepping through the cleanroom door changes the scene to the site's dark blueprint palette. That also solves the style clash noted in inventory §19.

### 2. Traits → mechanics
| Trait | Mechanic |
|---|---|
| **Curious** | An **Inspect** button at every station opens three layers: diagram → metrics → repo link. Real-fact easter eggs: "Newsletter ships Mondays, 7 AM ET", "E-stop to safe state: one 10 ms scan", "Skipped a ~$611 eval kit (~40% of budget)". A locked Quantum Fab sits at the end of the line. |
| **Intelligent** | Every station opens with an existing "how it works" SVG: MIS cross-section (SVG-2), C–V curve (SVG-5), newsletter pipeline (SVG-3), system map (SVG-4), cartridge + pod (SVG-6). New simple diagrams are needed for stations that have none (inventory §14). |
| **Fun** | Short first-person lines, e.g. "I routed 2,218 blocks on a 54×54 FPGA." Animated wafer progress along the track, achievement toasts, sound off by default. |
| **Hardworking** | A persistent **XP bar fed by 17 Quests: 16 completed** (4 work terms, 4 course projects, 8 repos) **+ the capstone, still active**. The Nov 2026 sprint is a **speedrun banner**: "8 repos shipped · Nov 2026". |

### 3. Where content lives
| Content | Station |
|---|---|
| Hero, datasheet, interests | Title screen character card |
| MIS capacitor, vaclab, **capstone (Active Main Quest, amber)** | Cleanroom |
| Battery WC, zonecore, modcell | Power & Control |
| fabricfit, tilec | Compiler & EDA |
| Communitech, The Plug Co, Avanade, muse, facesolve, coa-forge | AI in Production *(split into "Shipped at work" and "Built in the open" to avoid the seed's overload)* |
| Econ toolkit, recycling, tensor solver, coursework | Side quests (collapsed) at the station they relate to |
| Skills | Each station's tools light up on a skill tree in the HUD |
| Path | Quest Log at the Shipping Dock |
| Résumé, contact, certs | Shipping Dock |

### 4. Skip to Résumé / Recruiter Mode
A fixed HUD in the top-right corner holds **Résumé (PDF)**, **Recruiter Mode** and three contact icons. The labels are plain, with no in-fiction wording. Recruiter Mode **turns the animations off on the same HTML**: stations become ordinary stacked sections. It is the same DOM in both modes, so screen readers, SEO and reduced-motion users get Recruiter Mode automatically.

### 5. Build effort: **M**
One long page, vanilla JS. It reuses the site's existing `IntersectionObserver` reveal and its 6 SVGs. New work: the track and HUD, about 6 simple station diagrams, the toast system, and the Recruiter Mode toggle.

---

## Concept B: "Waterloo Overworld" (explorable zone map)

### 1. World metaphor and 60-second path
This is the seed idea, sharpened. A top-down illustrated map has 6 zones, and Sneha's avatar stands in the centre. **Click a zone to fast-travel**, with no walking, to fix the time cost. Each zone opens a panel of quest cards.

Rebalanced zones:
- **Cleanroom:** MIS, vaclab, capstone
- **Circuit Works:** Battery WC, zonecore, modcell
- **Silicon Forge:** fabricfit, tilec. Merging the two avoids a one-item zone.
- **AI Observatory:** Communitech, The Plug Co, Avanade
- **Data Lab:** muse, facesolve, coa-forge
- **Guild Hall:** Ambassador, coursework, certs
- **Quantum Gate:** locked

60-second path: land on the map (5 s) → zones pulse in suggested order → open 2–3 zones (~15 s each) → Résumé.

### 2. Traits → mechanics
| Trait | Mechanic |
|---|---|
| **Curious** | Strongest of the three concepts. Free exploration, a fog-of-war that lifts as zones are visited, hidden eggs, and the locked Quantum Gate. |
| **Intelligent** | Each quest card flips to its diagram. |
| **Fun** | Map ambience (clouds, a blinking cleanroom light), avatar reactions, zone-complete stamps. |
| **Hardworking** | "Zones explored 0/6" and an XP bar fed by the same 17/18 quest count. |

### 3. Where content lives
In the zones above. Skills appear as a "Toolbelt" overlay, and Path is the Quest Log opened from the HUD.

### 4. Skip to Résumé / Recruiter Mode
The same fixed HUD as Concept A. Recruiter Mode must be a **separate layout**, because a map doesn't linearise naturally, so the content is maintained in two views.

### 5. Build effort: **L**
A custom illustrated map is needed, and it has to work on mobile: it gets cramped below 560 px and needs pan/zoom or a list fallback. That means two layouts to keep in sync and more QA. **Biggest risk:** recruiters skip zones, and the strongest signals depend on them choosing well.

---

## Concept C: "Character Status Screen" (RPG pause menu)

### 1. World metaphor and 60-second path
There is no world, only the **pause menu of an RPG**. That screen shows everything about a character at a glance, and recruiters can read it in seconds. Sneha's portrait sits on the left with her class (*Nano-Engineer*), home base (Waterloo) and equipment (AZ-900, AI-900). Tabs run along the top: **Status · Quest Log · Skill Tree · Inventory · Main Quest**.

60-second path:
1. The Status tab shows the top-signal stats and the Main Quest (10 s).
2. The Quest Log shows 4 jobs as completed quests with "rewards" = metrics (20 s).
3. The Skill Tree lets a node be tapped to show its proof (15 s).
4. Then Résumé.

### 2. Traits → mechanics
| Trait | Mechanic |
|---|---|
| **Curious** | Weakest of the three. There is no space to explore, only expandable cards and the skill-tree "trace to proof". |
| **Intelligent** | The proof links in the skill tree: each tool traces to where it was used. |
| **Fun** | Menu sounds (off by default), stat tiles that count up, achievement shelf. |
| **Hardworking** | The Quest Log is the centrepiece: 17 completed, 1 active. |

### 3. Where content lives
Status tab = hero + datasheet. Quest Log = experience + projects + repos. Skill Tree = skills. Inventory = certs + tools. Main Quest = capstone.

### 4. Skip to Résumé / Recruiter Mode
Easiest of the three. The menu already is a structured one-pager, so Recruiter Mode only removes the game styling.

### 5. Build effort: **S**
Tabs, cards and one skill-tree view. **Risk:** it reads as a themed dashboard rather than a game, so the "Fun" and "Curious" traits only just register.

---

## Comparison

| Criterion (weight) | A · Fab Line | B · Overworld | C · Status Screen |
|---|---|---|---|
| Recruiter gets who / can-do / shipped in 60 s (×3) | ●●● guided, nothing skipped | ●○○ depends on choices | ●●● all above the fold |
| Nothing to learn (×2) | ●●● scroll = walk | ●●○ click zones | ●●● menu tabs |
| Curious (×1) | ●●○ | ●●● | ●○○ |
| Intelligent (×1) | ●●● diagram per station | ●●○ | ●●○ |
| Fun (×1) | ●●○ | ●●● | ●○○ |
| Hardworking (×1) | ●●● | ●●○ | ●●● |
| Mobile + reduced motion + Recruiter Mode (×2) | ●●● same DOM | ●○○ second layout | ●●● |
| Solo build effort (×2) | ●●○ M | ●○○ L | ●●● S |
| **Weighted score (max 39)** | **36** | **22** | **31** |

---

## Recommendation: Concept A "The Fab Line", plus two parts borrowed from C

**Why A:**
1. **It fits the 60-second constraint by design.** A guided track means every recruiter passes the top-5 signals (inventory §16) in order, with none depending on a click choice. B can't guarantee that.
2. **The metaphor is Sneha's own brand.** "From silicon to software" is already her H1. The journey from cleanroom to production AI is literally her CV. That makes the story *intelligent* rather than decorative.
3. **One HTML document serves every audience.** Recruiter Mode, reduced motion, screen readers and SEO all use the same markup with the animations turned off. That's what makes the hard requirements cheap, not a second site.
4. **It resolves the art-style clash.** The sunny illustration opens the game, and stepping into the cleanroom brings in the dark blueprint world.
5. **It's achievable solo (M).** It reuses 6 existing SVGs and the existing reveal script.

**Borrowed from C:**
- The **character card** opens the game: portrait, class, home base, equipment and next quest.
- The **Quest Log** sits at the Shipping Dock and as an always-available HUD drawer, which carries the *Hardworking* trait.

**Kept from B:**
- A **mini-map** in the HUD (6 dots along the track) that allows a jump to any station. This keeps some *Curious* freedom and lets returning visitors skip ahead.

### 60-second recruiter path (recommended concept)

| Time | Screen | What the recruiter sees | Action |
|---|---|---|---|
| 0–2 s | **Title** | Sunny illustration · "Sneha Islam · Nano-Engineer · from silicon to software" · chips: **4 terms · 8 repos · Azure ×2** · HUD: Résumé · Recruiter Mode · GitHub · LinkedIn · Email | Press **Start ▸** / scroll / Space |
| 2–8 s | **Character card** | Portrait, UWaterloo BASc NE · Nanoelectronics · 3B · **Next quest: 8-month co-op · Jan–Aug 2027** · Home base: Toronto · Equipment: AZ-900, AI-900 · XP bar (17 Quests) | Scroll |
| 8–20 s | **AI in Production** *(shown first; see note)* | Newsletter pipeline SVG animates · "I shipped an AI system watching 1,200+ companies." · tiles **50+ sources/day · <300 ms · 85%+** · toast 🏆 *Shipped to production* | Scroll |
| 20–30 s | **Power & Control** | Battery pack + CAN diagram · "My fault injection cut BMS testing time 35%." · tiles **±2% SoC · −35% · 46/46 reqs** | Scroll |
| 30–38 s | **Compiler & EDA** | FPGA grid routing animation · "I routed 2,218 blocks on a 54×54 FPGA." · tiles **15.7× matmul · 89.5 MHz** | Scroll |
| 38–48 s | **Cleanroom** | MIS cross-section + C–V curve · "I deposited 102.6 nm of SiNₓ, then measured it two ways." · **Active Main Quest:** capstone pod diagram, amber "Design proposal ✓ → Build 2027 → Test 2028" | Scroll |
| 48–55 s | **Speedrun banner** | "8 repos shipped · Nov 2026" with 8 repo badges · toast 🏆 *8 repos, one sprint* | Scroll |
| 55–60 s | **Shipping Dock** | Quest Log (16 ✓ · 1 active) · 🔒 Quantum Fab: "Dream: quantum computer hardware" · big **Résumé (PDF)** + contact | Click **Résumé** |

**Note on order:** the fab-line metaphor runs silicon → software. A strict 60-second ranking, though, puts the AI work first (inventory §16, rank 1). Two options:
- **(a)** Keep the true fab order and rely on the title chips and character card to front-load the AI signal.
- **(b)** Play the line in reverse, "from software back to silicon", ending at the Quantum Fab door. That puts the strongest signal first *and* ends on her dream.

**Decided: (b) reversed, software → silicon** (D6). The table above already follows this order: AI → Power & Control → Compiler & EDA → Cleanroom → Quantum Fab door.

### Achievements shortlist (all real facts, max 5)
1. **Shipped to production:** Communitech, on Azure
2. **8 repos, one sprint:** Nov 2026
3. **Azure certified ×2:** AZ-900, AI-900
4. **46/46 traced:** zonecore safety requirements
5. **Cleanroom graduate:** MIS capacitor fabricated and characterised

---

## Open questions: all resolved 2026-11-25 (see inventory D4–D7)

| # | Question | Why it blocks |
|---|---|---|
| Q1 ✅ **Jan–Aug 2027, 8 months** | **Next quest: Summer 2027 or Winter 2027?** The résumé says Summer 2027; the datasheet, Path and contact say Winter 2027 (W27). | It is on the character card and the contact status, and it is the single most important logistics fact for a recruiter. |
| Q2 ✅ **Toronto** | **Location: Toronto or Waterloo?** | It appears on the character card ("home base"). |
| Q3 ✅ **Reversed** | **Track order: silicon → software (true metaphor) or software → silicon (signal-first)?** | It sets the whole station sequence. |
| Q4 ✅ **Yes** | **Is the phone number OK in the public PDF?** | The PDF is linked from every screen. |

## Next step
Product brief (**CB**), built from Concept A, using these answers and the inventory as the source of truth.
