# Design

## Context

See proposal.md (Why) and specs/admin-user-management/spec.md (requirements). Relevant
current state:

- The framework already seeds employees through the UI (`seed.employees`) and drains a
  LIFO `CleanupRegistry` after each test.
- The Add User form was inspected on the live demo (OrangeHRM OS 5.9) on 2026-10-07.
  User Role and Status are custom `oxd-select` dropdowns that open a `listbox` with
  `option`s ("Admin", "ESS" / "Enabled", "Disabled"). Employee Name is an autocomplete
  that only accepts a picked suggestion. Username, Password and Confirm Password are plain
  inputs inside `.oxd-input-group` wrappers, so the existing `OxdForm` helper applies.
- Username and password messages are validated asynchronously (they appear about 1 s
  after typing). Web-first assertions absorb this; no explicit waits are needed.
- ADDEMP-04 already signs in from a fresh browser context inline in the spec. Three new
  scenarios (03, 04, 05) need the same thing.

## Goals / Non-Goals

**Goals:**
- Every scenario in the spec maps to exactly one test, titled from the scenario and
  tagged with the scenario's tags. The scenario id goes in a trailing comment.
- No test depends on data it did not create. Every created user and employee is deleted.

**Non-Goals:**
- Refactoring ADDEMP-04 onto the new fresh-session helper. That is a follow-up.
- An API-based seeder. The demo has no public write API.

## Decisions

1. **The OpenSpec spec replaces the PRD and scenarios.csv as input for this feature.**
   `prd-to-tests` reads `openspec/changes/<change>/specs/**/spec.md`: each
   `#### Scenario:` is one test, and its `Tags:` line drives the `describe` tags.
   *Alternative:* write a PRD and CSV as well. Rejected: two sources of truth would drift.

2. **`SystemUserSeeder` composes `EmployeeSeeder`.** A system user needs an employee, so
   `seed.systemUsers.create(user)` first calls `seed.employees.create(...)` and then the
   new `AdminUserFlow.addUser(...)`. The user-deletion cleanup is registered *before*
   the user is saved. Because the registry drains LIFO, the user is deleted before its
   employee. *Alternative:* reuse an existing demo employee. Rejected: shared data that
   other people can change or delete.

3. **New domain flow `AdminUserFlow`** (`addUser`): open form → select role → pick
   employee suggestion → select status → fill credentials → save → wait for the System
   Users list. It never asserts, matching `EmployeeOnboardingFlow`. *Alternative:* call
   page objects directly from the seeder. Rejected: the journey is shared by the seeder
   and by ADMUSR-01/02.

4. **Page objects:** `AdminAddUserPage` (form actions, `fieldError(label)`, `toast`) and
   `AdminSystemUsersPage` (`searchByUsername`, `rows`, `deleteByUsername`, `noRecords`).
   Both are registered in `PageManager`. Dropdowns are driven by clicking the field
   group, then `getByRole('option', { name })`.

5. **Fresh-session helper in `fixtures/session.ts`**, re-exported from `@fixtures`:
   `openFreshSession(browser, logger)` returns `{ page, pages, close }` with an empty
   `storageState`, so the admin session cannot leak in. It lives in `fixtures/`, not
   `test-kit/`, because it builds a `PageManager`, and `test-kit/` (layer 2) must not
   import `ui/` (layer 5). *Alternative:* a new fixture. Rejected for now: only some
   tests need it, and a helper keeps the fixture surface small.

6. **Factory `buildSystemUser()`** in `test-kit/factories/systemUser.ts` reuses
   `buildLoginDetails()` for its username and password, and adds `role` (default ESS)
   and `status` (default Enabled).

## Risks / Trade-offs

- [Verified on apply, 2026-10-07] After save, the form shows a "Successfully Saved"
  toast and redirects to `/admin/viewSystemUsers`.
- [Verified on apply, 2026-10-07] A disabled user sees "Account disabled" at sign-in.
- [Observed on apply] ESS users see neither Admin nor PIM in the menu. ADMUSR-04 uses
  "My Info" to confirm the ESS menu has loaded before checking that Admin is absent.
- [Toast vanishes before the assertion] (observed on apply: the toast was gone by the
  time the flow had waited for the list) → ADMUSR-01 drives the form in the spec and
  asserts the toast straight after save. Cleanup is registered first with
  `seed.systemUsers.willCreate(user)`, the same pattern the spec standards describe.
- [Seeding cost] Seven scenarios seed an employee and a user (about 25 s each) → they
  are `@regression` only (nightly), with `test.setTimeout(120_000)` and a `// UI seeding` comment.
- [Autocomplete picks another person with the same name on the shared demo] → faker
  names are run-unique, and the suggestion is chosen by matching first and last name together.
- [Cleanup failure leaves a user behind] → cleanup is guarded per task; the next run is
  unaffected because usernames are unique per run.

## Migration Plan

Not applicable. The change is additive. Rollback means reverting the commit.
