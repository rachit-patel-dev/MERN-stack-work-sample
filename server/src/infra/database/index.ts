import mongoose from "mongoose";

export default ({ config, logger }: { config: any; logger: any }) => {
  if (!config.db) {
    logger.error('Database config file log not found, disabling database.');
    return false;
  }

  return mongoose({ config, logger });
};
