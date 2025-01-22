import fs from 'fs';
import winston from 'winston';

interface Config {
  logging: {
    level: string;
    // Add other logging configuration properties if needed
  };
  env: string;
  // Add other config properties if needed
}

export default ({ config }: { config: Config }) => {
  if (!fs.existsSync(`logs`)) {
    fs.mkdirSync(`logs`);
  }

  return winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File(Object.assign(
        config.logging, {
          filename: `logs/${config.env}.log`
        }))
    ]
  });
};
