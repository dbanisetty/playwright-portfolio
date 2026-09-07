import { faker } from '@faker-js/faker';

export interface Employee {
  firstName: string;
  middleName: string;
  lastName: string;
}

export interface LoginDetails {
  username: string;
  password: string;
}

/** A random employee. Pass overrides to pin any field. */
export function buildEmployee(overrides: Partial<Employee> = {}): Employee {
  return {
    firstName: faker.person.firstName(),
    middleName: faker.person.middleName(),
    lastName: faker.person.lastName(),
    ...overrides,
  };
}

/**
 * A run-unique employee id (8 digits, leading 9). OrangeHRM's auto-suggested id
 * is unreliable on the shared demo — it is often already taken — so tests always
 * pin their own.
 */
export function buildEmployeeId(): string {
  return `9${faker.string.numeric(7)}`;
}

/**
 * Login details that satisfy OrangeHRM's rules: username 5–40 chars; password
 * 7–64 chars with upper, lower, digit and a symbol (so the strength meter clears "Weak").
 */
export function buildLoginDetails(overrides: Partial<LoginDetails> = {}): LoginDetails {
  return {
    username: `e2e${faker.string.alphanumeric(7).toLowerCase()}`,
    password: `Aa1@${faker.string.alphanumeric(10)}`,
    ...overrides,
  };
}
