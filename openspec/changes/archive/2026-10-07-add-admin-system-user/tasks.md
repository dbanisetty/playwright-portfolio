# Tasks

## 1. Tooling and data builders

- [x] 1.1 Add `buildSystemUser()` (role, status, username, password; defaults ESS + Enabled; reuses `buildLoginDetails()`) in `test-kit/factories/systemUser.ts` and verify with `npm run typecheck`
- [x] 1.2 Add `openFreshSession(browser, logger)` in `fixtures/session.ts`, re-exported from `@fixtures` (empty storageState, returns `{ page, pages, close }`) and verify with `npm run typecheck`
- [x] 1.3 Add an `openspec validate --strict` step to the CI lint job in `.github/workflows/ci.yml` and verify `npx openspec validate --all --strict` passes locally

## 2. Page objects and form-only scenarios

- [x] 2.1 Add `ui/pages/AdminAddUserPage.ts` (selectRole, pickEmployee, selectStatus, fillCredentials, save, cancel, `fieldError(label)`, `toast`) and register it in `PageManager`; verify with `npm run typecheck` and `npm run lint` (no CSS without a `// rationale:` comment)
- [x] 2.2 Add `ui/pages/AdminSystemUsersPage.ts` (searchByUsername, rows, noRecords, deleteByUsername) and register it in `PageManager`; verify with `npm run typecheck`
- [x] 2.3 Write ADMUSR-07, 08, 10, 11 and 12 in `tests/feature/admin-add-user.spec.ts` (validation `describe`, `@regression`) and verify they pass: `npx playwright test tests/feature/admin-add-user.spec.ts --project=chromium --grep "ADMUSR|required|characters|number|match|Cancel"`

## 3. Flow and seeder

- [x] 3.1 Add `domain/AdminUserFlow.ts` (`addUser`, never asserts) and register it in `FlowFactory`; verify with `npm run typecheck`
- [x] 3.2 Add `data/seed/systemUser.ts`: it seeds the employee, registers user cleanup *before* save, then calls `AdminUserFlow.addUser`. Register it in `data/seed/index.ts` as `systemUsers` and verify with `npm run typecheck`
- [x] 3.3 Write ADMUSR-01, 02 and 06 (create + list `describe`s; 01 tagged `@critical`) and verify they pass, and that the run log shows both the user and the employee cleanup running

## 4. Sign-in and duplicate scenarios

- [x] 4.1 Write ADMUSR-03, 04 and 05 using `openFreshSession` (03 tagged `@critical`) and verify they pass. If the live "Account disabled" text or post-save redirect differs from the spec, update the spec first (`/opsx:update`), then the test
- [x] 4.2 Write ADMUSR-09 (duplicate username, seeded user) and verify it passes

## 5. Integration checks

- [x] 5.1 Run the full spec file 3 times (`--repeat-each=3`) and verify no flaky failures
- [x] 5.2 Run the `review-tests` skill against the spec, with the OpenSpec spec as the coverage source, and verify the result is PASS (all 12 scenarios covered, tags match)
- [x] 5.3 Verify `npm run typecheck`, `npm run lint` and `npx openspec validate add-admin-system-user --strict` are all clean

## Workflow follow-up

- Archive the change (`/opsx:archive`) so `openspec/specs/admin-user-management/spec.md` becomes the living spec.
- Ship with the `finalize-task` skill (commit, push, PR).
- Follow-up change: refactor ADDEMP-04 onto `openFreshSession`, and migrate the PIM Add Employee PRD into `openspec/specs/pim-add-employee/`.
