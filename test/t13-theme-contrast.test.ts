import { describe, it, expect } from 'vitest';
import { THEME_PALETTES, contrastRatio, type ThemePresetName } from '@/lib/theme';

describe('T13 · Theme Presets WCAG AA Contrast Verification', () => {
  const presets: ThemePresetName[] = ['slate', 'forest', 'sunset', 'mono'];

  for (const preset of presets) {
    it(`preset "${preset}" meets WCAG AA (>= 4.5:1) for foreground/background and primaryForeground/primary in both light and dark modes`, () => {
      const { light, dark } = THEME_PALETTES[preset];

      const lightBodyContrast = contrastRatio(light.foreground, light.background);
      const lightPrimaryContrast = contrastRatio(light.primaryForeground, light.primary);
      expect(lightBodyContrast).toBeGreaterThanOrEqual(4.5);
      expect(lightPrimaryContrast).toBeGreaterThanOrEqual(4.5);

      const darkBodyContrast = contrastRatio(dark.foreground, dark.background);
      const darkPrimaryContrast = contrastRatio(dark.primaryForeground, dark.primary);
      expect(darkBodyContrast).toBeGreaterThanOrEqual(4.5);
      expect(darkPrimaryContrast).toBeGreaterThanOrEqual(4.5);
    });
  }
});
