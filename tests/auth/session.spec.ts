import { test, expect } from '../../fixtures/app-fixtures';

test('reuse the saved standard-user session', async ({ loggedInPage }) => {
  await expect(loggedInPage).toHaveURL(/inventory\.html/);
  await expect(loggedInPage.getByText('Products', { exact: true })).toBeVisible();
});
