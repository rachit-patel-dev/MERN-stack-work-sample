import { Request, Response } from 'express';
import { Router } from 'express';
import { Status } from 'http-status';

interface UseCases {
  tokenPostUseCase: any; // Adjust the type according to your use case
  postUseCase: any; // Adjust the type according to your use case
  logger: any; // Adjust the type according to your logger implementation
  auth: any; // Adjust the type according to your authentication implementation
  response: {
    Success: any; // Adjust the type according to your response formatting
    Fail: any; // Adjust the type according to your response formatting
  };
}
/**
 * Creates an Express router with authentication routes.
 *
 * @param {UseCases} options - The options object containing the necessary use cases, logger, authentication implementation, and response formatting.
 * @param {any} options.tokenPostUseCase - The use case for validating a token.
 * @param {any} options.postUseCase - The use case for handling a post request.
 * @param {any} options.logger - The logger implementation.
 * @param {any} options.auth - The authentication implementation.
 * @param {object} options.response - The response formatting options.
 * @param {any} options.response.Success - The success response formatting.
 * @param {any} options.response.Fail - The failure response formatting.
 * @returns {Router} The Express router with authentication routes.
 */
const authenticationRoutes = ({
  tokenPostUseCase,
  postUseCase,
  logger,
  auth,
  response: { Success, Fail },
}: UseCases): Router => {
  const router = Router();

  router.post('/login', async (req: Request, res: Response) => {
    try {
      const result = await tokenPostUseCase.validate({ body: req.body });
      res.status(Status.OK).json(Success(result.data, result.message));
    } catch (error) {
      logger.error(error);
      res.status(Status.BAD_REQUEST).json(Fail(null, error.message));
    }
  });

  return router;
};

export default authenticationRoutes;
