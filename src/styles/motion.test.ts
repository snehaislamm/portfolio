/**
 * AD-7 guard (Story 2.4): CSS motion runs only under `[data-motion="on"]`.
 * Scans every `.css` file and every `<style>` block in `.astro` files under src/. Each rule that declares
 * `animation`, `animation-*`, `transition` or `transition-*` must have every selector in its list (or an
 * enclosing nested rule's) containing `data-motion="on"`; scoped `:global(...)` forms count.
 * `@keyframes` blocks themselves are definitions and are skipped; the rules that use them are checked.
 * `scroll-behavior: smooth` counts as motion too. A `data-motion="on"` inside `:not(...)` does not guard.
 *
 * Scope: CSS in `.css` files and `.astro` `<style>` blocks only. Inline `style=` attributes and `.tsx` are
 * not scanned; JS-driven motion must read `$motion` from src/game/state.ts instead (AD-7).
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const SRC = fileURLToPath(new URL('../', import.meta.url));
const MOTION_PROP = /^(?:-(?:webkit|moz|o|ms)-)?(?:animation|transition)(?:-[\w-]+)?$/i;
const MOTION_ON = /data-motion\s*=\s*(?:"on"|'on'|on\b)/;

interface Violation {
  file: string;
  line: number;
  selector: string;
  property: string;
}

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

/** Blank out comments, keeping newlines so line numbers still match. */
const stripComments = (css: string): string => css.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));

