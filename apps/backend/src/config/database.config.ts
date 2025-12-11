/**
 * Database configuration for development and production environments
 * Uses PostgreSQL via Prisma ORM
 */
export const databaseConfig = (): any => ({
  prisma: {
    isGlobal: true,
  },
});

/**
 * Get database URL from environment variables
 */
export const getDatabaseUrl = (): string => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL environment variable is not set');
  }
  return process.env.DATABASE_URL;
};

export const POSTGRES_CONFIG = {
  POOL_SIZE: parseInt(process.env.DB_POOL_SIZE || '10'),
  IDLE_TIMEOUT: parseInt(process.env.DB_IDLE_TIMEOUT || '10000'),
  CONNECTION_TIMEOUT: parseInt(process.env.DB_CONNECTION_TIMEOUT || '2000'),
};
