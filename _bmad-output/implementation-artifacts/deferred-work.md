# Deferred Work

- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-astro-scaffold.md`
  summary: Add a build-output parity test proving `dist/index.html` keeps the legacy head (font links + byte-identical `<style>`), the legacy inline `<script>`, and the legacy href/src/alt/aria-label attributes.
  evidence: tools/compare_legacy_text.py compares visible text nodes only (skips script/style, ignores attributes), so an unstyled or non-interactive `/` would still pass. Target Story 1.2.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-astro-scaffold.md`
  summary: Add a post-build assertion that `dist/index.html` and `dist/next/index.html` contain 0 `window.va`/`_vercel/insights` references and exactly one `<Analytics />` script.
  evidence: Verified by hand at Story 1.1 only. Removing or duplicating `<Analytics />` in Base.astro would currently build silently. Target Story 1.2.
- source_spec: `_bmad-output/implementation-artifacts/spec-1-1-astro-scaffold.md`
  summary: Add Vitest unit tests for `legacy()` error paths (missing `<body>`/`</head>`, 0 or 2 analytics loaders, leftover `window.va`) asserting the named errors.
  evidence: The behaviour was confirmed by an uncommitted scratch probe on 2026-11-25. `legacy()` already accepts an `html` argument, so it's directly testable. Target Story 1.2.
