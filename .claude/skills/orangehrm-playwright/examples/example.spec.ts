// TEMPLATE — copy to tests/feature/<feature>.spec.ts and adapt.
import { test, expect } from '@fixtures';
import { buildPerson } from '@test-kit/factories/person';

test.describe('Example feature — happy path', { tag: ['@regression', '@critical'] }, () => {
  test('creates a record and confirms it was saved', async ({ pages }) => {
    const person = buildPerson();

    await test.step('open the form', async () => {
      await pages.dashboard().open(); // replace with the real page getter
    });

    await test.step('submit', async () => {
      // await seed.<entity>.willCreate(person);   // register cleanup BEFORE creating
      // await pages.<page>().save(person.firstName);
    });

    await test.step('confirm', async () => {
      await expect(pages.dashboard().heading).toBeVisible();
    });
  });
});

test.describe('Example feature — validation', { tag: ['@regression'] }, () => {
  test('shows a required-field error on empty submit', async ({ pages }) => {
    await pages.dashboard().open();
    // await pages.<page>().save('');
    // await expect(pages.<page>().fieldErrors.first()).toHaveText('Required');
  });
});
