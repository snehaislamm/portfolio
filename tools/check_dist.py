"""Post-build checks on dist/ (Python stdlib only).

Usage: python tools/check_dist.py [legacy/index.html] [dist]

1. Legacy parity for dist/index.html against the frozen legacy page:
   - every <link> in the legacy <head> (the font links) is in the built <head>
   - the legacy <style> text is in the built <head>, byte-identical (line endings normalised)
   - the inline <script> text(s) in the legacy <body> match the built <body>
   - the multiset of href / src / alt / aria-label values in <body> is unchanged
     (the <Analytics /> elements are excluded; rule 2 covers them)
   - no extra <link> or <style> is gained in the built <head>
2. Analytics, on dist/index.html and dist/next/index.html:
   - exactly one <vercel-analytics> element and exactly one /_astro module <script> right after it
     (other /_astro module scripts, e.g. React islands, are left alone)
   - no hand-written snippet left: no "window.va" and no "_vercel/insights"
3. /next styles (Story 2.1), on dist/next/index.html and the /_astro/*.css it links (plus any head <style>):
   - no fonts.googleapis.com / fonts.gstatic.com anywhere
   - at least one linked /_astro/*.css stylesheet, and every linked one exists in dist
   - the CSS references self-hosted .woff2 fonts under /_astro/ and defines --color-coal (tokens loaded)
   - the CSS defines a .sr-only rule (the shared new-tab notice relies on it)
4. /next page structure (Story 2.2), on dist/next/index.html:
   - #glance has a data-next naming an element id that exists (the target ▶ Start and the keys advance to)
   - exactly one <h1> on the page

Exits 0 when everything holds; exits 1 and lists every problem otherwise.
"""

from __future__ import annotations

import re
import sys
from collections import Counter
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path

PAGES = ("index.html", "next/index.html")
NEXT_PAGE = "next/index.html"
GOOGLE_FONTS = ("fonts.googleapis.com", "fonts.gstatic.com")
WOFF2_URL = re.compile(r"""url\(\s*['"]?/_astro/[^)'"\s]+\.woff2""")
COAL_TOKEN = re.compile(r"--color-coal\s*:")
SR_ONLY_RULE = re.compile(r"\.sr-only(?![\w-])[^{]*\{")
BODY_ATTRS = ("href", "src", "alt", "aria-label")


def eol(text: str) -> str:
    return text.replace("\r\n", "\n").replace("\r", "\n")


@dataclass
class Element:
    tag: str
    attrs: dict[str, str | None]
    in_body: bool
    text: str = ""


