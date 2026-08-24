const LOCAL_DATABASE_HOSTS = new Set(['localhost', '127.0.0.1', '0.0.0.0']);

/**
 * Local override files are intentionally read before the shared .env file.
 * This keeps developers from accidentally using the production values stored
 * in their ignored .env file.
 */
export function getEnvironmentFiles(
  nodeEnv = process.env.NODE_ENV ?? 'development',
) {
  return [`.env.${nodeEnv}.local`, `.env.${nodeEnv}`, '.env'];
}

/**
 * Development must never silently connect to a hosted database. Production
 * deployments set NODE_ENV=production and are therefore unaffected.
 */
export function assertDevelopmentDatabaseIsLocal(
  databaseUrl: string | undefined,
  nodeEnv = process.env.NODE_ENV,
) {
  if (nodeEnv !== 'development') return;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required for local development.');
  }

  let hostname: string;
  try {
    hostname = new URL(databaseUrl).hostname;
  } catch {
    throw new Error('DATABASE_URL must be a valid URL in local development.');
  }

  if (!LOCAL_DATABASE_HOSTS.has(hostname)) {
    throw new Error(
      `Refusing to connect to non-local database host "${hostname}" while NODE_ENV=development. ` +
        'Use the local PostgreSQL database instead.',
    );
  }
}
