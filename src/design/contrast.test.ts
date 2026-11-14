import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

type ThemeName = 'cairn-daylight' | 'cairn-dusk';

const REQUIRED_COLOR_TOKENS = [
  '--bg',
  '--surface',
  '--border',
  '--border-strong',
  '--text',
  '--text-muted',
  '--accent',
  '--on-accent',
  '--accent-wash',
  '--success',
  '--warning',
  '--danger',
  '--band-bg',
  '--band-text',
  '--band-muted',
] as const;

type ColorToken = (typeof REQUIRED_COLOR_TOKENS)[number];

interface ContrastPairSpec {
  fg: ColorToken;
  bg: ColorToken;
  minRatio: number;
  expectedRatio: number;
}

const DAYLIGHT_PAIRS: readonly ContrastPairSpec[] = [
  { fg: '--text', bg: '--bg', minRatio: 4.5, expectedRatio: 12.79 },
  { fg: '--text', bg: '--surface', minRatio: 4.5, expectedRatio: 14.1 },
  { fg: '--text-muted', bg: '--bg', minRatio: 4.5, expectedRatio: 5.34 },
  { fg: '--text-muted', bg: '--surface', minRatio: 4.5, expectedRatio: 5.88 },
  { fg: '--accent', bg: '--bg', minRatio: 4.5, expectedRatio: 5.06 },
  { fg: '--accent', bg: '--surface', minRatio: 4.5, expectedRatio: 5.58 },
  { fg: '--success', bg: '--bg', minRatio: 4.5, expectedRatio: 4.89 },
  { fg: '--success', bg: '--surface', minRatio: 4.5, expectedRatio: 5.39 },
  { fg: '--warning', bg: '--bg', minRatio: 4.5, expectedRatio: 4.98 },
  { fg: '--warning', bg: '--surface', minRatio: 4.5, expectedRatio: 5.49 },
  { fg: '--danger', bg: '--bg', minRatio: 4.5, expectedRatio: 5.97 },
  { fg: '--danger', bg: '--surface', minRatio: 4.5, expectedRatio: 6.58 },
  { fg: '--on-accent', bg: '--accent', minRatio: 4.5, expectedRatio: 6.02 },
  { fg: '--border-strong', bg: '--bg', minRatio: 3.0, expectedRatio: 3.08 },
  { fg: '--border-strong', bg: '--surface', minRatio: 3.0, expectedRatio: 3.4 },
  { fg: '--text', bg: '--accent-wash', minRatio: 4.5, expectedRatio: 10.85 },
  { fg: '--band-text', bg: '--band-bg', minRatio: 4.5, expectedRatio: 12.79 },
  { fg: '--band-muted', bg: '--band-bg', minRatio: 4.5, expectedRatio: 8.68 },
];

const DUSK_PAIRS: readonly ContrastPairSpec[] = [
  { fg: '--text', bg: '--bg', minRatio: 4.5, expectedRatio: 15.08 },
  { fg: '--text', bg: '--surface', minRatio: 4.5, expectedRatio: 14.04 },
  { fg: '--text-muted', bg: '--bg', minRatio: 4.5, expectedRatio: 6.63 },
  { fg: '--text-muted', bg: '--surface', minRatio: 4.5, expectedRatio: 6.17 },
  { fg: '--accent', bg: '--bg', minRatio: 4.5, expectedRatio: 6.91 },
  { fg: '--accent', bg: '--surface', minRatio: 4.5, expectedRatio: 6.43 },
  { fg: '--success', bg: '--bg', minRatio: 4.5, expectedRatio: 9.18 },
  { fg: '--success', bg: '--surface', minRatio: 4.5, expectedRatio: 8.55 },
  { fg: '--warning', bg: '--bg', minRatio: 4.5, expectedRatio: 9.78 },
  { fg: '--warning', bg: '--surface', minRatio: 4.5, expectedRatio: 9.1 },
  { fg: '--danger', bg: '--bg', minRatio: 4.5, expectedRatio: 7.83 },
  { fg: '--danger', bg: '--surface', minRatio: 4.5, expectedRatio: 7.3 },
  { fg: '--on-accent', bg: '--accent', minRatio: 4.5, expectedRatio: 7.14 },
  { fg: '--border-strong', bg: '--bg', minRatio: 3.0, expectedRatio: 3.95 },
  { fg: '--border-strong', bg: '--surface', minRatio: 3.0, expectedRatio: 3.68 },
  { fg: '--text', bg: '--accent-wash', minRatio: 4.5, expectedRatio: 11.71 },
  { fg: '--band-text', bg: '--band-bg', minRatio: 4.5, expectedRatio: 12.43 },
  { fg: '--band-muted', bg: '--band-bg', minRatio: 4.5, expectedRatio: 6.7 },
  { fg: '--accent', bg: '--band-bg', minRatio: 4.5, expectedRatio: 5.7 },
];

