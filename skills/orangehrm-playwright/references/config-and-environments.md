# Config & environments

## How config flows

```
process.env + .env  ─►  config/env.ts (zod validation)
                        config/defaults.ts (base URLs, timeouts, retries)
                        └─►  createRuntimeConfig(): RuntimeConfig   (cached)
                             └─►  playwright.config.ts maps it onto Playwright
```

`createRuntimeConfig()` is the only place env is read. Everything else takes
values from the resolved config or from Playwright's `use`/`baseURL`.

## Environment variables (all optional)

| Var | Default | Notes |
|-----|---------|-------|
| `ENV` | `demo` | `demo` \| `local` — picks the base URL |
| `BASE_URL` | per `ENV` | Explicit override |
| `HEADLESS` | `true` | `false` to watch the browser |
| `WORKERS` | auto | Parallel workers |
| `RETRIES` | `0` local / `2` CI | Retry count |

Set them in `.env` (git-ignored; `.env.example` is the template) or inline:

```bash
ENV=demo HEADLESS=false npx playwright test tests/feature/add-employee.spec.ts --project=chromium
```

## Base URLs

`config/defaults.ts`:

```ts
export const BASE_URLS = {
  demo: 'https://opensource-demo.orangehrmlive.com',
  local: 'http://localhost:8080',
};
```

Add a new environment: extend `EnvName`, add its URL here, add it to the `ENV`
enum in `config/env.ts`.

## Storage state / auth

- `config/paths.ts` → `authStatePath('admin')` = `playwright/.auth/admin.json` (git-ignored).
- The `setup` project (`tests/auth.setup.ts`) logs in once and writes it.
- The `chromium` project sets `storageState` to that path, so every spec starts
  authenticated.
- A spec that must start logged-out: `test.use({ storageState: { cookies: [], origins: [] } })`.

## Secrets

The demo's credentials are public and live in `test-kit/auth.ts`. A real secret
would come from an env var validated in `config/env.ts` and never be committed.
