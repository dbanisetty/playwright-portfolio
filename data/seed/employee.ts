import type { Logger } from '@test-kit/logger';
import type { FlowFactory } from '@domain/factory';
import type { AddEmployeeOptions } from '@domain/EmployeeOnboardingFlow';
import type { CleanupRegistry } from '@data/cleanup';
import type { Employee } from '@test-kit/factories/employee';

export class EmployeeSeeder {
  constructor(
    private readonly domain: FlowFactory,
    private readonly cleanup: CleanupRegistry,
    private readonly log: Logger,
  ) {}

  /**
   * Creates an employee through the UI and registers its deletion for
   * `afterEach`. Cleanup is registered BEFORE the create action, so a
   * half-created record is still torn down.
   */
  async create(
    employee: Employee,
    opts: AddEmployeeOptions = {},
  ): Promise<{ employeeId: string }> {
    this.cleanup.add(`employee ${employee.firstName} ${employee.lastName}`, async (pages) => {
      await pages.pimEmployeeList().deleteByEmployee(employee.firstName, employee.lastName);
    });
    this.log.info(`seed employee ${employee.firstName} ${employee.lastName}`);
    return this.domain.employeeOnboarding().addEmployee(employee, opts);
  }
}
