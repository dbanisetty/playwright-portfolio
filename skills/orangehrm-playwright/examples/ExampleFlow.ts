// TEMPLATE — copy to domain/<Feature>Flow.ts and adapt. Flows never call expect().
import type { Page } from '@playwright/test';
import type { Logger } from '@test-kit/logger';
import { PageManager } from '@ui/PageManager';

export class ExampleFlow {
  private readonly pages: PageManager;

  constructor(
    page: Page,
    private readonly log: Logger,
  ) {
    this.pages = new PageManager(page, log.child('ExampleFlow'));
  }

  /** Performs the journey and returns whatever the spec needs to assert on. */
  async run(name: string): Promise<{ createdName: string }> {
    this.log.info(`run "${name}"`);
    await this.pages.dashboard().open();
    // ...compose page-object actions across pages here...
    this.log.info('run -> done');
    return { createdName: name };
  }
}
