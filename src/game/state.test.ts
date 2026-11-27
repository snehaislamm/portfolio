/**
 * Motion preference (Story 2.4): the store (`resolveMotion`, `$motion`, `setMotion`) and the blocking head
 * script in Game.astro must resolve identically. Every case below runs through both.
 * Resolution: stored "on"/"off" wins, else prefers-reduced-motion (reduce -> off, else on), any error -> off.
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import Game from '../layouts/Game.astro';

type Stored = string | null | 'throws';
type Reduce = boolean | 'missing' | 'throws';
interface Case {
  name: string;
  stored: Stored;
  reduce: Reduce;
  expected: 'on' | 'off';
}

const CASES: Case[] = [
  { name: 'OS reduce, nothing stored', stored: null, reduce: true, expected: 'off' },
  { name: 'OS no preference, nothing stored', stored: null, reduce: false, expected: 'on' },
  { name: 'stored "on" wins over OS reduce', stored: 'on', reduce: true, expected: 'on' },
  { name: 'stored "off" wins over OS no preference', stored: 'off', reduce: false, expected: 'off' },
  { name: 'junk stored, OS reduce', stored: 'maybe', reduce: true, expected: 'off' },
  { name: 'junk stored, OS no preference', stored: 'maybe', reduce: false, expected: 'on' },
  { name: 'not exact ("ON") counts as junk', stored: 'ON', reduce: false, expected: 'on' },
  { name: 'blocked storage, OS reduce', stored: 'throws', reduce: true, expected: 'off' },
  { name: 'blocked storage, OS no preference', stored: 'throws', reduce: false, expected: 'on' },
  { name: 'no matchMedia, nothing stored', stored: null, reduce: 'missing', expected: 'off' },
  { name: 'no matchMedia, stored "on"', stored: 'on', reduce: 'missing', expected: 'on' },
  { name: 'matchMedia throws', stored: null, reduce: 'throws', expected: 'off' },
  { name: 'blocked storage and no matchMedia', stored: 'throws', reduce: 'missing', expected: 'off' },
];

/** A fake browser: localStorage + matchMedia per the case, and an <html> whose dataset mirrors data-*. */
function fakeBrowser(stored: Stored, reduce: Reduce) {
  const data = new Map<string, string>();
  if (typeof stored === 'string' && stored !== 'throws') data.set('fabline:motion', stored);
  const localStorage =
    stored === 'throws'
      ? {
          getItem: () => {
            throw new Error('SecurityError');
          },
          setItem: () => {
            throw new Error('SecurityError');
          },
        }
      : {
          getItem: (k: string) => (data.has(k) ? data.get(k)! : null),
          setItem: (k: string, v: string) => void data.set(k, String(v)),
        };
  const queries: string[] = [];
  const window: Record<string, unknown> = { localStorage };
  if (reduce !== 'missing') {
    window.matchMedia = (q: string) => {
      queries.push(q);
      if (reduce === 'throws') throw new Error('matchMedia failed');
      return { matches: q === '(prefers-reduced-motion: reduce)' && reduce === true };
    };
  }
  const dataset: Record<string, string> = { motion: 'off' };
  const documentElement = {
    dataset,
    setAttribute: (n: string, v: string) => {
      if (n === 'data-motion') dataset.motion = v;
    },
    getAttribute: (n: string) => (n === 'data-motion' ? dataset.motion : null),
  };
  const document = { documentElement };
  return { window, document, data, queries };
}

let headScript = '';
let html = '';

