"""Tests for tools/check_dist.py. Run: python -m unittest discover -s tools -p "test_*.py"."""

from __future__ import annotations

import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import check_dist  # noqa: E402

FONT = '<link href="https://fonts.example/css?family=Mono" rel="stylesheet">'
STYLE = "<style>\r\nbody { color: red; }\r\n</style>"
BODY = (
    '<a href="#about" aria-label="About">About</a>'
    '<img src="/assets/character/me.png" alt="Me">'
    '<a href="/Sneha_Islam_Resume.pdf">CV</a>'
)
SCRIPT = "<script>\r\ndocument.body.dataset.ready = '1';\r\n</script>"
VA = (
    "<script>window.va = window.va || function () {};</script>"
    '<script defer src="/_vercel/insights/script.js"></script>'
)
ANALYTICS = (
    '<vercel-analytics data-props="{}"></vercel-analytics>'
    '<script type="module" src="/_astro/analytics.abc.js"></script>'
)

LEGACY = f"<!DOCTYPE html><html><head><title>T</title>\r\n{FONT}\r\n{STYLE}\r\n{VA}</head><body>{BODY}{SCRIPT}</body></html>"


def built(head: str = f"{FONT}{STYLE.replace(chr(13), '')}", body: str = f"{BODY}{SCRIPT}", analytics: str = ANALYTICS) -> str:
    return f'<!DOCTYPE html><html><head><meta charset="UTF-8"><title>T</title>{head}</head><body>{body}{analytics}</body></html>'


NEXT = built(head="", body="<p>wip</p>")


