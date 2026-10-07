import type { Logger } from '@test-kit/logger';
import type { FlowFactory } from '@domain/factory';
import type { CleanupRegistry } from '@data/cleanup';
import { EmployeeSeeder } from '@data/seed/employee';
import { SystemUserSeeder } from '@data/seed/systemUser';

export interface Seeders {
  employees: EmployeeSeeder;
  systemUsers: SystemUserSeeder;
}

/** Builds the seeder set exposed to specs as the `seed` fixture. */
export function buildSeeders(domain: FlowFactory, cleanup: CleanupRegistry, log: Logger): Seeders {
  const employees = new EmployeeSeeder(domain, cleanup, log.child('EmployeeSeeder'));
  return {
    employees,
    systemUsers: new SystemUserSeeder(employees, domain, cleanup, log.child('SystemUserSeeder')),
  };
}
