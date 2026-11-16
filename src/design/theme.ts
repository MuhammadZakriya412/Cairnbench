import { z } from 'zod';

export const THEMES = ['cairn-dusk', 'cairn-daylight'] as const;
export const THEME_PREFERENCES = ['system', 'cairn-dusk', 'cairn-daylight'] as const;
export const DENSITIES = ['comfortable', 'compact'] as const;
export const MOTION_PREFERENCES = ['full', 'reduced'] as const;

export const ThemeIdSchema = z.enum(THEMES);
export const ThemePreferenceSchema = z.enum(THEME_PREFERENCES);
export const DensitySchema = z.enum(DENSITIES);
export const MotionPreferenceSchema = z.enum(MOTION_PREFERENCES);

export type ThemeId = z.output<typeof ThemeIdSchema>;
export type ThemePreference = z.output<typeof ThemePreferenceSchema>;
export type Density = z.output<typeof DensitySchema>;
export type MotionPreference = z.output<typeof MotionPreferenceSchema>;

export interface AppearanceSettings {
  theme: ThemeId;
  density: Density;
  motion: MotionPreference;
}

export interface AttributeTarget {
  getAttribute(name: string): string | null;
  setAttribute(name: string, value: string): void;
}

export interface AppearanceStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export interface MediaQueryResult {
  readonly matches: boolean;
  addEventListener?: (type: 'change', listener: () => void) => void;
  removeEventListener?: (type: 'change', listener: () => void) => void;
}

export type MatchMediaFn = (query: string) => MediaQueryResult;

export interface ThemeEnvironmentOptions {
  matchMedia?: MatchMediaFn;
}

export function createAttributeTarget(initial: Record<string, string> = {}): AttributeTarget {
  const attrs = new Map<string, string>(Object.entries(initial));
  return {
    getAttribute: (name: string): string | null => attrs.get(name) ?? null,
    setAttribute: (name: string, value: string): void => {
      attrs.set(name, value);
    },
  };
}

function getDefaultMatchMedia(options?: ThemeEnvironmentOptions): MatchMediaFn | undefined {
  if (options?.matchMedia) return options.matchMedia;
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return (query: string) => window.matchMedia(query);
  }
  return undefined;
}

export function resolveDefaultTheme(matchMediaFn?: MatchMediaFn): ThemeId {
  const matcher = getDefaultMatchMedia(matchMediaFn ? { matchMedia: matchMediaFn } : undefined);
  return matcher && matcher('(prefers-color-scheme: light)').matches ? 'cairn-daylight' : 'cairn-dusk';
}

export function resolveDefaultMotion(matchMediaFn?: MatchMediaFn): MotionPreference {
  const matcher = getDefaultMatchMedia(matchMediaFn ? { matchMedia: matchMediaFn } : undefined);
  return matcher && matcher('(prefers-reduced-motion: reduce)').matches ? 'reduced' : 'full';
}

function setValidatedAttr<T extends string>(
  root: AttributeTarget,
  attr: string,
  schema: z.ZodType<T>,
  value: unknown,
  fallback: () => T,
): T {
  const parsed = schema.safeParse(value);
  if (parsed.success) {
    root.setAttribute(attr, parsed.data);
    return parsed.data;
  }
  const current = schema.safeParse(root.getAttribute(attr));
  if (current.success) return current.data;
  const resolved = fallback();
  root.setAttribute(attr, resolved);
  return resolved;
}

export function getTheme(root: AttributeTarget, options?: ThemeEnvironmentOptions): ThemeId {
  const parsed = ThemeIdSchema.safeParse(root.getAttribute('data-theme'));
  return parsed.success ? parsed.data : resolveDefaultTheme(getDefaultMatchMedia(options));
}

export function setTheme(
  root: AttributeTarget,
  value: unknown,
  options?: ThemeEnvironmentOptions,
): ThemeId {
  const prefParsed = ThemePreferenceSchema.safeParse(value);
  if (prefParsed.success) {
    const resolved: ThemeId =
      prefParsed.data === 'system'
        ? resolveDefaultTheme(getDefaultMatchMedia(options))
        : prefParsed.data;
    root.setAttribute('data-theme', resolved);
    return resolved;
  }
  return setValidatedAttr(root, 'data-theme', ThemeIdSchema, undefined, () =>
    resolveDefaultTheme(getDefaultMatchMedia(options)),
  );
}

export function getDensity(root: AttributeTarget): Density {
  const parsed = DensitySchema.safeParse(root.getAttribute('data-density'));
  return parsed.success ? parsed.data : 'comfortable';
}

export function setDensity(root: AttributeTarget, value: unknown): Density {
  return setValidatedAttr(root, 'data-density', DensitySchema, value, () => 'comfortable');
}

export function getMotion(root: AttributeTarget, options?: ThemeEnvironmentOptions): MotionPreference {
  const parsed = MotionPreferenceSchema.safeParse(root.getAttribute('data-motion'));
  return parsed.success ? parsed.data : resolveDefaultMotion(getDefaultMatchMedia(options));
}

export function setMotion(
  root: AttributeTarget,
  value: unknown,
  options?: ThemeEnvironmentOptions,
): MotionPreference {
  return setValidatedAttr(root, 'data-motion', MotionPreferenceSchema, value, () =>
    resolveDefaultMotion(getDefaultMatchMedia(options)),
  );
}

export function applyAppearance(
  root: AttributeTarget,
  input: { theme?: unknown; density?: unknown; motion?: unknown },
  options?: ThemeEnvironmentOptions,
): AppearanceSettings {
  return {
    theme: setTheme(root, input.theme, options),
    density: setDensity(root, input.density),
    motion: setMotion(root, input.motion, options),
  };
}

export {
  APPEARANCE_STORAGE_KEY,
  readThemePreference,
  restoreAppearance,
  saveAppearance,
  stopAppearanceListener,
  updateThemePreference,
  type StoredAppearanceSettings,
} from './themeStorage';
