import { Document, Model, Types } from 'mongoose';

interface ModelMethods<T extends Document> {
  find: (...args: any[]) => Promise<T[]>;
  countDocuments: (...args: any[]) => Promise<number>;
  findOne: (...args: any[]) => Promise<T | null>;
  findById: (...args: any[]) => Promise<T | null>;
  create: (...args: any[]) => Promise<T>;
  updateOne: (...args: any[]) => Promise<void>;
  deleteOne: (...args: any[]) => Promise<void>;
}

interface Repository<T extends Document> {
  getAll: (...args: any[]) => Promise<T[]>;
  countAll: (...args: any[]) => Promise<number>;
  findOne: (...args: any[]) => Promise<T>;
  findById: (...args: any[]) => Promise<T>;
  create: (...args: any[]) => Promise<T>;
  update: (...args: any[]) => Promise<void>;
  destroy: (...args: any[]) => Promise<void>;
}

const repository = <T extends Document>({ model }: { model: Model<T> & ModelMethods<T> }): Repository<T> => {
  const getAll = async (...args: any[]): Promise<T[]> => {
    const entities = await model.find(...args);
    return entities;
  };

  const countAll = async (...args: any[]): Promise<number> => {
    const count = await model.countDocuments(...args);
    return count;
  };

  const findOne = async (...args: any[]): Promise<T> => {
    const result = await model.findOne(...args);
    if (!result) throw new Error('Entity not found');
    return result;
  };

  const findById = async (...args: any[]): Promise<T> => {
    const result = await model.findById(...args);
    if (!result) throw new Error('Entity not found');
    return result;
  };

  const create = async (...args: any[]): Promise<T> => {
    const result = await model.create(...args);
    return result;
  };

  const update = async (...args: any[]): Promise<void> => {
    await model.updateOne(...args);
  };

  const destroy = async (...args: any[]): Promise<void> => {
    await model.deleteOne(...args);
  };

  return {
    getAll,
    countAll,
    findOne,
    findById,
    create,
    update,
    destroy
  };
};

export default repository;
