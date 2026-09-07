# Layer 7 — `tests/`

Spec files only. No page logic, no locators, no data setup code lives here.

- `smoke/` — `@smoke`, fast, no data seeding; run on every PR.
- `feature/` — `@regression` feature coverage, generated from PRDs via the
  `prd-to-tests` skill.
- `api/` — direct API-layer checks (auth round-trip, session, teardown paths).

Every spec: imports from `@fixtures`, tags its `describe` block, follows
Arrange → Act → Assert, uses web-first assertions, and never calls
`waitForTimeout`.
