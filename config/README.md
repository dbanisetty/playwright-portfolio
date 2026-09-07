# Layer 1 — `config/`

Runtime configuration. Reads and validates environment variables (`env.ts`, with
a `zod` schema), applies defaults (`defaults.ts`), and produces one immutable
`RuntimeConfig` (`types.ts`, assembled in `index.ts`).

- `createRuntimeConfig()` — the single entry point. Cached; call it anywhere.
- `getProjects()` — the Playwright `projects` array.

`playwright.config.ts` at the repo root is the only file that maps this onto
Playwright's own shape. Nothing else in the framework reads `process.env` directly.
