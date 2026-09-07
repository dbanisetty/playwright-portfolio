export type EnvName = 'demo' | 'local';

/**
 * The resolved configuration the whole framework runs against.
 * Built once by createRuntimeConfig() and treated as immutable thereafter.
 */
export interface RuntimeConfig {
  env: EnvName;
  baseURL: string;
  headless: boolean;
  isCI: boolean;
  /** undefined => let Playwright decide based on CPU count */
  workers: number | undefined;
  retries: number;
  timeouts: {
    test: number;
    expect: number;
    action: number;
    navigation: number;
  };
}
