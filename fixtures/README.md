# `fixtures/`

The extended Playwright `test` object. Every spec imports `test` and `expect`
from `@fixtures` — never from `@playwright/test` directly, or the fixtures below
are silently lost.

| Fixture | Scope | Provides |
|---------|-------|----------|
| `logger` | test | Structured logger; its buffer is attached to the HTML report on failure |
| `pages` | test | `PageManager` — lazy page-object registry |

Planned: `currentUser` (per-role storage state), `api`, `seed` (data + cleanup).
