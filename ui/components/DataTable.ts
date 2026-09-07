import type { Locator } from '@playwright/test';

/** Wraps an OrangeHRM `.oxd-table`. Rows are the body cards; the header is separate. */
export class DataTable {
  constructor(private readonly root: Locator) {}

  get rows(): Locator {
    // rationale: OrangeHRM table rows carry no `row` role; body cards are the stable unit
    return this.root.locator('.oxd-table-body .oxd-table-card');
  }

  /** Rows whose combined cell text contains `text`. */
  rowsContaining(text: string): Locator {
    return this.rows.filter({ hasText: text });
  }
}