class CheckDistTest(unittest.TestCase):
    def problems(self, index: str, nxt: str = NEXT) -> list[str]:
        return check_dist.check(LEGACY, {"index.html": index, "next/index.html": nxt})

    def assertFails(self, problems: list[str], needle: str) -> None:
        self.assertTrue(problems, "expected at least one problem")
        self.assertTrue(any(needle in p for p in problems), f"{needle!r} not in {problems}")

    def test_good_pair_passes(self) -> None:
        self.assertEqual(self.problems(built()), [])

    def test_dropped_style_fails(self) -> None:
        self.assertFails(self.problems(built(head=FONT)), "missing legacy <style>")

    def test_changed_style_fails(self) -> None:
        self.assertFails(self.problems(built(head=f"{FONT}<style>body{{}}</style>")), "missing legacy <style>")

    def test_dropped_font_link_fails(self) -> None:
        self.assertFails(self.problems(built(head=STYLE)), "missing legacy <link>")

    def test_dropped_script_fails(self) -> None:
        self.assertFails(self.problems(built(body=BODY)), "inline <body> <script>s differ")

    def test_altered_href_fails(self) -> None:
        problems = self.problems(built(body=BODY.replace("#about", "#abuot") + SCRIPT))
        self.assertFails(problems, "lost href='#about'")
        self.assertFails(problems, "gained href='#abuot'")

    def test_no_analytics_loader_fails(self) -> None:
        problems = self.problems(built(analytics='<vercel-analytics></vercel-analytics>'))
        self.assertFails(problems, "index.html: expected exactly one /_astro module <script>, found 0")

    def test_two_analytics_loaders_fails(self) -> None:
        problems = self.problems(built(), built(head="", body="", analytics=ANALYTICS * 2))
        self.assertFails(problems, "next/index.html: expected exactly one <vercel-analytics>, found 2")
        self.assertFails(problems, "next/index.html: expected exactly one /_astro module <script>, found 2")

    def test_no_analytics_tag_fails(self) -> None:
        problems = self.problems(built(analytics='<script type="module" src="/_astro/analytics.abc.js"></script>'))
        self.assertFails(problems, "index.html: expected exactly one <vercel-analytics>, found 0")

    def test_extra_island_module_script_passes(self) -> None:
        island = '<script type="module" src="/_astro/client.xyz.js"></script>'
        self.assertEqual(self.problems(built(), built(head="", body=island)), [])
        # On / an island is not an analytics problem, but it is a parity change to the legacy body.
        self.assertEqual(
            self.problems(built(body=f"{island}{BODY}{SCRIPT}")),
            ["index.html: <body> gained src='/_astro/client.xyz.js' (x1)"],
        )

    def test_gained_head_style_fails(self) -> None:
        self.assertFails(self.problems(built(head=f"{FONT}{STYLE}<style>main{{}}</style>")), "gained <style>")

    def test_duplicated_head_style_fails(self) -> None:
        self.assertFails(self.problems(built(head=f"{FONT}{STYLE}{STYLE}")), "gained <style>")

    def test_gained_head_link_fails(self) -> None:
        extra = '<link rel="stylesheet" href="/_astro/global.css">'
        self.assertFails(self.problems(built(head=f"{FONT}{extra}{STYLE}")), "gained <link> '/_astro/global.css'")

    def test_window_va_leftover_fails(self) -> None:
        problems = self.problems(built(head=f"{FONT}{STYLE}<script>window.va('x')</script>"))
        self.assertFails(problems, "index.html: hand-written analytics leftover 'window.va'")

    def test_insights_leftover_fails(self) -> None:
        problems = self.problems(built(), built(head='<script defer src="/_vercel/insights/script.js"></script>'))
        self.assertFails(problems, "next/index.html: hand-written analytics leftover '_vercel/insights'")

    # --- rule 3: /next styles ---------------------------------------------------
    NEXT_LINK = '<link rel="stylesheet" href="/_astro/next.abc.css">'
    GOOD_CSS = ":root{--color-coal:#1a1a17}@font-face{src:url(/_astro/mono.x1.woff2) format('woff2')}"

    def next_problems(self, head: str = NEXT_LINK, css: dict[str, str | None] | None = None) -> list[str]:
        nxt = built(head=head, body="<p>wip</p>")
        return check_dist.check(LEGACY, {"index.html": built(), "next/index.html": nxt},
                                {"/_astro/next.abc.css": self.GOOD_CSS} if css is None else css)

    def test_next_styles_pass(self) -> None:
        self.assertEqual(self.next_problems(), [])

    def test_next_google_fonts_link_fails(self) -> None:
        gf = '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=X">'
        self.assertFails(self.next_problems(head=self.NEXT_LINK + gf), "next/index.html: references fonts.googleapis.com")

    def test_next_gstatic_in_css_fails(self) -> None:
        css = {"/_astro/next.abc.css": self.GOOD_CSS + "@font-face{src:url(https://fonts.gstatic.com/x.woff2)}"}
        self.assertFails(self.next_problems(css=css), "/_astro/next.abc.css references fonts.gstatic.com")

    def test_next_no_stylesheet_fails(self) -> None:
        self.assertFails(self.next_problems(head="", css={}), "links no /_astro/*.css stylesheet")

    def test_next_missing_css_file_fails(self) -> None:
        self.assertFails(self.next_problems(css={"/_astro/next.abc.css": None}), "not found in dist")

    def test_next_no_woff2_fails(self) -> None:
        css = {"/_astro/next.abc.css": ":root{--color-coal:#1a1a17}"}
        self.assertFails(self.next_problems(css=css), "no self-hosted /_astro/*.woff2 font")

    def test_next_no_tokens_fails(self) -> None:
        css = {"/_astro/next.abc.css": "@font-face{src:url(/_astro/mono.x1.woff2)}"}
        self.assertFails(self.next_problems(css=css), "does not define --color-coal")

    def test_main_reports_missing_dist(self) -> None:
        legacy = Path(__file__).resolve().parents[1] / "legacy" / "index.html"
        self.assertTrue(legacy.is_file())
        self.assertEqual(check_dist.main(["check_dist.py", str(legacy), "no-such-dist"]), 2)


if __name__ == "__main__":
    unittest.main()
