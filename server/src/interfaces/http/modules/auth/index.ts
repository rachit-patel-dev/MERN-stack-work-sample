import { Cradle } from 'src/container'; // Adjust this import based on your container setup
import router from './router';
import instance from './instance';

interface AppInfo {
  app: any; // Adjust the type of 'app' according to your application setup
  router: any; // Adjust the type of 'router' according to your application setup
}
/**
 * Initializes the application and returns the app instance and router.
 * 
 * @returns {AppInfo} The app instance and router.
 */
const initializeApp = (): AppInfo => {
  const { logger, response: { Success, Fail }, auth, jwt } = container.cradle as Cradle; // Adjust Cradle type according to your container setup
  const app = instance();

  return {
    app,
    router: router({ logger, auth, jwt, response: { Success, Fail }, ...app })
  };
};

export default initializeApp;
