import { Model } from 'mongoose';

interface Database {
    models: { [key: string]: Model<any> };
}

interface DatabaseManager {
    resetDb: () => Promise<void>;
}

const databaseManager = (database: Database): DatabaseManager => {
    const resetDb = async (): Promise<void> => {
        try {
            for (const key in database.models) {
                const element = database.models[key];
                await (element as Model<any>).deleteMany({});
            }
        } catch (error) {
            // Handle error if needed
        }
    };

    return {
        resetDb
    };
};

export default databaseManager;
