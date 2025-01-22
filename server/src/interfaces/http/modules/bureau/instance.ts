import { Cradle } from 'src/container'; // Adjust this import based on your container setup
import { get, post, put, remove } from 'src/app/bureau';
import { uploader } from '../../../../infra/storage/storage';
/**
 * Initializes the use cases for the application.
 * 
 * @returns {Object} The initialized use cases.
 * - getUseCase: The use case for retrieving data.
 * - postUseCase: The use case for creating data.
 * - putUseCase: The use case for updating data.
 * - deleteUseCase: The use case for deleting data.
 * - uploader: The function for uploading files.
 * - config: The application configuration.
 */
const initializeUseCases = (): any => { // Adjust the return type according to your use case types
  const { repository: { bureauRepository, userRepository, sourceFileRepository, sourceFieldRepository }, config, logger, sendGrid } = container.cradle as Cradle; // Adjust Cradle type according to your container setup
  const serializer = container.resolve('serializer');

  const getUseCase = get({ bureauRepository, sourceFileRepository, config, logger });
  const postUseCase = post({ bureauRepository, userRepository, sourceFileRepository, sourceFieldRepository, config, logger, sendGrid, serializer });
  const putUseCase = put({ bureauRepository, sourceFileRepository, sourceFieldRepository, serializer, config, logger });
  const deleteUseCase = remove({ bureauRepository, serializer, config, logger });

  return {
    getUseCase,
    postUseCase,
    putUseCase,
    deleteUseCase,
    uploader,
    config
  };
};

export default initializeUseCases;
