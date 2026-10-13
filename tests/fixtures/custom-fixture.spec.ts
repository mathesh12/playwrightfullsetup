import { test, expect } from '../../fixtures/app-fixtures';

test('the logged-in page fixture opens the product list', async ({ loggedInPage }) => {
  await expect(loggedInPage.getByText('Products', { exact: true })).toBeVisible();
  await expect(loggedInPage.locator('.inventory_item')).toHaveCount(6);
});
