import { rm } from 'node:fs/promises';
import { authStatePath } from './config/auth-state';

async function globalTeardown(): Promise<void> {
  await rm(authStatePath, { force: true });
  console.log('[global teardown] Removed the generated SauceDemo authentication state.');
}

export default globalTeardown;
