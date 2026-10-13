import dotenv from 'dotenv';
import path from 'node:path';

dotenv.config({ path: path.resolve(process.cwd(), '.env'), quiet: true });

export type TestEnvironment = 'local' | 'dev' | 'qa' | 'staging';

const sauceDemoURL = 'https://www.saucedemo.com';

function requireEnvironmentURL(variableName: string): string {
  const value = process.env[variableName]?.trim();

  if (!value) {
    throw new Error(
      `TEST_ENV requires ${variableName}. Set it to the URL for your own environment.`,
    );
  }

  return value;
}

function validateURL(value: string): string {
  let parsedURL: URL;

  try {
    parsedURL = new URL(value);
  } catch {
    throw new Error(`The configured base URL is not a valid absolute URL: "${value}".`);
  }

  if (parsedURL.protocol !== 'http:' && parsedURL.protocol !== 'https:') {
    throw new Error('The configured base URL must use http:// or https://.');
  }

  return value.replace(/\/+$/, '');
}

export function getEnvironmentConfig(): {
  environment: TestEnvironment;
  baseURL: string;
} {
  const environment = process.env.TEST_ENV ?? 'local';
  let baseURL: string;

  switch (environment) {
    case 'local':
    case 'dev':
      baseURL = process.env.BASE_URL?.trim() || sauceDemoURL;
      break;
    case 'qa':
      baseURL = requireEnvironmentURL('QA_BASE_URL');
      break;
    case 'staging':
      baseURL = requireEnvironmentURL('STAGING_BASE_URL');
      break;
    default:
      throw new Error(
        `Unknown TEST_ENV "${environment}". Choose local, dev, qa, or staging.`,
      );
  }

  return {
    environment,
    baseURL: validateURL(baseURL),
  };
}
