import { BadRequestException } from '@nestjs/common';
import { unlink } from 'fs/promises';
import * as sharpModule from 'sharp';
import { VirtualTourPanoramaUploadPipe } from './virtual-tour-panorama-upload.pipe';
import { virtualTourPanoramaUploadOptions } from './virtual-tour-upload.config';

jest.mock('fs/promises', () => ({
  unlink: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('sharp', () => jest.fn());

const sharpMock =
  (sharpModule as unknown as { default?: jest.Mock }).default ??
  (sharpModule as unknown as jest.Mock);

describe('VirtualTourPanoramaUploadPipe', () => {
  let pipe: VirtualTourPanoramaUploadPipe;
  let panorama: Express.Multer.File;

  beforeEach(() => {
    jest.clearAllMocks();
    pipe = new VirtualTourPanoramaUploadPipe();
    panorama = {
      path: 'panorama.jpg',
      originalname: 'panorama.jpg',
      mimetype: 'image/jpeg',
    } as Express.Multer.File;
    sharpMock.mockReturnValue({
      metadata: jest.fn().mockResolvedValue({
        width: 8192,
        height: 4096,
        format: 'jpeg',
      }),
    });
  });

  it('accepts only one file up to 60 MB at the multipart boundary', () => {
    expect(virtualTourPanoramaUploadOptions.limits).toEqual({
      files: 1,
      fileSize: 60 * 1024 * 1024,
    });
  });

  it('requires one original panorama', async () => {
    await expect(pipe.transform(undefined)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(unlink).not.toHaveBeenCalled();
  });

  it.each([
    [
      'an unsupported original format',
      { width: 8192, height: 4096, format: 'webp' },
    ],
    [
      'an original panorama that is not approximately 2:1',
      { width: 4096, height: 4096, format: 'jpeg' },
    ],
  ])('rejects %s and cleans the temporary file', async (_case, metadata) => {
    sharpMock.mockReturnValue({
      metadata: jest.fn().mockResolvedValue(metadata),
    });

    await expect(pipe.transform(panorama)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(unlink).toHaveBeenCalledWith('panorama.jpg');
  });

  it('rejects a file that Sharp cannot read as an image', async () => {
    sharpMock.mockReturnValue({
      metadata: jest.fn().mockRejectedValue(new Error('Invalid image')),
    });

    await expect(pipe.transform(panorama)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(unlink).toHaveBeenCalledWith('panorama.jpg');
  });

  it('accepts a valid JPG panorama', async () => {
    await expect(pipe.transform(panorama)).resolves.toEqual({
      panorama,
      panoramaWidth: 8192,
      originalExtension: 'jpg',
    });
    expect(unlink).not.toHaveBeenCalled();
  });

  it('accepts a valid PNG panorama', async () => {
    panorama = {
      ...panorama,
      path: 'panorama.png',
      originalname: 'panorama.png',
      mimetype: 'image/png',
    } as Express.Multer.File;
    sharpMock.mockReturnValue({
      metadata: jest.fn().mockResolvedValue({
        width: 4096,
        height: 2048,
        format: 'png',
      }),
    });

    await expect(pipe.transform(panorama)).resolves.toEqual({
      panorama,
      panoramaWidth: 4096,
      originalExtension: 'png',
    });
  });
});
