import { test as appTest } from './app-fixtures';

type WorkerFixtures = {
  workerLabel: string;
};

export const workerTest = appTest.extend<{}, WorkerFixtures>({
  workerLabel: [
    async ({}, use, workerInfo) => {
      const label = `worker-${workerInfo.workerIndex}`;
      console.log(`[worker fixture] Created ${label}`);
      await use(label);
    },
    { scope: 'worker' },
  ],
});
