import { test, expect } from '@fixtures';
import { createRuntimeConfig } from '@config';
import { PageManager } from '@ui/PageManager';
import { buildEmployee, buildEmployeeId, buildLoginDetails } from '@test-kit/factories/employee';

// Generated from ai-docs/PRDs/pim-add-employee.md via the prd-to-tests skill.
// Scenario ids (ai-docs/scenarios.csv) are noted against each test.
// The chromium project reuses the admin session, so no sign-in step here.

test.describe('Add Employee — happy path', { tag: ['@regression', '@critical'] }, () => {
  test('creates an employee with first and last name only', async ({ pages, seed }) => {
    test.setTimeout(90_000); // UI seeding

    const employee = buildEmployee();

    await test.step('create the employee', async () => {
      await seed.employees.create(employee);
    });

    await test.step('lands on Personal Details showing the name', async () => {
      await expect(pages.pimPersonalDetails().heading).toBeVisible();
      await expect(pages.pimPersonalDetails().firstName).toHaveValue(employee.firstName);
      await expect(pages.pimPersonalDetails().lastName).toHaveValue(employee.lastName);
    });
  }); // ADDEMP-01

  test('creates an employee with a custom employee id', async ({ seed }) => {
    test.setTimeout(90_000); // UI seeding

    const employee = buildEmployee();
    const customId = buildEmployeeId();

    const { employeeId } = await seed.employees.create(employee, { employeeId: customId });

    expect(employeeId).toBe(customId);
  }); // ADDEMP-02

  test('creates an employee with login details', async ({ pages, seed }) => {
    test.setTimeout(90_000); // UI seeding

    const employee = buildEmployee();

    await seed.employees.create(employee, { login: buildLoginDetails() });

    await expect(pages.pimPersonalDetails().heading).toBeVisible();
    await expect(pages.pimPersonalDetails().firstName).toHaveValue(employee.firstName);
  }); // ADDEMP-03
});

test.describe('Add Employee — created user', { tag: ['@regression', '@critical'] }, () => {
  test('a newly created user can sign in', async ({ seed, browser, logger }) => {
    test.setTimeout(120_000); // UI seeding + a second login

    const employee = buildEmployee();
    const login = buildLoginDetails();

    await test.step('seed an employee with login details', async () => {
      await seed.employees.create(employee, { login });
    });

    await test.step('the new user signs in from a fresh session', async () => {
      const { baseURL } = createRuntimeConfig();
      // Force a logged-out session — otherwise the project's admin storageState leaks in.
      const freshContext = await browser.newContext({
        baseURL,
        storageState: { cookies: [], origins: [] },
      });
      try {
        const freshPage = await freshContext.newPage();
        const freshPages = new PageManager(freshPage, logger.child('fresh-session'));
        await freshPages.login().open();
        await expect(freshPage).toHaveURL(/\/auth\/login/);
        await freshPages.login().signIn(login.username, login.password);
        await expect(freshPage).toHaveURL(/\/dashboard\//);
      } finally {
        await freshContext.close();
      }
    });
  }); // ADDEMP-04
});

test.describe('Add Employee — validation', { tag: ['@regression'] }, () => {
  test('requires first and last name', async ({ pages, page }) => {
    const form = pages.pimAddEmployee();
    await form.open();
    await form.save();

    await expect(form.fieldErrors.filter({ hasText: 'Required' })).toHaveCount(2);
    await expect(page).toHaveURL(/\/pim\/addEmployee/);
  }); // ADDEMP-05

  test('rejects a duplicate employee id', async ({ pages, page, seed }) => {
    test.setTimeout(120_000); // UI seeding

    const { employeeId } = await seed.employees.create(buildEmployee());

    const form = pages.pimAddEmployee();
    await form.open();
    await form.fillName(buildEmployee());
    await form.setEmployeeId(employeeId);
    await form.save();

    await expect(form.fieldErrors.filter({ hasText: 'already exists' })).toBeVisible();
    await expect(page).toHaveURL(/\/pim\/addEmployee/);
  }); // ADDEMP-06

  test('rejects a weak password', async ({ pages, page }) => {
    const form = pages.pimAddEmployee();
    await form.open();
    await form.fillName(buildEmployee());
    await form.setEmployeeId(buildEmployeeId());
    await form.enableLoginDetails();
    await form.fillLoginDetails({
      username: buildLoginDetails().username,
      password: 'weakpass',
      confirmPassword: 'weakpass',
    });
    await form.save();

    await expect(form.fieldErrors.first()).toBeVisible();
    await expect(page).toHaveURL(/\/pim\/addEmployee/);
  }); // ADDEMP-07

  test('rejects mismatched passwords', async ({ pages, page }) => {
    const login = buildLoginDetails();
    const form = pages.pimAddEmployee();
    await form.open();
    await form.fillName(buildEmployee());
    await form.setEmployeeId(buildEmployeeId());
    await form.enableLoginDetails();
    await form.fillLoginDetails({
      username: login.username,
      password: login.password,
      confirmPassword: `${login.password}X`,
    });
    await form.save();

    await expect(form.fieldErrors.filter({ hasText: 'do not match' })).toBeVisible();
    await expect(page).toHaveURL(/\/pim\/addEmployee/);
  }); // ADDEMP-08

  test('rejects a username shorter than 5 characters', async ({ pages, page }) => {
    const login = buildLoginDetails();
    const form = pages.pimAddEmployee();
    await form.open();
    await form.fillName(buildEmployee());
    await form.setEmployeeId(buildEmployeeId());
    await form.enableLoginDetails();
    await form.fillLoginDetails({
      username: 'abc',
      password: login.password,
      confirmPassword: login.password,
    });
    await form.save();

    await expect(form.fieldErrors.first()).toBeVisible();
    await expect(page).toHaveURL(/\/pim\/addEmployee/);
  }); // ADDEMP-09
});

test.describe('Add Employee — Employee List', { tag: ['@regression'] }, () => {
  test('finds the new employee by name and by id', async ({ pages, seed }) => {
    test.setTimeout(120_000); // UI seeding

    const employee = buildEmployee();
    const { employeeId } = await seed.employees.create(employee);
    const list = pages.pimEmployeeList();

    await test.step('search by name', async () => {
      await list.open();
      await list.searchByName(employee.firstName, employee.lastName);
      await expect(list.rows(employee.lastName).first()).toBeVisible();
    });

    await test.step('search by id', async () => {
      await list.open();
      await list.searchById(employeeId);
      await expect(list.rows(employeeId).first()).toBeVisible();
    });
  }); // ADDEMP-10

  test('cancel creates nothing', async ({ pages, page }) => {
    const form = pages.pimAddEmployee();
    await form.open();
    await form.fillName(buildEmployee());
    await form.cancel();

    await expect(page).toHaveURL(/\/pim\/viewEmployeeList/);
    await expect(form.toast).toHaveCount(0);
  }); // ADDEMP-11
});
