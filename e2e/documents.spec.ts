import { test, expect } from '@playwright/test';

test.describe('CV Documents, Dynamic PDF & Share Links', () => {
  test('renders print-friendly web CV page and handles unknown share link gracefully', async ({
    page,
  }) => {
    await page.goto('/en/cv');
    await expect(page.locator('#main-content')).toBeVisible();

    await page.goto('/en/s/non-existent-share-token-12345');
    await expect(page.locator('#main-content')).toBeVisible();
  });
});

