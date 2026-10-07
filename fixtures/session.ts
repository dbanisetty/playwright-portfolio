import type { Browser, Page } from '@playwright/test';
import { createRuntimeConfig } from '@config';
import { PageManager } from '@ui/PageManager';
import type { Logger } from '@test-kit/logger';

export interface FreshSession {
  page: Page;
  pages: PageManager;
  /** Closes the session's browser context. Call it in a `finally`. */
  close(): Promise<void>;
}

/**
 * Opens a logged-out browser context, for signing in as a user the test created.
 * The empty storageState stops the project's admin session from leaking in.
 */
export async function openFreshSession(browser: Browser, logger: Logger): Promise<FreshSession> {
  const { baseURL } = createRuntimeConfig();
  const context = await browser.newContext({
    baseURL,
    storageState: { cookies: [], origins: [] },
  });
  const page = await context.newPage();
  return {
    page,
    pages: new PageManager(page, logger.child('fresh-session')),
    close: () => context.close(),
  };
}
