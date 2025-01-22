import { Request, Response, NextFunction } from 'express'; // Assuming you're using Express
import { Status } from 'http-status'; // Assuming you're using http-status package
/**
 * Handles errors and sends an appropriate response.
 * 
 * @param err - The error object.
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function.
 * @param logger - The logger object.
 * @param config - The configuration object.
 */
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction, logger: any, config: any) => {
  logger.error(err.message);

  const response: Record<string, any> = {
    type: 'InternalServerError'
  };

  if (config.env === 'development') {
    response.message = err.message;
    response.stack = err.stack;
  }

  res.status(Status.INTERNAL_SERVER_ERROR).json(response);
};

export default errorHandler;
