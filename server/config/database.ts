import path from 'path';
import dotenv from 'dotenv';

const dotEnvPath = path.resolve('.env');

/**
 * Since Mocha doesn't see environment variables we have to use dotenv
 */
dotenv.config({ path: dotEnvPath });

interface DbConfig {
  dialect: string;
  database: string;
  host: string;
  password: string;
  username: string;
  port: string;
  logging?: boolean;
  ssl?: boolean;
  dialectOptions?: {
    ssl: {
      require: boolean;
    };
  };
}

interface Config {
  [key: string]: DbConfig;
}

const config: Config = {
  development: {
    dialect: process.env.DIALECT || '',
    database: process.env.DB_NAME || '',
    host: process.env.DB_HOST || '',
    password: process.env.DB_PASSWORD || '',
    username: process.env.DB_USER || '',
    port: process.env.DB_PORT || '',
  },
  test: {
    dialect: process.env.DIALECT || '',
    database: process.env.TEST_DB || '',
    host: process.env.DB_HOST || '',
    password: process.env.DB_PASSWORD || '',
    username: process.env.DB_USER || '',
    port: process.env.DB_PORT || '',
    logging: false, // remove logs
  },
};

export default config;
