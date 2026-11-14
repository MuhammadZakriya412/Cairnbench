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

export type MatchMediaFn = (query: string) => { readonly matches: boolean };

export interface ThemeEnvironmentOptions {
  matchMedia?: MatchMediaFn;
}

export const APPEARANCE_STORAGE_KEY = 'cairnbench:appearance';

const StoredAppearanceRecordSchema = z
  .object({
    theme: z.unknown().optional(),
    density: z.unknown().optional(),
    motion: z.unknown().optional(),
  })
  .passthrough();

export function createAttributeTarget(
  initial: Record<string, string> = {},
): AttributeTarget {
  const attrs = new Map<string, string>(Object.entries(initial));
  return {
    getAttribute(name: string): string | null {
      return attrs.get(name) ?? null;
    },
    setAttribute(name: string, value: string): void {
      attrs.set(name, value);
    },
  };
}

function getDefaultMatchMedia(options?: ThemeEnvironmentOptions): MatchMediaFn | undefined {
  if (options?.matchMedia) {
    return options.matchMedia;
  }
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return (query: string) => window.matchMedia(query);
  }
  return undefined;
}

export function resolveDefaultTheme(matchMediaFn?: MatchMediaFn): ThemeId {
  const matcher = getDefaultMatchMedia(matchMediaFn ? { matchMedia: matchMediaFn } : undefined);
  if (matcher && matcher('(prefers-color-scheme: light)').matches) {
    return 'cairn-daylight';
  }
  return 'cairn-dusk';
}

export function resolveDefaultMotion(matchMediaFn?: MatchMediaFn): MotionPreference {
  const matcher = getDefaultMatchMedia(matchMediaFn ? { matchMedia: matchMediaFn } : undefined);
  if (matcher && matcher('(prefers-reduced-motion: reduce)').matches) {
    return 'reduced';
  }
  return 'full';
}

export function getTheme(
  root: AttributeTarget,
  options?: ThemeEnvironmentOptions,
): ThemeId {
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
  const currentAttr = ThemeIdSchema.safeParse(root.getAttribute('data-theme'));
  if (currentAttr.success) {
    return currentAttr.data;
  }
  const fallback = resolveDefaultTheme(getDefaultMatchMedia(options));
  root.setAttribute('data-theme', fallback);
  return fallback;
}

export function getDensity(root: AttributeTarget): Density {
  const parsed = DensitySchema.safeParse(root.getAttribute('data-density'));
  return parsed.success ? parsed.data : 'comfortable';
}

export function setDensity(root: AttributeTarget, value: unknown): Density {
  const parsed = DensitySchema.safeParse(value);
  if (parsed.success) {
    root.setAttribute('data-density', parsed.data);
    return parsed.data;
  }
  const currentAttr = DensitySchema.safeParse(root.getAttribute('data-density'));
  if (currentAttr.success) {
    return currentAttr.data;
  }
  root.setAttribute('data-density', 'comfortable');
  return 'comfortable';
}

export function getMotion(
  root: AttributeTarget,
  options?: ThemeEnvironmentOptions,
): MotionPreference {
  const parsed = MotionPreferenceSchema.safeParse(root.getAttribute('data-motion'));
  return parsed.success ? parsed.data : resolveDefaultMotion(getDefaultMatchMedia(options));
}

export function setMotion(
  root: AttributeTarget,
  value: unknown,
  options?: ThemeEnvironmentOptions,
): MotionPreference {
  const parsed = MotionPreferenceSchema.safeParse(value);
  if (parsed.success) {
    root.setAttribute('data-motion', parsed.data);
    return parsed.data;
  }
  const currentAttr = MotionPreferenceSchema.safeParse(root.getAttribute('data-motion'));
  if (currentAttr.success) {
    return currentAttr.data;
  }
  const fallback = resolveDefaultMotion(getDefaultMatchMedia(options));
  root.setAttribute('data-motion', fallback);
  return fallback;
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

export function saveAppearance(
  storage: AppearanceStorage,
  settings: AppearanceSettings,
): void {
  const validated = {
    theme: ThemeIdSchema.parse(settings.theme),
    density: DensitySchema.parse(settings.density),
    motion: MotionPreferenceSchema.parse(settings.motion),
  };
  storage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(validated));
}

export function restoreAppearance(
  root: AttributeTarget,
  storage?: AppearanceStorage | null,
  options?: ThemeEnvironmentOptions,
): AppearanceSettings {
  const rawJson = storage?.getItem(APPEARANCE_STORAGE_KEY);
  if (!rawJson) {
    return applyAppearance(root, {}, options);
  }
  let parsedJson: unknown;
  try {
    parsedJson = JSON.parse(rawJson);
  } catch {
    return applyAppearance(root, {}, options);
  }
  const recordResult = StoredAppearanceRecordSchema.safeParse(parsedJson);
  if (!recordResult.success) {
    return applyAppearance(root, {}, options);
  }
  return applyAppearance(
    root,
    {
      theme: recordResult.data.theme,
      density: recordResult.data.density,
      motion: recordResult.data.motion,
    },
    options,
  );
}
