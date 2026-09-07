# Layer 6 — `domain/`

Business flows that compose pages from `ui/` into whole journeys —
"onboard an employee", "submit a leave request".

- One flow class per journey; registered in `factory.ts`, reached via the `domain` fixture.
- Flows **never** import or call `expect`; assertions are the spec's job.
- Reused across specs → a flow. Used once → the spec calls pages directly.

| Flow | Journey |
|------|---------|
| `EmployeeOnboardingFlow` | PIM Add Employee form → Personal Details; returns the assigned employee id |
