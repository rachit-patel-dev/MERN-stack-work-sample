import { messages } from '../messages';

interface AppConfig {
  version: string | undefined;
  port: number;
  timezone: string | undefined;
  logging: {
    maxsize: number;
    maxFiles: number;
    colorize: boolean;
  };
  authSecret: string | undefined;
  expirationTime: string | undefined;
  authSession: {
    session: boolean;
  };
  sendGridApiKey: string | undefined;
  sendGridSenderID: string | undefined;
  sendGridOtpTemplate: string | undefined;
  enableSendGrid: boolean;
  clientHost: string | undefined;
  passwordResetExpirationTime: number;
  passwordChangeUseCase: string | undefined;
  pageSize: number;
  messages: any; // Adjust the type according to the type of 'messages'
  employerFileName: string | undefined;
}

const config: AppConfig = {
  version: process.env.APP_VERSION,
  port: parseInt(process.env.PORT || '4000'),
  timezone: process.env.TIMEZONE,
  logging: {
    maxsize: 100 * 1024, // 100mb
    maxFiles: 2,
    colorize: false,
  },
  authSecret: process.env.SECRET,
  expirationTime: process.env.TOKEN_EXPIRATION_TIME,
  authSession: {
    session: false,
  },
  sendGridApiKey: process.env.SENDGRID_API_KEY,
  sendGridSenderID: process.env.SENDER_ID,
  sendGridOtpTemplate: process.env.SENDGRID_SEND_OTP,
  enableSendGrid: process.env.ENABLE_SENDGRID ? JSON.parse(process.env.ENABLE_SENDGRID) : false,
  clientHost: process.env.CLIENT_HOST,
  passwordResetExpirationTime: parseInt(process.env.PASSWORD_RESET_EXPIRATION_TIME || '0'),
  passwordChangeUseCase: process.env.PASSWORD_CHANGE_USE_CASE,
  pageSize: parseInt(process.env.PAGE_SIZE || '0'),
  messages: messages,
  employerFileName: process.env.EMPLOYER_FILE_NAME,
};

export default config;
