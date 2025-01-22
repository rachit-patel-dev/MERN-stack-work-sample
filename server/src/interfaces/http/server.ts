import express, { Express } from 'express';

interface Config {
  port: number;
  mediaRoot: string;
}

interface Logger {
  info(message: string): void; // Define the methods or properties of your logger according to your implementation
}

interface Auth {
  initialize(): any; // Define the methods or properties of your auth middleware according to your implementation
}

interface SendGrid {
  // Define the methods or properties of your SendGrid service according to your implementation
}
/**
 * Creates an Express application with the provided configuration and middleware.
 * 
 * @param {Object} options - The options for creating the application.
 * @param {Config} options.config - The configuration object for the application.
 * @param {Express.Router} options.router - The router object for the application.
 * @param {Logger} options.logger - The logger object for the application.
 * @param {Auth} options.auth - The authentication middleware for the application.
 * @param {SendGrid} options.sendGrid - The SendGrid service for the application.
 * @returns {Object} - An object containing the Express application and a start function.
 * @returns {Express} app - The Express application.
 * @returns {Function} start - A function that starts the application and returns a promise that resolves when the application is started.
 */
export default function createApp({ config, router, logger, auth, sendGrid }: { config: Config; router: Express.Router; logger: Logger; auth: Auth; sendGrid: SendGrid }) {
  const app = express();

  app.disable('x-powered-by');
  // app.use(auth.initialize());
  app.use(router);

  // Define the static folder
  app.use(express.static(config.mediaRoot));

  return {
    app,
    start: () => new Promise<void>((resolve) => {
      const http = app.listen(config.port, () => {
        const { port } = http.address() as any;
        logger.info(`API - Port ${port}`);
        resolve();
      });
    }),
  };
}
