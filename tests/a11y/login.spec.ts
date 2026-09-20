import { test, expect } from '@fixtures';

// Unauthenticated page, so it needs a clean session rather than the shared
// admin storage state — same reasoning as tests/smoke/login.spec.ts.
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Accessibility — Login', { tag: '@a11y' }, () => {
  test('has no serious or critical violations', async ({ pages, a11y }) => {
    await pages.login().open();

    const { failing } = await a11y.check('login');

    expect(failing).toEqual([]);
  });
});
