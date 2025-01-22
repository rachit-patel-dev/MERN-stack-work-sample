import { createContainer, asClass, asValue, asFunction } from 'awilix';
import app from './app';
import server from './interfaces/http/server';
import router from './interfaces/http/router';
import auth from './interfaces/http/auth';
import config from '../config';
import logger from './infra/logging/logger';
import jwt from './infra/jwt';
import sendGrid from './infra/sendgrid/sendgrid_mail';
import Serializer from './infra/serializer/serializer';
import response from './infra/support/response';
import date from './infra/support/date';
import repository from './infra/repositories';

const container = createContainer();

// SYSTEM
container.register({
  app: asFunction(app).singleton(),
  server: asFunction(server).singleton(),
  router: asFunction(router).singleton(),
  logger: asFunction(logger).singleton(),
  auth: asFunction(auth).singleton(),
  jwt: asFunction(jwt).singleton(),
  sendGrid: asFunction(sendGrid).singleton(),
  response: asFunction(response).singleton(),
  date: asFunction(date).singleton(),
  config: asValue(config),
  repository: asFunction(repository).singleton(),
  serializer: asClass(Serializer).singleton(),
});

export default container;
