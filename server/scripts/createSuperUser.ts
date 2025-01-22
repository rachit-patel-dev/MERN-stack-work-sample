import dotenv from 'dotenv';
import inquirer from 'inquirer';
import moment from 'moment';
import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import config from '../config';

dotenv.config();

interface User {
  email: string;
  legalName: string;
  password: string;
  confirmPassword: string;
  type?: string;
  isActive?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new mongoose.Schema<User>({
  email: { type: String, required: true },
  legalName: { type: String, required: true },
  password: { type: String, required: true },
  type: { type: String },
  isActive: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const UserModel = mongoose.model<User>('User', UserSchema);

const createSuperUser = async (): Promise<void> => {
  await mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.database}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  const user = await getUserInput();
  user.type = 'ADMIN';
  user.isActive = true;
  user.createdAt = moment.utc().toDate();
  user.updatedAt = moment.utc().toDate();

  if (user.confirmPassword === user.password) {
    user.password = await bcrypt.hash(user.password, 10);
    try {
      await UserModel.create(user);
      console.log(`Super user ${user.email} is created successfully.`);
    } catch (error) {
      console.error(error);
    } finally {
      mongoose.disconnect();
    }
  } else {
    throw new Error("Both passwords do not match. Please try again.");
  }
};

const getUserInput = async (): Promise<User> => {
  const answers1 = await inquirer.prompt([
    {
      type: 'text',
      name: 'email',
      message: 'Enter Email:',
    },
  ]);

  const answers2 = await inquirer.prompt([
    {
      type: 'text',
      name: 'legalName',
      message: 'Enter LegalName:',
    },
  ]);

  const answers3 = await inquirer.prompt([
    {
      type: 'password',
      name: 'password',
      message: 'Enter Password:',
    },
  ]);

  const answers4 = await inquirer.prompt([
    {
      type: 'password',
      name: 'confirmPassword',
      message: 'Enter Confirm-Password:',
    },
  ]);

  return {
    email: answers1.email,
    legalName: answers2.legalName,
    password: answers3.password,
    confirmPassword: answers4.confirmPassword,
  };
};

createSuperUser();
