import { test as setup, expect } from '@fixtures';
import { authStatePath } from '@config';
import { DEMO_ADMIN } from '@test-kit/auth';

/**
 * Runs once before the `chromium` project. Logs in as admin through the UI and
 * saves the session so feature tests start already authenticated.
 *
 * Tagged so it is never filtered out by `--grep @smoke` / `--grep @regression`.
 */
setup('authenticate as admin', { tag: ['@smoke', '@regression'] }, async ({ page, pages, logger }) => {
  await pages.login().open();
  await pages.login().signIn(DEMO_ADMIN.username, DEMO_ADMIN.password);

  await expect(page).toHaveURL(/\/dashboard\/index/);
  await expect(pages.dashboard().heading).toBeVisible();

  await page.context().storageState({ path: authStatePath('admin') });
  logger.info(`saved admin storage state -> ${authStatePath('admin')}`);
});
