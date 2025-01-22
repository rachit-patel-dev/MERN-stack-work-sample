import container from './src/container'
const app = container.resolve<any>('app'); // Assuming 'app' resolves to an Express application

app
  .start()
  .catch((error: any) => {
    app.logger.error(error.stack);
    process.exit(1); // Exit with non-zero status code to indicate failure
  });
