---
name: review-tests
description: >
  Audit generated or modified Playwright specs in this repo against the PRD and
  the framework conventions, then produce one structured report. Use when asked
  to "review these tests", "check the generated specs", "audit test coverage",
  "review what prd-to-tests produced".
argument-hint: 'Optional: spec path(s) and/or a PRD path. Defaults to the specs in `git status`.'
---

# review-tests

Reviews specs across five dimensions and returns a single report. For a large
change, run the five dimensions as parallel sub-agents and synthesise; for a
small one, do them inline.

## Input

- Spec file paths, and/or a PRD path. If neither is given, derive specs from
  `git status --short | grep '\.spec\.ts$'`.
- Read every spec in full, plus the PRD and the matching `scenarios.csv` rows,
  before judging anything.

## The five dimensions

### 1. Coverage
- Every scenario id in scope has exactly one `test`; no scenario silently dropped.
- Each `test` actually asserts the acceptance criterion it claims (not just "page loaded").
- Negative/validation rows assert the error **and** that the action did not succeed.

### 2. Tagging
- Every `describe` is tagged. Tags match `scenarios.csv`.
- `@critical` is a subset of `@regression`. `@smoke` tests do no seeding.

### 3. Naming & structure
- `describe` = `<Feature> — <theme>`. `test` title states an observable outcome.
- AAA order. `test.step` groups phases. One concern per test.
- No cross-test shared mutable state.

### 4. Locators & page objects
- Run the locator gate from
  [`orangehrm-playwright/references/playwright-locators.md`](../orangehrm-playwright/references/playwright-locators.md).
- No raw CSS/XPath without a `// rationale:` comment. No `.nth()` without reason.
- Specs don't build locators — they go through page objects.

### 5. Assertions & waits
- Web-first only. Zero `waitForTimeout`. No `expect(await locator.isVisible())`.
- No `waitFor({ state: 'visible' })` — `detached` / `attached` are allowed.
- Cleanup registered before the creating action; seeding tests raise the timeout.

## Report format

```
TEST REVIEW — <spec path(s)>
────────────────────────────────────────────
Coverage      PASS | GAPS   <notes>
Tagging       PASS | ISSUES <notes>
Naming        PASS | ISSUES <notes>
Locators      PASS | FAIL   <file:line → problem → fix>
Assertions    PASS | FAIL   <file:line → problem → fix>
────────────────────────────────────────────
Result: PASS | CHANGES REQUIRED
Blocking: <numbered list, most severe first — empty if PASS>
Non-blocking: <numbered list>
```

Result is **CHANGES REQUIRED** if any dimension is FAIL or Coverage has GAPS.
Do not edit files — report only. The caller decides what to fix.
