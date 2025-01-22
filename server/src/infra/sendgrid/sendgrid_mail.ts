import sgMail, { MailDataRequired } from '@sendgrid/mail';

interface Config {
  sendGridSenderID: string;
  sendGridOtpTemplate: string;
  sendGridApiKey: string;
  enableSendGrid: boolean;
}

interface Logger {
  info: (message: string | Error) => void;
}

interface MailService {
  sendMail: (msg: MailDataRequired) => void;
}

export default ({ config, logger }: { config: Config; logger: Logger }): MailService => ({
  sendMail: (msg: MailDataRequired) => {
    msg.from = config.sendGridSenderID;
    msg.templateId = config.sendGridOtpTemplate;
    msg.from = config.sendGridSenderID;
    sgMail.setApiKey(config.sendGridApiKey);
    if (config.enableSendGrid) {
      sgMail
        .send(msg)
        .then(() => {
          logger.info(`Mail sent successfully for otp to ${msg.to}`);
        })
        .catch(error => {
          logger.info(error);
        });
    } else {
      logger.info(msg);
    }
  }
});
