import type { PageManager } from '@ui/PageManager';
import type { Logger } from '@test-kit/logger';

export interface CleanupTask {
  label: string;
  run: (pages: PageManager) => Promise<void>;
}

/**
 * Collects teardown callbacks. The `seed` fixture drains it in `afterEach`,
 * LIFO, each task guarded so one failure doesn't block the rest.
 */
export class CleanupRegistry {
  private readonly tasks: CleanupTask[] = [];

  add(label: string, run: CleanupTask['run']): void {
    this.tasks.push({ label, run });
  }

  async drain(pages: PageManager, log: Logger): Promise<void> {
    for (const task of [...this.tasks].reverse()) {
      try {
        log.info(`cleanup: ${task.label}`);
        await task.run(pages);
      } catch (err) {
        log.warn(`cleanup failed: ${task.label} — ${(err as Error).message}`);
      }
    }
    this.tasks.length = 0;
  }
}
