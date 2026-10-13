import type { Page } from '@playwright/test';
import type { DemoUser } from '../config/users';

export async function loginAs(page: Page, user: DemoUser): Promise<void> {
  await page.goto('/');
  await page.getByPlaceholder('Username').fill(user.username);
  await page.getByPlaceholder('Password').fill(user.password);
  await page.getByRole('button', { name: 'Login' }).click();
}
