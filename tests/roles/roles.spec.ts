import { test, expect } from '@playwright/test';
import { demoUsers } from '../../config/users';
import { loginAs } from '../../utils/login';

for (const [role, user] of Object.entries(demoUsers)) {
  test(`${role} can open the product inventory`, async ({ page }) => {
    await loginAs(page, user);

    await expect(page).toHaveURL(/inventory\.html/);
    await expect(page.getByText('Products', { exact: true })).toBeVisible();
  });
}
