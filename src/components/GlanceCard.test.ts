/**
 * Glance Card (Story 2.2), rendered with Astro's container API from the real content JSON:
 * one <h1>, exactly the two buttons, the 3 verbatim Proof Tiles, the word budgets and the LCP portrait.
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import profileJson from '../content/profile.json';
import uiJson from '../content/ui.json';
import GlanceCard from './GlanceCard.astro';

const profile = profileJson.profile;
const ui = uiJson.ui;

const TILE_LABELS = ['companies covered, AI I shipped', 'SoC accuracy, EV battery', 'SiNₓ film I made'];
const MAX_WORDS = 30;
const MAX_LABEL_WORDS = 6;

/** A "word" is a whitespace token containing a letter (so ·, 1,200+, ±2% and 2027 don't count). */
const words = (text: string): string[] => text.split(/\s+/).filter((t) => /\p{L}/u.test(t));

const decode = (s: string): string =>
  s
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&');

const stripTags = (html: string): string => decode(html.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

/** Visible card text, excluding buttons: no script/style/svg, no <a class="btn"> links, no aria-hidden. */
function visibleText(html: string): string {
  const cleaned = html
    .replace(/<(script|style|svg)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<a\b[^>]*class="[^"]*\bbtn\b[^"]*"[\s\S]*?<\/a>/gi, ' ')
    .replace(/<span\b[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/span>/gi, ' ');
  return stripTags(cleaned);
}

const attr = (tag: string, name: string): string | undefined =>
  new RegExp(`\\s${name}="([^"]*)"`, 'i').exec(tag)?.[1];

let html = '';

beforeAll(async () => {
  const container = await AstroContainer.create();
  html = await container.renderToString(GlanceCard, { props: { profile, ui, next: 'track' } });
});

describe('Glance Card', () => {
  it('has exactly one <h1>, the name', () => {
    const h1s = [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)];
    expect(h1s).toHaveLength(1);
    expect(stripTags(h1s[0][1])).toBe('Sneha Islam');
  });

  it('has exactly two buttons: ▶ Start → #track and Résumé → the PDF in a new tab', () => {
    const links = [...html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/gi)].map((m) => m[0]);
    expect(html).not.toMatch(/<button\b/i);
    expect(links).toHaveLength(2);

    const [start, resume] = links;
    expect(attr(start, 'href')).toBe('#track');
    expect(stripTags(start)).toBe(ui.start);
    expect(attr(start, 'target')).toBeUndefined();

    expect(attr(resume, 'href')).toBe(profile.contact.resume);
    expect(attr(resume, 'target')).toBe('_blank');
    expect(attr(resume, 'rel')).toBe('noopener');
    expect(resume).toMatch(/<svg\b[^>]*aria-hidden="true"/);
    expect(resume).toMatch(new RegExp(`<span class="sr-only[^"]*"[^>]*> ${ui.opensInNewTab.replace(/[()]/g, '\\$&')}</span>`));
  });

  it('shows the 3 Proof Tiles with the verbatim labels', () => {
    const labels = [...html.matchAll(/<span\b[^>]*class="tile__label[^"]*"[^>]*>([\s\S]*?)<\/span>/gi)].map((m) =>
      stripTags(m[1]),
    );
    const values = [...html.matchAll(/<span\b[^>]*class="tile__value[^"]*"[^>]*>([\s\S]*?)<\/span>/gi)].map((m) =>
      stripTags(m[1]),
    );
    expect(labels).toEqual(TILE_LABELS);
    expect(values).toEqual(['1,200+', '±2%', '102.6 nm']);
    for (const label of labels) {
      const w = words(label);
      expect(w.length, `"${label}" has ${w.length} words (> ${MAX_LABEL_WORDS}): ${w.join(' | ')}`).toBeLessThanOrEqual(
        MAX_LABEL_WORDS,
      );
    }
  });

  it(`has <= ${MAX_WORDS} visible words, buttons excluded`, () => {
    const w = words(visibleText(html));
    expect(w.length, `${w.length} words (> ${MAX_WORDS}): ${w.join(' | ')}`).toBeLessThanOrEqual(MAX_WORDS);
    // Sanity: the card actually carries its pitch.
    for (const s of ['Nano-Engineer', 'Waterloo', 'Sneha', 'silicon', 'co-op', 'Jan–Aug']) expect(w.join(' ')).toContain(s);
  });

  it('word counter self-check', () => {
    expect(words('8-month co-op · Jan–Aug 2027')).toEqual(['8-month', 'co-op', 'Jan–Aug']);
    expect(words('1,200+ ±2% 102.6 nm')).toEqual(['nm']);
  });

  it('portrait is the eager, high-priority LCP image with width/height and the content alt', () => {
    const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
    expect(imgs).toHaveLength(1);
    const [img] = imgs;
    expect(attr(img, 'src')).toBe('/assets/character/sneha-portrait-512.webp');
    expect(attr(img, 'width')).toBe('512');
    expect(attr(img, 'height')).toBe('512');
    expect(attr(img, 'loading')).not.toBe('lazy');
    expect(attr(img, 'fetchpriority')).toBe('high');
    expect(decode(attr(img, 'alt') ?? '')).toBe(profile.portraitAlt);
  });

  describe('advance script (I/O matrix: Keys, Enter)', () => {
    type Handler = (e: FakeEvent) => void;
    type FakeEvent = {
      key: string;
      altKey: boolean;
      ctrlKey: boolean;
      metaKey: boolean;
      shiftKey: boolean;
      defaultPrevented: boolean;
      preventDefault: () => void;
    };
    type El = { tagName: string; isContentEditable?: boolean };

    /** Runs the card's inline script against hand-written fakes; returns a key presser and the spies. */
    function setup(opts: { targetTop?: number; scrollY?: number; innerHeight?: number; scrollHeight?: number } = {}) {
      const body = /<script>([\s\S]*?)<\/script>/i.exec(html)?.[1];
      if (!body) throw new Error('inline <script> not found in the rendered card');
      const { targetTop = 844, scrollY = 0, innerHeight = 844, scrollHeight = 2000 } = opts;
      let handler: Handler | undefined;
      let scrolled = 0;
      let focused = 0;
      const card = { getAttribute: (n: string) => (n === 'data-next' ? 'track' : null) };
      const attrs = new Map<string, string>();
      const focusOpts: unknown[] = [];
      const target = {
        getBoundingClientRect: () => ({ top: targetTop }),
        scrollIntoView: () => void scrolled++,
        hasAttribute: (n: string) => attrs.has(n),
        setAttribute: (n: string, v: string) => void attrs.set(n, v),
        focus: (o: unknown) => {
          focused++;
          focusOpts.push(o);
        },
      };
      const bodyEl: El = { tagName: 'BODY' };
      const document = {
        body: bodyEl,
        activeElement: bodyEl as El | null,
        documentElement: { scrollHeight },
        getElementById: (id: string) => (id === 'glance' ? card : id === 'track' ? target : null),
        addEventListener: (type: string, fn: Handler) => {
          if (type === 'keydown') handler = fn;
        },
      };
      const window = { scrollY, innerHeight };
      new Function('document', 'window', body)(document, window);
      if (!handler) throw new Error('script registered no keydown handler');

      const press = (key: string, mods: Partial<Pick<FakeEvent, 'altKey' | 'ctrlKey' | 'metaKey' | 'shiftKey'>> = {}) => {
        const e: FakeEvent = {
          key,
          altKey: false,
          ctrlKey: false,
          metaKey: false,
          shiftKey: false,
          ...mods,
          defaultPrevented: false,
          preventDefault() {
            this.defaultPrevented = true;
          },
        };
        const before = scrolled;
        const focusedBefore = focused;
        handler!(e);
        return { prevented: e.defaultPrevented, advanced: scrolled > before, focused: focused > focusedBefore };
      };
      return { press, document, attrs, focusOpts };
    }

    const ADVANCED = { prevented: true, advanced: true, focused: true };
    const IGNORED = { prevented: false, advanced: false, focused: false };

    it('advancing focuses #track (tabindex="-1" if it had none) without scrolling again', () => {
      const { press, attrs, focusOpts } = setup();
      press('ArrowDown');
      expect(attrs.get('tabindex')).toBe('-1');
      expect(focusOpts).toEqual([{ preventScroll: true }]);
    });

    it('advancing keeps an existing tabindex on #track', () => {
      const { press, attrs } = setup();
      attrs.set('tabindex', '0');
      press('ArrowDown');
      expect(attrs.get('tabindex')).toBe('0');
    });

    it.each(['ArrowDown', ' ', 'PageDown'])('%j at the top advances to #track', (key) => {
      expect(setup().press(key)).toEqual(ADVANCED);
    });

    it('Enter with focus on <body> advances', () => {
      expect(setup().press('Enter')).toEqual(ADVANCED);
    });

    it('Enter with focus on the Start link is left to native activation', () => {
      const { press, document } = setup();
      document.activeElement = { tagName: 'A' };
      expect(press('Enter')).toEqual(IGNORED);
    });

    it.each(['shiftKey', 'ctrlKey', 'altKey', 'metaKey'] as const)('ArrowDown with %s is not intercepted', (mod) => {
      expect(setup().press('ArrowDown', { [mod]: true })).toEqual(IGNORED);
    });

    it.each([
      ['INPUT', { tagName: 'INPUT' }],
      ['TEXTAREA', { tagName: 'TEXTAREA' }],
      ['contenteditable', { tagName: 'DIV', isContentEditable: true }],
    ])('keys are not intercepted with focus in %s', (_, el) => {
      const { press, document } = setup();
      document.activeElement = el;
      for (const key of ['ArrowDown', ' ', 'PageDown']) expect(press(key), key).toEqual(IGNORED);
    });

    it('is not intercepted once #track is reached (below the card)', () => {
      expect(setup({ targetTop: 1, scrollY: 900 }).press('ArrowDown')).toEqual(IGNORED);
      expect(setup({ targetTop: -200, scrollY: 1100 }).press(' ')).toEqual(IGNORED);
    });

    it('is not intercepted when the page cannot scroll further', () => {
      expect(setup({ scrollY: 622, innerHeight: 844, scrollHeight: 1466 }).press('ArrowDown')).toEqual(IGNORED);
    });

    it.each(['ArrowUp', 'a', 'Tab', 'PageUp'])('unrelated key %j is not intercepted', (key) => {
      expect(setup().press(key)).toEqual(IGNORED);
    });
  });

  it('backdrop is a decorative crispEdges SVG', () => {
    const svg = /<svg\b[^>]*class="glance__backdrop[^"]*"[^>]*>/i.exec(html)?.[0] ?? '';
    expect(svg).toMatch(/aria-hidden="true"/);
    expect(svg).toMatch(/shape-rendering="crispEdges"/);
  });
});
