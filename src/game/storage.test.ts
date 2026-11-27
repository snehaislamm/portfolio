/**
 * Preference storage (Story 2.4): `fabline:` prefix, localStorage, and silent fallbacks when storage is
 * missing (SSR), blocked or throwing.
 */
import { afterEach, describe, expect, it, vi } from 'vitest';
import { PREFIX, readPref, writePref } from './storage';

function memoryStorage() {
  const data = new Map<string, string>();
  return {
    data,
    getItem: (k: string) => (data.has(k) ? data.get(k)! : null),
    setItem: (k: string, v: string) => void data.set(k, String(v)),
  };
}

const throwing = {
  getItem: () => {
    throw new Error('SecurityError');
  },
  setItem: () => {
    throw new Error('QuotaExceededError');
  },
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('storage', () => {
  it('prefixes keys with fabline:', () => {
    expect(PREFIX).toBe('fabline:');
    const storage = memoryStorage();
    vi.stubGlobal('window', { localStorage: storage });
    writePref('motion', 'off');
    expect(storage.data.get('fabline:motion')).toBe('off');
    expect(storage.data.has('motion')).toBe(false);
    expect(readPref('motion')).toBe('off');
  });

  it('reads null for a missing key', () => {
    vi.stubGlobal('window', { localStorage: memoryStorage() });
    expect(readPref('motion')).toBeNull();
  });

  it('blocked storage: read -> null, write is a silent no-op', () => {
    vi.stubGlobal('window', { localStorage: throwing });
    expect(readPref('motion')).toBeNull();
    expect(() => writePref('motion', 'on')).not.toThrow();
  });

  it('a throwing localStorage getter (blocked site data) is caught', () => {
    const win = {};
    Object.defineProperty(win, 'localStorage', {
      get() {
        throw new Error('SecurityError');
      },
    });
    vi.stubGlobal('window', win);
    expect(readPref('motion')).toBeNull();
    expect(() => writePref('motion', 'on')).not.toThrow();
  });

  it('no window (SSR): read -> null, write is a no-op', () => {
    expect(typeof window).toBe('undefined');
    expect(readPref('motion')).toBeNull();
    expect(() => writePref('motion', 'on')).not.toThrow();
  });
});
