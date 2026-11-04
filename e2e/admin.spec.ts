import { test, expect } from '@playwright/test';

test.describe('Admin Panel Authentication & CRUD Flow', () => {
  test('redirects unauthenticated users from /admin to /admin/login and renders login form', async ({
    page,
  }) => {
    await page.goto('/admin');
    await expect(page).toHaveURL(/\/admin\/login/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });
});

