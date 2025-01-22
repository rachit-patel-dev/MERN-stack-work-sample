import { Cradle } from 'src/container'; // Adjust this import based on your container setup
import router from './router';
import instance from './instance';

interface AppInfo {
  app: any; // Adjust the type of 'app' according to your application setup
  router: any; // Adjust the type of 'router' according to your application setup
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
const initializeApp = (): AppInfo => {
  const { logger, response: { Success, Fail }, auth } = container.cradle as Cradle; // Adjust Cradle type according to your container setup
  const app = instance();

  return {
    app,
    router: router({ logger, auth, response: { Success, Fail }, ...app })
  };
};

export default initializeApp;
