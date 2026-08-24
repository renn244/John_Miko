import { BadRequestException, ConflictException } from '@nestjs/common';
import {
  VirtualTourHotspotType,
  VirtualTourSceneStatus,
} from 'src/generated/prisma/enums';
import { MAIN_VIRTUAL_TOUR_ID } from './virtual-tour.constants';
import { VirtualTourService } from './virtual-tour.service';

describe('VirtualTourService', () => {
  let prisma: any;
  let tx: any;
  let service: VirtualTourService;

  beforeEach(() => {
    tx = {
      virtualTour: { updateMany: jest.fn() },
      virtualTourScene: { create: jest.fn() },
      virtualTourHotspot: {
        create: jest.fn(),
      },
    };
    prisma = {
      virtualTour: {
        upsert: jest.fn().mockResolvedValue({ id: MAIN_VIRTUAL_TOUR_ID }),
        findUnique: jest.fn(),
      },
      virtualTourScene: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      virtualTourHotspot: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      $transaction: jest.fn(async (callback: any) => callback(tx)),
    };
    service = new VirtualTourService(prisma);
  });

  it('creates the only starting scene and assigns it atomically', async () => {
    tx.virtualTourScene.create.mockResolvedValue({ id: 'scene-start' });
    tx.virtualTour.updateMany.mockResolvedValue({ count: 1 });

    await expect(
      service.createStartingScene({ name: 'Entrance' }),
    ).resolves.toEqual({ id: 'scene-start' });

    expect(prisma.virtualTour.upsert).toHaveBeenCalledWith({
      where: { id: MAIN_VIRTUAL_TOUR_ID },
      create: { id: MAIN_VIRTUAL_TOUR_ID },
      update: {},
    });
    expect(tx.virtualTourScene.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        tourId: MAIN_VIRTUAL_TOUR_ID,
        name: 'Entrance',
      }),
    });
    expect(tx.virtualTour.updateMany).toHaveBeenCalledWith({
      where: { id: MAIN_VIRTUAL_TOUR_ID, startingSceneId: null },
      data: { startingSceneId: 'scene-start' },
    });
  });

  it('passes the complete scene update directly to Prisma', async () => {
    const body = { name: 'Pool Area', initialYaw: 1.2, initialPitch: 0.1 };
    prisma.virtualTourScene.findUnique.mockResolvedValue({
      id: 'scene-1',
      tourId: MAIN_VIRTUAL_TOUR_ID,
    });
    prisma.virtualTourScene.update.mockResolvedValue({
      id: 'scene-1',
      ...body,
    });

    await expect(service.updateScene('scene-1', body)).resolves.toEqual({
      id: 'scene-1',
      ...body,
    });
    expect(prisma.virtualTourScene.update).toHaveBeenCalledWith({
      where: { id: 'scene-1' },
      data: body,
    });
  });

  it('passes the complete hotspot update directly to Prisma', async () => {
    const body = {
      label: 'Reception',
      icon: null,
      yaw: 0.5,
      pitch: 0.1,
      infoTitle: 'Reception',
      infoDescription: 'Guest assistance desk',
      infoImageUrl: null,
      isActive: true,
    };
    prisma.virtualTourHotspot.findUnique.mockResolvedValue({
      type: VirtualTourHotspotType.INFORMATION,
      sourceSceneId: 'scene-1',
      sourceScene: { tourId: MAIN_VIRTUAL_TOUR_ID },
    });
    prisma.virtualTourHotspot.update.mockResolvedValue({
      id: 'hotspot-1',
      ...body,
    });

    await expect(
      service.updateInformationHotspot('hotspot-1', body),
    ).resolves.toEqual({ id: 'hotspot-1', ...body });
    expect(prisma.virtualTourHotspot.update).toHaveBeenCalledWith({
      where: { id: 'hotspot-1' },
      data: body,
    });
  });

  it('rejects a second starting scene', async () => {
    tx.virtualTourScene.create.mockResolvedValue({ id: 'scene-extra' });
    tx.virtualTour.updateMany.mockResolvedValue({ count: 0 });

    await expect(
      service.createStartingScene({ name: 'Another entrance' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('creates an Information hotspot from its dedicated DTO', async () => {
    prisma.virtualTourScene.findUnique.mockResolvedValue({
      id: 'scene-1',
      tourId: MAIN_VIRTUAL_TOUR_ID,
    });
    prisma.virtualTourHotspot.create.mockResolvedValue({ id: 'hotspot-1' });

    await expect(
      service.createInformationHotspot('scene-1', {
        label: 'Reception',
        yaw: 0,
        pitch: 0,
        infoTitle: 'Reception',
        infoDescription: 'Guest assistance desk',
        isActive: true,
      }),
    ).resolves.toEqual({ id: 'hotspot-1' });
    expect(prisma.virtualTourHotspot.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        sourceSceneId: 'scene-1',
        type: VirtualTourHotspotType.INFORMATION,
      }),
    });
  });

  it('prevents Navigation hotspots from targeting another tour', async () => {
    prisma.virtualTourScene.findUnique
      .mockResolvedValueOnce({ id: 'scene-1', tourId: MAIN_VIRTUAL_TOUR_ID })
      .mockResolvedValueOnce({ tourId: 'another-tour' });

    await expect(
      service.createNavigationHotspot('scene-1', {
        label: 'Go elsewhere',
        yaw: 0,
        pitch: 0,
        targetSceneId: 'foreign-scene',
        isActive: true,
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('creates a Navigation hotspot and connected scene in one transaction', async () => {
    prisma.virtualTourScene.findUnique.mockResolvedValue({
      id: 'scene-1',
      tourId: MAIN_VIRTUAL_TOUR_ID,
    });
    tx.virtualTourScene.create.mockResolvedValue({ id: 'scene-2' });
    tx.virtualTourHotspot.create.mockResolvedValue({
      id: 'hotspot-1',
      targetSceneId: 'scene-2',
      targetYaw: 1.2,
      targetPitch: 0.1,
      isActive: false,
    });

    await expect(
      service.createConnectedScene('scene-1', {
        hotspot: {
          label: 'Go to pool',
          yaw: 0.8,
          pitch: -0.1,
          targetYaw: 1.2,
          targetPitch: 0.1,
          isActive: false,
        },
        scene: { name: 'Pool Area' },
      }),
    ).resolves.toEqual({
      scene: { id: 'scene-2' },
      hotspot: {
        id: 'hotspot-1',
        targetSceneId: 'scene-2',
        targetYaw: 1.2,
        targetPitch: 0.1,
        isActive: false,
      },
    });

    expect(tx.virtualTourHotspot.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        sourceSceneId: 'scene-1',
        type: VirtualTourHotspotType.NAVIGATION,
        targetSceneId: 'scene-2',
        targetYaw: 1.2,
        targetPitch: 0.1,
        isActive: false,
      }),
    });
  });

  it('requires both optional arrival-view coordinates together', async () => {
    prisma.virtualTourScene.findUnique.mockResolvedValue({
      id: 'scene-1',
      tourId: MAIN_VIRTUAL_TOUR_ID,
    });

    await expect(
      service.createConnectedScene('scene-1', {
        hotspot: {
          label: 'Go to pool',
          yaw: 0.8,
          pitch: -0.1,
          targetYaw: 1.2,
          isActive: true,
        },
        scene: { name: 'Pool Area' },
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('blocks publishing when an active Navigation hotspot is incomplete', async () => {
    prisma.virtualTourScene.findUnique.mockResolvedValue({
      id: 'scene-1',
      originalUrl: '/original.jpg',
      previewUrl: '/preview.webp',
      tilesBaseUrl: '/tiles',
      panoramaWidth: 8192,
      outgoingHotspots: [
        {
          type: VirtualTourHotspotType.NAVIGATION,
          targetSceneId: null,
        },
      ],
    });

    await expect(service.publishScene('scene-1')).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('blocks publishing when the panorama package is incomplete', async () => {
    prisma.virtualTourScene.findUnique.mockResolvedValue({
      id: 'scene-1',
      originalUrl: '/original.jpg',
      previewUrl: '/preview.webp',
      tilesBaseUrl: null,
      panoramaWidth: 8192,
      outgoingHotspots: [],
    });

    await expect(service.publishScene('scene-1')).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('publishes a scene with a complete panorama and valid hotspots', async () => {
    prisma.virtualTourScene.findUnique
      .mockResolvedValueOnce({
        id: 'scene-1',
        originalUrl: '/original.jpg',
        previewUrl: '/preview.webp',
        tilesBaseUrl: '/tiles',
        panoramaWidth: 8192,
        outgoingHotspots: [
          {
            type: VirtualTourHotspotType.NAVIGATION,
            targetSceneId: 'scene-2',
          },
        ],
      })
      .mockResolvedValueOnce({ id: 'scene-1', tourId: MAIN_VIRTUAL_TOUR_ID });
    prisma.virtualTourScene.update.mockResolvedValue({
      id: 'scene-1',
      status: VirtualTourSceneStatus.PUBLISHED,
    });

    await expect(service.publishScene('scene-1')).resolves.toEqual({
      id: 'scene-1',
      status: VirtualTourSceneStatus.PUBLISHED,
    });
  });

  it('blocks deleting the starting scene or a referenced scene', async () => {
    prisma.virtualTourScene.findUnique
      .mockResolvedValueOnce({
        id: 'start',
        tour: { startingSceneId: 'start' },
        _count: { incomingHotspots: 0 },
      })
      .mockResolvedValueOnce({
        id: 'target',
        tour: { startingSceneId: 'start' },
        _count: { incomingHotspots: 2 },
      });

    await expect(service.deleteScene('start')).rejects.toBeInstanceOf(
      ConflictException,
    );
    await expect(service.deleteScene('target')).rejects.toBeInstanceOf(
      ConflictException,
    );
  });

  it('returns only published scenes and valid public hotspots', async () => {
    prisma.virtualTour.findUnique.mockResolvedValue({
      startingScene: {
        id: 'scene-1',
        status: VirtualTourSceneStatus.PUBLISHED,
      },
    });
    prisma.virtualTourScene.findMany.mockResolvedValue([
      {
        id: 'scene-1',
        name: 'Entrance',
        slug: 'entrance',
        originalUrl: null,
        previewUrl: '/preview.jpg',
        tilesBaseUrl: '/tiles',
        panoramaWidth: 4096,
        tileCols: 8,
        tileRows: 4,
        initialYaw: 0,
        initialPitch: 0,
        outgoingHotspots: [
          {
            id: 'published-target',
            type: VirtualTourHotspotType.NAVIGATION,
            targetSceneId: 'scene-2',
            targetScene: {
              id: 'scene-2',
              status: VirtualTourSceneStatus.PUBLISHED,
            },
          },
          {
            id: 'draft-target',
            type: VirtualTourHotspotType.NAVIGATION,
            targetSceneId: 'scene-3',
            targetScene: {
              id: 'scene-3',
              status: VirtualTourSceneStatus.DRAFT,
            },
          },
          {
            id: 'valid-info',
            type: VirtualTourHotspotType.INFORMATION,
            infoTitle: 'Reception',
            infoDescription: 'Check in here.',
            targetScene: null,
          },
          {
            id: 'invalid-info',
            type: VirtualTourHotspotType.INFORMATION,
            infoTitle: null,
            infoDescription: null,
            targetScene: null,
          },
        ],
      },
    ]);

    const result = await service.getPublicTour();

    expect(result.available).toBe(true);
    expect(result.scenes[0].hotspots.map((item: any) => item.id)).toEqual([
      'published-target',
      'valid-info',
    ]);
    expect(result.scenes[0].hotspots[0]).not.toHaveProperty('targetScene');
  });
});
