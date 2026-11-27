/**
 * Preference storage (AD-5): every key is prefixed `fabline:` and lives in `localStorage`.
 * Every access is wrapped in try/catch, so blocked or throwing storage (private mode, disabled site data,
 * SSR with no `window`) reads as `null` and writes are a silent no-op.
 * Progress (`sessionStorage`) arrives in Epic 7.
 */

export const PREFIX = 'fabline:';

export function readPref(key: string): string | null {
  try {
    return window.localStorage.getItem(PREFIX + key);
  } catch {
    return null;
  }
}

export function writePref(key: string, value: string): void {
  try {
    window.localStorage.setItem(PREFIX + key, value);
  } catch {
    // Storage blocked or full: the preference just doesn't persist.
  }
}
