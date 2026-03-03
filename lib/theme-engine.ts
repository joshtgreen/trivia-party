import type { ThemeTokens, Mood } from "./types";

/**
 * Mood-based HSL range presets for generating CSS custom properties.
 * Each mood defines saturation and lightness ranges for surfaces and text.
 */
const MOOD_PRESETS: Record<
  Mood,
  {
    bgL: number;
    surfaceL: number;
    surface2L: number;
    textL: number;
    mutedTextL: number;
    primaryS: number;
    primaryL: number;
    accentS: number;
    accentL: number;
  }
> = {
  clean: {
    bgL: 98,
    surfaceL: 100,
    surface2L: 95,
    textL: 12,
    mutedTextL: 45,
    primaryS: 55,
    primaryL: 45,
    accentS: 65,
    accentL: 50,
  },
  muted: {
    bgL: 96,
    surfaceL: 99,
    surface2L: 93,
    textL: 15,
    mutedTextL: 50,
    primaryS: 35,
    primaryL: 40,
    accentS: 45,
    accentL: 48,
  },
  noir: {
    bgL: 8,
    surfaceL: 12,
    surface2L: 16,
    textL: 92,
    mutedTextL: 60,
    primaryS: 50,
    primaryL: 65,
    accentS: 70,
    accentL: 60,
  },
  bright: {
    bgL: 97,
    surfaceL: 100,
    surface2L: 94,
    textL: 10,
    mutedTextL: 40,
    primaryS: 70,
    primaryL: 48,
    accentS: 80,
    accentL: 52,
  },
};

/**
 * Given theme tokens from Claude, compute CSS custom properties
 * for the room's visual theme. Returns a flat object of CSS var names → values.
 */
export function computeThemeVars(tokens: ThemeTokens): Record<string, string> {
  const p = MOOD_PRESETS[tokens.mood];
  const ph = tokens.primaryHue;
  const ah = tokens.accentHue;

  return {
    "--theme-bg": `hsl(${ph}, 8%, ${p.bgL}%)`,
    "--theme-surface": `hsl(${ph}, 5%, ${p.surfaceL}%)`,
    "--theme-surface2": `hsl(${ph}, 6%, ${p.surface2L}%)`,
    "--theme-text": `hsl(${ph}, 10%, ${p.textL}%)`,
    "--theme-muted-text": `hsl(${ph}, 8%, ${p.mutedTextL}%)`,
    "--theme-primary": `hsl(${ph}, ${p.primaryS}%, ${p.primaryL}%)`,
    "--theme-primary-hover": `hsl(${ph}, ${p.primaryS}%, ${p.primaryL - 5}%)`,
    "--theme-accent": `hsl(${ah}, ${p.accentS}%, ${p.accentL}%)`,
    "--theme-danger": `hsl(0, 65%, 50%)`,
  };
}

/**
 * Apply theme vars as inline CSS custom properties on an element.
 * Use this on the room's root container.
 */
export function themeVarsToStyle(
  tokens: ThemeTokens
): React.CSSProperties {
  const vars = computeThemeVars(tokens);
  const style: Record<string, string> = {};
  for (const [key, value] of Object.entries(vars)) {
    style[key] = value;
  }
  return style as React.CSSProperties;
}
