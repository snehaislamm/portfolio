/**
 * Zod schemas for the content collections (AD-2), in a plain module so Vitest can test them.
 * `src/content.config.ts` wires them to the JSON files; a schema error fails `astro build`,
 * naming the collection, entry and field.
 *
 * Rules shared with `tools/fact_audit.py` and `src/content/content.test.ts`:
 * - Slugs (AD-3): Stations are `ai|power|compiler|cleanroom`, screens `character|speedrun|dock|quantum`,
 *   item slugs are kebab-case and unique per Station, and references use `"<station>/<item>"`.
 * - Numbers are display strings copied verbatim from the inventory, qualifiers kept.
 * - Every Caption, Character Line, Proof Tile and easter egg is an object with a `source`
 *   citing the inventory section (e.g. `"inv §5.1"`).
 */
import { z } from 'astro/zod';

export const STATIONS = ['ai', 'power', 'compiler', 'cleanroom'] as const;
export const SCREENS = ['character', 'speedrun', 'dock', 'quantum'] as const;
export const QUEST_KINDS = ['work', 'course', 'repo'] as const;
export const QUEST_STATUSES = ['done', 'active', 'next'] as const;

export const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const SORT_DATE = /^\d{4}-(?:0[1-9]|1[0-2])$/;
export const QUEST_REF = new RegExp(`^(?:${STATIONS.join('|')})/[a-z0-9]+(?:-[a-z0-9]+)*$`);

const text = z.string().trim().min(1);
const slug = z.string().regex(SLUG, 'must be kebab-case (a-z, 0-9, single hyphens)');
const source = z.string().trim().min(1, 'every claim needs a source (e.g. "inv §5.1")');
const station = z.enum(STATIONS);
const questRef = z.string().regex(QUEST_REF, 'must be "<station>/<item>" (e.g. "ai/communitech")');
const url = z.url({ protocol: /^https$/ });
/** A site path ("/Sneha_Islam_Resume.pdf") or an https URL. */
const href = z.union([z.string().regex(/^\/[^/\s]/, 'must be an absolute site path'), url]);

/** Captions, Character Lines and easter eggs: text that must trace to the inventory. */
const claim = z.strictObject({ text, source });
/** `sort` orders the Quest Log (newest first) and is never shown; `display` is the source's date text. */
const dates = z.strictObject({
  sort: z.string().regex(SORT_DATE, 'must be "YYYY-MM"'),
  display: text,
});
const metric = z.strictObject({ value: text, label: text, qualifier: text.optional() });
const link = z.strictObject({ label: text, href: url });

/** profile: Glance Card, Character Card, interests, contact, availability, Proof Tiles. */
export const profileSchema = z.strictObject({
  name: text,
  class: text,
  school: text,
  tagline: text,
  pageTitle: text,
  portraitAlt: text,
  availability: z.strictObject({ short: text, line: text, source }),
  proofTiles: z.array(z.strictObject({ value: text, label: text, quest: questRef, source })).length(3),
  character: z.strictObject({
    institution: text,
    degree: text,
    specialization: text,
    standing: text,
    home: text,
    nextQuest: text,
    equipment: z.array(text).min(1),
  }),
  certifications: z.array(z.strictObject({ code: text, name: text, earned: text })),
  interests: z
    .array(
      z.strictObject({
        id: slug,
        title: text,
        line: text,
        icon: z.enum(['atom', 'film-stack', 'node-graph', 'line-chart']),
      }),
    )
    .length(4),
  contact: z.strictObject({
    pitch: text,
    email: z.email(),
    linkedin: url,
    github: url,
    resume: href,
  }),
});

/**
 * stations: the 4 Stations (+ Character Lines) and the other Track screens. The collection store is
 * keyed by id and does not keep file order: Track order is STATIONS / SCREENS (EXPERIENCE §2), and each
 * Station lists its Level Cards in order.
 */
export const stationSchema = z.discriminatedUnion('type', [
  z.strictObject({
    id: station,
    type: z.literal('station'),
    title: text,
    biome: text,
    quests: z.array(questRef).min(1),
    characterLine: claim,
  }),
  z.strictObject({
    id: z.enum(SCREENS),
    type: z.literal('screen'),
    title: text,
    label: text.optional(),
    characterLine: claim.optional(),
  }),
]);

/** quests: 17 Level Cards (4 work terms, 5 course projects, 8 repos). */
export const questSchema = z
  .strictObject({
    id: questRef,
    station,
    slug,
    kind: z.enum(QUEST_KINDS),
    status: z.enum(QUEST_STATUSES),
    side: z.boolean(),
    title: text,
    shortTitle: text,
    org: text,
    dates,
    bullets: z.array(text).min(1),
    metrics: z.array(metric).max(3),
    captions: z.array(claim).min(1),
    chips: z.array(text),
    links: z.array(link),
    diagram: z
      .strictObject({ title: text, alt: text, reuse: z.array(z.string().regex(/^SVG-\d+$/)).optional() })
      .optional(),
    easterEggs: z.array(claim).optional(),
  })
  .refine((q) => q.id === `${q.station}/${q.slug}`, {
    message: 'id must equal "<station>/<slug>"',
    path: ['id'],
  });

/** coursework: the 6 completed courses (D8: no planned courses). */
export const courseSchema = z.strictObject({
  id: slug,
  code: text,
  title: text,
  status: z.literal('completed'),
  crossListed: text.optional(),
  group: z.enum(['devices', 'physics', 'materials', 'systems']),
  topics: z.array(text).min(1),
});

/** skills: the 6 Skill Tree groups; résumé-only skills join their group (D11). */
export const skillGroupSchema = z.strictObject({
  id: slug,
  title: text,
  items: z.array(text).min(1),
  resumeItems: z.array(text),
});

/** path: the timeline shown in the Quest Log, newest first (D10: no Ambassador). */
export const pathSchema = z.strictObject({
  id: slug,
  type: z.enum(['academic', 'work', 'next']),
  dates,
  title: text,
  detail: text,
  quest: questRef.optional(),
});

/** early-work: the collapsed "Earlier work" row at the Shipping Dock (not Quests). */
export const earlyWorkSchema = z.strictObject({
  id: slug,
  title: text,
  description: text,
  year: z.string().regex(/^\d{4}$/),
  href: url,
});

/** achievements: the 5 toasts and what unlocks them (FR-22). */
export const achievementSchema = z.strictObject({
  id: slug,
  title: text,
  unlock: z.union([questRef, z.enum(SCREENS)]),
});

/** ui: UI chrome strings (AD-2: components hold no hard-coded copy). Every key is required. */
export const uiSchema = z.strictObject({
  resume: text,
  resumePdf: text,
  start: text,
  inspect: text,
  showMore: text,
  close: text,
  copyLink: text,
  copy: text,
  copied: text,
  clipboardFallback: text,
  repo: text,
  details: text,
  skipToContent: text,
  email: text,
  linkedin: text,
  github: text,
  more: text,
  map: text,
  track: text,
  motionOn: text,
  motionOff: text,
  skillTree: text,
  questLog: text,
  questsViewed: text,
  stationsVisited: text,
  statusCompleted: text,
  statusActive: text,
  statusNext: text,
  mainQuest: text,
  sideQuest: text,
  earlierWork: text,
  achievement: text,
  allQuestsSeen: text,
});
