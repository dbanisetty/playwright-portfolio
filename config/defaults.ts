import type { EnvName } from './types';

/** Base URL per environment. `BASE_URL` in the env overrides whichever is picked. */
export const BASE_URLS: Record<EnvName, string> = {
  demo: 'https://opensource-demo.orangehrmlive.com',
  local: 'http://localhost:8080',
};

/** Single source of truth for every timeout. Milliseconds. */
export const TIMEOUTS = {
  test: 60_000,
  expect: 10_000,
  action: 15_000,
  navigation: 30_000,
} as const;

/** Retries default by context; `RETRIES` in the env overrides both. */
export const DEFAULT_RETRIES = {
  ci: 2,
  local: 0,
} as const;
