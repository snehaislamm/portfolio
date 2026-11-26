"""Fact audit: block invented facts on the built site and in content JSON (Python stdlib only).

Usage: python tools/fact_audit.py [repo-root]

Scans the visible text of dist/index.html and dist/next/index.html plus every
src/content/*.json that exists (none yet = pass), and checks:

  number          every numeric token (\\d+(?:[.,]\\d+)*) occurs in the corpus
                  (docs/content-inventory.md raw text + the visible text of legacy/index.html),
                  after the allow-list strings (tools/fact_audit_allow.txt) are blanked
                  (JSON values under machine keys such as source, sort, slug, id, href and url are
                  identifiers, not claims: skipped here, but still checked for every ban)
  teammate-name   no configured teammate name, anywhere (names are never printed)
  course-code     no planned course code (PHYS 468, SYDE 572, ECE 457, MTE 544, STAT 341), anywhere
  ambassador      no "Engineering Ambassador" on /next or in content JSON (legacy / is exempt)
  capstone-claim  no "built" / "tested" / "working device" inside a JSON object with slug "capstone"
  missing-source  every item under captions / characterLine(s) / proofTiles / easterEggs in content
                  JSON is an object with a non-empty string "source"

Visible text = text nodes (including <title>/<desc>) plus alt and aria-label; <script>/<style> excluded.

Teammate names: env FACT_AUDIT_BANNED_NAMES (CI, from the BANNED_NAMES secret), else the gitignored
tools/banned_names.local.txt; one name per line or comma-separated. Without names the check is skipped with a warning
locally, and is a setup error when CI is set.

Exits 0 when everything passes, 1 listing each problem, 2 on setup errors.
"""

from __future__ import annotations

import json
import os
import re
import sys
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path
from typing import Any, Iterator

PAGES = ("index.html", "next/index.html")
LEGACY_PAGE = "index.html"  # dist page that serves the frozen legacy markup (Ambassador-exempt)
INVENTORY = "docs/content-inventory.md"
LEGACY = "legacy/index.html"
ALLOW_FILE = "tools/fact_audit_allow.txt"
NAMES_FILE = "tools/banned_names.local.txt"
NAMES_ENV = "FACT_AUDIT_BANNED_NAMES"
CONTENT_GLOB = "src/content/*.json"

SKIP = {"script", "style"}
TEXT_ATTRS = ("alt", "aria-label")
BLOCK = {
    "address", "article", "aside", "blockquote", "br", "dd", "desc", "div", "dl", "dt",
    "figcaption", "figure", "footer", "h1", "h2", "h3", "h4", "h5", "h6",
    "header", "hr", "li", "main", "nav", "ol", "p", "pre", "section", "table",
    "tbody", "td", "tfoot", "th", "thead", "title", "tr", "ul",
}

NUMBER = re.compile(r"\d+(?:[.,]\d+)*")
COURSE_CODES = ("PHYS 468", "SYDE 572", "ECE 457", "MTE 544", "STAT 341")
COURSE = re.compile(
    "|".join(rf"(?<![a-z]){code.split()[0]}[\s_-]*{code.split()[1]}(?!\d)" for code in COURSE_CODES),
    re.IGNORECASE,
)
AMBASSADOR = re.compile(r"\bengineering[\s_-]*ambassadors?\b", re.IGNORECASE)
CAPSTONE_WORDS = re.compile(r"\b(?:built|tested|working[\s_-]*devices?)\b", re.IGNORECASE)
SOURCE_KEYS = ("captions", "characterLine", "characterLines", "proofTiles", "easterEggs")
# Values under these keys are citations or machine identifiers (dates.sort "2025-09", ids, slugs, URLs),
# not claims: they are skipped for numbers but still checked for every ban.
NUMBER_EXEMPT_KEYS = frozenset({"source", "sort", "slug", "station", "kind", "status", "id", "unlock", "href", "url",
                                "quest", "quests", "reuse", "email"})
CAPSTONE_SLUG = "capstone"
# The entry ends at the first whitespace-#-whitespace, so a "#" inside the reason is fine.
ALLOW_LINE = re.compile(r"^(.+?)\s+#\s+(\S.*)$")
CONTEXT = 30


class SetupError(Exception):
    """A configuration problem: exit 2."""


