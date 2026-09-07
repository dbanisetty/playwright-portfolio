# Layer 2 — `test-kit/`

The owned utilities the rest of the framework builds on. In-repo by design — no
external test-utility package to depend on or explain.

| File | Purpose |
|------|---------|
| `logger.ts` | Structured per-test logger with nested contexts; `renderLog()` for report attachments |
| `auth.ts` | Auth roles and the demo's (public) credentials |
| `factories/` | faker-backed test-data builders — `buildPerson()` so far |

Planned: `api.ts` (logged `APIRequestContext` wrapper).

Layers 3–7 import from here; this layer imports only from `config/`.
