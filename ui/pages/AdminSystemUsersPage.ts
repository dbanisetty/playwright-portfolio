import type { Locator } from '@playwright/test';
import { BasePage } from '@ui/BasePage';
import { OxdForm } from '@ui/components/OxdForm';
import { DataTable } from '@ui/components/DataTable';

/** Admin → User Management → Users: the System Users list and its search filters. */
export class AdminSystemUsersPage extends BasePage {
  readonly path = '/web/index.php/admin/viewSystemUsers';

  private readonly form = new OxdForm(this.page);
  private readonly searchButton: Locator = this.page.getByRole('button', { name: 'Search' });
  private readonly confirmDelete: Locator = this.page.getByRole('button', { name: 'Yes, Delete' });
  // rationale: the results table has no role/label
  private readonly table = new DataTable(this.page.locator('.oxd-table'));

  readonly heading: Locator = this.page.getByRole('heading', { name: 'System Users' });
  // .first(): the same text is also shown in a toast after an empty search
  readonly noRecords: Locator = this.page.getByText('No Records Found', { exact: true }).first();

  private get usernameInput(): Locator {
    return this.form.input('Username');
  }

  /** Every row in the current results. */
  get allRows(): Locator {
    return this.table.rows;
  }

  /** Rows in the current results whose text contains `text`. */
  rows(text: string): Locator {
    return this.table.rowsContaining(text);
  }

  /** Resolves once the app has navigated to the list (e.g. after Save or Cancel on Add User). */
  async waitUntilLoaded(): Promise<void> {
    this.log.info('wait for System Users');
    await this.page.waitForURL(/\/admin\/viewSystemUsers/);
    await this.heading.waitFor();
  }

  async searchByUsername(username: string): Promise<void> {
    this.log.info(`search by username "${username}"`);
    await this.usernameInput.fill(username);
    await this.searchButton.click();
  }

  /** Finds a user by username and deletes it. Used by seed cleanup. */
  async deleteByUsername(username: string): Promise<void> {
    this.log.info(`delete user "${username}"`);
    await this.open();
    await this.searchByUsername(username);
    const row = this.rows(username).first();
    // rationale: row action buttons are icon-only (bootstrap-icons)
    await row.locator('button:has(.bi-trash)').click();
    await this.confirmDelete.click();
    await row.waitFor({ state: 'detached' });
  }
}
