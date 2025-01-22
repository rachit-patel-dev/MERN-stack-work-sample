import { Model, Document, Types } from 'mongoose';
import { Logger } from '../types/logger';
import { BureauRepository } from '../types/repository';
import { Config } from '../types/config';
import UserModel, { User } from '../../models/User'; // Adjust this import according to your project structure

interface Bureau extends Document {
  ID: string;
  user: User['_id'];
  isActive: boolean;
}
/**
 * Removes a bureau by its ID.
 * 
 * @param {string} ID - The ID of the bureau to be removed.
 * @returns {Promise<{ data: {}, message: string }>} - A promise that resolves to an object with an empty data property and a success message.
 * @throws {Error} - If the bureau is not found or an error occurs during the removal process.
 */
module.exports = ({ bureauRepository, config, logger }: {
  bureauRepository: BureauRepository,
  config: Config,
  logger: Logger
}) => {
  const remove = async ({ ID }: { ID: string }) => {
    const session = await bureauRepository.startSession();

    try {
      session.startTransaction();

      const bureauObj = await bureauRepository.findOne({ ID }).populate('user').session(session);

      if (!bureauObj) {
        throw new Error('Bureau not found');
      }

      const user = bureauObj.user;
      user.isActive = false;
      bureauObj.isActive = false;

      await Promise.all([user.save(), bureauObj.save()]);
      
      await session.commitTransaction();

      session.endSession();

      return { data: {}, message: config.messages.success.bureauDelete };
    } catch (error) {
      await session.abortTransaction();
      session.endSession();

      logger.error(error.message);
      const errorMessage = config.messages.error.bureauDelete;
      throw new Error(errorMessage);
    }
  };

  return {
    remove,
  };
};
