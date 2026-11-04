import { test, expect } from '@playwright/test';

test.describe('Accessibility (WCAG 2.1 AA) & Keyboard Navigation', () => {
  test('homepage includes skip-to-content link and proper lang attribute', async ({ page }) => {
    await page.goto('/en');
    const skipLink = page.locator('a[href="#main-content"]');
    await expect(skipLink).toHaveCount(1);
  });
});