function parseThemeTokens(css: string, theme: ThemeName): Record<string, string> {
  const escaped = theme.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const blockRegex = new RegExp(`\\[data-theme=["']${escaped}["']\\]\\s*\\{([^}]*)\\}`, 'm');
  const match = blockRegex.exec(css);
  if (!match || match[1] === undefined) {
    throw new Error(`Missing CSS block for [data-theme="${theme}"]`);
  }
  const tokens: Record<string, string> = {};
  const declRegex = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;
  let declMatch = declRegex.exec(match[1]);
  while (declMatch !== null) {
    const name = declMatch[1];
    const value = declMatch[2];
    if (name !== undefined && value !== undefined) {
      tokens[name.trim()] = value.trim();
    }
    declMatch = declRegex.exec(match[1]);
  }
  return tokens;
}

function hexToRgb(hex: string): [number, number, number] {
  const normalized = hex.trim();
  const match = /^#([0-9a-fA-F]{6})$/.exec(normalized);
  if (!match || match[1] === undefined) {
    throw new Error(`Invalid 6-digit hex color: ${hex}`);
  }
  const h = match[1];
  const r = Number.parseInt(h.slice(0, 2), 16);
  const g = Number.parseInt(h.slice(2, 4), 16);
  const b = Number.parseInt(h.slice(4, 6), 16);
  return [r, g, b];
}

function srgbChannelToLinear(channel8Bit: number): number {
  const s = channel8Bit / 255;
  return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
}

function relativeLuminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex);
  const rLin = srgbChannelToLinear(r);
  const gLin = srgbChannelToLinear(g);
  const bLin = srgbChannelToLinear(b);
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
}

function wcagContrastRatio(fgHex: string, bgHex: string): number {
  const lum1 = relativeLuminance(fgHex);
  const lum2 = relativeLuminance(bgHex);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
}

describe('design tokens and WCAG 2.x contrast (03 §3–4)', () => {
  const themesPath = resolve(process.cwd(), 'src/design/themes.css');
  const tokensPath = resolve(process.cwd(), 'src/design/tokens.css');

  it('defines both themes, all 15 color tokens, shadows, and --ease-calm in themes.css', () => {
    const css = readFileSync(themesPath, 'utf8');
    expect(css).toContain('--ease-calm: cubic-bezier(0.22, 1, 0.36, 1)');

    for (const theme of ['cairn-daylight', 'cairn-dusk'] as const) {
      const tokens = parseThemeTokens(css, theme);
      for (const token of REQUIRED_COLOR_TOKENS) {
        expect(tokens[token], `${theme} missing ${token}`).toMatch(/^#[0-9A-Fa-f]{6}$/);
      }
    }
  });

  it('meets every WCAG 2.x contrast minimum in cairn-daylight (03 §3)', () => {
    const css = readFileSync(themesPath, 'utf8');
    const tokens = parseThemeTokens(css, 'cairn-daylight');

    for (const pair of DAYLIGHT_PAIRS) {
      const fgHex = tokens[pair.fg];
      const bgHex = tokens[pair.bg];
      expect(fgHex).toBeDefined();
      expect(bgHex).toBeDefined();
      const ratio = wcagContrastRatio(fgHex ?? '', bgHex ?? '');
      expect(
        ratio,
        `cairn-daylight ${pair.fg} (${fgHex}) on ${pair.bg} (${bgHex}) ratio ${ratio.toFixed(2)} < ${pair.minRatio}`,
      ).toBeGreaterThanOrEqual(pair.minRatio);
      expect(Number(ratio.toFixed(2))).toBeCloseTo(pair.expectedRatio, 1);
    }
  });

  it('meets every WCAG 2.x contrast minimum in cairn-dusk (03 §3)', () => {
    const css = readFileSync(themesPath, 'utf8');
    const tokens = parseThemeTokens(css, 'cairn-dusk');

    for (const pair of DUSK_PAIRS) {
      const fgHex = tokens[pair.fg];
      const bgHex = tokens[pair.bg];
      expect(fgHex).toBeDefined();
      expect(bgHex).toBeDefined();
      const ratio = wcagContrastRatio(fgHex ?? '', bgHex ?? '');
      expect(
        ratio,
        `cairn-dusk ${pair.fg} (${fgHex}) on ${pair.bg} (${bgHex}) ratio ${ratio.toFixed(2)} < ${pair.minRatio}`,
      ).toBeGreaterThanOrEqual(pair.minRatio);
      expect(Number(ratio.toFixed(2))).toBeCloseTo(pair.expectedRatio, 1);
    }
  });

  it('defines spacing, radius, shadow, and type scale tokens in tokens.css without hardcoded hex', () => {
    const tokensCss = readFileSync(tokensPath, 'utf8');
    expect(tokensCss).not.toMatch(/#[0-9a-fA-F]{3,8}\b/);

    for (const space of ['4', '8', '12', '16', '24', '32', '48', '64']) {
      expect(tokensCss).toContain(`--space-${space}: ${space}px`);
    }
    for (const radius of ['5', '6', '8', '999']) {
      expect(tokensCss).toContain(`--radius-${radius}: ${radius}px`);
    }
    for (const size of ['12', '14', '16', '18', '20', '24', '32', '44']) {
      expect(tokensCss).toContain(`--text-${size}: ${size}px`);
    }
    expect(tokensCss).toContain('--shadow-sm:');
    expect(tokensCss).toContain('--shadow-md:');
    expect(tokensCss).toContain('--shadow-lg:');
  });
});
