# `ai-docs/`

Product context the AI skills read from, kept in the repo so test generation is
reproducible.

- `PRDs/` — one PRD per feature: journeys, functional requirements (`REQ-*`),
  validation rules (`VAL-*`), acceptance criteria, data needs, and a scenario list.
- `scenarios.csv` — the flat scenario list across all PRDs: id, feature, title,
  priority, tags, whether login / seeding is needed, `prd_ref` back-links, notes.

## Current

| PRD | Scenarios |
|-----|-----------|
| [`PRDs/pim-add-employee.md`](./PRDs/pim-add-employee.md) | `ADDEMP-01`…`ADDEMP-11` |

The `prd-to-tests` skill (Phase 3) consumes these to generate specs under
`tests/feature/`.
