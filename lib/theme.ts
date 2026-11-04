export type ThemePresetName = 'slate' | 'forest' | 'sunset' | 'mono';

export interface OklchColor {
  l: number; // 0..1
  c: number; // 0..0.4
  h: number; // 0..360
}

export interface PresetPalette {
  background: OklchColor;
  foreground: OklchColor;
  primary: OklchColor;
  primaryForeground: OklchColor;
}

export const THEME_PALETTES: Record<
  ThemePresetName,
  { light: PresetPalette; dark: PresetPalette }
> = {
  slate: {
    light: {
      background: { l: 0.99, c: 0.002, h: 250 },
      foreground: { l: 0.16, c: 0.015, h: 250 },
      primary: { l: 0.48, c: 0.16, h: 250 },
      primaryForeground: { l: 0.99, c: 0.002, h: 250 },
    },
    dark: {
      background: { l: 0.14, c: 0.012, h: 250 },
      foreground: { l: 0.95, c: 0.006, h: 250 },
      primary: { l: 0.68, c: 0.15, h: 250 },
      primaryForeground: { l: 0.14, c: 0.012, h: 250 },
    },
  },
  forest: {
    light: {
      background: { l: 0.99, c: 0.004, h: 155 },
      foreground: { l: 0.16, c: 0.02, h: 155 },
      primary: { l: 0.45, c: 0.12, h: 155 },
      primaryForeground: { l: 0.99, c: 0.004, h: 155 },
    },
    dark: {
      background: { l: 0.14, c: 0.015, h: 155 },
      foreground: { l: 0.95, c: 0.008, h: 155 },
      primary: { l: 0.7, c: 0.13, h: 155 },
      primaryForeground: { l: 0.14, c: 0.015, h: 155 },
    },
  },
  sunset: {
    light: {
      background: { l: 0.99, c: 0.005, h: 45 },
      foreground: { l: 0.17, c: 0.02, h: 35 },
      primary: { l: 0.48, c: 0.16, h: 35 },
      primaryForeground: { l: 0.99, c: 0.005, h: 45 },
    },
    dark: {
      background: { l: 0.14, c: 0.015, h: 35 },
      foreground: { l: 0.95, c: 0.008, h: 45 },
      primary: { l: 0.72, c: 0.15, h: 45 },
      primaryForeground: { l: 0.14, c: 0.015, h: 35 },
    },
  },
  mono: {
    light: {
      background: { l: 0.99, c: 0, h: 0 },
      foreground: { l: 0.14, c: 0, h: 0 },
      primary: { l: 0.2, c: 0, h: 0 },
      primaryForeground: { l: 0.99, c: 0, h: 0 },
    },
    dark: {
      background: { l: 0.13, c: 0, h: 0 },
      foreground: { l: 0.96, c: 0, h: 0 },
      primary: { l: 0.9, c: 0, h: 0 },
      primaryForeground: { l: 0.13, c: 0, h: 0 },
    },
  },
};

export function oklchToLinearRgb({ l, c, h }: OklchColor): [number, number, number] {
  const hRad = (h * Math.PI) / 180;
  const a = c * Math.cos(hRad);
  const b = c * Math.sin(hRad);

  const l_ = l + 0.3963377774 * a + 0.2158037573 * b;
  const m_ = l - 0.1055613458 * a - 0.0638541728 * b;
  const s_ = l - 0.0894841775 * a - 1.291485548 * b;

  const lCube = l_ * l_ * l_;
  const mCube = m_ * m_ * m_;
  const sCube = s_ * s_ * s_;

  const r = +4.0767416621 * lCube - 3.3077115913 * mCube + 0.2309699292 * sCube;
  const g = -1.2684380046 * lCube + 2.6097574011 * mCube - 0.3413193965 * sCube;
  const bl = -0.0041960863 * lCube - 0.7034186147 * mCube + 1.707614701 * sCube;

  const clamp = (x: number) => Math.max(0, Math.min(1, x));
  return [clamp(r), clamp(g), clamp(bl)];
}

export function relativeLuminance(color: OklchColor): number {
  const [r, g, b] = oklchToLinearRgb(color);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(c1: OklchColor, c2: OklchColor): number {
  const lum1 = relativeLuminance(c1);
  const lum2 = relativeLuminance(c2);
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  return (brightest + 0.05) / (darkest + 0.05);
}

