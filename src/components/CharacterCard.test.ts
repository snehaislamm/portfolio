/**
 * Character Card (Story 2.3), rendered with Astro's container API from the real content JSON:
 * one <h2>, every AC value, the 2 certification badges, the 4 interests with decorative icons, the closed
 * Training <details> with exactly the 6 completed courses, the 35-word budget and the lazy decorative portrait.
 */
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { beforeAll, describe, expect, it } from 'vitest';
import courseworkJson from '../content/coursework.json';
import profileJson from '../content/profile.json';
import stationsJson from '../content/stations.json';
import uiJson from '../content/ui.json';
import { sortCourses } from '../lib/coursework';
import CharacterCard from './CharacterCard.astro';

const ui = uiJson.ui;
const title = stationsJson.find((s) => s.id === 'character')!.title;

/** The page order (sortCourses: schema group, then code). */
const COURSE_CODES = ['NE 343', 'NE 344', 'NE 332', 'NE 318', 'NE 333', 'MSE 261'];
const MAX_WORDS = 35;

/** Same rule as Story 2.2: a "word" is a whitespace token containing a letter. */
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

const attr = (tag: string, name: string): string | undefined =>
  new RegExp(`\\s${name}="([^"]*)"`, 'i').exec(tag)?.[1];

/** Visible values: no script/style/svg, no heading, no <dt> labels, no (collapsed) Training <details>. */
function visibleValues(html: string): string {
  const cleaned = html
    .replace(/<(script|style|svg|details|h2|dt)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<span\b[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/span>/gi, ' ');
  return stripTags(cleaned);
}

type CardProps = {
  title: string;
  profile: {
    class: string;
    character: {
      institution: string;
      degree: string;
      specialization: string;
      standing: string;
      home: string;
      nextQuest: string;
      equipment: string[];
    };
    certifications: Array<{ code: string; name: string }>;
    interests: Array<{ id: string; title: string; icon: 'atom' | 'film-stack' | 'node-graph' | 'line-chart' }>;
  };
  courses: Array<{ id: string; code: string; title: string; status: 'completed'; topics: string[] }>;
  ui: typeof ui;
};
const profile = profileJson.profile as CardProps['profile'];
const courses = sortCourses(courseworkJson) as CardProps['courses'];

async function render(props: CardProps): Promise<string> {
  const container = await AstroContainer.create();
  return container.renderToString(CharacterCard, { props });
}

let html = '';
let details = '';

beforeAll(async () => {
  html = await render({ title, profile, courses, ui });
  details = /<details\b[\s\S]*?<\/details>/i.exec(html)?.[0] ?? '';
});

describe('Character Card', () => {
  it('is <section id="character"> with one <h2> "Character Card"', () => {
    expect(html).toMatch(/<section\b[^>]*id="character"/);
    const h2s = [...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)];
    expect(h2s).toHaveLength(1);
    expect(stripTags(h2s[0][1])).toBe('Character Card');
    expect(html).not.toMatch(/<h1\b/i);
  });

  it('shows every AC value, each under its label', () => {
    const rows = Object.fromEntries(
      [...html.matchAll(/<dt\b[^>]*>([\s\S]*?)<\/dt>\s*<dd\b[^>]*>([\s\S]*?)<\/dd>/gi)].map((m) => [
        stripTags(m[1]),
        stripTags(m[2]),
      ]),
    );
    expect(rows).toEqual({
      Class: 'Nano-Engineer',
      School: 'University of Waterloo · BASc Nanotechnology Eng. · Nanoelectronics · 3B (Fall 2026)',
      Home: 'Toronto, ON',
      'Next Quest': `${ui.statusNext} 8-month co-op · Jan–Aug 2027`,
      Equipment: 'AZ-900 AI-900',
      Interests: 'Quantum hardware Nanoelectronics Applied AI Fintech',
    });
    expect(html).toMatch(/class="pill pill--next[^"]*"/);
  });

  it('has 2 <abbr> certification badges with the full names as titles', () => {
    const abbrs = [...html.matchAll(/<abbr\b[^>]*>([\s\S]*?)<\/abbr>/gi)].map((m) => ({
      code: stripTags(m[1]),
      title: decode(attr(m[0], 'title') ?? ''),
    }));
    expect(abbrs).toEqual([
      { code: 'AZ-900', title: 'Microsoft Azure Fundamentals' },
      { code: 'AI-900', title: 'Microsoft Azure AI Fundamentals' },
    ]);
  });

  it('lists the 4 interests by title only, each with an aria-hidden icon', () => {
    const items = [...html.matchAll(/<li\b[^>]*class="interest[^"]*"[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => m[1]);
    expect(items).toHaveLength(4);
    expect(items.map(stripTags)).toEqual(profile.interests.map((i) => i.title));
    for (const item of items) expect(item).toMatch(/<svg\b[^>]*aria-hidden="true"/);
    for (const i of profileJson.profile.interests) expect(html).not.toContain(i.line);
  });

  it('Training is a closed <details> with the summary "Training ▸ 6 courses"', () => {
    expect(details).not.toBe('');
    expect(/<details\b[^>]*>/i.exec(details)![0]).not.toMatch(/\sopen\b/);
    const summary = /<summary\b[^>]*>([\s\S]*?)<\/summary>/i.exec(details)?.[1] ?? '';
    expect(stripTags(summary)).toBe('Training ▸ 6 courses');
    expect(summary).toMatch(/<span\b[^>]*class="training__chevron[^"]*"[^>]*aria-hidden="true"[^>]*>▸<\/span>/);
  });

  it('Training holds exactly the 6 completed course codes, with title and topic chips, and nothing else', () => {
    const codes = [...details.matchAll(/<span\b[^>]*class="course__code[^"]*"[^>]*>([\s\S]*?)<\/span>/gi)].map((m) =>
      stripTags(m[1]),
    );
    expect(codes).toEqual(COURSE_CODES);
    for (const course of courseworkJson) {
      expect(stripTags(details)).toContain(course.title);
      for (const topic of course.topics) expect(stripTags(details)).toContain(topic);
    }
    const chips = [...details.matchAll(/class="chip[^"]*"/g)];
    expect(chips).toHaveLength(courseworkJson.reduce((n, c) => n + c.topics.length, 0));
    // No course code appears outside the details, and no other course-like code inside it.
    const outside = stripTags(html.replace(details, ' '));
    for (const code of COURSE_CODES) expect(outside).not.toContain(code);
    const allCodes = [...stripTags(details).matchAll(/\b[A-Z]{2,4} \d{3}\b/g)].map((m) => m[0]);
    expect(new Set(allCodes)).toEqual(new Set(COURSE_CODES));
  });

  it(`has <= ${MAX_WORDS} visible value words (labels and Training excluded)`, () => {
    const w = words(visibleValues(html));
    expect(w.length, `${w.length} words (> ${MAX_WORDS}): ${w.join(' | ')}`).toBeLessThanOrEqual(MAX_WORDS);
    for (const s of ['Nano-Engineer', 'Waterloo', 'Toronto', 'co-op', 'AZ-900', 'Fintech']) expect(w.join(' ')).toContain(s);
  });

  it('portrait is the 256 px decorative image, lazy-loaded', () => {
    const imgs = [...html.matchAll(/<img\b[^>]*>/gi)].map((m) => m[0]);
    expect(imgs).toHaveLength(1);
    const [img] = imgs;
    expect(attr(img, 'src')).toBe('/assets/character/sneha-portrait-256.webp');
    expect(attr(img, 'width')).toBe('256');
    expect(attr(img, 'height')).toBe('256');
    expect(attr(img, 'loading')).toBe('lazy');
    expect(img).toMatch(/\salt=""/);
  });

  it('has no JS and no buttons', () => {
    expect(html).not.toMatch(/<script\b/i);
    expect(html).not.toMatch(/<button\b/i);
  });
});
