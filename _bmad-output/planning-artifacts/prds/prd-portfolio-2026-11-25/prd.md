---
title: "PRD: The Fab Line — Sneha Islam's game portfolio"
status: final
created: 2026-11-25
updated: 2026-11-25
inputs:
  - _bmad-output/planning-artifacts/briefs/brief-portfolio-2026-11-25/brief.md (final)
  - docs/content-inventory.md (§0–§19, decisions D1–D9)
  - _bmad-output/planning-artifacts/brainstorm-game-concepts.md (Concept A, reversed)
---

# PRD: The Fab Line

> **Change D15 (2026-11-25, Sneha):** Recruiter Mode is removed. There is one view with progressive depth: Glance Card → scroll → Inspect. The on-page résumé sheet is removed (Résumé = PDF), early work moves to the Shipping Dock, and the Path moves to the Quest Log. Affected: FR-1, FR-2, FR-18, FR-20, FR-22, FR-23, FR-25, FR-26 (removed), FR-27, FR-28, FR-31, NFR-12, SM-1.

## 0. Document purpose
This PRD is for Sneha, as owner and builder, and for the downstream UX, architecture and epics/stories steps.
- **How it is organised:** features are grouped, with FRs nested under them (FR-1…FR-N, globally numbered). Cross-cutting NFRs are in §6.
- **Vocabulary:** the Glossary in §3 fixes the terms. Use them exactly.
- **Sources:** every content FR carries a **Source** line citing the `index.html` section and the inventory section it comes from (`inv §n`). The inventory is the single source of truth, and this PRD adds **no new facts**.
- **Tech:** stack details and options live in `addendum.md`.
- **Assumptions:** tagged inline and indexed in §10.

## 1. Vision
Sneha Islam's portfolio becomes **The Fab Line**, a short scroll-driven game in which Sneha, the main character, travels her own production line **in reverse, from software back to silicon**. The line starts at the AI systems she shipped, passes through embedded and compiler work, and reaches the cleanroom where she fabricates devices. It ends at a locked door marked *Dream: quantum computer hardware*.

Every stop leads with a diagram, three numbers and one short line. A recruiter learns who she is, what she can do and what she has shipped **in under 60 seconds**. There is **one view, no modes**. The first screen alone gives the whole pitch, scrolling gives the evidence, and depth is one click away. The **résumé PDF is one click from every screen**.

## 2. Target users

### 2.1 Jobs to be done
- **Tech recruiter:** in 60 s, judge role fit, see the top 3 achievements, get the résumé and a way to make contact.
- **Hiring manager:** in 60 s, go deep on 1–2 projects relevant to the team.
- **Panel engineer:** in 60 s, see repos, diagrams and metrics that show real engineering.
- **Sneha (builder):** a portfolio that shows her personality (curious, intelligent, fun, hardworking) and is itself proof of her React/TypeScript skills (D9).

### 2.2 Non-users (v1)
General gamers looking for a challenge; anyone expecting accounts, saves or competition.

