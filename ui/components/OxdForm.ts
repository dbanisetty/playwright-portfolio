import type { Locator, Page } from '@playwright/test';

/**
 * OrangeHRM renders form fields as `.oxd-input-group` wrappers that carry a
 * visible `<label>` but no accessible name on the input itself. This helper
 * scopes to a field by its label text so page objects don't repeat the CSS.
 */
export class OxdForm {
  constructor(private readonly scope: Page | Locator) {}

  /** The field wrapper whose label contains `label` (optionally excluding `not`). */
  group(label: string, not?: string): Locator {
    // rationale: no role/label/testid on OrangeHRM inputs — the visible label is the only stable handle
    const g = this.scope.locator('.oxd-input-group').filter({ hasText: label });
    return not ? g.filter({ hasNotText: not }) : g;
  }

  /** The `<input>` inside that field group. */
  input(label: string, not?: string): Locator {
    return this.group(label, not).locator('input');
  }

  /** The validation message under that field group, if shown. */
  error(label: string, not?: string): Locator {
    return this.group(label, not).locator('.oxd-input-field-error-message');
  }
}
