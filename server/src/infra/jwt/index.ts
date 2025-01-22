import jwt from 'jsonwebtoken';
import { compose, trim, replace, partialRight } from 'ramda';

interface Config {
  expirationTime: string;
  authSecret: string;
  // Add other config properties if needed
}

interface Logger {
  info: (message: string) => void;
  // Add other logger methods if needed
}

interface AuthModule {
  signin: (options: any) => (payload: any) => string;
  verify: (options: any) => (token: string) => any;
  decode: (options: any) => (token: string) => any;
}

export default ({ config, logger }: { config: Config; logger: Logger }): AuthModule => ({
  signin: (options: any) => (payload: any) => {
    const opt = { ...options, expiresIn: config.expirationTime };
    logger.info(`User ${payload.email} generated a new token`);
    return jwt.sign(payload, config.authSecret, opt);
  },
  verify: (options: any) => (token: string) => {
    const cleanedToken = token.replace(/JWT|jwt/g, '').replace(' ', '');
    return jwt.verify(cleanedToken, config.authSecret);
  },
  decode: (options: any) => (token: string) => {
    const opt = { expiresIn: config.expirationTime };
    const decodeToken = compose(
      partialRight(jwt.decode, [opt]),
      trim,
      replace(/JWT|jwt/g, '')
    );
    return decodeToken(token);
  }
});
