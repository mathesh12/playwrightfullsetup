import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { test, expect } from '@playwright/test';
import { authStatePath } from '../../config/auth-state';
import { demoUsers } from '../../config/users';
import { loginAs } from '../../utils/login';

test('log in as the standard user and save browser state', async ({ page }) => {
  await loginAs(page, demoUsers.standard_user);
  await expect(page).toHaveURL(/inventory\.html/);

  await mkdir(path.dirname(authStatePath), { recursive: true });
  await page.context().storageState({ path: authStatePath });
});
