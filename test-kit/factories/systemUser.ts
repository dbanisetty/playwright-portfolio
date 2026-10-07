import { buildLoginDetails } from '@test-kit/factories/employee';

export type UserRole = 'Admin' | 'ESS';
export type UserStatus = 'Enabled' | 'Disabled';

/** An OrangeHRM system user (login account). The employee it belongs to is seeded separately. */
export interface SystemUser {
  role: UserRole;
  status: UserStatus;
  username: string;
  password: string;
}

/** A run-unique enabled ESS user with valid credentials. Pass overrides to pin any field. */
export function buildSystemUser(overrides: Partial<SystemUser> = {}): SystemUser {
  return {
    role: 'ESS',
    status: 'Enabled',
    ...buildLoginDetails(),
    ...overrides,
  };
}
