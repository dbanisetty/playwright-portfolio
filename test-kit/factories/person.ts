import { faker } from '@faker-js/faker';

export interface Person {
  firstName: string;
  middleName: string;
  lastName: string;
}

/** A random person. Pass overrides to pin any field. */
export function buildPerson(overrides: Partial<Person> = {}): Person {
  return {
    firstName: faker.person.firstName(),
    middleName: faker.person.middleName(),
    lastName: faker.person.lastName(),
    ...overrides,
  };
}
