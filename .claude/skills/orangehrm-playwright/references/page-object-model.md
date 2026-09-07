# Page Object Model

## Principles

1. Model **user behaviour**, not the DOM.
2. **Assertions live in specs.** A page may expose a `readonly` locator for the
   spec to assert on; it does not assert itself.
3. Locators are class fields, initialised inline, scoped to a container where possible.
4. Public methods are named after intent: `signIn(...)`, `addEmployee(...)` —
   never `clickButton2()`.
5. Every public method logs entry (with params) and exit — `this.log` comes from `BasePage`.
6. Prefer composition: a page *has* components.

## BasePage

Every navigable page extends it. `BasePage` provides `page`, `log`, and `open()`,
and requires a `path` (relative to `baseURL`).

```ts
import type { Locator } from '@playwright/test';
import { BasePage } from '@ui/BasePage';

export class PimAddEmployeePage extends BasePage {
  readonly path = '/web/index.php/pim/addEmployee';

  private readonly firstName: Locator = this.page.getByPlaceholder('First Name');
  private readonly lastName: Locator = this.page.getByPlaceholder('Last Name');
  private readonly saveButton: Locator = this.page.getByRole('button', { name: 'Save' });

  readonly firstNameError: Locator = this.page
    .locator('.oxd-input-field-error-message')
    .first();

  async addEmployee(input: { firstName: string; lastName: string }): Promise<void> {
    this.log.info(`addEmployee ${input.firstName} ${input.lastName}`);
    await this.firstName.fill(input.firstName);
    await this.lastName.fill(input.lastName);
    await this.saveButton.click();
  }
}
```

Field initialisers may reference `this.page` — `super()` has already run by the
time they execute.

## PageManager

Lazy registry. One getter per page, built on first use, cached per test. A spec
reaches pages through the `pages` fixture — never `new SomePage(...)` inline.

```ts
addEmployee(): PimAddEmployeePage {
  return this.lazy('addEmployee', () =>
    new PimAddEmployeePage(this.page, this.log.child('PimAddEmployeePage')),
  );
}
```

Adding a page: create the class, add the getter, done. Navigation happens in the
spec or flow (`await pages.addEmployee().open()`), never in the manager.

## Components

Reusable regions (data table, top nav, toast). Constructed with a root locator so
child locators can't match elsewhere on the page.

```ts
export class DataTable {
  constructor(private readonly root: Locator) {}
  row(text: string): Locator {
    return this.root.getByRole('row').filter({ hasText: text });
  }
}
```

## Checklist

- [ ] One class per file, extends `BasePage` (pages) or takes a root `Locator` (components)
- [ ] Locators are fields, not built in methods; scoped where possible
- [ ] `private readonly` for interaction-only; public `readonly` for spec assertions
- [ ] No `expect` anywhere in the class
- [ ] Methods named for intent; each logs entry + exit
- [ ] No `waitForTimeout`; no `waitFor({ state: 'visible' })`
- [ ] Page wired into `PageManager`
