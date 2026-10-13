import path from 'node:path';

export const authStatePath = path.resolve(
  process.cwd(),
  'playwright',
  '.auth',
  'standard-user.json',
);
