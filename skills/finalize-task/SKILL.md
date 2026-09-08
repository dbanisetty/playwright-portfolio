---
name: finalize-task
description: >
  Wrap up the current change on this repo: verify it, update the delivery
  status, commit, push, and open a PR. Use when asked to "finalize", "wrap up",
  "ship this", "finish the task", "open the PR".
argument-hint: 'Optional: a one-line summary of the change'
---

# finalize-task

## Step 1 — Verify

- `npm run typecheck` and `npm run lint` — both must be clean.
- Run the tests the change touches:
  - a new/edited `tests/feature/<f>.spec.ts` → `npx playwright test tests/feature/<f>.spec.ts --project=chromium`
  - framework / fixture / page-object changes → `npx playwright test --grep @smoke` at minimum
- Anything red → stop and report. Do not finalize.

## Step 2 — Coverage check (feature specs only)

If the change added or edited a feature spec, confirm every row in
`ai-docs/scenarios.csv` for that `feature` has a matching `test` (the scenario
id appears in the spec). List any uncovered rows and ask before proceeding.

## Step 3 — Update status

- Bump the **Status** section in `README.md`.
- Update any layer `README.md` whose contents changed (`ui/`, `data/`, `domain/`, …).

## Step 4 — Commit

Conventional-commit subject (`feat:` / `fix:` / `docs:` / `chore:`), a body
listing what changed and the test result, and the trailer:

```
Co-Authored-By: Claude Sonnet 5 <noreply@anthropic.com>
```

Show the full message and wait for approval before committing.

## Step 5 — Push & PR

- Push the branch.
- If not on `main`, open a PR with `gh pr create`, body ending:

```
🤖 Generated with [Claude Code](https://claude.com/claude-code)
```

- Hand the user the PR URL.

## Never

- Finalize with failing checks.
- Commit without showing the message first.
- Push a feature change straight to `main` — branch first.
