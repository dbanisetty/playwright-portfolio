# Proposal

## Why

The suite covers only PIM (Add Employee) and smoke paths. Admin → User Management
controls who can sign in to OrangeHRM and with which role. It is the access-control
surface of the product and has no E2E coverage. A broken role assignment or a disabled
account that can still sign in is a security-relevant regression the suite would miss.

## What Changes

- Add E2E coverage for **Admin → User Management → Add System User** on the OrangeHRM demo:
  creating a user for an existing employee, the role and status it is created with, the
  user's ability to sign in, finding it in the System Users list, and every form
  validation rule.
- Add the framework pieces the tests need: system-user factory, Add User and System
  Users page objects, a system-user seeder with cleanup, and a feature spec.
- Introduce OpenSpec as the requirements layer: this capability's spec becomes the
  source of truth that `prd-to-tests` reads and `review-tests` checks coverage against.

## Capabilities

### New Capabilities
- `admin-user-management`: Creating OrangeHRM system users (login accounts) for
  employees: role, status, credentials, validation, and listing/search.

### Modified Capabilities
- None. `pim-add-employee` is still documented as a PRD in `ai-docs/` and is not
  migrated in this change.

## Out of scope

- Editing and deleting system users as features under test (delete is used only for
  cleanup).
- Role permissions beyond the visible Admin menu (fine-grained ESS / Admin access rules).
- Bulk actions on the System Users list.
- Migrating the existing PIM Add Employee PRD into `openspec/specs/`.

## Impact

- New: `ui/pages/AdminAddUserPage.ts`, `ui/pages/AdminSystemUsersPage.ts`,
  `test-kit/factories/systemUser.ts`, `data/seed/systemUser.ts`,
  `tests/feature/admin-add-user.spec.ts`.
- Modified: `ui/PageManager.ts`, `data/seed/index.ts`, `domain/factory.ts`.
- Runtime: about 12 new `@regression` tests, 2 also `@critical`. Each seeded user also
  seeds an employee through the UI, so budget about 25 s of setup per seeded test in the
  nightly run.
- Tooling: `@fission-ai/openspec` added as a devDependency; `openspec validate` can run in CI.
