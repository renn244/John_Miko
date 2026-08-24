import { VirtualTourController } from './virtual-tour.controller';

describe('VirtualTourController', () => {
  it('delegates the public tour response', async () => {
    const response = {
      available: false,
      startingSceneId: null,
      scenes: [],
    };
    const service = { getPublicTour: jest.fn().mockResolvedValue(response) };
    const controller = new VirtualTourController(service as never);

    await expect(controller.getPublicTour()).resolves.toEqual(response);
    expect(service.getPublicTour).toHaveBeenCalledTimes(1);
  });
});
