/**
 * Content collections (AD-2): every fact, string and metric lives in `src/content/*.json`.
 * The zod schemas live in `src/content/schemas.ts` (tested by `schema.test.ts`); a schema error
 * fails `astro build`, naming the collection, entry and field.
 */
import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
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
} from './content/schemas';

export const collections = {
  profile: defineCollection({ loader: file('src/content/profile.json'), schema: profileSchema }),
  stations: defineCollection({ loader: file('src/content/stations.json'), schema: stationSchema }),
  quests: defineCollection({ loader: file('src/content/quests.json'), schema: questSchema }),
  coursework: defineCollection({ loader: file('src/content/coursework.json'), schema: courseSchema }),
  skills: defineCollection({ loader: file('src/content/skills.json'), schema: skillGroupSchema }),
  path: defineCollection({ loader: file('src/content/path.json'), schema: pathSchema }),
  'early-work': defineCollection({ loader: file('src/content/early-work.json'), schema: earlyWorkSchema }),
  achievements: defineCollection({ loader: file('src/content/achievements.json'), schema: achievementSchema }),
  ui: defineCollection({ loader: file('src/content/ui.json'), schema: uiSchema }),
};
