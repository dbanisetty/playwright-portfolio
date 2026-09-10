---
name: orangehrm-playwright
description: >
  The framework skill for this repo — a layered Playwright + TypeScript E2E suite
  targeting the OrangeHRM open-source demo. Use when writing or reviewing E2E
  tests, page objects, domain flows, fixtures, data seeders, or config in this
  project. Trigger phrases: "write a test", "create e2e tests", "add a spec",
  "create a page object", "add a domain flow", "add a fixture", "seed test data",
  "fix a locator", "review these tests", "switch environment". Do NOT trigger for
  generic Playwright questions unrelated to this framework.
argument-hint: 'e.g. "create e2e tests for Add Employee from ai-docs/PRDs/pim-add-employee.md", "add a page object for the employee list", "add a cleanup for created employees"'
---

# orangehrm-playwright

The conventions for this repo. Read this file first, then open the reference that
matches the task.

| Intent | Go to |
|--------|-------|
| Write a new test / turn a PRD into specs | [Part B — Writing a Test](#part-b--writing-a-test) — all 6 steps, in order |
| Create or refactor a page object | [`references/page-object-model.md`](./references/page-object-model.md) |
| Add a business flow spanning pages | [`references/domain-flows.md`](./references/domain-flows.md) |
| Seed test data / add cleanup | [`references/data-and-cleanup.md`](./references/data-and-cleanup.md) |
| Add or use a fixture | [`references/fixtures.md`](./references/fixtures.md) |
| Choose or fix a locator | [`references/playwright-locators.md`](./references/playwright-locators.md) |
| Spec structure, naming, tags, assertions | [`references/e2e-spec-standards.md`](./references/e2e-spec-standards.md) |
| Switch env, understand config / secrets | [`references/config-and-environments.md`](./references/config-and-environments.md) |

---

## Framework at a glance

**Repo:** `playwright-portfolio`  **SUT:** OrangeHRM open-source demo
**Stack:** Playwright Test, TypeScript (strict, ESM), Node 22, zod, faker.

### Seven layers — each owns one concern; a spec only touches the top

```
1  config/      Runtime config — env, base URLs, defaults, Playwright projects
2  test-kit/    Owned utilities — logger, auth roles/creds, faker factories, (api wrapper)
3  reporting/   Log sink + artifact wiring into the HTML reporter
4  data/        Seeders (UI-driven for this SUT), factories, cleanup registry
5  ui/          Page Object Model — BasePage, pages/, components/, PageManager
6  domain/      Business flows composing ui/; never assert
7  tests/       Specs — smoke/ feature/ api/
```

`fixtures/index.ts` is the extended `test` object. `ai-docs/` holds the PRDs.

### Import rules

- Specs and flows import `test` / `expect` from **`@fixtures`**, never `@playwright/test`.
- Path aliases: `@config`, `@test-kit/*`, `@ui/*`, `@domain/*`, `@data/*`, `@fixtures`.
- Nothing outside `config/` reads `process.env`.

---

## Golden rules — never break these

| # | Rule | Reference |
|---|------|-----------|
| 1 | Locators: role → label → placeholder → testid → text. No raw CSS/XPath without a `// rationale:` comment. | [locators](./references/playwright-locators.md) |
| 2 | No `waitForTimeout`. Web-first assertions only (`expect(locator).toBeVisible()`, never `locator.waitFor({state:'visible'})`). | [spec standards](./references/e2e-spec-standards.md) |
| 3 | Page objects and domain flows never call `expect`. Specs assert. | [POM](./references/page-object-model.md) |
| 4 | Every created record registers its cleanup **before** the creating action. | [data & cleanup](./references/data-and-cleanup.md) |
| 5 | Import `test`/`expect` from `@fixtures`. Base imports silently drop fixtures. | [fixtures](./references/fixtures.md) |
| 6 | Every `describe` block is tagged (`@smoke` / `@regression` / `@critical`). | [spec standards](./references/e2e-spec-standards.md) |

---

## Part A — File map

Where any new file goes:

```
test-kit/
  factories/<entity>.ts        buildEmployee(), buildPerson() — faker builders
  api.ts                       logged APIRequestContext wrapper (when needed)

data/
  seed/<entity>.ts             UI-driven seeder + its cleanup registration
  cleanup.ts                   the CleanupRegistry

ui/
  pages/<Name>Page.ts          one class per navigable page, extends BasePage
  components/<Name>.ts          shared regions (nav, data table, toast)
  PageManager.ts               add a lazy getter for each new page

domain/
  <Feature>Flow.ts             one class per business journey
  factory.ts                   getter per flow (added when the first flow lands)

fixtures/
  index.ts                     extend test here — check what exists first

tests/
  smoke/<area>.spec.ts         @smoke — fast, no seeding
  feature/<feature>.spec.ts    @regression feature coverage (from PRDs)
  api/<area>.spec.ts           API-layer checks
```

---

## Part B — Writing a Test

> Infrastructure is in place. Follow all six steps in order. Do not skip.

### Step 1 — Read the PRD

Find the PRD in `ai-docs/PRDs/` matching the feature. If none exists, **stop and
ask** which PRD to use. From it, list the user journeys and acceptance criteria
that need E2E coverage — happy path plus the edge cases that carry risk.

### Step 2 — Ask the data questions (MANDATORY before any code)

Ask the user, explicitly:

> 1. **Does this test need a logged-in user?** (Almost always yes — the
>    `chromium` project already reuses the admin session. Say no only for tests
>    of the login screen itself.)
> 2. **Does this test need a record created first** (an employee, a leave
>    request, …)? If yes → a `data/seed/` seeder + cleanup is wired.
> 3. **Can the precondition be created through the UI**, or does it rely on data
>    already present in the demo? (This SUT has no public write API — seeding is
>    UI-driven and slower. Confirm which.)

Wire fixtures and seeders from the answers. Do not guess.

### Step 3 — Discover locators (if a page object is missing)

If the page class does not exist in `ui/pages/`, capture real locators against
the running app — never guess `oxd-*` selectors.

```bash
npx playwright codegen https://opensource-demo.orangehrmlive.com/web/index.php/<path>
```

Keep only `getByRole` / `getByLabel` / `getByPlaceholder` / `getByText`. Discard
CSS/XPath. Wrap them in a new `ui/pages/<Name>Page.ts` following
[`page-object-model.md`](./references/page-object-model.md), and add a
`PageManager` getter.

> **Optional — Playwright MCP.** If the [Playwright MCP server](https://github.com/microsoft/playwright-mcp)
> is configured for this repo (`.mcp.json`, git-ignored — copy `.mcp.json.example`),
> use it here instead of codegen: navigate to the page, read the accessibility
> snapshot, and take role-based locators directly. This is an authoring aid only
> — it is never involved when `playwright test` runs.

### Step 4 — Build the spec

1. File: `tests/feature/<feature>.spec.ts` (or `smoke/` for a fast check).
2. Import `test` / `expect` from `@fixtures`.
3. Tag the `describe`: `{ tag: ['@regression'] }` (+ `@critical` / `@smoke` as fits).
4. Structure every test **Arrange → Act → Assert**. Web-first assertions only.
5. Use `test.step(...)` to group phases so the report reads well.
6. Register cleanup for anything created (Step 2 of
   [`data-and-cleanup.md`](./references/data-and-cleanup.md)).

### Step 5 — Extract a domain flow if it repeats

A journey used by more than one spec → `domain/<Feature>Flow.ts`. Used once →
call pages directly in the spec. Flows never call `expect`.

### Step 6 — Give the run command (MANDATORY)

After creating the spec, always hand the user a ready command and ask them to run it:

```bash
npx playwright test tests/feature/<feature>.spec.ts --headed --project=chromium
# smoke subset only:
npx playwright test tests/feature/<feature>.spec.ts --project=chromium --grep @smoke
```

Ask them to report back before the task is considered done.

---

## References

| File | Use when |
|------|----------|
| [`page-object-model.md`](./references/page-object-model.md) | Creating/refactoring pages and components |
| [`playwright-locators.md`](./references/playwright-locators.md) | Choosing or auditing locators |
| [`e2e-spec-standards.md`](./references/e2e-spec-standards.md) | Spec structure, naming, tagging, assertions |
| [`domain-flows.md`](./references/domain-flows.md) | Adding business-level flows |
| [`data-and-cleanup.md`](./references/data-and-cleanup.md) | Seeders, factories, the cleanup registry |
| [`fixtures.md`](./references/fixtures.md) | Using or extending fixtures |
| [`config-and-environments.md`](./references/config-and-environments.md) | Envs, base URLs, storage state, secrets |

Copy-paste templates live in [`examples/`](./examples/).
