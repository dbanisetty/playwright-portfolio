# playwright-portfolio

A layered **Playwright + TypeScript** E2E framework with an **AI-assisted
test-authoring workflow** — tests are generated from a PRD, reviewed by a second
skill, and maintained with an offline locator-repair loop.

System under test: the [OrangeHRM open-source demo](https://opensource-demo.orangehrmlive.com).

> **Status: Phase 0 — scaffold.** The architecture is in place; feature tests,
> the `test-kit` utilities, the AI skills, and CI arrive over the following
> phases. See the delivery plan below.

---

## Stack

| | |
|---|---|
| Runner | Playwright Test |
| Language | TypeScript (strict), ESM |
| Node | 22 (`.nvmrc`) |
| Config validation | zod |
| Lint / format | ESLint (flat) + Prettier |

## Architecture — seven layers

Each layer owns one concern; a spec only ever touches the top layer.

| # | Path | Responsibility |
|---|------|----------------|
| 1 | `config/` | Runtime config — env resolution, base URLs, defaults, Playwright projects |
| 2 | `test-kit/` | Owned utilities — logger, auth/storage-state, factories, API wrapper |
| 3 | `reporting/` | Log sink + artifact wiring into the HTML reporter |
| 4 | `data/` | Test-data seeders, factories, cleanup registry |
| 5 | `ui/` | Page Object Model — `BasePage`, components, `PageManager` |
| 6 | `domain/` | Business flows composing `ui/`; no assertions |
| 7 | `tests/` | Specs only — `smoke/`, `feature/`, `api/` |

`fixtures/` holds the extended `test` object every spec imports from.
`ai-docs/` holds the PRDs the generation workflow reads.

## Getting started

Requires Node 22 and npm.

```bash
nvm use            # or install Node 22
npm install
npm run setup      # installs the Chromium browser
cp .env.example .env
npm test
```

### Common commands

| Command | What it does |
|---------|--------------|
| `npm test` | Run the full suite |
| `npm run test:smoke` | `@smoke` only |
| `npm run test:regression` | `@regression` only |
| `npm run test:headed` | Run with a visible browser |
| `npm run test:ui` | Playwright UI mode |
| `npm run report` | Open the last HTML report |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |

### Configuration

All optional — defaults target the demo, headless. Set in `.env`:

| Var | Default | Notes |
|-----|---------|-------|
| `ENV` | `demo` | `demo` \| `local` |
| `BASE_URL` | per `ENV` | Override the base URL |
| `HEADLESS` | `true` | `false` to watch the browser |
| `WORKERS` / `RETRIES` | auto | Override parallelism / retries |

---

## Delivery plan

| Phase | Scope |
|-------|-------|
| **0** | Repo, tooling, seven-layer skeleton, config factory *(done)* |
| **1** | `test-kit` (logger, auth, factories), `fixtures`, first login smoke test |
| **2** | Framework skill + first PRD (`ai-docs/PRDs/` — PIM Add Employee) + `scenarios.csv` |
| **3** | `prd-to-tests` + `review-tests` skills; first feature suite generated through them |
| **4** | GitHub Actions CI, `finalize-task` skill, full README |
| **5** | *(optional)* Second target via self-hosted Docker + API-driven seeding |
| **6** | *(optional)* `locator-repair` skill wired to CI; coverage and polish |
