# Locators

## Priority order — always pick the highest that works

1. `getByRole(role, { name })`
2. `getByLabel(text)`
3. `getByPlaceholder(text)` — unlabelled inputs only
4. `getByTestId(id)` — only where the app sets a stable test id
5. `getByText(text)` — **non-interactive** content only
6. `getByAltText()` / `getByTitle()` — where semantically right
7. `locator(css)` — last resort, and only with a `// rationale:` comment on the line

## Hard fails — fix before commit

- Absolute XPath, long CSS chains, or `.nth()` / `.first()` / `.last()` without a documented reason.
- Volatile hooks: hashed class names, framework-generated ids.
- A selector that matches more than one actionable element (Playwright throws — disambiguate with `.filter()` or scoping, never `.nth()`).
- `waitForTimeout` for synchronisation.
- `page.locator('[data-testid=…]')` — use `getByTestId(id)` so Playwright's `testIdAttribute` config applies.

## OrangeHRM notes

The demo is an Angular app with `oxd-*` component classes and **few ARIA roles or
test ids**. Reality:

- Text inputs: `getByPlaceholder('Username')`, or scope by the field's label wrapper.
- Buttons: `getByRole('button', { name: 'Save' })` works — button text is real.
- Headings: the breadcrumb is an `<h6>` → `getByRole('heading', { name: 'PIM' })`.
- Dropdowns / autocompletes: `oxd-select-*` and `oxd-autocomplete-*` — scope to the
  label, click to open, then `getByRole('option', { name })`.
- Alerts / toasts: `.oxd-alert-content-text` (invalid login), `.oxd-toast` ("Successfully Saved").
- Field errors: `.oxd-input-field-error-message` (text "Required").

When a CSS class is genuinely the only handle, scope it tightly and add the
rationale comment:

```ts
// rationale: OrangeHRM renders no role/label/testid on the toast container
readonly successToast: Locator = this.page.locator('.oxd-toast');
```

## Declaration pattern

Locators are class fields, initialised inline (never inside a method):

```ts
private readonly usernameField: Locator = this.page.getByPlaceholder('Username');
```

- **`private readonly`** for interaction-only locators (fields the spec never asserts on).
- **`readonly`** (public) for locators a spec asserts against — e.g. `errorAlert`, `heading`.
- Type is always `Locator` from `@playwright/test`, imported with `import type`.

## Synchronisation

```ts
await expect(page.getByRole('button', { name: 'Save' })).toBeVisible();   // ✅ verification
await locator.waitFor({ state: 'attached' });                            // ✅ pre-action DOM state only
await locator.waitFor({ state: 'visible' });                             // ❌ use expect().toBeVisible()
await page.waitForTimeout(2000);                                         // ❌ never
```
