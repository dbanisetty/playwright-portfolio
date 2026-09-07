# Layer 4 — `data/`

Test-data setup and teardown.

- **Seeders** — create the state a test needs. Against the OrangeHRM demo these
  drive the UI (no public write API); a seeder registers its own cleanup.
- **Factories** — re-exported from `test-kit/factories`, plus domain-specific
  builders (e.g. an employee record).
- **Cleanup registry** — every created resource is tracked and removed in
  `afterEach`, even when a test fails mid-way.

Golden rule: never create data without registering its teardown.
