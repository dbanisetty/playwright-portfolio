---
name: prd-to-tests
description: >
  Turn a PRD in ai-docs/ into tagged Playwright specs for this repo. Use when
  asked to "generate tests from the PRD", "create e2e tests for <feature>",
  "turn <PRD> into specs", "cover the scenarios in scenarios.csv". Produces spec
  files under tests/feature/, plus any page objects / factories / seeders they
  need, following the orangehrm-playwright skill.
argument-hint: 'PRD path (+ optional scenario ids), e.g. "ai-docs/PRDs/pim-add-employee.md ADDEMP-01,ADDEMP-03"'
---

# prd-to-tests

Generates specs from a PRD. Always defers to
[`orangehrm-playwright`](../orangehrm-playwright/SKILL.md) for how code is written
— this skill is the *process*, that skill is the *conventions*.

## Input

- A PRD path under `ai-docs/PRDs/`. If none given, ask which one.
- Optionally a list of scenario ids (`ADDEMP-01,ADDEMP-05`). Default: all rows in
  `ai-docs/scenarios.csv` for that PRD's `feature`.

## Step 1 — Read the PRD and the scenario rows

- Read the PRD in full: requirements (`REQ-*`), validation rules (`VAL-*`),
  acceptance criteria, and the §Data requirements section.
- Read the matching rows in `ai-docs/scenarios.csv`. Each row is one test.
- Produce a short table: scenario id → title → tags → needs_login → needs_seed →
  the REQ/VAL it covers. Confirm it with the user before writing code.

## Step 2 — Ask the data questions (MANDATORY)

From `orangehrm-playwright` Part B Step 2 — ask all three, explicitly, and wait
for answers:

1. Logged-in user needed? (default yes — `chromium` reuses the admin session)
2. A record created first? Which entity?
3. Created through the UI, or relying on demo data already present?

## Step 3 — Inventory what exists

For every page the scenarios touch, check `ui/pages/`. For every entity created,
check `test-kit/factories/` and `data/seed/`. List what's missing.

## Step 4 — Build the missing pieces (in this order)

1. **Factory** — `test-kit/factories/<entity>.ts` (`build<Entity>()`, faker-backed).
2. **Page objects** — `ui/pages/<Name>Page.ts`. If locators are unknown, run
   `npx playwright codegen <url>` and ask the user to click through; keep only
   role/label/placeholder/text locators. Add each to `PageManager`.
3. **Seeder + cleanup** — `data/seed/<entity>.ts` and register it in
   `data/seed/index.ts`; the `seed` fixture drains cleanup in `afterEach`.
4. **Domain flow** — only if two or more scenarios share a multi-page journey.

## Step 5 — Write the spec

- File: `tests/feature/<feature>.spec.ts`.
- One `describe` per theme (happy path / validation / …), each tagged.
- One `test` per scenario row; title = the row's `title`, lower-cased to a sentence.
- Import from `@fixtures`. AAA. `test.step` grouping. Web-first assertions.
- Seeding tests: `test.setTimeout(90_000)` with a `// UI seeding` comment.
- Add a trailing comment mapping each `test` to its scenario id.

## Step 6 — Hand off

Give the run commands and ask the user to run them and report back:

```bash
# core path first
npx playwright test tests/feature/<feature>.spec.ts --project=chromium --grep @critical
# then the full set
npx playwright test tests/feature/<feature>.spec.ts --project=chromium --headed
```

Then suggest running [`review-tests`](../review-tests/SKILL.md) on the result.

## Definition of done

- [ ] Every requested scenario id has exactly one `test`
- [ ] Tags match `scenarios.csv`
- [ ] New pages are in `PageManager`; new seeders in `data/seed/index.ts`
- [ ] `npm run typecheck` and `npm run lint` are clean
- [ ] Run commands handed to the user
