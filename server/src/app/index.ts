import mongoose from 'mongoose';

interface Server {
  start(): void;
}

interface Config {
  db: {
    database: string;
    username: string;
    password: string;
    host: string;
    port: string;
  };
}

interface Logger {
  info(message: string): void;
  error(message: string, error?: any): void;
}
/**
 * Connects to MongoDB using the provided configuration and starts the server.
 *
 * @param {Object} options - The options object.
 * @param {Server} options.server - The server object with a start method.
 * @param {Config} options.config - The configuration object with database details.
 * @param {Logger} options.logger - The logger object with info and error methods.
 * @returns {Object} - An object with a start method that starts the server.
 */
export default ({ server, config, logger }: {
  server: Server,
  config: Config,
  logger: Logger
}) => {
  // MongoDB connection string
  const connectionString = `mongodb://${config.db.host}:${config.db.port}/${config.db.database}`;

  // Connect to MongoDB
  mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    auth: {
      user: config.db.username,
      password: config.db.password
    }
  })
  .then(() => {
    logger.info(`Connected to MongoDB database ${config.db.database}`);
  })
  .catch((error) => {
    logger.error(`Error connecting to MongoDB: ${error}`);
  });

  return {
    start: () => server.start()
  };
};
