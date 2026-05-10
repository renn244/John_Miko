import { Test, TestingModule } from '@nestjs/testing';
import { GuestManagementService } from './guest-management.service';

describe('GuestManagementService', () => {
  let service: GuestManagementService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GuestManagementService],
    }).compile();

    service = module.get<GuestManagementService>(GuestManagementService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
