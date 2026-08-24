import { randomUUID } from 'crypto';
import { mkdirSync } from 'fs';
import { diskStorage } from 'multer';
import { extname, resolve } from 'path';
import { VIRTUAL_TOUR_MAX_FILE_BYTES } from './virtual-tour.constants';

export const virtualTourUploadTempDirectory = resolve(
  process.cwd(),
  '.tmp',
  'virtual-tour-uploads',
);
mkdirSync(virtualTourUploadTempDirectory, { recursive: true });

export const virtualTourPanoramaUploadOptions = {
  storage: diskStorage({
    destination: virtualTourUploadTempDirectory,
    filename: (_request, file, callback) => {
      callback(
        null,
        `${randomUUID()}${extname(file.originalname).toLowerCase()}`,
      );
    },
  }),
  limits: {
    files: 1,
    fileSize: VIRTUAL_TOUR_MAX_FILE_BYTES,
  },
};
