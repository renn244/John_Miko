import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Prisma } from 'src/generated/prisma/client';
import {
  VirtualTourHotspotType,
  VirtualTourSceneStatus,
} from 'src/generated/prisma/enums';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  CreateConnectedSceneDto,
  CreateVirtualTourSceneDto,
  InformationHotspotDto,
  NavigationHotspotDto,
  UpdateVirtualTourSceneDto,
} from './dto/virtual-tour.dto';
import { MAIN_VIRTUAL_TOUR_ID } from './virtual-tour.constants';

const PUBLIC_SCENE_INCLUDE = {
  outgoingHotspots: {
    where: { isActive: true },
    orderBy: { createdAt: 'asc' },
    include: {
      targetScene: { select: { id: true, status: true } },
    },
  },
} satisfies Prisma.VirtualTourSceneInclude;

type PublicScene = Prisma.VirtualTourSceneGetPayload<{
  include: typeof PUBLIC_SCENE_INCLUDE;
}>;
type PublicHotspot = PublicScene['outgoingHotspots'][number];

@Injectable()
export class VirtualTourService {
  constructor(private readonly prisma: PrismaService) {}

  async getAdminTour() {
    await this.ensureMainTour();

    return this.prisma.virtualTour.findUnique({
      where: { id: MAIN_VIRTUAL_TOUR_ID },
      include: {
        startingScene: { select: { id: true, name: true } },
        scenes: {
          orderBy: { createdAt: 'asc' },
          include: {
            outgoingHotspots: {
              orderBy: { createdAt: 'asc' },
              include: {
                targetScene: {
                  select: { id: true, name: true, status: true },
                },
              },
            },
            incomingHotspots: {
              select: {
                id: true,
                label: true,
                sourceScene: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
    });
  }

  async getPublicTour() {
    const tour = await this.prisma.virtualTour.findUnique({
      where: { id: MAIN_VIRTUAL_TOUR_ID },
      include: {
        startingScene: { select: { id: true, status: true } },
      },
    });

    if (
      !tour?.startingScene ||
      tour.startingScene.status !== VirtualTourSceneStatus.PUBLISHED
    ) {
      return { available: false, startingSceneId: null, scenes: [] };
    }

    const scenes = await this.prisma.virtualTourScene.findMany({
      where: {
        tourId: MAIN_VIRTUAL_TOUR_ID,
        status: VirtualTourSceneStatus.PUBLISHED,
      },
      orderBy: { createdAt: 'asc' },
      include: PUBLIC_SCENE_INCLUDE,
    });

    return {
      available: true,
      startingSceneId: tour.startingScene.id,
      scenes: scenes.map((scene) => this.toPublicScene(scene)),
    };
  }

  async createStartingScene(body: CreateVirtualTourSceneDto) {
    await this.ensureMainTour();

    return this.prisma.$transaction(async (tx) => {
      const scene = await tx.virtualTourScene.create({
        data: {
          ...this.getSceneData(body),
          tourId: MAIN_VIRTUAL_TOUR_ID,
        },
      });
      const tour = await tx.virtualTour.updateMany({
        where: { id: MAIN_VIRTUAL_TOUR_ID, startingSceneId: null },
        data: { startingSceneId: scene.id },
      });

      if (tour.count === 0) {
        throw new ConflictException(
          'The virtual tour already has a starting scene.',
        );
      }

      return scene;
    });
  }

  async updateScene(sceneId: string, body: UpdateVirtualTourSceneDto) {
    await this.getSceneById(sceneId);

    return this.prisma.virtualTourScene.update({
      where: { id: sceneId },
      data: body,
    });
  }

  async createNavigationHotspot(
    sourceSceneId: string,
    body: NavigationHotspotDto,
  ) {
    const sourceScene = await this.getSceneById(sourceSceneId);
    await this.validateNavigationTarget(
      body,
      sourceScene.tourId,
      sourceSceneId,
    );

    return this.prisma.virtualTourHotspot.create({
      data: {
        ...body,
        sourceSceneId,
        type: VirtualTourHotspotType.NAVIGATION,
      },
    });
  }

  async updateNavigationHotspot(hotspotId: string, body: NavigationHotspotDto) {
    const hotspot = await this.getHotspotById(
      hotspotId,
      VirtualTourHotspotType.NAVIGATION,
    );
    await this.validateNavigationTarget(
      body,
      hotspot.sourceScene.tourId,
      hotspot.sourceSceneId,
    );

    return this.prisma.virtualTourHotspot.update({
      where: { id: hotspotId },
      data: body,
    });
  }

  async createInformationHotspot(
    sourceSceneId: string,
    body: InformationHotspotDto,
  ) {
    await this.getSceneById(sourceSceneId);

    return this.prisma.virtualTourHotspot.create({
      data: {
        ...body,
        sourceSceneId,
        type: VirtualTourHotspotType.INFORMATION,
      },
    });
  }

  async updateInformationHotspot(
    hotspotId: string,
    body: InformationHotspotDto,
  ) {
    await this.getHotspotById(hotspotId, VirtualTourHotspotType.INFORMATION);

    return this.prisma.virtualTourHotspot.update({
      where: { id: hotspotId },
      data: body,
    });
  }

  async deleteHotspot(hotspotId: string) {
    const hotspot = await this.prisma.virtualTourHotspot.findUnique({
      where: { id: hotspotId },
      select: { id: true },
    });

    if (!hotspot) {
      throw new NotFoundException('Virtual tour hotspot not found.');
    }

    await this.prisma.virtualTourHotspot.delete({ where: { id: hotspotId } });
    return { id: hotspotId };
  }

  async createConnectedScene(
    sourceSceneId: string,
    body: CreateConnectedSceneDto,
  ) {
    const sourceScene = await this.getSceneById(sourceSceneId);
    this.validateArrivalView(body.hotspot.targetYaw, body.hotspot.targetPitch);

    return this.prisma.$transaction(async (tx) => {
      const scene = await tx.virtualTourScene.create({
        data: {
          ...this.getSceneData(body.scene),
          tourId: sourceScene.tourId,
        },
      });
      const hotspot = await tx.virtualTourHotspot.create({
        data: {
          ...body.hotspot,
          sourceSceneId,
          type: VirtualTourHotspotType.NAVIGATION,
          targetSceneId: scene.id,
        },
      });

      return { scene, hotspot };
    });
  }

  async publishScene(sceneId: string) {
    const scene = await this.prisma.virtualTourScene.findUnique({
      where: { id: sceneId },
      include: { outgoingHotspots: { where: { isActive: true } } },
    });

    if (!scene) {
      throw new NotFoundException('Virtual tour scene not found.');
    }
    if (
      !scene.originalUrl ||
      !scene.previewUrl ||
      !scene.tilesBaseUrl ||
      !scene.panoramaWidth
    ) {
      throw new ConflictException(
        'Upload a complete panorama before publishing this scene.',
      );
    }
    if (
      scene.outgoingHotspots.some(
        (hotspot) =>
          hotspot.type === VirtualTourHotspotType.NAVIGATION &&
          !hotspot.targetSceneId,
      )
    ) {
      throw new ConflictException(
        'Every active Navigation hotspot must have a target scene.',
      );
    }

    return this.updateSceneStatus(sceneId, VirtualTourSceneStatus.PUBLISHED);
  }

  setSceneHidden(sceneId: string) {
    return this.updateSceneStatus(sceneId, VirtualTourSceneStatus.HIDDEN);
  }

  setSceneDraft(sceneId: string) {
    return this.updateSceneStatus(sceneId, VirtualTourSceneStatus.DRAFT);
  }

  async deleteScene(sceneId: string) {
    const scene = await this.prisma.virtualTourScene.findUnique({
      where: { id: sceneId },
      include: {
        tour: { select: { startingSceneId: true } },
        _count: { select: { incomingHotspots: true } },
      },
    });

    if (!scene) {
      throw new NotFoundException('Virtual tour scene not found.');
    }

    if (scene.tour.startingSceneId === sceneId) {
      throw new ConflictException('The starting scene cannot be deleted.');
    }

    if (scene._count.incomingHotspots > 0) {
      throw new ConflictException(
        'Remove or redirect incoming Navigation hotspots before deleting this scene.',
      );
    }

    await this.prisma.virtualTourScene.delete({ where: { id: sceneId } });
    return { id: sceneId };
  }

  private ensureMainTour() {
    return this.prisma.virtualTour.upsert({
      where: { id: MAIN_VIRTUAL_TOUR_ID },
      create: { id: MAIN_VIRTUAL_TOUR_ID },
      update: {},
    });
  }

  private async getSceneById(sceneId: string) {
    const scene = await this.prisma.virtualTourScene.findUnique({
      where: { id: sceneId },
      select: { id: true, tourId: true },
    });

    if (!scene) {
      throw new NotFoundException('Virtual tour scene not found.');
    }

    return scene;
  }

  private async getHotspotById(
    hotspotId: string,
    type: VirtualTourHotspotType,
  ) {
    const hotspot = await this.prisma.virtualTourHotspot.findUnique({
      where: { id: hotspotId },
      select: {
        type: true,
        sourceSceneId: true,
        sourceScene: { select: { tourId: true } },
      },
    });

    if (!hotspot || hotspot.type !== type) {
      throw new NotFoundException('Virtual tour hotspot not found.');
    }

    return hotspot;
  }

  private async validateNavigationTarget(
    body: NavigationHotspotDto,
    tourId: string,
    sourceSceneId: string,
  ) {
    if (body.targetSceneId === sourceSceneId) {
      throw new BadRequestException('A scene cannot navigate to itself.');
    }

    this.validateArrivalView(body.targetYaw, body.targetPitch);

    const targetScene = await this.prisma.virtualTourScene.findUnique({
      where: { id: body.targetSceneId },
      select: { tourId: true },
    });

    if (!targetScene) {
      throw new NotFoundException('Target scene not found.');
    }
    if (targetScene.tourId !== tourId) {
      throw new BadRequestException(
        'Navigation hotspots can only target scenes in the same virtual tour.',
      );
    }
  }

  private toPublicScene(scene: PublicScene) {
    return {
      id: scene.id,
      name: scene.name,
      slug: scene.slug,
      panorama: {
        originalUrl: scene.originalUrl,
        previewUrl: scene.previewUrl,
        tilesBaseUrl: scene.tilesBaseUrl,
        width: scene.panoramaWidth,
        cols: scene.tileCols,
        rows: scene.tileRows,
      },
      initialPosition: {
        yaw: scene.initialYaw,
        pitch: scene.initialPitch,
      },
      hotspots: scene.outgoingHotspots
        .filter((hotspot) => this.isPublicHotspot(hotspot))
        .map((hotspot) => this.toPublicHotspot(hotspot)),
    };
  }

  private isPublicHotspot(hotspot: PublicHotspot) {
    return hotspot.type === VirtualTourHotspotType.INFORMATION
      ? Boolean(hotspot.infoTitle && hotspot.infoDescription)
      : hotspot.targetScene?.status === VirtualTourSceneStatus.PUBLISHED;
  }

  private toPublicHotspot(hotspot: PublicHotspot) {
    return {
      id: hotspot.id,
      type: hotspot.type,
      label: hotspot.label,
      yaw: hotspot.yaw,
      pitch: hotspot.pitch,
      targetSceneId: hotspot.targetSceneId,
      targetYaw: hotspot.targetYaw,
      targetPitch: hotspot.targetPitch,
      infoTitle: hotspot.infoTitle,
      infoDescription: hotspot.infoDescription,
      infoImageUrl: hotspot.infoImageUrl,
    };
  }

  private validateArrivalView(
    targetYaw?: number | null,
    targetPitch?: number | null,
  ) {
    if ((targetYaw != null) !== (targetPitch != null)) {
      throw new BadRequestException(
        'Arrival yaw and pitch must be provided together.',
      );
    }
  }

  private async updateSceneStatus(
    sceneId: string,
    status: VirtualTourSceneStatus,
  ) {
    await this.getSceneById(sceneId);

    return this.prisma.virtualTourScene.update({
      where: { id: sceneId },
      data: { status },
    });
  }

  private getSceneData(body: CreateVirtualTourSceneDto) {
    const slug =
      body.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') || 'scene';

    return {
      ...body,
      slug: `${slug}-${randomUUID().slice(0, 8)}`,
    };
  }
}