class Page(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.elements: list[Element] = []
        self.in_body = False
        self.raw: Element | None = None  # open <script>/<style> collecting text

    def _start(self, tag: str, attrs: list[tuple[str, str | None]]) -> Element:
        if tag == "body":
            self.in_body = True
        el = Element(tag, dict(attrs), self.in_body)
        self.elements.append(el)
        return el

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        el = self._start(tag, attrs)
        if tag in ("script", "style"):
            self.raw = el

    def handle_startendtag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        self._start(tag, attrs)

    def handle_endtag(self, tag: str) -> None:
        if self.raw is not None and tag == self.raw.tag:
            self.raw = None

    def handle_data(self, data: str) -> None:
        if self.raw is not None:
            self.raw.text += data

    # --- queries -------------------------------------------------------------
    def find(self, tag: str, *, body: bool | None = None) -> list[Element]:
        return [e for e in self.elements if e.tag == tag and (body is None or e.in_body == body)]


def parse(html: str) -> Page:
    page = Page()
    page.feed(html)
    page.close()
    return page


def is_module_astro_script(el: Element) -> bool:
    return (
        el.tag == "script"
        and el.attrs.get("type") == "module"
        and (el.attrs.get("src") or "").startswith("/_astro/")
    )


def analytics_loaders(page: Page) -> list[Element]:
    """The /_astro module scripts right after a <vercel-analytics> (what <Analytics /> renders)."""
    els = page.elements
    return [b for a, b in zip(els, els[1:]) if a.tag == "vercel-analytics" and is_module_astro_script(b)]


def analytics_elements(page: Page) -> set[int]:
    return {id(e) for e in page.find("vercel-analytics")} | {id(e) for e in analytics_loaders(page)}


def body_attr_values(page: Page) -> Counter[tuple[str, str]]:
    skip = analytics_elements(page)
    return Counter(
        (name, value)
        for el in page.elements
        if el.in_body and id(el) not in skip
        for name, value in el.attrs.items()
        if name in BODY_ATTRS and value is not None
    )


def inline_body_scripts(page: Page) -> list[str]:
    return [eol(e.text) for e in page.find("script", body=True) if "src" not in e.attrs]


def link_key(el: Element) -> tuple[tuple[str, str], ...]:
    return tuple(sorted((k, v or "") for k, v in el.attrs.items()))


def check_parity(legacy_html: str, built_html: str, name: str = "index.html") -> list[str]:
    legacy, built = parse(legacy_html), parse(built_html)
    problems: list[str] = []

    want_links = Counter(link_key(e) for e in legacy.find("link", body=False))
    got_links = Counter(link_key(e) for e in built.find("link", body=False))
    for key, n in sorted((want_links - got_links).items()):
        problems.append(f"{name}: <head> is missing legacy <link> {dict(key).get('href')!r} (x{n})")
    for key, n in sorted((got_links - want_links).items()):
        problems.append(f"{name}: <head> gained <link> {dict(key).get('href')!r} (x{n})")

    want_styles = Counter(eol(e.text) for e in legacy.find("style", body=False))
    got_styles = Counter(eol(e.text) for e in built.find("style", body=False))
    for text, n in (want_styles - got_styles).items():
        problems.append(f"{name}: <head> is missing legacy <style> {text.strip()[:40]!r} (x{n}, or its text changed)")
    for text, n in (got_styles - want_styles).items():
        problems.append(f"{name}: <head> gained <style> {text.strip()[:40]!r} (x{n})")

    want, got = inline_body_scripts(legacy), inline_body_scripts(built)
    if want != got:
        problems.append(
            f"{name}: inline <body> <script>s differ from legacy "
            f"({len(want)} expected, {len(got)} found, or their text changed)"
        )

    want_attrs, got_attrs = body_attr_values(legacy), body_attr_values(built)
    for (attr, value), n in sorted((want_attrs - got_attrs).items()):
        problems.append(f"{name}: <body> lost {attr}={value!r} (x{n})")
    for (attr, value), n in sorted((got_attrs - want_attrs).items()):
        problems.append(f"{name}: <body> gained {attr}={value!r} (x{n})")
    return problems


def check_analytics(html: str, name: str) -> list[str]:
    page = parse(html)
    problems: list[str] = []
    tags = len(page.find("vercel-analytics"))
    loaders = len(analytics_loaders(page))
    if tags != 1:
        problems.append(f"{name}: expected exactly one <vercel-analytics>, found {tags}")
    if loaders != 1:
        problems.append(f"{name}: expected exactly one /_astro module <script>, found {loaders}")
    for needle in ("window.va", "_vercel/insights"):
        if needle in html:
            problems.append(f"{name}: hand-written analytics leftover {needle!r} found")
    return problems


def linked_stylesheets(html: str) -> list[str]:
    """hrefs of the <link rel="stylesheet"> elements in <head>."""
    return [
        e.attrs.get("href") or ""
        for e in parse(html).find("link", body=False)
        if "stylesheet" in (e.attrs.get("rel") or "").split()
    ]


def check_next_styles(html: str, css: dict[str, str | None], name: str = NEXT_PAGE) -> list[str]:
    """`css` maps each linked stylesheet href to its text (None when the file is missing from dist)."""
    problems: list[str] = []
    for host in GOOGLE_FONTS:
        if host in html:
            problems.append(f"{name}: references {host}")
    astro = [href for href in linked_stylesheets(html) if href.startswith("/_astro/") and href.endswith(".css")]
    if not astro:
        problems.append(f"{name}: links no /_astro/*.css stylesheet")
    texts = [eol(e.text) for e in parse(html).find("style", body=False)]
    for href in astro:
        text = css.get(href)
        if text is None:
            problems.append(f"{name}: linked stylesheet {href} not found in dist")
            continue
        texts.append(text)
        for host in GOOGLE_FONTS:
            if host in text:
                problems.append(f"{name}: {href} references {host}")
    combined = "\n".join(texts)
    if not WOFF2_URL.search(combined):
        problems.append(f"{name}: CSS references no self-hosted /_astro/*.woff2 font")
    if not COAL_TOKEN.search(combined):
        problems.append(f"{name}: CSS does not define --color-coal (tokens not loaded)")
    if not SR_ONLY_RULE.search(combined):
        problems.append(f"{name}: CSS defines no .sr-only rule")
    return problems


def check_next_page(html: str, name: str = NEXT_PAGE) -> list[str]:
    page = parse(html)
    problems: list[str] = []
    ids = [e.attrs.get("id") for e in page.elements if e.attrs.get("id")]
    glance = [e for e in page.elements if e.attrs.get("id") == "glance"]
    target = glance[0].attrs.get("data-next") if glance else None
    if not target:
        problems.append(f"{name}: no #glance with a data-next target")
    elif target not in ids:
        problems.append(f"{name}: #glance data-next={target!r} names no element id")
    h1s = len(page.find("h1"))
    if h1s != 1:
        problems.append(f"{name}: expected exactly one <h1>, found {h1s}")
    return problems


def check(legacy_html: str, pages: dict[str, str], next_css: dict[str, str | None] | None = None) -> list[str]:
    """`pages` maps a dist-relative path (see PAGES) to its HTML; `next_css` (href -> CSS text) enables rule 3."""
    problems = check_parity(legacy_html, pages["index.html"]) if "index.html" in pages else []
    for name, html in pages.items():
        problems += check_analytics(html, name)
    if NEXT_PAGE in pages:
        problems += check_next_page(pages[NEXT_PAGE])
    if next_css is not None and NEXT_PAGE in pages:
        problems += check_next_styles(pages[NEXT_PAGE], next_css)
    return problems


def read_linked_css(html: str, dist: Path) -> dict[str, str | None]:
    out: dict[str, str | None] = {}
    for href in linked_stylesheets(html):
        if href.startswith("/"):
            path = dist / href.lstrip("/")
            out[href] = path.read_text(encoding="utf-8") if path.is_file() else None
    return out


def main(argv: list[str]) -> int:
    for stream in (sys.stdout, sys.stderr):
        if hasattr(stream, "reconfigure"):
            stream.reconfigure(encoding="utf-8", errors="replace")
    if len(argv) > 3:
        print(__doc__.strip(), file=sys.stderr)
        return 2
    legacy_path = Path(argv[1] if len(argv) > 1 else "legacy/index.html")
    dist = Path(argv[2] if len(argv) > 2 else "dist")
    paths = [legacy_path] + [dist / p for p in PAGES]
    missing = [p for p in paths if not p.is_file()]
    if missing:
        for p in missing:
            print(f"error: {p} not found", file=sys.stderr)
        return 2
    pages = {p: (dist / p).read_text(encoding="utf-8") for p in PAGES}
    next_css = read_linked_css(pages[NEXT_PAGE], dist)
    problems = check(legacy_path.read_text(encoding="utf-8"), pages, next_css)
    if problems:
        print(f"FAIL: {len(problems)} problem(s) in {dist}", file=sys.stderr)
        for problem in problems:
            print(f"  - {problem}", file=sys.stderr)
        return 1
    print(f"OK: legacy parity and analytics hold for {', '.join(PAGES)}, and {NEXT_PAGE} styles are self-hosted with .sr-only, and #glance/<h1> hold, in {dist}")
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv))
