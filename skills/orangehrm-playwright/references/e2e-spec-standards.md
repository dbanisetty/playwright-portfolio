# Spec standards

## File & naming

| Kind | Path | Tag |
|------|------|-----|
| Fast check, no seeding | `tests/smoke/<area>.spec.ts` | `@smoke` |
| Feature coverage from a PRD | `tests/feature/<feature>.spec.ts` | `@regression` |
| API-layer check | `tests/api/<area>.spec.ts` | `@regression` |

- `describe` title: `<Feature> — <area>`. Test title: a plain sentence stating the
  observable outcome — `'rejects a duplicate employee id'`, not `'test 2'`.

## Tags

Set on the `describe` block via the options object:

```ts
test.describe('Add Employee — validation', { tag: ['@regression', '@critical'] }, () => { … });
```

| Tag | Meaning |
|-----|---------|
| `@smoke` | Fast, no data seeding, safe to run on every PR |
| `@regression` | Full feature coverage; the nightly run |
| `@critical` | Revenue/again-core path — a subset of `@regression` |

`auth.setup.ts` carries `@smoke @regression` so it is never filtered out.

## Structure

```ts
import { test, expect } from '@fixtures';

test.describe('Add Employee — happy path', { tag: ['@regression', '@critical'] }, () => {
  test('creates an employee and shows it on the personal details page', async ({ pages, seed }) => {
    const employee = buildEmployee();

    await test.step('open Add Employee', async () => {
      await pages.pimAddEmployee().open();
    });

    await test.step('submit the form', async () => {
      await seed.employees.willCreate(employee);          // cleanup registered first
      await pages.pimAddEmployee().addEmployee(employee);
    });

    await test.step('lands on personal details', async () => {
      await expect(pages.pimPersonalDetails().fullName).toHaveText(
        `${employee.firstName} ${employee.lastName}`,
      );
    });
  });
});
```

## Rules

1. Import `test` / `expect` from `@fixtures` only.
2. **Arrange → Act → Assert** per test. One observable outcome per test where practical.
3. Web-first assertions only. No `waitForTimeout`. No `expect(await locator.isVisible())`.
4. Group phases with `test.step` — the step names become the report outline.
5. Register cleanup **before** the action that creates the record.
6. No conditionals around assertions — a test asserts one path. Branching → two tests.
7. `test.setTimeout(...)` only when a step is genuinely slow (UI seeding a record);
   note why in a comment.
8. No shared mutable state between tests. Each test seeds and cleans its own data.

## Review checklist

- [ ] Imports from `@fixtures`
- [ ] `describe` tagged
- [ ] Titles state outcomes
- [ ] AAA; `test.step` grouping
- [ ] Web-first assertions; zero `waitForTimeout`
- [ ] Cleanup registered before creation
- [ ] No cross-test state
