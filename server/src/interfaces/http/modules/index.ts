import { Router, Request, Response } from 'express';
import { Status } from 'http-status';

interface Bureau {
  id: string;
  name: string;
  address: string;
  contact: string;
  tin: string;
  sss: string;
  philhealth: string;
  isDeleted: number;
  createdBy: string;
}

interface SuccessResponse<T> {
  data: T;
  message: string;
  success: boolean;
  paginateMeta?: any; // Adjust this type based on your actual pagination metadata
}

interface FailResponse {
  data: any;
  error: string;
}

interface PostUseCase {
  create(data: any): Promise<SuccessResponse<Bureau> | FailResponse>;
  statusChange(data: any): Promise<SuccessResponse<Bureau> | FailResponse>;
  inviteBureau(data: any): Promise<SuccessResponse<Bureau> | FailResponse>;
}

interface PutUseCase {
  update(data: any): Promise<SuccessResponse<Bureau> | FailResponse>;
}

interface DeleteUseCase {
  remove(data: any): Promise<SuccessResponse<Bureau> | FailResponse>;
}

interface AuthMiddleware {
  tokenAuthenticate(req: Request, res: Response, next: Function): void;
  isAdminAuthenticate(req: Request, res: Response, next: Function): void;
}

interface Logger {
  error(error: any): void;
}

interface Uploader {
  single(field: string): any; // Adjust this based on your actual uploader middleware
}

interface Config {
  mediaRoot: string;
}
/**
 * Creates an Express router with various routes and middleware.
 * 
 * @param {Object} options - The options for configuring the router.
 * @param {any} options.getUseCase - The use case for handling GET requests.
 * @param {PostUseCase} options.postUseCase - The use case for handling POST requests.
 * @param {PutUseCase} options.putUseCase - The use case for handling PUT requests.
 * @param {DeleteUseCase} options.deleteUseCase - The use case for handling DELETE requests.
 * @param {Logger} options.logger - The logger for logging errors.
 * @param {AuthMiddleware} options.auth - The middleware for authentication.
 * @param {Uploader} options.uploader - The uploader for handling file uploads.
 * @param {Config} options.config - The configuration options.
 * @returns {Router} The Express router with the configured routes and middleware.
 */
export default function ({
  getUseCase,
  postUseCase,
  putUseCase,
  deleteUseCase,
  logger,
  auth,
  uploader,
  config,
}: {
  getUseCase: any; // Define types for getUseCase according to your implementation
  postUseCase: PostUseCase;
  putUseCase: PutUseCase;
  deleteUseCase: DeleteUseCase;
  logger: Logger;
  auth: AuthMiddleware;
  uploader: Uploader;
  config: Config;
}) {
  const router = Router();

  router.use(auth.tokenAuthenticate, auth.isAdminAuthenticate);

  router.get('/', (req: Request, res: Response) => {
    getUseCase
      .all(req)
      .then((result: any) => {
        res.status(Status.OK).json({
          data: result.data,
          message: result.message,
          success: true,
          paginateMeta: result.paginateMeta,
        });
      })
      .catch((error: any) => {
        logger.error(error);
        res.status(Status.BAD_REQUEST).json({
          data: {},
          error: error.message,
        });
      });
  });

  router.get('/:id', (req: Request, res: Response) => {
    getUseCase
      .getById({ ID: req.params.id })
      .then((result: any) => {
        res.status(Status.OK).json({
          data: result.data,
          message: result.message,
        });
      })
      .catch((error: any) => {
        logger.error(error);
        res.status(Status.BAD_REQUEST).json({
          data: result.data,
          error: result.error,
        });
      });
  });

  router.post('/', uploader(config.mediaRoot + '/media/csv').single('SampleFile'), (req: Request, res: Response) => {
    postUseCase
      .create({ body: req.body, SampleFile: req.file })
      .then((result: any) => {
        res.status(Status.OK).json({
          data: result.data,
          message: result.message,
        });
      })
      .catch((result: any) => {
        res.status(Status.BAD_REQUEST).json({
          data: result.data,
          error: result.error,
        });
      });
  });

  router.post('/:id/status-change', (req: Request, res: Response) => {
    postUseCase
      .statusChange({ body: req.body, id: req.params.id })
      .then((result: any) => {
        res.status(Status.OK).json({
          data: result.data,
          message: result.message,
        });
      })
      .catch((result: any) => {
        res.status(Status.BAD_REQUEST).json({
          data: result.data,
          error: result.error,
        });
      });
  });

  router.post('/:id/invite', (req: Request, res: Response) => {
    postUseCase
      .inviteBureau({ ID: req.params.id })
      .then((result: any) => {
        res.status(Status.OK).json({
          data: result.data,
          message: result.message,
        });
      })
      .catch((result: any) => {
        res.status(Status.BAD_REQUEST).json({
          data: result.data,
          error: result.error,
        });
      });
  });

  router.put('/:id', uploader(config.mediaRoot + '/media/csv').single('SampleFile'), (req: Request, res: Response) => {
    putUseCase
      .update({ ID: req.params.id, body: req.body, SampleFile: req.file })
      .then((result: any) => {
        res.status(Status.OK).json({
          data: result.data,
          message: result.message,
        });
      })
      .catch((result: any) => {
        logger.error(result.error);
        res.status(Status.BAD_REQUEST).json({
          data: result.data,
          error: result.error,
        });
      });
  });

  router.delete('/:id', (req: Request, res: Response) => {
    deleteUseCase
      .remove({ ID: req.params.id })
      .then((result: any) => {
        res.status(Status.OK).json({
          data: result.data,
          message: result.message,
        });
      })
      .catch((error: any) => {
        logger.error(error);
        res.status(Status.BAD_REQUEST).json({
          data: error.data,
          error: error.message,
        });
      });
  });

  return router;
}
