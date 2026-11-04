import { test, expect } from '@playwright/test';

test.describe('Role-Based Access Control (Owner vs Editor)', () => {
  test('requires authentication for /admin/users and /admin/settings', async ({ page }) => {
    await page.goto('/admin/users');
    await expect(page).toHaveURL(/\/admin\/login/);

    await page.goto('/admin/settings');
    await expect(page).toHaveURL(/\/admin\/login/);
  });
});

