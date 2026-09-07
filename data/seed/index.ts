import type { Logger } from '@test-kit/logger';
import type { FlowFactory } from '@domain/factory';
import type { CleanupRegistry } from '@data/cleanup';
import { EmployeeSeeder } from '@data/seed/employee';

export interface Seeders {
  employees: EmployeeSeeder;
}

/** Builds the seeder set exposed to specs as the `seed` fixture. */
export function buildSeeders(
  domain: FlowFactory,
  cleanup: CleanupRegistry,
  log: Logger,
): Seeders {
  return {
    employees: new EmployeeSeeder(domain, cleanup, log.child('EmployeeSeeder')),
  };
}
