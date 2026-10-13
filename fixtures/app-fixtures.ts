import { test as base, type Page } from '@playwright/test';

type AppFixtures = {
  loggedInPage: Page;
};

export const test = base.extend<AppFixtures>({
  loggedInPage: async ({ page }, use) => {
    await page.goto('/inventory.html');
    await use(page);
  },
});

export { expect } from '@playwright/test';
