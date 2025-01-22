import { RequestHandler } from 'express'; // assuming express is used for handling HTTP requests

import get from './get';
import post from './post';
import put from './put';
import remove from './delete';

interface RouteHandlers {
  get: RequestHandler;
  post: RequestHandler;
  put: RequestHandler;
  remove: RequestHandler;
}

const routeHandlers: RouteHandlers = {
  get,
  post,
  put,
  remove
};

export default routeHandlers;
