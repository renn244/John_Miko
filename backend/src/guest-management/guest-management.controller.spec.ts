import { Test, TestingModule } from '@nestjs/testing';
import { GuestManagementController } from './guest-management.controller';

describe('GuestManagementController', () => {
  let controller: GuestManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GuestManagementController],
    }).compile();

    controller = module.get<GuestManagementController>(GuestManagementController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
