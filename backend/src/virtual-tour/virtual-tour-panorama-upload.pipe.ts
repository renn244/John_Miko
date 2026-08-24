import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { unlink } from 'fs/promises';
import * as sharpModule from 'sharp';
import type { Sharp } from 'sharp';
import {
  VIRTUAL_TOUR_TILE_COLUMNS,
  VIRTUAL_TOUR_TILE_ROWS,
} from './virtual-tour.constants';

type SharpFactory = (input?: string | Buffer) => Sharp;

const sharp =
  (sharpModule as unknown as { default?: SharpFactory }).default ??
  (sharpModule as unknown as SharpFactory);

export interface VirtualTourPanoramaFiles {
  panorama?: Express.Multer.File[];
  tiles?: Express.Multer.File[];
}

export interface ValidatedVirtualTourPanoramaUpload {
  panorama: Express.Multer.File;
  panoramaWidth: number;
  originalExtension: 'jpg' | 'png';
  tiles: Array<{
    file: Express.Multer.File;
    filename: string;
  }>;
}

export async function cleanupVirtualTourUploadFiles(
  files: VirtualTourPanoramaFiles,
) {
  await Promise.all(
    [...(files.panorama ?? []), ...(files.tiles ?? [])]
      .map((file) => file.path)
      .filter(Boolean)
      .map((path) => unlink(path).catch(() => undefined)),
  );
}

@Injectable()
export class VirtualTourPanoramaUploadPipe implements PipeTransform<
  VirtualTourPanoramaFiles | undefined,
  Promise<ValidatedVirtualTourPanoramaUpload>
> {
  async transform(files: VirtualTourPanoramaFiles | undefined) {
    const upload = files ?? {};

    try {
      const panorama = this.requireOriginalPanorama(upload);
      const panoramaInfo = await this.validateOriginalPanorama(panorama);
      const tiles = this.validateTiles(upload.tiles ?? []);

      return {
        panorama,
        panoramaWidth: panoramaInfo.width,
        originalExtension: panoramaInfo.extension,
        tiles,
      };
    } catch (error) {
      await cleanupVirtualTourUploadFiles(upload);
      throw error;
    }
  }

  private requireOriginalPanorama(files: VirtualTourPanoramaFiles) {
    const panorama = files.panorama?.[0];
    if (!panorama) {
      throw new BadRequestException('Upload one original panorama.');
    }
    return panorama;
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

  private validateTiles(tiles: Express.Multer.File[]) {
    const requiredCount = VIRTUAL_TOUR_TILE_COLUMNS * VIRTUAL_TOUR_TILE_ROWS;
    if (tiles.length !== requiredCount) {
      throw new BadRequestException(
        'Upload exactly 32 JPG slices from an EquiSlice 8x4 grid.',
      );
    }

    const expectedNames = this.getExpectedTileNames();
    return tiles.map((file) => {
      const filename = file.originalname.toLowerCase();
      if (file.mimetype !== 'image/jpeg' || !expectedNames.delete(filename)) {
        throw new BadRequestException(
          `Unexpected or duplicate EquiSlice slice: ${file.originalname}`,
        );
      }
      return { file, filename };
    });
  }

  private getExpectedTileNames() {
    const names = new Set<string>();
    for (let row = 0; row < VIRTUAL_TOUR_TILE_ROWS; row += 1) {
      for (let column = 0; column < VIRTUAL_TOUR_TILE_COLUMNS; column += 1) {
        names.add(`${row}_${column}.jpg`);
      }
    }
    return names;
  }
}
