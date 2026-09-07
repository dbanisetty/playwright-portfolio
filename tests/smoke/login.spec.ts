import { test, expect } from '@fixtures';
import { DEMO_ADMIN } from '@test-kit/auth';

// These tests exercise the login form itself, so they start from a clean session
// rather than the shared admin storage state.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Login', { tag: '@smoke' }, () => {
  test('signs in with valid admin credentials', async ({ page, pages }) => {
    await pages.login().open();
    await pages.login().signIn(DEMO_ADMIN.username, DEMO_ADMIN.password);

    await expect(page).toHaveURL(/\/dashboard\/index/);
    await expect(pages.dashboard().userMenu).toBeVisible();
  });

  test('rejects invalid credentials', async ({ pages }) => {
    const login = pages.login();
    await login.open();
    await login.signIn(DEMO_ADMIN.username, 'not-the-password');

    await expect(login.errorAlert).toHaveText('Invalid credentials');
  });

  test('shows required-field errors on an empty submit', async ({ pages }) => {
    const login = pages.login();
    await login.open();
    await login.submitEmpty();

    await expect(login.fieldErrors).toHaveText(['Required', 'Required']);
  });
});
