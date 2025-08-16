import { expect, test } from '@playwright/test';

test('homepage has link to recipes', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('link', { name: 'Browse Recipes' })).toBeVisible();
});
