import { expect } from '@playwright/test';
import { workerTest as test } from '../../fixtures/worker-fixtures';

test('worker fixture identifies the current worker', async ({
  workerLabel,
  loggedInPage,
}, testInfo) => {
  await expect(loggedInPage.getByText('Products', { exact: true })).toBeVisible();
  expect(workerLabel).toBe(`worker-${testInfo.workerIndex}`);
});

test('worker fixture is available to another test in the same worker', async ({
  workerLabel,
}) => {
  expect(workerLabel).toMatch(/^worker-\d+$/);
});
