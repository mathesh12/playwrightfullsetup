import { test, expect } from '../../fixtures/app-fixtures';

test('add a backpack to the shopping cart', async ({ loggedInPage }) => {
  const backpack = loggedInPage
    .locator('.inventory_item')
    .filter({ hasText: 'Sauce Labs Backpack' });

  await backpack.getByRole('button', { name: 'Add to cart' }).click();
  await loggedInPage.getByRole('button', { name: /^Cart/ }).click();

  await expect(loggedInPage).toHaveURL(/cart\.html/);
  await expect(
    loggedInPage.getByText('Sauce Labs Backpack', { exact: true }),
  ).toBeVisible();
});
