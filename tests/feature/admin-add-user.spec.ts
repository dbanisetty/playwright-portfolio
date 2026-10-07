import { test, expect, openFreshSession } from '@fixtures';
import { buildEmployee, buildLoginDetails } from '@test-kit/factories/employee';
import { buildSystemUser } from '@test-kit/factories/systemUser';

// Generated from the OpenSpec spec openspec/specs/admin-user-management/spec.md
// (change archived at openspec/changes/archive/2026-10-07-add-admin-system-user/).
// Scenario ids (ADMUSR-xx) are noted against each test.
// The chromium project reuses the admin session, so no sign-in step here.

test.describe('Add System User — happy path', { tag: ['@regression', '@critical'] }, () => {
  test('creates an enabled ESS user and returns to the list', async ({ pages, page, seed }) => {
    test.setTimeout(120_000); // UI seeding: employee + user

    const employee = buildEmployee();
    const user = buildSystemUser({ role: 'ESS', status: 'Enabled' });
    const form = pages.adminAddUser();

    await test.step('seed the employee', async () => {
      await seed.employees.create(employee);
    });

    await test.step('fill and save the Add User form', async () => {
      seed.systemUsers.willCreate(user); // cleanup registered first
      await form.open();
      await form.selectRole(user.role);
      await form.pickEmployee(employee);
      await form.selectStatus(user.status);
      await form.fillCredentials({
        username: user.username,
        password: user.password,
        confirmPassword: user.password,
      });
      await form.save();
    });

    await test.step('shows the success toast and returns to the list', async () => {
      await expect(form.toast).toContainText('Successfully Saved');
      await expect(page).toHaveURL(/\/admin\/viewSystemUsers/);
      await expect(pages.adminSystemUsers().heading).toBeVisible();
    });
  }); // ADMUSR-01
});

test.describe('Add System User — roles and list', { tag: ['@regression'] }, () => {
  test('creates an enabled Admin user listed with role Admin', async ({ pages, seed }) => {
    test.setTimeout(120_000); // UI seeding: employee + user

    const user = buildSystemUser({ role: 'Admin' });
    await seed.systemUsers.create(user);

    const list = pages.adminSystemUsers();
    await list.searchByUsername(user.username);
    await expect(list.rows(user.username)).toContainText('Admin');
  }); // ADMUSR-02

  test('finds the new user by username with its role, employee and status', async ({
    pages,
    seed,
  }) => {
    test.setTimeout(120_000); // UI seeding: employee + user

    const user = buildSystemUser();
    const { employee } = await seed.systemUsers.create(user);

    const list = pages.adminSystemUsers();
    await list.searchByUsername(user.username);

    await expect(list.allRows).toHaveCount(1);
    const row = list.rows(user.username);
    for (const text of [
      user.username,
      user.role,
      employee.firstName,
      employee.lastName,
      user.status,
    ]) {
      await expect(row).toContainText(text);
    }
  }); // ADMUSR-06
});

