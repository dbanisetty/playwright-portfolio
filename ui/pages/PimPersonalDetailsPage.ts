import { expect, type Locator } from '@playwright/test';
import { BasePage } from '@ui/BasePage';
import { OxdForm } from '@ui/components/OxdForm';

/** Where the app lands after an employee is created. */
export class PimPersonalDetailsPage extends BasePage {
  readonly path = '/web/index.php/pim/viewPersonalDetails';

  private readonly form = new OxdForm(this.page);

  readonly heading: Locator = this.page.getByRole('heading', { name: 'Personal Details' });
  readonly firstName: Locator = this.page.getByPlaceholder('First Name');
  readonly lastName: Locator = this.page.getByPlaceholder('Last Name');

  /**
   * Resolves once the app has navigated here after a successful save AND the
   * employee record has finished loading into the form.
   */
  async waitUntilLoaded(): Promise<void> {
    this.log.info('wait for Personal Details');
    await this.page.waitForURL(/\/pim\/viewPersonalDetails\//);
    // readiness: the record loads async — wait for a populated field
    await expect(this.form.input('Employee Id')).toHaveValue(/\S/);
  }

  async readEmployeeId(): Promise<string> {
    this.log.info('read employee id');
    const value = await this.form.input('Employee Id').inputValue();
    this.log.info(`employee id -> ${value}`);
    return value;
  }
}
