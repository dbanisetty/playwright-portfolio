# Layer 7 — `tests/`

Spec files only. No page logic, no locators, no data setup code lives here.

- `smoke/` — `@smoke`, fast, no data seeding; run on every PR.
- `feature/` — `@regression` feature coverage, generated via the `prd-to-tests`
  skill from a PRD in `ai-docs/` or an OpenSpec spec in `openspec/specs/`.
- `api/` — direct API-layer checks (auth round-trip, session, teardown paths).
- `a11y/` — `@a11y`, axe-core scans per page. Assert on `.failing` only
  (serious/critical); `.reportOnly` is logged, not asserted. See
  `test-kit/a11y-baseline.ts` for triaged exclusions.

Every spec: imports from `@fixtures`, tags its `describe` block, follows
Arrange → Act → Assert, uses web-first assertions, and never calls
`waitForTimeout`.
