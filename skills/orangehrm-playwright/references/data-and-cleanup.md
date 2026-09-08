# Data & cleanup

This SUT has **no public write API** — records are created by driving the UI, so
seeding is slower and every created record must be removed afterwards.

## Factories — `test-kit/factories/`

Pure functions returning a plain object. Faker-backed, all fields overridable.

```ts
import { faker } from '@faker-js/faker';

export interface Employee {
  firstName: string;
  middleName: string;
  lastName: string;
}

export function buildEmployee(overrides: Partial<Employee> = {}): Employee {
  return {
    firstName: faker.person.firstName(),
    middleName: faker.person.middleName(),
    lastName: faker.person.lastName(),
    ...overrides,
  };
}
```

## Seeders — `data/seed/`

A seeder drives the UI to create a record **and registers its own teardown**. It
does not assert.

```ts
export class EmployeeSeeder {
  constructor(
    private readonly flow: EmployeeOnboardingFlow,
    private readonly cleanup: CleanupRegistry,
    private readonly log: Logger,
  ) {}

  /** Call BEFORE the create action so cleanup runs even if the test fails mid-way. */
  willCreate(employee: Employee): void {
    this.cleanup.add(`employee ${employee.firstName} ${employee.lastName}`, async (pages) => {
      await pages.pimEmployeeList().deleteByName(`${employee.firstName} ${employee.lastName}`);
    });
  }

  async create(employee: Employee): Promise<string> {
    return this.flow.createEmployee(employee);
  }
}
```

## Cleanup registry — `data/cleanup.ts`

Collects teardown callbacks; the `seed` fixture drains them in `afterEach`, LIFO,
each guarded so one failure doesn't block the rest.

```ts
export type CleanupTask = { label: string; run: (pages: PageManager) => Promise<void> };

export class CleanupRegistry {
  private readonly tasks: CleanupTask[] = [];
  add(label: string, run: CleanupTask['run']): void {
    this.tasks.push({ label, run });
  }
  async drain(pages: PageManager, log: Logger): Promise<void> {
    for (const task of [...this.tasks].reverse()) {
      try {
        await task.run(pages);
      } catch (err) {
        log.warn(`cleanup failed: ${task.label} — ${(err as Error).message}`);
      }
    }
    this.tasks.length = 0;
  }
}
```

## The rule

> Register the cleanup **before** the action that creates the record. Set the
> identifier (name / id) first, then create. If creation half-succeeds, teardown
> still knows what to look for.
