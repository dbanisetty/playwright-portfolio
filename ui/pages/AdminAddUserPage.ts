import type { Locator } from '@playwright/test';
import { BasePage } from '@ui/BasePage';
import { OxdForm } from '@ui/components/OxdForm';
import type { Employee } from '@test-kit/factories/employee';
import type { UserRole, UserStatus } from '@test-kit/factories/systemUser';

/** Admin → User Management → Users → Add. Creates a login account for an existing employee. */
export class AdminAddUserPage extends BasePage {
  readonly path = '/web/index.php/admin/saveSystemUser';

  private readonly form = new OxdForm(this.page);

  private readonly employeeNameInput: Locator = this.page.getByPlaceholder('Type for hints...');
  private readonly saveButton: Locator = this.page.getByRole('button', { name: 'Save' });
  private readonly cancelButton: Locator = this.page.getByRole('button', { name: 'Cancel' });

  readonly heading: Locator = this.page.getByRole('heading', { name: 'Add User' });
  // rationale: the toast container exposes no role/label
  readonly toast: Locator = this.page.locator('.oxd-toast');

  private get usernameInput(): Locator {
    return this.form.input('Username');
  }
  private get passwordInput(): Locator {
    return this.form.input('Password', 'Confirm');
  }
  private get confirmPasswordInput(): Locator {
    return this.form.input('Confirm Password');
  }

  /**
   * The validation message under the field labelled `label`. "Password" excludes
   * the Confirm Password field, whose label also contains it.
   */
  fieldError(label: string): Locator {
    return label === 'Password' ? this.form.error(label, 'Confirm') : this.form.error(label);
  }

  /** All visible field-error messages. */
  // rationale: OrangeHRM error messages carry no role/label
  readonly fieldErrors: Locator = this.page.locator('.oxd-input-field-error-message');

  async selectRole(role: UserRole): Promise<void> {
    this.log.info(`select role ${role}`);
    await this.selectOption('User Role', role);
  }

  async selectStatus(status: UserStatus): Promise<void> {
    this.log.info(`select status ${status}`);
    await this.selectOption('Status', status);
  }

  /**
   * Employee Name is an autocomplete that rejects free text: type the first name,
   * then pick the suggestion that also carries the last name.
   */
  async pickEmployee(employee: Pick<Employee, 'firstName' | 'lastName'>): Promise<void> {
    this.log.info(`pick employee ${employee.firstName} ${employee.lastName}`);
    await this.employeeNameInput.fill(employee.firstName);
    await this.page
      .getByRole('option')
      .filter({ hasText: employee.firstName })
      .filter({ hasText: employee.lastName })
      .first()
      .click();
  }

  async fillCredentials(creds: {
    username?: string;
    password?: string;
    confirmPassword?: string;
  }): Promise<void> {
    this.log.info('fill credentials');
    if (creds.username !== undefined) await this.usernameInput.fill(creds.username);
    if (creds.password !== undefined) await this.passwordInput.fill(creds.password);
    if (creds.confirmPassword !== undefined)
      await this.confirmPasswordInput.fill(creds.confirmPassword);
  }

  async save(): Promise<void> {
    this.log.info('save');
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    this.log.info('cancel');
    await this.cancelButton.click();
  }

  private async selectOption(label: string, option: string): Promise<void> {
    // rationale: oxd-select is a div-based dropdown with no role until it opens
    await this.form.group(label).locator('.oxd-select-text').click();
    await this.page.getByRole('option', { name: option, exact: true }).click();
  }
}
