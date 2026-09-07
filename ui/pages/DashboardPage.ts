import type { Locator } from '@playwright/test';
import { BasePage } from '@ui/BasePage';

export class DashboardPage extends BasePage {
  readonly path = '/web/index.php/dashboard/index';

  /** Breadcrumb heading — present on every authenticated page; "Dashboard" here. */
  readonly heading: Locator = this.page.getByRole('heading', { name: 'Dashboard', exact: true });

  /** Top-right user menu — only rendered when a session is active. */
  readonly userMenu: Locator = this.page.locator('.oxd-userdropdown-tab');

  /** Left navigation sidebar. */
  readonly sidebar: Locator = this.page.locator('.oxd-sidepanel');
}
