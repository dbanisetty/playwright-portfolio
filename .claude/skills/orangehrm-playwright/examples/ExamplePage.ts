// TEMPLATE — copy to ui/pages/<Name>Page.ts and adapt. Do not import this file.
import type { Locator } from '@playwright/test';
import { BasePage } from '@ui/BasePage';

export class ExamplePage extends BasePage {
  readonly path = '/web/index.php/example/path';

  // Interaction-only locators: private.
  private readonly nameField: Locator = this.page.getByPlaceholder('Name');
  private readonly saveButton: Locator = this.page.getByRole('button', { name: 'Save' });

  // Locators a spec asserts on: public readonly.
  // rationale: OrangeHRM renders no role/label/testid on the toast container
  readonly successToast: Locator = this.page.locator('.oxd-toast');
  readonly fieldErrors: Locator = this.page.locator('.oxd-input-field-error-message');

  async save(name: string): Promise<void> {
    this.log.info(`save "${name}"`);
    await this.nameField.fill(name);
    await this.saveButton.click();
  }
}
