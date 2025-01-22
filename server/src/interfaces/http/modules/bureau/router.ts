import { Request, Response } from 'express';
import { Router } from 'express';
import { Status } from 'http-status';

interface UseCases {
  getUseCase: any; // Adjust the type according to your use case
  postUseCase: any; // Adjust the type according to your use case
  putUseCase: any; // Adjust the type according to your use case
  deleteUseCase: any; // Adjust the type according to your use case
  logger: any; // Adjust the type according to your logger implementation
  auth: any; // Adjust the type according to your authentication implementation
  uploader: any; // Adjust the type according to your uploader implementation
  config: any; // Adjust the type according to your configuration implementation
  response: {
    Success: any; // Adjust the type according to your response formatting
    Fail: any; // Adjust the type according to your response formatting
  };
}
/**
 * Creates a router for handling bureau routes.
 *
 * @param {UseCases} options - The use cases and dependencies needed for the router.
 * @returns {Router} The router for handling bureau routes.
 */
const bureauRoutes = ({
  getUseCase,
  postUseCase,
  putUseCase,
  deleteUseCase,
  logger,
  auth,
  uploader,
  config,
  response: { Success, Fail }
}: UseCases): Router => {
  const router = Router();

  router.use(auth.tokenAuthenticate, auth.isAdminAuthenticate);

  router.get('/', async (req: Request, res: Response) => {
    try {
      const result = await getUseCase.all(req);
      res.status(Status.OK).json(Success(result.data, result.message, true, result.paginateMeta));
    } catch (error) {
      logger.error(error);
      res.status(Status.BAD_REQUEST).json(Fail({}, error.message));
    }
  });

  router.get('/:id', async (req: Request, res: Response) => {
    try {
      const result = await getUseCase.getById({ ID: req.params.id });
      res.status(Status.OK).json(Success(result.data, result.message));
    } catch (error) {
      logger.error(error);
      res.status(Status.BAD_REQUEST).json(Fail({}, error.message));
    }
  });

  router.post('/', uploader(config.mediaRoot + '/media/csv').single('SampleFile'), async (req: Request, res: Response) => {
    try {
      const result = await postUseCase.create({ body: req.body, SampleFile: req.file });
      res.status(Status.OK).json(Success(result.data, result.message));
    } catch (error) {
      logger.error(error);
      res.status(Status.BAD_REQUEST).json(Fail({}, error.message));
    }
  });

  router.post('/:id/status-change', async (req: Request, res: Response) => {
    try {
      const result = await postUseCase.statusChange({ body: req.body, id: req.params.id });
      res.status(Status.OK).json(Success(result.data, result.message));
    } catch (error) {
      logger.error(error);
      res.status(Status.BAD_REQUEST).json(Fail({}, error.message));
    }
  });

  router.post('/:id/invite', async (req: Request, res: Response) => {
    try {
      const result = await postUseCase.inviteBureau({ ID: req.params.id });
      res.status(Status.OK).json(Success(result.data, result.message));
    } catch (error) {
      logger.error(error);
      res.status(Status.BAD_REQUEST).json(Fail({}, error.message));
    }
  });

  router.put('/:id', uploader(config.mediaRoot + '/media/csv').single('SampleFile'), async (req: Request, res: Response) => {
    try {
      const result = await putUseCase.update({ ID: req.params.id, body: req.body, SampleFile: req.file });
      res.status(Status.OK).json(Success(result.data, result.message));
    } catch (error) {
      logger.error(error);
      res.status(Status.BAD_REQUEST).json(Fail({}, error.message));
    }
  });

  router.delete('/:id', async (req: Request, res: Response) => {
    try {
      const result = await deleteUseCase.remove({ ID: req.params.id });
      res.status(Status.OK).json(Success(result.data, result.message));
    } catch (error) {
      logger.error(error);
      res.status(Status.BAD_REQUEST).json(Fail({}, error.message));
    }
  });

  return router;
};

export default bureauRoutes;
