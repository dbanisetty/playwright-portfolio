import { test, expect } from '@fixtures';

// Uses the shared admin storage state from auth.setup.ts (the chromium project
// default), so no sign-in step is needed here.
test.describe('Dashboard', { tag: '@smoke' }, () => {
  test('loads for an authenticated admin', async ({ page, pages }) => {
    const dashboard = pages.dashboard();
    await dashboard.open();

    await expect(page).toHaveURL(/\/dashboard\/index/);
    await expect(dashboard.heading).toBeVisible();
    await expect(dashboard.sidebar).toBeVisible();
    await expect(dashboard.userMenu).toBeVisible();
  });
});
