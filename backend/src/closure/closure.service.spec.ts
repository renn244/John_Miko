import { Test, TestingModule } from '@nestjs/testing';
import { ClosureService } from './closure.service';

describe('ClosureService', () => {
  let service: ClosureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ClosureService],
    }).compile();

    service = module.get<ClosureService>(ClosureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
