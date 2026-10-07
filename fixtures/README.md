# `fixtures/`

The extended Playwright `test` object. Every spec imports `test` and `expect`
from `@fixtures` — never from `@playwright/test` directly, or the fixtures below
are silently lost.

| Fixture | Scope | Provides |
|---------|-------|----------|
| `logger` | test | Structured logger; its buffer is attached to the HTML report on failure |
| `pages` | test | `PageManager` — lazy page-object registry |
| `domain` | test | `FlowFactory` — business-flow registry (multi-page journeys) |
| `seed` | test | Data seeders; anything they create is deleted in `afterEach` |
| `a11y` | test | `check(pageKey)` — axe-core scan; attaches full results to the report, returns `failing`/`reportOnly` |

Helper (not a fixture): `openFreshSession(browser, logger)` from `@fixtures` opens a
logged-out context with its own `PageManager`, for signing in as a user the test created.

Planned: `currentUser` (per-role storage state), `api`.
