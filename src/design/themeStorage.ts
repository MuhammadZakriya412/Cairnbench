import { z } from 'zod';
import {
  applyAppearance,
  DensitySchema,
  getDensity,
  getMotion,
  MotionPreferenceSchema,
  setTheme,
  ThemePreferenceSchema,
  type AppearanceSettings,
  type AppearanceStorage,
  type AttributeTarget,
  type Density,
  type MatchMediaFn,
  type MotionPreference,
  type ThemeEnvironmentOptions,
  type ThemeId,
  type ThemePreference,
} from './theme';

export interface StoredAppearanceSettings {
  theme: ThemePreference;
  density: Density;
  motion: MotionPreference;
}

export const APPEARANCE_STORAGE_KEY = 'cairnbench:appearance';

const StoredAppearanceRecordSchema = z
  .object({
    theme: z.unknown().optional(),
    density: z.unknown().optional(),
    motion: z.unknown().optional(),
  })
  .passthrough();

const appearanceListenerCleanups = new WeakMap<AttributeTarget, () => void>();

function getDefaultMatchMedia(options?: ThemeEnvironmentOptions): MatchMediaFn | undefined {
  if (options?.matchMedia) return options.matchMedia;
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    return (query: string) => window.matchMedia(query);
  }
  return undefined;
}

function parseStoredRecord(storage?: AppearanceStorage | null) {
  const rawJson = storage?.getItem(APPEARANCE_STORAGE_KEY);
  if (!rawJson) return {};
  try {
    const parsedJson: unknown = JSON.parse(rawJson);
    const recordResult = StoredAppearanceRecordSchema.safeParse(parsedJson);
    return recordResult.success ? recordResult.data : {};
  } catch {
    return {};
  }
}

export function readThemePreference(storage?: AppearanceStorage | null): ThemePreference {
  const parsed = ThemePreferenceSchema.safeParse(parseStoredRecord(storage).theme);
  return parsed.success ? parsed.data : 'system';
}

export function saveAppearance(
  storage: AppearanceStorage,
  settings: StoredAppearanceSettings,
): void {
  const validated: StoredAppearanceSettings = {
    theme: ThemePreferenceSchema.parse(settings.theme),
    density: DensitySchema.parse(settings.density),
    motion: MotionPreferenceSchema.parse(settings.motion),
  };
  storage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(validated));
}

export function updateThemePreference(
  root: AttributeTarget,
  storage: AppearanceStorage | null | undefined,
  nextPref: ThemePreference,
  options?: ThemeEnvironmentOptions,
): ThemeId {
  const resolved = setTheme(root, nextPref, options);
  if (storage) {
    try {
      saveAppearance(storage, {
        theme: nextPref,
        density: getDensity(root),
        motion: getMotion(root, options),
      });
    } catch {
      // Storage may be restricted in private browsing contexts
    }
  }
  return resolved;
}

export function stopAppearanceListener(root: AttributeTarget): void {
  const cleanup = appearanceListenerCleanups.get(root);
  if (cleanup) {
    cleanup();
    appearanceListenerCleanups.delete(root);
  }
}

export function restoreAppearance(
  root: AttributeTarget,
  storage?: AppearanceStorage | null,
  options?: ThemeEnvironmentOptions,
): AppearanceSettings {
  stopAppearanceListener(root);
  const record = parseStoredRecord(storage);
  const initialPref = ThemePreferenceSchema.safeParse(record.theme);
  const effectiveThemeInput = initialPref.success ? initialPref.data : 'system';
  const applied = applyAppearance(
    root,
    { theme: effectiveThemeInput, density: record.density, motion: record.motion },
    options,
  );
  const matcher = getDefaultMatchMedia(options);
  if (matcher) {
    const mql = matcher('(prefers-color-scheme: light)');
    if (typeof mql.addEventListener === 'function') {
      const handleChange = () => {
        const activePref = storage ? readThemePreference(storage) : effectiveThemeInput;
        if (activePref === 'system') {
          setTheme(root, 'system', options);
        }
      };
      mql.addEventListener('change', handleChange);
      appearanceListenerCleanups.set(root, () => {
        mql.removeEventListener?.('change', handleChange);
      });
    }
  }
  return applied;
}
