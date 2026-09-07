import type { Locator } from '@playwright/test';
import { BasePage } from '@ui/BasePage';
import { OxdForm } from '@ui/components/OxdForm';
import type { Employee, LoginDetails } from '@test-kit/factories/employee';

export class PimAddEmployeePage extends BasePage {
  readonly path = '/web/index.php/pim/addEmployee';

  private readonly form = new OxdForm(this.page);

  private readonly firstNameInput: Locator = this.page.getByPlaceholder('First Name');
  private readonly middleNameInput: Locator = this.page.getByPlaceholder('Middle Name');
  private readonly lastNameInput: Locator = this.page.getByPlaceholder('Last Name');
  private readonly saveButton: Locator = this.page.getByRole('button', { name: 'Save' });
  private readonly cancelButton: Locator = this.page.getByRole('button', { name: 'Cancel' });
  // rationale: the "Create Login Details" control is an icon-only switch with no role/label
  private readonly loginToggle: Locator = this.page.locator('.oxd-switch-input');

  /** All visible field-error messages. Public so specs can assert on them. */
  readonly fieldErrors: Locator = this.page.locator('.oxd-input-field-error-message');
  // rationale: the toast container exposes no role/label
  readonly toast: Locator = this.page.locator('.oxd-toast');

  private get employeeIdInput(): Locator {
    return this.form.input('Employee Id');
  }
  private get usernameInput(): Locator {
    return this.form.input('Username');
  }
  private get passwordInput(): Locator {
    return this.form.input('Password', 'Confirm');
  }
  private get confirmPasswordInput(): Locator {
    return this.form.input('Confirm Password');
  }

  async fillName(name: Partial<Employee>): Promise<void> {
    this.log.info(`fill name ${name.firstName ?? ''} ${name.lastName ?? ''}`.trim());
    if (name.firstName !== undefined) await this.firstNameInput.fill(name.firstName);
    if (name.middleName) await this.middleNameInput.fill(name.middleName);
    if (name.lastName !== undefined) await this.lastNameInput.fill(name.lastName);
  }

  async setEmployeeId(id: string): Promise<void> {
    this.log.info(`set employee id ${id}`);
    await this.employeeIdInput.fill(id);
  }

  async enableLoginDetails(): Promise<void> {
    this.log.info('enable login details');
    await this.loginToggle.click();
  }

  async fillLoginDetails(login: {
    username?: string;
    password?: string;
    confirmPassword?: string;
  }): Promise<void> {
    this.log.info('fill login details');
    if (login.username !== undefined) await this.usernameInput.fill(login.username);
    if (login.password !== undefined) await this.passwordInput.fill(login.password);
    if (login.confirmPassword !== undefined)
      await this.confirmPasswordInput.fill(login.confirmPassword);
  }

  async save(): Promise<void> {
    this.log.info('save');
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    this.log.info('cancel');
    await this.cancelButton.click();
  }

  /** Composed happy path: fill the form and save. */
  async addEmployee(employee: Employee, login?: LoginDetails): Promise<void> {
    await this.fillName(employee);
    if (login) {
      await this.enableLoginDetails();
      await this.fillLoginDetails({
        username: login.username,
        password: login.password,
        confirmPassword: login.password,
      });
    }
    await this.save();
  }
}
