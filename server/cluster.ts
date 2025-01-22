import pm2 from 'pm2';

const instances: number = parseInt(process.env.WEB_CONCURRENCY || '-1', 10);
const maxMemory: string = process.env.WEB_MEMORY || '512';

pm2.connect((err: Error) => {
  if (err) {
    console.error('Error while connecting to PM2:', err.stack || err);
    process.exit(1);
  }

  pm2.start({
    script: 'index.js',
    instances,
    max_memory_restart: `${maxMemory}M`,
    env: {
      NODE_ENV: process.env.NODE_ENV || 'development',
      NODE_PATH: '.',
    },
  }, (err: Error) => {
    if (err) {
      console.error('Error while launching applications:', err.stack || err);
      process.exit(1);
    }

    console.log('PM2 and application have been successfully started');

    pm2.launchBus((err: Error, bus: any) => {
      if (err) {
        console.error('Error while launching bus:', err.stack || err);
        process.exit(1);
      }

      console.log('[PM2] Log streaming started');

      bus.on('log:out', (packet: any) => {
        console.log(`[App:${packet.process.name}] ${packet.data}`);
      });

      bus.on('log:err', (packet: any) => {
        console.error(`[App:${packet.process.name}][Err] ${packet.data}`);
      });
    });
  });
});
