# Sprint Change Proposal: Sound effects (D17)

**Date:** 2026-11-27 · **Status:** APPROVED by Sneha (2026-11-27), edits applied · **Requested by:** Sneha · **Mode:** Batch · **Scope:** Moderate (one new story plus document amendments; no rework)

## 1. Issue summary

**Trigger:** Sneha asked on 2026-11-27, during Epic 2 (after Story 2.3), that the game have **sound effects inspired by Minecraft**. This is a new stakeholder requirement, not a defect.

**Conflict:** the plan currently excludes all audio:
- PRD §7: "Sound design or music. No audio at all in v1."
- PRD §8 Fun pillar: "…and no sound."
- The brief lists sound design as out of scope for v1.

UX §9 already forbids *autoplaying* sound, and that rule stays.

**Decisions already taken by Sneha:**
- The sounds are **synthesized in code** (Web Audio API, no audio files).
- The change is **added to the plan now**, as a story in Epic 8 (Delight).

## 2. Impact analysis

- **Epics:**
  - **Epic 8** gains one story, **8.6**.
  - No epic is invalidated, re-ordered or re-prioritised.
  - Epics 1–2 (done or in progress) need no rework.
- **Stories:**
  - **2.4** (store): unchanged. 8.6 adds `sound` to the same store later.
  - **2.5** (HUD): unchanged. Its "More" menu gets a Sound item in 8.6.
  - 8.6 depends on 2.4, 2.5, 3.6 (Inspect), 8.1 (achievements), 8.2 (sprite walk) and 8.5 (locked door), so it is the **last** Epic 8 story.
- **PRD:**
  - §7 (Not building)
  - §8 (Fun pillar)
  - the §3 glossary (HUD)
  - NFR-10 (`localStorage` use)
  - a new **FR-32** under §5.10
- **UX (EXPERIENCE.md):**
  - §6 HUD "More" menu
  - a new sound-cue table in §9; the "never autoplaying sound" rule stays
  - §10 (no information by sound alone)
- **Architecture:**
  - AD-5 store gains `sound`
  - new **AD-14** (one sound switch, one sound module, lazy-loaded)
  - a capability-map row
- **Content inventory:** new **D17**.
- **Budgets:**
  - 0 bytes by default: the sound module is fetched only after the visitor turns sound on.
  - The chunk is ≤3 KB gzip, so the total JS stays within ≤100 KB.
  - No audio assets, so no change to the 600 KB transfer budget.
- **Legal / originality:** sounds are original and synthesized. No Minecraft audio files, samples or note-for-note recreations of its specific sounds. Only the general "blocky, short, earthy" feel is borrowed, the same way the Block Biome visuals are genre-inspired.
- **Not changed:** the brief, which is a historical record superseded by D17; legacy `/`; CI.

## 3. Recommended approach

**Direct adjustment (Option 1): viable, low effort, low risk.** Add D17, amend four documents, and append Story 8.6.
- Rollback: not applicable; nothing built conflicts.
- MVP review: not needed; the MVP and SM-1…SM-5 are unaffected, because sound is opt-in and off by default.
- **Timeline:** +1 story (about 1 evening) in Epic 8. The launch cutover (3.11) is unaffected.

## 4. Detailed change proposals

### 4.1 `docs/content-inventory.md`: new D-table row (after D16)

```
| D17 | **Sound effects** (2026-11-27) | Original, **Minecraft-inspired** sound effects: short, blocky, earthy cues (block place, wooden thunk, soft pop, footsteps, knock). **Synthesized at runtime with the Web Audio API**, with no audio files, and never real Minecraft sounds or recreations of them. **Off by default**: turned on only from the HUD "More" menu (Sound on/off), remembered in `localStorage`. No music, no loops, no autoplay, and no information conveyed by sound alone. Supersedes PRD §7 "no audio in v1". | No: legacy `/` is frozen |
```

### 4.2 PRD (`prds/prd-portfolio-2026-11-25/prd.md`)

**§3 Glossary, HUD.** OLD: "…Résumé, contact icons, the motion toggle, the Mini-map and progress." NEW: "…Résumé, contact icons, the motion and sound toggles, the Mini-map and progress."

**§5.10: add after FR-24:**

```
#### FR-32: Sound effects (D17)
The visitor can turn on short, original, Minecraft-inspired sound effects.
**Acceptance:**
- **Off by default** on every first visit; turned on/off from the HUD "More" menu; the choice is kept in `localStorage`, wrapped in try/catch.
- **Synthesized** with the Web Audio API at runtime; no audio files are shipped. Never real Minecraft sounds or recreations of them.
- **Cues (each ≤300 ms):** ▶ Start = block place · Inspect open = wooden thunk · Achievement = soft pop · sprite walking = quiet footsteps (at most one per 350 ms) · locked Quantum Fab door = two dull knocks.
- **Never** autoplays, never plays music or loops, and never carries information that isn't also shown on screen.
- Footsteps follow the sprite: none when motion is off.
- Zero cost when off: the sound code loads only after the visitor turns sound on.
```

**§6 NFR-10.** OLD: "`localStorage` is used only for the mode and motion preferences." NEW: "`localStorage` is used only for the motion and sound preferences." (The "mode" preference no longer exists after D15.)

**§7 Not building.** OLD: "Sound design or music. No audio at all in v1." NEW: "Music, ambient loops, voice or recorded audio files. Sound is limited to the opt-in synthesized effects of FR-32 (D17)."

