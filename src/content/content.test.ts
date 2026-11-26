/**
 * Content shape rules the zod schemas can't express per entry (Story 1.4):
 * slugs (AD-3), the 17 Quests, D3/D8/D10 exclusions, and achievement unlock targets.
 */
import { readdirSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import achievements from './achievements.json';
import coursework from './coursework.json';
import earlyWork from './early-work.json';
import path from './path.json';
import profile from './profile.json';
import quests from './quests.json';
import skills from './skills.json';
import stations from './stations.json';
import ui from './ui.json';

const DIR = new URL('./', import.meta.url);
const KEBAB = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const STATIONS = ['ai', 'power', 'compiler', 'cleanroom'];
const SCREENS = ['character', 'speedrun', 'dock', 'quantum'];

/** EXPERIENCE §5 rows, in Track order. */
const EXPECTED_QUESTS = [
  'ai/communitech',
  'ai/plug-co',
  'ai/avanade',
  'ai/muse',
  'ai/facesolve',
  'ai/coa-forge',
  'ai/econ-toolkit',
  'power/battery-wc',
  'power/zonecore',
  'power/modcell',
  'compiler/fabricfit',
  'compiler/tilec',
  'compiler/tensor-solver',
  'cleanroom/mis-capacitor',
  'cleanroom/vaclab',
  'cleanroom/capstone',
  'cleanroom/recycling',
];

const BANNED = /ambassador|PHYS[\s_-]*\d|SYDE[\s_-]*572|ECE[\s_-]*457|MTE[\s_-]*544|STAT[\s_-]*341/i;

/** Every content JSON file, raw, so the ban test also covers files added later. */
function contentFiles(): Array<[string, string]> {
  return readdirSync(DIR)
    .filter((f) => f.endsWith('.json'))
    .map((f) => [f, readFileSync(new URL(f, DIR), 'utf-8')]);
}

/** Throws naming the first bad or duplicate slug in each station. */
function checkSlugs(items: Array<{ station: string; slug: string }>): void {
  const seen = new Set<string>();
  for (const { station, slug } of items) {
    if (!STATIONS.includes(station)) throw new Error(`unknown station "${station}" (slug "${slug}")`);
    if (!KEBAB.test(slug)) throw new Error(`slug "${slug}" in station "${station}" is not kebab-case`);
    const ref = `${station}/${slug}`;
    if (seen.has(ref)) throw new Error(`duplicate slug "${slug}" in station "${station}"`);
    seen.add(ref);
  }
}

describe('content files', () => {
  it('has exactly the 9 collections', () => {
    expect(contentFiles().map(([f]) => f).sort()).toEqual(
      ['achievements', 'coursework', 'early-work', 'path', 'profile', 'quests', 'skills', 'stations', 'ui'].map((n) => `${n}.json`),
    );
  });

  it('contains no Ambassador entry and no planned course code (D8, D10)', () => {
    for (const [file, raw] of contentFiles()) {
      expect(raw, file).not.toMatch(BANNED);
    }
  });
});

describe('slugs (AD-3)', () => {
  it('are kebab-case and unique per station', () => {
    expect(() => checkSlugs(quests)).not.toThrow();
    for (const q of quests) expect(q.id).toBe(`${q.station}/${q.slug}`);
  });

  it('names a bad slug', () => {
    expect(() => checkSlugs([{ station: 'ai', slug: 'Plug_Co' }])).toThrow('slug "Plug_Co" in station "ai" is not kebab-case');
  });

  it('names a duplicate slug', () => {
    const dup = [
      { station: 'ai', slug: 'muse' },
      { station: 'power', slug: 'muse' },
      { station: 'ai', slug: 'muse' },
    ];
    expect(() => checkSlugs(dup)).toThrow('duplicate slug "muse" in station "ai"');
  });

  it('other collection ids are kebab-case and unique', () => {
    // The file loader silently drops an entry without an id, so every entry must carry one.
    for (const items of [coursework, path, achievements, stations, skills, earlyWork, profile.profile.interests]) {
      const ids = items.map((i) => i.id);
      for (const id of ids) expect(id).toMatch(KEBAB);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});

describe('collection sizes', () => {
  it('path has 9 items, skills 6 groups, early-work 3 items', () => {
    expect(path).toHaveLength(9);
    expect(skills).toHaveLength(6);
    expect(earlyWork).toHaveLength(3);
  });

  it('profile.json and ui.json each hold exactly one keyed entry', () => {
    expect(Object.keys(profile)).toEqual(['profile']);
    expect(Object.keys(ui)).toEqual(['ui']);
  });
});

describe('quests', () => {
  it('are exactly the 17 EXPERIENCE §5 cards', () => {
    expect(quests.map((q) => q.id)).toEqual(EXPECTED_QUESTS);
  });

  it('are 4 work terms, 5 course projects and 8 repos', () => {
    const count = (kind: string) => quests.filter((q) => q.kind === kind).length;
    expect([count('work'), count('course'), count('repo')]).toEqual([4, 5, 8]);
  });

  it('are 16 done and 1 active (the capstone)', () => {
    expect(quests.filter((q) => q.status === 'done')).toHaveLength(16);
    expect(quests.filter((q) => q.status === 'active').map((q) => q.id)).toEqual(['cleanroom/capstone']);
  });

  it('have 3 Side Quests and 14 Main', () => {
    expect(quests.filter((q) => q.side).map((q) => q.slug).sort()).toEqual(['econ-toolkit', 'recycling', 'tensor-solver']);
  });

  it('have at most 3 metrics and at least one sourced Caption', () => {
    for (const q of quests) {
      expect(q.metrics.length, q.id).toBeLessThanOrEqual(3);
      expect(q.captions.length, q.id).toBeGreaterThan(0);
      for (const c of q.captions) expect(c.source, q.id).toMatch(/\S/);
    }
  });
});

describe('stations', () => {
  it('lists the 4 Stations and the 4 other screens', () => {
    const ids = (type: string) => stations.filter((s) => s.type === type).map((s) => s.id);
    expect(ids('station')).toEqual(STATIONS);
    expect(ids('screen').sort()).toEqual([...SCREENS].sort());
  });

  it('each Station lists exactly its own Level Cards, in EXPERIENCE §5 order', () => {
    const listed = stations.flatMap((s) => ('quests' in s && s.quests ? s.quests : []));
    expect(listed).toEqual(EXPECTED_QUESTS);
    for (const s of stations) {
      if ('quests' in s && s.quests) for (const ref of s.quests) expect(ref.startsWith(`${s.id}/`), ref).toBe(true);
    }
  });
});

describe('coursework', () => {
  it('is the 6 completed courses (D8)', () => {
    expect(coursework.map((c) => c.code)).toEqual(['NE 343', 'NE 344', 'NE 332', 'NE 333', 'NE 318', 'MSE 261']);
    for (const c of coursework) expect(c.status).toBe('completed');
  });
});

describe('references', () => {
  const targets = new Set<string>([...quests.map((q) => q.id), ...SCREENS]);

  it('every achievement unlock resolves to a quest or screen slug', () => {
    expect(achievements).toHaveLength(5);
    for (const a of achievements) expect(targets.has(a.unlock), `${a.id} → ${a.unlock}`).toBe(true);
  });

  it('every Proof Tile quest reference resolves', () => {
    for (const t of profile.profile.proofTiles) expect(targets.has(t.quest), `${t.value} → ${t.quest}`).toBe(true);
  });

  it('every path quest reference resolves', () => {
    for (const p of path) if ('quest' in p && p.quest) expect(targets.has(p.quest), `${p.id} → ${p.quest}`).toBe(true);
  });
});
