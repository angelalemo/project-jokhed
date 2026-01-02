import { Pool } from 'pg';

export const databaseConfig = {
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
  database: process.env.DB_NAME || 'peopledatabase',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
};

export const createDatabasePool = () => {
  return new Pool(databaseConfig);
};
