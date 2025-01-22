import { Document, Model } from 'mongoose';
import { comparePassword } from '../../encryption';

interface ModelMethods<T extends Document> {
  find: (...args: any[]) => Promise<T[]>;
  create: (...args: any[]) => Promise<T>;
  updateOne: (...args: any[]) => Promise<void>;
  findById: (...args: any[]) => Promise<T | null>;
  findOne: (...args: any[]) => Promise<T | null>;
  deleteOne: (...args: any[]) => Promise<void>;
}

interface Repository<T extends Document> {
  getAll: (...args: any[]) => Promise<T[]>;
  create: (...args: any[]) => Promise<T>;
  update: (...args: any[]) => Promise<void>;
  findById: (...args: any[]) => Promise<T>;
  findOne: (...args: any[]) => Promise<T>;
  validatePassword: (encodedPassword: string) => (password: string) => Promise<boolean>;
  destroy: (...args: any[]) => Promise<number>;
}

const repository = <T extends Document>({ model }: { model: Model<T> & ModelMethods<T> }): Repository<T> => {
  const getAll = async (...args: any[]): Promise<T[]> => {
    const entities = await model.find(...args);
    return entities;
  };

  const create = async (...args: any[]): Promise<T> => {
    const result = await model.create(...args);
    return result;
  };

  const update = async (...args: any[]): Promise<void> => {
    await model.updateOne(...args);
  };

  const findById = async (...args: any[]): Promise<T> => {
    const result = await model.findById(...args);
    if (!result) throw new Error('Entity not found');
    return result;
  };

  const findOne = async (...args: any[]): Promise<T> => {
    const result = await model.findOne(...args);
    if (!result) throw new Error('Entity not found');
    return result;
  };

  const validatePassword = (encodedPassword: string) => async (password: string): Promise<boolean> => {
    return comparePassword(password, encodedPassword);
  };

  const destroy = async (...args: any[]): Promise<number> => {
    const count = await model.deleteOne(...args);
    return count.deletedCount || 0;
  };

  return {
    getAll,
    create,
    update,
    findById,
    findOne,
    validatePassword,
    destroy
  };
};

export default repository;
