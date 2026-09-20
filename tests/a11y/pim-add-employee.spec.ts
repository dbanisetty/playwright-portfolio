import { test, expect } from '@fixtures';

test.describe('Accessibility — PIM Add Employee', { tag: '@a11y' }, () => {
  test('empty form has no serious or critical violations', async ({ pages, a11y }) => {
    await pages.pimAddEmployee().open();

    const { failing } = await a11y.check('pim-add-employee');

    expect(failing).toEqual([]);
  });

  test('validation-error state has no serious or critical violations', async ({
    pages,
    a11y,
  }) => {
    const form = pages.pimAddEmployee();
    await form.open();
    await form.save();

    await expect(form.fieldErrors.filter({ hasText: 'Required' })).toHaveCount(2);

    const { failing } = await a11y.check('pim-add-employee-validation');

    expect(failing).toEqual([]);
  });
});
