import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { unlink } from 'fs/promises';
import * as sharpModule from 'sharp';
import type { Sharp } from 'sharp';
type SharpFactory = (input?: string | Buffer) => Sharp;

const sharp =
  (sharpModule as unknown as { default?: SharpFactory }).default ??
  (sharpModule as unknown as SharpFactory);

export interface ValidatedVirtualTourPanoramaUpload {
  panorama: Express.Multer.File;
  panoramaWidth: number;
  originalExtension: 'jpg' | 'png';
}

export async function cleanupVirtualTourUploadFile(file?: Express.Multer.File) {
  if (file?.path) await unlink(file.path).catch(() => undefined);
}

@Injectable()
export class VirtualTourPanoramaUploadPipe implements PipeTransform<
  Express.Multer.File | undefined,
  Promise<ValidatedVirtualTourPanoramaUpload>
> {
  async transform(panorama: Express.Multer.File | undefined) {
    try {
      if (!panorama) {
        throw new BadRequestException('Upload one original panorama.');
      }

      const panoramaInfo = await this.validateOriginalPanorama(panorama);

      return {
        panorama,
        panoramaWidth: panoramaInfo.width,
        originalExtension: panoramaInfo.extension,
      };
    } catch (error) {
      await cleanupVirtualTourUploadFile(panorama);
      throw error;
    }
  }

  private async validateOriginalPanorama(panorama: Express.Multer.File) {
    const metadata = await sharp(panorama.path)
      .metadata()
      .catch(() => null);

    if (
      !metadata?.width ||
      !metadata.height ||
      !metadata.format ||
      !['jpeg', 'png'].includes(metadata.format)
    ) {
      throw new BadRequestException(
        'The original panorama must be a valid JPG or PNG image.',
      );
    }

    if (Math.abs(metadata.width / metadata.height - 2) > 0.02) {
      throw new BadRequestException(
        'The original panorama must use an approximately 2:1 aspect ratio.',
      );
    }

    return {
      width: metadata.width,
      extension:
        metadata.format === 'jpeg' ? ('jpg' as const) : ('png' as const),
    };
  }
}
