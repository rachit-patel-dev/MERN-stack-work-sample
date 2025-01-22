import mongoose from 'mongoose';
import UserModel, { UserDocument } from './models/User';
import BureauModel, { BureauDocument } from './models/Bureau';
import { SendGrid } from '@sendgrid/mail'; // Assuming this is the correct import for SendGrid

interface Repositories {
  userRepository: typeof UserModel;
  bureauRepository: typeof BureauModel;
  sendGrid: SendGrid;
}

const initializeRepositories = async ({ sendGrid, config, logger }: { sendGrid: SendGrid; config: any; logger: any }): Promise<Repositories> => {
  await mongoose.connect(config.mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });
  const db = mongoose.connection;
  db.on('error', console.error.bind(console, 'MongoDB connection error:'));

  return {
    userRepository: UserModel,
    bureauRepository: BureauModel,
    sendGrid
  };
};

export default initializeRepositories;
