import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { csvToArray } from '../../infra/utils/csv_to_json_generator';
import { generateRandomString } from '../../infra/utils/random_string_generator';
import { saveFileToBlobStorage } from '../../infra/azureStorage/azureBlobConfig';
import { BureauCreateSerializer } from 'src/domain/bureau';

interface UserRepository {
  create(userData: any): Promise<any>;
}

interface SourceFileRepository {
  create(fileData: any): Promise<any>;
}

interface SourceFieldRepository {
  bulkCreate(SampleFileData: any[], fileId: Types.ObjectId): Promise<any>;
}

interface SendGrid {
  sendMail(msg: any): void;
}

interface Serializer {
  serialize(jsonBody: any, BureauCreateSerializer: any): Promise<any>;
}

interface Config {
  enableAzure: boolean;
  messages: {
    error: {
      csvFormatError: string;
      addBureau: string;
    };
    success: {
      addBureau: string;
    };
  };
  authSecret: string;
  clientHost: string;
  passwordChangeUseCase: string;
  passwordResetExpirationTime: number;
}
/**
 * Creates a new bureau and performs necessary operations.
 * 
 * @param {Object} params - The parameters for creating a new bureau.
 * @param {Object} params.body - The body of the request containing bureau data.
 * @param {Object} params.SampleFile - The sample file associated with the bureau.
 * @returns {Object} - The result of the create operation.
 * @throws {Object} - An error object if the create operation fails.
 */
export default ({ bureauRepository, userRepository, sourceFileRepository, sourceFieldRepository, config, logger, sendGrid, serializer }: {
  bureauRepository: any,
  userRepository: UserRepository,
  sourceFileRepository: SourceFileRepository,
  sourceFieldRepository: SourceFieldRepository,
  config: Config,
  logger: any,
  sendGrid: SendGrid,
  serializer: Serializer
}) => {
  const create = async ({ body, SampleFile }: { body: any; SampleFile: any }) => {
    const session = await bureauRepository.startSession();
    session.startTransaction();

    try {
      let jsonBody = { ...body };
      const bureau = await serializer.serialize(jsonBody, BureauCreateSerializer);
      const userData = {
        Email: bureau.Email,
        Password: generateRandomString(10),
        LegalName: bureau.LegalName,
        Type: "BUREAU"
      };
      delete bureau.Email;
      delete bureau.LegalName;

      const userObj = await userRepository.create(userData);
      bureau.UsersID = userObj._id;
      bureau.Status = "Pending";

      const bureauObj = await bureauRepository.create(bureau, { session });

      if (SampleFile) {
        if (SampleFile.originalname.split('.').slice(-1)[0] == 'csv') {
          let fileData: any = {
            BureausID: bureauObj._id,
            FileName: config.enableAzure ? `${SampleFile.originalname.split('.')[0]}-${new Date().getTime()}.${SampleFile.originalname.split('.').slice(-1)[0]}` : SampleFile.filename,
            UploadedBy: userData.Type
          };

          if (config.enableAzure) {
            const FileUrl = await saveFileToBlobStorage({
              originalname: fileData.FileName,
              buffer: SampleFile.buffer,
              size: SampleFile.size
            });

            if (FileUrl) {
              fileData.FileName = FileUrl;
            }
          }

          let SampleFileData: any = config.enableAzure ? await csvToArray(SampleFile.buffer, config.enableAzure) : await csvToArray(fileData.FileName);

          SampleFileData = SampleFileData.map((name: string, index: number) => {
            return {
              SourceFieldName: name,
              ReferenceNumber: index + 1
            };
          });

          await sourceFieldRepository.bulkCreate(SampleFileData, bureauObj._id, { session });
        } else {
          throw Error(config.messages.error.csvFormatError);
        }
      }

      await session.commitTransaction();

      const message = config.messages.success.addBureau;
      const payLoad = {
        ID: userObj._id,
        Email: userObj.Email,
        Type: userObj.Type,
        useCase: config.passwordChangeUseCase,
        exp: Math.floor(Date.now() / 1000) + 60 * config.passwordResetExpirationTime
      };
      
      const token = jwt.sign(payLoad, config.authSecret);
      let randomUrl = `${config.clientHost}/reset-password?token=${token}`;
      const sendMail = sendGrid.sendMail;

      let msg = {
        to: userObj.Email,
        dynamic_template_data: {
          subject: "Create Password",
          LegalName: userObj.LegalName,
          passwordResetUrl: encodeURI(randomUrl),
          time: config.passwordResetExpirationTime,
          procedure_name: "create password"
        },
      };
      
      sendMail(msg);
      return { data: {}, message };
    } catch (err) {
      await session.abortTransaction();
      logger.error(err.message);
      const data = {};
      const error = config.messages.error.addBureau;
      throw { data, error };
    } finally {
      session.endSession();
    }
  };

  return {
    create
  };
};