### 2.3 Key user journeys
*[ASSUMPTION: these personas were inferred from the brief's three user types; Sneha to confirm or replace them with real recruiter interactions.]*

- **UJ-1. Dana, a tech recruiter, screens 30 co-op candidates before lunch.**
  - She opens a shared link on her laptop and sees the Glance Card: Sneha's portrait, "from silicon to software", *8-month co-op · Jan–Aug 2027*, and three Proof Tiles: **1,200+** companies · **±2%** SoC · **102.6 nm** film.
  - She scrolls once. The Character Card shows *8-month co-op · Jan–Aug 2027 · Toronto*, so the role fits.
  - Two more scrolls show AI in Production (*50+ sources/day, 1,200+ companies*) and Power & Control (*±2% SoC, −35% test time*).
  - She clicks **Résumé** in the HUD and the PDF opens. Total time: about 40 s.
  - **Edge case:** on a phone in a corridor, she reads the Glance Card (availability + 3 proof numbers) and taps **Résumé** without scrolling at all.
- **UJ-2. Omar, a hiring manager on a displays-software team, checks the depth of one project.**
  - From a deep link (`#ai/communitech`) he lands directly on the Communitech Level Card, which leads with its pipeline diagram.
  - He uses **Inspect** to open the metrics, then the full bullets (React/TypeScript UI, personalization, root-causing silent sources).
  - He copies the link for the panel.
- **UJ-3. Lin, an embedded engineer on the panel, verifies the code.**
  - Using the Mini-map she jumps to Power & Control and opens the zonecore Level Card: *46/46 · 32 SIL scenarios · ~3.1k lines*.
  - Inspect leads her to the repo link, and she opens GitHub.

## 3. Glossary
- **Glance Card:** the first screen (the Title Screen). Who, role, availability, 3 Proof Tiles and the Résumé button, ≤30 visible words.
- **Proof Tile:** one of the 3 headline numbers on the Glance Card, each a verbatim inventory fact with a ≤6-word label.
- **Static baseline:** the pre-rendered page as it appears without JavaScript. It is not a mode the visitor chooses. *(Recruiter Mode and Game Mode were removed by D15.)*
- **Track:** the ordered sequence of screens: Title Screen → Character Card → 4 Stations → Speedrun Banner → Shipping Dock → Quantum Fab.
- **Station:** one themed stop on the Track holding Level Cards. It is the "zone" in Sneha's step-04 prompt. There are four, in Track order: **AI in Production** (`ai`), **Power & Control** (`power`), **Compiler & EDA** (`compiler`), **Cleanroom** (`cleanroom`).
- **Level Card:** the card for one work term, project or repo inside a Station.
- **Side Quest:** a smaller Level Card (a course project with no metrics), collapsed by default.
- **Main Quest:** the capstone Level Card. It is always shown as *Active* and *design proposal*, never as built.
- **Inspect:** the action that reveals the next Inspect Layer of a Level Card.
- **Inspect Layer:** one of four depth levels: **L0** diagram + line → **L1** metrics → **L2** bullets → **L3** links.
- **Character Line:** a first-person sentence of ≤12 words that restates a sourced fact. Exactly one per Station.
- **Caption:** one of the 1–2 short sentences on a Level Card, condensed from that card's source bullets without adding facts. The card's short title plus its Captions total **≤25 words** (UX word budget).
- **Quest:** one real item of work. There are **17**: 4 work terms, 5 course projects and 8 repos. Each has a status: **Completed**, **Active** or **Next**.
- **Quest Log:** the timeline of Quests and Path items with their status.
- **Achievement:** a toast unlocked by viewing a specific real fact. There are 5 in total.
- **XP Bar:** the share of the 17 Quests the visitor has viewed.
- **HUD:** the persistent overlay holding Résumé, contact icons, the motion toggle, the Mini-map and progress.
- **Mini-map:** the HUD's compact Track diagram, showing the current location and the Stations visited.
- **Skill Tree:** skills grouped as on the site; each **Skill Node** links to the Level Cards that prove it.
- **Deep Link:** a URL hash `#<station>/<item>` that opens a specific Station or Level Card.
- **Fact Audit:** the build-time check that every number, Character Line and Caption on screen is traceable to the content inventory.

## 4. Information architecture: Track and content map

| Track position | Screen / Station (slug) | Level Cards (Main / Side) | Source in `index.html` |
|---|---|---|---|
| 1 | Title Screen | — | Hero `#top` (inv §1) |
| 2 | Character Card | Interests; coursework as "Training" | About §01 `#about` (inv §3–4); Coursework §05 (inv §8); Skills certs §06 (inv §9) |
| 3 | **AI in Production** (`ai`) | Communitech · The Plug Co · Avanade · muse · facesolve · coa-forge / *Side:* Econ toolkit | Experience §02 (inv §5.1, 5.2, 5.4); Open Source §04 (inv §7); Projects PRJ-003 (inv §6.3) |
| 4 | **Power & Control** (`power`) | Battery WC · zonecore · modcell | Experience §02 (inv §5.3); Open Source §04 (inv §7) |
| 5 | **Compiler & EDA** (`compiler`) | fabricfit · tilec / *Side:* Tensor solver | Open Source §04 (inv §7); Projects PRJ-005 (inv §6.3) |
| 6 | **Cleanroom** (`cleanroom`) | MIS capacitor · vaclab · **Main Quest: capstone** / *Side:* Recycling | Projects PRJ-001, PRJ-002, PRJ-004 (inv §6); Open Source §04 (inv §7) |
| 7 | Speedrun Banner | 8 repo badges | Path §07 "Nov 2026" (inv §10) |
| 8 | Shipping Dock | Quest Log · Résumé · Contact | Path §07, Résumé §08 (inv §11), Contact §09 (inv §12) |
| 9 | Quantum Fab (locked) | — | About §01 ¶4 + Interests "Quantum hardware" (inv §3–4) |

Side Quest placement is by topic (econ → AI, tensor → Compiler, recycling → Cleanroom), and earlier & collaborative work (yunus-AI, Selenium scraper, tic-tac-toe; inv §7) appears as a collapsed "Earlier work" row at the Shipping Dock and is not a Quest. The Path timeline lives in the Quest Log. The on-page HTML résumé sheet is removed; the résumé is the PDF only (D15). The Engineering Ambassador role is **not** on the page; it appears only in the résumé PDF (D10).

## 5. Features

### 5.1 Title Screen (Glance Card)
**Description:** the first screen, and for many recruiters the only one. It gives the whole pitch with zero clicks: who, role, availability, 3 proof numbers and the Résumé. Realizes UJ-1.

#### FR-1: Character intro
The visitor sees Sneha's name, class and one line on first paint.
**Source:** Hero `#top` (inv §1); class label "Nano-Engineer" from Sneha's shared context.
**Acceptance:**
- It shows "Sneha Islam", the class "Nano-Engineer" · University of Waterloo, the line "from silicon to software.", the portrait (D1), and the availability "8-month co-op · Jan–Aug 2027".
- It shows **3 Proof Tiles**, verbatim facts: **1,200+** companies covered by the AI system she shipped (inv §5.1), **±2%** state-of-charge accuracy on the EV battery (inv §5.3), and **102.6 nm** SiNₓ film she fabricated and measured (inv §6.1).
- It shows a large **Résumé** button (opens the PDF, 1 click).
- Visible words total ≤30, excluding button labels.
- All of that text is in the pre-rendered HTML, not in images.

#### FR-2: Start
The visitor can press **▶ Start** (Sneha's choice, D15) or simply scroll.
**Acceptance:**
- **Start**, Space, Enter, ↓ and scrolling all advance to the Character Card.
- Start and Résumé are the only two buttons on the Glance Card. Both are reachable by Tab, have visible focus, and are at least 44×44 px.

### 5.2 Character Card
**Description:** an RPG-style character sheet that replaces the About section. Realizes UJ-1.

#### FR-3: Character stats
The visitor sees the character's core facts.
**Source:** About §01 datasheet (inv §3), Skills §06 certs (inv §9), About interests (inv §4), decisions D4–D5.
**Acceptance:**
- Shows the portrait (`sneha-portrait-256/512.webp`), **University of Waterloo · BASc Nanotechnology Engineering · Nanoelectronics · 3B (Fall 2026)**, Equipment **AZ-900 · AI-900**, Home **Toronto, ON**, Next Quest **8-month co-op · Jan–Aug 2027**, and the 4 interests with their icons (SVG-7).
- No numeric stat, level or score appears that is not in the inventory.

#### FR-4: Training (coursework)
The visitor can expand the 6 completed courses.
**Source:** Coursework §05 (inv §8, D8).
**Acceptance:**
- Lists NE 343, NE 344, NE 332, NE 333, NE 318 and MSE 261 with their topic chips, collapsed by default.
- No planned courses appear.

### 5.3 Track navigation (world / hub)
**Description:** the visitor moves along the Track by scrolling, keyboard or Mini-map. The HUD always shows where they are and how far they have come. Realizes UJ-1 and UJ-3.

#### FR-5: Scroll-as-walk
The visitor advances by scrolling or swiping, and the character's position on the Track follows.
**Acceptance:**
- Each Station occupies at least one viewport.
- Arrival at a Station triggers its entrance animation once.
- Scrolling backwards works.
- Nothing scroll-jacks: native scroll speed is preserved.

#### FR-6: Keyboard travel
The visitor can travel by keyboard alone.
**Acceptance:**
- ↓, PageDown and Space go to the next screen; ↑ and PageUp go to the previous one.
- Tab order follows the Track.
- Focus is never trapped except inside an open Inspect panel, which Esc closes.

#### FR-7: Current location and progress
The visitor always sees where they are.
**Acceptance:**
- The Mini-map highlights the current Station.
- It shows "Stations visited n/4". A Station counts as visited when 50% of it has been in view.
- Progress persists for the session only.

#### FR-8: Jump via Mini-map
The visitor can jump to any Station.
**Acceptance:**
- One click or tap on a Mini-map node scrolls to that Station and updates the URL hash.
- The Quantum Fab node is shown locked and does nothing beyond scrolling to it.

### 5.4 Level Card
**Description:** the unit of content. It leads with a diagram, not prose. Realizes UJ-1, UJ-2 and UJ-3.

#### FR-9: Level Card face (L0)
Each Level Card shows a diagram, up to 3 metrics, tech labels, 1–2 Captions and links.
**Source:** the card's own section; see the §4 table.
**Acceptance:**
- **Order:** title → diagram → 3 metric tiles → Captions → tech labels → links.
- **Metrics:** taken verbatim from the source card's stats or bullets. Fewer than 3 are shown when fewer exist, and none are padded.
- **Qualifiers stay attached:** "simulated" (muse), "projected" (Avanade 40%), "estimate" / "design proposal" (capstone), "fictional scenario" (coa-forge).
- **Tech labels:** text from the source chips. *[ASSUMPTION: text labels with simple glyphs, no third-party brand logos.]*
- **Links:** the repo link where one exists (inv §7). Avanade links to yunus-AI. Cards without a repo show only "Details" (Inspect).

#### FR-10: Diagram first
Every Main Level Card opens with a "how it works" visual.
**Acceptance:**
- **Existing diagrams are reused:** Communitech uses SVG-3/SVG-4, MIS uses SVG-2/SVG-5, and the capstone uses SVG-6.
- **New diagrams** for the cards that have none are drawn only from facts on that card, are SVG, and contain no text that isn't also in the DOM.
- Side Quests may use an icon instead.

#### FR-11: Character Lines
Each Station has exactly one Character Line in the voice "confident, warm, nerdy, concise".
**Acceptance:**
- First person, ≤12 words, and each line passes the Fact Audit.
- Draft lines are in `addendum.md` §B.

#### FR-12: Main Quest (capstone)
The capstone appears as the Active Main Quest.
**Source:** Projects PRJ-002 (inv §6.2, D3).
**Acceptance:**
- Amber Active styling with the stepper **"Design proposal ✓ (Nov 24, 2026) → Build Sep 2027 → Test to Apr 2028"**.
- Sneha's role is labelled "electronics & readout".
- Stats are labelled as estimates.
- No teammate names; it says "4-person team" instead.
- Never uses the words "built", "tested" or "working device".

### 5.5 Inspect
**Description:** curiosity is rewarded with depth on demand. Realizes UJ-2.

#### FR-13: Layered reveal
The visitor can Inspect a Level Card to reveal L1 metrics → L2 bullets → L3 links, one layer per action.
**Source:** L2 bullets are the full original bullets of the source card (inv §5–§7).
**Acceptance:**
- Each layer opens with one click, tap, Enter or Space.
- The layers' content is already in the DOM, not fetched.
- Esc or the close control returns focus to the Inspect button.
- Expanded state is announced to screen readers through `aria-expanded`.

#### FR-14: Easter eggs
At least 3 real-fact easter eggs are discoverable inside Inspect.
**Acceptance:**
- Each easter egg cites its inventory line. Candidates: newsletter sent Mondays 7 AM ET (inv §5.1), E-stop to safe state in 10 ms (inv §7 modcell), and skipping the ~$611 eval kit (inv §6.2).
- None of them is required to understand the core content.

### 5.6 Skill Tree
**Description:** skills as proof, not scores.

#### FR-15: Skill Nodes link to proof
The visitor can open a Skill Tree from the HUD and select a Skill Node to see the Level Cards that use it.
**Source:** Skills §06 (inv §9), the Skills block of the Résumé §08 (inv §11, D11), plus the chips and bullets of each Level Card.
**Acceptance:**
- **Groups:** the 6 groups from §06. Résumé-only skills join the matching group (D11): JavaScript → Languages; HTML/CSS, Tailwind, Vite, Node.js, GraphQL, Figma → Software & Web; GCP, Linux → Cloud & DevOps.
- **Links:** a node links to every Level Card whose chips or bullets name that skill. Nodes with no proving card are shown unlinked and dimmed.
- **No scores:** no levels, bars, percentages or scores appear.
- **Navigation:** selecting a linked card closes the tree and scrolls to the card.

### 5.7 Quest Log
**Description:** the hardworking pillar, made visible.

#### FR-16: Quest statuses
The visitor sees all 17 Quests by status.
**Source:** Path §07 (inv §10), Experience §02, Projects §03, Open Source §04.
**Acceptance:**
- **Counts:** **16 Completed**, **1 Active** (the capstone) and **1 Next** (8-month co-op, Jan–Aug 2027). The Next item is a Path milestone, not one of the 17 Quests.
- **Order and dates:** items are ordered newest first and carry their source dates.
- **No Engineering Ambassador entry** (D10).

#### FR-17: Quest Log access
The Quest Log is reachable from the HUD at any time, and appears inline at the Shipping Dock.
**Acceptance:**
- Opens in one click.
- Each Quest links to its Level Card.

#### FR-18: XP Bar
The HUD shows "Quests viewed n/17".
**Acceptance:**
- **When it counts:** a Quest counts as viewed when its Level Card's L0 has been 50% in view.
- **Wording:** the label never suggests a skill rating.

### 5.8 Speedrun Banner and Shipping Dock

#### FR-19: Speedrun Banner
The visitor sees "8 repos shipped · Nov 2026" with 8 repo badges, each linking to GitHub.
**Source:** Path §07 (inv §10), Open Source §04 (inv §7).
**Acceptance:**
- All 8 names are present and the links match inv §7.

#### FR-20: Shipping Dock
The final screen shows the Quest Log, a large **Résumé (PDF)** button, the contact pitch and links, the availability status, and a collapsed **"Earlier work"** row (yunus-AI, Selenium_Python_BestBuy, tic-tac-toe, with links; inv §7).
**Source:** Contact §09 (inv §12), D2, D4.
**Acceptance:**
- **Availability:** reads "Available · 8-month co-op · Jan–Aug 2027".
- **Contact links:** email (with copy), LinkedIn and GitHub, each matching inv §12.

#### FR-21: Quantum Fab
A locked door ends the Track.
**Source:** About ¶4 and Interests (inv §3–4).
**Acceptance:**
- **Label:** "Dream: quantum computer hardware".
- **Content:** no fake content is behind the door.
- **Interaction:** selecting it shows the line "Not unlocked yet. That's the long-term goal." *[ASSUMPTION: wording.]*

### 5.9 Achievements

#### FR-22: Five achievements
The 5 Achievements unlock on viewing their source:

| Achievement | Unlocks when the visitor views |
|---|---|
| **Shipped to production** | Communitech L0 |
| **8 repos, one sprint** | Speedrun Banner |
| **Azure certified ×2** | Character Card |
| **46/46 traced** | zonecore L0 |
| **Cleanroom graduate** | MIS L0 |

**Acceptance:**
- **Display:** at most one toast is visible at a time. It is dismissed automatically after about 3 s, is announced through a polite `aria-live` region, and never blocks input.
- **Reduced motion:** the toast appears without animation.

### 5.10 Persistent HUD

#### FR-23: HUD contents
Every screen after the Glance Card shows the HUD with **Résumé**, **Email**, **LinkedIn**, **GitHub**, **Motion on/off**, the **Mini-map** and progress (FR-7, FR-18).
**Acceptance:**
- **Résumé:** opens `/Sneha_Islam_Resume.pdf` in a new tab with **1 click**.
- **Contact links:** each is **1 click**.
- **Phone layout:** at 400 px wide the HUD becomes a bottom bar. Résumé and the 3 contact icons stay visible, and the rest moves into a "More" sheet.
- **Overlap:** the HUD never covers a Level Card's metrics.

#### FR-24: Motion toggle
The visitor can turn animation off.
**Acceptance:**
- When turned off, the page behaves like `prefers-reduced-motion`.
- The default follows the OS setting.
- The choice is kept in `localStorage`, wrapped in try/catch.

### 5.11 One view, progressive depth (replaces Recruiter Mode, D15)

#### FR-25: Progressive depth
The visitor gets the pitch with 0 clicks (Glance Card), the evidence by scrolling (0 clicks), and depth on demand (1 click, Inspect).
**Acceptance:**
- **Glance:** the first screen meets FR-1.
- **Scroll:** each Level Card shows only L0 (diagram, ≤3 metrics, ≤25 words).
- **Inspect:** L1–L3 open with one action.
- **Résumé:** 1 click from every screen (FR-23).
- **No mode switch:** there is no Recruiter Mode, Game Mode or `?mode=` parameter.
- **Inspect layers** are native `<details>` disclosures, enhanced into the drawer or sheet when JS runs.

#### FR-26: *(Removed by D15: mode persistence and switching no longer exist.)*

#### FR-27: Works without JavaScript
**Acceptance:**
- With JavaScript disabled, the static baseline shows every screen and every Level Card. Inspect layers open as native `<details>`, and all links work.

### 5.12 Deep links and sharing

#### FR-28: Deep links
**Acceptance:**
- **Format:** `#<station>` and `#<station>/<item>`, e.g. `#ai/communitech`, `#cleanroom/capstone`.
- **On open:** the page scrolls to the target. If it is a Level Card, the card's L1 opens.
- **Unknown hash:** goes to the Title Screen with no error.

#### FR-29: Copy link
Each Level Card has a "Copy link" control that copies its Deep Link and confirms with text. If clipboard access fails, the URL is shown so it can be copied by hand.

### 5.13 Content integrity

#### FR-30: Fact Audit build gate
The build fails if any number or Character Line in the rendered page is missing from `docs/content-inventory.md`, or if banned content appears:
- teammate names
- "built", "tested" or "working device" next to the capstone
- planned course codes

**Acceptance:**
- It runs in CI on every push.
- On failure it reports the offending string and file.
- It is implemented in Python (D9; see the addendum).

#### FR-31: Single content source
All copy and metrics live in one structured content source that the page renders.
**Acceptance:**
- Changing a metric in that source changes it everywhere it appears (Glance Card, Level Card, Inspect), and the Fact Audit checks that same source.

## 6. Cross-cutting non-functional requirements

| ID | Requirement | Measure / acceptance |
|---|---|---|
| NFR-1 | **Static, no backend** | Deploys to Vercel from `main` as static files. No server functions, database or runtime API calls. |
| NFR-2 | **Fast first load** | LCP **<2.0 s** and Lighthouse **Performance ≥90**, both on the mobile profile. First-load transfer **≤600 KB**, excluding the lazy-loaded scene image. *[ASSUMPTION]* |
| NFR-3 | **Small JS** | Total JS **≤100 KB gzipped** *[ASSUMPTION]*. No 3D, physics or game engine. |
| NFR-4 | **Optimised media** | Diagrams are inline SVG; the character art is WebP (D1); images below the fold are lazy-loaded. Fonts are self-hosted and subset *[ASSUMPTION]*, so no third-party requests are made. |
| NFR-5 | **Mobile and touch** | Works from 360 px wide with no horizontal scroll. Touch targets are ≥44×44 px. Swipe and tap cover every action. |
| NFR-6 | **Keyboard** | All features work by keyboard. Focus is always visible, and a skip link jumps to the main content. |
| NFR-7 | **Reduced motion** | `prefers-reduced-motion` or the Motion toggle removes all non-essential animation, with no content lost. |
| NFR-8 | **Accessibility** | WCAG 2.1 **AA** (text contrast ≥4.5:1, UI ≥3:1). Lighthouse **Accessibility ≥90**. Diagrams have `role="img"` and `aria-label` or adjacent text. |
| NFR-9 | **Real text, SEO and previews** | All content is in the pre-rendered DOM. `<title>` reads "Sneha Islam — Nanotechnology Engineering · Software & AI" (inv §1). Includes a meta description and Open Graph / Twitter tags. The OG image is a crop of the D1 art with no baked-in text *[ASSUMPTION]*. |
| NFR-10 | **Privacy and analytics** | No cookies and no third-party trackers. The only analytics is **Vercel Web Analytics** (cookie-less page views, same-origin script, free Hobby plan; D12). It must not delay first paint, so it is loaded with `defer`. `localStorage` is used only for the mode and motion preferences. |
| NFR-11 | **Browsers** | Latest two versions of Chrome, Edge, Firefox and Safari, plus iOS Safari 16+ *[ASSUMPTION]*. |
| NFR-12 | **Resilience** | A JS error in the game layer must not hide content; the static baseline stays usable (FR-27). |

## 7. Not building (explicit)
- Sound design or music. No audio at all in v1.
- Multiplayer, leaderboards, accounts, login or saved games.
- A 3D engine, WebGL scenes, physics or a canvas-based renderer.
- A backend, serverless functions, contact forms, a CMS or a database.
- Paid analytics, cookies, third-party trackers or session recording. Only free, cookie-less Vercel Web Analytics is used (D12).
- New character art **beyond** the 4-state sprite that Sneha supplies (idle, walk, thinking, celebrate; D13). No redrawing of the D1 illustration.
- Any stat, level or score that is not a real count from the inventory.
- Any content beyond the inventory: no new projects, quotes, testimonials or numbers.
- A separate mobile app or PWA install.
- Multiple languages.

## 8. Success metrics
**Post-launch signal (D12):** Vercel Web Analytics page views, used to see whether visitors arrive and on which devices. It is not a release gate.

**Primary (release gate)**
- **SM-1: Résumé reached in ≤2 clicks** from every screen. The design target is 1. Validates FR-23 and FR-20.
- **SM-2: Any Level Card's key metric visible in ≤3 clicks** from the Title Screen (Mini-map → Station → card). Validates FR-8, FR-9 and FR-13.
- **SM-3: Works on a phone.** Every FR passes manually at 400 px on iOS Safari and Android Chrome. Validates NFR-5.
- **SM-4: Lighthouse Performance ≥90 and Accessibility ≥90** (mobile) on the deployed URL. Validates NFR-2 and NFR-8.
- **SM-5: 0 Fact Audit violations** at release. Validates FR-30.

**Pillar checks (from the brief)**
- **Curious:** 100% of Main Level Cards have Inspect L0–L3, and there are ≥3 easter eggs.
- **Intelligent:** 100% of Main Level Cards lead with a diagram, and no game-view paragraph exceeds 40 words.
- **Fun:** one Character Line of ≤12 words per Station, 5 Achievements, and no sound.
- **Hardworking:** the Quest Log shows 16 Completed / 1 Active / 1 Next exactly.

**Counter-metrics (do not optimise)**
- **SM-C1: Time on site.** A recruiter leaving for the résumé in 40 s is a success. Don't add friction to keep them on the page.
- **SM-C2: Number of animations and achievements.** More is not better, and the cap of 5 achievements stands.

## 9. Open questions
All four draft questions were resolved by Sneha on 2026-11-25:
- **Q1:** the Engineering Ambassador role is not in the game (D10), so there are 17 Quests (16 Completed / 1 Active). It remains in the résumé.
- **Q2:** the résumé-only skills join the Skill Tree (D11).
- **Q3:** Side Quest placement and Recruiter-Mode-only early work are confirmed.
- **Q4:** free, cookie-less Vercel Web Analytics is included in v1 (D12). *(Updated after finalization at Sneha's request.)*

No open questions remain.

## 10. Assumptions index
- §2.3: the UJ personas (Dana, Omar, Lin) are illustrative.
- FR-9: tech labels are text with glyphs, not brand logos.
- FR-21: the Quantum Fab line's wording.
- NFR-2: LCP measured on mobile; ≤600 KB first load.
- NFR-3: ≤100 KB JS gzipped.
- NFR-4: self-hosted fonts.
- NFR-9: OG image is a crop of the art with no text.
- NFR-11: browser support matrix.
