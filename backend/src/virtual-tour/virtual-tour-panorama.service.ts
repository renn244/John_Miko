import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { mkdir, mkdtemp, rm } from 'fs/promises';
import { join } from 'path';
import * as sharpModule from 'sharp';
import type { Sharp, SharpOptions } from 'sharp';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  cleanupVirtualTourUploadFile,
  ValidatedVirtualTourPanoramaUpload,
} from './virtual-tour-panorama-upload.pipe';
import { VirtualTourStorageService } from './virtual-tour-storage.service';
import {
  VIRTUAL_TOUR_MAX_PANORAMA_WIDTH,
  VIRTUAL_TOUR_PREVIEW_QUALITY,
  VIRTUAL_TOUR_PREVIEW_WIDTH,
  VIRTUAL_TOUR_TILE_COLUMNS,
  VIRTUAL_TOUR_TILE_QUALITY,
  VIRTUAL_TOUR_TILE_ROWS,
} from './virtual-tour.constants';
import { virtualTourUploadTempDirectory } from './virtual-tour-upload.config';

type SharpFactory = (input?: string | Buffer, options?: SharpOptions) => Sharp;

const sharp =
  (sharpModule as unknown as { default?: SharpFactory }).default ??
  (sharpModule as unknown as SharpFactory);

@Injectable()
export class VirtualTourPanoramaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: VirtualTourStorageService,
  ) {}

  async uploadPanorama(
    sceneId: string,
    upload: ValidatedVirtualTourPanoramaUpload,
  ) {
    let generatedDirectory: string | undefined;

    try {
      const scene = await this.prisma.virtualTourScene.findUnique({
        where: { id: sceneId },
        select: { id: true },
      });
      if (!scene) throw new NotFoundException('Virtual tour scene not found.');

      await mkdir(virtualTourUploadTempDirectory, { recursive: true });
      generatedDirectory = await mkdtemp(
        join(virtualTourUploadTempDirectory, 'generated-'),
      );
      const generated = await this.generatePanoramaAssets(
        upload.panorama.path,
        upload.panoramaWidth,
        generatedDirectory,
      );
      const stored = await this.storage.storePackage({
        sceneId,
        originalPath: upload.panorama.path,
        originalExtension: upload.originalExtension,
        preview: generated.preview,
        tiles: generated.tiles,
      });

      return await this.prisma.virtualTourScene.update({
        where: { id: sceneId },
        data: {
          ...stored,
          tileCols: VIRTUAL_TOUR_TILE_COLUMNS,
          tileRows: VIRTUAL_TOUR_TILE_ROWS,
          panoramaWidth: generated.panoramaWidth,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'The panorama package could not be stored. Please try again.',
        { cause: error },
      );
    } finally {
      await Promise.all([
        cleanupVirtualTourUploadFile(upload.panorama),
        generatedDirectory
          ? rm(generatedDirectory, { recursive: true, force: true })
          : Promise.resolve(),
      ]);
    }
  }

  private async generatePanoramaAssets(
    panoramaPath: string,
    originalWidth: number,
    outputDirectory: string,
  ) {
    const panoramaWidth =
      Math.floor(
        Math.min(originalWidth, VIRTUAL_TOUR_MAX_PANORAMA_WIDTH) /
          VIRTUAL_TOUR_TILE_COLUMNS,
      ) * VIRTUAL_TOUR_TILE_COLUMNS;
    const tileSize = panoramaWidth / VIRTUAL_TOUR_TILE_COLUMNS;
    const panoramaHeight = tileSize * VIRTUAL_TOUR_TILE_ROWS;
    const { data, info } = await sharp(panoramaPath)
      .resize({ width: panoramaWidth, height: panoramaHeight, fit: 'fill' })
      .removeAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });
    const raw = {
      width: info.width,
      height: info.height,
      channels: info.channels,
    };
    const preview = await sharp(data, { raw })
      .resize({
        width: Math.min(VIRTUAL_TOUR_PREVIEW_WIDTH, panoramaWidth),
      })
      .webp({ quality: VIRTUAL_TOUR_PREVIEW_QUALITY })
      .toBuffer();
    const tiles: Array<{ filename: string; path: string }> = [];

    for (let row = 0; row < VIRTUAL_TOUR_TILE_ROWS; row += 1) {
      for (let column = 0; column < VIRTUAL_TOUR_TILE_COLUMNS; column += 1) {
        const filename = `${row}_${column}.jpg`;
        const path = join(outputDirectory, filename);

        await sharp(data, { raw })
          .extract({
            left: column * tileSize,
            top: row * tileSize,
            width: tileSize,
            height: tileSize,
          })
          .jpeg({
            quality: VIRTUAL_TOUR_TILE_QUALITY,
            chromaSubsampling: '4:2:0',
          })
          .toFile(path);
        tiles.push({ filename, path });
      }
    }

    return { panoramaWidth, preview, tiles };
  }
}
