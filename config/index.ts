import { devices, type Project } from '@playwright/test';
import { readEnv } from './env';
import { BASE_URLS, DEFAULT_RETRIES, TIMEOUTS } from './defaults';
import type { RuntimeConfig } from './types';

export type { RuntimeConfig, EnvName } from './types';

let cached: RuntimeConfig | undefined;

/**
 * Reads and validates the environment, applies defaults, and returns the
 * single RuntimeConfig the framework uses. Cached — safe to call anywhere.
 */
export function createRuntimeConfig(): RuntimeConfig {
  if (cached) return cached;

  const env = readEnv();
  const isCI = Boolean(env.CI);

  cached = {
    env: env.ENV,
    baseURL: env.BASE_URL ?? BASE_URLS[env.ENV],
    headless: env.HEADLESS !== 'false',
    isCI,
    workers: env.WORKERS,
    retries: env.RETRIES ?? (isCI ? DEFAULT_RETRIES.ci : DEFAULT_RETRIES.local),
    timeouts: { ...TIMEOUTS },
  };

  return cached;
}

/** The Playwright `projects` array. One browser for now; the matrix comes later. */
export function getProjects(): Project[] {
  return [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
      },
    },
  ];
}
