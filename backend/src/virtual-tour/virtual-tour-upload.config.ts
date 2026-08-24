import { randomUUID } from 'crypto';
import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, resolve } from 'path';
import {
  VIRTUAL_TOUR_MAX_FILE_BYTES,
  VIRTUAL_TOUR_UPLOAD_FILE_COUNT,
} from './virtual-tour.constants';

const uploadTempDirectory = resolve(
  process.cwd(),
  '.tmp',
  'virtual-tour-uploads',
);
mkdirSync(uploadTempDirectory, { recursive: true });

export const virtualTourPackageUploadOptions = {
  storage: diskStorage({
    destination: uploadTempDirectory,
    filename: (_request, file, callback) => {
      callback(
        null,
        `${randomUUID()}${extname(file.originalname).toLowerCase()}`,
      );
    },
  }),
  limits: {
    files: VIRTUAL_TOUR_UPLOAD_FILE_COUNT,
    fileSize: VIRTUAL_TOUR_MAX_FILE_BYTES,
  },
};
