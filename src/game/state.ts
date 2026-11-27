/**
 * The game-state store (AD-5): the single source of truth for game state, framework-free (nanostores).
 * Each piece of state is an atom with exactly one writer function; nothing else may `.set()` it.
 * Story 2.4: `motion`. Story 8.6 adds `sound` + `setSound` the same way (`fabline:sound`).
 *
 * `resolveMotion()` must resolve exactly like the blocking head script in `src/layouts/Game.astro`
 * (state.test.ts runs both against the same cases):
 *   1. `localStorage["fabline:motion"]` if it is exactly "on" or "off"
 *   2. otherwise `prefers-reduced-motion: reduce` -> "off", else "on"
 *   3. any error (no window, no matchMedia) -> "off"
 *
 * This module imports nothing from components, islands or React.
 *
 * Hydration: on the server `$motion` is always 'off', in the browser it is the resolved value. Islands must
 * read `$motion` only after mount (e.g. in an effect, or via client:only), never to decide SSR markup.
 */
import { atom } from 'nanostores';
import { readPref, writePref } from './storage';

export type Motion = 'on' | 'off';

export const MOTION_KEY = 'motion';
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

const isMotion = (v: unknown): v is Motion => v === 'on' || v === 'off';

export function resolveMotion(): Motion {
  try {
    if (typeof window === 'undefined') return 'off';
    const stored = readPref(MOTION_KEY);
    if (isMotion(stored)) return stored;
    return window.matchMedia(REDUCED_MOTION_QUERY).matches ? 'off' : 'on';
  } catch {
    return 'off';
  }
}

export const $motion = atom<Motion>(resolveMotion());

/** The only writer of `$motion`: sets the atom, persists it, and mirrors `<html data-motion>`. */
export function setMotion(value: Motion): void {
  if (!isMotion(value)) return;
  $motion.set(value);
  writePref(MOTION_KEY, value);
  try {
    document.documentElement.dataset.motion = value;
  } catch {
    // No document (SSR): the atom and storage still hold the value.
  }
}
