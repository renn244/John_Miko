import { ServiceUnavailableException } from '@nestjs/common';
import type {
  UploadApiOptions,
  UploadApiResponse,
  UploadStream,
} from 'cloudinary';
import { randomUUID } from 'crypto';
import { PassThrough } from 'stream';
import type { CloudinaryClient } from 'src/media/cloudinary.provider';
import { VirtualTourStorageService } from './virtual-tour-storage.service';

jest.mock('crypto', () => ({ randomUUID: jest.fn() }));

type EnabledCloudinaryClient = Exclude<CloudinaryClient, undefined>;
type UploadCallback = (error?: Error, result?: UploadApiResponse) => void;

const createUploadResult = (publicId: string) =>
  ({
    public_id: publicId,
    secure_url: `https://res.cloudinary.com/test/image/upload/${publicId}`,
  }) as UploadApiResponse;

const requirePublicId = (options: UploadApiOptions) => {
  if (!options.public_id) throw new Error('Missing test public ID.');
  return options.public_id;
};

describe('VirtualTourStorageService', () => {
  let cloudinary: EnabledCloudinaryClient;
  let uploadFile: jest.Mock<
    Promise<UploadApiResponse>,
    [string, UploadApiOptions]
  >;
  let uploadStream: jest.Mock<UploadStream, [UploadApiOptions, UploadCallback]>;
  let deleteResources: jest.Mock;
  let buildUrl: jest.Mock<string, [string, { format?: string }]>;
  let service: VirtualTourStorageService;

  beforeEach(() => {
    jest.clearAllMocks();
    jest
      .mocked(randomUUID)
      .mockReturnValue('12345678-1234-1234-1234-123456789abc');
    jest.spyOn(Date, 'now').mockReturnValue(1_234);

    uploadFile = jest
      .fn<Promise<UploadApiResponse>, [string, UploadApiOptions]>()
      .mockImplementation((_path, options) =>
        Promise.resolve(createUploadResult(requirePublicId(options))),
      );
    uploadStream = jest.fn<UploadStream, [UploadApiOptions, UploadCallback]>(
      (options, callback) => {
        const stream = new PassThrough();
        stream.on('finish', () =>
          callback(undefined, createUploadResult(requirePublicId(options))),
        );
        return stream as UploadStream;
      },
    );
    deleteResources = jest.fn().mockResolvedValue({ deleted: {} });
    buildUrl = jest.fn(
      (publicId: string, options: { format?: string }) =>
        `https://res.cloudinary.com/test/image/upload/${publicId}${
          options.format ? `.${options.format}` : ''
        }`,
    );
    cloudinary = {
      uploader: {
        upload: uploadFile,
        upload_stream: uploadStream,
      },
      api: {
        delete_resources: deleteResources,
      },
      url: buildUrl,
    } as unknown as EnabledCloudinaryClient;
    service = new VirtualTourStorageService(cloudinary);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('uploads the complete package to Cloudinary and returns public URLs', async () => {
    const tiles = Array.from({ length: 32 }, (_, index) => {
      const row = Math.floor(index / 8);
      const column = index % 8;
      return {
        filename: `${row}_${column}.jpg`,
        path: `tmp/${row}_${column}.jpg`,
      };
    });

    const result = await service.storePackage({
      sceneId: 'scene-1',
      originalPath: 'tmp/original.jpg',
      originalExtension: 'jpg',
      preview: Buffer.from('preview'),
      tiles,
    });

    expect(uploadFile).toHaveBeenCalledTimes(33);
    expect(uploadStream).toHaveBeenCalledTimes(1);
    expect(uploadFile).toHaveBeenCalledWith(
      'tmp/0_0.jpg',
      expect.objectContaining({
        public_id: 'public/virtual-tour/scenes/scene-1/1234-12345678/tiles/0_0',
        format: 'jpg',
        resource_type: 'image',
        type: 'upload',
      }),
    );
    expect(deleteResources).not.toHaveBeenCalled();
    expect(buildUrl).toHaveBeenCalledWith(
      'public/virtual-tour/scenes/scene-1/1234-12345678/tiles',
      expect.objectContaining({ analytics: false, secure: true }),
    );
    expect(result).toEqual({
      originalUrl:
        'https://res.cloudinary.com/test/image/upload/public/virtual-tour/scenes/scene-1/1234-12345678/original.jpg',
      previewUrl:
        'https://res.cloudinary.com/test/image/upload/public/virtual-tour/scenes/scene-1/1234-12345678/preview.webp',
      tilesBaseUrl:
        'https://res.cloudinary.com/test/image/upload/public/virtual-tour/scenes/scene-1/1234-12345678/tiles',
    });
  });

  it('rolls back completed Cloudinary assets when a package upload fails', async () => {
    uploadFile.mockImplementation((_path, options) => {
      const publicId = requirePublicId(options);
      if (publicId.endsWith('/tiles/0_1')) {
        return Promise.reject(new Error('Cloudinary unavailable'));
      }
      return Promise.resolve(createUploadResult(publicId));
    });

    await expect(
      service.storePackage({
        sceneId: 'scene-1',
        originalPath: 'tmp/original.jpg',
        originalExtension: 'jpg',
        preview: Buffer.from('preview'),
        tiles: [
          { filename: '0_0.jpg', path: 'tmp/0_0.jpg' },
          { filename: '0_1.jpg', path: 'tmp/0_1.jpg' },
          { filename: '0_2.jpg', path: 'tmp/0_2.jpg' },
        ],
      }),
    ).rejects.toThrow('Cloudinary unavailable');

    expect(deleteResources).toHaveBeenCalledWith(
      expect.arrayContaining([
        'public/virtual-tour/scenes/scene-1/1234-12345678/original',
        'public/virtual-tour/scenes/scene-1/1234-12345678/preview',
        'public/virtual-tour/scenes/scene-1/1234-12345678/tiles/0_0',
        'public/virtual-tour/scenes/scene-1/1234-12345678/tiles/0_2',
      ]),
      {
        resource_type: 'image',
        type: 'upload',
        invalidate: true,
      },
    );
  });

  it('fails safely when Cloudinary uploads are disabled', async () => {
    service = new VirtualTourStorageService(undefined);

    await expect(
      service.storePackage({
        sceneId: 'scene-1',
        originalPath: 'tmp/original.jpg',
        originalExtension: 'jpg',
        preview: Buffer.from('preview'),
        tiles: [],
      }),
    ).rejects.toBeInstanceOf(ServiceUnavailableException);
  });
});
