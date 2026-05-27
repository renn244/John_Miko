import { Test, TestingModule } from '@nestjs/testing';
import { ClosureController } from './closure.controller';

describe('ClosureController', () => {
  let controller: ClosureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClosureController],
    }).compile();

    controller = module.get<ClosureController>(ClosureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
