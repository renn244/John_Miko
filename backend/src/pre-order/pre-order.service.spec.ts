import { Test, TestingModule } from '@nestjs/testing';
import { PreOrderService } from './pre-order.service';

describe('PreOrderService', () => {
  let service: PreOrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PreOrderService],
    }).compile();

    service = module.get<PreOrderService>(PreOrderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
