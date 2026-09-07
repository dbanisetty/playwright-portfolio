import type { Locator } from '@playwright/test';
import { BasePage } from '@ui/BasePage';

export class LoginPage extends BasePage {
  readonly path = '/web/index.php/auth/login';

  private readonly usernameField: Locator = this.page.getByPlaceholder('Username');
  private readonly passwordField: Locator = this.page.getByPlaceholder('Password');
  private readonly loginButton: Locator = this.page.getByRole('button', { name: 'Login' });

  /** The "Invalid credentials" banner shown after a bad sign-in. */
  readonly errorAlert: Locator = this.page.locator('.oxd-alert-content-text');

  /** Per-field "Required" messages shown when submitting an empty form. */
  readonly fieldErrors: Locator = this.page.locator('.oxd-input-field-error-message');

  async signIn(username: string, password: string): Promise<void> {
    this.log.info(`sign in as "${username}"`);
    await this.usernameField.fill(username);
    await this.passwordField.fill(password);
    await this.loginButton.click();
  }

  async submitEmpty(): Promise<void> {
    this.log.info('submit empty login form');
    await this.loginButton.click();
  }
}
