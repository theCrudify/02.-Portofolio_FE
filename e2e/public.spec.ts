import { test, expect } from '@playwright/test';

test.describe('Public Portfolio Pages (EN & ID)', () => {
  test('renders English homepage, switches locale to Indonesian, and navigates to Projects', async ({
    page,
  }) => {
    await page.goto('/en');
    await expect(page.locator('#main-content')).toBeVisible();

    await page.goto('/id');
    await expect(page.locator('#main-content')).toBeVisible();

    await page.goto('/en/projects');
    await expect(page.locator('h1')).toBeVisible();
  });
});
