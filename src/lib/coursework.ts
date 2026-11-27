/**
 * Course order for the Character Card's Training list (Story 2.3). The content collection store does not
 * keep coursework.json's order, so courses are sorted by group (in `courseSchema`'s enum order), then by code.
 */
import { courseSchema } from '../content/schemas';

const GROUPS: readonly string[] = courseSchema.shape.group.options;

/** Returns a new array: group order from the schema, then code (deterministic). */
export function sortCourses<T extends { group: string; code: string }>(courses: readonly T[]): T[] {
  return [...courses].sort((a, b) => GROUPS.indexOf(a.group) - GROUPS.indexOf(b.group) || a.code.localeCompare(b.code));
}
