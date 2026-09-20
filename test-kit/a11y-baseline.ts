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
  {
    page: 'pim-add-employee-validation',
    ruleId: 'button-name',
    reason:
      'The sidebar collapse toggle and "add employee photo" icon buttons re-render without any accessible text once the form re-renders after a failed save (2026-09-20). Not present on initial page load — only on the validation-error state. Third-party markup we don\'t control.',
  },
  {
    page: 'pim-add-employee-validation',
    ruleId: 'label',
    reason:
      "Some form inputs lose their programmatic label association after a failed save re-renders the form (2026-09-20). Third-party markup we don't control.",
  },
  {
    page: 'pim-add-employee-validation',
    ruleId: 'color-contrast',
    reason:
      "OrangeHRM's field-error text/borders fall below WCAG contrast thresholds on this form (2026-09-20). Third-party markup we don't control.",
  },
  {
    page: 'pim-add-employee-validation',
    ruleId: 'list',
    reason:
      "A <ul> in the re-rendered form after a failed save contains a non-<li> direct child (2026-09-20). Third-party markup we don't control.",
  },
];

/** axe rule ids to disable for a given page, from the baseline above. */
export function baselineRulesFor(pageKey: string): string[] {
  return A11Y_BASELINE.filter((entry) => entry.page === pageKey || entry.page === '*').map(
    (entry) => entry.ruleId,
  );
}
