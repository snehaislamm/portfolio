"""Tests for tools/fact_audit.py. Run: python -m unittest discover -s tools -p "test_*.py"."""

from __future__ import annotations

import io
import sys
import tempfile
import unittest
from contextlib import redirect_stderr, redirect_stdout
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

import fact_audit  # noqa: E402

# Synthetic corpus: inventory text plus legacy visible text. Legacy markup numbers (88, 77) are not evidence.
INVENTORY = "# Inventory\nServed 1,200 users. Throughput 3.5x. 2026 term. Warning: never say built.\n"
LEGACY = (
    '<html><head><title>Legacy 42</title><style>.a{width:88px}</style></head>'
    '<body><svg><path d="M0 0" y="77"/></svg><p>Yield 96% over 4 terms</p>'
    '<p>Engineering Ambassador</p></body></html>'
)
CORPUS = fact_audit.build_corpus(INVENTORY, LEGACY)
NAMES = ["Zzqa Xxlast", "Yyrb Otherperson"]


def page(body: str, title: str = "T") -> str:
    return f"<!DOCTYPE html><html><head><title>{title}</title></head><body>{body}</body></html>"


GOOD_INDEX = page("<p>Yield 96% over 4 terms</p><p>Engineering Ambassador</p>")
GOOD_NEXT = page("<p>The Fab Line: work in progress.</p>")


