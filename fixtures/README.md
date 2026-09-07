# `fixtures/`

The extended Playwright `test` object. Every spec imports `test` and `expect`
from here — never from `@playwright/test` directly, or the fixtures below are
silently lost.

Provides (from Phase 1 on): `logger`, `pages` (PageManager), `currentUser`
(storage-state auth), `api`, `seed` (data seeder + cleanup).
