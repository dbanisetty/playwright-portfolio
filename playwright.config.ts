import { defineConfig } from '@playwright/test';
import { createRuntimeConfig, getProjects } from './config';

/**
 * Root config. It owns nothing itself — it reads the RuntimeConfig built by
 * the config/ factory and maps it onto Playwright's shape. One place loads
 * config; every test and fixture sees the same values.
 */
const cfg = createRuntimeConfig();

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: true,
  forbidOnly: cfg.isCI,
  retries: cfg.retries,
  workers: cfg.workers,
  timeout: cfg.timeouts.test,
  expect: { timeout: cfg.timeouts.expect },

  reporter: cfg.isCI
    ? [['github'], ['list'], ['html', { open: 'never' }]]
    : [['list'], ['html', { open: 'on-failure' }]],

  use: {
    baseURL: cfg.baseURL,
    headless: cfg.headless,
    actionTimeout: cfg.timeouts.action,
    navigationTimeout: cfg.timeouts.navigation,
    trace: 'on-first-retry',
    video: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: getProjects(),
});
