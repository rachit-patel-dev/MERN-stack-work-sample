import * as dotenv from 'dotenv';
import * as multer from 'multer';
import * as fs from 'fs';

const Storage = (path: string): multer.StorageEngine => {
  if (!JSON.parse(process.env.ENABLE_AZURE_BLOB || 'false')) {
    return multer.diskStorage({
      destination: (req, file, cb) => {
        if (!fs.existsSync(path)) {
          try {
            fs.mkdirSync(path, { recursive: true });
          } catch (err) {
            return cb(err, null);
          }
        }
        cb(null, path);
      },
      filename: (req, file, cb) => {
        const extension = file.originalname.split('.').pop() || '';
        cb(null, `${file.originalname.split('.')[0]}-${new Date().getTime()}.${extension}`);
      },
    });
  } else {
    return multer.memoryStorage({
      filename: (_req, file, cb) => {
        const extension = file.originalname.split('.').pop() || '';
        cb(null, `${file.originalname.split('.')[0]}-${new Date().getTime()}.${extension}`);
      },
    });
  }
};

const FileFilter = (fileMimeTypes: string[]): multer.FileFilterCallback => {
  const filter: multer.FileFilterCallback = (req, file, cb) => {
    const check = fileMimeTypes.includes(file.mimetype);
    cb(null, check);
  };
  return filter;
};

export const uploader = (path: string): multer.Instance => multer({
  storage: Storage(path),
  fileFilter: FileFilter(['text/csv']),
});

// Load environment variables from .env file
dotenv.config();
