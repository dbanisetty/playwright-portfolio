# `skills/`

The test-authoring workflow, version-controlled. Each subdirectory is one skill:
a `SKILL.md` (the instructions), plus `references/` and `examples/` where useful.

| Skill | Role |
|-------|------|
| [`orangehrm-playwright`](orangehrm-playwright/SKILL.md) | Framework conventions — golden rules, file map, the 6-step test-writing workflow, and reference docs (POM, locators, fixtures, data & cleanup, spec standards, config) |
| [`prd-to-tests`](prd-to-tests/SKILL.md) | Turns a PRD in `ai-docs/` into tagged specs and the page objects / factories / seeders they need. Defers to `orangehrm-playwright` for *how* code is written |
| [`review-tests`](review-tests/SKILL.md) | Audits specs across five dimensions — coverage, tagging, naming, locators, assertion & wait discipline — and produces one structured report |
| [`finalize-task`](finalize-task/SKILL.md) | Verify → update status → commit → push → PR |

## How they're used

These are [Claude Code](https://claude.com/claude-code) skills. Claude Code
discovers skills from `.claude/skills/`, so a one-time symlink wires this
directory in:

```bash
npm run skills:link   # ln -sfn ../skills .claude/skills  (the link is git-ignored)
```

Keeping the real files in `skills/` — not `.claude/` — means they show up in the
repo, get reviewed in PRs, and version alongside the framework they describe.

### Optional: Playwright MCP

`orangehrm-playwright` Step 3 (locator discovery) can use the
[Playwright MCP server](https://github.com/microsoft/playwright-mcp) instead of
`codegen` — it reads the live accessibility tree and hands back role-based
locators. Copy `.mcp.json.example` → `.mcp.json` (git-ignored) to enable it.
Authoring aid only; it plays no part in `playwright test` or CI.

## Editing a skill

- `SKILL.md` frontmatter needs `name` and `description`; the description is what
  Claude matches against, so list the trigger phrases.
- Keep `SKILL.md` short — a router plus the rules. Put depth in `references/*.md`.
- `examples/*.ts` are copy-paste templates; they're excluded from `tsc`/ESLint.
