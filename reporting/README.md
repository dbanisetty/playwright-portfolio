# Layer 3 — `reporting/`

Log sink and artifact wiring: routes the `test-kit` logger into Playwright's
reporter, attaches logs/screenshots to failing tests, and defines any custom
step annotations.

Populated once there are tests producing output to route (Phase 1+).
