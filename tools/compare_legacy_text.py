"""Compare the visible text of two HTML files (Python stdlib only).

Usage: python tools/compare_legacy_text.py legacy/index.html dist/index.html

Visible text = text nodes outside <script> and <style>, whitespace-normalised.
Exits 0 when both files show the same text; exits 1 and prints a diff otherwise.
"""

from __future__ import annotations

import difflib
import sys
from html.parser import HTMLParser
from pathlib import Path

SKIP = {"script", "style"}
# Block-level boundaries: text either side of these is on separate lines.
BLOCK = {
    "address", "article", "aside", "blockquote", "br", "dd", "div", "dl", "dt",
    "figcaption", "figure", "footer", "h1", "h2", "h3", "h4", "h5", "h6",
    "header", "hr", "li", "main", "nav", "ol", "p", "pre", "section", "table",
    "tbody", "td", "tfoot", "th", "thead", "title", "tr", "ul",
}


class VisibleText(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.skip_depth = 0
        self.parts: list[str] = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in SKIP:
            self.skip_depth += 1
        elif tag in BLOCK:
            self.parts.append("\n")

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        if tag in BLOCK:
            self.parts.append("\n")

    def handle_endtag(self, tag: str) -> None:
        if tag in SKIP:
            self.skip_depth = max(0, self.skip_depth - 1)
        elif tag in BLOCK:
            self.parts.append("\n")

    def handle_data(self, data: str) -> None:
        if not self.skip_depth:
            self.parts.append(data)

    def lines(self) -> list[str]:
        text = "".join(self.parts)
        out = (" ".join(line.split()) for line in text.split("\n"))
        return [line for line in out if line]


def visible_lines(path: Path) -> list[str]:
    parser = VisibleText()
    parser.feed(path.read_text(encoding="utf-8"))
    parser.close()
    return parser.lines()


def main(argv: list[str]) -> int:
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8", errors="replace")
    if len(argv) != 3:
        print(__doc__.strip(), file=sys.stderr)
        return 2
    a, b = Path(argv[1]), Path(argv[2])
    for p in (a, b):
        if not p.is_file():
            print(f"error: {p} not found", file=sys.stderr)
            return 2
    left, right = visible_lines(a), visible_lines(b)
    if left == right:
        print(f"OK: visible text identical ({len(left)} lines) in {a} and {b}")
        return 0
    print(f"FAIL: visible text differs between {a} and {b}", file=sys.stderr)
    sys.stderr.writelines(
        line + "\n" for line in difflib.unified_diff(left, right, str(a), str(b), lineterm="")
    )
    return 1


if __name__ == "__main__":
    sys.exit(main(sys.argv))
