import { test as base, expect } from '@playwright/test';
import { createLogger, renderLog, type Logger } from '@test-kit/logger';
import { PageManager } from '@ui/PageManager';
import { FlowFactory } from '@domain/factory';
import { CleanupRegistry } from '@data/cleanup';
import { buildSeeders, type Seeders } from '@data/seed';

interface Fixtures {
  /** Per-test structured logger. Its buffer is attached to the report on failure. */
  logger: Logger;
  /** Lazy page-object registry. */
  pages: PageManager;
  /** Business-flow registry (multi-page journeys). */
  domain: FlowFactory;
  /** Data seeders. Anything they create is deleted in afterEach. */
  seed: Seeders;
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

  domain: async ({ pages, logger }, use) => {
    await use(new FlowFactory(pages, logger.child('domain')));
  },

  seed: async ({ pages, domain, logger }, use) => {
    const cleanup = new CleanupRegistry();
    const seeders = buildSeeders(domain, cleanup, logger.child('seed'));
    await use(seeders);
    await cleanup.drain(pages, logger.child('cleanup'));
  },
});

export { expect };