beforeAll(async () => {
  const container = await AstroContainer.create();
  html = await container.renderToString(Game, { props: { title: 'T' }, slots: { default: '<main></main>' } });
  const head = /<head>([\s\S]*?)<\/head>/i.exec(html)?.[1] ?? '';
  headScript =
    [...head.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]).find((t) => t.includes('fabline:motion')) ??
    '';
  if (!headScript.includes('fabline:motion')) throw new Error('motion head script not found in Game.astro <head>');
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

/** Runs the head script against a fresh fake browser; returns the data-motion it set. */
function runHeadScript(stored: Stored, reduce: Reduce): string {
  const b = fakeBrowser(stored, reduce);
  new Function('window', 'document', headScript)(b.window, b.document);
  return b.document.documentElement.dataset.motion;
}

/** Loads a fresh copy of state.ts under a fake browser (module init runs resolveMotion). */
async function loadState(stored: Stored, reduce: Reduce) {
  const b = fakeBrowser(stored, reduce);
  vi.stubGlobal('window', b.window);
  vi.stubGlobal('document', b.document);
  const state = await import('./state');
  return { ...state, browser: b };
}

describe('Game.astro markup', () => {
  it('<html> defaults to data-motion="off" (no JS -> still page) and has no data-mode', () => {
    expect(html).toMatch(/<html\b[^>]*\sdata-motion="off"/i);
    expect(html).not.toMatch(/data-mode/);
  });

  // Script-before-CSS order is enforced on the real build by tools/check_dist.py rule 5 (no CSS here).
});

describe('motion resolution (head script and store agree)', () => {
  for (const c of CASES) {
    it(`${c.name} -> ${c.expected}`, async () => {
      expect(runHeadScript(c.stored, c.reduce), 'head script').toBe(c.expected);
      const { resolveMotion, $motion } = await loadState(c.stored, c.reduce);
      expect($motion.get(), '$motion at init').toBe(c.expected);
      expect(resolveMotion(), 'resolveMotion()').toBe(c.expected);
    });
  }

  it('asks matchMedia for exactly the reduced-motion query', async () => {
    const { browser } = await loadState(null, false);
    expect(browser.queries).toEqual(['(prefers-reduced-motion: reduce)']);
  });

  it('no window (SSR) -> off', async () => {
    expect(typeof window).toBe('undefined');
    const { resolveMotion, $motion } = await import('./state');
    expect($motion.get()).toBe('off');
    expect(resolveMotion()).toBe('off');
  });
});

describe('setMotion', () => {
  it('sets the atom, persists fabline:motion and mirrors <html data-motion>', async () => {
    const { $motion, setMotion, browser } = await loadState(null, false);
    expect($motion.get()).toBe('on');
    const seen: string[] = [];
    const unbind = $motion.listen((v) => void seen.push(v));
    setMotion('off');
    unbind();
    expect($motion.get()).toBe('off');
    expect(seen).toEqual(['off']);
    expect(browser.data.get('fabline:motion')).toBe('off');
    expect(browser.document.documentElement.dataset.motion).toBe('off');
  });

  it('persistence: setMotion("off") then re-init -> off (store and head script)', async () => {
    const first = await loadState(null, false);
    first.setMotion('off');
    expect(first.browser.data.get('fabline:motion')).toBe('off');

    // Re-init: a fresh module and a fresh head-script run against the same storage.
    vi.resetModules();
    vi.stubGlobal('window', first.browser.window);
    const again = await import('./state');
    expect(again.$motion.get()).toBe('off');
    const doc = fakeBrowser(null, false).document;
    new Function('window', 'document', headScript)(first.browser.window, doc);
    expect(doc.documentElement.dataset.motion).toBe('off');
  });

  it('blocked storage: updates the atom and the DOM, does not throw', async () => {
    const { $motion, setMotion, browser } = await loadState('throws', true);
    expect($motion.get()).toBe('off');
    expect(() => setMotion('on')).not.toThrow();
    expect($motion.get()).toBe('on');
    expect(browser.document.documentElement.dataset.motion).toBe('on');
  });

  it('no document (SSR): updates the atom, does not throw', async () => {
    const { $motion, setMotion } = await import('./state');
    expect(() => setMotion('on')).not.toThrow();
    expect($motion.get()).toBe('on');
  });

  it('ignores values other than "on" / "off"', async () => {
    const { $motion, setMotion, browser } = await loadState(null, true);
    setMotion('maybe' as never);
    expect($motion.get()).toBe('off');
    expect(browser.data.has('fabline:motion')).toBe(false);
  });
});

describe('layering (AD-5)', () => {
  it('src/game/ imports nothing from components, islands or React', async () => {
    const files = import.meta.glob(['./*.ts', '!./*.test.ts'], { query: '?raw', import: 'default', eager: true });
    expect(Object.keys(files).length).toBeGreaterThan(0);
    for (const [path, src] of Object.entries(files) as [string, string][]) {
      const specifiers = [...src.matchAll(/(?:from|import)\s*\(?\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
      for (const s of specifiers) {
        expect(s, `${path} imports ${s}`).not.toMatch(/components|islands|^react(-dom)?(\/|$)|@nanostores\/react/);
      }
    }
  });
});
