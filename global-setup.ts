import { getEnvironmentConfig } from './config/environment';

async function globalSetup(): Promise<void> {
  const { environment, baseURL } = getEnvironmentConfig();
  console.log(`[global setup] Environment: ${environment}; base URL: ${baseURL}`);
}

export default globalSetup;
