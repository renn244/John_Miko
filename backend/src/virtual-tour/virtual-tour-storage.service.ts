import {
  Inject,
  Injectable,
  ServiceUnavailableException,
} from '@nestjs/common';
import type { UploadApiOptions, UploadApiResponse } from 'cloudinary';
import { randomUUID } from 'crypto';
import { Readable } from 'stream';
import { CLOUDINARY, CloudinaryClient } from 'src/media/cloudinary.provider';
import {
  VIRTUAL_TOUR_CLOUDINARY_PREFIX,
  VIRTUAL_TOUR_UPLOAD_CONCURRENCY,
} from './virtual-tour.constants';

type VirtualTourPackage = {
  sceneId: string;
  originalPath: string;
  originalExtension: 'jpg' | 'png';
  preview: Buffer;
  tiles: Array<{ filename: string; path: string }>;
};

type EnabledCloudinaryClient = Exclude<CloudinaryClient, undefined>;

@Injectable()
export class VirtualTourStorageService {
  constructor(
    @Inject(CLOUDINARY)
    private readonly cloudinary: CloudinaryClient,
  ) {}

  async storePackage(input: VirtualTourPackage) {
    const cloudinary = this.cloudinary;
    if (!cloudinary) {
      throw new ServiceUnavailableException(
        'Cloudinary media uploads are disabled in this environment.',
      );
    }

    const version = `${Date.now()}-${randomUUID().slice(0, 8)}`;
    const packagePrefix = `${VIRTUAL_TOUR_CLOUDINARY_PREFIX}/${input.sceneId}/${version}`;
    const uploadedPublicIds: string[] = [];

    try {
      await this.uploadBatch(
        [
          () =>
            this.uploadFile(cloudinary, input.originalPath, {
              public_id: `${packagePrefix}/original`,
              format: input.originalExtension,
            }),
          () =>
            this.uploadBuffer(cloudinary, input.preview, {
              public_id: `${packagePrefix}/preview`,
              format: 'webp',
            }),
        ],
        uploadedPublicIds,
      );

      for (
        let index = 0;
        index < input.tiles.length;
        index += VIRTUAL_TOUR_UPLOAD_CONCURRENCY
      ) {
        const batch = input.tiles.slice(
          index,
          index + VIRTUAL_TOUR_UPLOAD_CONCURRENCY,
        );
        await this.uploadBatch(
          batch.map(
            (tile) => () =>
              this.uploadFile(cloudinary, tile.path, {
                public_id: `${packagePrefix}/tiles/${tile.filename.replace(/\.jpg$/i, '')}`,
                format: 'jpg',
              }),
          ),
          uploadedPublicIds,
        );
      }

      return {
        originalUrl: this.getDeliveryUrl(
          cloudinary,
          `${packagePrefix}/original`,
          input.originalExtension,
        ),
        previewUrl: this.getDeliveryUrl(
          cloudinary,
          `${packagePrefix}/preview`,
          'webp',
        ),
        tilesBaseUrl: this.getDeliveryUrl(cloudinary, `${packagePrefix}/tiles`),
      };
    } catch (error) {
      await this.rollbackUploads(cloudinary, uploadedPublicIds);
      throw error;
    }
  }

  private uploadFile(
    cloudinary: EnabledCloudinaryClient,
    path: string,
    options: UploadApiOptions,
  ) {
    return cloudinary.uploader.upload(path, this.getUploadOptions(options));
  }

  private uploadBuffer(
    cloudinary: EnabledCloudinaryClient,
    buffer: Buffer,
    options: UploadApiOptions,
  ) {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const upload = cloudinary.uploader.upload_stream(
        this.getUploadOptions(options),
        (error, result) => {
          if (error) {
            reject(new Error(error.message));
          } else if (!result) {
            reject(new Error('Cloudinary did not return an upload result.'));
          } else {
            resolve(result);
          }
        },
      );

      Readable.from(buffer).pipe(upload);
    });
  }

  private getUploadOptions(options: UploadApiOptions): UploadApiOptions {
    return {
      resource_type: 'image',
      type: 'upload',
      overwrite: false,
      unique_filename: false,
      use_filename: false,
      ...options,
    };
  }

  private async uploadBatch(
    uploads: Array<() => Promise<UploadApiResponse>>,
    uploadedPublicIds: string[],
  ) {
    const results = await Promise.allSettled(
      uploads.map(async (upload) => {
        const result = await upload();
        uploadedPublicIds.push(result.public_id);
        return result;
      }),
    );
    const failure = results.find(
      (result): result is PromiseRejectedResult => result.status === 'rejected',
    );

    if (failure) {
      throw failure.reason instanceof Error
        ? failure.reason
        : new Error('Cloudinary package upload failed.');
    }
  }

  private getDeliveryUrl(
    cloudinary: EnabledCloudinaryClient,
    publicId: string,
    format?: 'jpg' | 'png' | 'webp',
  ) {
    return cloudinary.url(publicId, {
      secure: true,
      analytics: false,
      resource_type: 'image',
      type: 'upload',
      ...(format ? { format } : {}),
    });
  }

  private async rollbackUploads(
    cloudinary: EnabledCloudinaryClient,
    publicIds: string[],
  ) {
    if (publicIds.length === 0) return;

    await cloudinary.api
      .delete_resources(publicIds, {
        resource_type: 'image',
        type: 'upload',
        invalidate: true,
      })
      .catch(() => undefined);
  }
}
