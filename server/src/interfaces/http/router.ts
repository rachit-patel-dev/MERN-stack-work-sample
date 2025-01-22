import statusMonitor from 'express-status-monitor';
import cors from 'cors';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { Router } from 'express';
import { partialRight } from 'ramda';
import controller from './utils/create_controller';
import httpLogger from './middlewares/http_logger';
import errorHandler from './middlewares/error_handler';

interface Config {
  env: string;
  version: string;
}

interface Logger {
  // Define the methods or properties of your logger according to your implementation
}

export default function AppRoutes({ config, logger }: { config: Config; logger: Logger }) {
  const router = Router();

  /* istanbul ignore if */
  if (config.env === 'development') {
    router.use(statusMonitor());
  }

  /* istanbul ignore if */
  if (config.env !== 'test') {
    router.use(httpLogger(logger));
  }

  const apiRouter = Router();
  apiRouter
    .use(
      cors({
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
      })
    )
    .use(bodyParser.json())
    .use(compression())
    .use(cookieParser());

  /*
   * Add your API routes here
   *
   * You can use the `controller` helper like this:
   * apiRouter.use('/users', controller(controllerPath))
   *
   * The `controllerPath` is relative to the `interfaces/http` folder
   */

  // For use of swagger only
  apiRouter.use('/', controller('index'));
  apiRouter.use('/', controller('auth').router);
  apiRouter.use('/user', controller('user').router);
  apiRouter.use('/bureau', controller('bureau').router);
  apiRouter.use('/employer', controller('employer').router);
  apiRouter.use('/provider-plan', controller('providerPlan').router);
  apiRouter.use('/provider', controller('provider').router);
  apiRouter.use('/dashboard', controller('dashboard').router);

  router.use(`/api/${config.version}`, apiRouter);
  router.use(partialRight(errorHandler, [logger, config]));

  return router;
}