@dataclass(frozen=True)
class Problem:
    file: str
    rule: str
    string: str
    context: str

    def __str__(self) -> str:
        return f"{self.file}: [{self.rule}] {self.string!r} … {self.context}"


# --- visible text ------------------------------------------------------------


class VisibleText(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.skip_depth = 0
        self.parts: list[str] = []

    def _attrs(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in BLOCK:
            self.parts.append("\n")
        for name, value in attrs:
            if name in TEXT_ATTRS and value:
                self.parts.append(f"\n{value}\n")

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in SKIP:
            self.skip_depth += 1
            return
        self._attrs(tag, attrs)

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag not in SKIP:
            self._attrs(tag, attrs)

    def handle_endtag(self, tag: str) -> None:
        if tag in SKIP:
            self.skip_depth = max(0, self.skip_depth - 1)
        elif tag in BLOCK:
            self.parts.append("\n")

    def handle_data(self, data: str) -> None:
        if not self.skip_depth:
            self.parts.append(data)


def visible_text(html: str) -> str:
    parser = VisibleText()
    parser.feed(html)
    parser.close()
    return "".join(parser.parts)


def build_corpus(inventory: str, legacy_html: str) -> str:
    return f"{inventory}\n{visible_text(legacy_html)}"


# --- names / masking -----------------------------------------------------------


def name_pattern(names: list[str]) -> re.Pattern[str] | None:
    """One alternation, longest name first; group n<N> is the N-th configured name (0-based)."""
    if not names:
        return None
    order = sorted(range(len(names)), key=lambda i: len(names[i]), reverse=True)
    alts = []
    for i in order:
        words = [re.escape(w) for w in names[i].split()]
        alts.append(rf"(?P<n{i}>(?<!\w){r'[\s_-]+'.join(words)}(?!\w))")
    return re.compile("|".join(alts), re.IGNORECASE)


class Masked:
    """`text` with every name replaced by [teammate name #N]; snippets are cut from the masked text."""

    def __init__(self, text: str, pattern: re.Pattern[str] | None) -> None:
        self.matches: list[tuple[int, int, int]] = []  # (start, end, N) in the original
        self._spans: list[tuple[int, int, int, int]] = []  # (orig_start, orig_end, masked_start, masked_end)
        pieces: list[str] = []
        pos = out = 0
        if pattern is not None:
            for m in pattern.finditer(text):
                n = int(m.lastgroup[1:]) + 1  # type: ignore[index]
                token = f"[teammate name #{n}]"
                pieces.append(text[pos:m.start()])
                out += m.start() - pos
                self._spans.append((m.start(), m.end(), out, out + len(token)))
                self.matches.append((m.start(), m.end(), n))
                pieces.append(token)
                out += len(token)
                pos = m.end()
        pieces.append(text[pos:])
        self.text = "".join(pieces)

    def _map(self, i: int, *, is_end: bool) -> int:
        delta = 0
        for o_start, o_end, m_start, m_end in self._spans:
            if (i <= o_start) if is_end else (i < o_start):
                break
            if (i <= o_end) if is_end else (i < o_end):
                return m_end if is_end else m_start  # inside a name: snap to its whole mask
            delta = m_end - o_end
        return i + delta

    def context(self, start: int, end: int) -> str:
        """Snippet around original [start, end), cut from the already-masked text."""
        ms, me = self._map(start, is_end=False), self._map(end, is_end=True)
        snippet = self.text[max(0, ms - CONTEXT): me + CONTEXT]
        return " ".join(snippet.split())


def mask(text: str, pattern: re.Pattern[str] | None) -> str:
    return Masked(text, pattern).text


def mask_value(value: Any, pattern: re.Pattern[str] | None) -> Any:
    if isinstance(value, str):
        return mask(value, pattern)
    if isinstance(value, list):
        return [mask_value(v, pattern) for v in value]
    if isinstance(value, dict):
        return {mask(k, pattern): mask_value(v, pattern) for k, v in value.items()}
    return value


# --- allow-list ----------------------------------------------------------------


def parse_allow(text: str) -> list[str]:
    entries = []
    for lineno, raw in enumerate(text.splitlines(), 1):
        line = raw.strip()
        if not line or line.startswith("#"):
            continue
        m = ALLOW_LINE.match(line)
        if not m:
            raise SetupError(f"{ALLOW_FILE}:{lineno}: entry has no '  # <reason>' comment")
        entries.append(m.group(1))
    return entries


def blank_allowed(text: str, allow: list[str]) -> str:
    """Replace allow-listed strings with spaces, only at numeric-token boundaries."""
    for entry in sorted(allow, key=len, reverse=True):
        pattern = re.compile(rf"(?<!\d)(?<!\d[.,]){re.escape(entry)}(?!\d)(?![.,]\d)")
        text = pattern.sub(lambda m: " " * len(m.group(0)), text)
    return text


# --- checks --------------------------------------------------------------------


@dataclass
class Unit:
    """One piece of text to audit: a page's visible text or one JSON string."""

    file: str
    text: str
    path: str = ""  # JSON path (already masked) for content strings
    numbers: bool = True  # False for values under NUMBER_EXEMPT_KEYS
    ambassador: bool = True
    capstone: bool = False


def check_unit(unit: Unit, corpus_tokens: set[str], allow: list[str], names: re.Pattern[str] | None) -> list[Problem]:
    masked = Masked(unit.text, names)
    prefix = f"{unit.path}: " if unit.path else ""
    problems: list[Problem] = []

    def add(rule: str, start: int, end: int) -> None:
        string = mask(unit.text[start:end], names)
        problems.append(Problem(unit.file, rule, string, prefix + masked.context(start, end)))

    for start, end, n in masked.matches:
        problems.append(
            Problem(unit.file, "teammate-name", f"[teammate name #{n}]", prefix + masked.context(start, end))
        )
    for m in COURSE.finditer(unit.text):
        add("course-code", m.start(), m.end())
    if unit.ambassador:
        for m in AMBASSADOR.finditer(unit.text):
            add("ambassador", m.start(), m.end())
    if unit.capstone:
        for m in CAPSTONE_WORDS.finditer(unit.text):
            add("capstone-claim", m.start(), m.end())
    if unit.numbers:
        for m in NUMBER.finditer(blank_allowed(unit.text, allow)):
            if m.group(0) not in corpus_tokens:
                add("number", m.start(), m.end())
    return problems


def scalar_text(value: Any) -> str | None:
    if isinstance(value, bool) or value is None:
        return None
    if isinstance(value, (int, float)):
        return str(value)
    if isinstance(value, str):
        return value
    return None


def json_units(file: str, data: Any, names: re.Pattern[str] | None) -> Iterator[Unit]:
    def walk(value: Any, path: str, key: str | None, capstone: bool) -> Iterator[Unit]:
        if isinstance(value, dict):
            capstone = capstone or value.get("slug") == CAPSTONE_SLUG
            for k, v in value.items():
                kpath = f"{path}.{mask(k, names)}"
                # Keys are scanned for bans only (names, codes, …), never as number claims.
                yield Unit(file, k, kpath, numbers=False, capstone=capstone)
                yield from walk(v, kpath, k, capstone)
        elif isinstance(value, list):
            for i, v in enumerate(value):
                yield from walk(v, f"{path}[{i}]", key, capstone)
        else:
            text = scalar_text(value)
            if text is not None:
                yield Unit(file, text, path, numbers=key not in NUMBER_EXEMPT_KEYS, capstone=capstone)

    yield from walk(data, "$", None, False)


def source_problems(file: str, data: Any, names: re.Pattern[str] | None) -> list[Problem]:
    problems: list[Problem] = []

    def item_ok(item: Any) -> bool:
        return isinstance(item, dict) and isinstance(item.get("source"), str) and bool(item["source"].strip())

    def report(item: Any, path: str) -> None:
        preview = json.dumps(mask_value(item, names), ensure_ascii=False)
        if len(preview) > 80:
            preview = preview[:77] + "..."
        problems.append(Problem(file, "missing-source", preview, path))

    def walk(value: Any, path: str) -> None:
        if isinstance(value, dict):
            for k, v in value.items():
                kpath = f"{path}.{mask(k, names)}"
                if k in SOURCE_KEYS:
                    items = v if isinstance(v, list) else [v]
                    for i, item in enumerate(items):
                        ipath = f"{kpath}[{i}]" if isinstance(v, list) else kpath
                        if not item_ok(item):
                            report(item, ipath)
                walk(v, kpath)
        elif isinstance(value, list):
            for i, v in enumerate(value):
                walk(v, f"{path}[{i}]")

    walk(data, "$")
    return problems


def corpus_tokens(corpus: str) -> set[str]:
    # A token is sourced when it occurs in the corpus with no digit or [.,]\d directly before or
    # after it, i.e. when it is a whole numeric token of the corpus.
    return set(NUMBER.findall(corpus))


def audit(pages: dict[str, str], content: dict[str, Any], corpus: str, allow: list[str], names: list[str]) -> list[Problem]:
    """`pages` maps a dist-relative path to its HTML; `content` maps a content file name to parsed JSON."""
    tokens = corpus_tokens(corpus)
    pattern = name_pattern(names)
    problems: list[Problem] = []
    for name, html in pages.items():
        unit = Unit(name, visible_text(html), ambassador=name != LEGACY_PAGE)
        problems += check_unit(unit, tokens, allow, pattern)
    for name, data in content.items():
        for unit in json_units(name, data, pattern):
            problems += check_unit(unit, tokens, allow, pattern)
        problems += source_problems(name, data, pattern)
    return problems


# --- I/O -----------------------------------------------------------------------


def is_ci(env: dict[str, str] | os._Environ[str] = os.environ) -> bool:
    return env.get("CI", "").strip().lower() not in ("", "0", "false", "no")


def parse_names(text: str) -> list[str]:
    """Names separated by newlines, commas or semicolons; blank and `#` lines skipped, de-duplicated."""
    names: list[str] = []
    seen: set[str] = set()
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        for part in re.split(r"[,;]", line):
            name = " ".join(part.split())
            if name and name.casefold() not in seen:
                seen.add(name.casefold())
                names.append(name)
    return names


def load_names(root: Path, env: dict[str, str] | os._Environ[str] = os.environ) -> list[str]:
    names = parse_names(env.get(NAMES_ENV, ""))
    if not names and (root / NAMES_FILE).is_file():
        names = parse_names((root / NAMES_FILE).read_text(encoding="utf-8-sig"))
    return names


def main(argv: list[str], env: dict[str, str] | os._Environ[str] = os.environ) -> int:
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8", errors="replace")
    if len(argv) > 2:
        print(__doc__.strip(), file=sys.stderr)
        return 2
    root = Path(argv[1]) if len(argv) > 1 else Path(__file__).resolve().parents[1]
    try:
        missing = [root / p for p in (INVENTORY, LEGACY, *(f"dist/{p}" for p in PAGES)) if not (root / p).is_file()]
        if missing:
            raise SetupError("; ".join(f"{p} not found" for p in missing) + " (run `npm run build` first?)")
        allow_path = root / ALLOW_FILE
        allow = parse_allow(allow_path.read_text(encoding="utf-8-sig")) if allow_path.is_file() else []
        names = load_names(root, env)
        if not names:
            if is_ci(env):
                raise SetupError(
                    f"no teammate names configured: set the BANNED_NAMES repository secret "
                    f"(passed as {NAMES_ENV}); the name check must not be skipped in CI"
                )
            print(f"warning: name check skipped (set {NAMES_ENV} or create {NAMES_FILE})", file=sys.stderr)
        pages = {p: (root / "dist" / p).read_text(encoding="utf-8-sig") for p in PAGES}
        content_files = sorted(root.glob(CONTENT_GLOB))
        content = {}
        for path in content_files:
            try:
                content[path.relative_to(root).as_posix()] = json.loads(path.read_text(encoding="utf-8-sig"))
            except json.JSONDecodeError as exc:
                raise SetupError(f"{path.relative_to(root).as_posix()}: invalid JSON ({exc.msg} at line {exc.lineno})")
        corpus = build_corpus((root / INVENTORY).read_text(encoding="utf-8-sig"), (root / LEGACY).read_text(encoding="utf-8-sig"))
    except SetupError as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 2

    problems = audit(pages, content, corpus, allow, names)
    if problems:
        print(f"FAIL: fact audit found {len(problems)} problem(s)", file=sys.stderr)
        for problem in problems:
            print(f"  - {problem}", file=sys.stderr)
        return 1
    name_note = f"{len(names)} teammate name(s) checked" if names else "name check skipped"
    print(
        f"OK: fact audit passed for {len(pages)} page(s) and {len(content)} content file(s); "
        f"{len(allow)} allow-list entr{'y' if len(allow) == 1 else 'ies'}; {name_note}"
    )
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
