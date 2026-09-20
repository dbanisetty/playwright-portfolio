import { test, expect } from '@fixtures';

test.describe('Accessibility — Dashboard', { tag: '@a11y' }, () => {
  test('has no serious or critical violations', async ({ pages, a11y }) => {
    await pages.dashboard().open();

    const { failing } = await a11y.check('dashboard');

    expect(failing).toEqual([]);
  });
});
