import { test as base, expect } from '@playwright/test';
import { createLogger, renderLog, type Logger } from '@test-kit/logger';
import { PageManager } from '@ui/PageManager';

interface Fixtures {
  /** Per-test structured logger. Its buffer is attached to the report on failure. */
  logger: Logger;
  /** Lazy page-object registry. */
  pages: PageManager;
}

export const test = base.extend<Fixtures>({
  logger: async ({}, use, testInfo) => {
    const logger = createLogger(testInfo.title);
    await use(logger);
    if (testInfo.status !== testInfo.expectedStatus) {
      await testInfo.attach('test-log', {
        body: renderLog(logger),
        contentType: 'text/plain',
      });
    }
  },

  pages: async ({ page, logger }, use) => {
    await use(new PageManager(page, logger));
  },
});

export { expect };
