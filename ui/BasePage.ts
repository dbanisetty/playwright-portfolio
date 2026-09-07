import type { Page } from '@playwright/test';
import type { Logger } from '@test-kit/logger';

/**
 * Base for every navigable page object.
 *
 * Subclasses declare `path` (relative to baseURL), expose locators as readonly
 * fields, and expose intent-level actions as methods. They do not call `expect`
 * — assertions belong to the spec.
 */
export abstract class BasePage {
  abstract readonly path: string;

  constructor(
    protected readonly page: Page,
    protected readonly log: Logger,
  ) {}

  /** Navigate straight to this page. */
  async open(): Promise<void> {
    this.log.info(`open ${this.constructor.name} (${this.path})`);
    await this.page.goto(this.path);
  }
}
