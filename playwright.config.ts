import { defineConfig, devices } from '@playwright/test';
import { authStatePath } from './config/auth-state';
import { getEnvironmentConfig } from './config/environment';

const { baseURL } = getEnvironmentConfig();
const desktopChrome = {
  ...devices['Desktop Chrome'],
  channel: 'chrome',
};

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  globalSetup: './global-setup.ts',
  globalTeardown: './global-teardown.ts',
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['./reporters/simple-reporter.ts'],
  ],

  use: {
    baseURL,
    trace: 'on-first-retry',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'setup',
      testMatch: '**/setup/**/*.setup.ts',
      use: { ...desktopChrome },
    },
    {
      name: 'chromium',
      testMatch: '**/*.spec.ts',
      testIgnore: [
        '**/roles/**/*.spec.ts',
        '**/fixtures/worker-fixture.spec.ts',
      ],
      dependencies: ['setup'],
      use: {
        ...desktopChrome,
        storageState: authStatePath,
      },
    },
    {
      name: 'worker-demo',
      testMatch: '**/fixtures/worker-fixture.spec.ts',
      dependencies: ['setup'],
      workers: 1,
      fullyParallel: false,
      use: {
        ...desktopChrome,
        storageState: authStatePath,
      },
    },
    {
      name: 'role-tests',
      testMatch: '**/roles/**/*.spec.ts',
      dependencies: ['setup'],
      use: {
        ...desktopChrome,
        storageState: { cookies: [], origins: [] },
      },
    },
  ],
});