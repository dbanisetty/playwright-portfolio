export interface Credentials {
  username: string;
  password: string;
}

/**
 * Public, well-known credentials for the OrangeHRM open-source demo.
 * Not a secret — published in the demo's own login screen.
 */
export const DEMO_ADMIN: Credentials = {
  username: 'Admin',
  password: 'admin123',
};

export const AUTH_ROLES = ['admin'] as const;
export type AuthRole = (typeof AUTH_ROLES)[number];

export const CREDENTIALS: Record<AuthRole, Credentials> = {
  admin: DEMO_ADMIN,
};
