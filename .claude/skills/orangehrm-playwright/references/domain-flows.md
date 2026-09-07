# Domain flows

A flow is one business journey that spans more than one page — "onboard an
employee", "submit and approve a leave request". It composes page objects from
`ui/` into a single reusable method.

## When

- **Reused by 2+ specs** → extract a flow.
- **Used once** → the spec calls pages directly; no flow.

## Rules

- Lives in `domain/<Feature>Flow.ts`, one class per journey.
- Constructed with `page` + `log` (like a page object); pulls pages via its own
  `PageManager` or accepts one.
- **Never imports or calls `expect`.** It performs actions and returns data
  (e.g. the new employee's id) for the spec to assert on.
- Public methods log entry/exit.

## Shape

```ts
import type { Page } from '@playwright/test';
import type { Logger } from '@test-kit/logger';
import { PageManager } from '@ui/PageManager';
import type { Employee } from '@test-kit/factories/employee';

export class EmployeeOnboardingFlow {
  private readonly pages: PageManager;

  constructor(page: Page, private readonly log: Logger) {
    this.pages = new PageManager(page, log.child('EmployeeOnboardingFlow'));
  }

  /** Creates the employee via the PIM form. Returns the assigned employee id. */
  async createEmployee(employee: Employee): Promise<string> {
    this.log.info(`createEmployee ${employee.firstName} ${employee.lastName}`);
    await this.pages.pimAddEmployee().open();
    await this.pages.pimAddEmployee().addEmployee(employee);
    const id = await this.pages.pimPersonalDetails().employeeId();
    this.log.info(`createEmployee -> ${id}`);
    return id;
  }
}
```

## Wiring

When the first flow lands, add `domain/factory.ts` with a getter per flow and a
`domain` fixture in `fixtures/index.ts`, mirroring `pages`. Until then, a spec
may construct a flow directly.
