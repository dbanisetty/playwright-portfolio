import type { Logger } from '@test-kit/logger';
import type { FlowFactory } from '@domain/factory';
import type { CleanupRegistry } from '@data/cleanup';
import type { EmployeeSeeder } from '@data/seed/employee';
import { buildEmployee, type Employee } from '@test-kit/factories/employee';
import type { SystemUser } from '@test-kit/factories/systemUser';

export class SystemUserSeeder {
  constructor(
    private readonly employees: EmployeeSeeder,
    private readonly domain: FlowFactory,
    private readonly cleanup: CleanupRegistry,
    private readonly log: Logger,
  ) {}

  /**
   * Seeds an employee, then a system user for it, both through the UI. The user's
   * deletion is registered BEFORE save; the registry drains LIFO, so the user is
   * removed before its employee.
   */
  async create(
    user: SystemUser,
    employee: Employee = buildEmployee(),
  ): Promise<{ employee: Employee }> {
    await this.employees.create(employee);
    this.willCreate(user);
    this.log.info(`seed system user ${user.username}`);
    await this.domain.adminUsers().addUser(employee, user);
    return { employee };
  }

  /**
   * Registers deletion of a user the spec is about to create through the form
   * itself, for tests that assert on the save (e.g. its toast).
   */
  willCreate(user: Pick<SystemUser, 'username'>): void {
    this.cleanup.add(`system user ${user.username}`, async (pages) => {
      await pages.adminSystemUsers().deleteByUsername(user.username);
    });
  }
}
