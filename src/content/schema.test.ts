/** The zod schemas accept the real content and reject bad input, naming the field. */
import { describe, expect, it } from 'vitest';
import achievements from './achievements.json';
import coursework from './coursework.json';
import earlyWork from './early-work.json';
import path from './path.json';
import profile from './profile.json';
import quests from './quests.json';
import {
  achievementSchema,
  courseSchema,
  earlyWorkSchema,
  pathSchema,
  profileSchema,
  questSchema,
  skillGroupSchema,
  stationSchema,
  uiSchema,
} from './schemas';
import skills from './skills.json';
import stations from './stations.json';
import ui from './ui.json';

type Issue = { path: PropertyKey[]; keys?: string[] };
type Schema = { safeParse: (v: unknown) => { success: boolean; error?: { issues: Issue[] } } };

function expectValid(schema: Schema, items: unknown[]): void {
  for (const item of items) {
    const result = schema.safeParse(item);
    expect(result.success, JSON.stringify(result.error?.issues)).toBe(true);
  }
}

/** Rejected, with an issue whose path starts with `field` (dot-separated); unknown keys count by name. */
function expectRejected(schema: Schema, value: unknown, field: string): void {
  const result = schema.safeParse(value);
  expect(result.success).toBe(false);
  const paths = result.error!.issues.flatMap((i) => {
    const base = i.path.map(String).join('.');
    return i.keys ? i.keys.map((k) => (base ? `${base}.${k}` : k)) : [base];
  });
  expect(paths.some((p) => p === field || p.startsWith(`${field}.`)), `${field} not in ${JSON.stringify(paths)}`).toBe(true);
}

const quest = structuredClone(quests.find((q) => q.id === 'ai/communitech')!);
const clone = <T>(v: T): T => structuredClone(v);

describe('schemas accept the real content', () => {
  it('every entry of every collection parses', () => {
    expectValid(profileSchema, [profile.profile]);
    expectValid(stationSchema, stations);
    expectValid(questSchema, quests);
    expectValid(courseSchema, coursework);
    expectValid(skillGroupSchema, skills);
    expectValid(pathSchema, path);
    expectValid(earlyWorkSchema, earlyWork);
    expectValid(achievementSchema, achievements);
    expectValid(uiSchema, [ui.ui]);
  });
});

describe('quest schema rejects', () => {
  it('status "finished"', () => expectRejected(questSchema, { ...clone(quest), status: 'finished' }, 'status'));

  it('a missing slug', () => {
    const { slug: _slug, ...rest } = clone(quest);
    expectRejected(questSchema, rest, 'slug');
  });

  it('an id that is not station/slug', () => expectRejected(questSchema, { ...clone(quest), id: 'ai/plug-co' }, 'id'));

  it('an unknown extra key', () => expectRejected(questSchema, { ...clone(quest), place: 'Waterloo, ON' }, 'place'));

  it('4 metrics', () => {
    const q = clone(quest);
    q.metrics = [...q.metrics, { value: '50+', label: 'sources daily' }];
    expectRejected(questSchema, q, 'metrics');
  });

  it('an empty claim source', () => {
    const q = clone(quest);
    q.captions = [{ text: q.captions[0].text, source: '  ' }];
    expectRejected(questSchema, q, 'captions.0.source');
  });

  it('sort "2025-13"', () => {
    const q = clone(quest);
    q.dates = { ...q.dates, sort: '2025-13' };
    expectRejected(questSchema, q, 'dates.sort');
  });
});

describe('other schemas reject', () => {
  it('2 Proof Tiles', () => {
    const p = clone(profile.profile);
    p.proofTiles = p.proofTiles.slice(0, 2);
    expectRejected(profileSchema, p, 'proofTiles');
  });

  it('a missing ui key', () => {
    const { copyLink: _copyLink, ...rest } = clone(ui.ui);
    expectRejected(uiSchema, rest, 'copyLink');
  });

  it('a misspelled ui key', () => expectRejected(uiSchema, { ...clone(ui.ui), copyLnk: 'Copy link' }, 'copyLnk'));
});
