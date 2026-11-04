import { test, expect } from '@playwright/test';

test.describe('Contact Form & Privacy Policy', () => {
  test('renders privacy policy page in English and Indonesian', async ({ page }) => {
    await page.goto('/en/privacy');
    await expect(page.locator('h1')).toBeVisible();

    await page.goto('/id/privacy');
    await expect(page.locator('h1')).toBeVisible();
  });
});

