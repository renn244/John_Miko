import { InternalServerErrorException } from '@nestjs/common';
import * as sharpModule from 'sharp';
import { unlink } from 'fs/promises';
import { ValidatedVirtualTourPanoramaUpload } from './virtual-tour-panorama-upload.pipe';
import { VirtualTourPanoramaService } from './virtual-tour-panorama.service';

jest.mock('fs/promises', () => ({
  unlink: jest.fn().mockResolvedValue(undefined),
}));
jest.mock('sharp', () => jest.fn());

const sharpMock =
  (sharpModule as unknown as { default?: jest.Mock }).default ??
  (sharpModule as unknown as jest.Mock);

describe('VirtualTourPanoramaService', () => {
  let prisma: any;
  let storage: any;
  let service: VirtualTourPanoramaService;
  let upload: ValidatedVirtualTourPanoramaUpload;

  beforeEach(() => {
    jest.clearAllMocks();
    prisma = {
      virtualTourScene: {
        findUnique: jest.fn().mockResolvedValue({ id: 'scene-1' }),
        update: jest
          .fn()
          .mockImplementation(({ data }) =>
            Promise.resolve({ id: 'scene-1', ...data }),
          ),
      },
    };
    storage = {
      storePackage: jest.fn().mockResolvedValue({
        originalUrl: 'https://res.cloudinary.com/test/original.jpg',
        previewUrl: 'https://res.cloudinary.com/test/preview.webp',
        tilesBaseUrl: 'https://res.cloudinary.com/test/tiles',
      }),
    };
    service = new VirtualTourPanoramaService(prisma, storage);

    const previewPipeline = {
      webp: jest.fn().mockReturnThis(),
      toBuffer: jest.fn().mockResolvedValue(Buffer.from('preview')),
    };
    sharpMock.mockReturnValue({
      resize: jest.fn().mockReturnValue(previewPipeline),
    });

    upload = {
      panorama: { path: 'panorama.jpg' } as Express.Multer.File,
      panoramaWidth: 8192,
      originalExtension: 'jpg',
      tiles: Array.from({ length: 32 }, (_, index) => {
        const row = Math.floor(index / 8);
        const column = index % 8;
        return {
          filename: `${row}_${column}.jpg`,
          file: { path: `tile-${row}-${column}.jpg` } as Express.Multer.File,
        };
      }),
    };
  });

  it('stores direct EquiSlice files and saves the complete panorama', async () => {
    await expect(service.uploadPackage('scene-1', upload)).resolves.toEqual(
      expect.objectContaining({
        originalUrl: 'https://res.cloudinary.com/test/original.jpg',
        previewUrl: 'https://res.cloudinary.com/test/preview.webp',
        tilesBaseUrl: 'https://res.cloudinary.com/test/tiles',
        tileCols: 8,
        tileRows: 4,
        panoramaWidth: 8192,
      }),
    );

    expect(storage.storePackage).toHaveBeenCalledWith(
      expect.objectContaining({
        sceneId: 'scene-1',
        originalExtension: 'jpg',
        tiles: expect.arrayContaining([
          { filename: '0_0.jpg', path: 'tile-0-0.jpg' },
          { filename: '3_7.jpg', path: 'tile-3-7.jpg' },
        ]),
      }),
    );
    expect(prisma.virtualTourScene.update).toHaveBeenCalledTimes(1);
    expect(prisma.virtualTourScene.update).toHaveBeenCalledWith({
      where: { id: 'scene-1' },
      data: {
        originalUrl: 'https://res.cloudinary.com/test/original.jpg',
        previewUrl: 'https://res.cloudinary.com/test/preview.webp',
        tilesBaseUrl: 'https://res.cloudinary.com/test/tiles',
        tileCols: 8,
        tileRows: 4,
        panoramaWidth: 8192,
      },
    });
  });

  it('cleans up the original and all slices after processing', async () => {
    await service.uploadPackage('scene-1', upload);

    expect(unlink).toHaveBeenCalledTimes(33);
    expect(unlink).toHaveBeenCalledWith('panorama.jpg');
    expect(unlink).toHaveBeenCalledWith('tile-3-7.jpg');
  });

  it('leaves the scene unchanged when storage fails', async () => {
    storage.storePackage.mockRejectedValue(new Error('disk unavailable'));

    await expect(
      service.uploadPackage('scene-1', upload),
    ).rejects.toBeInstanceOf(InternalServerErrorException);

    expect(prisma.virtualTourScene.update).not.toHaveBeenCalled();
    expect(unlink).toHaveBeenCalledTimes(33);
  });

  it('leaves the scene unchanged when preview generation fails', async () => {
    sharpMock.mockReturnValue({
      resize: jest.fn().mockReturnValue({
        webp: jest.fn().mockReturnThis(),
        toBuffer: jest.fn().mockRejectedValue(new Error('invalid panorama')),
      }),
    });

    await expect(
      service.uploadPackage('scene-1', upload),
    ).rejects.toBeInstanceOf(InternalServerErrorException);

    expect(storage.storePackage).not.toHaveBeenCalled();
    expect(prisma.virtualTourScene.update).not.toHaveBeenCalled();
    expect(unlink).toHaveBeenCalledTimes(33);
  });
});