**§8 Fun pillar.** OLD: "…5 Achievements, and no sound." NEW: "…5 Achievements, and sound **off by default** (FR-32)."

### 4.3 UX (`ux-designs/ux-portfolio-2026-11-25/EXPERIENCE.md`)

**§6 HUD row.** OLD: "'More' opens a menu: Motion on/off · Skill Tree · Quest Log." NEW: "'More' opens a menu: Motion on/off · Sound on/off · Skill Tree · Quest Log. Sound is off by default (D17)."

**§9: add after the motion table:**

```
**Sound cues (D17, FR-32; all off by default, synthesized, ≤300 ms, master volume ≤30%):**

| Cue | Trigger | Character |
|---|---|---|
| Place | ▶ Start | Short filtered-noise click + low thud, like setting down a block |
| Thunk | Inspect opens | Hollow wooden knock, a slight pitch drop |
| Pop | Achievement unlocks | Two-note rising blip, soft attack |
| Step | Sprite walk frame (max 1 / 350 ms; none when motion is off) | Very quiet gravel crunch, slight random pitch |
| Knock | Locked door selected | Two dull taps |
```

**§10 Accessibility floor: add:** "Sound never carries information that isn't also on screen; the Sound toggle is a keyboard-reachable `aria-pressed` button."

### 4.4 Architecture (`architecture/architecture-portfolio-2026-11-25/ARCHITECTURE-SPINE.md`)

**AD-5 rule, the store.** OLD: "holds `motion`, `currentStation`, …" NEW: "holds `motion`, `sound`, `currentStation`, …". The sound preference also uses `localStorage`.

**New AD-14 (after AD-13):**

```
### AD-14: One sound switch, one sound module *(D17)*
- **Binds:** FR-32, UX §9 sound cues
- **Prevents:** sounds that play while off, audio files creeping in, sound code costing bytes for visitors who never enable it
- **Rule:** `src/game/sound.ts` is the only audio code. It synthesizes every cue with Web Audio (oscillators + filtered noise) and exposes `playCue(name)`. Islands call `playCue` only via a tiny wrapper that is a no-op while `state.sound` is false; `sound.ts` is dynamically imported on the first switch-on, and the `AudioContext` is created inside that user gesture. No files under `public/` are audio. Chunk ≤3 KB gzip.
```

**Capability → Architecture Map: add a row:** `| Sound effects (FR-32) | game/sound.ts + HUD "More" toggle | AD-5, AD-14 |`

### 4.5 Epics (`epics.md`)

**Requirements inventory: add** "FR32: Sound effects (D17): opt-in, off by default, synthesized Minecraft-inspired cues; no files, no music, no autoplay." **Coverage map: add** "FR32: Epic 8".

**Epic 8 summary.** OLD: "Achievements, Sneha's sprite, the world coming alive, and real-fact easter eggs. Every effect respects the motion switch. **Stories:** 5". NEW: "Achievements, Sneha's sprite, the world coming alive, real-fact easter eggs, and opt-in sound effects. Every effect respects the motion switch, and every sound the sound switch. **Stories:** 6". The same edit applies to the Epic 8 section intro.

**New story (appended after 8.5):**

```
### Story 8.6: Sound effects, off by default *(D17)*

As a recruiter who enjoys the game,
I want short, blocky sound effects I can switch on,
So that the world feels alive without ever surprising me with noise.

**Acceptance Criteria:**

**Given** the HUD "More" menu
**When** it opens
**Then** it shows a **Sound on/off** `aria-pressed` button (labels from `ui.json`) next to Motion; sound is **off** by default, `setSound` in `state.ts` is the only way to change it, and the choice persists at `localStorage["fabline:sound"]` via `storage.ts` (blocked storage → off) (FR-32, AD-5)

**Given** sound is off (the default)
**When** any cue would fire
**Then** nothing plays, no `AudioContext` exists, and `src/game/sound.ts` has not been fetched (verified in the Network panel and by a Vitest test of the wrapper) (AD-14)

**Given** the visitor turns sound on
**When** they press ▶ Start, open Inspect, unlock an Achievement, walk the Track, or select the locked door
**Then** the matching cue plays per UX §9 (Place, Thunk, Pop, Step ≤1 / 350 ms and none when motion is off, Knock), each ≤300 ms at master gain ≤0.3
**And** every cue is synthesized (oscillators + filtered noise); no audio file exists in the repo, and the PR notes confirm no Minecraft samples or recreations were used (D17)
**And** no cue loops, nothing autoplays, and no information is conveyed by sound alone

**Given** the CI gate
**When** the PR runs
**Then** the sound chunk is ≤3 KB gzip, total JS ≤100 KB, and Lighthouse a11y ≥0.9
**And** Sneha signs off on how the cues sound in the Vercel Preview before merge
```

### 4.6 `sprint-status.yaml`

Add under `epic-8`, after `8-5-…`: `8-6-sound-effects-off-by-default: backlog`

## 5. Implementation handoff

- **Scope: Moderate.** It adds one story to the backlog; nothing is re-planned.
- **This session (Developer agent):** apply §4.1–4.6 exactly as approved; no code changes now.
- **Later:** Story 8.6 is built with `bmad-build` after 8.5.
- **Success criteria:**
  - The documents no longer contradict each other on sound.
  - Story 8.6 is in `epics.md` and `sprint-status.yaml` as backlog.
  - D17 is the single source of the decision.
