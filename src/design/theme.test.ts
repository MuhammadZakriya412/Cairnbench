import { describe, expect, it } from 'vitest';
import {
  applyAppearance,
  createAttributeTarget,
  getDensity,
  getMotion,
  getTheme,
  resolveDefaultMotion,
  resolveDefaultTheme,
  restoreAppearance,
  saveAppearance,
  setDensity,
  setMotion,
  setTheme,
} from './theme';

function createMemoryStorage(initial: Record<string, string> = {}) {
  const map = new Map<string, string>(Object.entries(initial));
  return {
    getItem(key: string): string | null {
      return map.get(key) ?? null;
    },
    setItem(key: string, value: string): void {
      map.set(key, value);
    },
    removeItem(key: string): void {
      map.delete(key);
    },
  };
}

describe('theme attribute controller (03 §3–4, Card 0.2)', () => {
  it('resolves default theme from prefers-color-scheme and falls back to cairn-dusk', () => {
    expect(resolveDefaultTheme()).toBe('cairn-dusk');
    expect(
      resolveDefaultTheme((query) => ({
        matches: query === '(prefers-color-scheme: light)',
      })),
    ).toBe('cairn-daylight');
    expect(
      resolveDefaultTheme((query) => ({
        matches: query === '(prefers-color-scheme: dark)',
      })),
    ).toBe('cairn-dusk');
  });

  it('resolves default motion from prefers-reduced-motion', () => {
    expect(resolveDefaultMotion()).toBe('full');
    expect(
      resolveDefaultMotion((query) => ({
        matches: query === '(prefers-reduced-motion: reduce)',
      })),
    ).toBe('reduced');
  });

  it('sets and reads valid theme, density, and motion attributes on the root', () => {
    const root = createAttributeTarget();

    expect(setTheme(root, 'cairn-daylight')).toBe('cairn-daylight');
    expect(root.getAttribute('data-theme')).toBe('cairn-daylight');
    expect(getTheme(root)).toBe('cairn-daylight');

    expect(setTheme(root, 'cairn-dusk')).toBe('cairn-dusk');
    expect(root.getAttribute('data-theme')).toBe('cairn-dusk');
    expect(getTheme(root)).toBe('cairn-dusk');

    expect(setDensity(root, 'compact')).toBe('compact');
    expect(root.getAttribute('data-density')).toBe('compact');
    expect(getDensity(root)).toBe('compact');

    expect(setMotion(root, 'reduced')).toBe('reduced');
    expect(root.getAttribute('data-motion')).toBe('reduced');
    expect(getMotion(root)).toBe('reduced');
  });

  it('resolves system theme preference using matchMedia when setting theme', () => {
    const root = createAttributeTarget();
    const lightMedia = (query: string) => ({
      matches: query === '(prefers-color-scheme: light)',
    });

    expect(setTheme(root, 'system', { matchMedia: lightMedia })).toBe('cairn-daylight');
    expect(root.getAttribute('data-theme')).toBe('cairn-daylight');
  });

  it('ignores unknown values and preserves existing valid attributes or falls back to defaults', () => {
    const root = createAttributeTarget();

    // When no attribute is set yet, unknown values fall back to default and write valid attribute
    expect(setTheme(root, 'neon-purple')).toBe('cairn-dusk');
    expect(root.getAttribute('data-theme')).toBe('cairn-dusk');

    expect(setDensity(root, 'ultra-dense')).toBe('comfortable');
    expect(root.getAttribute('data-density')).toBe('comfortable');

    expect(setMotion(root, 'bouncy')).toBe('full');
    expect(root.getAttribute('data-motion')).toBe('full');

    // When a valid attribute is already set, unknown values are ignored and do not overwrite it
    setTheme(root, 'cairn-daylight');
    setDensity(root, 'compact');
    setMotion(root, 'reduced');

    expect(setTheme(root, 'invalid-theme')).toBe('cairn-daylight');
    expect(root.getAttribute('data-theme')).toBe('cairn-daylight');

    expect(setDensity(root, 123)).toBe('compact');
    expect(root.getAttribute('data-density')).toBe('compact');

    expect(setMotion(root, null)).toBe('reduced');
    expect(root.getAttribute('data-motion')).toBe('reduced');
  });

  it('saves and restores attributes from storage and ignores unknown stored values', () => {
    const storage = createMemoryStorage();
    const root1 = createAttributeTarget();

    saveAppearance(storage, {
      theme: 'cairn-daylight',
      density: 'compact',
      motion: 'reduced',
    });

    const restored = restoreAppearance(root1, storage);
    expect(restored).toEqual({
      theme: 'cairn-daylight',
      density: 'compact',
      motion: 'reduced',
    });
    expect(root1.getAttribute('data-theme')).toBe('cairn-daylight');
    expect(root1.getAttribute('data-density')).toBe('compact');
    expect(root1.getAttribute('data-motion')).toBe('reduced');

    // Corrupt storage with unknown values and verify restoreAppearance ignores unknown values
    const corruptedStorage = createMemoryStorage({
      'cairnbench:appearance': JSON.stringify({
        theme: 'solarized',
        density: 'giant',
        motion: 'hyper',
      }),
    });
    const root2 = createAttributeTarget();
    const fallback = restoreAppearance(root2, corruptedStorage, {
      matchMedia: (query) => ({ matches: query === '(prefers-color-scheme: light)' }),
    });
    expect(fallback).toEqual({
      theme: 'cairn-daylight',
      density: 'comfortable',
      motion: 'full',
    });
    expect(root2.getAttribute('data-theme')).toBe('cairn-daylight');
    expect(root2.getAttribute('data-density')).toBe('comfortable');
    expect(root2.getAttribute('data-motion')).toBe('full');

    // Also test applyAppearance with partial/unknown values
    const updated = applyAppearance(root2, {
      theme: 'cairn-dusk',
      density: 'unknown-density',
      motion: 'reduced',
    });
    expect(updated).toEqual({
      theme: 'cairn-dusk',
      density: 'comfortable',
      motion: 'reduced',
    });
  });

  it('stores system preference under the single appearance key and follows OS matchMedia changes', () => {
    let isLight = false;
    const listeners = new Set<() => void>();
    const matchMedia = (query: string) => ({
      get matches() {
        return query === '(prefers-color-scheme: light)' ? isLight : false;
      },
      addEventListener(type: string, listener: () => void) {
        if (type === 'change' && query === '(prefers-color-scheme: light)') {
          listeners.add(listener);
        }
      },
      removeEventListener(type: string, listener: () => void) {
        if (type === 'change' && query === '(prefers-color-scheme: light)') {
          listeners.delete(listener);
        }
      },
    });

    const storage = createMemoryStorage();
    const root = createAttributeTarget();

    saveAppearance(storage, {
      theme: 'system',
      density: 'comfortable',
      motion: 'full',
    });

    const rawStored = storage.getItem('cairnbench:appearance');
    expect(rawStored).not.toBeNull();
    expect(JSON.parse(rawStored ?? '{}')).toMatchObject({ theme: 'system' });

    const restored = restoreAppearance(root, storage, { matchMedia });
    expect(restored.theme).toBe('cairn-dusk');
    expect(root.getAttribute('data-theme')).toBe('cairn-dusk');

    // OS switches to light -> root follows automatically
    isLight = true;
    for (const listener of listeners) {
      listener();
    }
    expect(root.getAttribute('data-theme')).toBe('cairn-daylight');

    // OS switches back to dark -> root follows automatically
    isLight = false;
    for (const listener of listeners) {
      listener();
    }
    expect(root.getAttribute('data-theme')).toBe('cairn-dusk');

    // User pins explicit cairn-daylight -> OS changes no longer override it
    saveAppearance(storage, {
      theme: 'cairn-daylight',
      density: 'comfortable',
      motion: 'full',
    });
    setTheme(root, 'cairn-daylight', { matchMedia });
    isLight = false;
    for (const listener of listeners) {
      listener();
    }
    expect(root.getAttribute('data-theme')).toBe('cairn-daylight');
  });
});

