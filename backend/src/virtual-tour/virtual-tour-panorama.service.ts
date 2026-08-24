import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as sharpModule from 'sharp';
import type { Sharp } from 'sharp';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  cleanupVirtualTourUploadFiles,
  ValidatedVirtualTourPanoramaUpload,
} from './virtual-tour-panorama-upload.pipe';
import { VirtualTourStorageService } from './virtual-tour-storage.service';
import {
  VIRTUAL_TOUR_PREVIEW_WIDTH,
  VIRTUAL_TOUR_TILE_COLUMNS,
  VIRTUAL_TOUR_TILE_ROWS,
} from './virtual-tour.constants';

type SharpFactory = (input?: string | Buffer) => Sharp;

const sharp =
  (sharpModule as unknown as { default?: SharpFactory }).default ??
  (sharpModule as unknown as SharpFactory);

@Injectable()
export class VirtualTourPanoramaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: VirtualTourStorageService,
  ) {}

  async uploadPackage(
    sceneId: string,
    upload: ValidatedVirtualTourPanoramaUpload,
  ) {
    try {
      const scene = await this.prisma.virtualTourScene.findUnique({
        where: { id: sceneId },
        select: { id: true },
      });
      if (!scene) throw new NotFoundException('Virtual tour scene not found.');

      const preview = await this.createPreview(upload.panorama.path);
      const stored = await this.storage.storePackage({
        sceneId,
        originalPath: upload.panorama.path,
        originalExtension: upload.originalExtension,
        preview,
        tiles: upload.tiles.map(({ file, filename }) => ({
          filename,
          path: file.path,
        })),
      });

      return await this.prisma.virtualTourScene.update({
        where: { id: sceneId },
        data: {
          ...stored,
          tileCols: VIRTUAL_TOUR_TILE_COLUMNS,
          tileRows: VIRTUAL_TOUR_TILE_ROWS,
          panoramaWidth: upload.panoramaWidth,
        },
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException(
        'The panorama package could not be stored. Please try again.',
        { cause: error },
      );
    } finally {
      await cleanupVirtualTourUploadFiles({
        panorama: [upload.panorama],
        tiles: upload.tiles.map(({ file }) => file),
      });
    }
  }

  private createPreview(panoramaPath: string) {
    return sharp(panoramaPath)
      .resize({ width: VIRTUAL_TOUR_PREVIEW_WIDTH, withoutEnlargement: true })
      .webp({ quality: 70 })
      .toBuffer();
  }
}
