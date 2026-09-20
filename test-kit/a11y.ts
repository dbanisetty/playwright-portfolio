import type { Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import type { AxeResults, Result } from 'axe-core';

/** Impact levels axe can report, ordered least to most severe. */
export type A11yImpact = 'minor' | 'moderate' | 'serious' | 'critical';

/** Violations at this impact or above fail the test; the rest are report-only. */
export const FAILING_IMPACTS: readonly A11yImpact[] = ['serious', 'critical'];

export interface A11yScanOptions {
  /** CSS selectors to scan within, instead of the whole page. */
  include?: string[];
  /** axe rule ids to skip entirely — use the baseline file, not ad-hoc calls, for this. */
  disableRules?: string[];
}

export interface A11yScanResult {
  raw: AxeResults;
  failing: Result[];
  reportOnly: Result[];
}

function isFailing(violation: Result): boolean {
  return FAILING_IMPACTS.includes(violation.impact as A11yImpact);
}

/**
 * Runs an axe-core scan against the current page state. Never asserts —
 * mirrors the rest of the framework's page/domain layers; the spec decides
 * what to do with `failing` vs `reportOnly`.
 */
export async function scanPage(page: Page, opts: A11yScanOptions = {}): Promise<A11yScanResult> {
  let builder = new AxeBuilder({ page });
  if (opts.include) {
    for (const selector of opts.include) builder = builder.include(selector);
  }
  if (opts.disableRules) {
    builder = builder.disableRules(opts.disableRules);
  }

  const raw = await builder.analyze();
  return {
    raw,
    failing: raw.violations.filter(isFailing),
    reportOnly: raw.violations.filter((v) => !isFailing(v)),
  };
}

/** One-line summary per violation, for attaching to the report or a failure message. */
export function describeViolation(violation: Result): string {
  const nodes = violation.nodes.length;
  return `[${violation.impact}] ${violation.id}: ${violation.help} (${nodes} node${nodes === 1 ? '' : 's'})`;
}