class FactAuditTest(unittest.TestCase):
    def problems(
        self,
        index: str = GOOD_INDEX,
        nxt: str = GOOD_NEXT,
        content: dict | None = None,
        allow: list[str] | None = None,
        names: list[str] | None = None,
        corpus: str = CORPUS,
    ) -> list[fact_audit.Problem]:
        return fact_audit.audit(
            {"index.html": index, "next/index.html": nxt},
            content or {},
            corpus,
            allow or [],
            NAMES if names is None else names,
        )

    def assertFails(self, problems: list[fact_audit.Problem], needle: str) -> None:
        self.assertTrue(problems, "expected at least one problem")
        lines = [str(p) for p in problems]
        self.assertTrue(any(needle in line for line in lines), f"{needle!r} not in {lines}")

    def assertNoName(self, problems: list[fact_audit.Problem]) -> None:
        out = "\n".join(str(p) for p in problems).lower()
        for name in NAMES:
            for word in name.lower().split():
                self.assertNotIn(word, out)

    # --- matrix rows -----------------------------------------------------------
    def test_current_site_passes(self) -> None:
        self.assertEqual(self.problems(), [])

    def test_invented_number_fails(self) -> None:
        problems = self.problems(nxt=page("<p>We cut latency 73% this term.</p>"))
        self.assertFails(problems, "next/index.html: [number] '73' … ")
        self.assertFails(problems, "cut latency 73% this term")

    def test_real_number_passes(self) -> None:
        self.assertEqual(self.problems(nxt=page("<p>1,200 users at 3.5x</p>")), [])

    def test_partial_number_fails(self) -> None:
        # 200 only appears inside 1,200 and 3 only inside 3.5: neither is sourced alone.
        problems = self.problems(nxt=page("<p>200 users, 3 runs</p>"))
        self.assertFails(problems, "[number] '200'")
        self.assertFails(problems, "[number] '3'")

    def test_allow_listed_passes(self) -> None:
        nxt = page("<p>UI v2.0</p>")
        self.assertFails(self.problems(nxt=nxt), "[number] '2.0'")
        self.assertEqual(self.problems(nxt=nxt, allow=fact_audit.parse_allow("v2.0  # UI version")), [])

    def test_teammate_name_fails_masked(self) -> None:
        problems = self.problems(nxt=page("<p>Paired with zzqa  xxlast on it.</p>"))
        self.assertFails(problems, "[teammate-name] '[teammate name #1]'")
        self.assertNoName(problems)

    def test_teammate_name_on_legacy_page_fails(self) -> None:
        problems = self.problems(index=page("<p>Thanks Yyrb Otherperson</p>"))
        self.assertFails(problems, "index.html: [teammate-name] '[teammate name #2]'")
        self.assertNoName(problems)

    def test_teammate_name_in_json_fails(self) -> None:
        problems = self.problems(content={"src/content/x.json": {"note": "with Zzqa Xxlast"}})
        self.assertFails(problems, "src/content/x.json: [teammate-name]")
        self.assertNoName(problems)

    def test_no_names_runs_other_checks(self) -> None:
        problems = self.problems(nxt=page("<p>Zzqa Xxlast, 73%</p>"), names=[])
        self.assertEqual([p.rule for p in problems], ["number"])

    def test_course_code_fails(self) -> None:
        for text in ("ece  457b", "ECE-457", "phys_468", "SYDE572", "MTE 544", "stat\n341"):
            with self.subTest(text=text):
                self.assertFails(self.problems(nxt=page(f"<p>Taking {text}</p>")), "[course-code]")

    def test_course_code_on_legacy_page_fails(self) -> None:
        self.assertFails(self.problems(index=page("<p>MTE 544</p>")), "index.html: [course-code]")

    def test_ambassador_on_next_fails(self) -> None:
        for text in ("Engineering Ambassador", "engineering-ambassador", "Engineering  Ambassadors"):
            with self.subTest(text=text):
                self.assertFails(self.problems(nxt=page(f"<p>{text}</p>")), "next/index.html: [ambassador]")

    def test_ambassador_on_legacy_passes(self) -> None:
        self.assertEqual(self.problems(index=page("<p>Engineering Ambassador</p>")), [])

    def test_ambassador_in_json_fails(self) -> None:
        problems = self.problems(content={"src/content/a.json": [{"title": "Engineering Ambassador"}]})
        self.assertFails(problems, "src/content/a.json: [ambassador]")

    def test_capstone_claim_fails(self) -> None:
        for text in ("we built it", "Tested on wafer", "a working device", "two working devices"):
            with self.subTest(text=text):
                content = {"src/content/quests.json": [{"slug": "capstone", "bullets": [text]}]}
                self.assertFails(self.problems(content=content), "[capstone-claim]")

    def test_capstone_words_outside_capstone_pass(self) -> None:
        content = {"src/content/quests.json": [{"slug": "communitech", "bullets": ["we built it"]}]}
        self.assertEqual(self.problems(content=content), [])

    def test_missing_source_fails(self) -> None:
        content = {"src/content/quests.json": [{"slug": "x", "captions": [{"text": "hello"}, {"text": "ok", "source": "inv §5.1"}]}]}
        problems = self.problems(content=content)
        self.assertFails(problems, "[missing-source]")
        self.assertFails(problems, "$[0].captions[0]")
        self.assertEqual(len([p for p in problems if p.rule == "missing-source"]), 1)

    def test_source_rule_all_keys(self) -> None:
        for key in fact_audit.SOURCE_KEYS:
            for bad in ([{"text": "a", "source": "  "}], ["bare string"], {"text": "single"}):
                with self.subTest(key=key, bad=bad):
                    self.assertFails(self.problems(content={"src/content/u.json": {key: bad}}), "[missing-source]")
            self.assertEqual(self.problems(content={"src/content/u.json": {key: [{"text": "a", "source": "inv §1"}]}}), [])

    def test_source_value_numbers_exempt(self) -> None:
        content = {"src/content/u.json": {"captions": [{"text": "Yield 96%", "source": "inv §73.9 L999"}]}}
        self.assertEqual(self.problems(content=content), [])

    def test_json_number_values_checked(self) -> None:
        problems = self.problems(content={"src/content/u.json": {"metrics": [{"value": 73}]}})
        self.assertFails(problems, "[number] '73' … $.metrics[0].value")

    # --- visible text ----------------------------------------------------------
    def test_self_closing_alt_and_aria_label_scanned(self) -> None:
        self.assertFails(self.problems(nxt=page('<img alt="88 dies"/>')), "[number] '88'")
        self.assertFails(self.problems(nxt=page('<svg><path aria-label="77 nm"/></svg>')), "[number] '77'")
        self.assertFails(self.problems(nxt=page('<img alt="65 dies">')), "[number] '65'")

    def test_title_and_desc_scanned(self) -> None:
        self.assertFails(self.problems(nxt=page("", title="Level 61")), "[number] '61'")
        self.assertFails(self.problems(nxt=page("<svg><desc>59 nm</desc></svg>")), "[number] '59'")

    def test_script_style_and_other_attrs_ignored(self) -> None:
        nxt = page('<script>var x = 73;</script><style>.a{width:91px}</style><div class="w-73" data-n="5"></div>')
        self.assertEqual(self.problems(nxt=nxt), [])

    def test_number_only_in_legacy_markup_fails(self) -> None:
        # 88 is a CSS value and 77 an SVG coordinate in the legacy page: not evidence.
        problems = self.problems(nxt=page("<p>88% at 77 nm</p>"))
        self.assertFails(problems, "[number] '88'")
        self.assertFails(problems, "[number] '77'")
        # Legacy visible text (title included) is evidence.
        self.assertEqual(self.problems(nxt=page("<p>Legacy 42, 96%</p>")), [])

    # --- allow-list ------------------------------------------------------------
    def test_allow_only_at_token_boundaries(self) -> None:
        allow = fact_audit.parse_allow("2.0  # version")
        self.assertFails(self.problems(nxt=page("<p>12.05 mm</p>"), allow=allow), "[number] '12.05'")
        self.assertFails(self.problems(nxt=page("<p>2.05 mm</p>"), allow=allow), "[number] '2.05'")
        self.assertEqual(self.problems(nxt=page("<p>v2.0 ready</p>"), allow=allow), [])

    def test_allow_line_hash_in_reason(self) -> None:
        self.assertEqual(fact_audit.parse_allow("# header\n\nv2.0  # see #12\n"), ["v2.0"])

    def test_allow_line_without_comment_is_setup_error(self) -> None:
        for text in ("v2.0", "v2.0 #", "v2.0#reason"):
            with self.subTest(text=text), self.assertRaises(fact_audit.SetupError):
                fact_audit.parse_allow(text)

    def test_allow_never_overrides_ban(self) -> None:
        allow = fact_audit.parse_allow("ECE 457  # nope\nZzqa Xxlast  # nope")
        problems = self.problems(nxt=page("<p>ECE 457 with Zzqa Xxlast</p>"), allow=allow)
        self.assertEqual(sorted(p.rule for p in problems), ["course-code", "teammate-name"])

    # --- masking ---------------------------------------------------------------
    def test_snippet_edge_never_cuts_a_name(self) -> None:
        # The 73 sits so the snippet window edge lands mid-name on both sides.
        for pad in range(0, 40):
            text = f"Zzqa Xxlast {'x' * pad} 73 {'y' * pad} Yyrb Otherperson"
            with self.subTest(pad=pad):
                problems = self.problems(nxt=page(f"<p>{text}</p>"))
                self.assertFails(problems, "[number] '73'")
                self.assertNoName(problems)

    def test_first_name_listed_before_full_name(self) -> None:
        names = ["Zzqa", "Zzqa Xxlast"]
        problems = self.problems(nxt=page("<p>Zzqa Xxlast and zzqa ran 73 runs</p>"), names=names)
        lines = "\n".join(str(p) for p in problems)
        self.assertNotIn("xxlast", lines.lower())
        self.assertIn("[teammate name #2]", lines)  # full name keeps its configured number
        self.assertIn("[teammate name #1]", lines)
        self.assertNotIn("zzqa", lines.lower())

    def test_name_in_json_key_path_masked(self) -> None:
        content = {"src/content/u.json": {"Zzqa Xxlast": {"captions": [{"text": "x"}], "n": 73}}}
        problems = self.problems(content=content)
        self.assertFails(problems, "$.[teammate name #1].captions[0]")
        self.assertFails(problems, "[number] '73' … $.[teammate name #1].n")
        self.assertNoName(problems)

    def test_name_with_newline_in_missing_source_preview_masked(self) -> None:
        content = {"src/content/u.json": {"captions": [{"text": "with Zzqa\nXxlast and Yyrb\tOtherperson"}]}}
        problems = self.problems(content=content)
        self.assertFails(problems, "[missing-source]")
        self.assertNoName(problems)

    def test_names_comma_and_semicolon_separated(self) -> None:
        for raw in ("Zzqa Xxlast, Yyrb Otherperson", "Zzqa Xxlast; Yyrb Otherperson", "Zzqa Xxlast,\nzzqa xxlast;Yyrb Otherperson"):
            with self.subTest(raw=raw):
                names = fact_audit.parse_names(raw)
                self.assertEqual(names, NAMES)
                for who in NAMES:
                    problems = self.problems(nxt=page(f"<p>{who}</p>"), names=names)
                    self.assertFails(problems, "[teammate-name]")
                    self.assertNoName(problems)

    def test_capstone_claim_in_nested_object_fails(self) -> None:
        content = {"src/content/quests.json": [{"slug": "capstone", "captions": [{"text": "we built it", "source": "inv §1"}]}]}
        self.assertFails(self.problems(content=content), "[capstone-claim] 'built'")

    def test_course_code_and_name_as_json_keys(self) -> None:
        content = {"src/content/u.json": {"ECE 457": "x", "Zzqa Xxlast": "y"}}
        problems = self.problems(content=content)
        self.assertFails(problems, "src/content/u.json: [course-code] 'ECE 457'")
        self.assertFails(problems, "src/content/u.json: [teammate-name] '[teammate name #1]'")
        self.assertNoName(problems)

    # --- main / setup ----------------------------------------------------------


