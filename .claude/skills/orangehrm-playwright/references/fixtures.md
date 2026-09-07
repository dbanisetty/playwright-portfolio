# Fixtures

Every spec imports from `@fixtures` (`fixtures/index.ts`). Importing `test` from
`@playwright/test` directly means the fixtures below silently don't exist.

## Available

| Fixture | Scope | Provides |
|---------|-------|----------|
| `logger` | test | Structured logger; buffer attached to the HTML report on failure |
| `pages` | test | `PageManager` — lazy page-object registry |
| _(planned)_ `seed` | test | Seeders + `CleanupRegistry`, drained in `afterEach` |
| _(planned)_ `domain` | test | Flow registry, mirroring `pages` |
| _(planned)_ `api` | worker | Logged `APIRequestContext` for the API layer |

Plus everything Playwright gives you: `page`, `context`, `browser`, `request`.

## Adding a fixture

1. Check this table and `fixtures/index.ts` — don't duplicate.
2. Add the type to the `Fixtures` interface.
3. Add the implementation to `base.extend<Fixtures>({ … })`.
4. Pick the scope: `test` (per test) unless it's expensive and stateless → `worker`.
5. Teardown goes after `await use(...)`.

```ts
seed: async ({ pages, logger }, use) => {
  const cleanup = new CleanupRegistry();
  const seeders = buildSeeders(pages, cleanup, logger);
  await use(seeders);
  await cleanup.drain(pages, logger);   // teardown
},
```

## Rules

- No business logic in a fixture — it wires collaborators, nothing more.
- A fixture that creates data must clean it up in its own teardown.
- Keep `fixtures/index.ts` thin; real logic lives in `test-kit/`, `data/`, `ui/`.
