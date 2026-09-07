import type { Logger } from '@test-kit/logger';
import type { PageManager } from '@ui/PageManager';
import { buildEmployeeId, type Employee, type LoginDetails } from '@test-kit/factories/employee';

export interface AddEmployeeOptions {
  /** When set, "Create Login Details" is enabled and filled. */
  login?: LoginDetails;
  /** When set, this exact employee id is used instead of a generated one. */
  employeeId?: string;
}

/**
 * The "add an employee" business journey: PIM Add Employee form → land on
 * Personal Details. Composes page objects; never asserts.
 */
export class EmployeeOnboardingFlow {
  constructor(
    private readonly pages: PageManager,
    private readonly log: Logger,
  ) {}

  /** Creates the employee and returns the assigned employee id. */
  async addEmployee(employee: Employee, opts: AddEmployeeOptions = {}): Promise<{ employeeId: string }> {
    const employeeId = opts.employeeId ?? buildEmployeeId();
    this.log.info(`addEmployee ${employee.firstName} ${employee.lastName} (id ${employeeId})`);
    const form = this.pages.pimAddEmployee();

    await form.open();
    await form.fillName(employee);
    await form.setEmployeeId(employeeId);
    if (opts.login) {
      await form.enableLoginDetails();
      await form.fillLoginDetails({
        username: opts.login.username,
        password: opts.login.password,
        confirmPassword: opts.login.password,
      });
    }
    await form.save();

    await this.pages.pimPersonalDetails().waitUntilLoaded();
    const assignedId = await this.pages.pimPersonalDetails().readEmployeeId();
    this.log.info(`addEmployee -> ${assignedId}`);
    return { employeeId: assignedId };
  }
}
