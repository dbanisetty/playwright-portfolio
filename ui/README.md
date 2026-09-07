# Layer 5 — `ui/`

The Page Object Model.

- `pages/` — one class per navigable page, each extending `BasePage`.
- `components/` — shared UI regions (nav, data-table, toast) used across pages.
- `PageManager` — lazy getters so a test pulls only the pages it touches.

Pages expose intent-level methods (`addEmployee(...)`), never raw locators, and
never call `expect`. Locators follow the priority order in the framework skill:
role / label / text / test-id, no raw CSS or XPath without a documented reason.
