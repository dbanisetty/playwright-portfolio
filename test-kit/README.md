# Layer 2 — `test-kit/`

The owned utilities the rest of the framework builds on. In-repo by design — no
external test-utility package to depend on or explain.

Planned contents (added in Phase 1):

- `logger.ts` — structured per-test logger, attached to the HTML report on failure
- `auth.ts` — storage-state helper: log in once, reuse the session across tests
- `factories/` — faker-backed test-data builders
- `api.ts` — thin wrapper around Playwright's `APIRequestContext` with logging

Layers 3–7 import from here; this layer imports only from `config/`.
