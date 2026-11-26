---
title: 'Story 1.3 · The fact audit blocks invented facts'
type: 'feature'
created: '2026-11-26'
status: 'done'
baseline_commit: 'd62581eb13689e25d19d2f882ce7b0c46bfdbd33'
route: 'dispatch'
review_loop_iteration: 1
context:
  - '{project-root}/_bmad-output/implementation-artifacts/epic-1-context.md'
---

<frozen-after-approval reason="human-owned intent — do not modify unless human renegotiates">

## Intent

**Problem:** Nothing stops an invented number, a teammate's name (D3), a planned course (D8), "Engineering Ambassador" on the new page (D10), or a "built/tested" capstone claim from shipping.

**Approach:** Add `tools/fact_audit.py` (Python ≥3.12, stdlib), run in CI after `astro build`. It reads the visible text of `dist/index.html` and `dist/next/index.html` plus every `src/content/*.json` that exists (none yet = pass). Every numeric token must appear in `docs/content-inventory.md` or `legacy/index.html`. The banned list must be absent, and content-JSON claims must carry a `source`.

**Decisions (Sneha, 2026-11-26):**
- **Teammate names** come from the GitHub Actions secret `BANNED_NAMES`, passed as env `FACT_AUDIT_BANNED_NAMES`. Locally they come from the gitignored `tools/banned_names.local.txt`. Nothing about the names (not even hashes) is committed. Output never prints a name.
- **Captions and Character Lines** need only a non-empty `source` field. Verbatim matching against the inventory is not required (this overrides AD-11's verbatim wording). Numbers still must match.
- **Number corpus** = the raw inventory text plus the legacy page's **visible text** (the same extraction as the site), not its raw HTML. CSS, URLs and SVG coordinates must not count as evidence (Sneha, 2026-11-26, after review).

## Boundaries & Constraints

**Always:**
- **Visible text** = text nodes (including `<title>`/`<desc>`) plus `alt` and `aria-label`. `<script>`/`<style>` are excluded.
- **Numeric token** = `\d+(?:[.,]\d+)*`. It passes when it occurs in the corpus (raw inventory + legacy visible text) with no digit or `[.,]\d` directly before or after.
- **Bans:**
  - teammate names and course codes (PHYS 468, SYDE 572, ECE 457, MTE 544, STAT 341; case-insensitive, flexible whitespace): everywhere, including `/`
  - "Engineering Ambassador": `/next` and content JSON only (legacy `/` is exempt until the cutover)
  - `built` / `tested` / `working device` (word-bounded): inside the capstone entry only (any JSON object with `slug: "capstone"`)
- **Source rule:** in content JSON, every item under the keys `captions`, `characterLine`, `characterLines`, `proofTiles` and `easterEggs` must be an object with a non-empty string `source`. Story 1.4 uses these key names.
- **Allow-list:** `tools/fact_audit_allow.txt`, one `<string>  # <reason>` per line. Listed strings are removed before numbers are tokenized. They never override a ban.
- **Exit codes:**
  - 0 with a summary when everything passes
  - 1 listing each problem as `file: [rule] 'string' … context`, where a name match is masked as `[teammate name #N]`
  - 2 on setup errors: a missing dist page, an allow-list line without a comment, or `CI` set with no names configured. The CI case is a hard failure so the check can never silently skip there.

**Never:**
- Commit the names or their hashes, or print a name.
- Edit `legacy/index.html`, the inventory, or the site's content.
- Add content JSON (that's Story 1.4).
- Commit or push, or change GitHub settings (Sneha adds the secret).

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| Current site | Today's dist, no JSON, names set | Exit 0 | N/A |
| Invented number | Visible text "cut latency 73%" (73 not in corpus) | Exit 1 naming `73` + file + context | N/A |
| Real number | Token found in inventory (e.g. `1,200`) | Pass | N/A |
| Allow-listed | Allow-list has `v2.0  # UI version` and text has it | Pass | Allow-list line without `#` → exit 2 |
| Teammate name | Configured name appears in any page/JSON | Exit 1, name masked | N/A |
| No names | Local, no env/file | Warn "name check skipped", other checks run | Same with `CI=true` → exit 2 |
| Course code | "ece  457b" on `/next` | Exit 1 | N/A |
| Ambassador | On `/next` / on `/` | Exit 1 / pass | N/A |
| Capstone claim | JSON object `slug: "capstone"` with text "we built" | Exit 1 | N/A |
| Missing source | JSON `captions: [{"text": "…"}]` | Exit 1 naming the key path | N/A |

</frozen-after-approval>

## Code Map

- `tools/check_dist.py`, `tools/compare_legacy_text.py`: reuse the `HTMLParser` style, the UTF-8 stdout reconfigure, and the `main(argv) -> int` / exit-2-on-missing-file pattern. Don't change them.
- `tools/test_check_dist.py`: test style to copy (`sys.path` insert, synthetic HTML, `assertFails` helper).
- `docs/content-inventory.md` (512 lines): the corpus. It contains the banned course codes and the word "built" in its own warnings, which is why bans are checked separately from the corpus.
- `legacy/index.html`: the corpus. It has 0 course codes, 0 teammate names, 1 "Engineering Ambassador" (exempt on `/`), and 0 "working device".
- `dist/next/index.html` visible text today: "The Fab Line: work in progress." (no numbers).
- `.github/workflows/ci.yml`: add a step after "Legacy parity and analytics in dist".
- Corpus measurement: raw legacy counts 127 of 1..200 as sourced; legacy visible text counts 55. Today's `/` has 0 tokens missing from the visible corpus.

**Implementation rules from review (loop 1; must hold):**
- **Name masking:**
  - Mask names on the *full* text before cutting a context snippet. Never cut first, then mask.
  - Mask JSON paths and `missing-source` previews too (mask the raw strings before `json.dumps`).
  - Apply the name patterns longest-first, so a first name listed before the full name can't leave the surname unmasked. Keep `#N` numbering in the configured order.
- **Allow-list:**
  - Blank entries only at numeric-token boundaries (`2.0` must not blank inside `12.05`).
  - Parse lines non-greedily: the entry ends at the first `\s+#\s+`, so a `#` inside the reason is fine.
- **Course codes and "Engineering Ambassador":** allow `[\s_-]*` between the parts (`ECE-457`, `Engineering-Ambassador`).
- **Capstone words:** allow an optional plural `s` on `working device`.
- **Tests:** cover `alt`/`aria-label` on self-closing tags (`<img alt="88 dies"/>`, `<path aria-label="77 nm"/>`). Cover each masking case above: a snippet edge cut mid-name, first-name-before-full-name ordering, a name in a JSON key path, and a name with `\n` in a missing-source preview. Add a corpus test showing a number that appears only in legacy markup fails.

## Tasks & Acceptance

**Execution:**
- [x] `tools/fact_audit.py`: the audit per Boundaries. Keep the core testable: `audit(pages: dict, content: dict, corpus: str, allow: list, names: list) -> list[problem]`; `main(argv)` does I/O. Optional args: repo root.
- [x] `tools/fact_audit_allow.txt`: a header comment explaining the format. Add entries only if the current site needs them.
- [x] `tools/test_fact_audit.py`: one unittest per matrix row, plus a check that a name never appears in the output.
- [x] `.github/workflows/ci.yml`: step `Fact audit` → `python tools/fact_audit.py` with `env: FACT_AUDIT_BANNED_NAMES: ${{ secrets.BANNED_NAMES }}`.
- [x] `.gitignore`: `tools/banned_names.local.txt`.
- [x] `README.md`: add the audit to the gate list and the local commands. Add Sneha's one-time step: Settings → Secrets and variables → Actions → New repository secret `BANNED_NAMES`, one name per line (full names and first names), **before** pushing this PR.

**Acceptance Criteria:**
- Given a fresh build and `FACT_AUDIT_BANNED_NAMES` set to dummy names, when `python tools/fact_audit.py` runs, then it exits 0.
- Given `python -m unittest discover -s tools -p "test_*.py"`, when run, then all tests (old and new) pass.
- Given the rest of the Story 1.2 gate, when run, then it still passes.

## Implementation Notes

## Spec Change Log

- **Loop 1 (2026-11-26):**
  - **Trigger:** all three review layers found that the raw-legacy corpus counts markup numbers as evidence (intent_gap), and that name fragments, JSON paths and previews leak names.
  - **Amended:** Sneha's decision, added to the frozen block (corpus = inventory + legacy visible text), plus the "Implementation rules from review" in the Code Map.
  - **Known-bad states avoided:**
    - invented numbers like "88%" passing because an SVG has `y="88"`
    - surname fragments printed in public CI logs
  - **KEEP:**
    - the `audit(pages, content, corpus, allow, names)` core / `main()` I/O split
    - `Problem` with `file: [rule] 'string' … context`
    - the `SetupError` → exit 2 paths
    - `is_ci()` treating `0`/`false`/`no` as not-CI
    - the source-rule walker and the capstone walker over `slug: "capstone"`
    - the `source`-value number exemption
    - CI step placement and env name
    - README sections
    - the 24 existing test cases (update only where a rule changed)

## Review Triage Log

| Layer | Finding | Verdict → route | Evidence |
|---|---|---|---|
| blind-hunter / verification-gap / edge-case-hunter | The number corpus uses raw legacy HTML, so CSS, font URLs and SVG coordinates count as sources | high → intent_gap | Measured: 127 of 1..200 count as sourced with raw legacy vs 55 with `visible_text(legacy)`. The current `/` still passes with the visible corpus. The frozen Boundary says "legacy raw text", so the root cause is inside the frozen block. |
| verification-gap / edge-case-hunter | Name fragments leak: snippets are cut before masking, a first name listed before the full name leaks the surname, JSON-escaped previews and JSON paths are unmasked | high → patch | Reproduced by both layers (e.g. `…eammate ran the…`, `[teammate name #1] Teammate`, `$.Zzqa Teammate:`). Violates the frozen rule "Output never prints a name"; spec clear, code wrong. |
| verification-gap | No test covers `alt`/`aria-label` on self-closing tags (`handle_startendtag`) | medium → patch | Pre-verified: removing that path keeps all 41 tests green. |
| edge-case-hunter / blind-hunter | Allow-list blanks substrings inside bigger numbers (`2.0` inside `12.05`) | medium → patch | Verified by the layer. Fix: replace only at numeric-token boundaries. |
| edge-case-hunter | `ALLOW_LINE` is greedy: a `#` inside the reason corrupts the entry | low → patch | `v2.0  # see #12` parses as entry `v2.0  # see`. Fix: a non-greedy regex (direct correction). |
| blind-hunter / edge-case-hunter | Course code / Ambassador miss hyphen/underscore forms (`ECE-457`) | low → patch | Real. Fix: `[\s_-]*` instead of `\s*` (direct correction). |
| edge-case-hunter | "working devices" (plural) passes the capstone ban | low → patch | Real. Fix: an optional `s` (direct correction). |
| blind-hunter / edge-case-hunter | Only two pages are scanned; new routes are unaudited | low → reject | The intent names exactly `/` and `/next` (AD-11); the game is a single page. |
| blind-hunter / edge-case-hunter | Content glob is flat (`*.json`), misses collection subfolders/yaml | false | The intent and the epic context fix the layout as flat `src/content/*.json`. |
| blind-hunter | Capstone rule is JSON-only | reject | The frozen intent scopes it to the capstone entry in JSON; components get content only through collections. |
| blind-hunter / edge-case-hunter | Meta description/og, `title`/`placeholder` attributes, `<noscript>` not scanned | reject | The intent defines visible text explicitly (AD-11). Link-preview text arrives in Epic 2 and can extend it then. |
| blind-hunter / edge-case-hunter | Unicode NFC/NFD, soft hyphens, and common-word first names | low → reject | Unlikely in hand-written content; the names list is Sneha's choice. |
| blind-hunter | Dependabot/fork PRs lack secrets → exit 2 | low → reject | Neither is enabled; the failure message already names the secret. |
| blind-hunter | Number words ("seventy-three") are not detected | reject | The intent defines numeric tokens as digits. |
| blind-hunter / edge-case-hunter | Any key named `source` skips the number check | low → reject | Unlikely to be misused; `source` values are references and not rendered as claims. |
| edge-case-hunter | `captions`/`proofTiles` as a keyed dict or null is judged wrongly | maybe-false → reject | Story 1.4's schema decides the shape (lists); would only be low. |
| edge-case-hunter | slug `Capstone` (case) or text only on dist pages | low → reject | Slugs are kebab-case lowercase by convention (epic context). |
| edge-case-hunter | Unreadable / non-UTF-8 file → traceback (exit 1, not 2) | low → reject | A loud failure is acceptable behaviour. |
| edge-case-hunter | JSON floats are stringified (`1e21`) | low → reject | The conventions keep numbers as display strings. |
| edge-case-hunter | Allow entries with irregular internal whitespace never match | low → reject | Unlikely; entries are typed as shown on the page. |
| blind-hunter | Missing tests (invalid JSON, `CI=false`, entities, overlapping allows, meta) | low → reject | Simple paths, or covered by other rejected findings. |
| blind-hunter | Spec and sprint-status not in the reviewed diff | false | Excluded deliberately; the spec is the claims file for the edge-case layer. |
| **Round 2 (loop 1)** | | | |
| blind-hunter / edge-case-hunter | Only two pages; flat content glob; meta/`title`/placeholder unscanned; capstone JSON-only or slug variants; Unicode/apostrophes; fork/Dependabot secrets; number words; non-UTF-8 traceback; JSON floats; `main()` stream reconfigure; spec not in the diff | carried | Same claims as the round-1 rows; the code still reads as described. Verdicts kept (reject/false). |
| edge-case-hunter | A BOM in `banned_names.local.txt` or `fact_audit_allow.txt` breaks parsing (fake name, or exit 2 on a valid allow file) | medium → patch | Verified by the layer (exit 2 on a BOM allow file). Windows editors and PowerShell 5.1 write BOMs. Fix: read with `utf-8-sig` (direct correction). |
| edge-case-hunter | Names given comma- or semicolon-separated never match; the check passes setup but does nothing | medium → patch | Real: `parse_names` splits on lines only. The secret is already set, and its format can't be read back. Names never contain `,`/`;`, so splitting on `[,;\n]` is a safe direct fix. |
| verification-gap | No test pins the capstone ban inside nested objects (captions/proofTiles) of the capstone entry | medium → patch | Pre-verified by mutation (dropping the inherited flag keeps every test green). |
| verification-gap | No test pins ban checks on JSON object keys | low → patch | Pre-verified by mutation (deleting the key-unit yield keeps every test green). The fix is tests only. |
| blind-hunter | The corpus token set includes inventory section numbers, list indices and dates | reject | Follows Sneha's corpus decision (raw inventory + legacy visible text); the inventory is the curated fact source. |
| blind-hunter | JSON number `1200` vs corpus `1,200` gives a false failure | low → reject | A loud false failure; conventions keep numbers as display strings. |
| blind-hunter | A dynamic year breaks CI on Jan 1 | false | No page renders the current year. The legacy footer is static, and `/next` has no numbers. |
| blind-hunter | Bare-number allow entries are too broad; the allow-list has no scoping | low → reject | Human-curated, with a mandatory reason; matching is now token-bounded. |
| blind-hunter | Committed files (inventory, `_bmad-output`) are not scanned for names | reject | Outside the intent (built pages + content JSON). |
| edge-case-hunter | A content filename containing a name prints unmasked | low → reject | Collection file names are fixed (profile, quests, …); unlikely. |
| edge-case-hunter | Adjacent inline elements join digits (`<span>1</span><span>200</span>` → `1200`) | low → reject | Rare markup; the corpus and the pages use the same extraction, so the result is a loud false failure. |
| edge-case-hunter | A banned-word match overlapping part of a name prints a fragment | low → reject | Requires a name that is also a banned word, which is implausible. |
| edge-case-hunter | A capstone `source` value or a key containing "built" gives a false failure | low → reject | Source values are references like `inv §6.2`; the result is a loud false failure. |

## Verification

**Commands:**
- `npm run build; $env:FACT_AUDIT_BANNED_NAMES="Zzdummy Name"; python tools/fact_audit.py` -- expected: exit 0
- `Remove-Item Env:FACT_AUDIT_BANNED_NAMES; $env:CI="true"; python tools/fact_audit.py` -- expected: exit 2
- `python -m unittest discover -s tools -p "test_*.py"` -- expected: OK

**Manual checks:**
- After Sneha adds `BANNED_NAMES` and pushes, `ci` is green and the log shows no names.
