import { test as base, expect } from '@playwright/test';
import { createLogger, renderLog, type Logger } from '@test-kit/logger';
import { PageManager } from '@ui/PageManager';
import { FlowFactory } from '@domain/factory';
import { CleanupRegistry } from '@data/cleanup';
import { buildSeeders, type Seeders } from '@data/seed';
import { scanPage, describeViolation, type A11yScanResult } from '@test-kit/a11y';
import { baselineRulesFor } from '@test-kit/a11y-baseline';

interface Fixtures {
  /** Per-test structured logger. Its buffer is attached to the report on failure. */
  logger: Logger;
  /** Lazy page-object registry. */
  pages: PageManager;
  /** Business-flow registry (multi-page journeys). */
  domain: FlowFactory;
  /** Data seeders. Anything they create is deleted in afterEach. */
  seed: Seeders;
  /** Accessibility scanning against the current page. */
  a11y: A11y;
}

export interface A11y {
  /**
   * Scans the current page, applying the baseline exclusions for `pageKey`.
   * Always attaches the full axe JSON to the report. Returns the result —
   * the spec decides whether/how to assert on `.failing`.
   */
  check(pageKey: string): Promise<A11yScanResult>;
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

  a11y: async ({ page, logger }, use, testInfo) => {
    const log = logger.child('a11y');
    await use({
      async check(pageKey: string) {
        log.info(`scan: ${pageKey}`);
        const result = await scanPage(page, { disableRules: baselineRulesFor(pageKey) });
        await testInfo.attach(`a11y-${pageKey}`, {
          body: JSON.stringify(result.raw, null, 2),
          contentType: 'application/json',
        });
        for (const v of result.failing) log.error(describeViolation(v));
        for (const v of result.reportOnly) log.warn(describeViolation(v));
        return result;
      },
    });
  },
});

export { expect };
