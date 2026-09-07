import type { Locator } from '@playwright/test';
import { BasePage } from '@ui/BasePage';
import { OxdForm } from '@ui/components/OxdForm';
import { DataTable } from '@ui/components/DataTable';

export class PimEmployeeListPage extends BasePage {
  readonly path = '/web/index.php/pim/viewEmployeeList';

  private readonly form = new OxdForm(this.page);
  private readonly searchButton: Locator = this.page.getByRole('button', { name: 'Search' });
  private readonly resetButton: Locator = this.page.getByRole('button', { name: 'Reset' });
  private readonly confirmDelete: Locator = this.page.getByRole('button', { name: 'Yes, Delete' });
  // rationale: the results table has no role/label
  private readonly table = new DataTable(this.page.locator('.oxd-table'));

  readonly noRecords: Locator = this.page.getByText('No Records Found');

  private get nameInput(): Locator {
    return this.form.input('Employee Name');
  }
  private get idInput(): Locator {
    return this.form.input('Employee Id');
  }

  /** Rows in the current results whose text contains `text` (a name fragment or an id). */
  rows(text: string): Locator {
    return this.table.rowsContaining(text);
  }

  /**
   * OrangeHRM's name filter is an autocomplete that rejects free text — a
   * suggestion must be selected. Type the first name, then pick the option
   * that also carries the last name (handles middle names).
   */
  async searchByName(firstName: string, lastName: string): Promise<void> {
    this.log.info(`search by name "${firstName} ${lastName}"`);
    await this.nameInput.fill(firstName);
    await this.page.getByRole('option').filter({ hasText: lastName }).first().click();
    await this.searchButton.click();
  }

  async searchById(id: string): Promise<void> {
    this.log.info(`search by id "${id}"`);
    await this.idInput.fill(id);
    await this.searchButton.click();
  }

  async reset(): Promise<void> {
    this.log.info('reset filters');
    await this.resetButton.click();
  }

  /** Finds an employee by name and deletes it. Used by seed cleanup. */
  async deleteByEmployee(firstName: string, lastName: string): Promise<void> {
    this.log.info(`delete "${firstName} ${lastName}"`);
    await this.open();
    await this.searchByName(firstName, lastName);
    const row = this.rows(lastName).first();
    // rationale: row action buttons are icon-only (bootstrap-icons)
    await row.locator('button:has(.bi-trash)').click();
    await this.confirmDelete.click();
    await row.waitFor({ state: 'detached' });
  }
}
