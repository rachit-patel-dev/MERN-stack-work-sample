// Initialize
import * as chai from 'chai';
import * as request from 'supertest';
import * as dirtyChai from 'dirty-chai';
import * as chaiChange from 'chai-change';
import { Container } from 'src/container';
import { Server } from 'src/server'; // Assuming this is your server module/interface
import { Config } from 'src/config'; // Assuming this is your configuration module/interface
import { Logger } from 'src/logger'; // Assuming this is your logger module/interface
import { Database } from 'src/database'; // Assuming this is your database module/interface
import { DbHandler } from './support/dbHandler'; // Assuming this is your database handler module/interface
import { MockUser } from './support/mocking'; // Assuming this is your mocking module/interface

const container: Container = require('src/container');
const server: Server = container.resolve<Server>('server');
const config: Config = container.resolve<Config>('config');
const logger: Logger = container.resolve<Logger>('logger');
const database: Database = container.resolve<Database>('database');
const dbHandler: DbHandler = require('./support/dbHandler');
const mockUser: MockUser = require('./support/mocking');

import { expect, assert } from 'chai';

logger.transports.forEach((t: any) => (t.silent = true));
chai.use(dirtyChai);
chai.use(chaiChange);
(global as any).app = container;
(global as any).request = request(server.app);
(global as any).config = config;
(global as any).dbReset = dbHandler(database).resetDb;
(global as any).mocking = mockUser(container, config);
(global as any).expect = expect;
(global as any).assert = assert;
(global as any).BASE_URI = `/api/${config.version}`;
