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

    def test_main_reports_missing_dist(self) -> None:
        legacy = Path(__file__).resolve().parents[1] / "legacy" / "index.html"
        self.assertTrue(legacy.is_file())
        self.assertEqual(check_dist.main(["check_dist.py", str(legacy), "no-such-dist"]), 2)


if __name__ == "__main__":
    unittest.main()
