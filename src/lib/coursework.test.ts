import { describe, expect, it } from 'vitest';
import courseworkJson from '../content/coursework.json';
import { sortCourses } from './coursework';

const PAGE_ORDER = ['NE 343', 'NE 344', 'NE 332', 'NE 318', 'NE 333', 'MSE 261'];

describe('sortCourses', () => {
  it('orders the courses by schema group, then code', () => {
    expect(sortCourses(courseworkJson).map((c) => c.code)).toEqual(PAGE_ORDER);
  });

  it('does not depend on the input order and does not mutate it', () => {
    const reversed = [...courseworkJson].reverse();
    const before = reversed.map((c) => c.code);
    expect(sortCourses(reversed).map((c) => c.code)).toEqual(PAGE_ORDER);
    expect(reversed.map((c) => c.code)).toEqual(before);
  });
});
