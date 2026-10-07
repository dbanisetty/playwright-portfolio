import type { Logger } from '@test-kit/logger';
import type { PageManager } from '@ui/PageManager';
import type { Employee } from '@test-kit/factories/employee';
import type { SystemUser } from '@test-kit/factories/systemUser';

/**
 * The "give an employee a login" business journey: Admin → Add User form → land
 * back on the System Users list. Composes page objects; never asserts.
 */
export class AdminUserFlow {
  constructor(
    private readonly pages: PageManager,
    private readonly log: Logger,
  ) {}

  /** Creates a system user for an existing employee. */
  async addUser(
    employee: Pick<Employee, 'firstName' | 'lastName'>,
    user: SystemUser,
  ): Promise<void> {
    this.log.info(
      `addUser "${user.username}" (${user.role}, ${user.status}) for ${employee.firstName} ${employee.lastName}`,
    );
    const form = this.pages.adminAddUser();

    await form.open();
    await form.selectRole(user.role);
    await form.pickEmployee(employee);
    await form.selectStatus(user.status);
    await form.fillCredentials({
      username: user.username,
      password: user.password,
      confirmPassword: user.password,
    });
    await form.save();

    await this.pages.adminSystemUsers().waitUntilLoaded();
  }
}
