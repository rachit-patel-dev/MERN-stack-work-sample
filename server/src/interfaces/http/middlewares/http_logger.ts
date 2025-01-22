import morgan, { StreamOptions } from 'morgan';
/**
 * Middleware function that returns a Morgan logger middleware with a custom stream option.
 * 
 * @param logger - The logger object to use for logging.
 * @returns The Morgan logger middleware with the custom stream option.
 */
const morganMiddleware = (logger: any) => {
  const stream: StreamOptions = {
    write: (message: string) => {
      logger.info(message.slice(0, -1));
    }
  };

  return morgan('common', { stream });
};

export default morganMiddleware;
