import { test, expect } from '@playwright/test';

test.describe('Media Library & Video Embed', () => {
  test('protects /admin/media behind authentication', async ({ page }) => {
    await page.goto('/admin/media');
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