class MainTest(unittest.TestCase):
    def setUp(self) -> None:
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        self.write("docs/content-inventory.md", INVENTORY)
        self.write("legacy/index.html", LEGACY)
        self.write("dist/index.html", GOOD_INDEX)
        self.write("dist/next/index.html", GOOD_NEXT)

    def tearDown(self) -> None:
        self.tmp.cleanup()

    def write(self, rel: str, text: str) -> None:
        path = self.root / rel
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding="utf-8")

    def run_main(self, env: dict[str, str]) -> tuple[int, str]:
        out, err = io.StringIO(), io.StringIO()
        with redirect_stdout(out), redirect_stderr(err):
            code = fact_audit.main(["fact_audit.py", str(self.root)], env)
        return code, out.getvalue() + err.getvalue()

    def test_passes_with_names(self) -> None:
        code, out = self.run_main({"FACT_AUDIT_BANNED_NAMES": "Zzdummy Name", "CI": "true"})
        self.assertEqual(code, 0, out)
        self.assertIn("OK", out)
        self.assertNotIn("Zzdummy", out)

    def test_no_names_locally_warns(self) -> None:
        code, out = self.run_main({})
        self.assertEqual(code, 0, out)
        self.assertIn("name check skipped", out)

    def test_no_names_in_ci_is_setup_error(self) -> None:
        self.assertEqual(self.run_main({"CI": "true"})[0], 2)
        self.assertEqual(self.run_main({"CI": "false"})[0], 0)
        self.assertEqual(self.run_main({"CI": "0"})[0], 0)

    def test_local_names_file(self) -> None:
        self.write("tools/banned_names.local.txt", "# names\nZzqa Xxlast\n")
        self.write("dist/next/index.html", page("<p>Zzqa Xxlast</p>"))
        code, out = self.run_main({"CI": "true"})
        self.assertEqual(code, 1)
        self.assertIn("[teammate name #1]", out)
        self.assertNotIn("Zzqa", out)

    def test_name_never_in_output(self) -> None:
        self.write("dist/next/index.html", page("<p>Zzqa Xxlast cut latency 73% with Yyrb Otherperson</p>"))
        self.write("src/content/q.json", '{"Yyrb Otherperson": {"captions": [{"text": "Zzqa\\nXxlast"}]}}')
        code, out = self.run_main({"FACT_AUDIT_BANNED_NAMES": "\n".join(NAMES)})
        self.assertEqual(code, 1)
        for word in ("zzqa", "yyrb", "otherperson"):
            self.assertNotIn(word, out.lower())
        self.assertNotIn("Xxlast", out)

    def test_missing_dist_page_is_setup_error(self) -> None:
        (self.root / "dist/next/index.html").unlink()
        code, out = self.run_main({"FACT_AUDIT_BANNED_NAMES": "Zzdummy Name"})
        self.assertEqual(code, 2)
        self.assertIn("not found", out)

    def test_bad_allow_line_is_setup_error(self) -> None:
        self.write("tools/fact_audit_allow.txt", "# header\nv2.0\n")
        self.assertEqual(self.run_main({"FACT_AUDIT_BANNED_NAMES": "Zzdummy Name"})[0], 2)

    def test_content_json_audited(self) -> None:
        self.write("src/content/quests.json", '[{"slug": "capstone", "bullets": ["we built it"]}]')
        code, out = self.run_main({"FACT_AUDIT_BANNED_NAMES": "Zzdummy Name"})
        self.assertEqual(code, 1)
        self.assertIn("src/content/quests.json: [capstone-claim] 'built'", out)

    def test_bom_prefixed_names_and_allow_files_parse(self) -> None:
        self.write("tools/banned_names.local.txt", "﻿Zzqa Xxlast\n")
        self.write("tools/fact_audit_allow.txt", "﻿v2.0  # UI version\n")
        self.write("dist/next/index.html", page("<p>v2.0</p>"))
        self.assertEqual(self.run_main({"CI": "true"})[0], 0)
        self.write("dist/next/index.html", page("<p>v2.0 Zzqa Xxlast</p>"))
        code, out = self.run_main({"CI": "true"})
        self.assertEqual(code, 1)
        self.assertIn("[teammate name #1]", out)
        self.assertNotIn("zzqa", out.lower())

    def test_real_repo_allow_file_parses(self) -> None:
        real = Path(__file__).resolve().parents[1] / "tools" / "fact_audit_allow.txt"
        self.assertTrue(real.is_file())
        fact_audit.parse_allow(real.read_text(encoding="utf-8"))


if __name__ == "__main__":
    unittest.main()
