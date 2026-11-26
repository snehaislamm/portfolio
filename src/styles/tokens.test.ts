/**
 * Block Biome token rules (Story 2.1):
 * - contrast: every text token on panel / inset / coal, and on-accent on every accent fill, is >= 4.5:1
 * - dirt and stone (incl. -dark/-light) are never text colours (`color` / `fill`) anywhere in src/,
 *   with tokens.css and file-local custom properties resolved
 * - every design-token var() referenced in src/ is defined in tokens.css
 * - AD-8: tokens.css is the only file under src/ with colour literals (hex and the rgb/rgba/hsl/hsla functions)
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';

const SRC = fileURLToPath(new URL('../', import.meta.url));
const TOKENS_FILE = fileURLToPath(new URL('./tokens.css', import.meta.url));
const TOKENS_REL = relative(SRC, TOKENS_FILE).split(sep).join('/');
const TEXT_EXT = /\.(css|astro|ts|tsx|js|jsx|html|svg|json|md)$/;
const STYLE_EXT = /\.(css|astro|tsx?|jsx?|html|svg)$/;

/** A hex colour literal: #rgb, #rgba, #rrggbb or #rrggbbaa, not part of a longer word/path (e.g. "#ai/…"). */
const HEX = /(?<![\w&#])#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})(?![\w/-])/gi;
/** The rgb / rgba / hsl / hsla colour functions. */
const COLOR_FN = /(?<![\w-])(?:rgba?|hsla?)\s*\(/gi;
const DECL = /--([\w-]+)\s*:\s*([^;}]+)[;}]/g;
const VAR_REF = /var\(\s*--([\w-]+)/g;
const VAR = /^var\(\s*--([\w-]+)\s*\)$/;
/** Design-token prefixes that must be defined in tokens.css. */
const TOKEN_REF = /var\(\s*--((?:color|space|type|font|focus|rounded)-[\w-]+)/g;

/** Blank out comments, keeping newlines so line numbers still match. */
const stripComments = (css: string): string => css.replace(/\/\*[\s\S]*?\*\//g, (c) => c.replace(/[^\n]/g, ' '));

/** Parse `--name: value` declarations (across newlines). */
function parseDecls(text: string): Map<string, string> {
  const decls = new Map<string, string>();
  for (const [, name, value] of stripComments(text).matchAll(DECL)) decls.set(name, value.trim());
  return decls;
}

const tokens = parseDecls(readFileSync(TOKENS_FILE, 'utf-8'));

/** Follow var(--x) aliases in tokens.css; returns the chain of token names and the final value. */
function resolve(name: string): { chain: string[]; value: string } {
  const chain: string[] = [];
  let current = name;
  for (;;) {
    if (chain.includes(current)) throw new Error(`circular token alias: ${[...chain, current].join(' -> ')}`);
    chain.push(current);
    const value = tokens.get(current);
    if (value === undefined) throw new Error(`unknown token --${current}`);
    const alias = VAR.exec(value);
    if (!alias) return { chain, value };
    current = alias[1];
  }
}

/** Every custom property reachable from `name`, through file-local declarations first, then tokens.css. */
function reachable(name: string, local: Map<string, string>, seen = new Set<string>()): Set<string> {
  if (seen.has(name)) return seen;
  seen.add(name);
  const value = local.get(name) ?? tokens.get(name);
  if (value !== undefined) for (const [, ref] of value.matchAll(VAR_REF)) reachable(ref, local, seen);
  return seen;
}

function hexOf(color: string): string {
  const { value } = resolve(`color-${color}`);
  if (!/^#[0-9a-f]{6}$/i.test(value)) throw new Error(`--color-${color} does not resolve to a 6-digit hex (${value})`);
  return value;
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/** Every file under src/, as a posix path relative to src/. */
function srcFiles(dir = SRC): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? srcFiles(full) : [relative(SRC, full).split(sep).join('/')];
  });
}

const read = (file: string): string => readFileSync(join(SRC, file), 'utf-8');
const lineAt = (text: string, index: number): number => text.slice(0, index).split('\n').length;

/** Colour literals (hex and colour functions) in `text`, as `line N: …`. */
function findColorLiterals(text: string): string[] {
  return [...text.matchAll(HEX), ...text.matchAll(COLOR_FN)]
    .sort((a, b) => a.index - b.index)
    .map((m) => `line ${lineAt(text, m.index)}: ${m[0]}`);
}

const TEXT_TOKENS = ['text', 'muted', 'dim', 'grass', 'gold', 'sky', 'lava', 'amethyst', 'snow'];
const SURFACES = ['panel', 'inset', 'coal'];
const ACCENT_FILLS = ['gold', 'stone', 'grass', 'sky', 'lava', 'amethyst', 'snow'];
const MIN = 4.5;

describe('contrast (WCAG AA, >= 4.5:1)', () => {
  const pairs: Array<[string, string]> = [
    ...TEXT_TOKENS.flatMap((fg) => SURFACES.map((bg): [string, string] => [fg, bg])),
    ...ACCENT_FILLS.map((bg): [string, string] => ['on-accent', bg]),
  ];

  it.each(pairs)('--color-%s on --color-%s', (fg, bg) => {
    const ratio = contrast(hexOf(fg), hexOf(bg));
    expect(ratio, `--color-${fg} on --color-${bg} is ${ratio.toFixed(2)}:1 (< ${MIN}:1)`).toBeGreaterThanOrEqual(MIN);
  });
});

describe('token names follow DESIGN.md', () => {
  it.each(['primary', 'station-ai', 'station-power', 'station-compiler', 'station-cleanroom', 'status-done',
    'status-active', 'status-next', 'locked', 'grass-light', 'minimap-unvisited'])('--color-%s exists', (name) => {
    expect(() => hexOf(name)).not.toThrow();
  });

  it('semantic roles alias their base colours', () => {
    expect(resolve('color-station-ai').chain).toContain('color-sky');
    expect(resolve('color-locked').chain).toContain('color-stone');
    expect(resolve('focus-color').chain).toContain('color-gold');
  });
});

describe('dirt and stone are never text colours', () => {
  /** Banned as text: anything reaching --color-dirt* or --color-stone*. */
  const banned = (names: Iterable<string>): string[] => [...names].filter((t) => /^color-(?:dirt|stone)/.test(t));
  /**
   * `color` / `fill` declarations (not background-color, border-color, fill-opacity, …) in CSS, inline styles,
   * SVG attributes and quoted TS/TSX style values; the value may start on the next line.
   */
  const TEXT_DECL = /(?<![\w-])(color|fill)\s*[:=]\s*(['"`]?)([^;}"'`]+)/g;

  function offences(text: string): string[] {
    const body = stripComments(text);
    const local = parseDecls(body);
    const out: string[] = [];
    for (const m of body.matchAll(TEXT_DECL)) {
      const [, prop, , raw] = m;
      for (const [, name] of raw.matchAll(VAR_REF)) {
        const hits = banned(reachable(name, local));
        if (hits.length) {
          out.push(`line ${lineAt(body, m.index)}: ${prop}: ${raw.trim()} (reaches ${hits.map((t) => `--${t}`).join(', ')})`);
        }
      }
    }
    return out;
  }

  it('self-check: tokens.css aliases are resolved', () => {
    expect(offences('.x { color: var(--color-locked); }')).toHaveLength(1);
    expect(offences('.x { background-color: var(--color-dirt); border-color: var(--color-stone); }')).toEqual([]);
  });
  it('self-check (a): file-local custom properties are resolved', () => {
    expect(offences('.x { --a: var(--color-stone); } .y { color: var(--a); }')).toHaveLength(1);
    expect(offences('.x { --a: var(--b); --b: var(--color-dirt-dark); } .y { color: var(--a); }')).toHaveLength(1);
  });
  it('self-check (b): a value on the next line is caught, with its line', () => {
    expect(offences('.x {\n  color:\n    var(--color-stone);\n}')).toEqual([
      expect.stringMatching(/^line 2: color: var\(--color-stone\)/),
    ]);
  });
  it('self-check (c): stone-dark / stone-light are banned too', () => {
    expect(offences('.x { color: var(--color-stone-dark); }')).toHaveLength(1);
    expect(offences('.x { color: var(--color-stone-light); }')).toHaveLength(1);
  });
  it('self-check (d): quoted TS/TSX style values are caught', () => {
    expect(offences("const s = { color: 'var(--color-dirt)' };")).toHaveLength(1);
    expect(offences('<p style="color: var(--color-stone)">x</p>')).toHaveLength(1);
  });
  it('self-check (e): fill (SVG text) is checked, fill-opacity is not', () => {
    expect(offences('text { fill: var(--color-dirt); }')).toHaveLength(1);
    expect(offences('<text fill="var(--color-stone)">x</text>')).toHaveLength(1);
    expect(offences('.x { fill-opacity: var(--color-stone); }')).toEqual([]);
  });

  it.each(srcFiles().filter((f) => STYLE_EXT.test(f) && !f.endsWith('.test.ts')))('%s', (file) => {
    const found = offences(read(file));
    expect(found, `${file} uses dirt/stone as text colour:\n${found.join('\n')}`).toEqual([]);
  });
});

describe('every design-token var() in src/ is defined in tokens.css', () => {
  it.each(srcFiles().filter((f) => STYLE_EXT.test(f) && !f.endsWith('.test.ts')))('%s', (file) => {
    const text = read(file);
    const missing = [...text.matchAll(TOKEN_REF)]
      .filter(([, name]) => !tokens.has(name))
      .map((m) => `line ${lineAt(text, m.index)}: --${m[1]}`);
    expect(missing, `${file} references undefined token(s):\n${missing.join('\n')}`).toEqual([]);
  });
});

describe('AD-8: colour literals only in tokens.css', () => {
  it('scanner self-check: hex and colour functions found, #ai/… paths ignored', () => {
    const hash = '#';
    expect(findColorLiterals(`color: ${hash}abc;`)).toHaveLength(1);
    expect(findColorLiterals(`fill="${hash}A1B2C3"`)).toHaveLength(1);
    expect(findColorLiterals(`href="${hash}ai/communitech" ${hash}cleanroom/capstone ${hash}add-on`)).toEqual([]);
    for (const fn of ['rgb', 'rgba', 'hsl', 'hsla', 'RGBA']) {
      expect(findColorLiterals(`background: ${fn}(0, 0, 0, 0.6);`), fn).toHaveLength(1);
    }
  });

  it('tokens.css holds the hex colours', () => {
    expect(findColorLiterals(readFileSync(TOKENS_FILE, 'utf-8')).length).toBeGreaterThan(0);
  });

  it.each(srcFiles().filter((f) => f !== TOKENS_REL && TEXT_EXT.test(f)))('%s', (file) => {
    const found = findColorLiterals(read(file));
    expect(found, `${file} has colour literal(s) outside tokens.css:\n${found.join('\n')}`).toEqual([]);
  });
});