/** Split a selector list on top-level commas (not inside parentheses or brackets). */
function splitSelectors(list: string): string[] {
  const out: string[] = [];
  let depth = 0;
  let cur = '';
  for (const ch of list) {
    if (ch === '(' || ch === '[') depth++;
    else if (ch === ')' || ch === ']') depth--;
    if (ch === ',' && depth === 0) {
      out.push(cur.trim());
      cur = '';
    } else cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

/** Remove `:not(...)` groups (balanced parentheses): a match inside one means motion is NOT on. */
function stripNot(selector: string): string {
  let out = selector;
  for (let at = out.search(/:not\(/i); at !== -1; at = out.search(/:not\(/i)) {
    let depth = 0;
    let end = at + 4;
    for (; end < out.length; end++) {
      if (out[end] === '(') depth++;
      else if (out[end] === ')' && --depth === 0) break;
    }
    out = out.slice(0, at) + out.slice(end + 1);
  }
  return out;
}

const guarded = (selector: string): boolean => {
  const items = splitSelectors(selector);
  return items.length > 0 && items.every((s) => MOTION_ON.test(stripNot(s)));
};

interface Frame {
  kind: 'rule' | 'at' | 'keyframes';
  selector: string;
}

/**
 * A small brace-matching CSS walker: tracks the stack of enclosing blocks, and checks the declarations
 * directly inside each style rule. `baseLine` offsets line numbers for <style> blocks inside .astro files.
 */
function scanCss(css: string, file: string, baseLine = 1): Violation[] {
  const text = stripComments(css);
  const violations: Violation[] = [];
  const stack: Frame[] = [];
  let buf = '';
  let line = baseLine;
  let quote: string | null = null;

  const checkDecl = (decl: string, atLine: number) => {
    const colon = decl.indexOf(':');
    if (colon === -1) return;
    const property = decl.slice(0, colon).trim();
    const value = decl.slice(colon + 1).trim();
    const smoothScroll = /^scroll-behavior$/i.test(property) && /^smooth\b/i.test(value);
    if (!MOTION_PROP.test(property) && !smoothScroll) return;
    if (stack.some((f) => f.kind === 'keyframes')) return;
    const rules = stack.filter((f) => f.kind === 'rule');
    const selector = rules.map((f) => f.selector).join(' ') || '(top level)';
    if (!rules.some((f) => guarded(f.selector))) violations.push({ file, line: atLine, selector, property });
  };

  for (const ch of text) {
    if (ch === '\n') line++;
    if (quote) {
      buf += ch;
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      buf += ch;
    } else if (ch === '{') {
      const prelude = buf.trim();
      buf = '';
      if (/^@(?:-\w+-)?keyframes\b/i.test(prelude)) stack.push({ kind: 'keyframes', selector: prelude });
      else if (prelude.startsWith('@')) stack.push({ kind: 'at', selector: prelude });
      else stack.push({ kind: 'rule', selector: prelude.replace(/\s+/g, ' ') });
    } else if (ch === ';') {
      checkDecl(buf, line);
      buf = '';
    } else if (ch === '}') {
      checkDecl(buf, line);
      buf = '';
      stack.pop();
    } else buf += ch;
  }
  return violations;
}

/** The CSS of a file: a whole .css file, or each <style> block of an .astro file with its start line. */
function cssBlocks(path: string): { css: string; line: number }[] {
  const text = readFileSync(path, 'utf-8');
  if (path.endsWith('.css')) return [{ css: text, line: 1 }];
  return [...text.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => ({
    css: m[1],
    line: text.slice(0, m.index! + m[0].indexOf('>') + 1).split('\n').length,
  }));
}

describe('AD-7: CSS motion only under [data-motion="on"]', () => {
  it('every animation/transition declaration in src/ is guarded', () => {
    const files = walk(SRC).filter((p) => /\.(astro|css)$/.test(p));
    expect(files.length).toBeGreaterThan(0);
    const violations = files.flatMap((path) => {
      const rel = relative(SRC, path).split(sep).join('/');
      return cssBlocks(path).flatMap(({ css, line }) => scanCss(css, `src/${rel}`, line));
    });
    expect(
      violations.map((v) => `${v.file}:${v.line} \`${v.selector}\` declares ${v.property} outside [data-motion="on"]`),
    ).toEqual([]);
  });

  describe('scanner self-check', () => {
    const scan = (css: string) => scanCss(css, 'x.css').map((v) => `${v.selector} | ${v.property}`);

    it('flags unguarded animation and transition properties', () => {
      expect(scan('.a { transition: opacity 1s; }')).toEqual(['.a | transition']);
      expect(scan('.a { animation-name: spin }')).toEqual(['.a | animation-name']);
      expect(scan('.a { color: red; transition-duration: 1s; }')).toEqual(['.a | transition-duration']);
      expect(scan('@media (min-width: 600px) { .a { animation: spin 1s } }')).toEqual(['.a | animation']);
    });

    it('flags vendor-prefixed motion properties', () => {
      expect(scan('.a { -webkit-transition: opacity 1s }')).toEqual(['.a | -webkit-transition']);
      expect(scan('.a { -moz-animation: spin 1s }')).toEqual(['.a | -moz-animation']);
      expect(scan('.a { -o-transition-duration: 1s }')).toEqual(['.a | -o-transition-duration']);
      expect(scan('.a { -ms-animation-name: spin }')).toEqual(['.a | -ms-animation-name']);
    });

    it('flags unguarded scroll-behavior: smooth (but not auto)', () => {
      expect(scan('html { scroll-behavior: smooth }')).toEqual(['html | scroll-behavior']);
      expect(scan('html { scroll-behavior: auto }')).toEqual([]);
      expect(scan('[data-motion="on"] { scroll-behavior: smooth }')).toEqual([]);
    });

    it('accepts guarded rules, incl. :global(...) and nesting', () => {
      expect(scan('[data-motion="on"] .a { transition: opacity 1s; }')).toEqual([]);
      expect(scan(':global(html[data-motion="on"]) .a { animation: spin 1s }')).toEqual([]);
      expect(scan(":root[data-motion='on'] .a { transition: none }")).toEqual([]);
      expect(scan('[data-motion="on"] { .a { animation: spin 1s } }')).toEqual([]);
      expect(scan('@media (min-width: 1px) { [data-motion="on"] .a { animation: spin 1s } }')).toEqual([]);
    });

    it('requires every selector in a list to be guarded', () => {
      expect(scan('[data-motion="on"] .a, .b { transition: opacity 1s }')).toEqual([
        '[data-motion="on"] .a, .b | transition',
      ]);
    });

    it('rejects look-alikes', () => {
      expect(scan('[data-motion="off"] .a { transition: opacity 1s }')).toHaveLength(1);
      expect(scan('[data-motion="only"] .a { transition: opacity 1s }')).toHaveLength(1);
    });

    it('a data-motion="on" inside :not(...) does not guard', () => {
      expect(scan(':not([data-motion="on"]) .a { transition: opacity 1s }')).toHaveLength(1);
      expect(scan('html:not([data-motion="on"]) .a { transition: opacity 1s }')).toHaveLength(1);
      expect(scan('html:not(.x)[data-motion="on"] .a { transition: opacity 1s }')).toEqual([]);
    });

    it('ignores @keyframes bodies, non-motion properties and custom properties', () => {
      expect(scan('@keyframes spin { from { transform: rotate(0) } to { transform: rotate(1turn) } }')).toEqual([]);
      expect(scan('.a { --transition-speed: 1s; transform: none; will-change: opacity }')).toEqual([]);
    });

    it('handles strings and comments containing braces or semicolons', () => {
      expect(scan('.a::before { content: "{;}"; } /* .b { transition: x } */ .c { color: red }')).toEqual([]);
    });
  });
});
