import path from 'path';

interface Controller {
  (): any; // Define the type for your controller according to your implementation
}
/**
 * Creates routes for a controller.
 * 
 * @param {string} controllerUri - The URI of the controller module.
 * @returns {any} - The result of calling the controller function.
 */
export default function createControllerRoutes(controllerUri: string) {
  const controllerPath = path.resolve('src/interfaces/http/modules', controllerUri);
  const Controller: Controller = require(controllerPath);

  return Controller();
}
