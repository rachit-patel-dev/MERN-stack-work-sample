import { Cradle } from 'src/container'; // Adjust this import based on your container setup
import { tokenPost } from 'src/app/token';
import { post, put } from 'src/app/user';
/**
 * Initializes the use cases for the application.
 * 
 * @returns {any} The initialized use cases.
 */
const initializeUseCases = (): any => { // Adjust the return type according to your use case types
  const { repository: { userRepository, bureauRepository }, sendGrid, config, logger, jwt } = container.cradle as Cradle; // Adjust Cradle type according to your container setup
  const serializer = container.resolve('serializer');

  const tokenPostUseCase = tokenPost({
    userRepository,
    webToken: jwt,
    config,
    logger,
    serializer,
    bureauRepository
  });

  const postUseCase = post({
    userRepository,
    sendGrid,
    config,
    logger,
    webToken: jwt,
    serializer,
    bureauRepository
  });

  const putUseCase = put({
    userRepository,
    logger,
    serializer
  });

  return {
    tokenPostUseCase,
    postUseCase,
    putUseCase
  };
};

export default initializeUseCases;
