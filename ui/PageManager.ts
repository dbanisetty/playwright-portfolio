import type { Page } from '@playwright/test';
import type { Logger } from '@test-kit/logger';
import { LoginPage } from '@ui/pages/LoginPage';
import { DashboardPage } from '@ui/pages/DashboardPage';

/**
 * Lazy registry of page objects. A spec reaches pages through `pages.login()`,
 * `pages.dashboard()`, … — each is built on first use and cached for the test.
 */
export class PageManager {
  private readonly cache = new Map<string, unknown>();

  constructor(
    private readonly page: Page,
    private readonly log: Logger,
  ) {}

  private lazy<T>(key: string, make: () => T): T {
    let instance = this.cache.get(key) as T | undefined;
    if (instance === undefined) {
      instance = make();
      this.cache.set(key, instance);
    }
    return instance;
  }

  login(): LoginPage {
    return this.lazy('login', () => new LoginPage(this.page, this.log.child('LoginPage')));
  }

  dashboard(): DashboardPage {
    return this.lazy('dashboard', () => new DashboardPage(this.page, this.log.child('DashboardPage')));
  }
}
