import path from 'node:path';

/** Where storage-state files (logged-in sessions) are written. Git-ignored. */
export const AUTH_DIR = path.resolve(process.cwd(), 'playwright/.auth');

export function authStatePath(role: string): string {
  return path.join(AUTH_DIR, `${role}.json`);
}
