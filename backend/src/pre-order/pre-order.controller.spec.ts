import { Test, TestingModule } from '@nestjs/testing';
import { PreOrderController } from './pre-order.controller';

describe('PreOrderController', () => {
  let controller: PreOrderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PreOrderController],
    }).compile();

    controller = module.get<PreOrderController>(PreOrderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
