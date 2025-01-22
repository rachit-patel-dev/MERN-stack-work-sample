import { Types } from 'mongoose';
import { csvToArray } from '../../infra/utils/csv_to_json_generator';
import { saveFileToBlobStorage } from '../../infra/azureStorage/azureBlobConfig';
import database from '../../infra/database';
import { BureauUpdateSerializer } from 'src/domain/bureau';

interface Serializer {
  serialize(jsonBody: any, BureauUpdateSerializer: any): Promise<any>;
}

interface Config {
  enableAzure: boolean;
  messages: {
    error: {
      editBureau: string;
    };
    success: {
      editBureau: string;
    };
  };
}

interface SourceFileRepository {
  getAll(query: any): Promise<any>;
  create(fileData: any): Promise<any>;
}

interface SourceFieldRepository {
  bulkCreate(SampleFileData: any[], fileId: Types.ObjectId): Promise<any>;
}

interface Logger {
  error(message: string): void;
}
/**
 * Updates a bureau with the given ID.
 * 
 * @param {number} ID - The ID of the bureau to update.
 * @param {any} body - The updated data for the bureau.
 * @param {any} SampleFile - The file to upload for the bureau.
 * @returns {Promise<{ data: any, message: string }>} - A promise that resolves to an object containing the updated data and a success message.
 * @throws {Error} - If there is an error updating the bureau.
 */
export default ({ bureauRepository, serializer, config, sourceFileRepository, sourceFieldRepository, logger }: {
  bureauRepository: any,
  serializer: Serializer,
  config: Config,
  sourceFileRepository: SourceFileRepository,
  sourceFieldRepository: SourceFieldRepository,
  logger: Logger
}) => {
  const update = async ({ ID, body, SampleFile }: { ID: number, body: any, SampleFile: any }) => {
    const session = await bureauRepository.startSession();
    session.startTransaction();

    try {
      let jsonBody = { ...body };
      const bureau = await serializer.serialize(jsonBody, BureauUpdateSerializer);

      try {
        await bureauRepository.findByIdAndUpdate(ID, bureau, { session });

        if (bureau.LegalName) {
          const bureauObj = await bureauRepository.findById(ID).populate('users');
          bureauObj.users.LegalName = bureau.LegalName;
          await bureauObj.users.save();
        }

        let data: any = { ...bureau };

        if (SampleFile) {
          if (SampleFile.originalname.split('.').slice(-1)[0] == 'csv') {
            const sourceFileData = {
              BureausID: ID,
              FileName: config.enableAzure ? `${SampleFile.originalname.split('.')[0]}-${new Date().getTime()}.${SampleFile.originalname.split('.').slice(-1)[0]}` : SampleFile.filename,
              UploadedBy: "BUREAU"
            };

            if (config.enableAzure) {
              const FileUrl = await saveFileToBlobStorage({
                originalname: sourceFileData.FileName,
                buffer: SampleFile.buffer,
                size: SampleFile.size
              });

              if (FileUrl) {
                sourceFileData.FileName = FileUrl;
              }
            }

            data = { ...data, SampleFile: !config.enableAzure ? SampleFile.filename : sourceFileData.FileName };

            let sourceFilQueryset = await sourceFileRepository.getAll({
              where: {
                UploadedBy: "BUREAU",
                IsActive: 1,
                BureausID: ID
              },
              attributes: ['_id']
            }).map((obj: any) => obj._id);

            await sourceFileRepository.updateMany({ BureausID: ID, IsActive: 1 }, { IsActive: 0 }, { session });

            await sourceFieldRepository.updateMany({ FilesID: { $in: sourceFilQueryset } }, { IsActive: 0 }, { session });

            let SampleFileData: any = config.enableAzure ? await csvToArray(SampleFile.buffer, config.enableAzure) : await csvToArray(sourceFileData.FileName);
            SampleFileData = SampleFileData.map((name: string, index: number) => {
              return {
                SourceFieldName: name,
                ReferenceNumber: index + 1
              };
            });

            const sourceFile = await sourceFileRepository.create(sourceFileData, { session });
            await sourceFieldRepository.bulkCreate(SampleFileData, sourceFile._id, { session });
          } else {
            throw Error(config.messages.error.editBureau);
          }
        }

        const message = config.messages.success.editBureau;
        await session.commitTransaction();
        session.endSession();
        return { data, message };
      } catch (err) {
        await session.abortTransaction();
        session.endSession();
        logger.error(err.message);
        const data = {};
        const error = config.messages.error.editBureau;
        throw { data, error };
      }
    } catch (err) {
      session.endSession();
      logger.error(err.message);
      const data = {};
      const error = config.messages.error.editBureau;
      throw { data, error };
    }
  };

  return {
    update
  };
};
