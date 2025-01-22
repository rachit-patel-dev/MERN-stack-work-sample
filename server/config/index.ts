import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

interface DbConfig {
  [key: string]: any; // Adjust the type according to your database configuration
}

interface EnvConfig {
  [key: string]: any; // Adjust the type according to your environment configuration
}
/**
 * Loads the database configuration based on the current environment.
 * 
 * @returns {DbConfig} The database configuration object.
 * @throws {Error} If the database configuration file is not found or if the configuration for the current environment is missing.
 */
function loadDbConfig(): DbConfig {
  const ENV = process.env.NODE_ENV || 'development';
  const dbFilePath = path.join(__dirname, './database.ts');
  
  if (fs.existsSync(dbFilePath)) {
    const dbConfig = require(dbFilePath)[ENV];
    if (dbConfig) {
      return dbConfig;
    }
  }

  throw new Error('Database configuration is required');
}

const ENV = process.env.NODE_ENV || 'development';
const envConfigPath = path.join(__dirname, 'environments', ENV);
const envConfig: EnvConfig = require(envConfigPath);
const dbConfig: DbConfig = loadDbConfig();

const config = Object.assign({
  env: ENV,
  db: dbConfig,
}, envConfig);

export default config;
