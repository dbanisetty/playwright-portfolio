import { config as loadDotenv } from 'dotenv';
import { z } from 'zod';

// Load .env once, as early as possible. Missing file is not an error.
loadDotenv();

/**
 * Every environment variable the framework reads passes through this schema.
 * Anything not listed here is ignored. Parsing happens once, in createRuntimeConfig().
 */
const EnvSchema = z.object({
  ENV: z.enum(['demo', 'local']).default('demo'),
  BASE_URL: z.string().url().optional(),
  HEADLESS: z.enum(['true', 'false']).default('true'),
  WORKERS: z.coerce.number().int().positive().optional(),
  RETRIES: z.coerce.number().int().min(0).optional(),
  CI: z.string().optional(),
});

export type RawEnv = z.infer<typeof EnvSchema>;

export function readEnv(): RawEnv {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `  - ${i.path.join('.') || '(root)'}: ${i.message}`)
      .join('\n');
    throw new Error(`Invalid environment configuration:\n${issues}`);
  }
  return parsed.data;
}