test.describe('Add System User — validation', { tag: ['@regression'] }, () => {
  test('requires role, employee, status, username and password', async ({ pages, page }) => {
    const form = pages.adminAddUser();
    await form.open();

    await form.save();

    for (const label of ['User Role', 'Employee Name', 'Status', 'Username', 'Password']) {
      await expect(form.fieldError(label), `"Required" under ${label}`).toHaveText('Required');
    }
    await expect(page).toHaveURL(/\/admin\/saveSystemUser/);
  }); // ADMUSR-07

  test('rejects a username shorter than 5 characters', async ({ pages, page }) => {
    const form = pages.adminAddUser();
    await form.open();

    await form.fillCredentials({ username: 'abc' });

    await expect(form.fieldError('Username')).toHaveText('Should be at least 5 characters');
    await form.save();
    await expect(page).toHaveURL(/\/admin\/saveSystemUser/);
  }); // ADMUSR-08

  test('rejects a password without a number', async ({ pages, page }) => {
    const form = pages.adminAddUser();
    await form.open();

    await form.fillCredentials({ password: 'abcdefgh' });

    await expect(form.fieldError('Password')).toHaveText(
      'Your password must contain minimum 1 number',
    );
    await form.save();
    await expect(page).toHaveURL(/\/admin\/saveSystemUser/);
  }); // ADMUSR-10

  test('rejects mismatched passwords', async ({ pages, page }) => {
    const { password } = buildLoginDetails();
    const form = pages.adminAddUser();
    await form.open();

    await form.fillCredentials({ password, confirmPassword: `${password}X` });

    await expect(form.fieldError('Confirm Password')).toHaveText('Passwords do not match');
    await form.save();
    await expect(page).toHaveURL(/\/admin\/saveSystemUser/);
  }); // ADMUSR-11

  test('rejects a duplicate username', async ({ pages, page, seed }) => {
    test.setTimeout(120_000); // UI seeding: employee + user

    const existing = buildSystemUser();
    await seed.systemUsers.create(existing);

    const form = pages.adminAddUser();
    await form.open();
    await form.fillCredentials({ username: existing.username });

    await expect(form.fieldError('Username')).toHaveText('Already exists');
    await form.save();
    await expect(page).toHaveURL(/\/admin\/saveSystemUser/);
  }); // ADMUSR-09

  test('cancel creates nothing', async ({ pages }) => {
    const { username } = buildLoginDetails();
    const form = pages.adminAddUser();
    const list = pages.adminSystemUsers();

    await test.step('partly fill the form, then cancel', async () => {
      await form.open();
      await form.selectRole('ESS');
      await form.fillCredentials({ username });
      await form.cancel();
    });

    await test.step('back on the list, and the username does not exist', async () => {
      await expect(list.heading).toBeVisible();
      await list.searchByUsername(username);
      await expect(list.noRecords).toBeVisible();
      await expect(list.allRows).toHaveCount(0);
    });
  }); // ADMUSR-12
});

test.describe('Add System User — signing in', { tag: ['@regression', '@critical'] }, () => {
  test('a newly created ESS user can sign in', async ({ seed, browser, logger }) => {
    test.setTimeout(150_000); // UI seeding: employee + user, then a second login

    const user = buildSystemUser({ role: 'ESS', status: 'Enabled' });
    await seed.systemUsers.create(user);

    const session = await openFreshSession(browser, logger);
    try {
      await session.pages.login().open();
      await session.pages.login().signIn(user.username, user.password);

      await expect(session.page).toHaveURL(/\/dashboard\//);
      await expect(session.pages.dashboard().heading).toBeVisible();
    } finally {
      await session.close();
    }
  }); // ADMUSR-03
});

test.describe('Add System User — role and status', { tag: ['@regression'] }, () => {
  test('an ESS user has no Admin menu', async ({ seed, browser, logger }) => {
    test.setTimeout(150_000); // UI seeding: employee + user, then a second login

    const user = buildSystemUser({ role: 'ESS' });
    await seed.systemUsers.create(user);

    const session = await openFreshSession(browser, logger);
    try {
      await session.pages.login().open();
      await session.pages.login().signIn(user.username, user.password);

      const dashboard = session.pages.dashboard();
      await expect(dashboard.heading).toBeVisible();
      await expect(dashboard.menuLink('My Info')).toBeVisible(); // the ESS menu has rendered
      await expect(dashboard.menuLink('Admin')).toHaveCount(0);
    } finally {
      await session.close();
    }
  }); // ADMUSR-04

  test('a disabled user is refused at sign-in', async ({ seed, browser, logger }) => {
    test.setTimeout(150_000); // UI seeding: employee + user, then a second login

    const user = buildSystemUser({ status: 'Disabled' });
    await seed.systemUsers.create(user);

    const session = await openFreshSession(browser, logger);
    try {
      await session.pages.login().open();
      await session.pages.login().signIn(user.username, user.password);

      await expect(session.pages.login().errorAlert).toHaveText('Account disabled');
      await expect(session.page).toHaveURL(/\/auth\/login/);
    } finally {
      await session.close();
    }
  }); // ADMUSR-05
});
