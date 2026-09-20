/**
 * Known, triaged accessibility issues on the target app that we've decided
 * not to block on yet. Every entry needs a `reason` — this is a deliberate,
 * reviewed exclusion list, not a place to silence noise.
 *
 * Add an entry only after a real scan surfaces it and a human has looked at
 * it; don't pre-populate speculatively. Revisit periodically — an excluded
 * rule that later gets fixed upstream should be removed here too.
 */
export interface BaselineEntry {
  /**
   * Page key, matching the `pageKey` passed to `a11y.check()` in the spec —
   * or `'*'` for a document-level rule (e.g. missing `<html lang>`) that
   * applies identically on every page, so it isn't repeated per page.
   */
  page: string | '*';
  /** axe rule id, e.g. "color-contrast". */
  ruleId: string;
  reason: string;
}

export const A11Y_BASELINE: readonly BaselineEntry[] = [
  {
    page: '*',
    ruleId: 'html-has-lang',
    reason:
      "OrangeHRM's demo app renders <html> with no lang attribute sitewide — confirmed identical on both login and dashboard (2026-09-20). Third-party markup we don't control; revisit if the upstream demo ever fixes it.",
  },
];

/** axe rule ids to disable for a given page, from the baseline above. */
export function baselineRulesFor(pageKey: string): string[] {
  return A11Y_BASELINE.filter((entry) => entry.page === pageKey || entry.page === '*').map(
    (entry) => entry.ruleId,
  );
}
