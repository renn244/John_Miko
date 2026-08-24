import { InternalServerErrorException } from '@nestjs/common';
import { mkdir, mkdtemp, rm, unlink } from 'fs/promises';
import * as sharpModule from 'sharp';
import { ValidatedVirtualTourPanoramaUpload } from './virtual-tour-panorama-upload.pipe';
import { VirtualTourPanoramaService } from './virtual-tour-panorama.service';

jest.mock('fs/promises', () => ({
  mkdir: jest.fn().mockResolvedValue(undefined),
  mkdtemp: jest.fn().mockResolvedValue('generated-tiles'),
  rm: jest.fn().mockResolvedValue(undefined),
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
  let sourcePipeline: any;
  let previewPipeline: any;
  let tilePipeline: any;

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
    upload = {
      panorama: { path: 'panorama.jpg' } as Express.Multer.File,
      panoramaWidth: 12_000,
      originalExtension: 'jpg',
    };

    sourcePipeline = {
      resize: jest.fn().mockReturnThis(),
      removeAlpha: jest.fn().mockReturnThis(),
      raw: jest.fn().mockReturnThis(),
      toBuffer: jest.fn().mockResolvedValue({
        data: Buffer.from('raw-panorama'),
        info: { width: 8192, height: 4096, channels: 3 },
      }),
    };
    previewPipeline = {
      resize: jest.fn().mockReturnThis(),
      webp: jest.fn().mockReturnThis(),
      toBuffer: jest.fn().mockResolvedValue(Buffer.from('preview')),
    };
    tilePipeline = {
      extract: jest.fn().mockReturnThis(),
      jpeg: jest.fn().mockReturnThis(),
      toFile: jest.fn().mockResolvedValue({}),
    };

    let rawImageCalls = 0;
    sharpMock.mockImplementation((input: string | Buffer) => {
      if (typeof input === 'string') return sourcePipeline;
      rawImageCalls += 1;
      return rawImageCalls === 1 ? previewPipeline : tilePipeline;
    });
  });

  it('generates and stores a capped 8x4 panorama package', async () => {
    await expect(service.uploadPanorama('scene-1', upload)).resolves.toEqual(
      expect.objectContaining({
        originalUrl: 'https://res.cloudinary.com/test/original.jpg',
        previewUrl: 'https://res.cloudinary.com/test/preview.webp',
        tilesBaseUrl: 'https://res.cloudinary.com/test/tiles',
        tileCols: 8,
        tileRows: 4,
        panoramaWidth: 8192,
      }),
    );

    expect(sourcePipeline.resize).toHaveBeenCalledWith({
      width: 8192,
      height: 4096,
      fit: 'fill',
    });
    expect(previewPipeline.resize).toHaveBeenCalledWith({ width: 1600 });
    expect(storage.storePackage).toHaveBeenCalledWith(
      expect.objectContaining({
        sceneId: 'scene-1',
        originalPath: 'panorama.jpg',
        originalExtension: 'jpg',
        preview: Buffer.from('preview'),
        tiles: expect.arrayContaining([
          { filename: '0_0.jpg', path: expect.stringMatching(/0_0\.jpg$/) },
          { filename: '3_7.jpg', path: expect.stringMatching(/3_7\.jpg$/) },
        ]),
      }),
    );
    expect(storage.storePackage.mock.calls[0][0].tiles).toHaveLength(32);
    expect(tilePipeline.toFile).toHaveBeenCalledTimes(32);
    expect(prisma.virtualTourScene.update).toHaveBeenCalledTimes(1);
  });

  it('does not enlarge a smaller panorama', async () => {
    upload.panoramaWidth = 4096;

    await service.uploadPanorama('scene-1', upload);

    expect(sourcePipeline.resize).toHaveBeenCalledWith({
      width: 4096,
      height: 2048,
      fit: 'fill',
    });
    expect(tilePipeline.extract).toHaveBeenCalledWith({
      left: 3584,
      top: 1536,
      width: 512,
      height: 512,
    });
    expect(prisma.virtualTourScene.update).toHaveBeenCalledWith({
      where: { id: 'scene-1' },
      data: expect.objectContaining({ panoramaWidth: 4096 }),
    });
  });

  it('cleans the original and generated tiles after success', async () => {
    await service.uploadPanorama('scene-1', upload);

    expect(mkdir).toHaveBeenCalled();
    expect(mkdtemp).toHaveBeenCalled();
    expect(unlink).toHaveBeenCalledWith('panorama.jpg');
    expect(rm).toHaveBeenCalledWith('generated-tiles', {
      recursive: true,
      force: true,
    });
  });

  it('leaves the scene unchanged and cleans files when storage fails', async () => {
    storage.storePackage.mockRejectedValue(new Error('Cloudinary unavailable'));

    await expect(
      service.uploadPanorama('scene-1', upload),
    ).rejects.toBeInstanceOf(InternalServerErrorException);

    expect(prisma.virtualTourScene.update).not.toHaveBeenCalled();
    expect(unlink).toHaveBeenCalledWith('panorama.jpg');
    expect(rm).toHaveBeenCalledWith('generated-tiles', {
      recursive: true,
      force: true,
    });
  });

  it('leaves the scene unchanged and cleans files when generation fails', async () => {
    sourcePipeline.toBuffer.mockRejectedValue(new Error('Sharp failed'));

    await expect(
      service.uploadPanorama('scene-1', upload),
    ).rejects.toBeInstanceOf(InternalServerErrorException);

    expect(storage.storePackage).not.toHaveBeenCalled();
    expect(prisma.virtualTourScene.update).not.toHaveBeenCalled();
    expect(unlink).toHaveBeenCalledWith('panorama.jpg');
    expect(rm).toHaveBeenCalledWith('generated-tiles', {
      recursive: true,
      force: true,
    });
  });
});
