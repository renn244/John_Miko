import { Role } from 'src/generated/prisma/enums';
import { ROLES_KEY } from 'src/lib/decorators/Roles.decorator';
import { VirtualTourAdminController } from './virtual-tour-admin.controller';

describe('VirtualTourAdminController', () => {
  const service = {
    getAdminTour: jest.fn(),
    createStartingScene: jest.fn(),
    createNavigationHotspot: jest.fn(),
    createInformationHotspot: jest.fn(),
    createConnectedScene: jest.fn(),
    publishScene: jest.fn(),
  };
  const panoramaService = {
    uploadPanorama: jest.fn(),
  };
  const controller = new VirtualTourAdminController(
    service as never,
    panoramaService as never,
  );

  beforeEach(() => jest.clearAllMocks());

  it('requires the ADMIN role for every management endpoint', () => {
    expect(Reflect.getMetadata(ROLES_KEY, VirtualTourAdminController)).toEqual([
      Role.ADMIN,
    ]);
  });

  it('delegates each hotspot type to its dedicated service method', async () => {
    const navigation = {
      label: 'Go to pool',
      yaw: 0.8,
      pitch: -0.1,
      targetSceneId: 'scene-2',
      isActive: true,
    };
    const information = {
      label: 'Reception',
      yaw: 0.2,
      pitch: 0.1,
      infoTitle: 'Reception',
      infoDescription: 'Guest assistance desk',
      isActive: true,
    };

    await controller.createNavigationHotspot('scene-1', navigation);
    await controller.createInformationHotspot('scene-1', information);

    expect(service.createNavigationHotspot).toHaveBeenCalledWith(
      'scene-1',
      navigation,
    );
    expect(service.createInformationHotspot).toHaveBeenCalledWith(
      'scene-1',
      information,
    );
  });

  it('delegates the starting-scene and connected-scene workflows', async () => {
    const startingScene = { name: 'Entrance' };
    const connectedScene = {
      hotspot: {
        label: 'Go to pool',
        yaw: 0.8,
        pitch: -0.1,
        isActive: true,
      },
      scene: { name: 'Pool Area' },
    };

    await controller.createStartingScene(startingScene);
    await controller.createConnectedScene('scene-1', connectedScene);

    expect(service.createStartingScene).toHaveBeenCalledWith(startingScene);
    expect(service.createConnectedScene).toHaveBeenCalledWith(
      'scene-1',
      connectedScene,
    );
  });

  it('delegates a validated panorama upload', async () => {
    const upload = {
      panorama: { path: 'panorama.jpg' },
      panoramaWidth: 8192,
      originalExtension: 'jpg',
    };

    await controller.uploadPanorama('scene-1', upload as never);

    expect(panoramaService.uploadPanorama).toHaveBeenCalledWith(
      'scene-1',
      upload,
    );
  });
});
